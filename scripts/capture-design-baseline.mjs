import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.DESIGN_BASELINE_URL ?? "http://127.0.0.1:3000";
const outputRoot = process.env.DESIGN_BASELINE_OUTPUT ?? "artifacts/design-baseline";
const commit = (process.env.GITHUB_SHA ?? process.env.DESIGN_BASELINE_COMMIT ?? "local").slice(0, 12);
const routes = [
  { name: "home", path: "/" },
  { name: "tools", path: "/tools" },
  { name: "json-formatter", path: "/json/formatter" },
  { name: "url-encoder", path: "/encoding/url" },
  { name: "base64", path: "/encoding/base64" },
  { name: "jwt-decoder", path: "/security/jwt-decoder" },
  { name: "uuid-generator", path: "/generators/uuid" },
  { name: "photo-editor", path: "/images/editor" },
  { name: "audio-editor", path: "/audio/editor" },
  { name: "video-editor", path: "/video/editor" },
  { name: "date-time-editor", path: "/datetime/editor" },
];
const viewports = [
  { name: "mobile-390x844", width: 390, height: 844 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "desktop-1440x1000", width: 1440, height: 1000 },
];
const themes = ["light", "dark"];
const manifest = {
  generatedAt: new Date().toISOString(),
  commit,
  baseURL,
  browser: "Chromium (Playwright)",
  captures: [],
  failures: [],
};

const browser = await chromium.launch({ headless: true });
try {
  for (const route of routes) {
    for (const viewport of viewports) {
      for (const theme of themes) {
        const page = await browser.newPage({ viewport, colorScheme: theme });
        await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
        const url = new URL(route.path, baseURL).toString();
        const relative = path.join(commit, viewport.name, theme, `${route.name}.png`);
        const destination = path.join(outputRoot, relative);
        try {
          const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
          if (!response || !response.ok()) {
            throw new Error(`HTTP ${response?.status() ?? "no response"} for ${url}`);
          }
          await page.screenshot({ path: destination, fullPage: true, animations: "disabled" });
          manifest.captures.push({ route: route.path, viewport, theme, screenshot: relative, status: response.status() });
          process.stdout.write(`Captured ${route.path} | ${viewport.name} | ${theme}\n`);
        } catch (error) {
          manifest.failures.push({ route: route.path, viewport: viewport.name, theme, error: String(error) });
          process.stderr.write(`Capture failed ${route.path} | ${viewport.name} | ${theme}: ${String(error)}\n`);
        } finally {
          await page.close();
        }
      }
    }
  }
} finally {
  await browser.close();
}
await mkdir(outputRoot, { recursive: true });
await (await import("node:fs/promises")).writeFile(
  path.join(outputRoot, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
if (manifest.failures.length) {
  process.stderr.write(`${manifest.failures.length} screenshot capture(s) failed. See manifest.json.\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`Captured ${manifest.captures.length} screenshots for commit ${commit}.\n`);
}
