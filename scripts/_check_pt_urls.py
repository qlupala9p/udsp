import urllib.request

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)
urls = [
    "https://www.collinsdictionary.com/dictionary/portuguese-english/casa",
    "https://www.collinsdictionary.com/dictionary/portuguese-english/livro",
    "https://www.collinsdictionary.com/dictionary/spanish-english/casa",
]
for u in urls:
    req = urllib.request.Request(u, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            body = r.read().decode("utf-8", "replace")
            print(u, "->", r.status, "len", len(body))
            low = body.lower()
            for probe in ["portuguese-english", "portuguese to english", "casa", "livro"]:
                print("    contains", probe, ":", probe in low)
    except Exception as exc:
        print(u, "-> ERROR", exc)
