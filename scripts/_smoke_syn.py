import sys
sys.path.insert(0, "scripts")
import _udsp_data as U, _udsp_quality as Q
t, e = U.load("synantde.js")
stub = [x for x in e if Q.is_stub_definition(x.native("definition"))]
real = [x for x in e if not Q.is_stub_definition(x.native("definition"))]
print("stub %d  real %d" % (len(stub), len(real)))
print("\n-- REAL definition samples (native half):")
for x in real[:8]:
    print("   %-18s | %s | TR: %s" % (U.unescape(x["word"]), x.native("definition")[:52], x.turkish("definition")[:34]))
print("\n-- STUB samples:")
for x in stub[:6]:
    print("   %-18s | %s | TR: %s" % (U.unescape(x["word"]), x.native("definition")[:52], x.turkish("definition")[:34]))
    print("        syn=%s" % (x.plain("synonyms") or "")[:60])
