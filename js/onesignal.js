/* =====================================================================
 * UnoSignal Skate Store — OneSignal Web SDK initialization
 * ---------------------------------------------------------------------
 * Docs:
 *   Web SDK setup:  https://documentation.onesignal.com/docs/web-push-quickstart
 *   API reference:  https://documentation.onesignal.com/docs/web-sdk
 * ===================================================================== */

window.OneSignalDeferred = window.OneSignalDeferred || [];

OneSignalDeferred.push(async function (OneSignal) {
  await OneSignal.init({
    appId: "03a500f9-c19c-4782-b9f4-e5f7becf201d",
  });

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
