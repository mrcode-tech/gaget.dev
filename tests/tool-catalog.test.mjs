import test from "node:test";
import assert from "node:assert/strict";
import { imageToolSlugs, imageToolMeta } from "../lib/tools/image-tools.ts";
import { tools } from "../lib/tools/registry.ts";

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
  for (const keyword of ["trim", "split", "merge", "volume", "speed", "pitch", "metadata", "wav", "base64", "silence", "frequency", "recorder"]) {
    assert.ok(audioTools[0].keywords.includes(keyword), `Audio Editor search keywords should include ${keyword}`);
  }
});


test("Video category exposes one unified editor with searchable video capabilities", () => {
  const videoTools = tools.filter((tool) => tool.category === "Video");
  assert.equal(videoTools.length, 1, "video capabilities should be grouped under one Video Editor entry");
  assert.equal(videoTools[0].name, "Video Editor");
  assert.equal(videoTools[0].href, "/video/editor");
  for (const keyword of ["trim", "split", "merge", "crop", "watermark", "speed", "metadata", "frames", "thumbnail", "subtitles", "convert", "compress", "gif", "base64", "record"]) {
    assert.ok(videoTools[0].keywords.includes(keyword), `Video Editor search keywords should include ${keyword}`);
  }
});

test("Date & Time category routes directly to one unified editor", () => {
  const dateTimeTools = tools.filter((tool) => tool.category === "Date & Time");
  assert.equal(dateTimeTools.length, 1, "date/time capabilities should be grouped under one unified editor entry");
  assert.equal(dateTimeTools[0].name, "Date & Time Editor");
  assert.equal(dateTimeTools[0].href, "/datetime/editor");
  for (const keyword of ["date", "time", "calendar", "world clock", "time zone", "timestamp", "ics", "cron"]) {
    assert.ok(dateTimeTools[0].keywords.includes(keyword), `Date & Time Editor search keywords should include ${keyword}`);
  }
});


test("tool identity, availability, and workspace ownership are explicit and valid", () => {
  assert.equal(new Set(tools.map((tool) => tool.id)).size, tools.length, "tool IDs must be unique and stable");
  const categoryNames = new Set(categoryNamesForRegistry());
  for (const tool of tools) {
    assert.match(tool.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${tool.name} needs a stable kebab-case ID`);
    assert.ok(categoryNames.has(tool.category), `${tool.name} references an unknown category: ${tool.category}`);
    assert.ok(["available", "planned"].includes(tool.status), `${tool.name} needs an explicit availability status`);
    assert.ok(["workspace", "standalone"].includes(tool.kind), `${tool.name} needs an explicit tool kind`);
    if (tool.kind === "workspace") {
      assert.ok(tool.workspaceId, `${tool.name} must identify its workspace`);
      assert.equal(tool.href, ({ image: "/images/editor", audio: "/audio/editor", video: "/video/editor", "date-time": "/datetime/editor" })[tool.workspaceId], `${tool.name} must point to its canonical workspace route`);
    } else {
      assert.equal(tool.workspaceId, undefined, `${tool.name} must not claim a shared workspace`);
    }
  }
});

test("JSON Diff and Hash Generator remain planned until implementation is verified", () => {
  for (const id of ["json-diff", "hash-generator"]) {
    const tool = tools.find((candidate) => candidate.id === id);
    assert.ok(tool, `missing catalog entry: ${id}`);
    assert.equal(tool.status, "planned");
  }
});

test("JWT Decoder copy accurately limits its security claim", () => {
  const jwt = tools.find((tool) => tool.id === "jwt-decoder");
  assert.ok(jwt);
  assert.match(jwt.description, /inspect|decode/i);
  assert.doesNotMatch(jwt.description, /verify signature|authenticity verified/i);
});

function categoryNamesForRegistry() {
  return ["Images", "Audio", "Video", "Date & Time", "Generators", "JSON", "Encoding", "Text", "Security", "Web & API", "Data Formats", "SQL"];
}
