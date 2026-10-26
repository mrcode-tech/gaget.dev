import test from "node:test";
import assert from "node:assert/strict";
import { imageToolSlugs, imageToolMeta } from "../lib/tools/image-tools.ts";
import { categories, developerToolCategories, developerTools, tools } from "../lib/tools/registry.ts";

test("image tool slugs are unique and every slug has metadata", () => {
  assert.equal(new Set(imageToolSlugs).size, imageToolSlugs.length, "image slugs must be unique");
  for (const slug of imageToolSlugs) {
    assert.ok(imageToolMeta[slug], `missing metadata for image tool: ${slug}`);
    assert.ok(imageToolMeta[slug].title.trim(), `missing title for image tool: ${slug}`);
    assert.ok(imageToolMeta[slug].description.trim(), `missing description for image tool: ${slug}`);
  }
});

test("tool registry has unique names and routes", () => {
  assert.ok(tools.length > 0, "tool registry should not be empty");
  assert.equal(new Set(tools.map((tool) => tool.name)).size, tools.length, "tool names must be unique");
  assert.equal(new Set(tools.map((tool) => tool.href)).size, tools.length, "tool routes must be unique");
  for (const tool of tools) {
    assert.ok(tool.href.startsWith("/"), `${tool.name} route must be an internal absolute path`);
    assert.ok(tool.description.trim(), `${tool.name} needs a description`);
    assert.ok(tool.category.trim(), `${tool.name} needs a category`);
    assert.ok(Array.isArray(tool.keywords), `${tool.name} needs a keyword list`);
  }
});

test("category registry has unique names and slugs, and every tool belongs to a registered category", () => {
  assert.ok(categories.length > 0, "category registry should not be empty");
  assert.equal(new Set(categories.map((category) => category.name)).size, categories.length, "category names must be unique");
  assert.equal(new Set(categories.map((category) => category.slug)).size, categories.length, "category slugs must be unique");
  const categoryNames = new Set(categories.map((category) => category.name));
  for (const category of categories) {
    assert.ok(category.slug.trim(), `${category.name} needs a slug`);
    assert.ok(category.href.startsWith("/"), `${category.name} needs an internal absolute route`);
  }
  for (const tool of tools) assert.ok(categoryNames.has(tool.category), `${tool.name} references an unknown category: ${tool.category}`);
});

test("Dev Tools registry excludes independent media and date/time workspaces", () => {
  assert.ok(developerTools.length > 0);
  assert.ok(developerTools.some((tool) => tool.id === "json-workspace"));
  for (const tool of developerTools) {
    assert.ok(tool.kind === "standalone" || tool.workspaceId === "json", `${tool.name} must be a developer utility`);
    assert.ok(!["image", "audio", "video", "date-time"].includes(tool.workspaceId), `${tool.name} must not leak into Dev Tools`);
  }
  for (const excludedCategory of ["Images", "Audio", "Video", "Date & Time"]) {
    assert.ok(!developerToolCategories.some((category) => category.name === excludedCategory), `${excludedCategory} must not be a Dev Tools category`);
  }
  for (const expected of ["JSON", "Security", "Encoding", "Generators"]) {
    assert.ok(developerToolCategories.some((category) => category.name === expected), `missing ${expected} developer category`);
  }
  assert.equal(new Set(developerTools.map((tool) => tool.id)).size, developerTools.length);
  for (const category of developerToolCategories) assert.ok(developerTools.some((tool) => tool.category === category.name), `${category.name} must not be empty`);
});

test("the Images category promotes the unified Photo Editor instead of duplicate image apps", () => {
  const imageTools = tools.filter((tool) => tool.category === "Images");
  assert.equal(imageTools.length, 1, "all image editing capabilities should converge on one Photo Editor entry");
  assert.equal(imageTools[0].name, "Photo Editor");
  assert.equal(imageTools[0].href, "/images/editor");
});

test("Audio category exposes one unified editor with searchable capability keywords", () => {
  const audioTools = tools.filter((tool) => tool.category === "Audio");
  assert.equal(audioTools.length, 1, "audio capabilities should be grouped under one Audio Editor entry");
  assert.equal(audioTools[0].name, "Audio Editor");
  assert.equal(audioTools[0].href, "/audio/editor");
  for (const keyword of ["trim", "split", "merge", "volume", "speed", "pitch", "metadata", "wav", "base64", "silence", "frequency", "recorder"]) assert.ok(audioTools[0].keywords.includes(keyword), `Audio Editor search keywords should include ${keyword}`);
});

test("Video category exposes one unified editor with searchable video capabilities", () => {
  const videoTools = tools.filter((tool) => tool.category === "Video");
  assert.equal(videoTools.length, 1, "video capabilities should be grouped under one Video Editor entry");
  assert.equal(videoTools[0].name, "Video Editor");
  assert.equal(videoTools[0].href, "/video/editor");
  for (const keyword of ["trim", "split", "merge", "crop", "watermark", "speed", "metadata", "frames", "thumbnail", "subtitles", "convert", "compress", "gif", "base64", "record"]) assert.ok(videoTools[0].keywords.includes(keyword), `Video Editor search keywords should include ${keyword}`);
});

test("Date & Time category routes directly to one unified editor", () => {
  const dateTimeTools = tools.filter((tool) => tool.category === "Date & Time");
  assert.equal(dateTimeTools.length, 1, "date/time capabilities should be grouped under one unified editor entry");
  assert.equal(dateTimeTools[0].name, "Date & Time Editor");
  assert.equal(dateTimeTools[0].href, "/datetime/editor");
  for (const keyword of ["date", "time", "calendar", "world clock", "time zone", "timestamp", "ics", "cron"]) assert.ok(dateTimeTools[0].keywords.includes(keyword), `Date & Time Editor search keywords should include ${keyword}`);
});

test("tool identity, availability, and workspace ownership are explicit and valid", () => {
  assert.equal(new Set(tools.map((tool) => tool.id)).size, tools.length, "tool IDs must be unique and stable");
  for (const tool of tools) {
    assert.match(tool.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${tool.name} needs a stable kebab-case ID`);
    assert.ok(["available", "planned"].includes(tool.status), `${tool.name} needs an explicit availability status`);
    assert.ok(["workspace", "standalone"].includes(tool.kind), `${tool.name} needs an explicit tool kind`);
    if (tool.kind === "workspace") {
      assert.ok(tool.workspaceId, `${tool.name} must identify its workspace`);
      assert.equal(tool.href, ({ image: "/images/editor", audio: "/audio/editor", video: "/video/editor", "date-time": "/datetime/editor", json: "/json/formatter" })[tool.workspaceId], `${tool.name} must point to its canonical workspace route`);
    } else assert.equal(tool.workspaceId, undefined, `${tool.name} must not claim a shared workspace`);
  }
});

test("JSON operations are consolidated into one available workspace and hash generator is available", () => {
  const json = tools.filter((tool) => tool.category === "JSON");
  assert.equal(json.length, 1);
  assert.equal(json[0].id, "json-workspace");
  assert.equal(json[0].kind, "workspace");
  assert.equal(json[0].workspaceId, "json");
  assert.equal(json[0].href, "/json/formatter");
  for (const operation of ["format", "minify", "validate", "compare"]) assert.ok(json[0].keywords.includes(operation));
  const hash = tools.find((candidate) => candidate.id === "hash-generator");
  assert.ok(hash);
  assert.equal(hash.status, "available");
  assert.equal(hash.href, "/security/hash");
  assert.ok(hash.keywords.includes("sha-256"));
  const regex = tools.find((candidate) => candidate.id === "regex-tester");
  assert.ok(regex);
  assert.equal(regex.status, "available");
  assert.equal(regex.href, "/text/regex");
  assert.match(regex.description, /isolated browser worker/i);
  const csv = tools.find((candidate) => candidate.id === "csv-json-converter");
  assert.ok(csv);
  assert.equal(csv.status, "available");
  assert.equal(csv.href, "/data/csv-json");
});

test("JWT Decoder copy accurately limits its security claim", () => {
  const jwt = tools.find((tool) => tool.id === "jwt-decoder");
  assert.ok(jwt);
  assert.match(jwt.description, /inspect|decode/i);
  assert.doesNotMatch(jwt.description, /verify signature|authenticity verified/i);
});

test("JSON comparison ignores object key order and reports structural changes", async () => {
  const { compareJsonDocuments } = await import("../lib/tools/json-workspace.ts");
  assert.deepEqual(compareJsonDocuments('{"a":1,"b":{"x":true}}', '{"b":{"x":true},"a":1}'), []);
  const changes = compareJsonDocuments('{"name":"GaGet","version":1,"old":true,"items":[1,2,3]}', '{"name":"GaGet","version":2,"new":"yes","items":[1,4]}');
  assert.deepEqual(changes.map(({path,kind}) => [path,kind]), [["$.items[1]","changed"],["$.items[2]","removed"],["$.new","added"],["$.old","removed"],["$.version","changed"]]);
  assert.throws(() => compareJsonDocuments('{"valid":true}', "{bad json"));
});
