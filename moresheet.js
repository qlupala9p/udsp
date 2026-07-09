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
  if (modeSelect) {
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
