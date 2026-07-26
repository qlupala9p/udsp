import os
import subprocess

exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
out = os.path.join(os.environ.get("TEMP", "."), "udsp_shots")
os.makedirs(out, exist_ok=True)
profile = os.path.join(out, "profile_web")

urls = [
    ("collins_pt", "https://www.collinsdictionary.com/dictionary/portuguese-english/casa"),
]
for name, url in urls:
    png = os.path.join(out, name + ".png")
    if os.path.exists(png):
        os.remove(png)
    subprocess.run(
        [
            exe,
            "--headless=new",
            "--disable-gpu",
            "--hide-scrollbars",
            "--force-device-scale-factor=1",
            "--user-data-dir=" + profile,
            "--window-size=1100,900",
            "--screenshot=" + png,
            "--virtual-time-budget=9000",
            url,
        ],
        capture_output=True,
        timeout=180,
    )
    print(name, os.path.exists(png), os.path.getsize(png) if os.path.exists(png) else 0)
