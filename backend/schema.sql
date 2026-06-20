CREATE DATABASE IF NOT EXISTS workwatch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE workwatch;

CREATE TABLE IF NOT EXISTS vendors (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug VARCHAR(120) NOT NULL,
  name VARCHAR(180) NOT NULL,
  category ENUM('employee_monitoring','productivity_tracking','identity_verification') NOT NULL,
  description TEXT NOT NULL,
  data_collected JSON NOT NULL,
  reference_url VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_vendors_slug (slug)
);

CREATE TABLE IF NOT EXISTS signatures (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  vendor_id BIGINT UNSIGNED NOT NULL,
  signature_type ENUM('domain','url_substring','path_substring','header_name','header_value','query_param','pixel') NOT NULL,
  pattern VARCHAR(500) NOT NULL,
  confidence ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  evidence_label VARCHAR(240) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_signatures_active_type (is_active, signature_type),
  KEY idx_signatures_vendor (vendor_id),
  UNIQUE KEY uq_signatures_vendor_type_pattern (vendor_id, signature_type, pattern),
  CONSTRAINT fk_signatures_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);
