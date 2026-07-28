/* Top Words — Flashcards page logic. Requires shared.js to be loaded first. */
"use strict";

var fcOrder = [];
var fcPos = 0;
// Guards against counting the same card's reveal toward the daily goal more
// than once; reset whenever a new card is rendered (nav / shuffle / level).
var fcCounted = false;
var flashcard = $("flashcard");

function fcCurrentWord() {
  return WORDS.length ? WORDS[fcOrder[fcPos]] : null;
}
function renderFcStatus() {
  var w = fcCurrentWord();
  if (!w) return;
  var fEl = $("fc-fav");
  if (fEl) fEl.classList.toggle("is-on", !!fav[wordKey(w)]);
}
// "Good" on a word you've never seen means 1 day; on one you've drilled four
// times it means 16. Showing the actual interval on each button is what makes
// the grading feel like a schedule rather than three arbitrary buttons.
function renderGradePreview() {
  var w = fcCurrentWord();
  if (!w || !$("fc-grade-row")) return;
  var box = (srs[wordKey(w)] || {}).box || 0;
  var next = {
    again: SRS_INTERVALS[1],
    good: SRS_INTERVALS[Math.min(box + 1, 5)],
    easy: SRS_INTERVALS[Math.min(box + 2, 5)],
  };
  Object.keys(next).forEach(function (g) {
    var d = next[g];
    setText("fc-when-" + g, d >= 30 ? "1mo" : d >= 7 ? Math.round(d / 7) + "w" : d + "d");
  });
}
function renderFlashcard() {
  var msg = sourceEmptyMessage();
  var empty = $("fc-empty");
  if (empty) {
    empty.textContent = msg;
    empty.hidden = !msg;
  }
  // An empty Due/Mistakes/★ pool is a normal, expected state. Hide everything
  // that refers to a card -- otherwise a stale "1 / 2905" counter and a live
  // Next button sit above a message saying there is nothing to study.
  if (flashcard) flashcard.hidden = !!msg;
  ["fc-actions", "fc-progress", "fc-nav"].forEach(function (id) {
    setHidden(id, !!msg);
  });
  setHidden("fc-grade-row", true);
  if (!WORDS.length || !flashcard) return;
  var w = WORDS[fcOrder[fcPos]];
  fcCounted = false;
  flashcard.classList.remove("is-flipped");
  setText("fc-word", w.word);
  setText("fc-pos", w.pos);
  setText("fc-level", w.level || currentLevel);
  setDefinition("fc-definition", w.definition);
  resetExample("fc-example-btn", "fc-example", w.example, true);
  var linkDetails = $("fc-link-details");
  if (linkDetails) linkDetails.href = vocabDetailsUrl(w.word);
  var linkExamples = $("fc-link-examples");
  if (linkExamples) linkExamples.href = vocabExamplesUrl(w.word);
  setText("fc-counter", fcPos + 1 + " / " + WORDS.length);
  var fill = $("fc-progress-fill");
  if (fill) fill.style.width = ((fcPos + 1) / WORDS.length) * 100 + "%";
  renderFcStatus();
  renderGradePreview();
}
function flip() {
  if (!flashcard) return;
  flashcard.classList.toggle("is-flipped");
  var revealed = flashcard.classList.contains("is-flipped");
  setHidden("fc-grade-row", !revealed);
  touchStreak();
  // First reveal of this card counts one rep toward the daily goal.
  if (revealed && !fcCounted) {
    fcCounted = true;
    bumpGoal();
    var w = fcCurrentWord();
    if (w) {
      logHistory({ type: "flashcard", lang: currentLang, level: w.level || currentLevel, word: w.word, category: w.category });
    }
  }
}
function nextCard(step) {
  fcPos = (fcPos + step + WORDS.length) % WORDS.length;
  renderFlashcard();
}
// Grading is what actually drives the spaced-repetition schedule -- before
// this, srsGrade()/gradeWord() existed but nothing ever called them, so card
// order was a one-time shuffle and "Due for review" could never fill up.
function gradeCurrent(grade) {
  var w = fcCurrentWord();
  if (!w) return;
  gradeWord(w, grade);
  // Getting it right is also evidence it is no longer a "mistake" word.
  if (grade !== "again") clearMistake(w);
  renderStudyStatus();
  // In a Due/Mistakes session the graded word has just left the pool, so
  // rebuild it; otherwise simply move on to the next card.
  if (sourceIsActive()) setLevel(currentLevel);
  else nextCard(1);
}

if (flashcard) {
  flashcard.addEventListener("click", flip);
  flashcard.addEventListener("keydown", function (e) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      flip();
    }
  });
}
// Clicking the dictionary link should open it, not flip the card.
on("fc-link", "click", function (e) {
  e.stopPropagation();
});
wireExample("fc-example-btn", "fc-example");
on("fc-next", "click", function () {
  nextCard(1);
});
on("fc-prev", "click", function () {
  nextCard(-1);
});
on("fc-home", "click", function () {
  location.href = "home.html";
});
on("fc-shuffle", "click", function () {
  fcOrder = shuffle(fcOrder);
  fcPos = 0;
  renderFlashcard();
});
on("fc-report", "click", function () {
  var w = fcCurrentWord();
  if (w) reportWord(w.word, w.level || currentLevel);
});
on("fc-audio", "click", function () {
  var w = fcCurrentWord();
  if (w) speak(w.word);
});
on("fc-fav", "click", function () {
  var w = fcCurrentWord();
  if (!w) return;
  var k = wordKey(w);
  if (fav[k]) delete fav[k];
  else fav[k] = 1;
  lsSet(FAV_KEY, fav);
  renderFcStatus();
  // The ★ count in the Study picker (and a ★ session's own pool) is now live.
  renderSourceOptions();
  if (studySource === "starred") setLevel(currentLevel);
});
["again", "good", "easy"].forEach(function (grade) {
  on("fc-grade-" + grade, "click", function () {
    gradeCurrent(grade);
  });
});

onLevelChange(function () {
  fcOrder = WORDS.map(function (_, i) {
    return i;
  });
  // A "Due" or "Mistakes" pool arrives already sorted by urgency, and that
  // order IS the recommendation -- shuffling it away would throw the whole
  // point of the source filter. The full-level pool has no meaningful order,
  // so it still gets shuffled. Either way the Shuffle button still works.
  if (!sourceIsActive()) fcOrder = shuffle(fcOrder);
  fcPos = 0;
  renderFlashcard();
});
