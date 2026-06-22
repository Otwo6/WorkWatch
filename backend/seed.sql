USE workwatch;

-- =========================================================================
-- VENDORS
-- =========================================================================

INSERT INTO vendors (slug, name, category, description, data_collected, reference_url)
VALUES
  -- ---------- employee monitoring ("bossware") ----------
  ('teramind', 'Teramind', 'employee_monitoring', 'Employee monitoring and user activity analytics platform.', JSON_ARRAY('app and website usage', 'screenshots or screen activity', 'keystroke/activity signals', 'user behavior analytics'), 'https://www.teramind.co/'),
  ('activtrak', 'ActivTrak', 'employee_monitoring', 'Workforce analytics and productivity monitoring platform.', JSON_ARRAY('app and website usage', 'productivity classifications', 'activity patterns', 'team analytics'), 'https://www.activtrak.com/'),
  ('insightful', 'Insightful', 'employee_monitoring', 'Workforce analytics and employee monitoring platform formerly known as Workpuls.', JSON_ARRAY('computer activity', 'app and website usage', 'productivity analytics', 'screenshots if enabled'), 'https://www.insightful.io/'),
  ('veriato', 'Veriato', 'employee_monitoring', 'Employee monitoring and insider risk platform.', JSON_ARRAY('user activity', 'application usage', 'web activity', 'behavior alerts'), 'https://www.veriato.com/'),
  ('interguard', 'InterGuard', 'employee_monitoring', 'Endpoint monitoring software with screenshots, keystroke logging, and data-loss alerts.', JSON_ARRAY('screenshots', 'keystrokes', 'file transfers', 'app and web usage'), 'https://www.interguardsoftware.com/'),
  ('controlio', 'Controlio', 'employee_monitoring', 'Cloud-based employee monitoring with video-like activity recording.', JSON_ARRAY('screen recordings', 'app and website usage', 'productivity scores'), 'https://controlio.net/'),
  ('staffcop', 'StaffCop', 'employee_monitoring', 'Employee monitoring and insider threat detection suite.', JSON_ARRAY('keystrokes', 'screenshots', 'file operations', 'app and web usage'), 'https://www.staffcop.com/'),
  ('kickidler', 'Kickidler', 'employee_monitoring', 'Employee monitoring with live screen viewing and time tracking.', JSON_ARRAY('live screen viewing', 'screen recordings', 'keystrokes', 'time worked'), 'https://www.kickidler.com/'),
  ('clevercontrol', 'CleverControl', 'employee_monitoring', 'Employee monitoring software with screenshots and keystroke logging.', JSON_ARRAY('screenshots', 'keystrokes', 'app and web usage', 'social media activity'), 'https://clevercontrol.com/'),
  ('spytech', 'Spytech (Spector 360 / SpyAgent)', 'employee_monitoring', 'Computer monitoring software offering keystroke and screenshot capture.', JSON_ARRAY('keystrokes', 'screenshots', 'chat/email content', 'app and web usage'), 'https://www.spytech-web.com/'),
  ('workexaminer', 'Work Examiner', 'employee_monitoring', 'Employee monitoring and internet usage control software.', JSON_ARRAY('app and website usage', 'screenshots', 'time worked'), 'https://www.workexaminer.com/'),
  ('osmonitor', 'OsMonitor', 'employee_monitoring', 'Computer behavior monitoring software for workplaces.', JSON_ARRAY('screen activity', 'app and web usage', 'chat content', 'document access'), 'https://www.osmonitor.com/'),
  ('imonitor-eam', 'iMonitor EAM', 'employee_monitoring', 'Employee activity monitoring software for network administrators.', JSON_ARRAY('keystrokes', 'screenshots', 'app and web usage', 'email/IM content'), 'https://www.imonitorsoft.com/'),
  ('sneek', 'Sneek', 'employee_monitoring', 'Always-on webcam snapshot tool used for remote-team "virtual office" presence.', JSON_ARRAY('periodic webcam snapshots', 'online/away status'), 'https://sneek.io/'),
  ('prodoscore', 'Prodoscore', 'employee_monitoring', 'Productivity intelligence platform that scores employee activity.', JSON_ARRAY('app and document activity', 'email/calendar activity', 'productivity scores'), 'https://www.prodoscore.com/'),
  ('worksmart', 'WorkSmart', 'employee_monitoring', 'Activity and time-tracking tool used by some remote-work staffing platforms (e.g. Crossover).', JSON_ARRAY('periodic screenshots', 'webcam snapshots', 'keystroke/mouse activity', 'app usage'), 'https://www.crossover.com/worksmart'),
  ('aternity', 'Aternity', 'employee_monitoring', 'Digital experience and end-user monitoring platform.', JSON_ARRAY('app performance and usage', 'device activity', 'user experience scores'), 'https://www.aternity.com/'),
  ('viva-insights', 'Microsoft Viva Insights', 'employee_monitoring', 'Workplace analytics built into Microsoft 365 that surfaces work-pattern and collaboration data.', JSON_ARRAY('meeting and email patterns', 'after-hours activity', 'collaboration analytics'), 'https://www.microsoft.com/en-us/microsoft-viva/insights'),

  -- ---------- productivity / time tracking ----------
  ('time-doctor', 'Time Doctor', 'productivity_tracking', 'Time tracking and productivity analytics service.', JSON_ARRAY('time worked', 'app and website usage', 'screenshots if enabled', 'task/project activity'), 'https://www.timedoctor.com/'),
  ('hubstaff', 'Hubstaff', 'productivity_tracking', 'Time tracking and workforce management platform.', JSON_ARRAY('time worked', 'activity levels', 'app and URL usage', 'screenshots if enabled', 'location if enabled'), 'https://hubstaff.com/'),
  ('desktime', 'DeskTime', 'productivity_tracking', 'Automatic time tracking and productivity analysis software.', JSON_ARRAY('time worked', 'app and website usage', 'productivity scores', 'screenshots if enabled'), 'https://desktime.com/'),
  ('tymeplus', 'TymePlus', 'productivity_tracking', 'Employee time and productivity tracking tool.', JSON_ARRAY('time worked', 'app and website usage', 'idle time'), 'https://tymeplus.com/'),
  ('replicon', 'Replicon', 'productivity_tracking', 'Time tracking and workforce management platform for billing and payroll.', JSON_ARRAY('time worked', 'project/task activity', 'billable hours'), 'https://www.replicon.com/'),
  ('rescuetime', 'RescueTime', 'productivity_tracking', 'Personal/team productivity and time-management tracking tool.', JSON_ARRAY('app and website usage', 'focus/productivity scores'), 'https://www.rescuetime.com/'),
  ('connecteam', 'Connecteam', 'productivity_tracking', 'Workforce management app with time clock and GPS tracking for field/shift workers.', JSON_ARRAY('clock-in/out times', 'GPS location during shifts', 'task completion'), 'https://connecteam.com/'),

  -- ---------- identity verification / KYC ----------
  ('onfido', 'Onfido', 'identity_verification', 'Identity verification service used for document and biometric checks.', JSON_ARRAY('identity document data', 'selfie or biometric checks', 'verification status', 'fraud risk signals'), 'https://onfido.com/'),
  ('persona', 'Persona', 'identity_verification', 'Identity verification and compliance service.', JSON_ARRAY('identity document data', 'selfie checks', 'verification workflow events', 'risk signals'), 'https://withpersona.com/'),
  ('jumio', 'Jumio', 'identity_verification', 'Identity verification and eKYC service.', JSON_ARRAY('identity document data', 'biometric/selfie checks', 'verification status', 'risk signals'), 'https://www.jumio.com/'),
  ('socure', 'Socure', 'identity_verification', 'Digital identity verification and fraud risk service.', JSON_ARRAY('identity attributes', 'device and risk signals', 'verification decisions', 'fraud scores'), 'https://www.socure.com/'),
  ('id-me', 'ID.me', 'identity_verification', 'Identity verification network used by employers, government agencies, and benefits providers.', JSON_ARRAY('identity document data', 'biometric/selfie checks', 'verification status'), 'https://www.id.me/'),
  ('veriff', 'Veriff', 'identity_verification', 'Identity verification platform using document and biometric checks.', JSON_ARRAY('identity document data', 'biometric/selfie checks', 'verification decisions'), 'https://www.veriff.com/'),
  ('idnow', 'IDnow', 'identity_verification', 'Identity verification platform for document and video-based checks.', JSON_ARRAY('identity document data', 'video/biometric checks', 'verification status'), 'https://www.idnow.io/'),
  ('au10tix', 'AU10TIX', 'identity_verification', 'Identity verification and fraud-prevention platform.', JSON_ARRAY('identity document data', 'biometric checks', 'fraud risk signals'), 'https://www.au10tix.com/'),
  ('mitek', 'Mitek', 'identity_verification', 'Identity verification and document authentication technology provider.', JSON_ARRAY('identity document data', 'biometric/selfie checks', 'verification decisions'), 'https://www.miteksystems.com/'),
  ('trulioo', 'Trulioo', 'identity_verification', 'Global identity verification network.', JSON_ARRAY('identity attributes', 'identity document data', 'verification decisions'), 'https://www.trulioo.com/'),
  ('clear', 'CLEAR', 'identity_verification', 'Biometric identity verification service used for workplace and venue access.', JSON_ARRAY('biometric data', 'identity document data', 'verification status'), 'https://www.clearme.com/'),

  -- ---------- background checks ----------
  ('checkr', 'Checkr', 'background_check', 'Background check platform used in hiring workflows.', JSON_ARRAY('criminal records', 'employment history', 'identity data'), 'https://checkr.com/'),
  ('sterling', 'Sterling', 'background_check', 'Background and identity verification service for employers.', JSON_ARRAY('criminal records', 'employment/education history', 'identity data'), 'https://www.sterlingcheck.com/'),
  ('hireright', 'HireRight', 'background_check', 'Employment background screening and verification service.', JSON_ARRAY('criminal records', 'employment history', 'drug test results if applicable'), 'https://www.hireright.com/'),
  ('equifax-workforce', 'Equifax Workforce Solutions', 'background_check', 'Employment and income verification service used by employers.', JSON_ARRAY('employment history', 'income data', 'verification records'), 'https://equifaxworkforce.com/'),

  -- ---------- insider threat / DLP / communication surveillance ----------
  ('observeit', 'Proofpoint ObserveIT', 'insider_threat_dlp', 'Insider threat management platform that records user activity tied to data-risk events.', JSON_ARRAY('screen recordings', 'file and app activity', 'risk-scored behavior alerts'), 'https://www.proofpoint.com/us/products/insider-threat-management'),
  ('forcepoint-itm', 'Forcepoint Insider Threat', 'insider_threat_dlp', 'Insider threat and data-loss prevention monitoring platform.', JSON_ARRAY('file and data movement', 'app and web activity', 'risk alerts'), 'https://www.forcepoint.com/product/insider-threat-data-protection'),
  ('code42-incydr', 'Code42 Incydr', 'insider_threat_dlp', 'Data-loss and insider-risk detection platform tracking file movement.', JSON_ARRAY('file movement and exfiltration events', 'cloud/USB transfer activity'), 'https://www.code42.com/products/incydr/'),
  ('securonix', 'Securonix', 'insider_threat_dlp', 'Security analytics platform with insider-threat and user-behavior monitoring.', JSON_ARRAY('user behavior analytics', 'log/event data', 'risk alerts'), 'https://www.securonix.com/'),
  ('smarsh', 'Smarsh', 'insider_threat_dlp', 'Communication archiving and compliance surveillance for regulated industries.', JSON_ARRAY('email content', 'chat/IM content', 'social media activity'), 'https://www.smarsh.com/'),
  ('theta-lake', 'Theta Lake', 'insider_threat_dlp', 'Compliance and risk surveillance for video, voice, and chat communications.', JSON_ARRAY('meeting recordings', 'chat content', 'compliance risk flags'), 'https://thetalake.com/'),
  ('global-relay', 'Global Relay', 'insider_threat_dlp', 'Communication archiving and surveillance platform for regulated industries.', JSON_ARRAY('email content', 'chat/IM content', 'voice recordings if enabled'), 'https://www.globalrelay.com/'),

  -- ---------- call-center / contact-center monitoring ----------
  ('nice-incontact', 'NICE inContact / NICE CXone', 'call_center_monitoring', 'Contact-center platform with call recording and agent performance monitoring.', JSON_ARRAY('call recordings', 'screen recordings', 'agent performance scores'), 'https://www.nice.com/'),
  ('verint', 'Verint', 'call_center_monitoring', 'Workforce engagement and call-center monitoring platform.', JSON_ARRAY('call recordings', 'agent activity', 'performance analytics'), 'https://www.verint.com/'),
  ('callminer', 'CallMiner', 'call_center_monitoring', 'Conversation analytics platform that scores agent calls.', JSON_ARRAY('call recordings/transcripts', 'sentiment and compliance scores'), 'https://callminer.com/'),
  ('genesys-wem', 'Genesys Workforce Engagement', 'call_center_monitoring', 'Contact-center workforce management and quality monitoring suite.', JSON_ARRAY('call recordings', 'agent activity', 'scheduling/adherence data'), 'https://www.genesys.com/workforce-engagement-management'),
  ('calabrio', 'Calabrio', 'call_center_monitoring', 'Workforce optimization and call-quality monitoring platform for contact centers.', JSON_ARRAY('call recordings', 'agent performance scores', 'scheduling adherence'), 'https://www.calabrio.com/'),
  ('five9', 'Five9', 'call_center_monitoring', 'Cloud contact-center platform with call recording and agent monitoring.', JSON_ARRAY('call recordings', 'agent activity', 'performance analytics'), 'https://www.five9.com/'),

  -- ---------- session replay (often embedded in internal/employer-facing tools) ----------
  ('fullstory', 'FullStory', 'session_replay', 'Session replay and digital experience analytics tool.', JSON_ARRAY('on-screen clicks and scrolling', 'session recordings', 'form input patterns'), 'https://www.fullstory.com/'),
  ('hotjar', 'Hotjar', 'session_replay', 'Session recording and heatmap analytics tool.', JSON_ARRAY('on-screen clicks and scrolling', 'session recordings', 'heatmap data'), 'https://www.hotjar.com/'),
  ('mouseflow', 'Mouseflow', 'session_replay', 'Session replay and behavior analytics tool.', JSON_ARRAY('on-screen activity', 'session recordings', 'form interaction data'), 'https://mouseflow.com/'),
  ('ms-clarity', 'Microsoft Clarity', 'session_replay', 'Free session-recording and heatmap analytics tool.', JSON_ARRAY('on-screen clicks and scrolling', 'session recordings'), 'https://clarity.microsoft.com/'),
  ('logrocket', 'LogRocket', 'session_replay', 'Session replay tool aimed at engineering/product teams.', JSON_ARRAY('session recordings', 'on-screen activity', 'network/console logs'), 'https://logrocket.com/'),
  ('smartlook', 'Smartlook', 'session_replay', 'Session recording and product analytics tool.', JSON_ARRAY('session recordings', 'on-screen activity', 'event tracking'), 'https://www.smartlook.com/'),

  -- ---------- fleet / field-worker location tracking ----------
  ('samsara', 'Samsara', 'fleet_tracking', 'Fleet and field-worker tracking platform with GPS and dash-cam monitoring.', JSON_ARRAY('vehicle GPS location', 'driving behavior', 'dash-cam footage if enabled'), 'https://www.samsara.com/'),
  ('motive', 'Motive (formerly KeepTruckin)', 'fleet_tracking', 'Fleet management platform with GPS tracking and driver monitoring.', JSON_ARRAY('vehicle GPS location', 'driving behavior', 'in-cab camera footage if enabled'), 'https://gomotive.com/'),
  ('verizon-connect', 'Verizon Connect', 'fleet_tracking', 'Fleet tracking and field-service management platform.', JSON_ARRAY('vehicle/device GPS location', 'route and stop data', 'driver behavior scores'), 'https://www.verizonconnect.com/'),
  ('geotab', 'Geotab', 'fleet_tracking', 'Fleet telematics and vehicle tracking platform.', JSON_ARRAY('vehicle GPS location', 'driving behavior', 'engine/diagnostic data'), 'https://www.geotab.com/')

ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  category = VALUES(category),
  description = VALUES(description),
  data_collected = VALUES(data_collected),
  reference_url = VALUES(reference_url);

-- =========================================================================
-- SIGNATURES
-- =========================================================================

INSERT INTO signatures (vendor_id, signature_type, pattern, confidence, evidence_label)
SELECT id, 'domain', 'teramind.co', 'high', 'request to a Teramind domain' FROM vendors WHERE slug = 'teramind'
UNION ALL SELECT id, 'domain', 'teramindapp.com', 'high', 'request to a Teramind application domain' FROM vendors WHERE slug = 'teramind'
UNION ALL SELECT id, 'domain', 'activtrak.com', 'high', 'request to an ActivTrak domain' FROM vendors WHERE slug = 'activtrak'
UNION ALL SELECT id, 'url_substring', 'activtrak', 'medium', 'URL contains ActivTrak marker' FROM vendors WHERE slug = 'activtrak'
UNION ALL SELECT id, 'url_substring', '/pixel', 'low', 'tracking pixel-like endpoint path' FROM vendors WHERE slug = 'activtrak'
UNION ALL SELECT id, 'domain', 'insightful.io', 'high', 'request to an Insightful domain' FROM vendors WHERE slug = 'insightful'
UNION ALL SELECT id, 'domain', 'workpuls.com', 'high', 'request to legacy Workpuls domain' FROM vendors WHERE slug = 'insightful'
UNION ALL SELECT id, 'domain', 'veriato.com', 'high', 'request to a Veriato domain' FROM vendors WHERE slug = 'veriato'
UNION ALL SELECT id, 'domain', 'interguardsoftware.com', 'high', 'request to an InterGuard domain' FROM vendors WHERE slug = 'interguard'
UNION ALL SELECT id, 'domain', 'controlio.net', 'high', 'request to a Controlio domain' FROM vendors WHERE slug = 'controlio'
UNION ALL SELECT id, 'domain', 'staffcop.com', 'high', 'request to a StaffCop domain' FROM vendors WHERE slug = 'staffcop'
UNION ALL SELECT id, 'domain', 'kickidler.com', 'high', 'request to a Kickidler domain' FROM vendors WHERE slug = 'kickidler'
UNION ALL SELECT id, 'domain', 'clevercontrol.com', 'high', 'request to a CleverControl domain' FROM vendors WHERE slug = 'clevercontrol'
UNION ALL SELECT id, 'domain', 'spytech-web.com', 'high', 'request to a Spytech domain' FROM vendors WHERE slug = 'spytech'
UNION ALL SELECT id, 'domain', 'workexaminer.com', 'high', 'request to a Work Examiner domain' FROM vendors WHERE slug = 'workexaminer'
UNION ALL SELECT id, 'domain', 'osmonitor.com', 'high', 'request to an OsMonitor domain' FROM vendors WHERE slug = 'osmonitor'
UNION ALL SELECT id, 'domain', 'imonitorsoft.com', 'high', 'request to an iMonitor EAM domain' FROM vendors WHERE slug = 'imonitor-eam'
UNION ALL SELECT id, 'domain', 'sneek.io', 'high', 'request to a Sneek domain' FROM vendors WHERE slug = 'sneek'
UNION ALL SELECT id, 'domain', 'prodoscore.com', 'high', 'request to a Prodoscore domain' FROM vendors WHERE slug = 'prodoscore'
UNION ALL SELECT id, 'domain', 'crossover.com', 'medium', 'request to Crossover/WorkSmart domain' FROM vendors WHERE slug = 'worksmart'
UNION ALL SELECT id, 'url_substring', 'worksmart', 'medium', 'URL contains WorkSmart marker' FROM vendors WHERE slug = 'worksmart'
UNION ALL SELECT id, 'domain', 'aternity.com', 'high', 'request to an Aternity domain' FROM vendors WHERE slug = 'aternity'
UNION ALL SELECT id, 'domain', 'viva.microsoft.com', 'medium', 'request to the Microsoft Viva Insights subdomain' FROM vendors WHERE slug = 'viva-insights'
UNION ALL SELECT id, 'url_substring', 'viva-insights', 'medium', 'URL contains a Viva Insights marker' FROM vendors WHERE slug = 'viva-insights'

UNION ALL SELECT id, 'domain', 'timedoctor.com', 'high', 'request to a Time Doctor domain' FROM vendors WHERE slug = 'time-doctor'
UNION ALL SELECT id, 'domain', 'hubstaff.com', 'high', 'request to a Hubstaff domain' FROM vendors WHERE slug = 'hubstaff'
UNION ALL SELECT id, 'domain', 'desktime.com', 'high', 'request to a DeskTime domain' FROM vendors WHERE slug = 'desktime'
UNION ALL SELECT id, 'domain', 'tymeplus.com', 'high', 'request to a TymePlus domain' FROM vendors WHERE slug = 'tymeplus'
UNION ALL SELECT id, 'domain', 'replicon.com', 'high', 'request to a Replicon domain' FROM vendors WHERE slug = 'replicon'
UNION ALL SELECT id, 'domain', 'rescuetime.com', 'high', 'request to a RescueTime domain' FROM vendors WHERE slug = 'rescuetime'
UNION ALL SELECT id, 'domain', 'connecteam.com', 'high', 'request to a Connecteam domain' FROM vendors WHERE slug = 'connecteam'

UNION ALL SELECT id, 'domain', 'onfido.com', 'high', 'request to an Onfido domain' FROM vendors WHERE slug = 'onfido'
UNION ALL SELECT id, 'domain', 'onfidoapi.com', 'high', 'request to an Onfido API domain' FROM vendors WHERE slug = 'onfido'
UNION ALL SELECT id, 'domain', 'withpersona.com', 'high', 'request to a Persona domain' FROM vendors WHERE slug = 'persona'
UNION ALL SELECT id, 'domain', 'persona.com', 'medium', 'request to a Persona-related domain' FROM vendors WHERE slug = 'persona'
UNION ALL SELECT id, 'domain', 'jumio.com', 'high', 'request to a Jumio domain' FROM vendors WHERE slug = 'jumio'
UNION ALL SELECT id, 'domain', 'netverify.com', 'high', 'request to a Jumio Netverify domain' FROM vendors WHERE slug = 'jumio'
UNION ALL SELECT id, 'domain', 'socure.com', 'high', 'request to a Socure domain' FROM vendors WHERE slug = 'socure'
UNION ALL SELECT id, 'domain', 'id.me', 'high', 'request to an ID.me domain' FROM vendors WHERE slug = 'id-me'
UNION ALL SELECT id, 'domain', 'veriff.com', 'high', 'request to a Veriff domain' FROM vendors WHERE slug = 'veriff'
UNION ALL SELECT id, 'domain', 'idnow.io', 'high', 'request to an IDnow domain' FROM vendors WHERE slug = 'idnow'
UNION ALL SELECT id, 'domain', 'au10tix.com', 'high', 'request to an AU10TIX domain' FROM vendors WHERE slug = 'au10tix'
UNION ALL SELECT id, 'domain', 'miteksystems.com', 'high', 'request to a Mitek domain' FROM vendors WHERE slug = 'mitek'
UNION ALL SELECT id, 'domain', 'trulioo.com', 'high', 'request to a Trulioo domain' FROM vendors WHERE slug = 'trulioo'
UNION ALL SELECT id, 'domain', 'clearme.com', 'high', 'request to a CLEAR domain' FROM vendors WHERE slug = 'clear'

UNION ALL SELECT id, 'domain', 'checkr.com', 'high', 'request to a Checkr domain' FROM vendors WHERE slug = 'checkr'
UNION ALL SELECT id, 'domain', 'sterlingcheck.com', 'high', 'request to a Sterling domain' FROM vendors WHERE slug = 'sterling'
UNION ALL SELECT id, 'domain', 'hireright.com', 'high', 'request to a HireRight domain' FROM vendors WHERE slug = 'hireright'
UNION ALL SELECT id, 'domain', 'equifaxworkforce.com', 'high', 'request to an Equifax Workforce Solutions domain' FROM vendors WHERE slug = 'equifax-workforce'

UNION ALL SELECT id, 'url_substring', 'observeit', 'medium', 'URL contains an ObserveIT marker' FROM vendors WHERE slug = 'observeit'
UNION ALL SELECT id, 'domain', 'forcepoint.com', 'medium', 'request to a Forcepoint domain' FROM vendors WHERE slug = 'forcepoint-itm'
UNION ALL SELECT id, 'domain', 'code42.com', 'high', 'request to a Code42 domain' FROM vendors WHERE slug = 'code42-incydr'
UNION ALL SELECT id, 'domain', 'securonix.com', 'high', 'request to a Securonix domain' FROM vendors WHERE slug = 'securonix'
UNION ALL SELECT id, 'domain', 'smarsh.com', 'high', 'request to a Smarsh domain' FROM vendors WHERE slug = 'smarsh'
UNION ALL SELECT id, 'domain', 'thetalake.com', 'high', 'request to a Theta Lake domain' FROM vendors WHERE slug = 'theta-lake'
UNION ALL SELECT id, 'domain', 'globalrelay.com', 'high', 'request to a Global Relay domain' FROM vendors WHERE slug = 'global-relay'

UNION ALL SELECT id, 'domain', 'niceincontact.com', 'high', 'request to a NICE inContact domain' FROM vendors WHERE slug = 'nice-incontact'
UNION ALL SELECT id, 'url_substring', 'cxone', 'medium', 'URL contains a NICE CXone marker' FROM vendors WHERE slug = 'nice-incontact'
UNION ALL SELECT id, 'domain', 'verint.com', 'high', 'request to a Verint domain' FROM vendors WHERE slug = 'verint'
UNION ALL SELECT id, 'domain', 'callminer.com', 'high', 'request to a CallMiner domain' FROM vendors WHERE slug = 'callminer'
UNION ALL SELECT id, 'domain', 'genesys.com', 'medium', 'request to a Genesys domain' FROM vendors WHERE slug = 'genesys-wem'
UNION ALL SELECT id, 'domain', 'calabrio.com', 'high', 'request to a Calabrio domain' FROM vendors WHERE slug = 'calabrio'
UNION ALL SELECT id, 'domain', 'five9.com', 'high', 'request to a Five9 domain' FROM vendors WHERE slug = 'five9'

UNION ALL SELECT id, 'domain', 'fullstory.com', 'high', 'request to a FullStory domain' FROM vendors WHERE slug = 'fullstory'
UNION ALL SELECT id, 'domain', 'hotjar.com', 'high', 'request to a Hotjar domain' FROM vendors WHERE slug = 'hotjar'
UNION ALL SELECT id, 'domain', 'mouseflow.com', 'high', 'request to a Mouseflow domain' FROM vendors WHERE slug = 'mouseflow'
UNION ALL SELECT id, 'domain', 'clarity.microsoft.com', 'high', 'request to a Microsoft Clarity domain' FROM vendors WHERE slug = 'ms-clarity'
UNION ALL SELECT id, 'domain', 'logrocket.com', 'high', 'request to a LogRocket domain' FROM vendors WHERE slug = 'logrocket'
UNION ALL SELECT id, 'domain', 'smartlook.com', 'high', 'request to a Smartlook domain' FROM vendors WHERE slug = 'smartlook'

UNION ALL SELECT id, 'domain', 'samsara.com', 'high', 'request to a Samsara domain' FROM vendors WHERE slug = 'samsara'
UNION ALL SELECT id, 'domain', 'gomotive.com', 'high', 'request to a Motive domain' FROM vendors WHERE slug = 'motive'
UNION ALL SELECT id, 'domain', 'verizonconnect.com', 'high', 'request to a Verizon Connect domain' FROM vendors WHERE slug = 'verizon-connect'
UNION ALL SELECT id, 'domain', 'geotab.com', 'high', 'request to a Geotab domain' FROM vendors WHERE slug = 'geotab'

ON DUPLICATE KEY UPDATE
  confidence = VALUES(confidence),
  evidence_label = VALUES(evidence_label),
  is_active = TRUE;