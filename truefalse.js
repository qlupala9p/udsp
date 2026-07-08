/* Top Words — True or False Blitz game page logic. Requires shared.js. */
"use strict";

var TF_ROUNDS = 20;
var tfActive = false;
var tfLevel = null;
var tfRound = 0;
var tfScore = 0;
var tfDone = false;
var tfAnswered = false;
var tfCurrent = null; // { word, shownDef, isTrue }
var tfHintUsed = false;

function tfBestKey(level) {
  return "udsp_truefalse_best_" + currentLang + "_" + level + "_v1";
}
function tfLoadBest(level) {
  var v = parseInt(localStorage.getItem(tfBestKey(level)), 10);
  return isNaN(v) ? 0 : v;
}
function tfSaveBest(level, score) {
  try {
    localStorage.setItem(tfBestKey(level), String(score));
  } catch (e) {
    /* ignore storage errors (private mode) */
  }
}
function tfEligible(w) {
  return !!(w && w.word && w.definition);
}

function refreshTrueFalseStart() {
  var set = (WORD_SETS[currentLevel] || []).filter(tfEligible);
  var ok = set.length >= 5;
  setText("truefalse-start-level", levelLabel(currentLevel));
  setText(
    "truefalse-start-count",
    ok ? set.length + (set.length === 1 ? " word" : " words") + " available" : ""
  );
  setHidden("truefalse-start-warning", ok);
  if (!ok) {
    setText(
      "truefalse-start-warning",
      "Not enough words in this level for True or False Blitz (needs at least 5) \u2014 pick another level above."
    );
  }
  var btn = $("truefalse-start-btn");
  if (btn) btn.disabled = !ok;
}

function showTrueFalseSetup() {
  tfActive = false;
  setPlayHeader(false);
  refreshTrueFalseStart();
  setHidden("truefalse-game", true);
  setHidden("truefalse-setup", false);
}

function resetTrueFalse() {
  tfActive = false;
  showTrueFalseSetup();
}

function enterTrueFalse() {
  if (!tfActive) showTrueFalseSetup();
}

function startTrueFalse(level) {
  tfLevel = level;
  tfActive = true;
  tfDone = false;
  setPlayHeader(true);
  setHidden("truefalse-setup", true);
  setHidden("truefalse-game", false);
  setHidden("truefalse-result", true);
  setText("truefalse-level-badge", levelLabel(level));
  tfRound = 0;
  tfScore = 0;
  setText("truefalse-score", "0");
  tfNextRound();
}

function tfNextRound() {
  if (tfDone) return;
  if (tfRound >= TF_ROUNDS) {
    endTrueFalse();
    return;
  }
  var pool = (WORD_SETS[tfLevel] || []).filter(tfEligible);
  if (pool.length < 2) {
    endTrueFalse();
    return;
  }
  tfRound++;
  setText("truefalse-progress", "Round " + tfRound + " / " + TF_ROUNDS);
  var w = pool[Math.floor(Math.random() * pool.length)];
  var isTrue = Math.random() < 0.5;
  var shownDef = w.definition;
  if (!isTrue) {
    var others = pool.filter(function (p) {
      return p !== w;
    });
    var decoy = others[Math.floor(Math.random() * others.length)];
    shownDef = decoy.definition;
  }
  tfCurrent = { word: w, shownDef: shownDef, isTrue: isTrue };
  tfAnswered = false;
  tfHintUsed = false;
  setHidden("truefalse-hint", true);
  setText("truefalse-hint", "");
  var tfHintBtn = $("truefalse-hint-btn");
  if (tfHintBtn) tfHintBtn.disabled = !w.example;
  setText("truefalse-word", w.word);
  setText("truefalse-word-pos", w.pos || "");
  setText("truefalse-def", shownDef || "");
  var trueBtn = $("truefalse-true-btn");
  var falseBtn = $("truefalse-false-btn");
  [trueBtn, falseBtn].forEach(function (b) {
    if (b) {
      b.disabled = false;
      b.classList.remove("is-correct", "is-wrong");
    }
  });
}

function tfAnswer(userSaysTrue) {
  if (tfDone || tfAnswered || !tfCurrent) return;
  tfAnswered = true;
  var correct = userSaysTrue === tfCurrent.isTrue;
  var trueBtn = $("truefalse-true-btn");
  var falseBtn = $("truefalse-false-btn");
  if (trueBtn) trueBtn.disabled = true;
  if (falseBtn) falseBtn.disabled = true;
  var pickedBtn = userSaysTrue ? trueBtn : falseBtn;
  var rightBtn = tfCurrent.isTrue ? trueBtn : falseBtn;
  if (correct) {
    if (pickedBtn) pickedBtn.classList.add("is-correct");
    tfScore++;
    setText("truefalse-score", tfScore);
  } else {
    if (pickedBtn) pickedBtn.classList.add("is-wrong");
    if (rightBtn) rightBtn.classList.add("is-correct");
  }
  setTimeout(function () {
    if (!tfDone) tfNextRound();
  }, 500);
}

// Hint: reveal an example sentence using the word (a context clue, not a
// direct true/false answer). Disabled when the word has no example.
function tfHint() {
  if (tfDone || tfAnswered || !tfCurrent || tfHintUsed) return;
  var ex = tfCurrent.word.example || "";
  if (!ex) return;
  tfHintUsed = true;
  setText("truefalse-hint", "Example: " + ex);
  setHidden("truefalse-hint", false);
  var btn = $("truefalse-hint-btn");
  if (btn) btn.disabled = true;
}

function endTrueFalse() {
  tfDone = true;
  var best = tfLoadBest(tfLevel);
  var isNewBest = tfScore > best;
  if (isNewBest) tfSaveBest(tfLevel, tfScore);
  setText("truefalse-final-score", tfScore + " / " + TF_ROUNDS);
  var bestEl = $("truefalse-final-best");
  if (bestEl) {
    bestEl.textContent = isNewBest
      ? "🏆 New best!"
      : "Best: " + Math.max(best, tfScore) + " / " + TF_ROUNDS;
  }
  setHidden("truefalse-result", false);
}

on("truefalse-true-btn", "click", function () {
  tfAnswer(true);
});
on("truefalse-false-btn", "click", function () {
  tfAnswer(false);
});
on("truefalse-hint-btn", "click", tfHint);
on("truefalse-audio", "click", function () {
  if (tfCurrent) speak(tfCurrent.word.word);
});
on("truefalse-start-btn", "click", function () {
  startTrueFalse(currentLevel);
});
on("truefalse-back", "click", showTrueFalseSetup);
on("truefalse-change", "click", showTrueFalseSetup);
on("truefalse-restart", "click", function () {
  startTrueFalse(tfLevel);
});

document.addEventListener("keydown", function (e) {
  var g = $("truefalse-game");
  if (!g || g.hidden || tfDone) return;
  if (e.key === "ArrowLeft" || e.key === "1") tfAnswer(true);
  else if (e.key === "ArrowRight" || e.key === "2") tfAnswer(false);
});

onLevelChange(resetTrueFalse);
