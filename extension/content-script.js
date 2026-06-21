const ALERT_ID = "workwatch-sensitive-alert";

window.addEventListener("workwatch:sensitive-api", (event) => {
  if (!event.detail || event.detail.source !== "workwatch-page-guard") return;

  const detection = sanitizeDetection(event.detail);
  chrome.runtime.sendMessage({ type: "behaviorSignal", detection }).catch(() => {});

  if (detection.kind === "screen_capture_request" && detection.severity === "high")
  {
    showInlineAlert("WorkWatch detected a screen-capture request without a visible click or keyboard action.");
  }
});

function sanitizeDetection(detail) {
  return {
    kind: detail.kind,
    label: detail.label,
    severity: detail.severity,
    userActivation: Boolean(detail.userActivation),
    eventType: detail.eventType || null,
    target: detail.target || null,
    capture: Boolean(detail.capture),
    pageTitle: String(detail.pageTitle || "").slice(0, 160),
    pageUrl: redactUrl(detail.pageUrl),
    callSite: redactCallSite(detail.callSite || ""),
    time: detail.time || new Date().toISOString()
  };
}

function showInlineAlert(message) {
  const existing = document.getElementById(ALERT_ID);
  if (existing) existing.remove();

  const alert = document.createElement("div");
  alert.id = ALERT_ID;
  alert.setAttribute("role", "alert");
  alert.textContent = message;
  Object.assign(alert.style, {
    position: "fixed",
    top: "12px",
    right: "12px",
    zIndex: "2147483647",
    maxWidth: "360px",
    padding: "12px 14px",
    border: "1px solid #f2b8b5",
    borderLeft: "4px solid #b42318",
    borderRadius: "8px",
    background: "#fff8f7",
    color: "#1d2730",
    boxShadow: "0 8px 24px rgba(29, 39, 48, 0.18)",
    font: "13px/1.4 system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  });

  document.documentElement.appendChild(alert);
  setTimeout(() => alert.remove(), 8000);
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
    return "";
  }
}

function redactCallSite(stack) {
  return stack
    .replaceAll(location.href, redactUrl(location.href))
    .replace(/[?&][^)\s|]+/g, "?...");
}
