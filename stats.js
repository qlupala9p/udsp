/* Top Words — Stats / dashboard page logic. Requires shared.js to be loaded first. */
"use strict";

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
  if (lp) {
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
}

on("stats-reset", "click", function () {
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
      } catch (e) {
        /* ignore */
      }
    }
  );
  LANG_ORDER.forEach(function (lang) {
    LANGS[lang].levels.concat(["MIX"]).forEach(function (l) {
      try {
        localStorage.removeItem("udsp_best_scores_" + lang + "_" + l + "_v1");
      } catch (e) {
        /* ignore */
      }
    });
  });
  known = {};
  fav = {};
  srs = {};
  stats = { answered: 0, correct: 0, exams: 0, reviews: 0 };
  streak = { current: 0, longest: 0, last: "" };
  renderStreak();
  renderStats();
});

onLevelChange(renderStats);
