/* =====================================================================
 * Fake auth flow for the UnoSignal Skate Store.
 *
 * The "session" is just a JSON object in localStorage so the demo is
 * self-contained. This is where the OneSignal identity calls belong:
 *
 *   - OneSignal.login(externalId)            on sign in / sign up
 *   - OneSignal.User.addEmail(email)         to subscribe their email
 *   - OneSignal.User.addSms(phoneNumber)     to subscribe SMS
 *   - OneSignal.User.addTags({ ... })        to apply profile tags
 *   - OneSignal.logout()                     on sign out
 * ===================================================================== */

const SESSION_KEY = "unosignal_session";

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch (e) {
    return null;
  }
}

function writeSession(session) {
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  updateAuthUI();
}

function updateAuthUI() {
  const session = readSession();
  document.querySelectorAll("[data-auth-name]").forEach(function (el) {
    el.textContent = session ? session.name : "Sign in";
  });
  document.querySelectorAll("[data-auth-link]").forEach(function (el) {
    el.setAttribute("href", session ? "#" : "account.html");
    el.onclick = session
      ? function (e) {
          e.preventDefault();
          window.signOut();
        }
      : null;
  });

  const signedInPanel = document.getElementById("signed-in-panel");
  const signedOutPanel = document.getElementById("signed-out-panel");
  if (signedInPanel && signedOutPanel) {
    if (session) {
      signedInPanel.style.display = "block";
      signedOutPanel.style.display = "none";
      document.getElementById("session-email").textContent = session.email;
      document.getElementById("session-external-id").textContent =
        session.externalId;
    } else {
      signedInPanel.style.display = "none";
      signedOutPanel.style.display = "block";
    }
  }
}

window.signIn = function (form) {
  const data = new FormData(form);
  const email = data.get("email").trim();
  const name = (data.get("name") || email.split("@")[0]).trim();
  const externalId = "user_" + email.toLowerCase().replace(/[^a-z0-9]/g, "_");

  writeSession({ email: email, name: name, externalId: externalId });

  // -----------------------------------------------------------------
  // OneSignal: identify the user with their stable External ID
  // and create an email subscription.
  // -----------------------------------------------------------------
  withOneSignal(async function (OneSignal) {
    await OneSignal.login(externalId);

    OneSignal.User.addEmail(email);

    // Apply onboarding tags so segmentation works straight away.
    OneSignal.User.addTags({
      account_status: "signed_in",
      signup_source: "web_demo",
      first_name: name,
    });

    window.location.href = "index.html";
  });

  return false;
};

window.signOut = function () {
  const session = readSession();
  const externalId = session?.externalId || "unknown";

  writeSession(null);

  // -----------------------------------------------------------------
  // OneSignal: remove external ID and set tags.
  // -----------------------------------------------------------------

  withOneSignal(async function (OneSignal) {
    // Apply account_status tag. add tag for who they were (just to find them later)
    OneSignal.User.addTags({
      account_status: "signed_out",
      who_this: externalId,
    });

    await OneSignal.logout();

    window.location.href = "index.html";
  });
};

document.addEventListener("DOMContentLoaded", updateAuthUI);
