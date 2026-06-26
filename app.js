/* UDSP & B2 English — Top Words Quizlet
 * Vanilla JS. Data comes from data/wordsb2.js (window.WORDS_B2).
 * Quiz is split into exams of 20 questions; the final score is shown on submit.
 */
(function () {
  "use strict";

  // ---- language configurations ----
  var LANGS = {
    en: {
      label: "English",
      title: "CEFR English - Top Words",
      tagline: "CEFR Top Words Quizlet",
      defaultLevel: "B2",
      speakLang: "en-US",
      levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
      sets: {
        A1: window.WORDS_A1,
        A2: window.WORDS_A2,
        B1: window.WORDS_B1,
        B2: window.WORDS_B2,
        C1: window.WORDS_C1,
        C2: window.WORDS_C2,
      },
      dictUrl: function (word) {
        return (
          "https://dictionary.cambridge.org/tr/s%C3%B6zl%C3%BCk/ingilizce-t%C3%BCrk%C3%A7e/" +
          encodeURIComponent(word)
        );
      },
    },
    de: {
      label: "German",
      title: "Telc German - Top Words",
      tagline: "Telc Top Words Quizlet",
      defaultLevel: "A1.1",
      speakLang: "de-DE",
      levels: ["A1.1", "A1.2", "A2.1", "A2.2", "B1.1", "B1.2"],
      sets: {
        "A1.1": window.WORDS_DE_A11,
        "A1.2": window.WORDS_DE_A12,
        "A2.1": window.WORDS_DE_A21,
        "A2.2": window.WORDS_DE_A22,
        "B1.1": window.WORDS_DE_B11,
        "B1.2": window.WORDS_DE_B12,
      },
      dictUrl: function (word) {
        // strip the leading article (der/die/das) for the lookup
        var bare = word.replace(/^(der|die|das)\s+/i, "");
        return (
          "https://dictionary.cambridge.org/dictionary/german-english/" +
          encodeURIComponent(bare)
        );
      },
    },
  };
  var LANG_ORDER = ["en", "de"];

  function buildWordSets(lang) {
    var cfg = LANGS[lang];
    var sets = {};
    cfg.levels.forEach(function (l) {
      sets[l] = (cfg.sets[l] || []).slice();
    });
    sets.MIX = cfg.levels.reduce(function (acc, l) {
      return acc.concat(sets[l]);
    }, []);
    return sets;
  }

  var currentLang = "en";
  var WORD_SETS = buildWordSets(currentLang);
  var LEVELS = LANGS[currentLang].levels.slice();
  var DEFAULT_LEVEL = LANGS[currentLang].defaultLevel;
  var currentLevel = DEFAULT_LEVEL;
  var currentMode = "flashcards";
  var WORDS = WORD_SETS[currentLevel].slice();
  var QUESTIONS_PER_EXAM = 20;
  function storageKey() {
    return "udsp_best_scores_" + currentLang + "_" + currentLevel + "_v1";
  }

  /* ---------- persistent state ---------- */
  var KNOWN_KEY = "udsp_known_v1";
  var FAV_KEY = "udsp_fav_v1";
  var SRS_KEY = "udsp_srs_v1";
  var STATS_KEY = "udsp_stats_v1";
  var STREAK_KEY = "udsp_streak_v1";
  var RESUME_KEY = "udsp_resume_v1";

  function lsGet(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v === null || v === undefined ? fallback : v;
    } catch (e) {
      return fallback;
    }
  }
  function lsSet(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      /* ignore storage errors (private mode) */
    }
  }

  var known = lsGet(KNOWN_KEY, {});
  var fav = lsGet(FAV_KEY, {});
  var srs = lsGet(SRS_KEY, {});
  var stats = lsGet(STATS_KEY, { answered: 0, correct: 0, exams: 0, reviews: 0 });
  var streak = lsGet(STREAK_KEY, { current: 0, longest: 0, last: "" });

  function levelLabel(l) {
    return l === "MIX" ? "Mix" : l;
  }
  function wordKey(w) {
    return (w.level || currentLevel) + "|" + w.word;
  }
  // --- speech: pick a voice that actually matches the target language ---
  var voiceCache = [];
  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    try {
      voiceCache = window.speechSynthesis.getVoices() || [];
    } catch (e) {
      voiceCache = [];
    }
  }
  if ("speechSynthesis" in window) {
    loadVoices();
    // voices populate asynchronously in most browsers
    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }
  function pickVoice(langCode) {
    if (!voiceCache.length) loadVoices();
    var lc = langCode.toLowerCase();
    var prefix = lc.split("-")[0];
    var exact = null;
    var prefixMatch = null;
    for (var i = 0; i < voiceCache.length; i++) {
      var v = voiceCache[i];
      var vl = (v.lang || "").toLowerCase().replace("_", "-");
      if (vl === lc && !exact) exact = v;
      if (vl.split("-")[0] === prefix && !prefixMatch) prefixMatch = v;
    }
    return exact || prefixMatch || null;
  }
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      var langCode = LANGS[currentLang].speakLang;
      u.lang = langCode;
      var v = pickVoice(langCode);
      if (v) u.voice = v;
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch (e) {
      /* ignore */
    }
  }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function touchStreak() {
    var t = todayStr();
    if (streak.last === t) return;
    var y = new Date();
    y.setDate(y.getDate() - 1);
    var ystr = y.getFullYear() + "-" + (y.getMonth() + 1) + "-" + y.getDate();
    streak.current = streak.last === ystr ? (streak.current || 0) + 1 : 1;
    streak.last = t;
    streak.longest = Math.max(streak.longest || 0, streak.current);
    lsSet(STREAK_KEY, streak);
    renderStreak();
  }
  function renderStreak() {
    var el = $("streak-count");
    if (el) el.textContent = streak.current || 0;
  }

  /* ---------- helpers ---------- */
  function $(id) {
    return document.getElementById(id);
  }
  function vocabUrl(word) {
    return LANGS[currentLang].dictUrl(word);
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
  function switchMode(mode) {
    currentMode = mode;
    modeButtons.forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-mode") === mode);
    });
    document.querySelectorAll(".view").forEach(function (v) {
      v.classList.remove("is-active");
    });
    var view = $("view-" + mode);
    if (view) view.classList.add("is-active");
    if (mode === "review") startReview();
    if (mode === "stats") renderStats();
    saveResume();
  }
  modeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      switchMode(btn.getAttribute("data-mode"));
    });
  });

  /* ================= FLASHCARDS ================= */
  var fcOrder = shuffle(WORDS.map(function (_, i) {
    return i;
  }));
  var fcPos = 0;

  var flashcard = $("flashcard");

  function fcCurrentWord() {
    return WORDS.length ? WORDS[fcOrder[fcPos]] : null;
  }
  function renderFcStatus() {
    var w = fcCurrentWord();
    if (!w) return;
    var k = wordKey(w);
    $("fc-known").classList.toggle("is-on", !!known[k]);
    $("fc-fav").classList.toggle("is-on", !!fav[k]);
  }
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
    $("fc-progress-fill").style.width =
      ((fcPos + 1) / WORDS.length) * 100 + "%";
    renderFcStatus();
    saveResume();
  }
  function flip() {
    flashcard.classList.toggle("is-flipped");
    touchStreak();
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
  $("fc-audio").addEventListener("click", function () {
    var w = fcCurrentWord();
    if (w) speak(w.word);
  });
  $("fc-known").addEventListener("click", function () {
    var w = fcCurrentWord();
    if (!w) return;
    var k = wordKey(w);
    if (known[k]) delete known[k];
    else known[k] = 1;
    lsSet(KNOWN_KEY, known);
    renderFcStatus();
  });
  $("fc-fav").addEventListener("click", function () {
    var w = fcCurrentWord();
    if (!w) return;
    var k = wordKey(w);
    if (fav[k]) delete fav[k];
    else fav[k] = 1;
    lsSet(FAV_KEY, fav);
    renderFcStatus();
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

  var quizReverse = false;

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
    if (quizReverse) {
      return {
        word: correct.word,
        pos: correct.pos,
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
    $("quiz-prompt-text").textContent = q.isReverse
      ? "Which word means:"
      : "What is the meaning of:";
    $("quiz-word").textContent = q.prompt;
    $("quiz-word").classList.toggle("is-reverse", q.isReverse);
    $("quiz-word-pos").textContent = q.pos;
    $("quiz-feedback").textContent = "";
    $("quiz-feedback").className = "feedback";
    var link = $("quiz-link");
    link.href = vocabUrl(q.word);
    link.hidden = q.isReverse;
    $("quiz-audio").hidden = q.isReverse;
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

    stats.answered = (stats.answered || 0) + 1;
    if (isCorrect) stats.correct = (stats.correct || 0) + 1;
    lsSet(STATS_KEY, stats);
    touchStreak();

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

    $("quiz-link").hidden = false;
    $("quiz-audio").hidden = false;

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
  $("quiz-audio").addEventListener("click", function () {
    if (quizState) speak(quizState.questions[quizState.current].word);
  });
  $("reverse-toggle").addEventListener("change", function () {
    quizReverse = this.checked;
  });

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

    stats.exams = (stats.exams || 0) + 1;
    lsSet(STATS_KEY, stats);
    touchStreak();

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

  var listFilter = "all";

  function wordMatchesFilter(w) {
    var k = wordKey(w);
    if (listFilter === "fav") return !!fav[k];
    if (listFilter === "known") return !!known[k];
    if (listFilter === "unknown") return !known[k];
    return true;
  }

  function renderList(filter) {
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
        '<div class="wl-link">' +
        vocabLinkHtml(w.word) +
        "</div>";
      listEl.appendChild(li);
    });
    if (shown === 0) {
      listEl.innerHTML = '<li class="empty">No words match.</li>';
    }
    $("list-count").textContent = shown + " / " + WORDS.length;
  }
  searchEl.addEventListener("input", function () {
    renderList(searchEl.value);
  });
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
    if (currentMode === "flashcards") renderFcStatus();
  });
  document.querySelectorAll("#list-filters .chip-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      listFilter = b.getAttribute("data-filter");
      document.querySelectorAll("#list-filters .chip-btn").forEach(function (x) {
        x.classList.toggle("is-on", x === b);
      });
      renderList(searchEl.value);
    });
  });

  /* ================= SRS REVIEW ================= */
  var SRS_INTERVALS = [0, 1, 3, 7, 16, 30];
  var REVIEW_BATCH = 20;
  var reviewQueue = [];
  var reviewPos = 0;
  var reviewDone = 0;
  var reviewCard = $("review-card");

  function srsUpdate(key, gotIt) {
    var s = srs[key] || { box: 0 };
    s.box = gotIt ? Math.min((s.box || 0) + 1, 5) : 1;
    var days = SRS_INTERVALS[s.box] || 1;
    s.due = Date.now() + days * 24 * 3600 * 1000;
    s.last = Date.now();
    srs[key] = s;
    lsSet(SRS_KEY, srs);
  }
  function dueCount() {
    var now = Date.now();
    var n = 0;
    WORDS.forEach(function (w) {
      var s = srs[wordKey(w)];
      if (!s || s.due <= now) n++;
    });
    return n;
  }
  function startReview() {
    var now = Date.now();
    var due = [];
    var fresh = [];
    WORDS.forEach(function (w) {
      var s = srs[wordKey(w)];
      if (!s) fresh.push(w);
      else if (s.due <= now) due.push(w);
    });
    reviewQueue = shuffle(due).concat(shuffle(fresh)).slice(0, REVIEW_BATCH);
    reviewPos = 0;
    reviewDone = 0;
    renderReview();
  }
  function renderReview() {
    var hasCards = reviewPos < reviewQueue.length;
    $("review-active").hidden = !hasCards;
    $("review-empty").hidden = hasCards;
    $("review-due").textContent = "Due: " + dueCount();
    if (!hasCards) {
      $("review-empty-text").textContent =
        reviewDone > 0
          ? "You reviewed " +
            reviewDone +
            " word" +
            (reviewDone === 1 ? "" : "s") +
            " this session."
          : "Nothing is due right now — try studying new words or come back later.";
      $("review-progress").textContent = reviewDone + " / " + reviewDone;
      $("review-progress-fill").style.width = "100%";
      return;
    }
    var w = reviewQueue[reviewPos];
    reviewCard.classList.remove("is-flipped");
    $("review-rate").hidden = true;
    $("rv-flip").textContent = "Show answer";
    $("rv-pos").textContent = w.pos;
    $("rv-word").textContent = w.word;
    $("rv-level").textContent = w.level || currentLevel;
    $("rv-definition").textContent = w.definition;
    $("rv-link").href = vocabUrl(w.word);
    var total = reviewQueue.length;
    $("review-progress").textContent = reviewPos + 1 + " / " + total;
    $("review-progress-fill").style.width = (reviewPos / total) * 100 + "%";
  }
  function revealReview() {
    reviewCard.classList.add("is-flipped");
    $("rv-flip").textContent = "Hide";
    $("review-rate").hidden = false;
  }
  function toggleReview() {
    if (reviewCard.classList.contains("is-flipped")) {
      reviewCard.classList.remove("is-flipped");
      $("rv-flip").textContent = "Show answer";
      $("review-rate").hidden = true;
    } else {
      revealReview();
    }
  }
  function rateReview(gotIt) {
    if (reviewPos >= reviewQueue.length) return;
    var w = reviewQueue[reviewPos];
    srsUpdate(wordKey(w), gotIt);
    reviewDone++;
    stats.reviews = (stats.reviews || 0) + 1;
    lsSet(STATS_KEY, stats);
    touchStreak();
    if (!gotIt) reviewQueue.push(w);
    reviewPos++;
    renderReview();
  }
  if (reviewCard) {
    reviewCard.addEventListener("click", toggleReview);
    reviewCard.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        toggleReview();
      }
    });
  }
  $("rv-flip").addEventListener("click", toggleReview);
  $("rv-audio").addEventListener("click", function () {
    if (reviewPos < reviewQueue.length) speak(reviewQueue[reviewPos].word);
  });
  $("rv-link").addEventListener("click", function (e) {
    e.stopPropagation();
  });
  $("rv-again").addEventListener("click", function () {
    rateReview(false);
  });
  $("rv-good").addEventListener("click", function () {
    rateReview(true);
  });
  $("review-restart").addEventListener("click", startReview);

  /* ================= STATS / DASHBOARD ================= */
  function renderStats() {
    var grid = $("stats-grid");
    if (!grid) return;
    var acc = stats.answered
      ? Math.round((stats.correct / stats.answered) * 100)
      : 0;
    var knownN = Object.keys(known).length;
    var favN = Object.keys(fav).length;
    var cards = [
      {
        icon: "🔥",
        value: streak.current || 0,
        label: "Day streak",
        sub: "Best: " + (streak.longest || 0),
      },
      { icon: "✓", value: knownN, label: "Words known", sub: "" },
      { icon: "★", value: favN, label: "Favorites", sub: "" },
      {
        icon: "🎯",
        value: acc + "%",
        label: "Quiz accuracy",
        sub: (stats.correct || 0) + " / " + (stats.answered || 0),
      },
      { icon: "📝", value: stats.exams || 0, label: "Exams completed", sub: "" },
      { icon: "🔁", value: stats.reviews || 0, label: "Reviews done", sub: "" },
    ];
    grid.innerHTML = cards
      .map(function (c) {
        return (
          '<div class="stat-card"><div class="stat-icon">' +
          c.icon +
          '</div><div class="stat-value">' +
          c.value +
          '</div><div class="stat-label">' +
          c.label +
          "</div>" +
          (c.sub ? '<div class="stat-sub">' + c.sub + "</div>" : "") +
          "</div>"
        );
      })
      .join("");

    var knownByLevel = {};
    Object.keys(known).forEach(function (k) {
      var lv = k.split("|")[0];
      knownByLevel[lv] = (knownByLevel[lv] || 0) + 1;
    });
    var lp = $("level-progress");
    lp.innerHTML = LEVELS.map(function (l) {
      var tot = WORD_SETS[l].length || 1;
      var kn = knownByLevel[l] || 0;
      var pct = Math.round((kn / tot) * 100);
      return (
        '<div class="lp-row"><span class="lp-name">' +
        l +
        '</span><div class="lp-bar"><span style="width:' +
        pct +
        '%"></span></div><span class="lp-count">' +
        kn +
        " / " +
        tot +
        "</span></div>"
      );
    }).join("");
  }
  $("stats-reset").addEventListener("click", function () {
    if (
      !window.confirm(
        "Reset ALL progress? This clears known words, favorites, review history, quiz stats, streak, and best scores. This cannot be undone."
      )
    )
      return;
    [KNOWN_KEY, FAV_KEY, SRS_KEY, STATS_KEY, STREAK_KEY, RESUME_KEY].forEach(
      function (k) {
        try {
          localStorage.removeItem(k);
        } catch (e) {}
      }
    );
    LANG_ORDER.forEach(function (lang) {
      LANGS[lang].levels.concat(["MIX"]).forEach(function (l) {
        try {
          localStorage.removeItem("udsp_best_scores_" + lang + "_" + l + "_v1");
        } catch (e) {}
      });
    });
    known = {};
    fav = {};
    srs = {};
    stats = { answered: 0, correct: 0, exams: 0, reviews: 0 };
    streak = { current: 0, longest: 0, last: "" };
    renderStreak();
    renderStats();
    buildExamGrid();
    renderFlashcard();
    renderList(searchEl.value);
  });

  function saveResume() {
    var w = fcCurrentWord();
    lsSet(RESUME_KEY, {
      lang: currentLang,
      level: currentLevel,
      mode: currentMode,
      fcKey: w ? wordKey(w) : "",
    });
  }

  /* ---------- small utility ---------- */
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ================= LANGUAGE + LEVEL SWITCHING ================= */
  var levelsNav = $("levels-nav");
  var langButtons = document.querySelectorAll(".lang-btn");

  function renderLevelButtons() {
    levelsNav.innerHTML = "";
    LEVELS.forEach(function (l) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "level-btn" + (l === currentLevel ? " is-active" : "");
      b.setAttribute("data-level", l);
      b.textContent = l;
      b.addEventListener("click", function () {
        setLevel(l);
      });
      levelsNav.appendChild(b);
    });
    var mix = document.createElement("button");
    mix.type = "button";
    mix.className =
      "level-btn level-mix" + (currentLevel === "MIX" ? " is-active" : "");
    mix.setAttribute("data-level", "MIX");
    mix.textContent = "Mix";
    mix.addEventListener("click", function () {
      setLevel("MIX");
    });
    levelsNav.appendChild(mix);
  }

  function applyLang() {
    var cfg = LANGS[currentLang];
    document.documentElement.lang = currentLang;
    document.title = cfg.title;
    var titleEl = $("app-title");
    if (titleEl) titleEl.textContent = cfg.title;
    var tagEl = $("app-tagline");
    if (tagEl) tagEl.textContent = cfg.tagline;
    langButtons.forEach(function (b) {
      b.classList.toggle(
        "is-active",
        b.getAttribute("data-lang") === currentLang
      );
    });
  }

  function setLang(lang) {
    if (!LANGS[lang] || lang === currentLang) return;
    currentLang = lang;
    WORD_SETS = buildWordSets(lang);
    LEVELS = LANGS[lang].levels.slice();
    DEFAULT_LEVEL = LANGS[lang].defaultLevel;
    applyLang();
    renderLevelButtons();
    setLevel(DEFAULT_LEVEL);
  }

  function applyLevelLabels() {
    document
      .querySelectorAll("#footer-level, #picker-level, #picker-level-2")
      .forEach(function (el) {
        el.textContent = levelLabel(currentLevel);
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
    levelsNav.querySelectorAll(".level-btn").forEach(function (b) {
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
    if (currentMode === "review") startReview();
    if (currentMode === "stats") renderStats();
    saveResume();
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-lang"));
    });
  });

  /* ================= INIT ================= */
  function init() {
    var hasAny = LANG_ORDER.some(function (lang) {
      return LANGS[lang].levels.some(function (l) {
        return (LANGS[lang].sets[l] || []).length;
      });
    });
    if (!hasAny) {
      document.querySelector(".container").innerHTML =
        '<p class="empty">No words loaded. Check the data/words*.js files.</p>';
      return;
    }
    renderStreak();
    var resume = lsGet(RESUME_KEY, null);
    if (resume && LANGS[resume.lang]) {
      currentLang = resume.lang;
      WORD_SETS = buildWordSets(currentLang);
      LEVELS = LANGS[currentLang].levels.slice();
      DEFAULT_LEVEL = LANGS[currentLang].defaultLevel;
    }
    applyLang();
    renderLevelButtons();
    var startLvl =
      resume && WORD_SETS[resume.level] && WORD_SETS[resume.level].length
        ? resume.level
        : DEFAULT_LEVEL;
    setLevel(startLvl);
    if (resume && resume.fcKey) {
      for (var i = 0; i < fcOrder.length; i++) {
        if (wordKey(WORDS[fcOrder[i]]) === resume.fcKey) {
          fcPos = i;
          break;
        }
      }
      renderFlashcard();
    }
    switchMode(resume && resume.mode ? resume.mode : "flashcards");
  }

  init();
})();
