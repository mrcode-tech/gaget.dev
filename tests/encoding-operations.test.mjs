import test from "node:test";
import assert from "node:assert/strict";
import { transformEncoding } from "../lib/tools/encoding-operations.ts";

test("URL component encoding handles reserved characters and malformed escapes", () => {
  assert.equal(transformEncoding("url","encode","a b&c"),"a%20b%26c");
  assert.equal(transformEncoding("url","decode","a%20b%26c"),"a b&c");
  assert.throws(()=>transformEncoding("url","decode","%QZ"),/percent-encoded/i);
});
test("Base64 and Base64url round-trip Unicode text with distinct padding rules", () => {
  assert.equal(transformEncoding("base64","encode","Hello"),"SGVsbG8=");
  assert.equal(transformEncoding("base64url","encode","Hello"),"SGVsbG8");
  assert.equal(transformEncoding("base64url","decode","SGVsbG8"),"Hello");
  assert.equal(transformEncoding("base64","decode","8J+Riw=="),"👋");
  assert.throws(()=>transformEncoding("base64","decode","%%%"),/base64/i);
});
test("Base32 follows RFC 4648 known vectors", () => {
  assert.equal(transformEncoding("base32","encode","foo"),"MZXW6===");
  assert.equal(transformEncoding("base32","decode","MZXW6==="),"foo");
  assert.throws(()=>transformEncoding("base32","decode","MZ!"),/Base32/i);
});
test("hex and binary encode UTF-8 bytes and reject malformed groups", () => {
  assert.equal(transformEncoding("hex","encode","Hi"),"4869");
  assert.equal(transformEncoding("hex","decode","48 69"),"Hi");
  assert.equal(transformEncoding("binary","encode","A"),"01000001");
  assert.equal(transformEncoding("binary","decode","01000001"),"A");
  assert.throws(()=>transformEncoding("hex","decode","abc"),/complete byte pairs/i);
  assert.throws(()=>transformEncoding("binary","decode","010"),/eight bits/i);
});
test("HTML entities are decoded as text and Unicode escapes round-trip supplementary code points", () => {
  assert.equal(transformEncoding("html-entities","encode",'<>&"'),"&lt;&gt;&amp;&quot;");
  assert.equal(transformEncoding("html-entities","decode","&lt;&amp;&#x1F44B;"),"<&👋");
  assert.equal(transformEncoding("unicode-escapes","decode",transformEncoding("unicode-escapes","encode","Hi 👋")),"Hi 👋");
  assert.throws(()=>transformEncoding("unicode-escapes","decode","\\u{110000}"),/scalar value/i);
});
test("quoted-printable encodes UTF-8 bytes, escapes trailing whitespace and round-trips line breaks", () => {
  assert.equal(transformEncoding("quoted-printable", "encode", "Hello world!"), "Hello world!");
  const encoded = transformEncoding("quoted-printable", "encode", "Hello \n👋");
  assert.equal(encoded, "Hello=20\r\n=F0=9F=91=8B");
  assert.equal(transformEncoding("quoted-printable", "decode", encoded), "Hello \n👋");
  assert.equal(transformEncoding("quoted-printable", "decode", "A=3DB=21"), "A=B!");
  assert.throws(() => transformEncoding("quoted-printable", "decode", "bad=QZ"), /quoted-printable escape/i);
  assert.throws(() => transformEncoding("quoted-printable", "decode", "=FF"), /valid UTF-8/i);
});
test("quoted-printable wraps long lines within MIME line limits", () => {
  const encoded = transformEncoding("quoted-printable", "encode", "a".repeat(200));
  assert.ok(encoded.split("\r\n").every(line => line.length <= 76));
  assert.equal(transformEncoding("quoted-printable", "decode", encoded), "a".repeat(200));
});
test("encoding operations enforce the input size limit", () => {
  assert.throws(()=>transformEncoding("hex","encode","x".repeat(1_000_001)),/safety limit/i);
});
