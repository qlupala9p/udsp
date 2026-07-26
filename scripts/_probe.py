import os
import subprocess
import sys

CANDIDATES = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]
exe = next((p for p in CANDIDATES if os.path.exists(p)), None)
if not exe:
    print("no browser")
    sys.exit(1)

out = os.path.join(os.environ.get("TEMP", "."), "udsp_shots")
os.makedirs(out, exist_ok=True)
profile = os.path.join(out, "profile")

probes = sys.argv[1:] or [
    "index.html:390:844",
    "index.html:1280:900",
]
for spec in probes:
    page, w, h = spec.split(":")
    name = "probe_%s_%s" % (page.replace(".html", ""), w)
    png = os.path.join(out, name + ".png")
    if os.path.exists(png):
        os.remove(png)
    url = "http://localhost:8791/_probe.html?page=%s&w=%s&h=%s" % (page, w, h)
    subprocess.run(
        [
            exe,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--force-device-scale-factor=1",
            "--user-data-dir=" + profile,
            "--window-size=1100,700",
            "--screenshot=" + png,
            "--virtual-time-budget=4000",
            url,
        ],
        capture_output=True,
        timeout=120,
    )
    print(name, os.path.exists(png))
