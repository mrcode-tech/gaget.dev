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
  "/generators/uuid",
  "/images/editor",
  "/audio/editor",
  "/video/editor",
  "/datetime/editor",
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


const legacyAudioRoutes = [
  ["converter", "converter"],
  ["compressor", "compressor"],
  ["volume", "volume"],
  ["trimmer", "trimmer"],
  ["merger", "merger"],
  ["splitter", "splitter"],
  ["speed", "speed"],
  ["pitch", "pitch"],
  ["metadata", "metadata"],
  ["metadata-editor", "metadata-editor"],
  ["to-wav", "to-wav"],
  ["base64", "base64"],
  ["base64-to-audio", "base64-to-audio"],
  ["silence-detector", "silence-detector"],
  ["waveform", "waveform"],
  ["frequency", "frequency"],
  ["recorder", "recorder"],
];

for (const [route, feature] of legacyAudioRoutes) {
  test(`legacy audio route redirects to the unified editor: /audio/${route}`, async () => {
    const response = await fetch(new URL(`/audio/${route}`, baseUrl), { redirect: "manual" });
    assert.equal(response.status, 307, `/audio/${route} should redirect to the unified editor`);
    const destination = new URL(response.headers.get("location"), baseUrl);
    assert.equal(destination.pathname, "/audio/editor");
    assert.equal(destination.searchParams.get("feature"), feature);
  });
}

const rtlRoutes = [
  "/fa/",
  "/ar/",
  "/fa/tools",
  "/ar/tools",
  "/fa/images/editor",
  "/ar/images/editor",
  "/fa/audio/editor",
  "/ar/audio/editor",
  "/fa/video/editor",
  "/ar/video/editor",
  "/fa/datetime/editor",
  "/ar/datetime/editor",
];

for (const route of rtlRoutes) {
  test(`RTL route responds with RTL document direction: ${route}`, async () => {
    const response = await fetch(new URL(route, baseUrl), { redirect: "manual" });
    assert.equal(response.status, 200, `${route} should render successfully`);
    const body = await response.text();
    assert.match(body, /\bdir="rtl"/, `${route} should render an RTL document`);
  });
}

