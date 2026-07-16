#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""_diag_data_quality.py -- measure the 3 data-quality fronts:
   1. "no example available" fallback examples
   2. category == "General"
   3. CEFR level distribution (per file)
Prints per-file + overall counts and small samples for triage.
"""
import os, re, sys, collections
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data")

STD = [
    "wordsa1.js","wordsa2.js","wordsb1.js","wordsb2.js","wordsc1.js","wordsc2.js",
    "wordsa1gode.js","wordsa2gode.js","wordsb1gode.js","wordsb2gode.js","wordsc1gode.js","wordsc2gode.js",
    "wordsa1fr.js","wordsa2fr.js","wordsb1fr.js","wordsb2fr.js","wordsc1fr.js","wordsc2fr.js",
    "phrasalverbsen.js","phrasalverbsfr.js","toefl.js","partikelverbde.js",
]
SYN = ["synanten.js","synantde.js","synantfr.js"]

FALLBACK_EX = re.compile(r"No example sentence available|Kein Beispielsatz|Aucune phrase d'exemple|"
                         r"I am learning the word|Ich lerne das Wort|J['\u2019]apprends le mot", re.I)
ENTRY = re.compile(r'\{\s*word:\s*"((?:\\.|[^"\\])*)".*?\}', re.S)
WORDF = re.compile(r'word:\s*"((?:\\.|[^"\\])*)"')
CATF = re.compile(r'category:\s*"((?:\\.|[^"\\])*)"')
EXF = re.compile(r'example:\s*"((?:\\.|[^"\\])*)"')
DEFF = re.compile(r'definition:\s*"((?:\\.|[^"\\])*)"')

tot_words = tot_fb = 0
cat_counter = collections.Counter()
lvl_counter = collections.Counter()
gen_samples = []
fb_samples = []

for fn in STD + SYN:
    p = os.path.join(DATA, fn)
    if not os.path.exists(p):
        continue
    text = open(p, encoding="utf-8").read()
    # split into entry blocks by the "  {"..."}," pattern is unreliable for minified;
    # use a per-object regex over word...} chunks
    words = fn_words = 0
    fn_fb = 0
    for m in re.finditer(r'\{[^{}]*word:\s*"(?:\\.|[^"\\])*"[^{}]*\}', text, re.S):
        blk = m.group(0)
        wm = WORDF.search(blk); 
        if not wm: continue
        words += 1
        cat = (CATF.search(blk) or [None, "(none)"])
        catv = CATF.search(blk).group(1) if CATF.search(blk) else "(none)"
        cat_counter[catv] += 1
        exv = EXF.search(blk).group(1) if EXF.search(blk) else ""
        defv = DEFF.search(blk).group(1) if DEFF.search(blk) else ""
        if FALLBACK_EX.search(exv) or not exv.strip():
            fn_fb += 1
            if len(fb_samples) < 25:
                fb_samples.append((fn, wm.group(1), defv[:60]))
        if catv == "General" and len(gen_samples) < 30:
            gen_samples.append((wm.group(1), defv[:55]))
    tot_words += words
    tot_fb += fn_fb
    print(f"{fn:22} words={words:6}  fallback_ex={fn_fb:5}")

print(f"\nTOTAL words={tot_words}  fallback_examples={tot_fb}  ({100*tot_fb/max(tot_words,1):.1f}%)")
print("\n=== CATEGORY DISTRIBUTION ===")
for c, n in cat_counter.most_common():
    print(f"  {c:16} {n:6}  ({100*n/max(tot_words,1):.1f}%)")
print("\n=== sample 'General' words ===")
for w, d in gen_samples:
    print(f"  {w:24} | {d}")
print("\n=== sample fallback-example words ===")
for fn, w, d in fb_samples:
    print(f"  {fn:16} {w:22} | {d}")
