import test from "node:test";
import assert from "node:assert/strict";
import { transformText } from "../lib/tools/text-operations.ts";
test("regex matching reports indexes and captures and safely advances zero-width matches", () => {
  const result = JSON.parse(transformText("regex-test", "aba", { pattern: "(?=(a))", flags: "g" }));
  assert.equal(result.count, 2); assert.deepEqual(result.matches.map((match) => match.index), [0, 2]); assert.deepEqual(result.matches[0].captures, ["a"]);
  assert.throws(() => transformText("regex-test", "abc", { pattern: "[" }), /regular expression/i);
});
test("regex replacement returns a preview and count without mutating input", () => {
  const input = "cat dog cat", result = JSON.parse(transformText("regex-replace", input, { pattern: "cat", flags: "g", replacement: "fox" }));
  assert.equal(result.matchCount, 2); assert.equal(result.result, "fox dog fox"); assert.equal(input, "cat dog cat");
});
test("literal find and replace handles special regex characters", () => {
  const result = JSON.parse(transformText("find-replace", "a.b a.b", { pattern: "a.b", replacement: "x" }));
  assert.equal(result.matchCount, 2); assert.equal(result.result, "x x"); assert.throws(() => transformText("find-replace", "abc", { pattern: "" }), /text to find/i);
});
test("split/join, trim, sort/dedupe and case operations have stable behavior", () => {
  assert.equal(transformText("split-join", "a,b,,c", { delimiter: "," }), "a\nb\n\nc");
  assert.throws(() => transformText("split-join", "abc", { delimiter: "" }), /cannot be empty/i);
  assert.equal(transformText("trim", "  hello \n", { trimMode: "both" }), "hello");
  assert.equal(transformText("sort-dedupe", "b\na\nb\n", {}), "\na\nb");
  assert.equal(transformText("case", "hello world", { caseMode: "title" }), "Hello World");
});
test("Unicode normalization, escaping and text statistics are explicit", () => {
  assert.equal(transformText("normalize", "e\u0301", { normalizeForm: "NFC" }), "\u00e9");
  assert.equal(transformText("escape", "<a&b>", { escapeMode: "html" }), "&lt;a&amp;b&gt;");
  assert.equal(transformText("escape", 'a"b', { escapeMode: "json" }), 'a\\"b');
  assert.deepEqual(JSON.parse(transformText("statistics", "hi 👋\nthere")), { codePoints: 10, words: 3, lines: 2, utf8Bytes: 13 });
});
test("line diff reports additions/removals and bounds the comparison matrix", () => {
  assert.equal(transformText("diff", "a\nb", { secondInput: "a\nc" }), "  a\n- b\n+ c");
  assert.throws(() => transformText("diff", "a\n".repeat(501), { secondInput: "" }), /500 lines/i);
});
test("text transformations enforce the input safety limit", () => { assert.throws(() => transformText("trim", "x".repeat(200_001)), /safety limit/i); });
