/* Top Words — Word Morph (synonym / antonym guessing) page logic.
 * Requires shared.js.
 *
 * Data source: this game deliberately does NOT use the CEFR data/words*.js
 * files. Instead it reads two standalone globals populated by
 * data/synanten.js (window.SYN_ANT_EN, from an external English
 * synonym/antonym word list) and data/synantde.js (window.SYN_ANT_DE, from
 * an external German synonym list with hand-curated antonyms added on top).
 * Each entry is { word, level, definition, example, synonyms, antonyms }
 * with synonyms/antonyms as semicolon-separated strings (definition/example
 * are intentionally empty — see the data file headers for why). The CEFR
 * words*.js files are still loaded on this page (see wordmorph.html) only
 * so the shared header/language-switch infrastructure in shared.js has
 * *some* non-empty word data to bootstrap with; Word Morph's own logic
 * below never reads WORD_SETS/currentLevel/WORDS at all.
 */
"use strict";

var WM_TYPES = ["synonyms", "antonyms"];
var WM_TYPE_LABEL = {
  synonyms: "Synonym",
  antonyms: "Antonym",
};
var WM_TYPE_ARTICLE = {
  synonyms: "a",
  antonyms: "an",
};
var WM_LANG_LABEL = {
  en: "Synonyms & Antonyms (English)",
  de: "Synonyme & Antonyme (German)",
};

var wmActive = false;
var wmWins = 0;
var wmLosses = 0;
var wmItem = null; // { entry, types: { synonyms: [...], antonyms: [...] } }
var wmType = null;
var wmDone = false;
var wmPoolCache = {};

function wmFold(s) {
  if (!s) return "";
  var t = String(s).replace(/\u00df/g, "ss");
  t = t.normalize ? t.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : t;
  return t.toLowerCase().trim();
}

// Split a semicolon-separated field into a clean, deduplicated list.
function wmSplitField(str) {
  if (!str) return [];
  var seen = {};
  var out = [];
  String(str)
    .split(";")
    .forEach(function (part) {
      var v = part.trim();
      if (!v) return;
      var f = wmFold(v);
      if (seen[f]) return;
      seen[f] = true;
      out.push(v);
    });
  return out;
}

// Word Morph's pool is keyed ONLY by language (not level): the full
// external list for the current language, pre-parsed once and cached.
function wmSourceData() {
  return currentLang === "de" ? window.SYN_ANT_DE || [] : window.SYN_ANT_EN || [];
}

function wmBuildPool() {
  var cached = wmPoolCache[currentLang];
  if (cached) return cached;
  var set = wmSourceData();
  var pool = [];
  set.forEach(function (w) {
    if (!w || !w.word) return;
    var types = {};
    var any = false;
    WM_TYPES.forEach(function (t) {
      var list = wmSplitField(w[t]);
      if (list.length) {
        types[t] = list;
        any = true;
      }
    });
    if (!any) return;
    pool.push({ entry: w, types: types });
  });
  wmPoolCache[currentLang] = pool;
  return pool;
}

function refreshWordMorphStart() {
  var pool = wmBuildPool();
  var ok = pool.length >= 4;
  setText("wordmorph-start-level", WM_LANG_LABEL[currentLang] || WM_LANG_LABEL.en);
  setText(
    "wordmorph-start-count",
    ok ? pool.length + (pool.length === 1 ? " word" : " words") + " available" : ""
  );
  setHidden("wordmorph-start-warning", ok);
  if (!ok) {
    setText(
      "wordmorph-start-warning",
      "No synonym/antonym word list is loaded for this language yet."
    );
  }
  var btn = $("wordmorph-start-btn");
  if (btn) btn.disabled = !ok;
}

function showWordMorphSetup() {
  wmActive = false;
  setPlayHeader(false);
  refreshWordMorphStart();
  setHidden("wordmorph-game", true);
  setHidden("wordmorph-setup", false);
}

function resetWordMorph() {
  wmActive = false;
  showWordMorphSetup();
}

function enterWordMorph() {
  if (!wmActive) showWordMorphSetup();
}

function wmPickItem() {
  var pool = wmBuildPool();
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function wmPickType(item) {
  var keys = Object.keys(item.types);
  if (!keys.length) return null;
  return keys[Math.floor(Math.random() * keys.length)];
}

// Distractors are drawn from ANY relation-type value belonging to OTHER
// words in the same pool (not just the same type) so that words with a
// short synonym/antonym list still reliably produce 3 plausible wrong
// answers.
function wmBuildOptions(item, type) {
  var correctList = item.types[type];
  if (!correctList || !correctList.length) return null;
  var correct = correctList[Math.floor(Math.random() * correctList.length)];
  var seen = {};
  seen[wmFold(correct)] = true;
  var bag = [];
  wmBuildPool().forEach(function (p) {
    if (p.entry === item.entry) return;
    WM_TYPES.forEach(function (t) {
      (p.types[t] || []).forEach(function (v) {
        var f = wmFold(v);
        if (seen[f]) return;
        seen[f] = true;
        bag.push(v);
      });
    });
  });
  if (bag.length < 3) return null;
  var distractors = shuffle(bag).slice(0, 3);
  return shuffle(
    [{ value: correct, isCorrect: true }].concat(
      distractors.map(function (d) {
        return { value: d, isCorrect: false };
      })
    )
  );
}

function startWordMorph() {
  wmActive = true;
  setPlayHeader(true);
  setHidden("wordmorph-setup", true);
  setHidden("wordmorph-game", false);
  setText("wordmorph-level-badge", currentLang === "de" ? "DE" : "EN");
  setText("wordmorph-wins", wmWins);
  setText("wordmorph-losses", wmLosses);
  newWordMorphItem();
}

function newWordMorphItem() {
  var pool = wmBuildPool();
  var attempts = 0;
  var item, type, options;
  while (attempts < 12) {
    attempts++;
    item = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    if (!item) break;
    type = wmPickType(item);
    if (!type) continue;
    options = wmBuildOptions(item, type);
    if (options) break;
    options = null;
  }
  if (!item || !type || !options) {
    showWordMorphSetup();
    return;
  }
  wmItem = item;
  wmType = type;
  wmItem.options = options;
  wmDone = false;
  renderWordMorphItem();
}

function renderWordMorphItem() {
  var it = wmItem;
  var type = wmType;
  setText("wordmorph-pos", it.entry.pos || "");
  var badge = $("wordmorph-type-badge");
  if (badge) {
    badge.textContent = WM_TYPE_LABEL[type];
    badge.className = "morph-type-badge " + type.slice(0, -1);
  }
  setText(
    "wordmorph-prompt",
    "Which word is " + WM_TYPE_ARTICLE[type] + " " + WM_TYPE_LABEL[type].toLowerCase() + " of:"
  );
  setText("wordmorph-word", it.entry.word);

  var fb = $("wordmorph-feedback");
  if (fb) {
    fb.textContent = "";
    fb.className = "feedback";
  }
  setHidden("wordmorph-result", true);

  var letters = ["A", "B", "C", "D"];
  var wrap = $("wordmorph-options");
  if (!wrap) return;
  wrap.innerHTML = "";
  it.options.forEach(function (opt, idx) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option";
    btn.innerHTML =
      '<span class="key">' + letters[idx] + "</span><span>" +
      escapeHtml(opt.value) + "</span>";
    btn.addEventListener("click", function () {
      answerWordMorph(idx, btn);
    });
    wrap.appendChild(btn);
  });
}

function answerWordMorph(idx, btn) {
  if (wmDone || !wmItem) return;
  wmDone = true;
  var chosen = wmItem.options[idx];
  var isCorrect = !!chosen.isCorrect;

  var wrap = $("wordmorph-options");
  if (wrap) {
    wrap.querySelectorAll(".option").forEach(function (el, i) {
      el.disabled = true;
      if (wmItem.options[i].isCorrect) el.classList.add("correct");
    });
  }
  if (!isCorrect) btn.classList.add("wrong");

  var fb = $("wordmorph-feedback");
  if (fb) {
    fb.textContent = isCorrect ? "Correct!" : "Not quite.";
    fb.className = "feedback " + (isCorrect ? "ok" : "no");
  }

  if (isCorrect) {
    wmWins++;
    setText("wordmorph-wins", wmWins);
  } else {
    wmLosses++;
    setText("wordmorph-losses", wmLosses);
  }

  stats.answered = (stats.answered || 0) + 1;
  if (isCorrect) stats.correct = (stats.correct || 0) + 1;
  lsSet(STATS_KEY, stats);
  touchStreak();

  showWordMorphResult(isCorrect);
}

function showWordMorphResult(isCorrect) {
  var it = wmItem;
  var type = wmType;
  var w = it.entry;
  var rt = $("wordmorph-result-text");
  if (rt) {
    rt.textContent = isCorrect ? "🎉 Correct!" : "❌ Not quite";
    rt.className = "hangman-result-text " + (isCorrect ? "win" : "lose");
  }
  var ansEl = $("wordmorph-answer");
  if (ansEl) {
    ansEl.innerHTML =
      '<span class="hm-answer-label">' +
      escapeHtml(WM_TYPE_LABEL[type] + (it.types[type].length > 1 ? "s" : "")) +
      ' of "' +
      escapeHtml(w.word) +
      '":</span> <strong>' +
      escapeHtml(it.types[type].join(", ")) +
      "</strong>";
  }
  setText("wordmorph-definition", w.definition || "");
  var link = $("wordmorph-link");
  if (link) link.href = vocabUrl(w.word);
  setHidden("wordmorph-result", false);
  speak(w.word);
}

on("wordmorph-start-btn", "click", function () {
  startWordMorph();
});
on("wordmorph-back", "click", showWordMorphSetup);
on("wordmorph-change", "click", showWordMorphSetup);
on("wordmorph-next", "click", newWordMorphItem);
document.addEventListener("keydown", function (e) {
  var g = $("wordmorph-game");
  if (!g || g.hidden || !wmItem || wmDone) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  var map = { 1: 0, 2: 1, 3: 2, 4: 3, a: 0, b: 1, c: 2, d: 3 };
  var k = (e.key || "").toLowerCase();
  if (k in map) {
    var idx = map[k];
    var wrap = $("wordmorph-options");
    var btns = wrap ? wrap.querySelectorAll(".option") : [];
    if (btns[idx] && !btns[idx].disabled) {
      e.preventDefault();
      btns[idx].click();
    }
  }
});

onLevelChange(resetWordMorph);
