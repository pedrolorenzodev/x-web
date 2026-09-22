import { chromium } from "playwright";

const [, , url, out = "shot.png", width = "1280", height = "900"] = process.argv;

if (!url) {
  console.error("usage: node scripts/screenshot.mjs <url> [out] [width] [height]");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Number(width), height: Number(height) },
  colorScheme: "dark",
  deviceScaleFactor: 2,
});

await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: out });
await browser.close();

console.log(out);
