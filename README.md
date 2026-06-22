# <p align="center">VINDEX</p>

<p align="center"><i>"Labor is prior to, and independent of, capital... Labor is the superior of capital, and deserves much the higher consideration."</i></p> <p align="center">— Abraham Lincoln</p>

In most workplaces, monitoring runs quietly in the background. Your boss may be reading your emails, logging your keystrokes, capturing your screen, or scoring your productivity with an algorithm, and you'd be none the wiser.
Most workers never see the tools observing them or what data the tools collect.
**VINDEX** is designed to make the invisible layer visible. This browser extension that scans the pages you visit for known monitoring and identity-verification signals, explains what it finds in plain language, and helps you keep a record of it.
VINDEX is a free, open-source tool, understanding what's watching you doesn't cost you a penny.
Knowing what's being collected about you at work is a basic form of leverage. VINDEX exists to put more of that leverage back in your hands.

---

<p align="center">
<img src="Logo.png" width="100" alt="VINDEX Logo" /></p>

---

## What is VINDEX?

**VINDEX** is a browser extension that detects common **employee monitoring**, **productivity tracking**, and **identity verification** signals in the pages you load at work.

Many of these tools operate by quietly sending your activity to a third-party vendor's servers, or by attaching to browser APIs that can capture your screen or your keystrokes. This can happen without any visible notice, making it hard to know what's actually being collected about you.

With VINDEX running, you get a per-tab report showing:

- Which known monitoring or verification vendors are present on the page
- What category they fall into (employee monitoring, productivity tracking, identity verification, background checks, insider-threat/DLP, call-center monitoring, session replay, fleet tracking, and more)
- What kind of data each vendor is known to collect
- Specific in-page behavior that looks like monitoring, such as a screen-capture request fired without a click, or a script attaching a global keystroke listener

By revealing this activity in real time, VINDEX helps you go from "I think I'm being watched" to "here's exactly what's watching me, and when."

---

## How It Works

1. VINDEX loads alongside every page you visit and watches both network requests and a small set of sensitive browser APIs.
2. Outgoing requests are checked against a signature list of known monitoring, tracking, and identity-verification vendors (matched by domain, URL pattern, or header).
3. In parallel, a page-level guard watches for behavior associated with monitoring tools — for example, screen-capture requests and global keyboard listeners — and flags whether the action followed a real user click or keypress.
4. Each match is recorded against the tab it occurred on, along with the vendor's name, category, and what that vendor is known to collect.
5. You get a live report in the toolbar popup, and can export a dated evidence package later if you need to document what you found.

---

## Signature Source Modes

| Mode | Source | Setup Required | Hosted By | Cost | Notes |
|:----:|--------|:---------------:|-----------|------|-------|
| Bundled | Built-in fallback signature list | None | Your browser (offline) | Free | Works out of the box; covers well-known monitoring and verification vendors; updates only when you update the extension |
| Self-Hosted Backend | Flask + MySQL signature database | You run a local server | You (local machine) | Free | Lets you maintain and extend your own up-to-date vendor/signature list; the extension queries it instead of the bundled list |

---

## Installation & Setup

### Common Steps

1. Clone or download the VINDEX repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode**.
4. Click **Load unpacked** and select the `/extension` folder.

This alone gives you full detection using the bundled signature list — no backend required.

---

### Optional: Self-Hosted Backend Mode

Use this if you want to maintain your own signature database instead of relying on the bundled list.

1. Install dependencies:

   ```
   cd backend
   pip install -r requirements.txt
   ```

2. Copy the example environment file and fill in your own values:

   ```
   cp .env.example .env
   ```

3. Create the database and tables:

   ```
   mysql -u root -p < schema.sql
   mysql -u root -p < seed.sql
   ```

4. Start the backend:

   ```
   python app.py
   ```

5. When you see the Flask server running at `http://127.0.0.1:5050`, open the extension's **Settings** page, enable **Use backend signature updates**, and enter your backend URL.

---

## Evidence Export

From the extension's Settings page, you can build a record of what's been detected:

- Filter by a **from/to** date range
- Export as raw **JSON**, for your own records or to hand off to someone else
- Export as a **print-formatted report**, which you can save as a PDF directly from the browser's print dialog

---

## Privacy

- **Bundled mode:** 100% local. VINDEX checks pages against a signature list shipped with the extension and never phones home.
- **Backend mode:** VINDEX only talks to the backend URL *you* configure, by default your own machine. We don't operate a hosted backend, and no data passes through any server we control.
- **Local storage:** Detections and history are stored in your browser's local extension storage. Nothing is uploaded anywhere unless you explicitly export and share it yourself.

**We never collect** your browsing history, keystrokes, or personal content, and we have no server that could collect it even if we wanted to.

---

## Legal & Ethical Disclaimer

VINDEX is a tool designed to **surface known monitoring and identity-verification signals** so you can better understand what's running on the pages you visit. It is **not** a legal compliance tool, and it does not determine whether any specific monitoring is lawful, authorized, or disclosed in your employment agreement.

VINDEX matches against a list of *known* vendor signatures and a small set of behavioral heuristics. It cannot detect monitoring tools it doesn't have a signature for, and it cannot see monitoring that happens entirely outside the browser (for example, at the network or device level).

### Stay Vigilant:

> A clean report from VINDEX is not proof that you aren't being monitored, only that nothing matched our current signatures. Always document what you find, and don't rely on this tool alone.

#### Additional Legal Notices:

* **No Liability for Misuse:** We are not responsible for any actions taken based on VINDEX's outputs. Workplace monitoring laws vary by jurisdiction, consult a qualified employment attorney before acting on anything VINDEX reports.
* **No Guarantee of Completeness:** VINDEX's detections are based on known signatures and heuristics. They are probabilistic and may miss tools that aren't yet in the signature list, or flag legitimate, disclosed activity.
* **Not Legal Advice:** This tool is not certified for use in legal proceedings or institutional decision-making on its own. It is intended for personal awareness and informational purposes.
* **Privacy Preserved:** VINDEX does not collect or store any user data on our servers, because we don't operate any. All detection happens locally, or against a backend you control.
* **Third-Party Vendors:** The vendors named in VINDEX's signature list are identified for informational purposes only. Their inclusion is not an accusation that any specific employer is using them against you, only that their known network signatures were observed on a page you visited.

---

## License

This project is licensed under the **MIT License**.
See [`LICENSE`](./LICENSE) for details.

---

<p align="center"><i>"Find out just what any people will quietly submit to and you have found out the exact measure of injustice and wrong which will be imposed upon them."</i></p> <p align="center">— Frederick Douglass</p>