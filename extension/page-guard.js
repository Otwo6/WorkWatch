(function () {
const SOURCE = "workwatch-page-guard";
const SENSITIVE_KEY_EVENTS = new Set(["keydown", "keypress", "keyup", "beforeinput", "input"]);

function emit(kind, detail) {
	window.dispatchEvent(new CustomEvent("workwatch:sensitive-api", {
	detail: {
		source: SOURCE,
		kind,
		pageUrl: location.href,
		pageTitle: document.title,
		time: new Date().toISOString(),
		...detail
	}
	}));
}

function callSite() {
	try {
	const stack = new Error().stack || "";
	return stack
		.split("\n")
		.slice(2, 7)
		.map((line) => line.trim())
		.filter(Boolean)
		.join(" | ");
	} catch {
	return "";
	}
}

function targetName(target) {
	if (target === window) return "window";
	if (target === document) return "document";
	if (target === document.documentElement) return "documentElement";
	if (target === document.body) return "body";
	return target && target.constructor ? target.constructor.name : "unknown";
}

if (navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === "function")
{
	const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);

	Object.defineProperty(navigator.mediaDevices, "getDisplayMedia", {
	configurable: true,
	writable: true,
	value: function guardedGetDisplayMedia(...args) {
		const hasRecentUserActivation = Boolean(navigator.userActivation && navigator.userActivation.isActive);

		emit("screen_capture_request", {
		label: hasRecentUserActivation
			? "Page requested screen capture after user activation"
			: "Page requested screen capture without a visible user activation",
		severity: hasRecentUserActivation ? "medium" : "high",
		userActivation: hasRecentUserActivation,
		callSite: callSite()
		});

		return originalGetDisplayMedia(...args);
	}
	});
}

const originalAddEventListener = EventTarget.prototype.addEventListener;

EventTarget.prototype.addEventListener = function guardedAddEventListener(type, listener, options) {
	const eventType = String(type || "").toLowerCase();
	const isGlobalTarget = this === document || this === window || this === document.documentElement || this === document.body;

	if (isGlobalTarget && SENSITIVE_KEY_EVENTS.has(eventType))
{
	emit("global_keyboard_listener", {
		label: `Page attached a global ${eventType} listener`,
		severity: eventType === "keydown" || eventType === "keypress" ? "medium" : "low",
		eventType,
		target: targetName(this),
		capture: typeof options === "boolean" ? options : Boolean(options && options.capture),
		callSite: callSite()
	});
	}

	return originalAddEventListener.call(this, type, listener, options);
};
})();
