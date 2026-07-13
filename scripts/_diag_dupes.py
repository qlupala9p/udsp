#!/usr/bin/env python3
"""Throwaway diagnostic: check for duplicate words within each data file."""
import re
import os
import sys

DATA = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
FILES = sys.argv[1:] or ["wordsa1.js", "wordsa2.js", "wordsb1.js", "wordsb2.js", "wordsc1.js",
         "wordsc2.js", "toefl.js", "phrasalverbsen.js"]
WORD_RE = re.compile(r'word:\s*"((?:\\.|[^"])*)"')

for fn in FILES:
    path = fn if os.path.isabs(fn) else os.path.join(DATA, fn)
    content = open(path, encoding="utf-8").read()
    words = WORD_RE.findall(content)
    seen = {}
    for w in words:
        k = w.casefold()
        seen[k] = seen.get(k, 0) + 1
    dups = [(k, c) for k, c in seen.items() if c > 1]
    print(fn, "total=", len(words), "unique=", len(seen), "dup_groups=", len(dups))
    for k, c in dups[:15]:
        print("   DUP:", k, c)

