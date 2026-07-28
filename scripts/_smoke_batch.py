import sys, time
sys.path.insert(0, "scripts")
import _wiktionary as W, fix_examples as F
t0 = time.time()
en = ["adiabatic","adios","laconic","perspicacious","aboulia","addressable","obfuscate","ubiquitous"]
res = W.fetch_many(en, "en")
for w in en:
    wt = res.get(w)
    ex = W.english_examples(wt) if wt else []
    ok = [F.tidy(s) for s in ex if F.usable(w, s, "en")]
    print("%-15s chars=%-7s ex=%-3d usable=%-2d %s" % (w, len(wt) if wt is not None else "None", len(ex), len(ok), F.pick(ok) or ""))
de = ["Abendessen","ausbetten","zuerkennen","abbeuteln"]
res = W.fetch_many(de, "de")
for w in de:
    wt = res.get(w)
    ok = [F.tidy(s) for s in (W.german_examples(wt) if wt else []) if F.usable(w, s, "de")]
    print("%-15s chars=%-7s usable=%-2d %s" % (w, len(wt) if wt is not None else "None", len(ok), F.pick(ok) or ""))
fr = ["possible","long","ketchup","nasal"]
res = W.fetch_many(fr, "en")
for w in fr:
    print("%-15s glosses=%s" % (w, (W.english_glosses(res.get(w) or "", "French") or ["<none>"])[:2]))
print("elapsed %.1fs" % (time.time()-t0))
