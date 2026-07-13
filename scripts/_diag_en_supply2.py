#!/usr/bin/env python3
"""Follow-up diagnostic: candidate supply when definition-quality is the
ONLY gate (example sourced separately via Tatoeba, not required to be
bundled in wordset-dictionary), plus proper-noun/name filtering."""
import os
import re
import json

TEMP = os.environ.get("TEMP", ".")
data = json.load(open(os.path.join(TEMP, "wordset_dict.json"), encoding="utf-8"))
freq = {}
for i, line in enumerate(open(os.path.join(TEMP, "en_freq_50k.txt"), encoding="utf-8")):
    parts = line.split()
    if parts:
        w = parts[0].strip().casefold()
        if w not in freq:
            freq[w] = i
print("wordset entries:", len(data))

used = set()
DATA_DIR = r"c:\gitrepo\udsp\data"
WORD_RE = re.compile(r'word:\s*"((?:\\.|[^"])*)"')
for fn in ["toefl.js", "wordsa1.js", "wordsa2.js", "wordsb1.js", "wordsb2.js",
           "wordsc1.js", "wordsc2.js", "phrasalverbsen.js", "synanten.js"]:
    p = os.path.join(DATA_DIR, fn)
    if os.path.exists(p):
        used |= {w.casefold() for w in WORD_RE.findall(open(p, encoding="utf-8").read())}
print("existing used words:", len(used))

WORD_OK = re.compile(r"^[a-z][a-z]{4,13}$")
BAD_LABELS = {"technical", "scientific", "medical", "archaic", "slang", "informal",
              "vulgar", "offensive", "dialect", "ethnic slur", "obsolete", "nonstandard"}
GOOD_POS = {"noun", "verb", "adjective", "adverb"}
PROFANITY = {"fuck", "fucking", "fucked", "fucker", "shit", "shitty", "bitch", "bastard",
             "asshole", "arsehole", "cunt", "dick", "cock", "pussy", "prick", "wanker",
             "whore", "slut", "damn", "bollocks", "bugger", "twat", "nigger", "nigga",
             "faggot", "fag", "spic", "chink", "kike", "wop", "coon", "dyke", "tranny",
             "retard", "retarded", "penis", "vagina", "anus", "testicle", "scrotum",
             "erection", "orgasm", "ejaculate", "ejaculation", "masturbate",
             "masturbation", "porn", "pornography", "pornographic", "boob", "boobs",
             "tits", "titty", "horny", "coitus", "fornicate", "fornication", "sodomy",
             "sodomize", "genitalia", "genital", "condom", "brothel", "prostitute",
             "prostitution", "rape", "rapist", "molest", "incest", "pedophile",
             "bestiality", "zoophilia", "zoophilism", "damned", "hell", "crap", "piss",
             "pissed", "turd", "screw", "screwed", "arse", "wank", "jizz", "cum",
             "nipple", "buttock", "buttocks", "orgy", "libido", "aphrodisiac"}
NAME_RE = re.compile(
    r"\b(given name|surname|forename|first name|male given|female given|"
    r"name of a|name for a (male|female|boy|girl)|placename|place ?name|"
    r"proper noun|used as a name)\b", re.IGNORECASE)


def is_clean(w):
    lw = w.casefold()
    if lw in PROFANITY:
        return False
    for bad in ("fuck", "shit", "bitch", "cunt", "nigger", "faggot", "pussy",
                "asshole", "porn", "whore"):
        if bad in lw:
            return False
    return True


def looks_like_name(entry):
    for m in entry.get("meanings", []):
        d = (m.get("def") or "")
        if NAME_RE.search(d):
            return True
    return False


cands = []
for word, entry in data.items():
    if not WORD_OK.match(word):
        continue
    if word.casefold() in used:
        continue
    if not is_clean(word):
        continue
    if word.endswith(("ing", "ed")):
        continue
    if {l.get("name", "").lower() for l in (entry.get("labels") or [])} & BAD_LABELS:
        continue
    if looks_like_name(entry):
        continue
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
        best = (d, pos)
        break
    if not best:
        continue
    r = freq.get(word.casefold())
    cands.append((r, word, best[1]))

print("candidates with good DEFINITION only (any/no example, any/no rank):", len(cands))
in50k = [c for c in cands if c[0] is not None]
print("  of those, also in en_50k top-50k:", len(in50k))
nopos = {}
for r, w, pos in cands:
    nopos[pos] = nopos.get(pos, 0) + 1
print("  pos breakdown:", nopos)
print("\nsample of 20 with no rank (rank=None):")
n = 0
for r, w, pos in cands:
    if r is None:
        print(" ", w, pos)
        n += 1
        if n >= 20:
            break

ranked = sorted([c for c in cands if c[0] is not None], key=lambda x: x[0])
bands = [(0,1000),(1000,3000),(3000,6000),(6000,12000),(12000,25000),(25000,50000)]
for lo,hi in bands:
    sub=[c for c in ranked if lo<=c[0]<hi]
    posd={}
    for r,w,p in sub: posd[p]=posd.get(p,0)+1
    print(f'rank [{lo}-{hi}): {len(sub)} pos={posd}')
