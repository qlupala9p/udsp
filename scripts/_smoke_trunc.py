import sys, time
sys.path.insert(0, "scripts")
import _wiktionary as W, _udsp_data as U, _udsp_quality as Q
_, es = U.load("synantde.js")
words = [U.unescape(e["word"]) for e in es][:50]
r = W.fetch_many(words, "de")
empty = [w for w in words if not r.get(w)]
print("batch of 50: %d empty" % len(empty), empty[:12])
r2 = W.fetch_many(empty[:10], "de")
print("re-fetched in a batch of 10: %d still empty" % len([w for w in empty[:10] if not r2.get(w)]))
_, es2 = U.load("wordsc2.js")
ew = [U.unescape(e["word"]) for e in es2 if Q.is_placeholder_example(e.native("example") or "")][:50]
r3 = W.fetch_many(ew, "en")
e3 = [w for w in ew if not r3.get(w)]
print("english batch of 50: %d empty" % len(e3), e3[:12])
r4 = W.fetch_many(e3[:10], "en")
print("re-fetched in a batch of 10: %d still empty" % len([w for w in e3[:10] if not r4.get(w)]))
