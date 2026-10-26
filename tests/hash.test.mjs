import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { digestBytes, encodeUtf8 } from "../lib/tools/hash.ts";

if (!globalThis.crypto?.subtle) Object.defineProperty(globalThis, "crypto", { value: webcrypto });

test("SHA-256 matches the standard empty-input test vector", async () => {
  assert.equal(await digestBytes(encodeUtf8(""), "SHA-256"), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
});

test("SHA-256 handles UTF-8 non-ASCII text", async () => {
  assert.equal(await digestBytes(encodeUtf8("hello 👋"), "SHA-256"), "79ff342b993486d7b9af595dc484e1ab9fc7ff1b47b308334ff6dd663f846fde");
});

test("supports all advertised SHA-2 variants", async () => {
  assert.equal((await digestBytes(encodeUtf8("abc"), "SHA-256")).length, 64);
  assert.equal((await digestBytes(encodeUtf8("abc"), "SHA-384")).length, 96);
  assert.equal((await digestBytes(encodeUtf8("abc"), "SHA-512")).length, 128);
});

test("rejects unsupported algorithms and non-byte input", async () => {
  await assert.rejects(() => digestBytes(encodeUtf8("abc"), "MD5"), /Unsupported/);
  await assert.rejects(() => digestBytes("abc", "SHA-256"), /bytes/);
});
