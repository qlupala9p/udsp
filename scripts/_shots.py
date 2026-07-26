import os
import subprocess
import sys

CANDIDATES = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
]
exe = next((p for p in CANDIDATES if os.path.exists(p)), None)
if not exe:
    print("no browser found")
    sys.exit(1)
print("using", exe)

out = os.path.join(os.environ.get("TEMP", "."), "udsp_shots")
os.makedirs(out, exist_ok=True)
profile = os.path.join(out, "profile")

shots = [
    ("_seed", "800,600", "http://localhost:8791/_seed.html"),
    ("desktop", "1280,900", "http://localhost:8791/index.html"),
    ("desktop_about", "1280,900", "http://localhost:8791/about.html"),
    ("desktop_narrow", "820,900", "http://localhost:8791/quiz.html"),
    ("desktop_home", "1280,900", "http://localhost:8791/home.html"),
    ("phone", "390,844", "http://localhost:8791/index.html"),
    ("phone_small", "360,640", "http://localhost:8791/wordlist.html"),
]
for name, size, url in shots:
    png = os.path.join(out, name + ".png")
    if os.path.exists(png):
        os.remove(png)
    cmd = [
        exe,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--user-data-dir=" + profile,
        "--window-size=" + size,
        "--screenshot=" + png,
        "--virtual-time-budget=3000",
        url,
    ]
    subprocess.run(cmd, capture_output=True, timeout=120)
    print(name, "->", png, os.path.exists(png), os.path.getsize(png) if os.path.exists(png) else 0)
