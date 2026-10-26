import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import { digestBytes, encodeUtf8 } from "../lib/tools/hash.ts";

if (!globalThis.crypto?.subtle) Object.defineProperty(globalThis, "crypto", { value: webcrypto });

test("SHA-256 matches the standard empty-input test vector", async () => {
  assert.equal(await digestBytes(encodeUtf8(""), "SHA-256"), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
});

test("SHA-2 variants match published abc test vectors", async () => {
  assert.equal(await digestBytes(encodeUtf8("abc"), "SHA-256"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  assert.equal(await digestBytes(encodeUtf8("abc"), "SHA-384"), "cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7");
  assert.equal(await digestBytes(encodeUtf8("abc"), "SHA-512"), "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f");
});

test("SHA-256 handles UTF-8 non-ASCII text", async () => {
  assert.equal(await digestBytes(encodeUtf8("hello 👋"), "SHA-256"), "79ff342b993486d7b9af595dc484e1ab9fc7ff1b47b308334ff6dd663f846fde");
});

test("digest respects a byte view's offset and length", async () => {
  const source = new Uint8Array([0, 97, 98, 99, 0]);
  assert.equal(await digestBytes(source.subarray(1, 4), "SHA-256"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
});

test("rejects unsupported algorithms and non-byte input", async () => {
  await assert.rejects(() => digestBytes(encodeUtf8("abc"), "MD5"), /Unsupported/);
  await assert.rejects(() => digestBytes("abc", "SHA-256"), /bytes/);
});
