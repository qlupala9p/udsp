import sys, collections
sys.path.insert(0, "scripts")
import _udsp_data as U
import fix_cross_level_dupes as F
for coll, files in F.COLLECTIONS.items():
    lang = U.lang_of(files[0])
    if lang not in U.ARTICLE_RE:
        continue
    groups = collections.defaultdict(list)
    for name in files:
        _, entries = U.load(name)
        for e in entries:
            w = U.unescape(e["word"]).strip()
            m = U.ARTICLE_RE[lang].match(w)
            art = (m.group(0).strip().lower() if m else "")
            groups[U.bare(w, lang)].append((art, w, name))
    clash = {k: v for k, v in groups.items()
             if len(v) > 1 and len({a for a, _, _ in v if a}) > 1}
    print("%-8s groups with CONFLICTING articles: %d" % (coll, len(clash)))
    for k, v in list(clash.items())[:6]:
        print("     %-16s %s" % (k, [(a, n) for a, _w, n in v]))
