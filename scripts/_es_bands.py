"""Throwaway helper: dump Spanish frequency bands from the open
hermitdave/FrequencyWords es_50k list so CEFR level assignment for the new
data/words*es.js files is grounded in real corpus data rather than guesswork.
Delete after use."""
import os
import re
import sys

PATH = os.path.join(os.environ.get("TEMP", "."), "es_50k.txt")
WORD_RE = re.compile(r"^[a-záéíóúüñ]+$")

words = []
with open(PATH, encoding="utf-8") as fh:
    for line in fh:
        parts = line.split()
        if len(parts) != 2:
            continue
        w = parts[0]
        if WORD_RE.match(w) and len(w) >= 2:
            words.append(w)

rank = {w: i + 1 for i, w in enumerate(words)}
print("total usable words:", len(words))

if len(sys.argv) > 1 and sys.argv[1] == "rank":
    for w in sys.argv[2:]:
        print(w, rank.get(w, "NOT-IN-LIST"))
    raise SystemExit

BANDS = [
    ("A1", 1, 700),
    ("A2", 700, 1800),
    ("B1", 1800, 4500),
    ("B2", 4500, 11000),
    ("C1", 11000, 24000),
    ("C2", 24000, 50000),
]
for name, lo, hi in BANDS:
    chunk = words[lo - 1 : hi]
    step = max(1, len(chunk) // 160)
    sample = chunk[::step][:160]
    print("\n=== %s (rank %d-%d, %d words) ===" % (name, lo, hi, len(chunk)))
    print(" ".join(sample))
