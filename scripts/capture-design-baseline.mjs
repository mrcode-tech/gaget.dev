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
const rtlRouteNames = new Set([
  "home",
  "tools",
  "photo-editor",
  "audio-editor",
  "video-editor",
  "date-time-editor",
]);
const viewports = [
  { name: "mobile-390x844", width: 390, height: 844 },
  { name: "mobile-short-390x640", width: 390, height: 640 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "desktop-1440x1000", width: 1440, height: 1000 },
];
const themes = ["light", "dark"];
const rtlViewports = new Set(["mobile-390x844", "desktop-1440x1000"]);
const locales = [
  { name: "en", prefix: "", browserLocale: "en-US", routes, viewports },
  {
    name: "fa",
    prefix: "/fa",
    browserLocale: "fa-IR",
    routes: routes.filter((route) => rtlRouteNames.has(route.name)),
    viewports: viewports.filter((viewport) => rtlViewports.has(viewport.name)),
  },
  {
    name: "ar",
    prefix: "/ar",
    browserLocale: "ar",
    routes: routes.filter((route) => rtlRouteNames.has(route.name)),
    viewports: viewports.filter((viewport) => rtlViewports.has(viewport.name)),
  },
];
const manifest = {
  generatedAt: new Date().toISOString(),
  commit,
  baseURL,
  browser: "Chromium (Playwright; version recorded after launch)",
  captures: [],
  failures: [],
};

const browser = await chromium.launch({ headless: true });
manifest.browser = `Chromium ${browser.version()} (Playwright)`;
try {
  for (const locale of locales) {
    for (const route of locale.routes) {
      for (const viewport of locale.viewports) {
        for (const theme of themes) {
          const page = await browser.newPage({
            viewport,
            colorScheme: theme,
            locale: locale.browserLocale,
          });
          await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
          const routePath = `${locale.prefix}${route.path}` || "/";
          const url = new URL(routePath, baseURL).toString();
          const relative = path.join(
            commit,
            ...(locale.name === "en" ? [] : [locale.name]),
            viewport.name,
            theme,
            `${route.name}.png`,
          );
          const destination = path.join(outputRoot, relative);
          try {
            const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
            if (!response || !response.ok()) {
              throw new Error(`HTTP ${response?.status() ?? "no response"} for ${url}`);
            }
            const expectedDirection = locale.name === "en" ? "ltr" : "rtl";
            const actualDirection = await page.locator("html").getAttribute("dir");
            if (actualDirection !== expectedDirection) {
              throw new Error(
                `Expected document direction ${expectedDirection}, received ${actualDirection} for ${url}`,
              );
            }
            const actualLanguage = await page.locator("html").getAttribute("lang");
            if (actualLanguage !== locale.name) {
              throw new Error(
                `Expected document language ${locale.name}, received ${actualLanguage} for ${url}`,
              );
            }
            await mkdir(path.dirname(destination), { recursive: true });
            await page.screenshot({ path: destination, fullPage: true, animations: "disabled" });
            manifest.captures.push({
              route: routePath,
              locale: locale.name,
              direction: locale.name === "en" ? "ltr" : "rtl",
              viewport: { name: viewport.name, width: viewport.width, height: viewport.height },
              theme,
              state: "initial-default",
              screenshot: relative,
              status: response.status(),
            });
            process.stdout.write(
              `Captured ${routePath} | ${viewport.name} | ${theme} | ${locale.name}\n`,
            );
          } catch (error) {
            manifest.failures.push({
              route: routePath,
              locale: locale.name,
              viewport: viewport.name,
              theme,
              error: String(error),
            });
            process.stderr.write(
              `Capture failed ${routePath} | ${viewport.name} | ${theme} | ${locale.name}: ${String(error)}\n`,
            );
          } finally {
            await page.close();
          }
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
