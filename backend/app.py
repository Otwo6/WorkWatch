import json
import os
from datetime import datetime, timezone
from urllib.parse import urlparse

from flask import Flask, jsonify, request
from flask_cors import CORS

from db import connection, parse_json


app = Flask(__name__)
cors_origins = os.getenv("CORS_ORIGINS", "*")
CORS(app, resources={r"/*": {"origins": "*" if cors_origins == "*" else cors_origins.split(",")}})


def row_to_signature(row):
	return {
		"id": row["id"],
		"vendor": {
			"slug": row["slug"],
			"name": row["name"],
			"category": row["category"],
			"description": row["description"],
			"dataCollected": parse_json(row["data_collected"]),
			"referenceUrl": row["reference_url"],
		},
		"type": row["signature_type"],
		"pattern": row["pattern"],
		"confidence": row["confidence"],
		"evidenceLabel": row["evidence_label"],
	}


def fetch_signatures(active_only=True):
	query = """
		SELECT
		s.id,
		s.signature_type,
		s.pattern,
		s.confidence,
		s.evidence_label,
		v.slug,
		v.name,
		v.category,
		v.description,
		v.data_collected,
		v.reference_url
		FROM signatures s
		JOIN vendors v ON v.id = s.vendor_id
	"""
	params = []
	if active_only:
		query += " WHERE s.is_active = %s"
		params.append(True)
	query += " ORDER BY v.name, s.signature_type, s.pattern"

	with connection() as conn:
		cursor = conn.cursor(dictionary=True)
		cursor.execute(query, params)
		rows = cursor.fetchall()
	return [row_to_signature(row) for row in rows]


def request_matches_signature(candidate, signature):
	parsed = urlparse(candidate.get("url", ""))
	host = parsed.netloc.lower()
	path = parsed.path.lower()
	url = candidate.get("url", "").lower()
	pattern = signature["pattern"].lower()
	headers = {h.get("name", "").lower(): h.get("value", "").lower() for h in candidate.get("headers", [])}

	sig_type = signature["type"]
	if sig_type == "domain":
		return host == pattern or host.endswith(f".{pattern}")
	if sig_type == "url_substring":
		return pattern in url
	if sig_type == "path_substring":
		return pattern in path
	if sig_type == "header_name":
		return pattern in headers
	if sig_type == "header_value":
		return any(pattern in value for value in headers.values())
	if sig_type == "query_param":
		return f"{pattern}=" in parsed.query.lower()
	if sig_type == "pixel":
		return pattern in url and candidate.get("resourceType") in {"image", "ping", "beacon"}
	return False


@app.get("/health")
def health():
	return jsonify({"ok": True, "time": datetime.now(timezone.utc).isoformat()})


@app.get("/api/signatures")
def list_signatures():
	return jsonify({"signatures": fetch_signatures(), "updatedAt": datetime.now(timezone.utc).isoformat()})


@app.post("/api/signatures")
def create_signature():
	payload = request.get_json(force=True)
	required = ["vendorSlug", "type", "pattern", "evidenceLabel"]
	missing = [key for key in required if not payload.get(key)]
	if missing:
		return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

	with connection() as conn:
		cursor = conn.cursor(dictionary=True)
		cursor.execute("SELECT id FROM vendors WHERE slug = %s", (payload["vendorSlug"],))
		vendor = cursor.fetchone()
		if not vendor:
			return jsonify({"error": "Unknown vendorSlug"}), 404
		cursor.execute(
			"""
			INSERT INTO signatures (vendor_id, signature_type, pattern, confidence, evidence_label, is_active)
			VALUES (%s, %s, %s, %s, %s, %s)
			""",
			(
				vendor["id"],
				payload["type"],
				payload["pattern"],
				payload.get("confidence", "medium"),
				payload["evidenceLabel"],
				payload.get("isActive", True),
			),
		)
		new_id = cursor.lastrowid
	return jsonify({"id": new_id}), 201


@app.post("/api/vendors")
def upsert_vendor():
	payload = request.get_json(force=True)
	required = ["slug", "name", "category", "description", "dataCollected"]
	missing = [key for key in required if not payload.get(key)]
	if missing:
		return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

	with connection() as conn:
		cursor = conn.cursor()
		cursor.execute(
			"""
			INSERT INTO vendors (slug, name, category, description, data_collected, reference_url)
			VALUES (%s, %s, %s, %s, %s, %s)
			ON DUPLICATE KEY UPDATE
			name = VALUES(name),
			category = VALUES(category),
			description = VALUES(description),
			data_collected = VALUES(data_collected),
			reference_url = VALUES(reference_url)
			""",
			(
				payload["slug"],
				payload["name"],
				payload["category"],
				payload["description"],
				json.dumps(payload["dataCollected"]),
				payload.get("referenceUrl"),
			),
		)
	return jsonify({"ok": True})


@app.post("/api/scan")
def scan_requests():
	payload = request.get_json(force=True)
	requests_to_scan = payload.get("requests", [])
	signatures = fetch_signatures()
	matches = []
	for candidate in requests_to_scan:
		for signature in signatures:
			if request_matches_signature(candidate, signature):
				matches.append({"request": candidate, "signature": signature})
	return jsonify({"matches": matches})


if __name__ == "__main__":
	app.run(
		host=os.getenv("FLASK_HOST", "127.0.0.1"),
		port=int(os.getenv("FLASK_PORT", "5050")),
		debug=os.getenv("FLASK_DEBUG", "false").lower() == "true",
	)
