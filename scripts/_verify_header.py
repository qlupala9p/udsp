import glob
import io
import re

css = io.open("styles.css", encoding="utf-8").read()
print("css braces: %d open / %d close" % (css.count("{"), css.count("}")))

brand_nav = re.compile(
    r'<div class="brand">.*?<nav class="bottom-nav".*?</nav>.*?<div class="brand-actions">',
    re.DOTALL,
)
bad = 0
for path in sorted(glob.glob("*.html")):
    t = io.open(path, encoding="utf-8").read()
    nav = len(re.findall(r'<nav class="bottom-nav"', t))
    in_brand = "yes" if brand_nav.search(t) else "NO"
    sel = len(re.findall(r'id="mode-select"', t))
    btn = len(re.findall(r'class="btn-txt"', t))
    tips = len(re.findall(r'class="about-btn" href="(?:about|help|stats|home)\.html"', t))
    tips_ok = len(
        re.findall(
            r'class="about-btn" href="(?:about|help|stats|home)\.html" aria-label="[^"]+" data-tip="[^"]+"',
            t,
        )
    )
    ok = nav == 1 and in_brand == "yes" and sel == 0 and tips == tips_ok
    if not ok:
        bad += 1
    print(
        "%-28s nav=%d inBrand=%-3s modeSel=%d btnTxt=%d iconLinks=%d/%d %s"
        % (path, nav, in_brand, sel, btn, tips_ok, tips, "" if ok else "  <-- CHECK")
    )
print("problem files:", bad)
