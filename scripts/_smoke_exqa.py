#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""QA the example sentences that --apply would write, without writing them.

Reads the live plan plus the fetched-citation cache, runs the same pick()
the apply phase uses, and prints a per-language sample plus the coverage
each language actually achieved.  Run this BEFORE --apply.
"""
import collections
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _udsp_data as U
import _udsp_quality as Q
import _udsp_translate as T
import fix_examples as F

random.seed(11)

need = F.build_plan()
cache = T.Cache("wiktionary_examples.json")

chosen = collections.defaultdict(list)   # lang -> [(word, reason, sentence)]
stats = collections.Counter()            # (lang, "hit"/"miss")
reason_hit = collections.Counter()

for name, words in need.items():
    lang = U.lang_of(name)
    for w, reason in words.items():
        got = cache.get("%s|%s" % (lang, w))
        if got:
            s = F.pick(got)
        else:
            s = None
        if s:
            stats[(lang, "hit")] += 1
            reason_hit[(reason, "hit")] += 1
            chosen[lang].append((w, reason, s))
        else:
            stats[(lang, "miss")] += 1
            reason_hit[(reason, "miss")] += 1

print("coverage by language")
for lang in sorted(set(l for l, _ in stats)):
    hit = stats[(lang, "hit")]
    miss = stats[(lang, "miss")]
    tot = hit + miss
    print("   %-3s %6d / %-6d  %5.1f%%" % (lang, hit, tot, 100.0 * hit / tot))

print("\ncoverage by reason")
for reason in ("missing", "noword", "recycled"):
    hit = reason_hit[(reason, "hit")]
    miss = reason_hit[(reason, "miss")]
    tot = hit + miss
    if tot:
        print("   %-9s %6d / %-6d  %5.1f%%" % (reason, hit, tot, 100.0 * hit / tot))

# Independent re-check: does the sentence really contain the word?
bad = 0
for lang, rows in chosen.items():
    for w, _r, s in rows:
        if not Q.example_contains_word(w, s, lang):
            bad += 1
print("\nchosen sentences failing the word-presence check: %d" % bad)

lengths = [len(s) for rows in chosen.values() for _w, _r, s in rows]
if lengths:
    lengths.sort()
    print("length  min %d  median %d  max %d"
          % (lengths[0], lengths[len(lengths) // 2], lengths[-1]))

for lang in sorted(chosen):
    rows = chosen[lang]
    print("\n--- %s (%d chosen) ---" % (lang, len(rows)))
    for w, reason, s in random.sample(rows, min(10, len(rows))):
        print("   %-22s %-8s %s" % (w[:22], reason, s))
