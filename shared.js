/* Top Words — shared core.
 * Loaded on every page, in this order:
 *   1) data/words*.js          (defines window.WORDS_*)
 *   2) shared.js               (this file — state, config, storage, shared nav)
 *   3) <mode>.js                (page-specific logic, registers via onLevelChange)
 *   4) <script>startApp();</script>   (final inline kickoff at end of <body>)
 *
 * This file intentionally has NO IIFE wrapper: its `var`/`function`
 * declarations are plain globals so every other script on the page (loaded
 * after it) can use them directly, the same way modules on one page used to
 * share state inside the old single-file app.js.
 */
"use strict";

/* ================= language configurations ================= */
var LANGS = {
  en: {
    label: "English",
    title: "English - Top Words",
    description:
      "YDS, YÖKDİL, ÜDS, UDSP ve TOEFL sınavları için İngilizce kelime ezberleme: A1–C2 en sık kullanılan kelimeler ve phrasal verbs (öbek fiiller). Türk öğrenciler için ücretsiz flashcard ve testler.",
    tagline: "İngilizce kelime ezberleme",
    defaultLevel: "B2",
    speakLang: "en-US",
    levels: ["PV", "A1", "A2", "B1", "B2", "C1", "C2", "TOEFL"],
    sets: {
      PV: window.PHRASAL_VERBS_EN,
      A1: window.WORDS_A1,
      A2: window.WORDS_A2,
      B1: window.WORDS_B1,
      B2: window.WORDS_B2,
      C1: window.WORDS_C1,
      C2: window.WORDS_C2,
      TOEFL: window.WORDS_TOEFL,
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
    title: "German - Top Words",
    description:
      "Goethe Institute, Telc ve CEFR sınavları için Almanca kelime ezberleme: A1–C2 en sık kullanılan kelimeler ve ayrılabilen fiiller (Partikelverben). Türk öğrenciler için ücretsiz flashcard ve testler.",
    tagline: "Almanca kelime ezberleme",
    defaultLevel: "A1.1",
    speakLang: "de-DE",
    levels: ["PART", "A1.1", "A1.2", "A2.1", "A2.2", "B1.1", "B1.2", "GA1", "GA2", "GB1", "GB2", "GC1", "GC2"],
    sets: {
      PART: window.PARTIKELVERB_DE,
      "A1.1": window.WORDS_DE_A11,
      "A1.2": window.WORDS_DE_A12,
      "A2.1": window.WORDS_DE_A21,
      "A2.2": window.WORDS_DE_A22,
      "B1.1": window.WORDS_DE_B11,
      "B1.2": window.WORDS_DE_B12,
      GA1: window.WORDS_GODE_A1,
      GA2: window.WORDS_GODE_A2,
      GB1: window.WORDS_GODE_B1,
      GB2: window.WORDS_GODE_B2,
      GC1: window.WORDS_GODE_C1,
      GC2: window.WORDS_GODE_C2,
    },
    dictUrl: function (word) {
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
var currentMode = document.body.getAttribute("data-mode") || "flashcards";
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
var RESUME_KEY = "udsp_resume_v2"; // v2: multi-page architecture (lang+level only)

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
  if (l === "MIX") return "Mix";
  if (l === "PV") return "Phrasal Verbs";
  if (l === "PART") return "Partikelverb";
  var gode = { GA1: "A1", GA2: "A2", GB1: "B1", GB2: "B2", GC1: "C1", GC2: "C2" };
  if (gode[l]) return gode[l];
  return l;
}
// Short label for level BUTTONS (abbreviates the two longest level names so
// button rows stay compact); pair with a data-tip attribute (see callers)
// so the full name still shows up as a hover/focus tooltip.
function levelButtonLabel(l) {
  if (l === "PV" || l === "PART") return "PV";
  return levelLabel(l);
}
function wordKey(w) {
  return (w.level || currentLevel) + "|" + w.word;
}

/* ---------- speech: pick a voice that actually matches the target language ---------- */
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

// Games (Hangman, Cloze Test, Word Scramble, Matching Pairs, Speed Round)
// collapse the language/level/mode nav rows while a level is actively being
// played, leaving more room for the game board — call setPlayHeader(true)
// when entering gameplay and setPlayHeader(false) when back at the level
// picker for that game.
function setPlayHeader(on) {
  document.body.classList.toggle("is-playing", !!on);
}

/* ---------- dom helpers ---------- */
function $(id) {
  return document.getElementById(id);
}
// Guarded helpers: no-op instead of throwing when an element isn't on the
// current page (each page now only contains ONE mode's markup).
function on(id, evt, handler) {
  var el = $(id);
  if (el) el.addEventListener(evt, handler);
  return el;
}
function setText(id, text) {
  var el = $(id);
  if (el) el.textContent = text;
}
function setHidden(id, hidden) {
  var el = $(id);
  if (el) el.hidden = hidden;
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
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

// Show/hide a revealable example/hint paragraph for a card or question.
function resetExample(btnId, exampleId, example, showButton) {
  var btn = $(btnId);
  var ex = $(exampleId);
  if (!btn || !ex) return;
  ex.textContent = example ? "“" + example + "”" : "";
  ex.hidden = true;
  btn.hidden = !example || !showButton;
}
function wireExample(btnId, exampleId) {
  on(btnId, "click", function (e) {
    e.stopPropagation();
    setHidden(exampleId, false);
    setHidden(btnId, true);
  });
}

/* ---------- change hooks ----------
 * Mode scripts call onLevelChange(fn) once at load time to register their
 * own re-render function; shared.js calls fireLevelChange() whenever the
 * language or level changes (including the very first render, triggered by
 * startApp() at the bottom of the page). */
var _changeHooks = [];
function onLevelChange(fn) {
  _changeHooks.push(fn);
}
function fireLevelChange() {
  _changeHooks.forEach(function (fn) {
    try {
      fn();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  });
}

/* ================= language + level switching ================= */
var levelsNav = $("levels-nav");
var langButtons = document.querySelectorAll(".lang-btn");

function renderLevelButtons() {
  if (!levelsNav) return;
  levelsNav.innerHTML = "";
  LEVELS.forEach(function (l) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "level-btn" + (l === currentLevel ? " is-active" : "");
    b.setAttribute("data-level", l);
    var full = levelLabel(l);
    var short = levelButtonLabel(l);
    b.textContent = short;
    if (short !== full) b.setAttribute("data-tip", full);
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
  setText("app-title", cfg.title);
  setText("app-tagline", cfg.tagline);
  langButtons.forEach(function (b) {
    b.classList.toggle(
      "is-active",
      b.getAttribute("data-lang") === currentLang
    );
  });
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

  if (levelsNav) {
    levelsNav.querySelectorAll(".level-btn").forEach(function (b) {
      b.classList.toggle("is-active", b.getAttribute("data-level") === level);
    });
  }
  applyLevelLabels();
  setText("word-total", WORDS.length);
  saveResume();
  fireLevelChange();
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

langButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    setLang(btn.getAttribute("data-lang"));
  });
});

function saveResume() {
  lsSet(RESUME_KEY, { lang: currentLang, level: currentLevel });
}

/* ================= mobile bottom nav "More" sheet ================= */
(function wireMoreSheet() {
  var moreBtn = $("more-btn");
  var sheet = $("more-sheet");
  var closeBtn = $("more-close");
  if (!moreBtn || !sheet) return;
  function openSheet() {
    sheet.hidden = false;
    document.body.classList.add("more-open");
  }
  function closeSheet() {
    sheet.hidden = true;
    document.body.classList.remove("more-open");
  }
  moreBtn.addEventListener("click", openSheet);
  if (closeBtn) closeBtn.addEventListener("click", closeSheet);
  sheet.addEventListener("click", function (e) {
    if (e.target === sheet) closeSheet();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !sheet.hidden) closeSheet();
  });
})();

/* ================= bootstrap (called once, at end of <body>) ================= */
function startApp() {
  var hasAny = LANG_ORDER.some(function (lang) {
    return LANGS[lang].levels.some(function (l) {
      return (LANGS[lang].sets[l] || []).length;
    });
  });
  if (!hasAny) {
    var c = document.querySelector(".container");
    if (c) {
      c.innerHTML =
        '<p class="empty">No words loaded. Check the data/words*.js files.</p>';
    }
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
}
