"""One-off header restructure across every page (throwaway -- delete after use):

1. About / Help / Stats / Home links in .brand-actions become ICON-ONLY:
   the visible label is wrapped in <span class="btn-txt"> (hidden by CSS) and
   a data-tip attribute is added so the text shows on hover / keyboard focus
   (same [data-tip] mechanism already used site-wide).
2. The APP <select id="mode-select"> block is removed entirely -- the top
   toolbar now covers that navigation.
3. The <nav class="bottom-nav"> toolbar is MOVED out of its old position
   (after </main>) into .brand, immediately before <div class="brand-actions">
   i.e. right after the brand title, on the header's first line.
"""
import glob
import io
import re

TIPS = {
    "about.html": "Hakkında / About",
    "help.html": "Yardım / Help",
    "stats.html": "İstatistikler / Stats",
    "home.html": "Ana Sayfa / Home",
}

ABOUT_RE = re.compile(
    r'<a class="about-btn([^"]*)" href="(about|help|stats|home)\.html"([^>]*)>([^<]+)</a>'
)
NAV_RE = re.compile(
    r'[ \t]*(?:<!--[^\n]*-->\s*\n)?[ \t]*<nav class="bottom-nav".*?</nav>\r?\n',
    re.DOTALL,
)
MODE_RE = re.compile(
    r'[ \t]*<label class="select-group">\s*<span class="select-label">APP</span>.*?</label>\r?\n',
    re.DOTALL,
)
ACTIONS_RE = re.compile(r'([ \t]*)<div class="brand-actions">')


def fix_about(m):
    cls, page, attrs, text = m.group(1), m.group(2), m.group(3), m.group(4)
    href = page + ".html"
    existing = re.search(r'aria-label="([^"]*)"', attrs)
    tip = existing.group(1) if existing else TIPS[href]
    text = text.strip()
    parts = text.split(" ", 1)
    icon = parts[0]
    label = parts[1] if len(parts) > 1 else ""
    inner = icon + ('<span class="btn-txt"> ' + label + "</span>" if label else "")
    return (
        '<a class="about-btn%s" href="%s" aria-label="%s" data-tip="%s">%s</a>'
        % (cls, href, tip, tip, inner)
    )


report = []
for path in sorted(glob.glob("*.html")):
    with io.open(path, encoding="utf-8", newline="") as fh:
        original = fh.read()
    text = original
    notes = []

    new_text, n = ABOUT_RE.subn(fix_about, text)
    if n:
        text = new_text
        notes.append("about-btn x%d" % n)

    new_text, n = MODE_RE.subn("", text)
    if n:
        text = new_text
        notes.append("mode-select removed")

    nav = NAV_RE.search(text)
    if nav and '<div class="brand-actions">' in text:
        block = nav.group(0)
        # keep only the <nav> element itself, re-indented for .brand
        nav_only = re.search(r'<nav class="bottom-nav".*?</nav>', block, re.DOTALL).group(0)
        eol = "\r\n" if "\r\n" in original else "\n"
        lines = nav_only.replace("\r\n", "\n").split("\n")
        reindented = eol.join(["        " + ln.strip() if ln.strip() else "" for ln in lines])
        text = text.replace(block, "")
        m = ACTIONS_RE.search(text)
        indent = m.group(1)
        insert = (
            indent + "<!-- Main toolbar: shares the header's first line -->" + eol
            + reindented + eol
        )
        text = text[: m.start()] + insert + text[m.start():]
        notes.append("toolbar moved")

    if text != original:
        with io.open(path, "w", encoding="utf-8", newline="") as fh:
            fh.write(text)
        report.append("%-28s %s" % (path, ", ".join(notes)))

print("\n".join(report))
print("files changed:", len(report))
