import sys
sys.path.insert(0, "scripts")
import _wiktionary as W, _udsp_data as U
import fix_nondefinitions as N
plan = N.plan_defs()
sample = plan["de"][:200]
r = W.fetch_many(sample, "de")
nopage, nogloss, ok = [], [], 0
for w in sample:
    wt = r.get(w) or ""
    if not wt:
        nopage.append(w); continue
    if W.german_meanings(wt):
        ok += 1
    else:
        nogloss.append(w)
print("de sample %d -> gloss %d | page-but-no-Bedeutungen %d | no page %d"
      % (len(sample), ok, len(nogloss), len(nopage)))
print("  no-gloss examples:", nogloss[:8])
rest = nogloss + nopage
r2 = W.fetch_many(rest, "en")
got = [(w, W.english_glosses(r2.get(w) or "", "German")) for w in rest]
have = [(w, g) for w, g in got if g]
print("en.wiktionary German section covers %d of the remaining %d" % (len(have), len(rest)))
for w, g in have[:8]:
    print("   %-20s %s" % (w, g[0][:60]))
