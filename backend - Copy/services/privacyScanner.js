/* =====================================================
   PRIVYGUARD PRIVACY SCANNER
===================================================== */

const PATTERNS = {
  email: {
    label: "Email Address",
    category: "Contact Information",
    severity: "HIGH",
    regex:
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  },

  phone: {
    label: "Phone Number",
    category: "Contact Information",
    severity: "HIGH",
    regex:
      /(?:\+62|62|0)[8-9][0-9]{7,12}/g
  },

  nik: {
    label: "National ID",
    category: "Identity Data",
    severity: "CRITICAL",
    regex:
      /\b\d{16}\b/g
  },

  creditCard: {
    label: "Credit Card Number",
    category: "Financial Data",
    severity: "CRITICAL",
    regex:
      /\b(?:\d[ -]*?){13,19}\b/g
  },

  ipAddress: {
    label: "IP Address",
    category: "Technical Data",
    severity: "MEDIUM",
    regex:
      /\b(?:\d{1,3}\.){3}\d{1,3}\b/g
  },

  dateOfBirth: {
    label: "Date of Birth",
    category: "Personal Data",
    severity: "MEDIUM",
    regex:
      /\b(?:0?[1-9]|[12][0-9]|3[01])[\/-](?:0?[1-9]|1[0-2])[\/-](?:19|20)\d{2}\b/g
  }
};


/* =====================================================
   SEVERITY SCORE
===================================================== */

const SEVERITY_WEIGHT = {
  CRITICAL: 25,
  HIGH: 15,
  MEDIUM: 8,
  LOW: 3
};


/* =====================================================
   EXTRACT TEXT
===================================================== */

function extractText(file) {

  if (!file || !file.buffer) {
    return "";
  }

  /*
   * For TXT / CSV / JSON and other text-based files,
   * we can directly inspect the buffer.
   */

  const textTypes = [
    "text/plain",
    "text/csv",
    "application/json"
  ];

  if (
    textTypes.includes(file.mimetype) ||
    file.originalname.match(
      /\.(txt|csv|json)$/i
    )
  ) {
    return file.buffer.toString("utf-8");
  }

  /*
   * PDF/DOCX will be connected to dedicated
   * document parsers in the next stage.
   */

  return file.buffer.toString("utf-8");
}


/* =====================================================
   DETECT SENSITIVE DATA
===================================================== */

function detectSensitiveData(text) {

  const findings = [];

  for (const [key, pattern] of Object.entries(PATTERNS)) {

    const matches = text.match(pattern.regex);

    if (!matches || matches.length === 0) {
      continue;
    }

    const uniqueMatches = [
      ...new Set(matches)
    ];

    findings.push({
      type: key,
      label: pattern.label,
      category: pattern.category,
      severity: pattern.severity,
      count: uniqueMatches.length
    });
  }

  return findings;
}


/* =====================================================
   CALCULATE SCORE
===================================================== */

function calculateScore(findings) {

  if (findings.length === 0) {
    return 100;
  }

  let risk = 0;

  findings.forEach((finding) => {

    const weight =
      SEVERITY_WEIGHT[finding.severity] || 1;

    risk += weight * finding.count;
  });

  /*
   * Limit risk to 100.
   */

  risk = Math.min(risk, 100);

  return Math.max(0, 100 - risk);
}


/* =====================================================
   RISK LEVEL
===================================================== */

function getRiskLevel(score) {

  if (score >= 80) {
    return "LOW";
  }

  if (score >= 60) {
    return "MEDIUM";
  }

  if (score >= 40) {
    return "HIGH";
  }

  return "CRITICAL";
}


/* =====================================================
   RECOMMENDATIONS
===================================================== */

function generateRecommendations(findings) {

  const recommendations = [];

  const categories = findings.map(
    (finding) => finding.category
  );

  if (
    categories.includes("Identity Data")
  ) {
    recommendations.push({
      title: "Protect identity information",
      description:
        "Remove or mask national identification numbers before sharing this document.",
      priority: "CRITICAL"
    });
  }

  if (
    categories.includes("Contact Information")
  ) {
    recommendations.push({
      title: "Review contact information",
      description:
        "Consider masking email addresses and phone numbers before external sharing.",
      priority: "HIGH"
    });
  }

  if (
    categories.includes("Financial Data")
  ) {
    recommendations.push({
      title: "Protect financial information",
      description:
        "Financial identifiers should not be shared publicly.",
      priority: "CRITICAL"
    });
  }

  if (
    categories.includes("Technical Data")
  ) {
    recommendations.push({
      title: "Review technical metadata",
      description:
        "IP addresses and technical identifiers may reveal information about systems or users.",
      priority: "MEDIUM"
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Document looks safe",
      description:
        "No obvious sensitive information was detected.",
      priority: "LOW"
    });
  }

  return recommendations;
}


/* =====================================================
   MAIN SCANNER
===================================================== */

export async function scanDocument(file) {

  const text = extractText(file);

  const findings =
    detectSensitiveData(text);

  const score =
    calculateScore(findings);

  const riskLevel =
    getRiskLevel(score);

  const recommendations =
    generateRecommendations(findings);

  const totalFindings =
    findings.reduce(
      (total, finding) =>
        total + finding.count,
      0
    );

  return {

    privacyScore: score,

    riskLevel,

    totalFindings,

    findings,

    recommendations,

    scanner: {
      engine: "PrivyGuard Privacy Engine",
      version: "1.0.0",
      aiEnabled: false
    }
  };
}