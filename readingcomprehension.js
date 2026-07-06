/* Top Words — Reading Comprehension game page logic. Requires shared.js.
 *
 * Data source: this game reads window.READING_PASSAGES, populated by
 * data/readingcomp.js -- a set of ORIGINAL (not scraped/copied) short
 * reading passages for grades 1-12, each with 5 multiple-choice
 * comprehension questions. Like Word Morph, this game deliberately does
 * NOT use the CEFR data/words*.js files or WORD_SETS/currentLevel at all;
 * those scripts are still loaded on this page only so shared.js's
 * startApp() bootstrap (which requires at least one non-empty
 * window.WORDS_* global) has something to work with.
 */
"use strict";

var RC_ROUND_SIZE = 5;
var RC_WIN_THRESHOLD = 3; // score >= 3 out of 5 = "Great job!", else "Keep practicing"

var rcActive = false;
var rcGrade = 1;
var rcPassage = null; // the passage object currently being read
var rcUsedPassages = {}; // grade -> { passageIndex: true } already seen this session
var rcQuestionIndex = 0;
var rcScore = 0;
var rcDone = false;
var rcHintUsed = false; // whether the Hint button has been used for the current question
var rcPassagesByGrade = null; // cache: grade number -> [passage, ...]

function rcBuildIndex() {
  if (rcPassagesByGrade) return;
  rcPassagesByGrade = {};
  (window.READING_PASSAGES || []).forEach(function (p) {
    if (!p || !p.grade) return;
    if (!rcPassagesByGrade[p.grade]) rcPassagesByGrade[p.grade] = [];
    rcPassagesByGrade[p.grade].push(p);
  });
}

function rcGradesAvailable() {
  rcBuildIndex();
  return Object.keys(rcPassagesByGrade)
    .map(Number)
    .sort(function (a, b) {
      return a - b;
    });
}

function rcRenderGradePicker() {
  var nav = $("rc-grade-picker");
  if (!nav) return;
  var grades = rcGradesAvailable();
  nav.innerHTML = "";
  grades.forEach(function (g) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "level-btn" + (g === rcGrade ? " is-active" : "");
    btn.textContent = "Grade " + g;
    btn.addEventListener("click", function () {
      rcGrade = g;
      rcRenderGradePicker();
      refreshRcStart();
    });
    nav.appendChild(btn);
  });
}

function refreshRcStart() {
  rcBuildIndex();
  var list = rcPassagesByGrade[rcGrade] || [];
  var ok = list.length > 0;
  setText("rc-start-grade", String(rcGrade));
  setText(
    "rc-start-count",
    ok ? list.length + (list.length === 1 ? " passage" : " passages") + " available" : ""
  );
  setHidden("rc-start-warning", ok);
  if (!ok) {
    setText("rc-start-warning", "No passages available for this grade yet.");
  }
  var btn = $("rc-start-btn");
  if (btn) btn.disabled = !ok;
}

function showRcSetup() {
  rcActive = false;
  setPlayHeader(false);
  rcRenderGradePicker();
  refreshRcStart();
  setHidden("rc-game", true);
  setHidden("rc-round-result", true);
  setHidden("rc-setup", false);
}

function resetRc() {
  rcActive = false;
  if (!rcGradesAvailable().length) rcBuildIndex();
  showRcSetup();
}

function enterRc() {
  if (!rcActive) showRcSetup();
}

// Picks a passage for the current grade that hasn't been read yet this
// session; once every passage for that grade has been seen, the "seen" set
// resets so passages can repeat rather than the game getting stuck.
function rcPickPassage() {
  rcBuildIndex();
  var list = rcPassagesByGrade[rcGrade] || [];
  if (!list.length) return null;
  var used = rcUsedPassages[rcGrade] || (rcUsedPassages[rcGrade] = {});
  var remaining = list.filter(function (_, i) {
    return !used[i];
  });
  if (!remaining.length) {
    used = rcUsedPassages[rcGrade] = {};
    remaining = list.slice();
  }
  var chosen = remaining[Math.floor(Math.random() * remaining.length)];
  used[list.indexOf(chosen)] = true;
  return chosen;
}

function startRc() {
  rcActive = true;
  setPlayHeader(true);
  setHidden("rc-setup", true);
  setText("rc-grade-badge", "Grade " + rcGrade);
  startRcPassage();
}

function startRcPassage() {
  rcPassage = rcPickPassage();
  if (!rcPassage) {
    showRcSetup();
    return;
  }
  rcQuestionIndex = 0;
  rcScore = 0;
  setHidden("rc-round-result", true);
  setHidden("rc-game", false);
  setText("rc-passage-title", rcPassage.title);
  setText("rc-passage-text", rcPassage.text);
  loadRcQuestion();
}

function loadRcQuestion() {
  var q = rcPassage.questions[rcQuestionIndex];
  rcDone = false;
  setText("rc-qnum", rcQuestionIndex + 1);
  setText("rc-score", rcScore);
  setText("rc-question", q.q);

  var fb = $("rc-feedback");
  if (fb) {
    fb.textContent = "";
    fb.className = "feedback";
  }
  setHidden("rc-result", true);

  rcHintUsed = false;
  setHidden("rc-hint-text", true);
  setText("rc-hint-text", "");
  setHidden("rc-explain-text", true);
  setText("rc-explain-text", "");
  var hintBtn = $("rc-hint-btn");
  if (hintBtn) hintBtn.disabled = !q.hint;
  var explainBtn = $("rc-explain-btn");
  if (explainBtn) explainBtn.disabled = true;

  var letters = ["A", "B", "C", "D"];
  var wrap = $("rc-options");
  if (!wrap) return;
  wrap.innerHTML = "";
  q.options.forEach(function (opt, idx) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    btn.innerHTML =
      '<span class="key">' + letters[idx] + "</span><span>" + escapeHtml(opt) + "</span>";
    btn.addEventListener("click", function () {
      answerRc(idx, btn);
    });
    wrap.appendChild(btn);
  });
}

function answerRc(idx, btn) {
  if (rcDone || !rcPassage) return;
  rcDone = true;
  var q = rcPassage.questions[rcQuestionIndex];
  var isCorrect = idx === q.correct;

  var wrap = $("rc-options");
  if (wrap) {
    wrap.querySelectorAll(".option").forEach(function (el, i) {
      el.disabled = true;
      if (i === q.correct) el.classList.add("correct");
    });
  }
  if (!isCorrect) btn.classList.add("wrong");

  var fb = $("rc-feedback");
  if (fb) {
    fb.textContent = isCorrect ? "Correct!" : "Not quite.";
    fb.className = "feedback " + (isCorrect ? "ok" : "no");
  }

  if (isCorrect) rcScore++;
  setText("rc-score", rcScore);

  stats.answered = (stats.answered || 0) + 1;
  if (isCorrect) stats.correct = (stats.correct || 0) + 1;
  lsSet(STATS_KEY, stats);
  touchStreak();

  var hintBtn = $("rc-hint-btn");
  if (hintBtn) hintBtn.disabled = true;
  var explainBtn = $("rc-explain-btn");
  if (explainBtn) explainBtn.disabled = !q.explain;

  showRcResult(isCorrect);
}

function showRcResult(isCorrect) {
  var rt = $("rc-result-text");
  if (rt) {
    rt.textContent = isCorrect ? "🎉 Correct!" : "❌ Not quite";
    rt.className = "hangman-result-text " + (isCorrect ? "win" : "lose");
  }
  var isLastQuestion = rcQuestionIndex >= RC_ROUND_SIZE - 1;
  setText("rc-next", isLastQuestion ? "See results →" : "Next question →");
  setHidden("rc-result", false);
}

// Ends the current passage: shows a score summary and offers another
// passage from the same grade, or a way back to the grade picker.
function finishRcPassage() {
  var win = rcScore >= RC_WIN_THRESHOLD;

  setHidden("rc-game", true);
  setHidden("rc-round-result", false);

  var perfect = rcScore === RC_ROUND_SIZE;
  setText("rc-round-emoji", win ? (perfect ? "🏆" : "🎉") : "📚");
  setText("rc-round-title", win ? "Great job!" : "Keep practicing!");
  setText("rc-round-score", rcScore + " / " + RC_ROUND_SIZE);
  var barFill = $("rc-round-bar-fill");
  if (barFill) barFill.style.width = (rcScore / RC_ROUND_SIZE) * 100 + "%";
  setText(
    "rc-round-text",
    'You got ' +
      rcScore +
      " out of " +
      RC_ROUND_SIZE +
      ' correct on "' +
      rcPassage.title +
      '".' +
      (win ? "" : " Try another passage to practice more.")
  );
}

on("rc-start-btn", "click", function () {
  startRc();
});
on("rc-back", "click", showRcSetup);
on("rc-change", "click", showRcSetup);
on("rc-round-setup", "click", showRcSetup);
on("rc-round-again", "click", startRcPassage);
on("rc-next", "click", function () {
  if (rcQuestionIndex >= RC_ROUND_SIZE - 1) {
    finishRcPassage();
  } else {
    rcQuestionIndex++;
    loadRcQuestion();
  }
});
on("rc-hint-btn", "click", function () {
  if (!rcPassage || rcHintUsed) return;
  var q = rcPassage.questions[rcQuestionIndex];
  if (!q.hint) return;
  rcHintUsed = true;
  setText("rc-hint-text", q.hint);
  setHidden("rc-hint-text", false);
  var btn = $("rc-hint-btn");
  if (btn) btn.disabled = true;
});
on("rc-explain-btn", "click", function () {
  if (!rcPassage || !rcDone) return;
  var q = rcPassage.questions[rcQuestionIndex];
  if (!q.explain) return;
  setText("rc-explain-text", q.explain);
  setHidden("rc-explain-text", false);
});
document.addEventListener("keydown", function (e) {
  var g = $("rc-game");
  if (!g || g.hidden || !rcPassage || rcDone) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  var map = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 };
  var k = (e.key || "").toLowerCase();
  if (k in map) {
    var idx = map[k];
    var wrap = $("rc-options");
    var btns = wrap ? wrap.querySelectorAll(".option") : [];
    if (btns[idx] && !btns[idx].disabled) {
      e.preventDefault();
      btns[idx].click();
    }
  }
});

onLevelChange(resetRc);
