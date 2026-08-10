#!/usr/bin/env python3
"""Prepend the PolyForm Noncommercial 1.0.0 licence banner to every .js file.

Re-runnable: a file that already carries the banner is left untouched, so this
can be run again after new scripts are added. Run from the repo root:

    python scripts/add_license_headers.py            # apply
    python scripts/add_license_headers.py --check    # report only, exit 1 if
                                                     # anything is missing

Deliberate details:

* Line endings are preserved PER FILE. The repo is a mix of CRLF and LF and
  rewriting them all one way would turn a 3-line licence change into an
  88-file whole-content diff that hides the real edit.
* Files are read and written as UTF-8 WITHOUT a BOM, which is what they
  already are -- the word lists are full of Turkish/German/French characters
  and a stray BOM would show up as a mojibake glyph at the top of a served
  script.
* data/*.js gets an EXTRA line. Those files bundle third-party definitions and
  example sentences (Wiktionary CC BY-SA 4.0, Tatoeba CC BY 2.0 FR, WordNet
  and others -- see NOTICE). CC BY-SA in particular forbids applying further
  restrictions to the licensed material, so the banner there has to say the
  noncommercial term covers this project's own code and compilation and NOT
  the sourced content. Do not "simplify" that line away.
* A shebang, if one is ever added, has to stay on line 1, so the banner is
  inserted after it.
"""

import argparse
import pathlib
import sys

MARKER = "PolyForm Noncommercial"

SKIP_DIRS = {"node_modules", ".venv", ".git", "dist", "build"}

BANNER = """\
/*! Top Words (udsp) — Copyright 2026 Bulent Ozkir, Ahmet Arda Ozkir, Halit Eren Ozkir
 * Licensed under the PolyForm Noncommercial License 1.0.0 — NONCOMMERCIAL USE ONLY.
 * <https://polyformproject.org/licenses/noncommercial/1.0.0>
 *
 * Any commercial use requires prior written permission from the copyright
 * holders. Written permission from any ONE of bulentozkir@hotmail.com,
 * bulentozkir@gmail.com, ahmetardaozkir@gmail.com or haliterenozkir@gmail.com
 * is sufficient and binding on all of them.
 *
 * Required Notice: Copyright 2026 Bulent Ozkir, Ahmet Arda Ozkir, Halit Eren
 * Ozkir (https://udsp.vercel.app)
 * Full terms: see LICENSE and NOTICE in this repository.
 */"""

DATA_NOTE = """\
/*! Third-party content: this file bundles definitions and example sentences
 * from open community projects (Wiktionary CC BY-SA 4.0, Tatoeba CC BY 2.0 FR,
 * WordNet and others — see NOTICE). That content keeps ITS OWN licence; the
 * noncommercial term above applies to this project's code and to the
 * compilation, not to the sourced content.
 */"""


def read_raw(path: pathlib.Path) -> str:
    """Read WITHOUT universal-newline translation.

    pathlib's read_text() turns every \r\n into \n before you ever see it, so
    a naive round-trip silently normalises the whole file and buries a 14-line
    licence edit inside a 60,000-line whitespace diff.
    """
    with open(path, encoding="utf-8", newline="") as fh:
        return fh.read()


def eol_of(text: str) -> str:
    """The file's own newline, so we don't rewrite every line of a 5 MB list."""
    i = text.find("\n")
    if i > 0 and text[i - 1] == "\r":
        return "\r\n"
    return "\n"


def banner_for(path: pathlib.Path, root: pathlib.Path) -> str:
    parts = path.relative_to(root).parts
    if parts and parts[0] == "data":
        return BANNER + "\n" + DATA_NOTE
    return BANNER


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="report only, change nothing")
    args = ap.parse_args()

    root = pathlib.Path(__file__).resolve().parent.parent
    files = sorted(
        p
        for p in root.rglob("*.js")
        if not SKIP_DIRS.intersection(p.relative_to(root).parts)
    )

    missing, changed = [], []
    for path in files:
        text = read_raw(path)
        if MARKER in text[:2000]:
            continue
        missing.append(path.relative_to(root).as_posix())
        if args.check:
            continue

        eol = eol_of(text)
        banner = banner_for(path, root).replace("\n", eol)

        # A shebang must stay on line 1.
        if text.startswith("#!"):
            cut = text.find("\n")
            cut = len(text) if cut == -1 else cut + 1
            body = text[:cut] + banner + eol + eol + text[cut:]
        else:
            body = banner + eol + eol + text

        # newline="" keeps the bytes we just built; utf-8 (not utf-8-sig) keeps
        # the file BOM-free.
        with open(path, "w", encoding="utf-8", newline="") as fh:
            fh.write(body)
        changed.append(path.relative_to(root).as_posix())

    if args.check:
        for name in missing:
            print("missing banner: " + name)
        print(f"{len(files) - len(missing)}/{len(files)} .js files carry the banner")
        return 1 if missing else 0

    for name in changed:
        print("banner added: " + name)
    print(f"{len(changed)} added, {len(files) - len(changed)} already had it, {len(files)} total")
    return 0


if __name__ == "__main__":
    sys.exit(main())
