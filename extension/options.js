const form = document.querySelector("#settings-form");
const useBackend = document.querySelector("#use-backend");
const backendUrl = document.querySelector("#backend-url");
const statusEl = document.querySelector("#status");

document.addEventListener("DOMContentLoaded", async () => {
  const settings = await chrome.runtime.sendMessage({ type: "getSettings" });
  useBackend.checked = settings.useBackend;
  backendUrl.value = settings.backendUrl || "http://127.0.0.1:5050";
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
