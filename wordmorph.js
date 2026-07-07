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
var WM_ROUND_SIZE = 10;
var WM_WIN_THRESHOLD = 5; // score >= 5 out of 10 = Winner, else Loss

var wmActive = false;
var wmRoundWords = []; // the WM_ROUND_SIZE pool items picked for the current round
var wmRoundIndex = 0; // 0-based index of the current question within the round
var wmRoundScore = 0; // correct answers so far this round
var wmRoundsWon = 0; // session tally of rounds finished with score >= WM_WIN_THRESHOLD
var wmRoundsLost = 0; // session tally of rounds finished with score < WM_WIN_THRESHOLD
var wmItem = null; // { entry, types: { synonyms: [...], antonyms: [...] } }
var wmType = null;
var wmDone = false;
var wmPoolCache = {};
var wmTypeFilter = "synonyms"; // user's Synonym/Antonym choice on the setup screen; every question in a round matches this type

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

// Subset of wmBuildPool() restricted to items that have the CURRENTLY
// selected Synonym/Antonym type (wmTypeFilter), so every question drawn
// from it is guaranteed to match the user's choice.
function wmFilteredPool() {
  return wmBuildPool().filter(function (item) {
    return !!item.types[wmTypeFilter];
  });
}

function refreshWordMorphStart() {
  var pool = wmFilteredPool();
  var ok = pool.length >= WM_ROUND_SIZE;
  setText("wordmorph-start-level", WM_LANG_LABEL[currentLang] || WM_LANG_LABEL.en);
  setText(
    "wordmorph-start-count",
    ok
      ? pool.length +
          (pool.length === 1 ? " word" : " words") +
          " available for " +
          WM_TYPE_LABEL[wmTypeFilter] +
          " practice · " +
          WM_ROUND_SIZE +
          " questions per round"
      : ""
  );
  setHidden("wordmorph-start-warning", ok);
  if (!ok) {
    setText(
      "wordmorph-start-warning",
      "Not enough words with " +
        WM_TYPE_LABEL[wmTypeFilter].toLowerCase() +
        " data for a round of " +
        WM_ROUND_SIZE +
        " yet."
    );
  }
  var btn = $("wordmorph-start-btn");
  if (btn) btn.disabled = !ok;
}

function setWordMorphTypeFilter(type) {
  if (type !== "synonyms" && type !== "antonyms") return;
  wmTypeFilter = type;
  var wrap = $("wordmorph-type-picker");
  if (wrap) {
    wrap.querySelectorAll(".wm-type-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-type") === type);
    });
  }
  refreshWordMorphStart();
}

function showWordMorphSetup() {
  wmActive = false;
  setPlayHeader(false);
  refreshWordMorphStart();
  setHidden("wordmorph-game", true);
  setHidden("wordmorph-round-result", true);
  setHidden("wordmorph-setup", false);
}

function resetWordMorph() {
  wmActive = false;
  wmRoundsWon = 0;
  wmRoundsLost = 0;
  showWordMorphSetup();
}

function enterWordMorph() {
  if (!wmActive) showWordMorphSetup();
}

function wmPickType(item) {
  // Rounds are built from wmFilteredPool(), so every item is guaranteed to
  // have the user's selected type -- no need to pick randomly among types.
  if (item.types[wmTypeFilter]) return wmTypeFilter;
  var keys = Object.keys(item.types);
  return keys.length ? keys[Math.floor(Math.random() * keys.length)] : null;
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
  setText("wordmorph-level-badge", currentLang === "de" ? "DE" : "EN");
  startNewRound();
}

// Picks WM_ROUND_SIZE distinct words for a fresh round and loads question 1.
function startNewRound() {
  var pool = wmFilteredPool();
  wmRoundWords = shuffle(pool).slice(0, WM_ROUND_SIZE);
  wmRoundIndex = 0;
  wmRoundScore = 0;
  setHidden("wordmorph-round-result", true);
  setHidden("wordmorph-game", false);
  loadRoundQuestion();
}

function loadRoundQuestion() {
  var poolItem = wmRoundWords[wmRoundIndex];
  var attempts = 0;
  var type = null;
  var options = null;
  while (poolItem && attempts < 6) {
    attempts++;
    type = wmPickType(poolItem);
    if (!type) continue;
    options = wmBuildOptions(poolItem, type);
    if (options) break;
    options = null;
  }
  if (!poolItem || !type || !options) {
    // Extremely unlikely given the eligibility gating, but fall back to a
    // fresh random pool word rather than getting stuck on this question.
    var pool = wmBuildPool();
    if (!pool.length) {
      showWordMorphSetup();
      return;
    }
    wmRoundWords[wmRoundIndex] = pool[Math.floor(Math.random() * pool.length)];
    loadRoundQuestion();
    return;
  }
  wmItem = poolItem;
  wmType = type;
  wmItem.options = options;
  wmDone = false;
  setText("wordmorph-qnum", wmRoundIndex + 1);
  setText("wordmorph-score", wmRoundScore);
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
  renderWordMorphHint("wordmorph-definition", "Definition", it.entry.definition);
  renderWordMorphHint("wordmorph-example", "Example", it.entry.example);
  var linkDetails = $("wordmorph-link-details");
  if (linkDetails) linkDetails.href = vocabDetailsUrl(it.entry.word);
  var linkExamples = $("wordmorph-link-examples");
  if (linkExamples) linkExamples.href = vocabExamplesUrl(it.entry.word);

  var fb = $("wordmorph-feedback");
  if (fb) {
    fb.textContent = "";
    fb.className = "feedback";
  }
  setHidden("wordmorph-result", true);

  var wmHintBtn = $("wordmorph-hint-btn");
  if (wmHintBtn) wmHintBtn.disabled = false;

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

// 50/50: disable two of the wrong options for the current question.
function wmHint() {
  if (wmDone || !wmItem) return;
  var wrap = $("wordmorph-options");
  if (!wrap) return;
  var wrong = [];
  wrap.querySelectorAll(".option").forEach(function (b, i) {
    if (!b.disabled && wmItem.options[i] && !wmItem.options[i].isCorrect) wrong.push(b);
  });
  shuffle(wrong)
    .slice(0, 2)
    .forEach(function (b) {
      b.disabled = true;
      b.classList.add("is-5050");
    });
  var hintBtn = $("wordmorph-hint-btn");
  if (hintBtn) hintBtn.disabled = true;
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

  if (isCorrect) wmRoundScore++;
  setText("wordmorph-score", wmRoundScore);

  stats.answered = (stats.answered || 0) + 1;
  if (isCorrect) stats.correct = (stats.correct || 0) + 1;
  lsSet(STATS_KEY, stats);
  touchStreak();

  showWordMorphResult(isCorrect);
}

// data/synanten.js and data/synantde.js store definition/example as
// "<native-language text>;<Turkish text>" (see their file headers). Renders
// both halves as one labeled line, e.g. "Definition: <native> — <Turkish>".
// Hides the element entirely when the field is empty.
function renderWordMorphHint(id, label, raw) {
  var el = $(id);
  if (!el) return;
  var value = raw || "";
  if (!value) {
    el.textContent = "";
    setHidden(id, true);
    return;
  }
  var sepIdx = value.indexOf(";");
  var native = sepIdx === -1 ? value : value.slice(0, sepIdx);
  var turkish = sepIdx === -1 ? "" : value.slice(sepIdx + 1);
  el.innerHTML =
    '<span class="hm-answer-label">' +
    escapeHtml(label) +
    ":</span> " +
    escapeHtml(native) +
    (turkish ? " — " + escapeHtml(turkish) : "");
  setHidden(id, false);
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
  var isLastQuestion = wmRoundIndex >= WM_ROUND_SIZE - 1;
  setText("wordmorph-next", isLastQuestion ? "See results →" : "Next word →");
  setHidden("wordmorph-result", false);
  speak(w.word);
}

// Ends the current round: tallies Winner (score >= WM_WIN_THRESHOLD) vs Loss,
// and shows the round-result screen with a "play the next 10" option.
function finishRound() {
  var win = wmRoundScore >= WM_WIN_THRESHOLD;
  if (win) wmRoundsWon++;
  else wmRoundsLost++;

  setHidden("wordmorph-game", true);
  setHidden("wordmorph-round-result", false);

  var perfect = wmRoundScore === WM_ROUND_SIZE;
  setText("wordmorph-round-emoji", win ? (perfect ? "🏆" : "🎉") : "📚");
  setText("wordmorph-round-title", win ? "You're a Winner! 🎉" : "Loss — try again?");
  setText("wordmorph-round-score", wmRoundScore + " / " + WM_ROUND_SIZE);
  var barFill = $("wordmorph-round-bar-fill");
  if (barFill) barFill.style.width = (wmRoundScore / WM_ROUND_SIZE) * 100 + "%";
  setText(
    "wordmorph-round-text",
    win
      ? "Great job — you got " + wmRoundScore + " out of " + WM_ROUND_SIZE + " correct."
      : "You got " +
          wmRoundScore +
          " out of " +
          WM_ROUND_SIZE +
          " correct. Get at least " +
          WM_WIN_THRESHOLD +
          " correct to win."
  );
  setText(
    "wordmorph-round-tally",
    "Rounds won: " + wmRoundsWon + " · Rounds lost: " + wmRoundsLost
  );
}

function wireWordMorphTypePicker() {
  var wrap = $("wordmorph-type-picker");
  if (!wrap) return;
  wrap.querySelectorAll(".wm-type-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setWordMorphTypeFilter(btn.getAttribute("data-type"));
    });
  });
}
wireWordMorphTypePicker();

on("wordmorph-start-btn", "click", function () {
  startWordMorph();
});
on("wordmorph-hint-btn", "click", wmHint);
on("wordmorph-back", "click", showWordMorphSetup);
on("wordmorph-change", "click", showWordMorphSetup);
on("wordmorph-round-setup", "click", showWordMorphSetup);
on("wordmorph-round-again", "click", startNewRound);
on("wordmorph-next", "click", function () {
  if (wmRoundIndex >= WM_ROUND_SIZE - 1) {
    finishRound();
  } else {
    wmRoundIndex++;
    loadRoundQuestion();
  }
});
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
