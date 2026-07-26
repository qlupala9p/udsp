/* Top Words — mobile "More" sheet toggle, for pages that don't load
 * shared.js (about.html, help.html, games.html, listening.html). The 18
 * study-mode pages already get this same behaviour from shared.js. */
(function () {
  "use strict";
  var moreBtn = document.getElementById("more-btn");
  var sheet = document.getElementById("more-sheet");
  var closeBtn = document.getElementById("more-close");
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
    }
  } catch (e) {
    /* ignore storage errors (private mode) */
  }
})();
