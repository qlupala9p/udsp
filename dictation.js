/* Top Words — Listening Dictation game page logic. Requires shared.js. */
"use strict";

var DICT_MAX_WRONG = 3;
var dictationActive = false;
var dictationWins = 0;
var dictationLosses = 0;
var dictLevel = null;
var dictWord = null;
var dictWrong = 0;
var dictDone = false;
var dictHintUsed = false;

function dictEligible(w) {
  return !!(w && w.word && w.word.trim());
}

function refreshDictationStart() {
  var set = (WORD_SETS[currentLevel] || []).filter(dictEligible);
  var ok = set.length > 0;
  setText("dictation-start-level", levelLabel(currentLevel));
  setText(
    "dictation-start-count",
    ok ? set.length + (set.length === 1 ? " word" : " words") + " available" : ""
  );
  setHidden("dictation-start-warning", ok);
  if (!ok) {
    setText(
      "dictation-start-warning",
      "No words available in this level for Listening Dictation \u2014 pick another level above."
    );
  }
  var btn = $("dictation-start-btn");
  if (btn) btn.disabled = !ok;
}

function showDictationSetup() {
  dictationActive = false;
  setPlayHeader(false);
  refreshDictationStart();
  setHidden("dictation-game", true);
  setHidden("dictation-setup", false);
}

function resetDictation() {
  dictationActive = false;
  showDictationSetup();
}

function enterDictation() {
  if (!dictationActive) showDictationSetup();
}

function startDictation(level) {
  dictLevel = level;
  dictationActive = true;
  setPlayHeader(true);
  setHidden("dictation-setup", true);
  setHidden("dictation-game", false);
  setText("dictation-level-badge", levelLabel(level));
  setText("dictation-max", DICT_MAX_WRONG);
  setText("dictation-wins", dictationWins);
  setText("dictation-losses", dictationLosses);
  newDictationWord();
}

function dictPickWord(level) {
  var pool = (WORD_SETS[level] || []).filter(dictEligible);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function newDictationWord() {
  var w = dictPickWord(dictLevel);
  if (!w) {
    showDictationSetup();
    return;
  }
  dictWord = w;
  dictWrong = 0;
  dictDone = false;
  dictHintUsed = false;
  setText("dictation-wrong", "0");
  setHidden("dictation-result", true);
  setHidden("dictation-hint", true);
  var hintBtn = $("dictation-hint-btn");
  if (hintBtn) hintBtn.disabled = false;
  var input = $("dictation-input");
  if (input) {
    input.value = "";
    input.classList.remove("is-correct", "is-wrong");
    input.disabled = false;
  }
  var fb = $("dictation-feedback");
  if (fb) {
    fb.textContent = "";
    fb.className = "feedback";
  }
  dictPlay();
}

function dictPlay() {
  if (dictWord) speak(dictWord.word);
}

function dictSubmit() {
  if (dictDone) return;
  var input = $("dictation-input");
  if (!input || !input.value.trim()) return;
  var fb = $("dictation-feedback");
  if (fuzzyMatch(input.value, dictWord.word)) {
    input.classList.add("is-correct");
    endDictation(true);
    return;
  }
  input.classList.add("is-wrong");
  dictWrong++;
  setText("dictation-wrong", dictWrong);
  if (fb) {
    fb.textContent = "❌ Try again";
    fb.className = "feedback no";
  }
  if (dictWrong >= DICT_MAX_WRONG) {
    endDictation(false);
    return;
  }
  setTimeout(function () {
    input.classList.remove("is-wrong");
    input.value = "";
    input.focus();
  }, 600);
}

function endDictation(win) {
  dictDone = true;
  var input = $("dictation-input");
  if (input) input.disabled = true;
  var hintBtn = $("dictation-hint-btn");
  if (hintBtn) hintBtn.disabled = true;

  if (!win) {
    dictationLosses++;
    setText("dictation-losses", dictationLosses);
  } else {
    dictationWins++;
    setText("dictation-wins", dictationWins);
  }

  var w = dictWord;
  var rt = $("dictation-result-text");
  if (rt) {
    rt.textContent = win ? "🎉 Correct!" : "💀 Game over";
    rt.className = "hangman-result-text " + (win ? "win" : "lose");
  }
  var ansEl = $("dictation-answer");
  if (ansEl) {
    ansEl.innerHTML =
      '<span class="hm-answer-label">Word:</span> <strong>' +
      escapeHtml(w.word) +
      "</strong>";
  }
  var ex = $("dictation-example");
  if (ex) {
    ex.textContent = w.example || "";
    ex.hidden = !w.example;
  }
  var linkDetails = $("dictation-link-details");
  if (linkDetails) linkDetails.href = vocabDetailsUrl(w.word);
  var linkExamples = $("dictation-link-examples");
  if (linkExamples) linkExamples.href = vocabExamplesUrl(w.word);
  setHidden("dictation-result", false);
}

on("dictation-play-btn", "click", dictPlay);
on("dictation-submit", "click", dictSubmit);
on("dictation-hint-btn", "click", function () {
  if (dictDone || dictHintUsed) return;
  dictHintUsed = true;
  var def = dictWord.definition || "";
  setText("dictation-hint", def);
  var btn = $("dictation-hint-btn");
  if (btn) btn.disabled = true;
  if (def) showPopover('<p class="example">' + escapeHtml(def) + "</p>");
});
on("dictation-start-btn", "click", function () {
  startDictation(currentLevel);
});
on("dictation-back", "click", showDictationSetup);
on("dictation-change", "click", showDictationSetup);
on("dictation-next", "click", newDictationWord);

document.addEventListener("keydown", function (e) {
  var input = $("dictation-input");
  if (!input || document.activeElement !== input) return;
  if (e.key === "Enter") {
    e.preventDefault();
    dictSubmit();
  }
});

onLevelChange(resetDictation);
