import sys, os
sys.path.insert(0, "scripts")
import _udsp_data as U, _udsp_translate as T
import fix_boilerplate_definitions as F
d, r = F.build_plan()
cache = T.Cache("de_defs.json")
pv = r["partikelverbde.js"][:14]
go = sorted({w for k, v in r.items() if k != "partikelverbde.js" for w in v})[:14]
sample = pv + go
en = T.translate_many(cache, sample, "de", "en")
tr = T.translate_many(cache, sample, "de", "tr")
cache.save()
for w in sample:
    print("%-22s | %-30s | %s" % (w, en.get(w, ""), tr.get(w, "")))
