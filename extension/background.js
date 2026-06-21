importScripts("signatures.fallback.js");

const DEFAULT_BACKEND_URL = "http://127.0.0.1:5050";
const MAX_EVIDENCE_PER_VENDOR = 8;
const MAX_BEHAVIOR_EVENTS = 20;
let signatures = FALLBACK_SIGNATURES;

chrome.runtime.onInstalled.addListener(async () => {
	const existing = await chrome.storage.local.get(["settings", "detections"]);

	if (!existing.settings)
	{
		await chrome.storage.local.set({ settings: { backendUrl: DEFAULT_BACKEND_URL, useBackend: true } });
	}

	if (!existing.detections)
	{
		await chrome.storage.local.set({ detections: {} });
	}

	await refreshSignatures();
});

chrome.runtime.onStartup.addListener(refreshSignatures);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "getReport")
	{
		getReport(message.tabId).then(sendResponse);
		return true;
	}

	if (message.type === "refreshSignatures")
	{
		refreshSignatures().then(sendResponse);
		return true;
	}
	
	if (message.type === "clearTab")
	{
		clearTab(message.tabId).then(sendResponse);
		return true;
	}
	
	if (message.type === "saveSettings")
	{
		chrome.storage.local.set({ settings: message.settings }).then(() => refreshSignatures().then(sendResponse));
		return true;
	}
	
	if (message.type === "getSettings")
	{
		chrome.storage.local.get("settings").then((data) => sendResponse(data.settings || { backendUrl: DEFAULT_BACKEND_URL, useBackend: true }));
		return true;
	}

	if (message.type === "behaviorSignal")
	{
		recordBehaviorSignal(sender.tab, message.detection).then(sendResponse);
		return true;
	}
	
	return false;
});

chrome.webRequest.onCompleted.addListener(
	(details) => {
		inspectRequest(details);
	},
	{ urls: ["<all_urls>"] },
	["responseHeaders"]
);

async function refreshSignatures() {
	const { settings } = await chrome.storage.local.get("settings");
	const resolved = settings || { backendUrl: DEFAULT_BACKEND_URL, useBackend: true };
	
	if (!resolved.useBackend)
	{
		signatures = FALLBACK_SIGNATURES;
		return { ok: true, source: "fallback", count: signatures.length };
	}

	try {
		const response = await fetch(`${resolved.backendUrl.replace(/\/$/, "")}/api/signatures`, { cache: "no-store" });
		if (!response.ok) throw new Error(`Backend returned ${response.status}`);
	
		const body = await response.json();
		signatures = Array.isArray(body.signatures) && body.signatures.length ? body.signatures : FALLBACK_SIGNATURES;
	
		await chrome.storage.local.set({ signatureMeta: { source: "backend", count: signatures.length, updatedAt: body.updatedAt } });
		return { ok: true, source: "backend", count: signatures.length };
	} catch (error) {
		signatures = FALLBACK_SIGNATURES;

		await chrome.storage.local.set({ signatureMeta: { source: "fallback", count: signatures.length, error: error.message } });

		return { ok: false, source: "fallback", count: signatures.length, error: error.message };
	}
}

async function inspectRequest(details) {
	if (details.tabId < 0) return;

	const matchingSignatures = signatures.filter((signature) => matches(details, signature));
	if (!matchingSignatures.length) return;

	const { detections = {} } = await chrome.storage.local.get("detections");
	const tabKey = String(details.tabId);
	const tabDetections = detections[tabKey] || { firstSeen: new Date().toISOString(), vendors: {}, behaviors: [] };
	tabDetections.vendors ||= {};
	tabDetections.behaviors ||= [];

	for (const signature of matchingSignatures)
	{
		const vendor = signature.vendor;
		const vendorRecord = tabDetections.vendors[vendor.slug] || {
			vendor,
			firstSeen: new Date().toISOString(),
			lastSeen: null,
			count: 0,
			confidence: signature.confidence,
			evidence: []
		};

		vendorRecord.lastSeen = new Date().toISOString();
		vendorRecord.count += 1;
		vendorRecord.confidence = strongestConfidence(vendorRecord.confidence, signature.confidence);
		vendorRecord.evidence.unshift({
			label: signature.evidenceLabel,
			url: redactUrl(details.url),
			method: details.method,
			resourceType: details.type,
			time: new Date(details.timeStamp).toISOString()
		});
		vendorRecord.evidence = vendorRecord.evidence.slice(0, MAX_EVIDENCE_PER_VENDOR);

		tabDetections.vendors[vendor.slug] = vendorRecord;
	}

	detections[tabKey] = tabDetections;
	await chrome.storage.local.set({ detections });

	chrome.action.setBadgeText({ 
		tabId: details.tabId, 
		text: String(detectionCount(tabDetections))
	}).catch((err) => console.log("Badge update skipped. Tab probably closed.", err.message));

	chrome.action.setBadgeBackgroundColor({ 
		tabId: details.tabId, 
		color: "#B42318" 
	}).catch((err) => {/* Ignore */});
}

async function recordBehaviorSignal(tab, detection) {
	if (!tab || tab.id < 0 || !detection) return { ok: false };

	const { detections = {} } = await chrome.storage.local.get("detections");
	const tabKey = String(tab.id);
	const tabDetections = detections[tabKey] || { firstSeen: new Date().toISOString(), vendors: {}, behaviors: [] };
	tabDetections.vendors ||= {};
	tabDetections.behaviors ||= [];

	if (isDuplicateBehavior(tabDetections.behaviors, detection))
	{
		return { ok: true, duplicate: true };
	}

	tabDetections.behaviors.unshift({
		id: crypto.randomUUID(),
		...detection,
		report: behaviorReport(detection)
	});
	tabDetections.behaviors = tabDetections.behaviors.slice(0, MAX_BEHAVIOR_EVENTS);
	detections[tabKey] = tabDetections;
	await chrome.storage.local.set({ detections });

	chrome.action.setBadgeText({
		tabId: tab.id,
		text: String(detectionCount(tabDetections))
	}).catch(() => {});
	chrome.action.setBadgeBackgroundColor({
		tabId: tab.id,
		color: detection.severity === "high" ? "#B42318" : "#B7791F"
	}).catch(() => {});

	return { ok: true };
}

function matches(details, signature) {
	let parsed;
	try {
		parsed = new URL(details.url);
	} catch {
		return false;
	}

	const pattern = String(signature.pattern || "").toLowerCase();
	const url = details.url.toLowerCase();
	const host = parsed.hostname.toLowerCase();
	const path = parsed.pathname.toLowerCase();
	const headers = (details.responseHeaders || []).map((header) => ({
		name: String(header.name || "").toLowerCase(),
		value: String(header.value || "").toLowerCase()
	}));

	switch (signature.type) {
		case "domain":
		return host === pattern || host.endsWith(`.${pattern}`);
		case "url_substring":
		return url.includes(pattern);
		case "path_substring":
		return path.includes(pattern);
		case "header_name":
		return headers.some((header) => header.name === pattern);
		case "header_value":
		return headers.some((header) => header.value.includes(pattern));
		case "query_param":
		return parsed.searchParams.has(String(signature.pattern || ""));
		case "pixel":
		return url.includes(pattern) && ["image", "ping", "beacon"].includes(details.type);
		default:
		return false;
	}
}

async function getReport(tabId) {
	const { detections = {}, signatureMeta = { source: "fallback", count: signatures.length } } = await chrome.storage.local.get(["detections", "signatureMeta"]);
	const tabDetections = detections[String(tabId)] || { vendors: {} };
	const vendors = Object.values(tabDetections.vendors || {});
	const behaviors = tabDetections.behaviors || [];
	
	return {
		vendors,
		behaviors,
		summary: vendors.map(toPlainEnglish),
		signatureMeta
	};
}

async function clearTab(tabId) {
	const { detections = {} } = await chrome.storage.local.get("detections");
	delete detections[String(tabId)];
	await chrome.storage.local.set({ detections });

	await chrome.action.setBadgeText({ tabId, text: "" }).catch(() => {});
	return { ok: true };
}

function toPlainEnglish(record) {
	const data = humanList(record.vendor.dataCollected || []);
	return `Your employer appears to be using ${record.vendor.name}, which can collect ${data}.`;
}

function behaviorReport(detection) {
	if (detection.kind === "screen_capture_request")
	{
		return detection.userActivation
			? "This page requested screen sharing after a recent user action. That can expose visible windows, tabs, or the entire screen if permission is granted."
			: "This page requested screen sharing without a visible user action. That can expose visible windows, tabs, or the entire screen if permission is granted.";
	}

	if (detection.kind === "global_keyboard_listener")
	{
		return `This page attached a global ${detection.eventType || "keyboard"} listener. Global keyboard listeners can observe typed keys and shortcuts while the page is focused.`;
	}

	return "This page used a sensitive browser feature that may expose private activity.";
}

function isDuplicateBehavior(existing, detection) {
	return existing.some((item) => {
		if (item.kind !== detection.kind) return false;
		if (item.eventType !== detection.eventType) return false;
		if (item.target !== detection.target) return false;
		if (item.callSite !== detection.callSite) return false;

		const itemTime = Date.parse(item.time);
		const detectionTime = Date.parse(detection.time);
		return Number.isFinite(itemTime) && Number.isFinite(detectionTime) && Math.abs(itemTime - detectionTime) < 5000;
	});
}

function detectionCount(tabDetections) {
	return Object.keys(tabDetections.vendors || {}).length + (tabDetections.behaviors || []).length;
}

function humanList(items) {
	if (!items.length) return "activity data";
	if (items.length === 1) return items[0];
	return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

function strongestConfidence(left, right) {
	const rank = { low: 1, medium: 2, high: 3 };
	return rank[right] > rank[left] ? right : left;
}

function redactUrl(url) {
	try {
		const parsed = new URL(url);
		parsed.username = "";
		parsed.password = "";
		parsed.search = parsed.search ? "?..." : "";
		parsed.hash = "";
		return parsed.toString();
	} catch {
		return url;
	}
}
