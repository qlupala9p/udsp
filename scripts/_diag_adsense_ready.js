/*! Top Words (udsp) — Copyright 2026 Bulent Ozkir, Ahmet Arda Ozkir, Halit Eren Ozkir
 * Licensed under the PolyForm Noncommercial License 1.0.0 — NONCOMMERCIAL USE ONLY.
 * <https://polyformproject.org/licenses/noncommercial/1.0.0>
 *
 * Any commercial use requires prior written permission from the copyright
 * holders. Written permission from any ONE of bulentozkir@hotmail.com,
 * bulentozkir@gmail.com, ahmetardaozkir@gmail.com or haliterenozkir@gmail.com
 * is sufficient and binding on all of them.
 *
 * Required Notice: Copyright 2026 Bulent Ozkir, Ahmet Arda Ozkir, Halit Eren
 * Ozkir (https://udsp.vercel.app)
 * Full terms: see LICENSE and NOTICE in this repository.
 */

// AdSense readiness check: every page must expose a reachable privacy policy,
// terms/contact link, and (for indexable pages) real static prose that a
// reviewer can read without running the app. Also asserts pages run clean.
const { chromium, devices } = require("playwright-core");

const BASE = "http://127.0.0.1:8902/";

// Pages that must carry static, crawlable content ("low value content" is the
// most common AdSense rejection reason for app-style sites).
const CONTENT_PAGES = [
  "index.html", "about.html", "help.html", "games.html", "listening.html",
  "quiz.html", "wordlist.html", "wordmorph.html", "clozetest.html",
  "hangman.html", "scramble.html", "memory.html", "speedround.html",
  "wordrace.html", "sentencescramble.html", "dictation.html",
  "truefalse.html", "survival.html", "matrix.html",
  "readingcomprehension.html", "privacy.html", "terms.html",
];

// Pages that are personalised / thin by nature: they must be noindex, and are
// exempt from the prose requirement, but still need the legal footer links.
const NOINDEX_PAGES = ["home.html", "history.html", "profile.html", "stats.html"];

const ALL = CONTENT_PAGES.concat(NOINDEX_PAGES);

async function run(browser, label, contextOpts) {
  const ctx = await browser.newContext(contextOpts);
  await ctx.addInitScript(() => {
    try { localStorage.setItem("udsp_welcomed_v1", "1"); } catch (e) {}
  });
  const rows = [];
  for (const file of ALL) {
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e.message)));
    const client = await page.context().newCDPSession(page);
    await client.send("Network.setCacheDisabled", { cacheDisabled: true });
    await client.send("Network.clearBrowserCache");
    try {
      await page.goto(BASE + file, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(300);
    } catch (e) {
      rows.push({ file, ok: false, note: "nav failed: " + e.message });
      await page.close();
      continue;
    }
    const info = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll(".footer-links a"))
        .map((a) => a.getAttribute("href"));
      const seo = document.querySelector(".seo-content");
      const robots = document.querySelector('meta[name="robots"]');
      // Visible text of the static prose block only -- EXCEPT on phones,
      // where wireSeoInfoModal() marks the block .is-collapsed and moves it
      // behind the header's 💡 button. The prose is still in the served
      // markup and one tap away there, so count textContent instead and
      // separately require that the trigger really exists (otherwise a
      // botched collapse would silently pass as "content present").
      const collapsed = !!(seo && seo.classList.contains("is-collapsed"));
      const text = seo ? (collapsed ? seo.textContent : seo.innerText) || "" : "";
      const words = text.trim().split(/\s+/).length;
      return {
        privacy: links.includes("privacy.html"),
        terms: links.includes("terms.html"),
        contact: links.includes("terms.html#contact"),
        footerLinkCount: links.length,
        seoWords: words,
        seoReachable: !collapsed || !!document.querySelector(".brand-actions .seo-info-btn"),
        h2: !!document.querySelector("main h2"),
        robots: robots ? robots.getAttribute("content") : "(none)",
        canonical: !!document.querySelector('link[rel="canonical"]'),
        desc: !!document.querySelector('meta[name="description"]'),
      };
    });
    const needsProse = CONTENT_PAGES.includes(file);
    const mustNoindex = NOINDEX_PAGES.includes(file);
    const realErrors = errors.filter((m) => !/ERR_|Failed to fetch|net::/i.test(m));
    const ok =
      info.privacy && info.terms && info.contact &&
      info.canonical && info.desc &&
      (!needsProse || (info.seoWords >= 120 && info.h2 && info.seoReachable)) &&
      (!mustNoindex || /noindex/.test(info.robots)) &&
      realErrors.length === 0;
    rows.push({ file, ok, ...info, errors: realErrors });
    await page.close();
  }
  await ctx.close();

  const bad = rows.filter((r) => !r.ok);
  console.log("\n=== " + label + " ===");
  for (const r of rows) {
    console.log(
      (r.ok ? "OK   " : "FAIL ") + r.file.padEnd(28) +
      " priv=" + (r.privacy ? "y" : "N") +
      " terms=" + (r.terms ? "y" : "N") +
      " contact=" + (r.contact ? "y" : "N") +
      " prose=" + String(r.seoWords).padStart(4) + "w" +
      " robots=" + (r.robots || "").replace(", max-image-preview:large", "") +
      (r.errors && r.errors.length ? " ERR:" + r.errors.join(" | ") : "") +
      (r.note ? " " + r.note : "")
    );
  }
  console.log(label + ": " + (rows.length - bad.length) + "/" + rows.length + " pass");
  return bad.length;
}

(async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  let bad = 0;
  bad += await run(browser, "desktop 1280x900", { viewport: { width: 1280, height: 900 } });
  bad += await run(browser, "mobile Pixel 7", devices["Pixel 7"]);
  await browser.close();
  console.log(bad === 0 ? "\nALL PAGES ADSENSE-READY" : "\n" + bad + " FAILURES");
  process.exit(bad === 0 ? 0 : 1);
})();
