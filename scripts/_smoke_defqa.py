import sys, random
sys.path.insert(0, "scripts")
import _udsp_data as U
for name in ("synantde.js", "wordsb1fr.js", "wordsc2fr.js"):
    _, es = U.load(name)
    rnd = random.Random(11)
    pick = rnd.sample(es, 6)
    print("== " + name)
    for e in pick:
        print("   %-18s | %s" % (U.unescape(e["word"]), U.unescape(e.get("definition") or "")[:110]))
