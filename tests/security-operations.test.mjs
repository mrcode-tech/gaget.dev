import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { computeHash, computeHashBytes, crc32Text, crc32Bytes } from "../lib/tools/security-operations.ts";
if (!globalThis.crypto) globalThis.crypto = webcrypto;

test("CRC32 uses the standard IEEE vector and is labelled as a checksum", () => {
  assert.equal(crc32Text("123456789"), "CBF43926");
  assert.equal(crc32Text(""), "00000000");
});
test("SHA-256 digest matches the known answer for empty input", async () => {
  assert.equal(await computeHash("", { mode: "digest", algorithm: "SHA-256" }), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
});
test("HMAC-SHA-256 matches a known-answer vector and requires a key", async () => {
  assert.equal(await computeHash("The quick brown fox jumps over the lazy dog", { mode: "hmac", algorithm: "SHA-256", key: "key" }), "f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8");
  await assert.rejects(() => computeHash("message", { mode: "hmac", algorithm: "SHA-256", key: "" }), /key/i);
});
test("hash operations enforce the text input safety limit", async () => {
  assert.throws(() => crc32Text("x".repeat(200_001)), /safety limit/i);
  await assert.rejects(() => computeHash("x".repeat(200_001), { mode: "digest", algorithm: "SHA-256" }), /safety limit/i);
});

test("file-byte digest and checksum vectors use raw bytes with strict size limits", async () => {
  const bytes = new TextEncoder().encode("abc");
  assert.equal(await computeHashBytes(bytes, { mode: "digest", algorithm: "SHA-256" }), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(crc32Bytes(new TextEncoder().encode("123456789")), "CBF43926");
  await assert.rejects(() => computeHashBytes(new Uint8Array(2_000_001), { mode: "crc32", algorithm: "SHA-256" }), /2,000,000 byte/i);
});
