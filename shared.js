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
    // English data is always loaded upfront via static <script> tags (it's
    // the default language for brand-new visitors), so sets just names the
    // global each level's data lives in -- see buildWordSets()/ensureLangData().
    sets: {
      PV: "PHRASAL_VERBS_EN",
      A1: "WORDS_A1",
      A2: "WORDS_A2",
      B1: "WORDS_B1",
      B2: "WORDS_B2",
      C1: "WORDS_C1",
      C2: "WORDS_C2",
      TOEFL: "WORDS_TOEFL",
    },
    detailsUrl: function (word) {
      return (
        "https://dictionary.cambridge.org/tr/s%C3%B6zl%C3%BCk/ingilizce-t%C3%BCrk%C3%A7e/" +
        encodeURIComponent(word)
      );
    },
    examplesUrl: function (word) {
      return (
        "https://dictionary.cambridge.org/tr/s%C3%B6zl%C3%BCk/ingilizce/" +
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
    // German data is NOT loaded via <script> tags in the HTML -- it's fetched
    // lazily by ensureLangData() the first time the user actually switches to
    // German (~2.5MB), so brand-new visitors (who default to English) don't
    // pay for it. `sets` names the global each level's data will live in once
    // loaded; `scripts` lists the files to inject.
    sets: {
      PART: "PARTIKELVERB_DE",
      "A1.1": "WORDS_DE_A11",
      "A1.2": "WORDS_DE_A12",
      "A2.1": "WORDS_DE_A21",
      "A2.2": "WORDS_DE_A22",
      "B1.1": "WORDS_DE_B11",
      "B1.2": "WORDS_DE_B12",
      GA1: "WORDS_GODE_A1",
      GA2: "WORDS_GODE_A2",
      GB1: "WORDS_GODE_B1",
      GB2: "WORDS_GODE_B2",
      GC1: "WORDS_GODE_C1",
      GC2: "WORDS_GODE_C2",
    },
    scripts: [
      "data/partikelverbde.js",
      "data/wordsa11de.js",
      "data/wordsa12de.js",
      "data/wordsa21de.js",
      "data/wordsa22de.js",
      "data/wordsb11de.js",
      "data/wordsb12de.js",
      "data/wordsa1gode.js",
      "data/wordsa2gode.js",
      "data/wordsb1gode.js",
      "data/wordsb2gode.js",
      "data/wordsc1gode.js",
      "data/wordsc2gode.js",
    ],
    detailsUrl: function (word) {
      var bare = word.replace(/^(der|die|das)\s+/i, "");
      return "https://en.pons.com/translate/german-turkish?q=" + encodeURIComponent(bare);
    },
    examplesUrl: function (word) {
      var bare = word.replace(/^(der|die|das)\s+/i, "");
      return (
        "https://dictionary.cambridge.org/dictionary/german-english/" +
        encodeURIComponent(bare)
      );
    },
  },
  fr: {
    label: "French",
    title: "French - Top Words",
    description:
      "DELF, DALF ve CEFR sınavları için Fransızca kelime ezberleme: A1–C1 en sık kullanılan kelimeler ve deyimler. Türk öğrenciler için ücretsiz flashcard ve testler.",
    tagline: "Fransızca kelime ezberleme",
    defaultLevel: "A1",
    speakLang: "fr-FR",
    levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
    // French data is lazily fetched by ensureLangData() the first time the
    // user switches to French (~2.7MB) -- see the German `sets`/`scripts`
    // comment above for the full rationale.
    sets: {
      A1: "WORDS_FR_A1",
      A2: "WORDS_FR_A2",
      B1: "WORDS_FR_B1",
      B2: "WORDS_FR_B2",
      C1: "WORDS_FR_C1",
      C2: "WORDS_FR_C2",
    },
    scripts: [
      "data/wordsa1fr.js",
      "data/wordsa2fr.js",
      "data/wordsb1fr.js",
      "data/wordsb2fr.js",
      "data/wordsc1fr.js",
      "data/wordsc2fr.js",
    ],
    detailsUrl: function (word) {
      var bare = word.replace(/^(le|la|les)\s+/i, "").replace(/^l['’]/i, "");
      return (
        "https://www.collinsdictionary.com/dictionary/french-english/" +
        encodeURIComponent(bare)
      );
    },
    examplesUrl: function (word) {
      var bare = word.replace(/^(le|la|les)\s+/i, "").replace(/^l['’]/i, "");
      return (
        "https://context.reverso.net/%C3%A7eviri/frans%C4%B1zca-t%C3%BCrk%C3%A7e/" +
        encodeURIComponent(bare)
      );
    },
  },
};
var LANG_ORDER = ["en", "de", "fr"];

function buildWordSets(lang) {
  var cfg = LANGS[lang];
  var sets = {};
  cfg.levels.forEach(function (l) {
    sets[l] = (window[cfg.sets[l]] || []).slice();
  });
  sets.MIX = cfg.levels.reduce(function (acc, l) {
    return acc.concat(sets[l]);
  }, []);
  return sets;
}

// English is always present via static <script> tags (default language for
// brand-new visitors). German/French are fetched on demand -- see below.
var langDataLoaded = { en: true, de: false, fr: false };
var langLoadCallbacks = {};

// Dynamically injects a language's data/*.js files (only once) and calls
// `callback` once all of them have loaded (or failed -- we proceed either
// way with whatever data did load, same "no words loaded" fallback message
// startApp() already shows if a whole language ends up empty). Concurrent
// callers while a load is already in flight are queued, not re-fetched.
function ensureLangData(lang, callback) {
  var cfg = LANGS[lang];
  if (langDataLoaded[lang] || !cfg || !cfg.scripts) {
    callback();
    return;
  }
  if (langLoadCallbacks[lang]) {
    langLoadCallbacks[lang].push(callback);
    return;
  }
  langLoadCallbacks[lang] = [callback];
  var remaining = cfg.scripts.length;
  function finish() {
    langDataLoaded[lang] = true;
    var callbacks = langLoadCallbacks[lang];
    langLoadCallbacks[lang] = null;
    callbacks.forEach(function (cb) {
      cb();
    });
  }
  cfg.scripts.forEach(function (src) {
    var el = document.createElement("script");
    el.src = src;
    el.onload = el.onerror = function () {
      remaining--;
      if (remaining <= 0) finish();
    };
    document.head.appendChild(el);
  });
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

// First-time visitor -> Games/Hangman (2026-07-10): a brand-new visitor (no
// resume state saved yet, i.e. nothing in RESUME_KEY) lands on Hangman
// instead of the default Flashcards home page. Scoped to index.html only
// (data-mode="flashcards", the site root) via location.replace() (no extra
// back-button history entry). Once *any* page's startApp() runs it saves a
// resume entry, so this fires at most once per browser -- the very next
// visit to index.html (even a click on "Flashcards" from Hangman) sees the
// resume state and skips the redirect normally.
// Skipped entirely for known search-engine crawler user agents so
// index.html's SEO-tuned Flashcards content still gets indexed as-is --
// crawlers don't persist localStorage across separate fetches, so without
// this guard every crawl of index.html would look "new" and get redirected.
(function () {
  if (document.body.getAttribute("data-mode") !== "flashcards") return;
  if (lsGet(RESUME_KEY, null)) return;
  var ua = navigator.userAgent || "";
  if (/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram/i.test(ua)) return;
  location.replace("hangman.html");
})();

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
  // Chrome (desktop) has a long-standing bug where its speech-synthesis
  // service quietly falls asleep after a period of inactivity: speak() then
  // returns normally but no audio is ever produced until the page reloads.
  // Nudging it with resume() every few seconds is the standard, harmless
  // workaround (a no-op whenever it's already awake/speaking).
  setInterval(function () {
    try {
      if (!window.speechSynthesis.speaking) window.speechSynthesis.resume();
    } catch (e) {
      /* ignore */
    }
  }, 8000);
  // iOS Safari has a well-documented quirk where its cached
  // SpeechSynthesisVoice objects/engine state can go stale after the page
  // is backgrounded (user switches app/tab and comes back) -- speak() then
  // silently produces no audio until the voice list is refreshed. Reload
  // the voice cache every time the page becomes visible again, cheap
  // insurance against that specific mobile scenario.
  if (typeof document.addEventListener === "function") {
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") loadVoices();
    });
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

// If the device has no installed voice at all for the requested language,
// speechSynthesis silently falls back to whatever its system default voice
// is (almost always an English one) and reads the text with English
// pronunciation rules -- audible as "the French/German Listen button
// sounds like English". This can't be fixed in code (there's no French/
// German voice to select), so instead we surface a one-time, dismissible
// explanation the first time it happens, via the existing info popover.
var VOICE_HINT_KEY = "udsp_voice_hint_seen_v1";
function maybeShowVoiceHint(langCode) {
  if (lsGet(VOICE_HINT_KEY, false)) return;
  lsSet(VOICE_HINT_KEY, true);
  showPopover(
    '<p class="example">🔊 Bu cihazda "' +
      escapeHtml(langCode) +
      '" için bir metin okuma (TTS) sesi yüklü değil, bu yüzden telaffuz İngilizce aksanına benzeyebilir. ' +
      "Daha doğru bir telaffuz için: Windows'ta Ayarlar → Saat ve Dil → Dil ve Bölge → Dil ekle (sesli okuma dahil); " +
      "macOS/iOS'ta Ayarlar → Erişilebilirlik → Konuşulan İçerik → Sesler. — " +
      "No text-to-speech voice for this language is installed on this device, so pronunciation may sound like an " +
      "English accent instead. Add a voice for this language in your system's settings for accurate pronunciation." +
      "</p>"
  );
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  var t = (text == null ? "" : String(text)).trim();
  if (!t) return;
  try {
    var synth = window.speechSynthesis;
    // Cancel UNCONDITIONALLY (not just when synth.speaking/pending report
    // true) before every speak(). iOS Safari has a long-documented bug
    // where its internal "speaking" flag can get stuck (or the utterance
    // queue gets wedged) without ever reporting speaking/pending as true
    // again -- if that's happened, a conditional cancel() never fires and
    // every future speak() call silently does nothing forever. cancel() on
    // an already-idle engine is a harmless no-op on every platform, so
    // there's no downside to always calling it first.
    synth.cancel();
    // Wake the speech service up in case it fell asleep (see the keepalive
    // interval above) -- a harmless no-op when it's already active.
    synth.resume();
    // Refresh the voice cache if it wasn't populated yet at page-load time --
    // otherwise the very first speak() after opening the page sometimes
    // fires with no voice attached and Chromium silently drops it (classic
    // "first utterance never plays" bug). This is especially common on
    // mobile, where the OS voice list often loads asynchronously and isn't
    // ready by the time the very first Listen tap fires.
    var voicesWereEmpty = !voiceCache.length;
    if (voicesWereEmpty) loadVoices();
    var u = new SpeechSynthesisUtterance(t);
    var langCode =
      (LANGS[currentLang] && LANGS[currentLang].speakLang) || "en-US";
    u.lang = langCode;
    var v = pickVoice(langCode);
    if (v) {
      u.voice = v;
    } else if (currentLang !== "en") {
      maybeShowVoiceHint(langCode);
    }
    u.rate = 0.9;
    // Set explicitly rather than relying on the spec default -- cheap
    // insurance against mobile browser builds that don't always apply a
    // sane default for an unset volume/pitch.
    u.volume = 1;
    u.pitch = 1;
    // IMPORTANT: speak() must be called synchronously, in the same call
    // stack as the user gesture (the click handler) that triggered it --
    // Safari/iOS silently refuses to produce any audio if speak() is
    // invoked from inside a setTimeout/Promise callback instead of directly
    // inside the gesture. Do not defer this call.
    synth.speak(u);
    // If the voice list was still empty at the moment we tried to speak
    // (very common on the very first tap on a mobile browser, since the
    // OS/browser hasn't finished loading its voice list yet), automatically
    // retry once as soon as voices actually arrive -- turns a silent first
    // tap into "plays a beat late" instead of "never plays at all" on
    // devices where voices simply load slowly.
    if (voicesWereEmpty && "speechSynthesis" in window) {
      var retryOnce = function () {
        window.speechSynthesis.removeEventListener("voiceschanged", retryOnce);
        if (voiceCache.length) return; // already retried via a fresh speak() call
        loadVoices();
        if (voiceCache.length) speak(t);
      };
      window.speechSynthesis.addEventListener("voiceschanged", retryOnce);
    }
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
function vocabDetailsUrl(word) {
  return LANGS[currentLang].detailsUrl(word);
}
function vocabExamplesUrl(word) {
  return LANGS[currentLang].examplesUrl(word);
}
function vocabLinkHtml(word) {
  return (
    '<span class="vocab-links">' +
    '<a class="vocab-link" href="' +
    vocabDetailsUrl(word) +
    '" target="_blank" rel="noopener noreferrer" data-tip="Detaylar">Details ↗</a>' +
    '<a class="vocab-link" href="' +
    vocabExamplesUrl(word) +
    '" target="_blank" rel="noopener noreferrer" data-tip="Örnekler">Examples ↗</a>' +
    "</span>"
  );
}
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Some data files fall back to a generic, content-free example sentence when
// no real example could be sourced for a word (e.g. `I am learning the word
// "X".` / `Ich lerne das Wort "X".` / `J'apprends le mot «X».`, or the newer
// honest "No example sentence available..." / "Kein Beispielsatz..."
// fallback used when even a real Tatoeba-sourced sentence couldn't be found
// -- see scripts/fix_placeholder_examples.py). That's an acceptable
// last-resort for plain display, but any game that builds its QUESTION out
// of the example sentence itself breaks down with it -- e.g. Cloze Test's
// fill-in-the-blank becomes "I am learning the word "_______"." which gives
// zero context clue (the blank could be any word), and Sentence Scramble's
// word-reorder puzzle teaches nothing (or, for the honest fallback, would
// scramble a sentence totally unrelated to the word). Games that construct
// a question from `example` should exclude these via this helper.
function isPlaceholderExample(example) {
  if (!example) return false;
  return /^(I am learning the word|Ich lerne das Wort|J['’]apprends le mot|No example sentence available|Kein Beispielsatz)\b/.test(
    String(example).trim()
  );
}

// Case/diacritic-insensitive text fold, shared by typing-based games (Word
// Race, Listening Dictation) for answer checking.
function foldText(s) {
  if (!s) return "";
  var t = String(s).replace(/\u00df/g, "ss");
  t = t.normalize ? t.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : t;
  return t.toLowerCase().trim();
}
// True if a/b differ by at most one insert/delete/substitute (cheap
// two-pointer approximation of edit-distance-<=1, not a full DP).
function editDistanceLE1(a, b) {
  if (a === b) return true;
  var la = a.length,
    lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  var i = 0,
    j = 0,
    edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    edits++;
    if (edits > 1) return false;
    if (la === lb) {
      i++;
      j++;
    } else if (la > lb) {
      i++;
    } else {
      j++;
    }
  }
  if (i < la || j < lb) edits++;
  return edits <= 1;
}
// Small-tolerance fuzzy match for typed answers: exact match always passes;
// a single-character typo is forgiven only for words of 5+ letters (short
// words need exact spelling, since a 1-edit tolerance would accept too many
// unrelated words).
function fuzzyMatch(input, target) {
  var a = foldText(input);
  var b = foldText(target);
  if (!a || !b) return false;
  if (a === b) return true;
  if (b.length >= 5) return editDistanceLE1(a, b);
  return false;
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
// The paragraph itself is never shown inline any more (always stays
// hidden) -- its text is just the data source for the floating popover
// (see showPopover() below); this keeps every existing call site's markup
// and IDs unchanged.
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
    var ex = $(exampleId);
    if (ex && ex.textContent) {
      showPopover('<p class="example">' + escapeHtml(ex.textContent) + "</p>");
    }
  });
}

/* ---------- floating info popover (Hint / Example reveal box) ----------
 * Every "Hint"/"Example" style reveal button across the app shows its
 * extra content in this one small, rounded, closeable overlay instead of
 * inline in the page flow -- positioned on top of the current card/question
 * so it works the same on every screen (quiz, review, any game). This is
 * deliberately NOT a browser popup window (window.open()) -- those can be
 * blocked by the browser -- just a positioned <div> with a backdrop, closed
 * via its own × button, the Escape key, or clicking the backdrop.
 */
function ensurePopover() {
  var existing = $("info-popover");
  if (existing) return existing;
  var backdrop = document.createElement("div");
  backdrop.className = "info-popover-backdrop";
  backdrop.id = "info-popover-backdrop";
  backdrop.hidden = true;
  var box = document.createElement("div");
  box.className = "info-popover";
  box.id = "info-popover";
  box.hidden = true;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "false");
  box.innerHTML =
    '<button type="button" class="info-popover-close" id="info-popover-close" aria-label="Close">×</button>' +
    '<div class="info-popover-body" id="info-popover-body"></div>';
  document.body.appendChild(backdrop);
  document.body.appendChild(box);
  backdrop.addEventListener("click", hidePopover);
  box.querySelector(".info-popover-close").addEventListener("click", hidePopover);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") hidePopover();
  });
  return box;
}
function showPopover(html) {
  ensurePopover();
  var body = $("info-popover-body");
  if (body) body.innerHTML = html;
  setHidden("info-popover-backdrop", false);
  setHidden("info-popover", false);
}
function hidePopover() {
  setHidden("info-popover-backdrop", true);
  setHidden("info-popover", true);
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
// Language, Level, and (see the mode-select block near the bottom of this
// file) Study-mode are native <select> combo boxes -- not spread-out
// button rows -- to keep the header compact (German alone has 13 levels).
var levelsNav = $("levels-nav");
var langsNav = $("langs-nav");

function renderLevelButtons() {
  if (!levelsNav) return;
  levelsNav.innerHTML = "";
  LEVELS.forEach(function (l) {
    var opt = document.createElement("option");
    opt.value = l;
    opt.textContent = levelLabel(l);
    levelsNav.appendChild(opt);
  });
  var mix = document.createElement("option");
  mix.value = "MIX";
  mix.textContent = "Mix";
  levelsNav.appendChild(mix);
}

// Captured once at load time (before any language switch ever mutates it),
// so applyLang() can prefix the CURRENT language onto the page's own
// hand-crafted SEO <title> instead of replacing it outright. Overwriting
// document.title wholesale on every load used to be a real bug (see the
// "SEO optimization pass" section of the repo notes) -- this only ever
// prepends to the original static title, never destroys it.
var BASE_TITLE = document.title;

function applyLang() {
  var cfg = LANGS[currentLang];
  document.documentElement.lang = currentLang;
  document.title = cfg.label + " — " + BASE_TITLE;
  if (langsNav) langsNav.value = currentLang;
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

  if (levelsNav) levelsNav.value = level;
  applyLevelLabels();
  setText("word-total", WORDS.length);
  saveResume();
  fireLevelChange();
}

function setLang(lang) {
  if (!LANGS[lang] || lang === currentLang) return;
  if (langsNav) langsNav.disabled = true;
  ensureLangData(lang, function () {
    if (langsNav) langsNav.disabled = false;
    currentLang = lang;
    WORD_SETS = buildWordSets(lang);
    LEVELS = LANGS[lang].levels.slice();
    DEFAULT_LEVEL = LANGS[lang].defaultLevel;
    applyLang();
    renderLevelButtons();
    setLevel(DEFAULT_LEVEL);
  });
}

if (langsNav) {
  langsNav.addEventListener("change", function () {
    setLang(langsNav.value);
  });
}
if (levelsNav) {
  levelsNav.addEventListener("change", function () {
    setLevel(levelsNav.value);
  });
}

// Study-mode top nav ( Flashcards / Review / Quiz / ... ) is a <select>
// jump-menu now too: navigate on change. Also wired (duplicated, ~4 lines)
// in moresheet.js for the 4 pages that don't load this file.
var modeSelect = $("mode-select");
if (modeSelect) {
  modeSelect.addEventListener("change", function () {
    if (modeSelect.value) location.href = modeSelect.value;
  });
}

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
  var resume = lsGet(RESUME_KEY, null);
  // If the returning visitor's last-used language was German/French, fetch
  // its data/*.js files (lazy-loaded, not in the static <script> tags --
  // see ensureLangData()) before rendering anything, same as a live
  // setLang() switch. For everyone else (new visitors, or resuming in
  // English) this resolves synchronously/immediately, so behavior is
  // unchanged from before lazy-loading existed.
  var initialLang = resume && LANGS[resume.lang] ? resume.lang : currentLang;
  ensureLangData(initialLang, function () {
    var hasAny = LANG_ORDER.some(function (lang) {
      return LANGS[lang].levels.some(function (l) {
        return (window[LANGS[lang].sets[l]] || []).length;
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
  });
}
