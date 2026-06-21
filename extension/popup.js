const reportEl = document.querySelector("#report");
const emptyEl = document.querySelector("#empty");
const metaEl = document.querySelector("#meta");
const refreshButton = document.querySelector("#refresh");
const clearButton = document.querySelector("#clear");
const optionsButton = document.querySelector("#options");

document.addEventListener("DOMContentLoaded", loadReport);
refreshButton.addEventListener("click", refreshSignatures);
clearButton.addEventListener("click", clearCurrentTab);
optionsButton.addEventListener("click", () => chrome.runtime.openOptionsPage());

async function currentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function loadReport() {
  const tab = await currentTab();
  const response = await chrome.runtime.sendMessage({ type: "getReport", tabId: tab.id });
  render(response);
}

async function refreshSignatures() {
  refreshButton.disabled = true;
  const result = await chrome.runtime.sendMessage({ type: "refreshSignatures" });
  refreshButton.disabled = false;
  metaEl.textContent = signatureMetaText(result);
  await loadReport();
}

async function clearCurrentTab() {
  const tab = await currentTab();
  await chrome.runtime.sendMessage({ type: "clearTab", tabId: tab.id });
  await loadReport();
}

function render(report) {
  const vendors = report.vendors || [];
  const behaviors = report.behaviors || [];
  metaEl.textContent = signatureMetaText(report.signatureMeta);
  reportEl.innerHTML = "";
  emptyEl.hidden = vendors.length > 0 || behaviors.length > 0;

  for (const record of vendors.sort((a, b) => b.count - a.count))
  {
    const article = document.createElement("article");
    article.className = `finding confidence-${record.confidence}`;
    article.innerHTML = `
      <div class="finding-header">
        <div>
          <h2>${escapeHtml(record.vendor.name)}</h2>
          <p>${escapeHtml(categoryLabel(record.vendor.category))} · ${escapeHtml(record.confidence)} confidence</p>
        </div>
        <span>${record.count}</span>
      </div>
      <p class="plain">${escapeHtml(toPlainEnglish(record))}</p>
      <details>
        <summary>Evidence</summary>
        <ul>${record.evidence.map((item) => `<li><strong>${escapeHtml(item.label)}</strong><br><span>${escapeHtml(item.url)}</span></li>`).join("")}</ul>
      </details>
    `;
    reportEl.appendChild(article);
  }

  for (const detection of behaviors)
  {
    const article = document.createElement("article");
    article.className = `finding behavior confidence-${detection.severity === "high" ? "high" : "medium"}`;
    article.innerHTML = `
      <div class="finding-header">
        <div>
          <h2>${escapeHtml(behaviorTitle(detection))}</h2>
          <p>${escapeHtml(behaviorLabel(detection.kind))} · ${escapeHtml(detection.severity)} severity</p>
        </div>
        <span>API</span>
      </div>
      <p class="plain">${escapeHtml(detection.report || behaviorReport(detection))}</p>
      <details>
        <summary>Evidence</summary>
        <ul>
          <li><strong>${escapeHtml(detection.label)}</strong><br><span>${escapeHtml(detection.pageUrl)}</span></li>
          ${detection.callSite ? `<li><strong>Call site</strong><br><span>${escapeHtml(detection.callSite)}</span></li>` : ""}
        </ul>
      </details>
    `;
    reportEl.appendChild(article);
  }
}

function toPlainEnglish(record) {
  return `Your employer appears to be using ${record.vendor.name}, which can collect ${humanList(record.vendor.dataCollected || [])}.`;
}

function humanList(items) {
  if (!items.length) return "activity data";
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

function categoryLabel(category) {
  return {
    employee_monitoring: "Employee monitoring",
    productivity_tracking: "Productivity tracking",
    identity_verification: "Identity verification"
  }[category] || "Monitoring signal";
}

function behaviorTitle(detection) {
  if (detection.kind === "screen_capture_request") return "Screen-grab signal";
  if (detection.kind === "global_keyboard_listener") return "Keyboard listener signal";
  return "Sensitive API signal";
}

function behaviorLabel(kind) {
  return {
    screen_capture_request: "Screen capture detector",
    global_keyboard_listener: "Keylogger detector"
  }[kind] || "Sensitive API detector";
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

function signatureMetaText(meta = {}) {
  const source = meta.source || "fallback";
  const count = meta.count || 0;
  return `${count} signatures · ${source}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
