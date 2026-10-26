import test from "node:test";
import assert from "node:assert/strict";
import { findRegexMatches, validateRegexInput } from "../lib/tools/regex.ts";

test("regex matcher returns offsets, full matches, and capture groups", () => {
  assert.deepEqual(findRegexMatches("(\\w+):(\\d+)", "i", "port:8080"), [
    { index: 0, match: "port:8080", captures: ["port", "8080"] },
  ]);
});

test("regex matcher returns all matches even when global flag was omitted", () => {
  assert.deepEqual(findRegexMatches("\\d+", "", "a1 b22 c333").map((item) => [item.index, item.match]), [
    [1, "1"], [4, "22"], [8, "333"],
  ]);
});

test("zero-width matches advance safely through Unicode input", () => {
  assert.deepEqual(findRegexMatches("(?=.)", "u", "A😀B").map((item) => item.index), [0, 1, 3]);
});

test("invalid patterns and flags are rejected", () => {
  assert.throws(() => validateRegexInput("[", "", "text"), SyntaxError);
  assert.throws(() => validateRegexInput("x", "ii", "text"), /repeated/);
  assert.throws(() => validateRegexInput("x", "z", "text"), /Unsupported/);
  assert.throws(() => validateRegexInput("x", "uv", "text"), /cannot be used together/);
});

test("pattern and input size limits are enforced", () => {
  assert.throws(() => validateRegexInput("x".repeat(2001), "", ""), /too long/);
  assert.throws(() => validateRegexInput("x", "", "a".repeat(256 * 1024 + 1)), /too large/);
});

test("match count is bounded", () => {
  assert.throws(() => findRegexMatches(".", "g", "a".repeat(1001)), /1,000 matches/);
});
