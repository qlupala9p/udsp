#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""move_app_selector.py

One-off migration: relocates the "APP" (#mode-select) <label
class="select-group"> block out of .selectors-row and into .brand-actions
(as the first child, right before the About link), across every HTML page
that has a #mode-select. If a page's .selectors-row becomes empty as a
result (games.html/listening.html, which only ever had the APP selector in
there), the now-empty .selectors-row wrapper is removed entirely.

Usage: python scripts/move_app_selector.py
"""
import os
import re
import glob

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

APP_BLOCK_RE = re.compile(
    r'[ \t]*<label class="select-group">\s*'
    r'<span class="select-label">APP</span>\s*'
    r'<select class="modes select-pill" id="mode-select"[^>]*>.*?</select>\s*'
    r'</label>\n',
    re.DOTALL,
)

EMPTY_SELECTORS_ROW_RE = re.compile(r'[ \t]*<div class="selectors-row">\s*</div>\n')

ABOUT_LINK_RE = re.compile(r'([ \t]*)<a class="about-btn" href="about\.html"')


def process_file(path):
    with open(path, encoding="utf-8") as f:
        content = f.read()

    m = APP_BLOCK_RE.search(content)
    if not m:
        return None

    block = m.group(0)
    content_without = content[: m.start()] + content[m.end():]

    # If removing the APP block left .selectors-row empty, drop the wrapper.
    content_without, n_removed = EMPTY_SELECTORS_ROW_RE.subn("", content_without)

    about_m = ABOUT_LINK_RE.search(content_without)
    if not about_m:
        return "no about.html link found -- aborting, file left untouched"

    indent = about_m.group(1)
    # Re-indent the moved block's <label>/</label> lines to match the About
    # link's indentation (already identical in every page checked, but keep
    # this robust rather than assuming).
    block_lines = block.rstrip("\n").split("\n")
    first_line_indent = re.match(r"[ \t]*", block_lines[0]).group(0)
    reindented = []
    for line in block_lines:
        if line.startswith(first_line_indent):
            reindented.append(indent + line[len(first_line_indent):])
        else:
            reindented.append(line)
    new_block = "\n".join(reindented) + "\n"

    new_content = (
        content_without[: about_m.start()] + new_block + content_without[about_m.start():]
    )

    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(new_content)
    return "moved (selectors-row wrapper %s)" % ("removed" if n_removed else "kept")


def main():
    files = sorted(glob.glob(os.path.join(ROOT, "*.html")))
    for path in files:
        result = process_file(path)
        name = os.path.basename(path)
        if result is None:
            print("[skip] %s: no #mode-select APP block found" % name)
        else:
            print("[%s] %s" % (name, result))


if __name__ == "__main__":
    main()
