import sys, time
sys.path.insert(0, "scripts")
import _wiktionary as W, _udsp_data as U
t0 = time.time()
de = ["compilieren","derogativ","Abstellplatz","angeheitert","dazwischentreten","ausbetten"]
r = W.fetch_many(de, "de")
for w in de:
    g = W.german_meanings(r.get(w) or "")
    print("%-18s chars=%-6d gloss=%s" % (w, len(r.get(w) or ""), (g[0][:60] if g else "<none>")))
fr = ["la table","le t\u00e9l\u00e9phone","la chance","le police","six"]
titles = {w: U.headword(w, "fr") for w in fr}
r = W.fetch_many(sorted(set(titles.values())), "fr")
for w in fr:
    g = W.french_meanings(r.get(titles[w]) or "")
    print("%-18s -> %-12s chars=%-6d gloss=%s" % (w, titles[w], len(r.get(titles[w]) or ""), (g[0][:55] if g else "<none>")))
print("elapsed %.1fs" % (time.time()-t0))
