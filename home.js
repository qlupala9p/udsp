/* Top Words — Home dashboard.
 * Reads localStorage directly (streak, resume, known, favourites) and renders
 * an orientation/dashboard screen. Deliberately does NOT load shared.js or the
 * word-data files: it only needs a handful of localStorage keys, so it stays
 * instant and avoids shared.js's "no words loaded" bootstrap guard. Keys here
 * are kept in sync with shared.js by hand (they are stable/versioned). */
"use strict";
(function () {
  var WELCOME_KEY = "udsp_welcomed_v1";
  var RESUME_KEY = "udsp_resume_v2";
  var KNOWN_KEY = "udsp_known_v1";
  var FAV_KEY = "udsp_fav_v1";
  var STREAK_KEY = "udsp_streak_v1";

  function get(k, d) {
    try {
      var v = JSON.parse(localStorage.getItem(k));
      return v === null || v === undefined ? d : v;
    } catch (e) {
      return d;
    }
  }
  function set(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  var LANG_NAME = { en: "English", de: "German", fr: "French" };
  var LANG_FLAG = { en: "🇬🇧", de: "🇩🇪", fr: "🇫🇷" };
  var DEFAULT_LEVEL = { en: "B2", de: "GA1", fr: "A1" };
  function levelLabel(l) {
    if (!l) return "";
    if (l === "MIX") return "Mix";
    if (l === "PV") return "Phrasal Verbs";
    if (l === "PART") return "Partikelverb";
    var g = { GA1: "A1", GA2: "A2", GB1: "B1", GB2: "B2", GC1: "C1", GC2: "C2" };
    return g[l] || l;
  }

  var resume = get(RESUME_KEY, null);
  var known = get(KNOWN_KEY, {});
  var fav = get(FAV_KEY, {});
  var streak = get(STREAK_KEY, { current: 0, longest: 0, last: "" });
  var knownCount = Object.keys(known).length;
  var favCount = Object.keys(fav).length;
  var streakN = streak.current || 0;
  var returning = !!resume || knownCount > 0 || streakN > 0;
  var studiedToday = streak.last === todayStr();

  // Mark that the home/welcome has been shown, so index.html's first-visit
  // redirect (shared.js) does not send this browser back here again.
  set(WELCOME_KEY, 1);

  function startLang(lang) {
    set(RESUME_KEY, { lang: lang, level: DEFAULT_LEVEL[lang] || "A1", category: "Mix" });
    location.href = "index.html";
  }

  var html = "";

  if (returning) {
    html += '<section class="home-hero">';
    html += '<h1 class="home-title">👋 Tekrar hoş geldin · Welcome back</h1>';
    html += '<div class="home-stat-row">';
    html +=
      '<div class="home-stat"><span class="home-stat-num">🔥 ' + streakN +
      '</span><span class="home-stat-label">günlük seri · day streak</span></div>';
    html +=
      '<div class="home-stat"><span class="home-stat-num">✓ ' + knownCount +
      '</span><span class="home-stat-label">bilinen · known</span></div>';
    html +=
      '<div class="home-stat"><span class="home-stat-num">★ ' + favCount +
      '</span><span class="home-stat-label">favori · saved</span></div>';
    html += "</div>";
    if (studiedToday) {
      html +=
        '<p class="home-goal ok">✅ Bugün çalıştın — serini koru! · You studied today — keep it going!</p>';
    } else {
      html +=
        '<p class="home-goal">🎯 Bugünün hedefi: birkaç kelime çalış ve serini sürdür. · Study a little today to keep your streak.</p>';
    }
    if (resume) {
      html +=
        '<a class="home-continue" href="index.html">▶ Devam et · Continue — <strong>' +
        esc(LANG_NAME[resume.lang] || resume.lang) + " · " + esc(levelLabel(resume.level)) +
        "</strong></a>";
    } else {
      html +=
        '<a class="home-continue" href="index.html">▶ Kelime kartlarına başla · Start Flashcards</a>';
    }
    html += "</section>";
  } else {
    html += '<section class="home-hero">';
    html += '<h1 class="home-title">👋 Top Words\u2019e hoş geldin!</h1>';
    html +=
      '<p class="home-sub">İngilizce, Almanca ve Fransızca kelimeleri kartlar, testler ve oyunlarla öğren — ücretsiz, kayıt yok. · Learn English, German &amp; French vocabulary with flashcards, quizzes and games — free, no sign-up.</p>';
    html += '<p class="home-pick">Başlamak için bir dil seç · Choose a language to start:</p>';
    html += '<div class="home-langs">';
    ["en", "de", "fr"].forEach(function (l) {
      html +=
        '<button type="button" class="home-lang-btn" data-lang="' + l + '">' +
        LANG_FLAG[l] + " " + LANG_NAME[l] + "</button>";
    });
    html += "</div>";
    html += '<div class="home-steps">';
    html += '<div class="home-step"><span class="home-step-n">1</span> Kartı çevir, anlamı gör · Flip a card to see the meaning</div>';
    html += '<div class="home-step"><span class="home-step-n">2</span> Test &amp; oyunlarla pekiştir · Reinforce with quizzes &amp; games</div>';
    html += '<div class="home-step"><span class="home-step-n">3</span> Günlük serini ve ilerlemeni takip et · Track your streak &amp; progress</div>';
    html += "</div>";
    html += "</section>";
  }

  var links = [
    ["index.html", "🃏", "Flashcards", "Kelime kartları"],
    ["quiz.html", "📝", "Quiz", "20 soruluk test"],
    ["games.html", "🎮", "Games", "12 oyun"],
    ["wordlist.html", "📋", "Word List", "Tüm kelimeler"],
    ["stats.html", "📊", "Stats", "İlerlemen"],
  ];
  html += '<h2 class="home-section-title">Hızlı erişim · Jump in</h2>';
  html += '<div class="game-tiles">';
  links.forEach(function (a) {
    html +=
      '<a class="game-tile" href="' + a[0] + '"><span class="game-tile-icon">' +
      a[1] + '</span><span class="game-tile-name">' + a[2] +
      '</span><span class="game-tile-desc">' + a[3] + "</span></a>";
  });
  html += "</div>";

  var root = document.getElementById("home-root");
  if (root) {
    root.innerHTML = html;
    var btns = root.querySelectorAll(".home-lang-btn");
    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener("click", function () {
        startLang(b.getAttribute("data-lang"));
      });
    });
  }
})();
