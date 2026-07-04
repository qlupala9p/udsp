/* Top Words — mobile "More" sheet toggle for pages that don't load shared.js
 * (about.html, help.html). The 7 study-mode pages already get this same
 * behaviour from shared.js. */
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
