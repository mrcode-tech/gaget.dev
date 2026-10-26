import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.DESIGN_BASELINE_URL ?? "http://127.0.0.1:3000";
const outputRoot = process.env.DESIGN_BASELINE_OUTPUT ?? "artifacts/design-baseline";
const commit = (process.env.CI_TESTED_COMMIT ?? process.env.DESIGN_BASELINE_COMMIT ?? process.env.GITHUB_SHA ?? "local").trim();
const commitSlug = commit.slice(0, 12);
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
  "json-formatter",
]);
const viewports = [
  { name: "mobile-390x844", width: 390, height: 844 },
  { name: "mobile-short-390x640", width: 390, height: 640 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "desktop-1440x900", width: 1440, height: 900 },
];
const jsonViewports = [
  { name: "mobile-320x568", width: 320, height: 568 },
  { name: "mobile-390x844", width: 390, height: 844 },
  { name: "mobile-430x932", width: 430, height: 932 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "desktop-1280x800", width: 1280, height: 800 },
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "wide-1920x1080", width: 1920, height: 1080 },
  { name: "short-1280x600", width: 1280, height: 600 },
];
const themes = ["light", "dark"];
const rtlViewports = new Set(["mobile-390x844", "desktop-1440x900"]);
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
  branch: process.env.CI_TESTED_BRANCH ?? process.env.GITHUB_REF_NAME ?? "local",
  runUrl: process.env.GITHUB_RUN_ID && process.env.GITHUB_REPOSITORY
    ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : null,
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
            commitSlug,
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
            if (route.name === "date-time-editor") {
              const workspaceDirection = await page.locator("main").first().getAttribute("dir");
              if (workspaceDirection !== expectedDirection) {
                throw new Error(
                  `Expected Date & Time workspace direction ${expectedDirection}, received ${workspaceDirection} for ${url}`,
                );
              }
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

  // Capture JSON-specific states explicitly for the exact evaluated build.
  const jsonStates = [
    { name: "empty", route: "/json/formatter", run: async (page) => {
      await page.getByRole("textbox", { name: "Input JSON" }).fill("");
    } },
    { name: "valid", route: "/json/formatter", run: async (page) => {
      await page.getByRole("textbox", { name: "Input JSON" }).fill('{"state":"valid","items":[1,2]}');
      await page.getByRole("button", { name: "Run operation" }).click();
      await page.getByLabel("Output").waitFor({ state: "visible" });
    } },
    { name: "invalid-diagnostics", route: "/json/formatter", run: async (page) => {
      await page.getByRole("textbox", { name: "Input JSON" }).fill('{\n  "broken": }');
      await page.getByRole("button", { name: (page.viewportSize()?.width ?? 1024) < 768 ? "Feature" : "Utilities" }).click();
      await page.getByRole("menuitemradio", { name: /Validate/ }).click();
      await page.getByRole("button", { name: "Run operation" }).click();
      await page.getByRole("button", { name: /Go to line 2/ }).waitFor({ state: "visible" });
    } },
    { name: "comparison", route: "/json/diff", run: async (page) => {
      await page.getByRole("textbox", { name: "JSON A input" }).fill('{"version":1}');
      await page.getByRole("textbox", { name: "JSON B input" }).fill('{"version":2,"ready":true}');
      await page.getByRole("button", { name: "Run operation" }).click();
      await page.getByText("$.version").waitFor({ state: "visible" });
    } },
    { name: "file-menu", route: "/json/formatter", run: async (page) => {
      {
      {
        await page.getByRole("button", { name: "File" }).click();
        await page.getByTestId("json-file-menu").waitFor({ state: "visible" });
      }
    } },
    { name: "features-menu", route: "/json/formatter", run: async (page) => {
      await page.getByRole("button", { name: "Feature" }).click();
      await page.getByTestId("json-features-menu").waitFor({ state: "visible" });
    } },
  ];
  for (const viewport of jsonViewports) {
    for (const state of jsonStates) {
      const page = await browser.newPage({ viewport, colorScheme: "light", locale: "en-US" });
      await page.addInitScript(() => localStorage.setItem("theme", "light"));
      const url = new URL(state.route, baseURL).toString();
      const evidenceState = state.name === "file-menu" && viewport.width < 768 ? "mobile-file-menu" : state.name;
      const relative = path.join(commitSlug, "json-states", viewport.name, evidenceState + ".png");
      const destination = path.join(outputRoot, relative);
      try {
        const response = await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
        if (!response || !response.ok()) throw new Error("HTTP " + (response?.status() ?? "no response") + " for " + url);
        await state.run(page);
        await mkdir(path.dirname(destination), { recursive: true });
        await page.screenshot({ path: destination, fullPage: true, animations: "disabled" });
        manifest.captures.push({
          route: state.route,
          locale: "en",
          direction: "ltr",
          viewport: { name: viewport.name, width: viewport.width, height: viewport.height },
          theme: "light",
          state: evidenceState,
          screenshot: relative,
          status: response.status(),
        });
        process.stdout.write("Captured " + state.route + " | " + viewport.name + " | light | en | " + state.name + "\n");
      } catch (error) {
        manifest.failures.push({ route: state.route, locale: "en", viewport: viewport.name, theme: "light", state: evidenceState, error: String(error) });
        process.stderr.write("Capture failed " + state.route + " | " + viewport.name + " | light | en | " + evidenceState + ": " + String(error) + "\n");
      } finally {
        await page.close();
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
