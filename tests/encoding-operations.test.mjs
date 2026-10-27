import test from "node:test";
import assert from "node:assert/strict";
import { transformEncoding, convertCharset, encodeByteRepresentation, decodeByteRepresentation } from "../lib/tools/encoding-operations.ts";

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

test("charset conversion uses explicit encodings and hex byte representation", () => {
  assert.equal(convertCharset("encode", "Hello", "utf-8"), "48656c6c6f");
  assert.equal(convertCharset("decode", "48656c6c6f", "utf-8"), "Hello");
  assert.equal(convertCharset("encode", "A", "utf-16le"), "4100");
  assert.equal(convertCharset("encode", "A", "utf-16be"), "0041");
  assert.equal(convertCharset("decode", "e9", "windows-1252"), "é");
  assert.throws(() => convertCharset("encode", "🙂", "windows-1252"), /cannot be represented/i);
  assert.throws(() => convertCharset("decode", "f", "utf-8"), /complete byte pairs/i);
});

test("Base58 uses the Bitcoin alphabet, preserves leading zero bytes, and rejects ambiguous characters",()=>{
  assert.equal(transformEncoding("base58","encode","Hello World"),"JxF12TrwUP45BMd");
  assert.equal(transformEncoding("base58","decode","JxF12TrwUP45BMd"),"Hello World");
  assert.throws(()=>transformEncoding("base58","decode","0OIl"),/Base58 alphabet/i);
});

test("byte encoders preserve raw file bytes and enforce bounded output",()=>{const bytes=Uint8Array.from([0,255,1]);assert.equal(encodeByteRepresentation("hex",bytes),"00ff01");assert.equal(encodeByteRepresentation("base64",bytes),"AP8B");assert.equal(encodeByteRepresentation("binary",bytes),"00000000 11111111 00000001");for(const mode of ["hex","base64","base64url","base32","binary","base58","base85","quoted-printable"])assert.deepEqual(Array.from(decodeByteRepresentation(mode,encodeByteRepresentation(mode,bytes))),Array.from(bytes));assert.throws(()=>encodeByteRepresentation("hex",new Uint8Array(2_000_001)),/2,000,000 bytes/i);});
test("byte decoders can return non-UTF-8 bytes without decoding loss",()=>{assert.deepEqual(Array.from(decodeByteRepresentation("hex","ff00")), [255,0]);assert.deepEqual(Array.from(decodeByteRepresentation("base64","/wA=")),[255,0]);assert.throws(()=>decodeByteRepresentation("binary","101"),/eight bits/i);});

test("Adobe ASCII85 uses explicit wrappers, zero shorthand, and partial groups",()=>{assert.equal(transformEncoding("base85","encode","Man " ),"<~9jqo^~>");assert.equal(transformEncoding("base85","decode","<~9jqo^~>"),"Man ");assert.equal(transformEncoding("base85","encode","\u0000\u0000\u0000\u0000"),"<~z~>");assert.equal(transformEncoding("base85","decode","<~z~>"),"\u0000\u0000\u0000\u0000");assert.equal(decodeByteRepresentation("base85",encodeByteRepresentation("base85",Uint8Array.from([0,1,2,3,255]))).join(","),"0,1,2,3,255");assert.throws(()=>transformEncoding("base85","decode","<~!~>"),/at least two/i);assert.throws(()=>transformEncoding("base85","decode","<~uuuuu~>"),/32-bit/i);assert.throws(()=>decodeByteRepresentation("base85","<~"+"z".repeat(500001)+"~>"),/2,000,000 bytes/i);});

test("Base32 and quoted-printable preserve arbitrary file bytes including invalid UTF-8 and line breaks",()=>{
 const bytes=Uint8Array.from([0,255,13,10,32,9,65]);
 for(const mode of ["base32","quoted-printable"]) assert.deepEqual(Array.from(decodeByteRepresentation(mode,encodeByteRepresentation(mode,bytes))),Array.from(bytes));
 assert.match(encodeByteRepresentation("quoted-printable",bytes),/=0D=0A/);
});
test("quoted-printable byte decoding is bounded and does not require UTF-8",()=>{
 assert.deepEqual(Array.from(decodeByteRepresentation("quoted-printable","=FF=00")),[255,0]);
 assert.throws(()=>decodeByteRepresentation("quoted-printable","=00".repeat(666668)),/2,000,000 bytes/i);
});
