/* Top Words — Matching Pairs (memory) game page logic. Requires shared.js. */
"use strict";

var MEM_PAIRS = 8; // 8 pairs = 16 cards
var memoryActive = false;
var memLevel = null;
var memCards = []; // [{ pairId, kind: 'word'|'gloss', text, flipped, matched }]
var memFirstIdx = null;
var memSecondIdx = null;
var memBusy = false;
var memMoves = 0;
var memMatches = 0;
var memStartTime = null;
var memTimerInterval = null;
var memElapsedSec = 0;

function memGloss(w) {
  var def = w.definition || "";
  var idx = def.indexOf(" - ");
  return idx === -1 ? def : def.slice(idx + 3).trim();
}
function memEligible(w) {
  return !!(w && w.word && w.word.trim() && memGloss(w));
}
function memBestKey(level) {
  return "udsp_memory_best_" + currentLang + "_" + level + "_v1";
}
function memLoadBest(level) {
  try {
    return JSON.parse(localStorage.getItem(memBestKey(level))) || null;
  } catch (e) {
    return null;
  }
}
function memSaveBest(level, rec) {
  try {
    localStorage.setItem(memBestKey(level), JSON.stringify(rec));
  } catch (e) {
    /* ignore storage errors (private mode) */
  }
}
function memFormatTime(sec) {
  var m = Math.floor(sec / 60);
  var s = sec % 60;
  return m + ":" + (s < 10 ? "0" : "") + s;
}

function refreshMemoryStart() {
  var set = (WORD_SETS[currentLevel] || []).filter(memEligible);
  var ok = set.length >= MEM_PAIRS;
  setText("memory-start-level", levelLabel(currentLevel));
  setText(
    "memory-start-count",
    ok ? set.length + (set.length === 1 ? " word" : " words") + " available" : ""
  );
  setHidden("memory-start-warning", ok);
  if (!ok) {
    setText(
      "memory-start-warning",
      "Not enough words in this level for Matching Pairs (needs at least " +
        MEM_PAIRS +
        ") \u2014 pick another level above."
    );
  }
  var btn = $("memory-start-btn");
  if (btn) btn.disabled = !ok;
}

function showMemorySetup() {
  memoryActive = false;
  setPlayHeader(false);
  stopMemoryTimer();
  refreshMemoryStart();
  setHidden("memory-game", true);
  setHidden("memory-setup", false);
}

function resetMemory() {
  memoryActive = false;
  stopMemoryTimer();
  showMemorySetup();
}

function enterMemory() {
  if (!memoryActive) showMemorySetup();
}

function startMemory(level) {
  memLevel = level;
  memoryActive = true;
  setPlayHeader(true);
  setHidden("memory-setup", true);
  setHidden("memory-game", false);
  setText("memory-level-badge", levelLabel(level));
  newMemoryRound();
}

function newMemoryRound() {
  stopMemoryTimer();
  var pool = (WORD_SETS[memLevel] || []).filter(memEligible);
  var chosen = shuffle(pool).slice(0, MEM_PAIRS);
  var cards = [];
  chosen.forEach(function (w, i) {
    cards.push({ pairId: i, kind: "word", text: w.word, flipped: false, matched: false });
    cards.push({ pairId: i, kind: "gloss", text: memGloss(w), flipped: false, matched: false });
  });
  memCards = shuffle(cards);
  memFirstIdx = null;
  memSecondIdx = null;
  memBusy = false;
  memMoves = 0;
  memMatches = 0;
  memElapsedSec = 0;
  memStartTime = null;
  setText("memory-moves", "0");
  setText("memory-timer", "0:00");
  setHidden("memory-result", true);
  renderBestMemory();
  renderMemoryGrid();
}

function renderBestMemory() {
  var el = $("memory-best");
  if (!el) return;
  var best = memLoadBest(memLevel);
  el.textContent = best
    ? "Best: " + memFormatTime(best.time) + " · " + best.moves + " moves"
    : "";
}

function startMemoryTimer() {
  if (memTimerInterval) return;
  memStartTime = Date.now();
  memTimerInterval = setInterval(function () {
    memElapsedSec = Math.floor((Date.now() - memStartTime) / 1000);
    setText("memory-timer", memFormatTime(memElapsedSec));
  }, 1000);
}
function stopMemoryTimer() {
  if (memTimerInterval) {
    clearInterval(memTimerInterval);
    memTimerInterval = null;
  }
}

function renderMemoryGrid() {
  var box = $("memory-grid");
  if (!box) return;
  box.innerHTML = "";
  memCards.forEach(function (c, i) {
    var card = document.createElement("div");
    card.className =
      "memory-card" +
      (c.flipped || c.matched ? " is-flipped" : "") +
      (c.matched ? " is-matched" : "");
    card.innerHTML =
      '<div class="memory-card-inner">' +
      '<div class="memory-card-face memory-card-front">❓</div>' +
      '<div class="memory-card-face memory-card-back">' +
      escapeHtml(c.text) +
      "</div>" +
      "</div>";
    card.addEventListener("click", function () {
      memFlip(i);
    });
    box.appendChild(card);
  });
}

function memFlip(i) {
  if (memBusy) return;
  var c = memCards[i];
  if (!c || c.matched || c.flipped) return;
  if (memFirstIdx === null) startMemoryTimer();
  c.flipped = true;
  renderMemoryGrid();
  if (memFirstIdx === null) {
    memFirstIdx = i;
    return;
  }
  memSecondIdx = i;
  memMoves++;
  setText("memory-moves", memMoves);
  memBusy = true;
  var first = memCards[memFirstIdx];
  var second = memCards[memSecondIdx];
  if (first.pairId === second.pairId) {
    first.matched = true;
    second.matched = true;
    memMatches++;
    memFirstIdx = null;
    memSecondIdx = null;
    memBusy = false;
    renderMemoryGrid();
    if (memMatches >= MEM_PAIRS) finishMemory();
  } else {
    setTimeout(function () {
      first.flipped = false;
      second.flipped = false;
      memFirstIdx = null;
      memSecondIdx = null;
      memBusy = false;
      renderMemoryGrid();
    }, 900);
  }
}

function finishMemory() {
  stopMemoryTimer();
  var best = memLoadBest(memLevel);
  var isNewBest =
    !best ||
    memElapsedSec < best.time ||
    (memElapsedSec === best.time && memMoves < best.moves);
  if (isNewBest) memSaveBest(memLevel, { time: memElapsedSec, moves: memMoves });

  setText("memory-final-time", memFormatTime(memElapsedSec));
  setText("memory-final-moves", memMoves);
  var bestEl = $("memory-final-best");
  if (bestEl) {
    var b = memLoadBest(memLevel);
    bestEl.textContent = isNewBest
      ? "🏆 New best!"
      : "Best: " + memFormatTime(b.time) + " · " + b.moves + " moves";
  }
  setHidden("memory-result", false);
}

on("memory-start-btn", "click", function () {
  startMemory(currentLevel);
});
on("memory-back", "click", showMemorySetup);
on("memory-change", "click", showMemorySetup);
on("memory-restart", "click", newMemoryRound);

onLevelChange(resetMemory);
