/* Top Words — Profile page rendering (profile.html only).
 * Talks only to window.TWAuth (firebase-client.js); never touches the
 * Firebase SDK directly. Renders three states: not-configured (placeholder
 * firebase-config.js values), signed-out (5 provider buttons), signed-in
 * (profile summary + cloud-sync buttons + delete-profile danger zone).
 */
"use strict";
(function () {
  function $(id) {
    return document.getElementById(id);
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  var PROVIDER_ORDER = ["google", "facebook", "microsoft", "apple", "linkedin"];
  var PROVIDER_LABEL = {
    google: "🔴 Google",
    facebook: "🔵 Meta",
    microsoft: "🟦 Microsoft",
    apple: "⬛ Apple",
    linkedin: "🔷 LinkedIn",
  };

  function configIsPlaceholder() {
    var c = window.FIREBASE_CONFIG || {};
    return !c.apiKey || /REPLACE_ME/.test(c.apiKey);
  }

  function renderNotConfigured(root) {
    root.innerHTML =
      '<section class="home-hero">' +
      '<h1 class="home-title">👤 Profil · Profile</h1>' +
      '<p class="home-sub">Firebase henüz yapılandırılmadı — <code>firebase-config.js</code> içindeki REPLACE_ME değerlerini Firebase Console\u2019dan alıp doldurun. · ' +
      "Firebase isn\u2019t configured yet — fill in the REPLACE_ME values in firebase-config.js from the Firebase Console.</p>" +
      "</section>";
  }

  function renderSignedOut(root) {
    var html = '<section class="home-hero">';
    html += '<h1 class="home-title">👤 Profil · Profile</h1>';
    html += '<p class="home-sub">İlerlemeni bulutta saklamak için giriş yap. · Sign in to store your progress in the cloud.</p>';
    html += '<div class="home-langs">';
    PROVIDER_ORDER.forEach(function (id) {
      html += '<button type="button" class="home-lang-btn" data-provider="' + id + '">' + PROVIDER_LABEL[id] + "</button>";
    });
    html += "</div>";
    html += '<p id="profile-msg" class="home-goal" hidden></p>';
    html += "</section>";
    root.innerHTML = html;

    Array.prototype.forEach.call(root.querySelectorAll("[data-provider]"), function (b) {
      b.addEventListener("click", function () {
        var msg = $("profile-msg");
        msg.hidden = true;
        msg.classList.remove("err");
        window.TWAuth.signIn(b.getAttribute("data-provider")).catch(function (err) {
          msg.textContent = "Giriş başarısız · Sign-in failed: " + (err && err.message ? err.message : err);
          msg.classList.add("err");
          msg.hidden = false;
        });
      });
    });
  }

  function renderSignedIn(root, user) {
    var html = '<section class="home-hero">';
    html += '<h1 class="home-title">👋 ' + esc(user.displayName || user.email || "Kullanıcı") + "</h1>";
    if (user.email) html += '<p class="home-sub">' + esc(user.email) + "</p>";
    html += '<div class="home-langs">';
    html += '<button type="button" class="home-lang-btn" id="profile-sync-down">⬇️ Buluttan al · Load from cloud</button>';
    html += '<button type="button" class="home-lang-btn" id="profile-sync-up">⬆️ Buluta kaydet · Save to cloud</button>';
    html += '<button type="button" class="home-lang-btn" id="profile-signout">🚪 Çıkış · Sign out</button>';
    html += "</div>";
    html += '<p id="profile-msg" class="home-goal" hidden></p>';
    html += "</section>";
    html += '<section class="home-hero">';
    html += '<h2 class="home-section-title">⚠️ Tehlikeli bölge · Danger zone</h2>';
    html += '<p class="home-sub">Profilini silmek yalnızca buluttaki kaydını kaldırır; bu cihazdaki yerel ilerlemen etkilenmez. · Deleting your profile only removes the cloud record; local progress on this device is unaffected.</p>';
    html += '<button type="button" class="home-lang-btn is-danger" id="profile-delete">🗑️ Profilimi sil · Delete my profile</button>';
    html += "</section>";
    root.innerHTML = html;

    function showMsg(text, isErr) {
      var el = $("profile-msg");
      el.textContent = text;
      el.classList.toggle("err", !!isErr);
      el.classList.toggle("ok", !isErr);
      el.hidden = false;
    }

    $("profile-sync-down").addEventListener("click", function () {
      window.TWAuth.loadProfileToLocal()
        .then(function () {
          showMsg("✓ Bulut verisi bu cihaza yüklendi. · Cloud data loaded onto this device.", false);
        })
        .catch(function (e) {
          showMsg("Hata · Error: " + e.message, true);
        });
    });
    $("profile-sync-up").addEventListener("click", function () {
      window.TWAuth.saveProfileFromLocal()
        .then(function () {
          showMsg("✓ Bu cihazın verisi buluta kaydedildi. · This device's data was saved to the cloud.", false);
        })
        .catch(function (e) {
          showMsg("Hata · Error: " + e.message, true);
        });
    });
    $("profile-signout").addEventListener("click", function () {
      window.TWAuth.signOut();
    });
    $("profile-delete").addEventListener("click", function () {
      if (!confirm("Profilini kalıcı olarak silmek istediğine emin misin? · Permanently delete your cloud profile?")) return;
      window.TWAuth.deleteProfileDoc()
        .then(function () {
          showMsg("✓ Profil silindi. · Profile deleted.", false);
        })
        .catch(function (e) {
          showMsg("Hata · Error: " + e.message, true);
        });
    });
  }

  function boot() {
    var root = $("profile-root");
    if (!root) return;
    if (configIsPlaceholder() || !window.TWAuth) {
      renderNotConfigured(root);
      return;
    }
    root.innerHTML = '<p class="home-sub" style="text-align:center">Yükleniyor… · Loading…</p>';
    window.TWAuth.onAuthChange(function (user) {
      if (user) renderSignedIn(root, user);
      else renderSignedOut(root);
    });
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
