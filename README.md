# UDSP & CEFR English — Top Words Quizlet

A static web app for practising the **top CEFR / UDSP exam English vocabulary**
across every level (**A1, A2, B1, B2, C1, C2**). It includes flashcards, a
searchable word list, and **vocabulary exams of 20 questions each** with a final
score shown when you submit.

## Features

- **7,052 words across six CEFR levels** sourced from the [esl-lounge CEFR word lists](https://www.esl-lounge.com/student/reference/b2-cefr-vocabulary-word-list.php), each with an English – Turkish definition:
  - A1 — 860 words · A2 — 850 words · B1 — 751 words · B2 — 1,282 words · C1 — 1,252 words · C2 — 2,057 words
- **Level switcher** — pick A1/A2/B1/B2/C1/C2 in the header; flashcards, quiz, and the word list all update to that level.
- **Flashcards** — flip to reveal the meaning, shuffle, and step through every word.
- **Exams** — words are split into exams of **20 questions** each (multiple-choice). Your **total score is shown at the end** when you submit, with a per-question review.
- **Best score saved** per level for every exam (stored locally in your browser).
- **Word list** with instant search.
- No build step, no framework — pure HTML/CSS/JS, ready for Vercel.

## Project structure

```
udsp/
├── index.html        # App markup (flashcards, quiz, word list)
├── styles.css        # Styling
├── app.js            # Level switching, flashcard + exam logic and scoring
├── data/
│   ├── wordsa1.js     # A1 dataset (window.WORDS_A1)
│   ├── wordsa2.js     # A2 dataset (window.WORDS_A2)
│   ├── wordsb1.js     # B1 dataset (window.WORDS_B1)
│   ├── wordsb2.js     # B2 dataset (window.WORDS_B2)
│   ├── wordsc1.js     # C1 dataset (window.WORDS_C1)
│   └── wordsc2.js     # C2 dataset (window.WORDS_C2)
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

Each level has its own file in `data/` (e.g. [data/wordsb2.js](data/wordsb2.js)),
exposing a global array such as `window.WORDS_B2`. Each entry looks like:

```js
{
  word: "abandon",
  pos: "verb",
  level: "B2",
  definition: "To give up or relinquish control of … - Türkçe çeviri.",
  example: "",
}
```

Add, edit, or remove entries — the app rebuilds flashcards, exams, and the word
list automatically. Exam count = `ceil(total words / 20)`.

---

Built for UDSP & CEFR exam preparation.
