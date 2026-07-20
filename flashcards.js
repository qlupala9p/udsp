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
function renderFlashcard() {
  if (!WORDS.length || !flashcard) return;
  var w = WORDS[fcOrder[fcPos]];
  fcCounted = false;
  flashcard.classList.remove("is-flipped");
  setText("fc-word", w.word);
  setText("fc-pos", w.pos);
  setText("fc-level", w.level || currentLevel);
  setText("fc-definition", w.definition);
  resetExample("fc-example-btn", "fc-example", w.example, true);
  var linkDetails = $("fc-link-details");
  if (linkDetails) linkDetails.href = vocabDetailsUrl(w.word);
  var linkExamples = $("fc-link-examples");
  if (linkExamples) linkExamples.href = vocabExamplesUrl(w.word);
  setText("fc-counter", fcPos + 1 + " / " + WORDS.length);
  var fill = $("fc-progress-fill");
  if (fill) fill.style.width = ((fcPos + 1) / WORDS.length) * 100 + "%";
  renderFcStatus();
}
function flip() {
  if (!flashcard) return;
  flashcard.classList.toggle("is-flipped");
  var revealed = flashcard.classList.contains("is-flipped");
  touchStreak();
  // First reveal of this card counts one rep toward the daily goal.
  if (revealed && !fcCounted) {
    fcCounted = true;
    bumpGoal();
  }
}
function nextCard(step) {
  fcPos = (fcPos + step + WORDS.length) % WORDS.length;
  renderFlashcard();
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
});

onLevelChange(function () {
  fcOrder = shuffle(
    WORDS.map(function (_, i) {
      return i;
    })
  );
  fcPos = 0;
  renderFlashcard();
});
