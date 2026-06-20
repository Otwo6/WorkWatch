import json
import os
from contextlib import contextmanager

import mysql.connector
from dotenv import load_dotenv

load_dotenv()


def _config():
	return {
		"host": os.getenv("MYSQL_HOST", "127.0.0.1"),
		"port": int(os.getenv("MYSQL_PORT", "3306")),
		"user": os.getenv("MYSQL_USER", "workwatch"),
		"password": os.getenv("MYSQL_PASSWORD", ""),
		"database": os.getenv("MYSQL_DATABASE", "workwatch"),
	}


@contextmanager
def connection():
	conn = mysql.connector.connect(**_config())
	try:
		yield conn
		conn.commit()
	except Exception:
		conn.rollback()
		raise
	finally:
		conn.close()


def parse_json(value):
	if isinstance(value, (list, dict)):
		return value
	if value is None:
		return []
	return json.loads(value)
