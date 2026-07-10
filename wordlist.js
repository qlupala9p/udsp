/* Top Words — Word List page logic. Requires shared.js to be loaded first. */
"use strict";

var listEl = $("word-list");
var searchEl = $("list-search");
var listFilter = "all";

function wordMatchesFilter(w) {
  var k = wordKey(w);
  if (listFilter === "fav") return !!fav[k];
  if (listFilter === "known") return !!known[k];
  if (listFilter === "unknown") return !known[k];
  return true;
}

function renderList(filter) {
  if (!listEl) return;
  filter = (filter || "").trim().toLowerCase();
  listEl.innerHTML = "";
  var shown = 0;
  WORDS.forEach(function (w) {
    if (!wordMatchesFilter(w)) return;
    if (
      filter &&
      w.word.toLowerCase().indexOf(filter) === -1 &&
      w.definition.toLowerCase().indexOf(filter) === -1
    ) {
      return;
    }
    shown++;
    var k = wordKey(w);
    var li = document.createElement("li");
    li.innerHTML =
      '<div class="wl-head"><span class="wl-word">' +
      escapeHtml(w.word) +
      '</span><span class="wl-pos">' +
      escapeHtml(w.pos) +
      "</span>" +
      '<span class="wl-marks">' +
      '<button class="mark-btn mark-audio" data-act="audio" data-key="' +
      escapeHtml(k) +
      '" title="Listen">🔊</button>' +
      '<button class="mark-btn mark-known' +
      (known[k] ? " is-on" : "") +
      '" data-act="known" data-key="' +
      escapeHtml(k) +
      '" title="Mark as known">✓</button>' +
      '<button class="mark-btn mark-fav' +
      (fav[k] ? " is-on" : "") +
      '" data-act="fav" data-key="' +
      escapeHtml(k) +
      '" title="Favorite">★</button>' +
      "</span></div>" +
      '<div class="wl-def">' +
      escapeHtml(w.definition) +
      "</div>" +
      (w.example && !isPlaceholderExample(w.example)
        ? '<div class="wl-example">' + escapeHtml(w.example) + "</div>"
        : "") +
      '<div class="wl-link">' +
      vocabLinkHtml(w.word) +
      "</div>";
    listEl.appendChild(li);
  });
  if (shown === 0) {
    listEl.innerHTML = '<li class="empty">No words match.</li>';
  }
  setText("list-count", shown + " / " + WORDS.length);
}

on("list-search", "input", function () {
  renderList(searchEl.value);
});
if (listEl) {
  listEl.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest(".mark-btn") : null;
    if (!btn) return;
    var act = btn.getAttribute("data-act");
    var k = btn.getAttribute("data-key");
    if (act === "audio") {
      speak(k.split("|")[1]);
      return;
    }
    var store = act === "known" ? known : fav;
    var sk = act === "known" ? KNOWN_KEY : FAV_KEY;
    if (store[k]) delete store[k];
    else store[k] = 1;
    lsSet(sk, store);
    btn.classList.toggle("is-on", !!store[k]);
    if (listFilter !== "all") renderList(searchEl.value);
  });
}
document.querySelectorAll("#list-filters .chip-btn").forEach(function (b) {
  b.addEventListener("click", function () {
    listFilter = b.getAttribute("data-filter");
    document.querySelectorAll("#list-filters .chip-btn").forEach(function (x) {
      x.classList.toggle("is-on", x === b);
    });
    renderList(searchEl ? searchEl.value : "");
  });
});

onLevelChange(function () {
  if (searchEl) searchEl.value = "";
  renderList("");
});
