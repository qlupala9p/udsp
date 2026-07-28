import json, urllib.request, urllib.parse
HEADERS = {"User-Agent": "udsp-vocab-content/1.0 (offline study app; contact via repo)"}
for w in ("adiabatic", "adios", "laconic"):
    url = ("https://en.wiktionary.org/w/api.php?action=parse&prop=wikitext"
           "&format=json&formatversion=2&page=%s" % urllib.parse.quote(w))
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as r:
        raw = r.read().decode("utf-8")
    d = json.loads(raw)
    print(w, "| keys:", list(d.keys()))
    if "error" in d:
        print("   error:", json.dumps(d["error"])[:300])
    else:
        p = d.get("parse", {})
        print("   parse keys:", list(p.keys()))
        wt = p.get("wikitext")
        print("   wikitext type:", type(wt).__name__, "len:", len(wt) if isinstance(wt, str) else "n/a")
        if isinstance(wt, dict):
            print("   dict keys:", list(wt.keys()), "len*:", len(wt.get("*", "")))
