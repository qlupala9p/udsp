/* Top Words — Review (spaced repetition) page logic. Requires shared.js. */
"use strict";

var REVIEW_BATCH = 20;
var reviewQueue = [];
var reviewPos = 0;
var reviewDone = 0;
var reviewCard = $("review-card");

// SRS scheduling (srsGrade/gradeWord) + the SRS_INTERVALS table now live in
// shared.js, so Flashcards and Review grade words through the exact same model.
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
  setHidden("review-active", !hasCards);
  setHidden("review-empty", hasCards);
  setText("review-due", "Due: " + dueCount());
  if (!hasCards) {
    setText(
      "review-empty-text",
      reviewDone > 0
        ? "You reviewed " +
          reviewDone +
          " word" +
          (reviewDone === 1 ? "" : "s") +
          " this session."
        : "Nothing is due right now — try studying new words or come back later."
    );
    setText("review-progress", reviewDone + " / " + reviewDone);
    var fill0 = $("review-progress-fill");
    if (fill0) fill0.style.width = "100%";
    return;
  }
  var w = reviewQueue[reviewPos];
  if (reviewCard) reviewCard.classList.remove("is-flipped");
  setHidden("review-rate", true);
  setText("rv-flip", "Show answer");
  setText("rv-pos", w.pos);
  setText("rv-word", w.word);
  setText("rv-level", w.level || currentLevel);
  setText("rv-definition", w.definition);
  resetExample("rv-example-btn", "rv-example", w.example, true);
  var linkDetails = $("rv-link-details");
  if (linkDetails) linkDetails.href = vocabDetailsUrl(w.word);
  var linkExamples = $("rv-link-examples");
  if (linkExamples) linkExamples.href = vocabExamplesUrl(w.word);
  var total = reviewQueue.length;
  setText("review-progress", reviewPos + 1 + " / " + total);
  var fill = $("review-progress-fill");
  if (fill) fill.style.width = (reviewPos / total) * 100 + "%";
}
function revealReview() {
  if (reviewCard) reviewCard.classList.add("is-flipped");
  setText("rv-flip", "Hide");
  setHidden("review-rate", false);
}
function toggleReview() {
  if (reviewCard && reviewCard.classList.contains("is-flipped")) {
    reviewCard.classList.remove("is-flipped");
    setText("rv-flip", "Show answer");
    setHidden("review-rate", true);
  } else {
    revealReview();
  }
}
function rateReview(grade) {
  if (reviewPos >= reviewQueue.length) return;
  var w = reviewQueue[reviewPos];
  gradeWord(w, grade);
  bumpGoal();
  reviewDone++;
  // "Again" means it wasn't recalled — see it once more this session.
  if (grade === "again") reviewQueue.push(w);
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
on("rv-flip", "click", toggleReview);
on("rv-audio", "click", function () {
  if (reviewPos < reviewQueue.length) speak(reviewQueue[reviewPos].word);
});
on("rv-link", "click", function (e) {
  e.stopPropagation();
});
on("rv-again", "click", function () {
  rateReview("again");
});
on("rv-good", "click", function () {
  rateReview("good");
});
on("rv-easy", "click", function () {
  rateReview("easy");
});
// Keyboard: once revealed, 1 / 2 / 3 grade the card (same as Flashcards).
document.addEventListener("keydown", function (e) {
  if (reviewPos >= reviewQueue.length) return;
  var rate = $("review-rate");
  if (!rate || rate.hidden) return;
  if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
  if (e.key === "1") {
    e.preventDefault();
    rateReview("again");
  } else if (e.key === "2") {
    e.preventDefault();
    rateReview("good");
  } else if (e.key === "3") {
    e.preventDefault();
    rateReview("easy");
  }
});
on("review-restart", "click", startReview);
wireExample("rv-example-btn", "rv-example");

onLevelChange(startReview);
