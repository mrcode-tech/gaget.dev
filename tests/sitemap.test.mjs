import test from "node:test";
import assert from "node:assert/strict";
import { createSitemapEntries } from "../lib/seo/sitemap.ts";

const categories = [
  { name: "Images", slug: "images", href: "/images/editor" },
  { name: "Date & Time", slug: "date-time", href: "/categories/date-time" },
  { name: "JSON", slug: "json-data", href: "/categories/json-data" },
  { name: "Security", slug: "security", href: "/categories/security" },
  { name: "Empty", slug: "empty", href: "/categories/empty" },
];
const tools = [
  { href: "/images/editor", category: "Images", kind: "workspace", workspaceId: "image", status: "available" },
  { href: "/datetime/editor", category: "Date & Time", kind: "workspace", workspaceId: "date-time", status: "available" },
  { href: "/json/formatter", category: "JSON", kind: "workspace", workspaceId: "json", status: "available" },
  { href: "/security/hash", category: "Security", kind: "standalone", status: "available" },
  { href: "/security/future", category: "Security", kind: "standalone", status: "planned" },
];

test("sitemap contains canonical public pages, published tools, and non-empty categories", () => {
  const entries = createSitemapEntries({
    baseUrl: "https://gaget.dev/",
    categories,
    tools,
    dateTimeFeatureSlugs: ["world-clock", "calendar"],
  });
  const urls = entries.map(({ url }) => url);

  for (const path of [
    "/",
    "/tools",
    "/mcp",
    "/images/editor",
    "/audio/editor",
    "/video/editor",
    "/datetime/editor",
    "/categories/json-data",
    "/categories/security",
    "/json/formatter",
    "/security/hash",
    "/datetime/editor?feature=world-clock",
    "/datetime/editor?feature=calendar",
  ]) {
    assert.ok(urls.includes("https://gaget.dev" + path), `missing canonical URL: ${path}`);
  }
  assert.equal(new Set(urls).size, urls.length, "sitemap URLs must be unique");
});

test("sitemap excludes redirects, planned tools, empty categories, and non-canonical aliases", () => {
  const entries = createSitemapEntries({
    baseUrl: "https://gaget.dev",
    categories,
    tools,
    dateTimeFeatureSlugs: ["world-clock"],
  });
  const urls = entries.map(({ url }) => url).join("\n");

  for (const excluded of [
    "/categories/images",
    "/categories/date-time",
    "/categories/empty",
    "/security/future",
    "/encoding/base64",
    "/generators/uuid",
    "/json/diff",
    "/api/",
    "/ci/",
  ]) {
    assert.ok(!urls.includes(excluded), `unexpected non-canonical URL: ${excluded}`);
  }
});

test("sitemap uses stable URL metadata and does not fabricate modification dates", () => {
  const entries = createSitemapEntries({
    baseUrl: "https://gaget.dev///",
    categories,
    tools,
    dateTimeFeatureSlugs: [],
  });
  assert.ok(entries.every((entry) => entry.url.startsWith("https://gaget.dev/")));
  assert.ok(entries.every((entry) => entry.lastModified === undefined));
  assert.ok(entries.every((entry) => entry.priority >= 0 && entry.priority <= 1));
});
