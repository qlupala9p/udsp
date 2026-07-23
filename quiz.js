/* Top Words — Quiz (exams) page logic. Requires shared.js to be loaded first. */
"use strict";

var totalExams = Math.ceil(WORDS.length / QUESTIONS_PER_EXAM);
var quizState = null; // { examIndex, questions:[], current, score }
var examGrid = $("exam-grid");
var quizReverse = false;

function buildExamGrid() {
  if (!examGrid) return;
  var best = loadBest();
  examGrid.innerHTML = "";
  for (var e = 0; e < totalExams; e++) {
    (function (examIndex) {
      var start = examIndex * QUESTIONS_PER_EXAM;
      var end = Math.min(start + QUESTIONS_PER_EXAM, WORDS.length);
      var count = end - start;
      var tile = document.createElement("button");
      tile.type = "button";
      tile.className = "exam-tile";
      var bestScore = best[examIndex];
      var bestHtml = "";
      if (typeof bestScore === "number") {
        tile.classList.add("is-done");
        bestHtml =
          '<div class="exam-best">Best: ' + bestScore + "/" + count + "</div>";
        if (bestScore === count) {
          tile.innerHTML = '<span class="check">✅</span>';
        }
      }
      tile.innerHTML +=
        '<div class="exam-no">Exam ' +
        (examIndex + 1) +
        "</div>" +
        '<div class="exam-range">words ' +
        (start + 1) +
        "–" +
        end +
        "</div>" +
        bestHtml;
      tile.addEventListener("click", function () {
        startExam(examIndex);
      });
      examGrid.appendChild(tile);
    })(e);
  }
}

function buildQuestion(wordIndex) {
  var correct = WORDS[wordIndex];
  var pool = shuffle(
    WORDS.map(function (_, i) {
      return i;
    }).filter(function (i) {
      return i !== wordIndex;
    })
  ).slice(0, 3);
  var options = shuffle(
    [correct].concat(
      pool.map(function (i) {
        return WORDS[i];
      })
    )
  );
  if (quizReverse) {
    return {
      word: correct.word,
      pos: correct.pos,
      example: correct.example,
      prompt: correct.definition,
      answer: correct.word,
      options: options.map(function (o) {
        return o.word;
      }),
      isReverse: true,
      picked: null,
    };
  }
  return {
    word: correct.word,
    pos: correct.pos,
    example: correct.example,
    prompt: correct.word,
    answer: correct.definition,
    options: options.map(function (o) {
      return o.definition;
    }),
    isReverse: false,
    picked: null,
  };
}

function startExam(examIndex) {
  var start = examIndex * QUESTIONS_PER_EXAM;
  var end = Math.min(start + QUESTIONS_PER_EXAM, WORDS.length);
  var indices = [];
  for (var i = start; i < end; i++) indices.push(i);
  indices = shuffle(indices);

  quizState = {
    examIndex: examIndex,
    count: indices.length,
    questions: indices.map(buildQuestion),
    current: 0,
    score: 0,
  };

  setHidden("quiz-picker", true);
  setHidden("quiz-result", true);
  setHidden("quiz-active", false);
  setText("quiz-exam-label", "Exam " + (examIndex + 1));
  renderQuestion();
}

function renderQuestion() {
  var q = quizState.questions[quizState.current];
  var n = quizState.current + 1;
  var total = quizState.count;

  setText("quiz-progress", "Question " + n + " / " + total);
  setText("quiz-score", "Score: " + quizState.score);
  var fill = $("quiz-progress-fill");
  if (fill) fill.style.width = (quizState.current / total) * 100 + "%";
  setText(
    "quiz-prompt-text",
    q.isReverse ? "Which word means:" : "What is the meaning of:"
  );
  setText("quiz-word", q.prompt);
  var wordEl = $("quiz-word");
  if (wordEl) wordEl.classList.toggle("is-reverse", q.isReverse);
  setText("quiz-word-pos", q.pos);
  var fb = $("quiz-feedback");
  if (fb) {
    fb.textContent = "";
    fb.className = "feedback";
  }
  resetExample("quiz-example-btn", "quiz-example", q.example, true);
  var linkDetails = $("quiz-link-details");
  if (linkDetails) linkDetails.href = vocabDetailsUrl(q.word);
  var linkExamples = $("quiz-link-examples");
  if (linkExamples) linkExamples.href = vocabExamplesUrl(q.word);
  setHidden("quiz-links", q.isReverse);
  setHidden("quiz-audio", q.isReverse);
  setHidden("quiz-next", true);
  setHidden("quiz-submit", true);

  var letters = ["A", "B", "C", "D"];
  var optWrap = $("quiz-options");
  if (!optWrap) return;
  optWrap.innerHTML = "";
  q.options.forEach(function (text, idx) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    btn.innerHTML =
      '<span class="key">' +
      letters[idx] +
      "</span><span>" +
      escapeHtml(text) +
      "</span>";
    btn.addEventListener("click", function () {
      answerQuestion(idx, btn);
    });
    optWrap.appendChild(btn);
  });
}

function answerQuestion(idx, btn) {
  var q = quizState.questions[quizState.current];
  if (q.picked !== null) return; // already answered
  q.picked = q.options[idx];
  var isCorrect = q.picked === q.answer;
  if (isCorrect) quizState.score += 1;

  stats.answered = (stats.answered || 0) + 1;
  if (isCorrect) stats.correct = (stats.correct || 0) + 1;
  lsSet(STATS_KEY, stats);
  touchStreak();
  bumpGoal();

  var optWrap = $("quiz-options");
  if (optWrap) {
    optWrap.querySelectorAll(".option").forEach(function (el) {
      el.disabled = true;
      var label = el.querySelector("span:last-child").textContent;
      if (label === q.answer) el.classList.add("correct");
    });
  }
  if (!isCorrect) btn.classList.add("wrong");

  var fb = $("quiz-feedback");
  if (fb) {
    fb.textContent = isCorrect ? "Correct!" : "Not quite.";
    fb.className = "feedback " + (isCorrect ? "ok" : "no");
  }
  setText("quiz-score", "Score: " + quizState.score);

  setHidden("quiz-link", false);
  setHidden("quiz-audio", false);

  var isLast = quizState.current === quizState.count - 1;
  setHidden("quiz-next", isLast);
  setHidden("quiz-submit", !isLast);
}

on("quiz-next", "click", function () {
  if (quizState.current < quizState.count - 1) {
    quizState.current += 1;
    renderQuestion();
  }
});
on("quiz-submit", "click", function () {
  finishExam();
});
on("quiz-audio", "click", function () {
  if (quizState) speak(quizState.questions[quizState.current].word);
});
wireExample("quiz-example-btn", "quiz-example");
on("reverse-toggle", "change", function () {
  quizReverse = this.checked;
});

function finishExam() {
  var score = quizState.score;
  var total = quizState.count;
  var pct = Math.round((score / total) * 100);

  var best = loadBest();
  var prev = best[quizState.examIndex];
  var isNewBest = typeof prev !== "number" || score > prev;
  if (isNewBest) {
    best[quizState.examIndex] = score;
    saveBest(best);
  }

  stats.exams = (stats.exams || 0) + 1;
  lsSet(STATS_KEY, stats);
  touchStreak();

  setHidden("quiz-active", true);
  setHidden("quiz-result", false);

  var emoji = pct === 100 ? "🏆" : pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📚";
  setText("result-emoji", emoji);
  setText("result-title", "Exam " + (quizState.examIndex + 1) + " complete!");
  setText("result-score", score + " / " + total);
  var barFill = $("result-bar-fill");
  if (barFill) barFill.style.width = pct + "%";
  setText("result-text", "You scored " + pct + "%. " + feedbackLine(pct));
  setText(
    "result-best",
    isNewBest
      ? "⭐ New best score!"
      : "Your best for this exam: " + best[quizState.examIndex] + " / " + total
  );

  buildReview();
  setHidden("review-list", true);
  setText("quiz-review", "Review answers");
  logHistory({ type: "quiz", lang: currentLang, level: currentLevel, examIndex: quizState.examIndex, score: score, total: total, pct: pct });
  maybeRemindProfile();
}

function feedbackLine(pct) {
  if (pct === 100) return "Perfect — outstanding work!";
  if (pct >= 80) return "Great job, almost there!";
  if (pct >= 50) return "Good effort — keep practising.";
  return "Keep going, review the words and try again.";
}

function buildReview() {
  var list = $("review-list");
  if (!list) return;
  list.innerHTML = "";
  quizState.questions.forEach(function (q, i) {
    var correct = q.picked === q.answer;
    var li = document.createElement("li");
    li.className = correct ? "ok" : "no";
    var yours = correct
      ? '<span class="ok-text">✓ Correct</span>'
      : '<span class="no-text">Your answer: ' +
        escapeHtml(q.picked || "—") +
        "</span>";
    li.innerHTML =
      '<div class="review-word">' +
      (i + 1) +
      ". " +
      escapeHtml(q.word) +
      ' <span class="wl-pos">(' +
      escapeHtml(q.pos) +
      ")</span></div>" +
      '<div class="review-def">' +
      escapeHtml(q.answer) +
      "</div>" +
      '<div class="review-yours">' +
      yours +
      "</div>" +
      '<div class="review-link">' +
      vocabLinkHtml(q.word) +
      "</div>";
    list.appendChild(li);
  });
}

on("quiz-review", "click", function () {
  var list = $("review-list");
  if (!list) return;
  list.hidden = !list.hidden;
  this.textContent = list.hidden ? "Review answers" : "Hide review";
});

on("quiz-retry", "click", function () {
  startExam(quizState.examIndex);
});

function backToList() {
  quizState = null;
  setHidden("quiz-active", true);
  setHidden("quiz-result", true);
  setHidden("quiz-picker", false);
  buildExamGrid();
}
on("quiz-back", "click", backToList);
on("quiz-back-list", "click", backToList);

onLevelChange(function () {
  totalExams = Math.ceil(WORDS.length / QUESTIONS_PER_EXAM);
  quizState = null;
  setHidden("quiz-active", true);
  setHidden("quiz-result", true);
  setHidden("quiz-picker", false);
  setText("exam-total", totalExams);
  setText("picker-word-total", WORDS.length);
  buildExamGrid();
});
