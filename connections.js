/* Top Words — Hidden Connection (grouping puzzle) game page logic.
 * Requires shared.js.
 *
 * Each round picks 4 part-of-speech categories (noun/verb/adjective/adverb/
 * preposition/etc — whichever exist in the current level) with at least 4
 * words each, takes 4 random words per category (16 tiles total), and the
 * player must find the 4 hidden groups by tapping 4 words they believe share
 * the same word type. The shared word type ("NOUN", "VERB", ...) is only
 * revealed once a group is solved.
 */
"use strict";

var CONN_GROUP_SIZE = 4;
var CONN_GROUPS_NEEDED = 4;
var CONN_MAX_MISTAKES = 4;
var connActive = false;
var connLevel = null;
var connTiles = []; // [{ word, pos, groupIdx, solved }]
var connSelected = []; // indices into connTiles currently selected
var connGroupsSolved = []; // [{ pos, words:[...] }]
var connMistakes = 0;
var connDone = false;

function connEligible(w) {
  return !!(w && w.word && w.pos);
}

function connBuildPosMap(level) {
  var pool = (WORD_SETS[level] || []).filter(connEligible);
  var byPos = {};
  pool.forEach(function (w) {
    var key = w.pos;
    if (!byPos[key]) byPos[key] = [];
    byPos[key].push(w);
  });
  return byPos;
}

function connQualifyingPosCount(level) {
  var byPos = connBuildPosMap(level);
  var count = 0;
  Object.keys(byPos).forEach(function (k) {
    if (byPos[k].length >= CONN_GROUP_SIZE) count++;
  });
  return count;
}

function refreshConnStart() {
  var qualifying = connQualifyingPosCount(currentLevel);
  var ok = qualifying >= CONN_GROUPS_NEEDED;
  setText("conn-start-level", levelLabel(currentLevel));
  setText("conn-start-count", ok ? qualifying + " word-type groups available" : "");
  setHidden("conn-start-warning", ok);
  if (!ok) {
    setText(
      "conn-start-warning",
      "Not enough variety of word types in this level for Hidden Connection (needs 4 groups of 4) \u2014 pick another level above."
    );
  }
  var btn = $("conn-start-btn");
  if (btn) btn.disabled = !ok;
}

function showConnSetup() {
  connActive = false;
  setPlayHeader(false);
  refreshConnStart();
  setHidden("conn-game", true);
  setHidden("conn-setup", false);
}

function resetConn() {
  connActive = false;
  showConnSetup();
}

function enterConn() {
  if (!connActive) showConnSetup();
}

function startConn(level) {
  connLevel = level;
  connActive = true;
  setPlayHeader(true);
  setHidden("conn-setup", true);
  setHidden("conn-game", false);
  setText("conn-level-badge", levelLabel(level));
  newConnRound();
}

function newConnRound() {
  var byPos = connBuildPosMap(connLevel);
  var qualifyingKeys = Object.keys(byPos).filter(function (k) {
    return byPos[k].length >= CONN_GROUP_SIZE;
  });
  qualifyingKeys = shuffle(qualifyingKeys).slice(0, CONN_GROUPS_NEEDED);
  if (qualifyingKeys.length < CONN_GROUPS_NEEDED) {
    showConnSetup();
    return;
  }
  var tiles = [];
  qualifyingKeys.forEach(function (posName, groupIdx) {
    var picks = shuffle(byPos[posName]).slice(0, CONN_GROUP_SIZE);
    picks.forEach(function (w) {
      tiles.push({ word: w.word, pos: posName, groupIdx: groupIdx, solved: false });
    });
  });
  connTiles = shuffle(tiles);
  connSelected = [];
  connGroupsSolved = [];
  connMistakes = 0;
  connDone = false;
  setText("conn-mistakes", "Mistakes: 0 / " + CONN_MAX_MISTAKES);
  setHidden("conn-result", true);
  renderConnGroups();
  renderConnGrid();
}

function renderConnGroups() {
  var box = $("conn-groups");
  if (!box) return;
  box.innerHTML = "";
  connGroupsSolved.forEach(function (g, i) {
    var row = document.createElement("div");
    row.className = "conn-group-row g" + (i % 4);
    var label = document.createElement("div");
    label.className = "conn-group-label";
    label.textContent = g.pos;
    row.appendChild(label);
    g.words.forEach(function (w) {
      var span = document.createElement("span");
      span.textContent = w;
      row.appendChild(span);
    });
    box.appendChild(row);
  });
}

function renderConnGrid() {
  var box = $("conn-grid");
  if (!box) return;
  box.innerHTML = "";
  connTiles.forEach(function (t, i) {
    if (t.solved) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "conn-tile" + (connSelected.indexOf(i) !== -1 ? " is-selected" : "");
    b.textContent = t.word;
    b.addEventListener("click", function () {
      connToggleTile(i);
    });
    box.appendChild(b);
  });
}

function connToggleTile(i) {
  if (connDone) return;
  var pos = connSelected.indexOf(i);
  if (pos !== -1) {
    connSelected.splice(pos, 1);
    renderConnGrid();
    return;
  }
  if (connSelected.length >= CONN_GROUP_SIZE) return;
  connSelected.push(i);
  renderConnGrid();
  if (connSelected.length === CONN_GROUP_SIZE) {
    setTimeout(connCheckGuess, 300);
  }
}

function connCheckGuess() {
  if (connDone) return;
  var groupIdxs = connSelected.map(function (i) {
    return connTiles[i].groupIdx;
  });
  var allSame = groupIdxs.every(function (g) {
    return g === groupIdxs[0];
  });
  if (allSame) {
    var posName = connTiles[connSelected[0]].pos;
    var words = connSelected.map(function (i) {
      return connTiles[i].word;
    });
    connSelected.forEach(function (i) {
      connTiles[i].solved = true;
    });
    connGroupsSolved.push({ pos: posName, words: words });
    connSelected = [];
    renderConnGroups();
    renderConnGrid();
    var remaining = connTiles.filter(function (t) {
      return !t.solved;
    });
    if (!remaining.length) finishConn(true);
  } else {
    connMistakes++;
    setText("conn-mistakes", "Mistakes: " + connMistakes + " / " + CONN_MAX_MISTAKES);
    connSelected = [];
    renderConnGrid();
    if (connMistakes >= CONN_MAX_MISTAKES) finishConn(false);
  }
}

function finishConn(win) {
  connDone = true;
  if (!win) {
    var byGroup = {};
    connTiles.forEach(function (t) {
      if (t.solved) return;
      if (!byGroup[t.groupIdx]) byGroup[t.groupIdx] = { pos: t.pos, words: [] };
      byGroup[t.groupIdx].words.push(t.word);
    });
    Object.keys(byGroup).forEach(function (k) {
      connGroupsSolved.push(byGroup[k]);
    });
    connTiles.forEach(function (t) {
      t.solved = true;
    });
    renderConnGroups();
    renderConnGrid();
  }
  var rt = $("conn-result-text");
  if (rt) {
    rt.textContent = win ? "🎉 Solved it!" : "💀 Out of guesses";
    rt.className = "hangman-result-text " + (win ? "win" : "lose");
  }
  setText("conn-final-mistakes", connMistakes + " / " + CONN_MAX_MISTAKES);
  setHidden("conn-result", false);
}

on("conn-back", "click", showConnSetup);
on("conn-change", "click", showConnSetup);
on("conn-restart", "click", newConnRound);
on("conn-start-btn", "click", function () {
  startConn(currentLevel);
});

onLevelChange(resetConn);
