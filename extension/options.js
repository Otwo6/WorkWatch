const form = document.querySelector("#settings-form");
const useBackend = document.querySelector("#use-backend");
const backendUrl = document.querySelector("#backend-url");
const exportForm = document.querySelector("#export-form");
const exportHostname = document.querySelector("#export-hostname");
const exportFrom = document.querySelector("#export-from");
const exportTo = document.querySelector("#export-to");
const statusEl = document.querySelector("#status");

document.addEventListener("DOMContentLoaded", async () => {
  const settings = await chrome.runtime.sendMessage({ type: "getSettings" });
  useBackend.checked = settings.useBackend;
  backendUrl.value = settings.backendUrl || "http://127.0.0.1:5050";

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.url)
    {
      exportHostname.value = new URL(tab.url).hostname;
    }
  } catch {
    exportHostname.value = "";
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const settings = {
    useBackend: useBackend.checked,
    backendUrl: backendUrl.value.replace(/\/$/, "") || "http://127.0.0.1:5050"
  };
  const result = await chrome.runtime.sendMessage({ type: "saveSettings", settings });
  statusEl.textContent = result.ok ? `Saved. Loaded ${result.count} signatures.` : `Saved, using fallback signatures: ${result.error}`;
});

exportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = exportForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  statusEl.textContent = "Building evidence package...";

  try {
    const filters = {
      hostname: exportHostname.value.trim(),
      from: exportFrom.value || null,
      to: exportTo.value || null
    };
    const evidencePackage = await chrome.runtime.sendMessage({ type: "buildEvidencePackage", filters });
    const blob = new Blob([JSON.stringify(evidencePackage, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    await chrome.downloads.download({
      url,
      filename: exportFilename(evidencePackage),
      saveAs: true
    });
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    statusEl.textContent = `Downloaded ${evidencePackage.findings.length} findings and ${evidencePackage.behaviors.length} behaviors.`;
  } catch (error) {
    statusEl.textContent = `Export failed: ${error.message}`;
  } finally {
    submitButton.disabled = false;
  }
});

function exportFilename(evidencePackage) {
  const site = sanitizeFilename(evidencePackage.site || "all-sites");
  const generated = String(evidencePackage.generatedAt || new Date().toISOString()).slice(0, 10);
  return `workwatch-evidence-${site}-${generated}.json`;
}

function sanitizeFilename(value) {
  return String(value || "all-sites").replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "") || "all-sites";
}
