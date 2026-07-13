#!/usr/bin/env python3
"""Throwaway diagnostic: how many clean, well-defined, frequency-ranked
English candidate words are available (after excluding every word already
used anywhere in the app's English files) to expand CEFR A1-C2 + TOEFL by
up to 1000 each? Answers BEFORE committing to a full translate+write run.
"""
import os
import re
import json
import urllib.request

TEMP = os.environ.get("TEMP", ".")
WORDSET_CACHE = os.path.join(TEMP, "wordset_dict.json")
FREQ_CACHE = os.path.join(TEMP, "en_freq_50k.txt")
FREQ_URL = "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/en/en_50k.txt"
HEADERS = {"User-Agent": "TopWordsApp/1.0 (educational; https://udsp.vercel.app)"}

DATA_DIR = r"c:\gitrepo\udsp\data"
EN_FILES = ["toefl.js", "wordsa1.js", "wordsa2.js", "wordsb1.js", "wordsb2.js",
            "wordsc1.js", "wordsc2.js", "phrasalverbsen.js", "synanten.js"]

WORD_RE = re.compile(r'word:\s*"((?:\\.|[^"])*)"')
BAD_LABELS = {"technical", "scientific", "medical", "archaic", "slang", "informal",
              "vulgar", "offensive", "dialect", "ethnic slur", "obsolete", "nonstandard"}
GOOD_POS = {"noun", "verb", "adjective", "adverb"}
WORD_OK = re.compile(r"^[a-z][a-z]{4,13}$")
DASHDASH_RE = re.compile(r"\s[-\u2013\u2014]\s")


def load_json(p):
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {}


def save_json(p, d):
    tmp = p + ".tmp"
    json.dump(d, open(tmp, "w", encoding="utf-8"), ensure_ascii=False)
    os.replace(tmp, p)


def download_wordset():
    if os.path.exists(WORDSET_CACHE):
        return load_json(WORDSET_CACHE)
    base = "https://raw.githubusercontent.com/wordset/wordset-dictionary/master/data/"
    merged = {}
    for ch in "abcdefghijklmnopqrstuvwxyz":
        req = urllib.request.Request(base + ch + ".json", headers=HEADERS)
        with urllib.request.urlopen(req, timeout=60) as resp:
            merged.update(json.loads(resp.read().decode("utf-8")))
        print("downloaded wordset", ch, flush=True)
    save_json(WORDSET_CACHE, merged)
    return merged


def load_freq():
    if not os.path.exists(FREQ_CACHE):
        req = urllib.request.Request(FREQ_URL, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=60) as resp:
            open(FREQ_CACHE, "w", encoding="utf-8").write(resp.read().decode("utf-8", "replace"))
    rank = {}
    for i, line in enumerate(open(FREQ_CACHE, encoding="utf-8")):
        parts = line.split()
        if parts:
            w = parts[0].strip().casefold()
            if w not in rank:
                rank[w] = i
    return rank


def clean_example(ex):
    ex = (ex or "").strip()
    if any(x in ex for x in ("--", "\u2014", "\u2013", " - ")):
        return ""
    if re.search(r"[-]\s+[A-Z][a-z]+", ex):
        return ""
    if len(ex) < 12 or len(ex) > 130:
        return ""
    if ex.count('"') % 2 != 0:
        return ""
    return ex


def pick_meaning(entry):
    best = None
    for m in entry.get("meanings", []):
        pos = (m.get("speech_part") or "").strip().lower()
        if pos not in GOOD_POS:
            continue
        if {l.get("name", "").lower() for l in (m.get("labels") or [])} & BAD_LABELS:
            continue
        d = (m.get("def") or "").strip()
        if not d or len(d) < 10 or len(d) > 160:
            continue
        ex = clean_example(m.get("example"))
        if best is None and ex:
            best = (d, ex, pos)
        if ex:
            return (d, ex, pos)
    return best


def main():
    used = set()
    for fn in EN_FILES:
        p = os.path.join(DATA_DIR, fn)
        if os.path.exists(p):
            used |= {w.casefold() for w in WORD_RE.findall(open(p, encoding="utf-8").read())}
    print("total existing unique EN words across all files:", len(used))

    data = download_wordset()
    print("wordset-dictionary total entries:", len(data))
    freq = load_freq()
    print("frequency list entries:", len(freq))

    cands = []
    for word, entry in data.items():
        if not WORD_OK.match(word):
            continue
        if word.casefold() in used:
            continue
        if word.endswith(("ing", "ed")):
            continue
        if {l.get("name", "").lower() for l in (entry.get("labels") or [])} & BAD_LABELS:
            continue
        picked = pick_meaning(entry)
        if not picked:
            continue
        r = freq.get(word.casefold())
        if r is None:
            continue
        cands.append((r, word))
    cands.sort(key=lambda x: x[0])
    print("total usable NEW candidates (ranked, clean, defined+example):", len(cands))

    # decile breakdown
    bands = [(0, 1000), (1000, 3000), (3000, 6000), (6000, 12000), (12000, 25000), (25000, 50000)]
    for lo, hi in bands:
        n = sum(1 for r, w in cands if lo <= r < hi)
        print(f"  rank [{lo:>6}-{hi:>6}): {n}")

    print("\nfirst 20 candidates overall:")
    for r, w in cands[:20]:
        print(f"  [{r}] {w}")


if __name__ == "__main__":
    main()
