import sys, random
sys.path.insert(0, "scripts")
import _udsp_data as U, _udsp_quality as Q
for name in ("phrasalverbsen.js", "synanten.js", "wordsb2gode.js", "synantde.js"):
    _, es = U.load(name)
    lang = U.lang_of(name)
    bad = [e for e in es if e.native("example") and not Q.is_placeholder_example(e.native("example"))
           and not Q.example_contains_word(U.unescape(e["word"]), e.native("example"), lang)]
    print("== %s  %d" % (name, len(bad)))
    for e in random.Random(5).sample(bad, min(8, len(bad))):
        print("   %-22s :: %s" % (U.unescape(e["word"]), e.native("example")[:95]))
