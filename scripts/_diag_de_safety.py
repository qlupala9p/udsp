#!/usr/bin/env python3
"""Throwaway diagnostic: broad content-safety scan of German definitions
caches (CEFR expansion + partikelverben) for explicit/sensitive content."""
import json
import os
import re
import sys

TEMP = os.environ.get("TEMP", ".")
fname = sys.argv[1] if len(sys.argv) > 1 else "de_cefr_expand_defs_cache.json"
cache = json.load(open(os.path.join(TEMP, fname), encoding="utf-8"))

broad_pat = re.compile(
    r"sexual|erotic|orgasm|penis|vagina|genital|masturbat|fetish|kinky|"
    r"prostitut|brothel|porn|stripper|bondage|breast|nude|naked|intercourse|"
    r"dildo|fellat|cunnilingus|clitoris|foreskin|circumcis|vulva|smegma",
    re.IGNORECASE,
)
count = 0
for w, info in cache.items():
    if not info:
        continue
    d = info.get("definition") or ""
    ex = info.get("example") or ""
    if broad_pat.search(d) or broad_pat.search(ex):
        count += 1
        print(w, "->", d[:90], "|| ex:", ex[:90])
print("total flagged:", count, "of", sum(1 for v in cache.values() if v), "accepted entries")
