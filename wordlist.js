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

function wordListItemHtml(w) {
  var k = wordKey(w);
  return (
    "<li>" +
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
    "</div>" +
    "</li>"
  );
}

// Guards chunked rendering below: bumped on every renderList() call so an
// in-progress chunk loop from a now-stale call (e.g. the user kept typing
// in the search box) can detect it's obsolete and stop appending, instead
// of two renders' chunks interleaving in the list.
var _wlRenderToken = 0;
// First chunk is small so *something* appears on screen almost instantly;
// later chunks are bigger since by then the user already sees a populated,
// scrollable list and small variations in per-chunk time are far less
// noticeable than the initial wait.
var WL_FIRST_CHUNK = 60;
var WL_CHUNK_SIZE = 300;
// Every individual CEFR level currently tops out around 3000 words, so this
// never trims a real single-level view -- it only kicks in for the
// aggregate "Mix" level (every level for a language concatenated, which can
// run to 8,000-13,000+ words), keeping even that worst case bounded to a
// reasonable render time instead of tens of seconds of background work.
var WL_RENDER_CAP = 4000;

function renderList(filter) {
  if (!listEl) return;
  var myToken = ++_wlRenderToken;
  filter = (filter || "").trim().toLowerCase();

  // Filtering itself (no HTML/DOM work yet) is cheap even for tens of
  // thousands of words, so it's fine to do it eagerly, all at once.
  var matches = WORDS.filter(function (w) {
    if (!wordMatchesFilter(w)) return false;
    if (
      filter &&
      w.word.toLowerCase().indexOf(filter) === -1 &&
      w.definition.toLowerCase().indexOf(filter) === -1
    ) {
      return false;
    }
    return true;
  });

  var capped = matches.length > WL_RENDER_CAP;
  var toRender = capped ? matches.slice(0, WL_RENDER_CAP) : matches;

  // Keep this counter in the same familiar "shown / total" shape either
  // way -- the trailing cap note (added once rendering finishes, below)
  // is where the fuller "first 4,000 of 17,360 matches" detail lives.
  setText("list-count", (capped ? WL_RENDER_CAP : matches.length) + " / " + WORDS.length);

  if (!matches.length) {
    listEl.innerHTML = '<li class="empty">No words match.</li>';
    return;
  }

  // Render in small batches across animation frames instead of building
  // every <li> in one giant innerHTML write. A CEFR level can now run into
  // the thousands of words, and "Mix" concatenates every level for a
  // language (tens of thousands for some languages) -- inserting that many
  // richly-nested list items (each with 3 mark buttons + 2 dictionary
  // links) in a single DOM operation is what caused the page to visibly
  // hang/freeze for several seconds on load, and again on every keystroke
  // while searching. Chunking keeps every individual frame fast, so
  // content appears almost immediately and the page stays responsive/
  // scrollable while the rest streams in, regardless of list size.
  listEl.innerHTML = "";
  var idx = 0;
  function renderChunk(size) {
    if (myToken !== _wlRenderToken) return; // superseded by a newer renderList() call
    var end = Math.min(idx + size, toRender.length);
    var html = [];
    for (; idx < end; idx++) {
      html.push(wordListItemHtml(toRender[idx]));
    }
    listEl.insertAdjacentHTML("beforeend", html.join(""));
    if (idx < toRender.length) {
      requestAnimationFrame(function () {
        renderChunk(WL_CHUNK_SIZE);
      });
    } else if (capped) {
      listEl.insertAdjacentHTML(
        "beforeend",
        '<li class="empty">Showing the first ' +
          WL_RENDER_CAP.toLocaleString() +
          " of " +
          matches.length.toLocaleString() +
          " matching words — search above to find a specific word, or pick a single level instead of Mix.</li>"
      );
    }
  }
  renderChunk(WL_FIRST_CHUNK);
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
