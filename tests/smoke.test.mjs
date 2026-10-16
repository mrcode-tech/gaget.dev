import test from "node:test";
import assert from "node:assert/strict";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";
const routes = [
  "/",
  "/tools",
  "/json/formatter",
  "/encoding/url",
  "/encoding/base64",
  "/security/jwt-decoder",
  "/images/editor",
  "/images/collage",
  "/audio/editor",
  "/datetime/world-clock",
  "/robots.txt",
  "/sitemap.xml",
];

for (const route of routes) {
  test(`production route responds successfully: ${route}`, async () => {
    const response = await fetch(new URL(route, baseUrl), { redirect: "manual" });
    assert.ok(
      response.status >= 200 && response.status < 400,
      `${route} returned HTTP ${response.status}`,
    );
    if (route.endsWith(".xml") || route.endsWith(".txt")) return;
    const body = await response.text();
    assert.ok(body.length > 0, `${route} returned an empty response`);
  });
}


const retiredImageRoutes = [
  "/images/collage",
  "/images/metadata",
  "/images/palette",
  "/images/color-picker",
  "/images/base64",
  "/images/base64-to-image",
  "/images/favicon",
  "/images/svg-optimizer",
  "/images/dimensions",
  "/images/print-size",
];

for (const route of retiredImageRoutes) {
  test(`legacy image route permanently redirects to the unified editor: ${route}`, async () => {
    const response = await fetch(new URL(route, baseUrl), { redirect: "manual" });
    assert.equal(response.status, 308, `${route} should return a permanent redirect`);
    assert.equal(new URL(response.headers.get("location"), baseUrl).pathname, "/images/editor");
  });
}
