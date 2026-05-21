/* =====================================================================
 * UnoSignal Skate Store — OneSignal Web SDK initialization
 * ---------------------------------------------------------------------
 * This file is a placeholder for the OneSignal Web SDK setup.
 * Replace YOUR_ONESIGNAL_APP_ID with the App ID from the dashboard.
 *
 * Docs:
 *   Web SDK setup:  https://documentation.onesignal.com/docs/web-push-quickstart
 *   API reference:  https://documentation.onesignal.com/docs/web-sdk
 * ===================================================================== */

window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function (OneSignal) {
  await OneSignal.init({
    appId: "YOUR_ONESIGNAL_APP_ID",
    safari_web_id: "YOUR_SAFARI_WEB_ID", // optional
    notifyButton: { enable: true },
    allowLocalhostAsSecureOrigin: true,
  });

  // Example: request push permission on first load.
  // OneSignal.Notifications.requestPermission();

  // Tag every visitor with a default segment-friendly tag.
  // OneSignal.User.addTag("site_section", "home");

  // Make the SDK accessible to the rest of our scripts.
  window.OneSignalReady = true;
  document.dispatchEvent(new CustomEvent("onesignal:ready"));
});

/* ---------------------------------------------------------------------
 * Tiny helper so other scripts don't have to handle the deferred queue
 * themselves. Usage:
 *   withOneSignal(os => os.User.addTag("last_viewed_category", "decks"));
 * ------------------------------------------------------------------ */
window.withOneSignal = function (fn) {
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(fn);
};
