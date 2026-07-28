import sys
sys.path.insert(0, "scripts")
import _wiktionary as W
for w, site, fn in [("ausbetten", "de", W.german_meanings),
                    ("Abstellplatz", "de", W.german_meanings),
                    ("angeheitert", "de", W.german_meanings),
                    ("possible", "fr", W.french_meanings),
                    ("long", "fr", W.french_meanings)]:
    wt = W.fetch_wikitext(w, site)
    print("%-14s %s -> %r" % (w, site, (fn(wt) or ["<none>"])[:2]))
