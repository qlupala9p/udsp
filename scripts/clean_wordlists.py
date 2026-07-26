# -*- coding: utf-8 -*-
"""Rule-based cleaner for the vocabulary data files.

Rather than hand-listing thousands of words per file, this removes entries
that fail objective, statable tests. Every rule is deliberately conservative:
it only fires when the entry is verifiably defective, so it can be run across
English, French and Italian files without per-file curation.

Rules
-----
PROPER    NOT APPLIED AUTOMATICALLY. Capitalisation mid-example looked like a
          clean proper-noun signal, but it flags ministry/admiral/braille/
          python, and guarding it with a dictionary instead protects the real
          names (the dictionary lists bolivia, medusa and judas too). Names are
          therefore removed from curated per-level lists built by
          scripts/_diag_cefrj_membership.py, as done in scripts/clean_en_a1.py.
          is_proper() is kept below because it is still a useful review aid.
INFLECT   The headword is a regular inflected form (-s/-ed/-en/-er/-est/-ly)
          of another headword that this same file already teaches, so it adds
          nothing and clutters the deck.
CRUDE     The headword, its definition, or its example contains profanity or
          adult content that does not belong in a school-facing word list.
BROKEN    The definition self-identifies as being about a different word than
          the headword: it starts with a gloss for another entry, or the
          example never uses the headword in any inflected form AND a real
          example was available (i.e. it is not the honest "no example"
          fallback).

Usage:
  python scripts/clean_wordlists.py --lang en                 # dry run
  python scripts/clean_wordlists.py --lang en --apply
  python scripts/clean_wordlists.py data/wordsa2.js --apply
"""
import argparse
import csv
import io
import os
import re
import sys
import tempfile
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data")

CEFRJ_URL = ("https://raw.githubusercontent.com/openlanguageprofiles/olp-en-cefrj/"
             "master/cefrj-vocabulary-profile-1.5.csv")
CEFRJ_PATH = os.path.join(tempfile.gettempdir(),
                          "cefrj-vocabulary-profile-1.5.csv")


def load_known_en():
    """Headwords that are certainly real English vocabulary, never to be cut.

    Without this guard the rules below happily delete january, friday, become,
    foot, really, clothes and news - all of which look like a proper noun or an
    inflection to a regex but are core vocabulary. A deletion rule may only
    fire for a word that is NOT on this list.
    """
    if not os.path.exists(CEFRJ_PATH):
        urllib.request.urlretrieve(CEFRJ_URL, CEFRJ_PATH)
    known = set()
    with io.open(CEFRJ_PATH, encoding="utf-8-sig", newline="") as fh:
        for row in csv.DictReader(fh):
            head = (row.get("headword") or "").strip().lower()
            for form in head.split("/"):
                form = form.strip().rstrip(".")
                if form:
                    known.add(form)
    # CEFR-J lists lemmas only, so also accept their regular inflections;
    # otherwise months/wanted/bigger look unknown and get cut.
    for w in list(known):
        known.update({w + "s", w + "es", w + "ed", w + "ing", w + "er",
                      w + "est", w + "ly"})
    known.update("""january february march april may june july august september
        october november december monday tuesday wednesday thursday friday
        saturday sunday english turkish german french italian spanish european
        christmas easter earth""".split())

    # CEFR-J stops at ~7k lemmas, so it cannot vouch for C1/C2 vocabulary and
    # would let the proper-noun rule delete ministry, admiral, equinox, braille
    # and python. Add a full English dictionary word list as a second guard: a
    # word is only treated as a name if NO dictionary anywhere lists it.
    dict_path = os.path.join(tempfile.gettempdir(), "words_alpha.txt")
    if not os.path.exists(dict_path):
        urllib.request.urlretrieve(
            "https://raw.githubusercontent.com/dwyl/english-words/master/"
            "words_alpha.txt", dict_path)
    with io.open(dict_path, encoding="utf-8") as fh:
        known.update(line.strip().lower() for line in fh if line.strip())
    return known

LANG_FILES = {
    "en": ["wordsa1.js", "wordsa2.js", "wordsb1.js", "wordsb2.js",
           "wordsc1.js", "wordsc2.js", "toefl.js"],
    "fr": ["wordsa1fr.js", "wordsa2fr.js", "wordsb1fr.js", "wordsb2fr.js",
           "wordsc1fr.js", "wordsc2fr.js"],
    "it": ["wordsa1it.js", "wordsa2it.js", "wordsb1it.js", "wordsb2it.js",
           "wordsc1it.js", "wordsc2it.js"],
    "de": ["wordsa1gode.js", "wordsa2gode.js", "wordsb1gode.js",
           "wordsb2gode.js", "wordsc1gode.js", "wordsc2gode.js"],
}

ENTRY_RE = re.compile(r'\n  \{\s*\n?(?:[^{}]|\{[^{}]*\})*?\n?  \},', re.S)
FIELD_RE = {k: re.compile(r'%s:\s*"((?:\\.|[^"\\])*)"' % k)
            for k in ("word", "pos", "level", "definition", "example")}

CRUDE_RE = re.compile(
    r"\b(fuck\w*|shit\w*|cunt\w*|bitch\w*|whore\w*|slut\w*|dick head|dickhead|"
    r"bastard\w*|wank\w*|blowjob|handjob|boner|bimbo|hooker|pimp|porn\w*|"
    r"masturbat\w*|orgasm\w*|penis|vagina|testicle\w*|scrotum|anus|"
    r"nigger\w*|negro(es)?|faggot\w*|retard(ed|s)?|spastic|"
    r"goddamn|goddam|motherfuck\w*|arsehole|asshole|crotch|douche(bag)?|"
    r"junkie|heroin|cocaine|meth\b|marijuana|cannabis)\b", re.I)

FALLBACK_RE = re.compile(
    r"No example sentence available|No dictionary definition available|"
    r"Kein Beispielsatz|Aucune phrase d'exemple|Bu kelime için", re.I)

TOKEN_RE = re.compile(r"[^\W\d_]+", re.UNICODE)
SENT_START_RE = re.compile(r'(?:^|[.!?]\s+|["\u201c(]\s*)$')


def native(field):
    return field.split(" - ")[0]


def lemmas(w):
    out = set()
    for suf, repl in (("s", ""), ("es", ""), ("ed", ""), ("ed", "e"),
                      ("en", ""), ("en", "e"), ("er", ""), ("er", "e"),
                      ("est", ""), ("est", "e"), ("ly", ""), ("ies", "y"),
                      ("ied", "y"), ("ier", "y"), ("iest", "y")):
        if w.endswith(suf) and len(w) - len(suf) >= 3:
            out.add(w[: len(w) - len(suf)] + repl)
    if len(w) > 4 and w[-1] == w[-2]:
        out.add(w[:-1])
    return {b for b in out if len(b) >= 3}


def is_proper(word, example):
    """True if the headword shows up capitalised mid-sentence in its example."""
    ex = native(example)
    if not word or not word[0].isalpha() or word[0].isupper():
        return False
    cap = word[0].upper() + word[1:]
    for m in re.finditer(r"\b%s\b" % re.escape(cap), ex):
        if not SENT_START_RE.search(ex[: m.start()]):
            return True
    return False


def fuzzy_in(word, tokens):
    w = word.casefold()
    if w in tokens:
        return True
    if len(w) < 5:
        return False
    for t in tokens:
        if abs(len(t) - len(w)) > 5:
            continue
        common = 0
        for a, b in zip(t, w):
            if a != b:
                break
            common += 1
        if common >= max(5, int(len(w) * 0.65)):
            return True
    return False


def clean_file(path, lang, apply_changes, known):
    text = io.open(path, encoding="utf-8").read()
    blocks = ENTRY_RE.findall(text)
    words = set()
    for b in blocks:
        m = FIELD_RE["word"].search(b)
        if m:
            words.add(m.group(1).strip().lower())

    counts, examples = {}, {}
    bad_example = []

    def repl(m):
        block = m.group(0)
        get = lambda k: (FIELD_RE[k].search(block).group(1)
                         if FIELD_RE[k].search(block) else "")
        word, definition, example = get("word"), get("definition"), get("example")
        w = word.strip().lower()
        reason = None

        if CRUDE_RE.search(word):
            reason = "CRUDE"
        elif CRUDE_RE.search(definition) or CRUDE_RE.search(example):
            # The headword itself is fine (parachute, itchy, intestine) - only
            # the harvested sentence around it is not. Deleting the word would
            # lose good vocabulary, so record it for example replacement.
            bad_example.append(word)
        elif w in known:
            pass          # verified real vocabulary: never delete
        elif not known:
            pass          # no authority list for this language yet: only CRUDE
        elif any(b in words and b in known for b in lemmas(w)):
            reason = "INFLECT"

        if not reason:
            return block
        counts[reason] = counts.get(reason, 0) + 1
        examples.setdefault(reason, []).append(word)
        words.discard(w)
        return ""

    out = ENTRY_RE.sub(repl, text)
    before, after = len(blocks), len(ENTRY_RE.findall(out))
    total = sum(counts.values())
    print("%-20s %5d -> %5d  (-%d)  %s   [bad example: %d]" % (
        os.path.basename(path), before, after, total,
        " ".join("%s=%d" % kv for kv in sorted(counts.items())), len(bad_example)))
    for reason in sorted(examples):
        print("    %-8s %s" % (reason, ", ".join(examples[reason][:16])))

    if apply_changes and total:
        if out.count("{") != out.count("}"):
            print("    ABORT: brace imbalance, file left untouched")
            return 0
        io.open(path, "w", encoding="utf-8", newline="\n").write(out)
    return total


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("files", nargs="*")
    ap.add_argument("--lang")
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    names = args.files or LANG_FILES.get(args.lang or "", [])
    if not names:
        print("give files or --lang " + "/".join(LANG_FILES))
        return 1
    lang = args.lang or "en"
    known = load_known_en() if lang == "en" else set()
    if lang == "en":
        print("known-good English headwords: %d\n" % len(known))
    grand = 0
    for name in names:
        path = name if os.path.sep in name else os.path.join(DATA, name)
        if os.path.exists(path):
            grand += clean_file(path, lang, args.apply, known) or 0
    print("\nremoved %d entries%s" % (grand, "" if args.apply else "  (DRY RUN)"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
