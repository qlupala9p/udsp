import sys
sys.path.insert(0, "scripts")
import _udsp_data as U, _udsp_quality as Q
for name, n in (("wordsa1fr.js", 4), ("wordsc1fr.js", 3), ("synantde.js", 3), ("wordsc1.js", 3)):
    _, es = U.load(name)
    print("== " + name)
    for e in es[:n]:
        print("   word=%r" % U.unescape(e["word"]))
        print("     def=%r" % U.unescape(e.get("definition") or ""))
        print("     ex =%r" % U.unescape(e.get("example") or "")[:120])
_, es = U.load("synantde.js")
bad = [e for e in es if "hnlich wie" in U.unescape(e.get("definition") or "")]
print("synantde 'Ahnlich wie' count:", len(bad))
print("  is_stub says:", sum(1 for e in es if Q.is_stub_definition(e.native("definition"))))
if bad:
    print("  sample:", U.unescape(bad[0]["definition"])[:160])
