#!/usr/bin/env python3
"""Diagnostic: how many candidate ENGLISH PHRASAL VERBS (verb + particle,
two tokens) exist in the wordset-dictionary that AREN'T already in
data/phrasalverbsen.js?"""
import os
import re
import json

TEMP = os.environ.get("TEMP", ".")
data = json.load(open(os.path.join(TEMP, "wordset_dict.json"), encoding="utf-8"))

PARTICLES = {
    "up", "down", "in", "out", "on", "off", "away", "back", "over", "through",
    "along", "around", "about", "into", "onto", "forward", "together", "apart",
    "aside", "across", "ahead", "behind", "by", "down", "forth", "in", "off",
    "out", "over", "round", "through", "under", "up", "with", "for", "to",
    "at", "from", "of", "upon",
}

DATA_DIR = r"c:\gitrepo\udsp\data"
WORD_RE = re.compile(r'word:\s*"((?:\\.|[^"])*)"')
existing = {w.lower() for w in WORD_RE.findall(open(os.path.join(DATA_DIR, "phrasalverbsen.js"), encoding="utf-8").read())}
print("existing phrasal verbs:", len(existing))

cands = []
for word, entry in data.items():
    wl = word.lower().strip()
    parts = wl.split()
    if len(parts) not in (2, 3):
        continue
    verb = parts[0]
    if len(parts) == 2:
        if parts[1] not in PARTICLES:
            continue
    else:
        if parts[1] not in PARTICLES or parts[2] not in PARTICLES:
            continue
    if not re.match(r"^[a-z]+$", verb):
        continue
    if wl in existing:
        continue
    if "arse" in wl or "ass " in wl or "piss" in wl or "shit" in wl:
        continue
    best = None
    for m in entry.get("meanings", []):
        pos = (m.get("speech_part") or "").strip().lower()
        if pos != "verb":
            continue
        d = (m.get("def") or "").strip()
        if not d or len(d) < 8 or len(d) > 160:
            continue
        best = (d, m.get("example"))
        break
    if best:
        cands.append((wl, best[0], best[1]))

print("candidate NEW phrasal verbs found (2-3 word):", len(cands))
two = sum(1 for c in cands if len(c[0].split()) == 2)
three = sum(1 for c in cands if len(c[0].split()) == 3)
print("  2-word:", two, " 3-word:", three)
for c in cands[-40:]:
    print(" ", c[0], "->", c[1][:70])
