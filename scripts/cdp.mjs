import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const CDP = "http://127.0.0.1:9222";
const [, , cmd, ...rest] = process.argv;

const browser = await chromium.connectOverCDP(CDP);
const context = browser.contexts()[0];
const pages = context.pages();
const page = pages.find((p) => p.url().includes("x.com")) ?? pages[0];

try {
  if (cmd === "goto") {
    await page.goto(rest[0], { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2500);
    console.log(page.url());
  } else if (cmd === "eval") {
    const result = await page.evaluate(readFileSync(rest[0], "utf8"));
    console.log(JSON.stringify(result, null, 2));
  } else if (cmd === "shot") {
    const [selector, out] = rest;
    const target = selector === "page" ? page : page.locator(selector).first();
    await target.screenshot({ path: out });
    console.log(out);
  } else if (cmd === "url") {
    console.log(page.url());
  } else {
    console.error("cmd: goto <url> | eval <file.js> | shot <selector|page> <out.png> | url");
  }
} finally {
  browser.close();
}
