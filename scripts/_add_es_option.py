"""One-off: add the Spanish <option> to every page's language selector.
Throwaway -- delete after running."""
import glob
import io
import os

OLD = '            <option value="it">Italian</option>\n'
NEW = OLD + '            <option value="es">Spanish</option>\n'

changed = []
for path in sorted(glob.glob("*.html")):
    with io.open(path, encoding="utf-8", newline="") as fh:
        text = fh.read()
    if '<option value="es">Spanish</option>' in text:
        continue
    # normalise for both \n and \r\n files
    for old, new in ((OLD, NEW), (OLD.replace("\n", "\r\n"), NEW.replace("\n", "\r\n"))):
        if old in text:
            text = text.replace(old, new)
            with io.open(path, "w", encoding="utf-8", newline="") as fh:
                fh.write(text)
            changed.append(path)
            break

print("updated %d files:" % len(changed))
print(", ".join(os.path.basename(p) for p in changed))
