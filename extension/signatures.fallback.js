const FALLBACK_SIGNATURES = [
  {
    vendor: {
      slug: "teramind",
      name: "Teramind",
      category: "employee_monitoring",
      description: "Employee monitoring and user activity analytics platform.",
      dataCollected: ["app and website usage", "screenshots or screen activity", "keystroke/activity signals", "user behavior analytics"],
      referenceUrl: "https://www.teramind.co/"
    },
    type: "domain",
    pattern: "teramind.co",
    confidence: "high",
    evidenceLabel: "request to a Teramind domain"
  },
  {
    vendor: {
      slug: "activtrak",
      name: "ActivTrak",
      category: "employee_monitoring",
      description: "Workforce analytics and productivity monitoring platform.",
      dataCollected: ["app and website usage", "productivity classifications", "activity patterns", "team analytics"],
      referenceUrl: "https://www.activtrak.com/"
    },
    type: "domain",
    pattern: "activtrak.com",
    confidence: "high",
    evidenceLabel: "request to an ActivTrak domain"
  },
  {
    vendor: {
      slug: "time-doctor",
      name: "Time Doctor",
      category: "productivity_tracking",
      description: "Time tracking and productivity analytics service.",
      dataCollected: ["time worked", "app and website usage", "screenshots if enabled", "task/project activity"],
      referenceUrl: "https://www.timedoctor.com/"
    },
    type: "domain",
    pattern: "timedoctor.com",
    confidence: "high",
    evidenceLabel: "request to a Time Doctor domain"
  },
  {
    vendor: {
      slug: "hubstaff",
      name: "Hubstaff",
      category: "productivity_tracking",
      description: "Time tracking and workforce management platform.",
      dataCollected: ["time worked", "activity levels", "app and URL usage", "screenshots if enabled", "location if enabled"],
      referenceUrl: "https://hubstaff.com/"
    },
    type: "domain",
    pattern: "hubstaff.com",
    confidence: "high",
    evidenceLabel: "request to a Hubstaff domain"
  },
  {
    vendor: {
      slug: "insightful",
      name: "Insightful",
      category: "employee_monitoring",
      description: "Workforce analytics and employee monitoring platform formerly known as Workpuls.",
      dataCollected: ["computer activity", "app and website usage", "productivity analytics", "screenshots if enabled"],
      referenceUrl: "https://www.insightful.io/"
    },
    type: "domain",
    pattern: "insightful.io",
    confidence: "high",
    evidenceLabel: "request to an Insightful domain"
  },
  {
    vendor: {
      slug: "veriato",
      name: "Veriato",
      category: "employee_monitoring",
      description: "Employee monitoring and insider risk platform.",
      dataCollected: ["user activity", "application usage", "web activity", "behavior alerts"],
      referenceUrl: "https://www.veriato.com/"
    },
    type: "domain",
    pattern: "veriato.com",
    confidence: "high",
    evidenceLabel: "request to a Veriato domain"
  },
  {
    vendor: {
      slug: "onfido",
      name: "Onfido",
      category: "identity_verification",
      description: "Identity verification service used for document and biometric checks.",
      dataCollected: ["identity document data", "selfie or biometric checks", "verification status", "fraud risk signals"],
      referenceUrl: "https://onfido.com/"
    },
    type: "domain",
    pattern: "onfido.com",
    confidence: "high",
    evidenceLabel: "request to an Onfido domain"
  },
  {
    vendor: {
      slug: "persona",
      name: "Persona",
      category: "identity_verification",
      description: "Identity verification and compliance service.",
      dataCollected: ["identity document data", "selfie checks", "verification workflow events", "risk signals"],
      referenceUrl: "https://withpersona.com/"
    },
    type: "domain",
    pattern: "withpersona.com",
    confidence: "high",
    evidenceLabel: "request to a Persona domain"
  },
  {
    vendor: {
      slug: "jumio",
      name: "Jumio",
      category: "identity_verification",
      description: "Identity verification and eKYC service.",
      dataCollected: ["identity document data", "biometric/selfie checks", "verification status", "risk signals"],
      referenceUrl: "https://www.jumio.com/"
    },
    type: "domain",
    pattern: "jumio.com",
    confidence: "high",
    evidenceLabel: "request to a Jumio domain"
  },
  {
    vendor: {
      slug: "socure",
      name: "Socure",
      category: "identity_verification",
      description: "Digital identity verification and fraud risk service.",
      dataCollected: ["identity attributes", "device and risk signals", "verification decisions", "fraud scores"],
      referenceUrl: "https://www.socure.com/"
    },
    type: "domain",
    pattern: "socure.com",
    confidence: "high",
    evidenceLabel: "request to a Socure domain"
  }
];
