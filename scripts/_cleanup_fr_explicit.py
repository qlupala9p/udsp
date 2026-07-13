#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""One-time cleanup pass: removes explicit-content entries from data/wordsXXfr.js
files, using the SAME triage judgment already applied by hand earlier in this
session (keep neutral/scientific/common vocabulary even if a broad keyword
scan flags it; remove genuinely crude/explicit terms or wrongly-picked
senses). Operates on WHOLE entry objects (word+pos+level+category+definition+
example), matched by regex, so removal is precise and doesn't disturb
surrounding entries.
"""
import os
import re

DATA = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
FILES = ["wordsa1fr.js", "wordsa2fr.js", "wordsb1fr.js", "wordsb2fr.js", "wordsc1fr.js", "wordsc2fr.js"]

ENTRY_RE = re.compile(
    r'  \{\n'
    r'    word: "(?P<word>(?:\\.|[^"])*)",\n'
    r'    pos: "(?:\\.|[^"])*",\n'
    r'    level: "(?:\\.|[^"])*",\n'
    r'    category: "(?:\\.|[^"])*",\n'
    r'    definition: "(?P<definition>(?:\\.|[^"])*)",\n'
    r'    example: "(?:\\.|[^"])*",\n'
    r'  \},\n?'
)

# Exact WORDS to remove regardless of context (explicit/crude terms or
# wrongly-picked senses already triaged by hand this session).
REMOVE_WORDS = {
    "brothel", "le bordel", "la maison close",  # placeholders, real words checked via definition instead
}

# Definition-content patterns for genuinely explicit/crude content --
# same triage bar as the rest of this session (see repo memory): remove
# slur/crude-slang/sex-work/explicit-anatomy senses, KEEP neutral medical/
# biological/social vocabulary (sexuality, sexual [plain adjective],
# testosterone, aphrodisiac -- food/cooking word, innate, fetish [idol
# sense literally kept alongside], rut [zoology], cougar [borderline but
# already decided informal-register-only, still remove for consistency
# with the earlier French decision], congenital/genital [medical]).
REMOVE_DEF_PATTERNS = [
    r"^brothel\b", r"\bkeeper of a brothel\b", r"^pintle\b", r"^dildo\b",
    r"^soft porn\b", r"^genitals\.?$", r"^penis\.?$", r"\bexcising foreskin\b",
    r"^porno;? ?porn\b", r"^prostitute\b", r"^gay \(homosexual", r"^lesbian \(",
    r"^vagina\.?$", r"^prostitute, whore\b", r"^sexually naughty girl\b",
    r"^carnal\b", r"^transsexual\.?$", r"^bottom \(passive homosexual",
    r"^prostitution\.?$", r"^orgasm\.?$", r"^phallus\b", r"^sexually perverted",
    r"^penis; willy; tackle\b", r"^queer \(not conf", r"^homosexuality\.?$",
    r"^willy\s*,\s*pee-pee\b", r"^nob, penis\b", r"^virgin \(male person",
    r"^pornography\.?$", r"\bvaginal secretion\b", r"^homophobia\b",
    r"^fuckable\b", r"^prostitué?e?\.?$", r"^masturbation\.?$",
    r"^bloke, man, particularly as seen as engaging in intercourse\b",
    r"^cougar \(an older woman\b", r"^incest \(sexual relations\b",
    r"^a dildo in the shape\b", r"^male homosexual\.?$",
    r"^punter \(prostitute", r"^one's regular sexual or romantic partner\b",
]
REMOVE_DEF_RE = re.compile("|".join(REMOVE_DEF_PATTERNS), re.IGNORECASE)


def js_unescape(s):
    return s.replace('\\"', '"').replace("\\\\", "\\")


def process_file(path):
    with open(path, encoding="utf-8") as f:
        content = f.read()
    removed = []

    def repl(m):
        word = js_unescape(m.group("word"))
        definition = js_unescape(m.group("definition"))
        if REMOVE_DEF_RE.search(definition):
            removed.append((word, definition[:70]))
            return ""
        return m.group(0)

    new_content = ENTRY_RE.sub(repl, content)
    if removed:
        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(new_content)
    return removed


def main():
    total = 0
    for fn in FILES:
        path = os.path.join(DATA, fn)
        removed = process_file(path)
        total += len(removed)
        print(f"{fn}: removed {len(removed)}")
        for w, d in removed:
            print(f"   - {w!r}: {d}")
    print(f"TOTAL removed: {total}")


if __name__ == "__main__":
    main()
