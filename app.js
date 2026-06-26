/* UDSP & B2 English — Top Words Quizlet
 * Vanilla JS. Data comes from data/wordsb2.js (window.WORDS_B2).
 * Quiz is split into exams of 20 questions; the final score is shown on submit.
 */
(function () {
  "use strict";

  var WORD_SETS = {
    A1: (window.WORDS_A1 || []).slice(),
    A2: (window.WORDS_A2 || []).slice(),
    B1: (window.WORDS_B1 || []).slice(),
    B2: (window.WORDS_B2 || []).slice(),
    C1: (window.WORDS_C1 || []).slice(),
    C2: (window.WORDS_C2 || []).slice(),
  };
  var LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
  var DEFAULT_LEVEL = "B2";
  var currentLevel = DEFAULT_LEVEL;
  var WORDS = WORD_SETS[currentLevel].slice();
  var QUESTIONS_PER_EXAM = 20;
  function storageKey() {
    return "udsp_best_scores_" + currentLevel + "_v1";
  }

  /* ---------- helpers ---------- */
  function $(id) {
    return document.getElementById(id);
  }
  function vocabUrl(word) {
    return (
      "https://dictionary.cambridge.org/tr/s%C3%B6zl%C3%BCk/ingilizce-t%C3%BCrk%C3%A7e/" +
      encodeURIComponent(word)
    );
  }
  function vocabLinkHtml(word) {
    return (
      '<a class="vocab-link" href="' +
      vocabUrl(word) +
      '" target="_blank" rel="noopener noreferrer">Examples on Cambridge Dictionary ↗</a>'
    );
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }
  function loadBest() {
    try {
      return JSON.parse(localStorage.getItem(storageKey())) || {};
    } catch (e) {
      return {};
    }
  }
  function saveBest(obj) {
    try {
      localStorage.setItem(storageKey(), JSON.stringify(obj));
    } catch (e) {
      /* ignore storage errors (private mode) */
    }
  }

  /* ---------- mode switching ---------- */
  var modeButtons = document.querySelectorAll(".mode-btn");
  modeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var mode = btn.getAttribute("data-mode");
      modeButtons.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      document.querySelectorAll(".view").forEach(function (v) {
        v.classList.remove("is-active");
      });
      $("view-" + mode).classList.add("is-active");
    });
  });

  /* ================= FLASHCARDS ================= */
  var fcOrder = shuffle(WORDS.map(function (_, i) {
    return i;
  }));
  var fcPos = 0;

  var flashcard = $("flashcard");

  function renderFlashcard() {
    if (!WORDS.length) return;
    var w = WORDS[fcOrder[fcPos]];
    flashcard.classList.remove("is-flipped");
    $("fc-word").textContent = w.word;
    $("fc-pos").textContent = w.pos;
    $("fc-level").textContent = w.level || currentLevel;
    $("fc-definition").textContent = w.definition;
    $("fc-example").textContent = w.example ? "“" + w.example + "”" : "";
    $("fc-link").href = vocabUrl(w.word);
    $("fc-counter").textContent = fcPos + 1 + " / " + WORDS.length;
  }
  function flip() {
    flashcard.classList.toggle("is-flipped");
  }
  function nextCard(step) {
    fcPos = (fcPos + step + WORDS.length) % WORDS.length;
    renderFlashcard();
  }

  flashcard.addEventListener("click", flip);
  flashcard.addEventListener("keydown", function (e) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      flip();
    }
  });
  // Clicking the dictionary link should open it, not flip the card.
  $("fc-link").addEventListener("click", function (e) {
    e.stopPropagation();
  });
  $("fc-flip").addEventListener("click", flip);
  $("fc-next").addEventListener("click", function () {
    nextCard(1);
  });
  $("fc-prev").addEventListener("click", function () {
    nextCard(-1);
  });
  $("fc-shuffle").addEventListener("click", function () {
    fcOrder = shuffle(fcOrder);
    fcPos = 0;
    renderFlashcard();
  });

  /* ================= QUIZ / EXAMS ================= */
  var totalExams = Math.ceil(WORDS.length / QUESTIONS_PER_EXAM);

  var quizState = null; // { examIndex, questions:[], current, score, answers:[] }

  var examGrid = $("exam-grid");

  function buildExamGrid() {
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
            '<div class="exam-best">Best: ' +
            bestScore +
            "/" +
            count +
            "</div>";
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
    // build 3 distractor definitions from other words
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
    return {
      word: correct.word,
      pos: correct.pos,
      answer: correct.definition,
      options: options.map(function (o) {
        return o.definition;
      }),
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

    $("quiz-picker").hidden = true;
    $("quiz-result").hidden = true;
    $("quiz-active").hidden = false;
    $("quiz-exam-label").textContent = "Exam " + (examIndex + 1);
    renderQuestion();
  }

  function renderQuestion() {
    var q = quizState.questions[quizState.current];
    var n = quizState.current + 1;
    var total = quizState.count;

    $("quiz-progress").textContent = "Question " + n + " / " + total;
    $("quiz-score").textContent = "Score: " + quizState.score;
    $("quiz-progress-fill").style.width =
      ((quizState.current) / total) * 100 + "%";
    $("quiz-word").textContent = q.word;
    $("quiz-word-pos").textContent = q.pos;
    $("quiz-feedback").textContent = "";
    $("quiz-feedback").className = "feedback";
    var link = $("quiz-link");
    link.href = vocabUrl(q.word);
    link.hidden = false;
    $("quiz-next").hidden = true;
    $("quiz-submit").hidden = true;

    var letters = ["A", "B", "C", "D"];
    var optWrap = $("quiz-options");
    optWrap.innerHTML = "";
    q.options.forEach(function (text, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.innerHTML =
        '<span class="key">' + letters[idx] + "</span><span>" + escapeHtml(text) + "</span>";
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

    var optionEls = $("quiz-options").querySelectorAll(".option");
    optionEls.forEach(function (el) {
      el.disabled = true;
      var label = el.querySelector("span:last-child").textContent;
      if (label === q.answer) el.classList.add("correct");
    });
    if (!isCorrect) btn.classList.add("wrong");

    var fb = $("quiz-feedback");
    fb.textContent = isCorrect ? "Correct!" : "Not quite.";
    fb.className = "feedback " + (isCorrect ? "ok" : "no");
    $("quiz-score").textContent = "Score: " + quizState.score;

    var isLast = quizState.current === quizState.count - 1;
    $("quiz-next").hidden = isLast;
    $("quiz-submit").hidden = !isLast;
  }

  $("quiz-next").addEventListener("click", function () {
    if (quizState.current < quizState.count - 1) {
      quizState.current += 1;
      renderQuestion();
    }
  });

  $("quiz-submit").addEventListener("click", finishExam);

  function finishExam() {
    var score = quizState.score;
    var total = quizState.count;
    var pct = Math.round((score / total) * 100);

    // persist best score
    var best = loadBest();
    var prev = best[quizState.examIndex];
    var isNewBest = typeof prev !== "number" || score > prev;
    if (isNewBest) {
      best[quizState.examIndex] = score;
      saveBest(best);
    }

    $("quiz-active").hidden = true;
    $("quiz-result").hidden = false;

    var emoji = pct === 100 ? "🏆" : pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📚";
    $("result-emoji").textContent = emoji;
    $("result-title").textContent =
      "Exam " + (quizState.examIndex + 1) + " complete!";
    $("result-score").textContent = score + " / " + total;
    $("result-bar-fill").style.width = pct + "%";
    $("result-text").textContent =
      "You scored " + pct + "%. " + feedbackLine(pct);
    $("result-best").textContent = isNewBest
      ? "⭐ New best score!"
      : "Your best for this exam: " + best[quizState.examIndex] + " / " + total;

    buildReview();
    $("review-list").hidden = true;
    $("quiz-review").textContent = "Review answers";
  }

  function feedbackLine(pct) {
    if (pct === 100) return "Perfect — outstanding work!";
    if (pct >= 80) return "Great job, almost there!";
    if (pct >= 50) return "Good effort — keep practising.";
    return "Keep going, review the words and try again.";
  }

  function buildReview() {
    var list = $("review-list");
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

  $("quiz-review").addEventListener("click", function () {
    var list = $("review-list");
    list.hidden = !list.hidden;
    this.textContent = list.hidden ? "Review answers" : "Hide review";
  });

  $("quiz-retry").addEventListener("click", function () {
    startExam(quizState.examIndex);
  });

  function backToList() {
    quizState = null;
    $("quiz-active").hidden = true;
    $("quiz-result").hidden = true;
    $("quiz-picker").hidden = false;
    buildExamGrid();
  }
  $("quiz-back").addEventListener("click", backToList);
  $("quiz-back-list").addEventListener("click", backToList);

  /* ================= WORD LIST ================= */
  var listEl = $("word-list");
  var searchEl = $("list-search");

  function renderList(filter) {
    filter = (filter || "").trim().toLowerCase();
    listEl.innerHTML = "";
    var shown = 0;
    WORDS.forEach(function (w) {
      if (
        filter &&
        w.word.toLowerCase().indexOf(filter) === -1 &&
        w.definition.toLowerCase().indexOf(filter) === -1
      ) {
        return;
      }
      shown++;
      var li = document.createElement("li");
      li.innerHTML =
        '<div class="wl-head"><span class="wl-word">' +
        escapeHtml(w.word) +
        '</span><span class="wl-pos">' +
        escapeHtml(w.pos) +
        "</span></div>" +
        '<div class="wl-def">' +
        escapeHtml(w.definition) +
        "</div>" +
        '<div class="wl-link">' +
        vocabLinkHtml(w.word) +
        "</div>";
      listEl.appendChild(li);
    });
    if (shown === 0) {
      listEl.innerHTML = '<li class="empty">No words match “' + escapeHtml(filter) + '”.</li>';
    }
    $("list-count").textContent = shown + " / " + WORDS.length;
  }
  searchEl.addEventListener("input", function () {
    renderList(searchEl.value);
  });

  /* ---------- small utility ---------- */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ================= LEVEL SWITCHING ================= */
  var levelButtons = document.querySelectorAll(".level-btn");

  function applyLevelLabels() {
    document
      .querySelectorAll("#footer-level, #picker-level, #picker-level-2")
      .forEach(function (el) {
        el.textContent = currentLevel;
      });
  }

  function setLevel(level) {
    if (!WORD_SETS[level] || !WORD_SETS[level].length) return;
    currentLevel = level;
    WORDS = WORD_SETS[level].slice();
    totalExams = Math.ceil(WORDS.length / QUESTIONS_PER_EXAM);

    // reset flashcards to a fresh shuffle for this level
    fcOrder = shuffle(
      WORDS.map(function (_, i) {
        return i;
      })
    );
    fcPos = 0;

    // reset the quiz back to the exam picker
    quizState = null;
    $("quiz-active").hidden = true;
    $("quiz-result").hidden = true;
    $("quiz-picker").hidden = false;

    // highlight the active level button
    levelButtons.forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-level") === level);
    });

    // update labels and counts
    applyLevelLabels();
    $("word-total").textContent = WORDS.length;
    $("exam-total").textContent = totalExams;
    $("picker-word-total").textContent = WORDS.length;

    // re-render every view for the selected level
    renderFlashcard();
    buildExamGrid();
    searchEl.value = "";
    renderList("");
  }

  levelButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLevel(btn.getAttribute("data-level"));
    });
  });

  /* ================= INIT ================= */
  function init() {
    var hasAny = LEVELS.some(function (l) {
      return WORD_SETS[l].length;
    });
    if (!hasAny) {
      document.querySelector(".container").innerHTML =
        '<p class="empty">No words loaded. Check the data/words*.js files.</p>';
      return;
    }
    setLevel(DEFAULT_LEVEL);
  }

  init();
})();
