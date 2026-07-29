// Verifies the AdSense loader is present exactly once, in <head>, on every page,
// at both a desktop and a mobile viewport, and that pages still run clean.
const { chromium, devices } = require("playwright-core");

const PAGES = [
  "index.html", "home.html", "about.html", "help.html", "history.html",
  "profile.html", "games.html", "listening.html", "clozetest.html",
  "dictation.html", "hangman.html", "matrix.html", "memory.html", "quiz.html",
  "readingcomprehension.html", "scramble.html", "sentencescramble.html",
  "speedround.html", "stats.html", "survival.html", "truefalse.html",
  "wordlist.html", "wordmorph.html", "wordrace.html",
  "privacy.html", "terms.html",
];

const BASE = "http://127.0.0.1:8902/";
const SRC = "pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

async function checkViewport(browser, label, contextOpts) {
  const ctx = await browser.newContext(contextOpts);
  await ctx.addInitScript(() => {
    try { localStorage.setItem("udsp_welcomed_v1", "1"); } catch (e) {}
  });
  const results = [];
  for (const file of PAGES) {
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e.message)));
    const client = await page.context().newCDPSession(page);
    await client.send("Network.setCacheDisabled", { cacheDisabled: true });
    await client.send("Network.clearBrowserCache");
    try {
      await page.goto(BASE + file, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(400);
    } catch (e) {
      results.push({ file, ok: false, note: "navigation failed: " + e.message });
      await page.close();
      continue;
    }
    const info = await page.evaluate((SRC) => {
      const all = Array.from(document.querySelectorAll("script[src]"))
        .filter((s) => s.src.includes(SRC));
      const inHead = all.filter((s) => s.closest("head")).length;
      const first = all[0];
      return {
        total: all.length,
        inHead,
        async: first ? first.async : null,
        crossorigin: first ? first.getAttribute("crossorigin") : null,
        client: first ? new URL(first.src).searchParams.get("client") : null,
      };
    }, SRC);
    const ok =
      info.total === 1 &&
      info.inHead === 1 &&
      info.async === true &&
      info.crossorigin === "anonymous" &&
      info.client === "ca-pub-4464915775427405";
    const realErrors = errors.filter((m) => !/ERR_|Failed to fetch|net::/i.test(m));
    results.push({ file, ok, ...info, errors: realErrors });
    await page.close();
  }
  await ctx.close();
  const bad = results.filter((r) => !r.ok || (r.errors && r.errors.length));
  console.log(`\n=== ${label} ===`);
  console.log(`pages checked : ${results.length}`);
  console.log(`all correct   : ${bad.length === 0}`);
  for (const b of bad) console.log("  FAIL", JSON.stringify(b));
  return bad.length === 0;
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  const d = await checkViewport(browser, "DESKTOP 1440x900", {
    viewport: { width: 1440, height: 900 },
  });
  const m = await checkViewport(browser, "MOBILE iPhone 13", devices["iPhone 13"]);
  await browser.close();
  console.log("\nOVERALL:", d && m ? "PASS" : "FAIL");
  process.exit(d && m ? 0 : 1);
})();
