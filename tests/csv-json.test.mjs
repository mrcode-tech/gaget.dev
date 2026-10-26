import test from "node:test";
import assert from "node:assert/strict";
import { csvToJson, jsonToCsv } from "../lib/tools/csv-json.ts";

test("CSV to JSON supports quoted delimiters, quotes, and embedded newlines", () => {
  assert.equal(csvToJson('name,note\r\n"Ada, Lovelace","said ""hello"""\r\nGrace,"two\nlines"'), JSON.stringify([
    { name: "Ada, Lovelace", note: 'said "hello"' },
    { name: "Grace", note: "two\nlines" },
  ], null, 2));
});

test("CSV to JSON strips a BOM and preserves values as strings", () => {
  assert.equal(csvToJson('\uFEFFname,active,count\nAda,true,3'), '[\n  {\n    "name": "Ada",\n    "active": "true",\n    "count": "3"\n  }\n]');
});

test("CSV to JSON rejects malformed quoting, duplicate headers, and inconsistent rows", () => {
  assert.throws(() => csvToJson('name,note\n"Ada,broken'), /Unterminated/);
  assert.throws(() => csvToJson("name,name\nAda,Lovelace"), /unique/);
  assert.throws(() => csvToJson("name,city\nAda"), /expected 2/);
});

test("JSON to CSV quotes fields and preserves stable first-seen header order", () => {
  assert.equal(jsonToCsv(JSON.stringify([
    { name: "Ada, Lovelace", note: 'said "hello"', active: true },
    { name: "Grace", note: "two\nlines", count: 3 },
  ])), 'name,note,active,count\r\n"Ada, Lovelace","said ""hello""",true,\r\nGrace,"two\nlines",,3');
});

test("JSON to CSV rejects invalid shapes and nested values instead of silently losing data", () => {
  assert.throws(() => jsonToCsv("{bad json"), /JSON/);
  assert.throws(() => jsonToCsv('{"name":"Ada"}'), /array/);
  assert.throws(() => jsonToCsv('[1,2]'), /object/);
  assert.throws(() => jsonToCsv('[{"nested":{"x":1}}]'), /nested/);
  assert.equal(jsonToCsv("[]"), "");
});

test("empty CSV input converts to an empty JSON array", () => {
  assert.equal(csvToJson(""), "[]");
});
