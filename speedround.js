/* Top Words — Speed Round game page logic. Requires shared.js. */
"use strict";

var SR_DURATION = 60; // seconds
var SR_BONUS = 2; // seconds gained per correct answer
var speedActive = false;
var srLevel = null;
var srTimeLeft = 0;
var srTimerInterval = null;
var srScore = 0;
var srStreak = 0;
var srAnswered = false;
var srQuestion = null;
var srDone = false;

function srBestKey(level) {
  return "udsp_speedround_best_" + currentLang + "_" + level + "_v1";
}
function srLoadBest(level) {
  var v = parseInt(localStorage.getItem(srBestKey(level)), 10);
  return isNaN(v) ? 0 : v;
}
function srSaveBest(level, score) {
  try {
    localStorage.setItem(srBestKey(level), String(score));
  } catch (e) {
    /* ignore storage errors (private mode) */
  }
}

function renderSpeedLevels() {
  var box = $("speedround-levels");
  if (!box) return;
  box.innerHTML = "";
  var levels = LEVELS.slice();
  levels.push("MIX");
  levels.forEach(function (l) {
    var set = WORD_SETS[l] || [];
    if (set.length < 5) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "hm-level-btn";
    var full = levelLabel(l);
    var short = levelButtonLabel(l);
    if (short !== full) b.setAttribute("data-tip", full);
    b.innerHTML =
      escapeHtml(short) +
      ' <span class="hm-level-count">' + set.length + "</span>";
    b.addEventListener("click", function () {
      startSpeedRound(l);
    });
    box.appendChild(b);
  });
}

function showSpeedSetup() {
  speedActive = false;
  setPlayHeader(false);
  stopSpeedTimer();
  setHidden("speedround-game", true);
  setHidden("speedround-setup", false);
}

function resetSpeedRound() {
  speedActive = false;
  stopSpeedTimer();
  renderSpeedLevels();
  showSpeedSetup();
}

function enterSpeedRound() {
  renderSpeedLevels();
  if (!speedActive) showSpeedSetup();
}

function startSpeedRound(level) {
  srLevel = level;
  speedActive = true;
  srDone = false;
  setPlayHeader(true);
  setHidden("speedround-setup", true);
  setHidden("speedround-game", false);
  setHidden("speedround-result", true);
  setText("speedround-level-badge", levelLabel(level));
  srScore = 0;
  srStreak = 0;
  srTimeLeft = SR_DURATION;
  setText("speedround-score", "0");
  setText("speedround-streak", "");
  renderSpeedTimer();
  startSpeedTimer();
  srNextQuestion();
}

function startSpeedTimer() {
  stopSpeedTimer();
  srTimerInterval = setInterval(function () {
    srTimeLeft--;
    if (srTimeLeft <= 0) {
      srTimeLeft = 0;
      renderSpeedTimer();
      endSpeedRound();
      return;
    }
    renderSpeedTimer();
  }, 1000);
}
function stopSpeedTimer() {
  if (srTimerInterval) {
    clearInterval(srTimerInterval);
    srTimerInterval = null;
  }
}
function renderSpeedTimer() {
  var el = $("speedround-timer");
  if (!el) return;
  el.textContent = srTimeLeft + "s";
  el.classList.toggle("is-low", srTimeLeft <= 10);
}

function srBuildQuestion(level) {
  var pool = (WORD_SETS[level] || []).filter(function (w) {
    return w && w.word && w.definition;
  });
  if (pool.length < 4) return null;
  var idx = Math.floor(Math.random() * pool.length);
  var correct = pool[idx];
  var distractors = shuffle(
    pool.filter(function (w) {
      return w !== correct;
    })
  ).slice(0, 3);
  var options = shuffle([correct].concat(distractors));
  return {
    word: correct.word,
    pos: correct.pos,
    answer: correct.definition,
    options: options.map(function (o) {
      return o.definition;
    }),
  };
}

function srNextQuestion() {
  if (srDone) return;
  var q = srBuildQuestion(srLevel);
  if (!q) {
    endSpeedRound();
    return;
  }
  srQuestion = q;
  srAnswered = false;
  setText("speedround-word", q.word);
  setText("speedround-word-pos", q.pos || "");
  var box = $("speedround-options");
  if (box) {
    box.innerHTML = "";
    q.options.forEach(function (opt) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "option";
      b.textContent = opt;
      b.addEventListener("click", function () {
        srAnswer(opt, b);
      });
      box.appendChild(b);
    });
  }
}

function srAnswer(picked, btnEl) {
  if (srAnswered || srDone) return;
  srAnswered = true;
  var box = $("speedround-options");
  var correct = picked === srQuestion.answer;
  if (box) {
    box.querySelectorAll(".option").forEach(function (b) {
      b.disabled = true;
      if (b.textContent === srQuestion.answer) b.classList.add("correct");
      else if (b === btnEl) b.classList.add("wrong");
    });
  }
  if (correct) {
    srScore++;
    srStreak++;
    srTimeLeft += SR_BONUS;
    setText("speedround-score", srScore);
    setText(
      "speedround-streak",
      srStreak >= 2 ? "🔥 " + srStreak + " in a row!" : ""
    );
    renderSpeedTimer();
  } else {
    srStreak = 0;
    setText("speedround-streak", "");
  }
  setTimeout(function () {
    if (!srDone) srNextQuestion();
  }, 450);
}

function endSpeedRound() {
  srDone = true;
  stopSpeedTimer();
  var box = $("speedround-options");
  if (box) {
    box.querySelectorAll(".option").forEach(function (b) {
      b.disabled = true;
    });
  }
  var best = srLoadBest(srLevel);
  var isNewBest = srScore > best;
  if (isNewBest) srSaveBest(srLevel, srScore);
  setText("speedround-final-score", srScore);
  var bestEl = $("speedround-final-best");
  if (bestEl) {
    bestEl.textContent = isNewBest
      ? "🏆 New best!"
      : "Best: " + Math.max(best, srScore);
  }
  setHidden("speedround-result", false);
}

on("speedround-back", "click", showSpeedSetup);
on("speedround-change", "click", showSpeedSetup);
on("speedround-restart", "click", function () {
  startSpeedRound(srLevel);
});

onLevelChange(resetSpeedRound);
