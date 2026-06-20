USE workwatch;

INSERT INTO vendors (slug, name, category, description, data_collected, reference_url)
VALUES
  ('teramind', 'Teramind', 'employee_monitoring', 'Employee monitoring and user activity analytics platform.', JSON_ARRAY('app and website usage', 'screenshots or screen activity', 'keystroke/activity signals', 'user behavior analytics'), 'https://www.teramind.co/'),
  ('activtrak', 'ActivTrak', 'employee_monitoring', 'Workforce analytics and productivity monitoring platform.', JSON_ARRAY('app and website usage', 'productivity classifications', 'activity patterns', 'team analytics'), 'https://www.activtrak.com/'),
  ('time-doctor', 'Time Doctor', 'productivity_tracking', 'Time tracking and productivity analytics service.', JSON_ARRAY('time worked', 'app and website usage', 'screenshots if enabled', 'task/project activity'), 'https://www.timedoctor.com/'),
  ('hubstaff', 'Hubstaff', 'productivity_tracking', 'Time tracking and workforce management platform.', JSON_ARRAY('time worked', 'activity levels', 'app and URL usage', 'screenshots if enabled', 'location if enabled'), 'https://hubstaff.com/'),
  ('insightful', 'Insightful', 'employee_monitoring', 'Workforce analytics and employee monitoring platform formerly known as Workpuls.', JSON_ARRAY('computer activity', 'app and website usage', 'productivity analytics', 'screenshots if enabled'), 'https://www.insightful.io/'),
  ('veriato', 'Veriato', 'employee_monitoring', 'Employee monitoring and insider risk platform.', JSON_ARRAY('user activity', 'application usage', 'web activity', 'behavior alerts'), 'https://www.veriato.com/'),
  ('onfido', 'Onfido', 'identity_verification', 'Identity verification service used for document and biometric checks.', JSON_ARRAY('identity document data', 'selfie or biometric checks', 'verification status', 'fraud risk signals'), 'https://onfido.com/'),
  ('persona', 'Persona', 'identity_verification', 'Identity verification and compliance service.', JSON_ARRAY('identity document data', 'selfie checks', 'verification workflow events', 'risk signals'), 'https://withpersona.com/'),
  ('jumio', 'Jumio', 'identity_verification', 'Identity verification and eKYC service.', JSON_ARRAY('identity document data', 'biometric/selfie checks', 'verification status', 'risk signals'), 'https://www.jumio.com/'),
  ('socure', 'Socure', 'identity_verification', 'Digital identity verification and fraud risk service.', JSON_ARRAY('identity attributes', 'device and risk signals', 'verification decisions', 'fraud scores'), 'https://www.socure.com/')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  description = VALUES(description),
  data_collected = VALUES(data_collected),
  reference_url = VALUES(reference_url);

INSERT INTO signatures (vendor_id, signature_type, pattern, confidence, evidence_label)
SELECT id, 'domain', 'teramind.co', 'high', 'request to a Teramind domain' FROM vendors WHERE slug = 'teramind'
UNION ALL SELECT id, 'domain', 'teramindapp.com', 'high', 'request to a Teramind application domain' FROM vendors WHERE slug = 'teramind'
UNION ALL SELECT id, 'domain', 'activtrak.com', 'high', 'request to an ActivTrak domain' FROM vendors WHERE slug = 'activtrak'
UNION ALL SELECT id, 'url_substring', 'activtrak', 'medium', 'URL contains ActivTrak marker' FROM vendors WHERE slug = 'activtrak'
UNION ALL SELECT id, 'domain', 'timedoctor.com', 'high', 'request to a Time Doctor domain' FROM vendors WHERE slug = 'time-doctor'
UNION ALL SELECT id, 'domain', 'hubstaff.com', 'high', 'request to a Hubstaff domain' FROM vendors WHERE slug = 'hubstaff'
UNION ALL SELECT id, 'domain', 'insightful.io', 'high', 'request to an Insightful domain' FROM vendors WHERE slug = 'insightful'
UNION ALL SELECT id, 'domain', 'workpuls.com', 'high', 'request to legacy Workpuls domain' FROM vendors WHERE slug = 'insightful'
UNION ALL SELECT id, 'domain', 'veriato.com', 'high', 'request to a Veriato domain' FROM vendors WHERE slug = 'veriato'
UNION ALL SELECT id, 'domain', 'onfido.com', 'high', 'request to an Onfido domain' FROM vendors WHERE slug = 'onfido'
UNION ALL SELECT id, 'domain', 'onfidoapi.com', 'high', 'request to an Onfido API domain' FROM vendors WHERE slug = 'onfido'
UNION ALL SELECT id, 'domain', 'withpersona.com', 'high', 'request to a Persona domain' FROM vendors WHERE slug = 'persona'
UNION ALL SELECT id, 'domain', 'persona.com', 'medium', 'request to a Persona-related domain' FROM vendors WHERE slug = 'persona'
UNION ALL SELECT id, 'domain', 'jumio.com', 'high', 'request to a Jumio domain' FROM vendors WHERE slug = 'jumio'
UNION ALL SELECT id, 'domain', 'netverify.com', 'high', 'request to a Jumio Netverify domain' FROM vendors WHERE slug = 'jumio'
UNION ALL SELECT id, 'domain', 'socure.com', 'high', 'request to a Socure domain' FROM vendors WHERE slug = 'socure'
UNION ALL SELECT id, 'url_substring', '/pixel', 'low', 'tracking pixel-like endpoint path' FROM vendors WHERE slug = 'activtrak'
ON DUPLICATE KEY UPDATE
  confidence = VALUES(confidence),
  evidence_label = VALUES(evidence_label),
  is_active = TRUE;
