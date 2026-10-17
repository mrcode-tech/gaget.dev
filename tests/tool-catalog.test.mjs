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
