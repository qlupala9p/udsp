import sys, time, os
sys.path.insert(0, "scripts")
import fix_examples as F
words = [("Abendessen","de"),("Abfahrt","de"),("beeindruckend","de"),("Wolke","de"),
         ("aboulia","en"),("perspicacious","en"),("laconic","en"),("obfuscate","en"),
         ("aiguille","fr"),("ecchymose","fr")]
t0 = time.time()
for w, l in words:
    ex = F.fetch_examples(w, l)
    ok = [s for s in (ex or []) if F.usable(w, s, l)]
    print("%-16s %-3s raw=%-3s usable=%d  %s" % (w, l, len(ex) if ex is not None else "ERR", len(ok), (ok[0][:90] if ok else "")))
print("elapsed %.1fs for %d words -> %.2f words/s" % (time.time()-t0, len(words), len(words)/(time.time()-t0)))
