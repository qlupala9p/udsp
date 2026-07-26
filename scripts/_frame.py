import os
import subprocess
import sys

exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
out = os.path.join(os.environ.get("TEMP", "."), "udsp_shots")
os.makedirs(out, exist_ok=True)
profile = os.path.join(out, "profile")

specs = sys.argv[1:] or ["index.html:390:844"]
for spec in specs:
    page, w, h = spec.split(":")
    name = "frame_%s_%s" % (page.replace(".html", ""), w)
    png = os.path.join(out, name + ".png")
    if os.path.exists(png):
        os.remove(png)
    url = "http://localhost:8791/_frame.html?page=%s&w=%s&h=%s" % (page, w, h)
    subprocess.run(
        [
            exe,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--force-device-scale-factor=1",
            "--user-data-dir=" + profile,
            "--window-size=%d,%d" % (int(w) + 10, int(h) + 10),
            "--screenshot=" + png,
            "--virtual-time-budget=4000",
            url,
        ],
        capture_output=True,
        timeout=120,
    )
    print(name, os.path.exists(png))
