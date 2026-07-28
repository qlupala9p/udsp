import sys, time
sys.path.insert(0, "scripts")
import _wiktionary as W, _udsp_data as U, _udsp_quality as Q
_, es = U.load("wordsc2.js")
words = [U.unescape(e["word"]) for e in es
         if Q.is_placeholder_example(e.native("example") or "")][:20]
t0 = time.time(); tot = 0
for w in words:
    t1 = time.time()
    wt = W.fetch_wikitext(w, "en")
    n = len(wt or "")
    tot += n
    ex = W.english_examples(wt) if wt else []
    print("%-18s %6d chars  %5.2fs  ex=%d" % (w, n, time.time()-t1, len(ex)))
el = time.time()-t0
print("total %.1fs for %d -> %.2f/s ; avg page %d chars" % (el, len(words), len(words)/el, tot//max(1,len(words))))
