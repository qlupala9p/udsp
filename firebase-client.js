/* Top Words — Firebase Auth + Firestore profile client.
 * Uses the Firebase COMPAT SDK (classic <script> globals, no bundler/no
 * `type="module"`) so it fits this app's existing plain-global-script
 * architecture (see shared.js/home.js precedent). Loaded only on
 * profile.html, right after firebase-{app,auth,firestore}-compat.js and
 * firebase-config.js.
 *
 * Exposes a small public API on window.TWAuth for profile.js to call:
 *   signIn(providerId), signOut(), onAuthChange(cb),
 *   saveProfileFromLocal(), loadProfileToLocal(),
 *   deleteProfileDoc(), deleteAccountAndProfile(), currentUser()
 *
 * Data model: one Firestore document per user at users/{uid} (uid = the
 * Firebase Auth UID) — see firestore.rules for the security rules this
 * depends on (create/update/delete restricted to request.auth.uid === the
 * document's own id). Profile documents mirror the SAME localStorage keys
 * shared.js/home.js already use (kept in sync by hand, same precedent as
 * home.js's own header comment), so signing in on a new device can pull
 * existing progress down, and this device's progress can be pushed up.
 */
"use strict";
(function () {
  var KNOWN_KEY = "udsp_known_v1";
  var FAV_KEY = "udsp_fav_v1";
  var STREAK_KEY = "udsp_streak_v1";
  var GOAL_KEY = "udsp_daily_v1";
  var RESUME_KEY = "udsp_resume_v2";

  function lsGet(k, d) {
    try {
      var v = JSON.parse(localStorage.getItem(k));
      return v === null || v === undefined ? d : v;
    } catch (e) {
      return d;
    }
  }
  function lsSet(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }

  if (!window.firebase || !window.FIREBASE_CONFIG) {
    console.error("TWAuth: Firebase SDK or FIREBASE_CONFIG missing — check script load order in profile.html.");
    return;
  }
  if (!window.FIREBASE_CONFIG.apiKey || /REPLACE_ME/.test(window.FIREBASE_CONFIG.apiKey)) {
    // firebase-config.js still has placeholders — profile.js checks this
    // itself before rendering sign-in UI; just avoid a noisy init crash here.
    console.warn("TWAuth: firebase-config.js still has placeholder values — not initializing.");
    return;
  }

  firebase.initializeApp(window.FIREBASE_CONFIG);
  var auth = firebase.auth();
  var db = firebase.firestore();

  var PROVIDERS = {
    google: function () {
      return new firebase.auth.GoogleAuthProvider();
    },
    facebook: function () {
      return new firebase.auth.FacebookAuthProvider();
    },
    microsoft: function () {
      return new firebase.auth.OAuthProvider("microsoft.com");
    },
    apple: function () {
      return new firebase.auth.OAuthProvider("apple.com");
    },
    // Requires the Firebase project to be upgraded to "Identity Platform"
    // plus a Generic OIDC provider configured in the console with exactly
    // this provider id (LinkedIn supports "Sign In with LinkedIn using
    // OpenID Connect" — use its client id/secret + issuer there).
    linkedin: function () {
      return new firebase.auth.OAuthProvider("oidc.linkedin");
    },
  };

  function profileRef(uid) {
    return db.collection("users").doc(uid);
  }

  function localSnapshot() {
    return {
      known: lsGet(KNOWN_KEY, {}),
      fav: lsGet(FAV_KEY, {}),
      streak: lsGet(STREAK_KEY, { current: 0, longest: 0, last: "" }),
      daily: lsGet(GOAL_KEY, { date: "", count: 0, goal: 20 }),
      resume: lsGet(RESUME_KEY, null),
    };
  }

  function applyToLocal(data) {
    if (!data) return;
    if (data.known) lsSet(KNOWN_KEY, data.known);
    if (data.fav) lsSet(FAV_KEY, data.fav);
    if (data.streak) lsSet(STREAK_KEY, data.streak);
    if (data.daily) lsSet(GOAL_KEY, data.daily);
    if (data.resume) lsSet(RESUME_KEY, data.resume);
  }

  function signIn(providerId) {
    var build = PROVIDERS[providerId];
    if (!build) return Promise.reject(new Error("Unknown provider: " + providerId));
    return auth.signInWithPopup(build()).then(function (result) {
      var user = result.user;
      var ref = profileRef(user.uid);
      return ref.get().then(function (snap) {
        if (snap.exists) {
          // Returning profile already in the cloud -> this device adopts it.
          applyToLocal(snap.data());
        } else {
          // First-ever sign-in on any device -> seed the cloud profile from
          // whatever this device already has in localStorage.
          var seed = Object.assign(
            {
              uid: user.uid,
              displayName: user.displayName || "",
              email: user.email || "",
              photoURL: user.photoURL || "",
              provider: providerId,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
            localSnapshot()
          );
          return ref.set(seed);
        }
      }).then(function () {
        return user;
      });
    });
  }

  function signOutUser() {
    return auth.signOut();
  }

  function onAuthChange(cb) {
    return auth.onAuthStateChanged(cb);
  }

  function saveProfileFromLocal() {
    var user = auth.currentUser;
    if (!user) return Promise.reject(new Error("Not signed in."));
    var data = Object.assign({ uid: user.uid, updatedAt: Date.now() }, localSnapshot());
    return profileRef(user.uid).set(data, { merge: true });
  }

  function loadProfileToLocal() {
    var user = auth.currentUser;
    if (!user) return Promise.reject(new Error("Not signed in."));
    return profileRef(user.uid).get().then(function (snap) {
      if (snap.exists) applyToLocal(snap.data());
      return snap.exists ? snap.data() : null;
    });
  }

  function deleteProfileDoc() {
    var user = auth.currentUser;
    if (!user) return Promise.reject(new Error("Not signed in."));
    return profileRef(user.uid).delete();
  }

  function deleteAccountAndProfile() {
    var user = auth.currentUser;
    if (!user) return Promise.reject(new Error("Not signed in."));
    return deleteProfileDoc().then(function () {
      // May reject with auth/requires-recent-login if the session is old;
      // profile.js surfaces that error message as-is rather than building
      // a full re-authentication flow here.
      return user.delete();
    });
  }

  window.TWAuth = {
    signIn: signIn,
    signOut: signOutUser,
    onAuthChange: onAuthChange,
    saveProfileFromLocal: saveProfileFromLocal,
    loadProfileToLocal: loadProfileToLocal,
    deleteProfileDoc: deleteProfileDoc,
    deleteAccountAndProfile: deleteAccountAndProfile,
    currentUser: function () {
      return auth.currentUser;
    },
  };
})();
