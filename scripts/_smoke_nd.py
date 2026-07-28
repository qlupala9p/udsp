import sys, random
sys.path.insert(0, "scripts")
import fix_nondefinitions as F, _udsp_data as U
pos = F.plan_pos()
print("C mismatches now: %d" % len(pos))
for r in random.Random(7).sample(pos, min(20, len(pos))):
    _, es = U.load(r[0])
    d = next(U.unescape(e.get("definition") or "") for e in es if U.unescape(e["word"]) == r[1])
    print("   %-16s %-10s -> %-6s | %s" % (r[1], r[2], r[3], d.split(" - ")[0][:70]))
print("")
plans = F.plan_defs()
print("B French cognates: %d" % len(plans["fr"]))
for name, w in random.Random(3).sample(plans["fr"], 18):
    _, es = U.load(name)
    d = next(U.unescape(e.get("definition") or "") for e in es if U.unescape(e["word"]) == w)
    print("   %-18s %-16s %s" % (name, w, d[:70]))
