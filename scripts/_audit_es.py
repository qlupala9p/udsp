"""Audit which files still lack Spanish (İspanyolca) wiring."""
import glob
import io
import os
import re

def read(p):
    return io.open(p, encoding="utf-8").read()

print("=== HTML pages: Italian mentioned but Spanish missing ===")
for p in sorted(glob.glob("*.html")):
    t = read(p)
    it = "İtalyanca" in t or "Italian" in t
    es = "İspanyolca" in t or "Spanish" in t
    if it and not es:
        print("  %-28s ITALIAN-only (no Spanish anywhere)" % p)

print()
print("=== Turkish 4-language phrase still missing Spanish ===")
pat = re.compile(r"İngilizce,?\s+Almanca,?\s+Fransızca\s+ve\s+İtalyanca", re.S)
for p in sorted(glob.glob("*.html") + ["site.webmanifest", "README.md"]):
    if not os.path.exists(p):
        continue
    t = read(p)
    n = len(pat.findall(t))
    if n:
        print("  %-28s %d hit(s)" % (p, n))

print()
print("=== English 4-language phrase still missing Spanish ===")
pat_en = re.compile(r"English,?\s+German,?\s+French\s+and\s+Italian", re.S)
for p in sorted(glob.glob("*.html") + glob.glob("*.js") + ["site.webmanifest"]):
    if not os.path.exists(p):
        continue
    t = read(p)
    n = len(pat_en.findall(t))
    if n:
        print("  %-28s %d hit(s)" % (p, n))

print()
print("=== Any other 'İtalyanca' line without 'İspanyolca' nearby (same line) ===")
for p in sorted(glob.glob("*.html") + glob.glob("*.js") + ["site.webmanifest"]):
    if not os.path.exists(p):
        continue
    for i, line in enumerate(read(p).split("\n"), 1):
        if "İtalyanca" in line and "İspanyolca" not in line:
            print("  %s:%d  %s" % (p, i, line.strip()[:120]))

print()
print("=== JSON-LD inLanguage arrays ===")
for p in sorted(glob.glob("*.html")):
    t = read(p)
    for m in re.finditer(r'"inLanguage"\s*:\s*(\[[^\]]*\]|"[^"]*")', t):
        print("  %-28s %s" % (p, m.group(1)))

print()
print("=== og:locale:alternate values ===")
for p in sorted(glob.glob("*.html")):
    t = read(p)
    vals = re.findall(r'og:locale:alternate"\s+content="([^"]+)"', t)
    if vals:
        print("  %-28s %s" % (p, ", ".join(vals)))

print()
print("=== scripts TARGET_FILES containing 'it.js' but not 'es.js' ===")
for p in sorted(glob.glob("scripts/*.py")):
    t = read(p)
    if "wordsa1it.js" in t and "wordsa1es.js" not in t:
        print("  %s" % p)

print()
print("=== throwaway scripts present? ===")
for p in ["scripts/_es_bands.py", "scripts/_check_es.js", "scripts/_add_es_option.py",
          "scripts/_check_pt_urls.py", "scripts/_shot_web.py"]:
    print("  %-34s %s" % (p, "EXISTS" if os.path.exists(p) else "-"))
