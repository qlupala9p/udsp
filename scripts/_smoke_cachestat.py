import json, collections
d = json.load(open("scripts/.cache/wikt_native_defs.json", encoding="utf-8"))
c = collections.Counter(k.split("|")[0] for k in d)
print("cache keys by prefix:", dict(c))
for p in ("de", "fren", "frfr"):
    ks = [k for k in d if k.startswith(p + "|")]
    empty = [k for k in ks if not d[k]]
    print("%-5s %5d keys, %5d empty (%.0f%% useful)" % (p, len(ks), len(empty), 100*(1-len(empty)/max(1,len(ks)))))
    for k in [x for x in ks if d[x]][:3]:
        print("      +", k, "->", d[k][0][:70])
    for k in empty[:5]:
        print("      -", k)
