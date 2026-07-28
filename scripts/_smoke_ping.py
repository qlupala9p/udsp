import sys, time
sys.path.insert(0, "scripts")
import _wiktionary as W
t0 = time.time()
r = W.fetch_many(["laconic","obfuscate","ubiquitous"], "en")
print("elapsed %.2fs  got %d  chars %s" % (time.time()-t0, len(r), [len(v or "") for v in r.values()]))
