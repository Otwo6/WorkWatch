const form = document.querySelector("#settings-form");
const useBackend = document.querySelector("#use-backend");
const backendUrl = document.querySelector("#backend-url");
const exportForm = document.querySelector("#export-form");
const exportFrom = document.querySelector("#export-from");
const exportTo = document.querySelector("#export-to");
const exportFormat = document.querySelector("#export-format"); 
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

exportForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = exportForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  statusEl.textContent = "Building evidence package...";

  try {
    const filters = {
      hostname: "",
      from: exportFrom.value || null,
      to: exportTo.value || null
    };
    const evidencePackage = await chrome.runtime.sendMessage({ type: "buildEvidencePackage", filters });
    const format = exportFormat.value;

    if (format === "json")
	{
      await downloadJson(evidencePackage);
      statusEl.textContent = `Downloaded ${evidencePackage.findings.length} findings.`;
    }
	else if (format === "print")
	{
      printHtmlReport(evidencePackage);
      statusEl.textContent = "Opened print dialog.";
    }

  } catch (error) {
    statusEl.textContent = `Export failed: ${error.message}`;
  } finally {
    submitButton.disabled = false;
  }
});

async function downloadJson(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  await chrome.downloads.download({ url, filename: exportFilename(data, "json"), saveAs: true });
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

function printHtmlReport(data) {
  const html = buildHtmlTemplate(data);
  const printWindow = window.open("", "_blank");
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  
  setTimeout(() => { printWindow.print(); }, 250);
}

async function downloadPdfFromBackend(data, urlPrefix) {
  statusEl.textContent = "Generating PDF on server...";
  const response = await fetch(`${urlPrefix}/api/export/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error(`Server returned ${response.status}`);

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  await chrome.downloads.download({ url, filename: exportFilename(data, "pdf"), saveAs: true });
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

function exportFilename(evidencePackage, extension) {
  const site = sanitizeFilename(evidencePackage.site || "all-sites");
  const generated = String(evidencePackage.generatedAt || new Date().toISOString()).slice(0, 10);
  return `workwatch-evidence-${site}-${generated}.${extension}`;
}

function sanitizeFilename(value) {
  return String(value || "all-sites").replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "") || "all-sites";
}

function buildHtmlTemplate(data) {
  const dateStr = new Date(data.generatedAt || Date.now()).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Map findings into readable HTML blocks
  const findingsHtml = data.findings && data.findings.length > 0 
    ? data.findings.map(f => `
        <div class="finding">
          <h3>${escapeHtml(f.title || f.type || 'Recorded Event')}</h3>
          <p>${escapeHtml(f.description || JSON.stringify(f))}</p>
        </div>
      `).join("")
    : "<p>No specific findings recorded for this period.</p>";

  // Format behaviors array safely
  const rawData = JSON.stringify(data.behaviors || [], null, 2);

  return `
    <!DOCTYPE html>
	<html lang="en">
	<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>WorkWatch Evidence Report</title>
	<style>
		:root {
		--brand: #0f172a;
		--brand-muted: #475569;
		--border: #e2e8f0;
		--bg-subtle: #f8fafc;
		--text-main: #334155;
		--text-muted: #64748b;
		--badge-medium: #f59e0b;
		--badge-medium-bg: #fef3c7;
		--primary: #3b82f6;
		}

		body {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
		line-height: 1.6;
		color: var(--text-main);
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
		background-color: #fff;
		}

		/* --- HEADER --- */
		header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		border-bottom: 2px solid var(--border);
		padding-bottom: 1rem;
		margin-bottom: 2rem;
		}

		.header-titles h1 {
		margin: 0 0 0.25rem 0;
		color: var(--brand);
		font-size: 1.75rem;
		}

		.header-titles p {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.95rem;
		}

		.header-meta p {
		margin: 0;
		font-size: 0.9rem;
		color: var(--text-muted);
		text-align: right;
		}

		.header-meta strong {
		color: var(--brand);
		}

		/* --- EXECUTIVE SUMMARY --- */
		.executive-summary {
		background-color: var(--bg-subtle);
		border-left: 4px solid var(--primary);
		padding: 1.25rem;
		border-radius: 0 0.5rem 0.5rem 0;
		margin-bottom: 2.5rem;
		}

		.executive-summary h2 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-size: 1.1rem;
		color: var(--brand);
		}

		.executive-summary p {
		margin: 0;
		}

		/* --- FINDINGS CARDS --- */
		section h2 {
		border-bottom: 1px solid var(--border);
		padding-bottom: 0.5rem;
		margin-bottom: 1.5rem;
		color: var(--brand);
		}

		.finding-card {
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		}

		.finding-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		}

		.finding-header h3 {
		margin: 0;
		font-size: 1.25rem;
		color: var(--brand);
		}

		.confidence-badge {
		background-color: #dbeafe;
		color: #1e40af;
		padding: 0.25rem 0.75rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		}

		.data-grid {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 1rem;
		font-size: 0.95rem;
		}

		.data-label {
		font-weight: 600;
		color: var(--brand-muted);
		}

		ul.data-list {
		margin: 0;
		padding-left: 1.25rem;
		}

		/* --- APPENDIX TABLE --- */
		.appendix-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
		margin-bottom: 2rem;
		}

		.appendix-table th, .appendix-table td {
		border: 1px solid var(--border);
		padding: 0.75rem 1rem;
		text-align: left;
		vertical-align: top;
		}

		.appendix-table th {
		background-color: var(--bg-subtle);
		color: var(--brand-muted);
		font-weight: 600;
		}

		.severity-badge {
		display: inline-block;
		padding: 0.2rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		}

		.severity-medium {
		background-color: var(--badge-medium-bg);
		color: var(--badge-medium);
		}

		/* --- COLLAPSIBLE DETAILS --- */
		details {
		margin-top: 0.5rem;
		}

		summary {
		cursor: pointer;
		color: var(--primary);
		font-size: 0.85rem;
		font-weight: 500;
		}

		summary:hover {
		text-decoration: underline;
		}

		.tech-details {
		background-color: var(--bg-subtle);
		padding: 0.75rem;
		border-radius: 0.25rem;
		margin-top: 0.5rem;
		font-family: monospace;
		font-size: 0.75rem;
		overflow-x: auto;
		white-space: pre-wrap;
		word-break: break-all;
		}

		/* --- PRINT STYLES --- */
		@media print {
		body {
			max-width: 100%;
			padding: 0;
		}
		.finding-card {
			page-break-inside: avoid;
		}
		.appendix-table tr {
			page-break-inside: avoid;
		}
		details[open] .tech-details {
			display: block;
		}
		/* Expand details automatically for print if desired, or keep collapsed */
		}
	</style>
	</head>
	<body>

	<header>
		<div class="header-titles">
		<h1>👁️ WorkWatch</h1>
		<p>Evidence & Interaction Report</p>
		</div>
		<div class="header-meta">
		<p><strong>Generated:</strong> June 21, 2026 at 03:29 PM</p>
		<p><strong>Session Target:</strong> Local Environment</p>
		</div>
	</header>

	<section class="executive-summary">
		<h2>Executive Summary</h2>
		<p>During the recorded session, WorkWatch detected persistent productivity tracking infrastructure and medium-severity browser behaviors. The primary finding is the active presence of <strong>Time Doctor</strong>, a productivity tracking service, alongside pages attaching <strong>global keyboard listeners</strong> capable of observing user keystrokes.</p>
	</section>

	<section class="findings">
		<h2>Findings Summary</h2>

		<div class="finding-card">
		<div class="finding-header">
			<h3>Vendor: Time Doctor</h3>
			<span class="confidence-badge">High Confidence</span>
		</div>
		<div class="data-grid">
			<div class="data-label">Category</div>
			<div>Productivity Tracking</div>
			
			<div class="data-label">Description</div>
			<div>Time tracking and productivity analytics service.</div>

			<div class="data-label">Data Collected</div>
			<div>
			<ul class="data-list">
				<li>Time worked</li>
				<li>App and website usage</li>
				<li>Screenshots (if enabled)</li>
				<li>Task/project activity</li>
			</ul>
			</div>

			<div class="data-label">Evidence Volume</div>
			<div>11 direct network requests to <code>*.timedoctor.com</code></div>
		</div>
		</div>
	</section>

	<section class="appendix">
		<h2>Evidence Appendix: Behavioral Events</h2>
		
		<table class="appendix-table">
		<thead>
			<tr>
			<th style="width: 15%">Time</th>
			<th style="width: 10%">Severity</th>
			<th style="width: 20%">Event Type</th>
			<th style="width: 55%">Description & Details</th>
			</tr>
		</thead>
		<tbody>
			<tr>
			<td>22:28:36.193Z</td>
			<td><span class="severity-badge severity-medium">Medium</span></td>
			<td><code>global_keyboard_listener</code></td>
			<td>
				<strong>Page attached a global keypress listener.</strong><br>
				<span style="color: var(--text-muted); font-size: 0.85rem;">Global keyboard listeners can observe typed keys and shortcuts while the page is focused.</span>
				
				<details>
				<summary>View Technical Details</summary>
				<div class="tech-details">
	Hostname: www.google.com
	Target: documentElement
	CallSite: at HTMLHtmlElement.guardedAddEventListener [as addEventListener] (chrome-extension://aeeeoakonjdjofklcmagoplnmbnleagf/page-guard.js:78:13)
				</div>
				</details>
			</td>
			</tr>
			<tr>
			<td>22:28:36.589Z</td>
			<td><span class="severity-badge severity-medium">Medium</span></td>
			<td><code>global_keyboard_listener</code></td>
			<td>
				<strong>Page attached a global keydown listener.</strong><br>
				<span style="color: var(--text-muted); font-size: 0.85rem;">Global keyboard listeners can observe typed keys and shortcuts while the page is focused.</span>
				
				<details>
				<summary>View Technical Details</summary>
				<div class="tech-details">
	Hostname: www.google.com
	Target: documentElement
	CallSite: at HTMLHtmlElement.guardedAddEventListener (chrome-extension://aeeeoakonjdjofklcmagoplnmbnleagf/page-guard.js:78:13)
				</div>
				</details>
			</td>
			</tr>
		</tbody>
		</table>
	</section>

	</body>
	</html>
  `;
}

function escapeHtml(unsafe) {
  return (unsafe || "").toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}