/* Top Words — mobile "More" sheet toggle + study-mode <select> jump-menu,
 * for pages that don't load shared.js (about.html, help.html, games.html,
 * listening.html). The 18 study-mode pages already get this same behaviour
 * from shared.js (this is a small, deliberate ~4-line duplication rather
 * than a shared include, since the two script sets never load together). */
(function () {
  "use strict";
  var moreBtn = document.getElementById("more-btn");
  var sheet = document.getElementById("more-sheet");
  var closeBtn = document.getElementById("more-close");
  var modeSelect = document.getElementById("mode-select");
  // Size the compact App pill to its current value so it doesn't ellipsize
  // (mirrors sizeSelect() in shared.js; these pages don't load shared.js).
  function sizeModeSelect(sel) {
    if (!sel || !sel.options || !sel.options.length) return;
    var opt = sel.options[sel.selectedIndex] || sel.options[0];
    var cs = window.getComputedStyle(sel);
    var span = document.createElement("span");
    span.style.cssText =
      "position:absolute;top:-9999px;left:-9999px;visibility:hidden;white-space:pre;";
    span.style.fontFamily = cs.fontFamily;
    span.style.fontSize = cs.fontSize;
    span.style.fontWeight = cs.fontWeight;
    span.style.letterSpacing = cs.letterSpacing;
    span.textContent = opt ? opt.textContent : sel.value;
    document.body.appendChild(span);
    var w =
      span.offsetWidth +
      parseFloat(cs.paddingLeft || 0) +
      parseFloat(cs.paddingRight || 0) +
      parseFloat(cs.borderLeftWidth || 0) +
      parseFloat(cs.borderRightWidth || 0) +
      4;
    document.body.removeChild(span);
    sel.style.width = Math.max(44, Math.min(180, Math.round(w))) + "px";
  }
  if (modeSelect) {
    sizeModeSelect(modeSelect);
    modeSelect.addEventListener("change", function () {
      if (modeSelect.value) location.href = modeSelect.value;
    });
  }
  if (!moreBtn || !sheet) return;
  function openSheet() {
    sheet.hidden = false;
    document.body.classList.add("more-open");
  }
  function closeSheet() {
    sheet.hidden = true;
    document.body.classList.remove("more-open");
  }
  moreBtn.addEventListener("click", openSheet);
  if (closeBtn) closeBtn.addEventListener("click", closeSheet);
  sheet.addEventListener("click", function (e) {
    if (e.target === sheet) closeSheet();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !sheet.hidden) closeSheet();
  });
})();

// Header profile icon "is-linked" dot -- mirrors the same tiny check in
// shared.js/home.js (these 3 scripts never load together, so it's a small
// deliberate duplication rather than a shared include; see shared.js's
// PROFILE_LINKED_KEY comment for the full rationale).
(function () {
  var link = document.getElementById("profile-icon-link");
  if (!link) return;
  try {
    if (localStorage.getItem("udsp_profile_linked_v1") === "1") {
      link.classList.add("is-linked");
      link.setAttribute("data-tip", "Profil (giriş yapıldı) / Profile (signed in)");
      link.setAttribute("aria-label", "Profil (giriş yapıldı) / Profile (signed in)");
    }
  } catch (e) {
    /* ignore storage errors (private mode) */
  }
})();
