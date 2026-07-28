#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Measure what a stricter well-formed-sentence rule would cost in coverage."""
import collections
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _udsp_data as U
import _udsp_translate as T
import fix_examples as F

need = F.build_plan()
cache = T.Cache("wiktionary_examples.json")

def wellformed(s):
    return s[:1].isupper() and s[-1:] in ".!?"

now = collections.Counter()
strict = collections.Counter()
lost = []
for name, words in need.items():
    lang = U.lang_of(name)
    for w in words:
        got = cache.get("%s|%s" % (lang, w)) or []
        a = F.pick(got)
        b = F.pick([s for s in got if wellformed(s)])
        if a:
            now[lang] += 1
        if b:
            strict[lang] += 1
        elif a:
            lost.append((lang, w, a))

print("lang    current   strict   delta")
for lang in sorted(now):
    print("  %-4s %7d %8d %7d" % (lang, now[lang], strict[lang], strict[lang] - now[lang]))
print("  ALL  %7d %8d %7d" % (sum(now.values()), sum(strict.values()),
                              sum(strict.values()) - sum(now.values())))
print("\nsample of what strict would drop (%d):" % len(lost))
for lang, w, s in lost[:12]:
    print("   %-3s %-18s %s" % (lang, w[:18], s[:120]))
