# UDSP & B2 English — Top Words Quizlet

A static web app for practising the **top B2 / UDSP exam English vocabulary**.
It includes flashcards, a searchable word list, and **vocabulary exams of 20
questions each** with a final score shown when you submit.

## Features

- **1,282 B2 words** sourced from the [esl-lounge B2 CEFR word list](https://www.esl-lounge.com/student/reference/b2-cefr-vocabulary-word-list.php), each with a definition.
- **Flashcards** — flip to reveal the meaning, shuffle, and step through every word.
- **Exams** — words are split into exams of **20 questions** each (multiple-choice). Your **total score is shown at the end** when you submit, with a per-question review.
- **Best score saved** for every exam (stored locally in your browser).
- **Word list** with instant search.
- No build step, no framework — pure HTML/CSS/JS, ready for Vercel.

## Project structure

```
udsp/
├── index.html        # App markup (flashcards, quiz, word list)
├── styles.css        # Styling
├── app.js            # Flashcard + exam logic and scoring
├── data/
│   └── words.js       # The 1,282-word dataset (window.WORDS)
├── vercel.json       # Vercel static config + headers
├── package.json
└── .gitignore
```

## Run locally

Any static file server works. For example:

```bash
npx serve .
# or
python3 -m http.server 5173
```

Then open the printed URL (e.g. http://localhost:3000).

## Deploy to Vercel

This folder is already a static site, so Vercel needs no build configuration.

### Option A — Git (recommended)

1. Commit and push this `udsp` folder to your GitHub repo.
2. In the [Vercel dashboard](https://vercel.com/), **Add New → Project** and import the repo.
3. If `udsp` is a subfolder, set the **Root Directory** to `udsp`.
4. Framework preset: **Other**. Leave build & output settings empty.
5. Click **Deploy**.

### Option B — Vercel CLI

```bash
npm i -g vercel
cd udsp
vercel          # preview deploy
vercel --prod   # production deploy
```

## Customising the words

Edit [data/words.js](data/words.js). Each entry looks like:

```js
{
  word: "abandon",
  pos: "verb",
  level: "B2",
  definition: "To give up or relinquish control of …",
  example: "",
}
```

Add, edit, or remove entries — the app rebuilds flashcards, exams, and the word
list automatically. Exam count = `ceil(total words / 20)`.

---

Built for UDSP & B2 exam preparation.
