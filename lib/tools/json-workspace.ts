export type JsonDifference = {
  path: string;
  kind: "added" | "removed" | "changed";
  before?: unknown;
  after?: unknown;
};

export type JsonDiagnostic = {
  category: "syntax" | "input";
  severity: "error";
  message: string;
  offset: number;
  endOffset: number;
  line: number;
  column: number;
};

export type JsonParseResult =
  | { ok: true; value: unknown; diagnostics: [] }
  | { ok: false; diagnostics: [JsonDiagnostic] };

class JsonSyntaxFailure extends Error {
  constructor(message: string, readonly offset: number) {
    super(message);
    this.name = "JsonSyntaxFailure";
  }
}

function locationAt(source: string, offset: number) {
  const safeOffset = Math.max(0, Math.min(offset, source.length));
  const before = source.slice(0, safeOffset);
  const newline = before.lastIndexOf("\n");
  return {
    offset: safeOffset,
    endOffset: Math.min(source.length, safeOffset + 1),
    line: (before.match(/\n/g) ?? []).length + 1,
    // JavaScript textarea selection offsets and columns both count UTF-16 code units.
    column: safeOffset - newline,
  };
}

/** Strict JSON syntax scanner with source offsets independent of engine-specific error text. */
export function diagnoseJson(source: string): JsonParseResult {
  if (source.trim().length === 0) {
    return {
      ok: false,
      diagnostics: [{
        category: "input",
        severity: "error",
        message: "The JSON document is empty. Enter a JSON value to validate it.",
        ...locationAt(source, 0),
      }],
    };
  }

  let index = 0;
  const fail = (message: string, offset = index): never => {
    throw new JsonSyntaxFailure(message, offset);
  };
  const whitespace = () => {
    while (index < source.length && (source[index] === " " || source[index] === "\t" || source[index] === "\r" || source[index] === "\n")) index++;
  };
  const expect = (character: string, message: string) => {
    if (source[index] !== character) fail(message);
    index++;
  };
  const parseString = (): string => {
    const start = index;
    expect('"', 'Expected a quoted JSON string.');
    while (index < source.length) {
      const code = source.charCodeAt(index);
      const character = source[index];
      if (character === '"') {
        index++;
        const token = source.slice(start, index);
        try { return JSON.parse(token) as string; }
        catch { fail("Invalid JSON string.", start); }
      }
      if (code < 0x20) fail("Unescaped control character in JSON string.", index);
      if (character === "\\") {
        index++;
        if (index >= source.length) fail("Incomplete escape sequence in JSON string.", index);
        const escape = source[index];
        if ('"\\/bfnrt'.includes(escape)) {
          index++;
          continue;
        }
        if (escape === "u") {
          index++;
          for (let digit = 0; digit < 4; digit++) {
            if (index >= source.length || !/[0-9a-fA-F]/.test(source[index])) fail("A Unicode escape must contain four hexadecimal digits.", index);
            index++;
          }
          continue;
        }
        fail("Invalid escape sequence in JSON string.", index);
      }
      index++;
    }
    fail("Unterminated JSON string.", source.length);
  };
  const parseNumber = () => {
    if (source[index] === "-") index++;
    if (index >= source.length) fail("Expected a digit after the minus sign.");
    if (source[index] === "0") {
      index++;
      if (/[0-9]/.test(source[index] ?? "")) fail("Leading zeroes are not allowed in JSON numbers.", index);
    } else if (/[1-9]/.test(source[index] ?? "")) {
      while (/[0-9]/.test(source[index] ?? "")) index++;
    } else {
      fail("Expected a JSON value (string, number, object, array, true, false, or null).");
    }
    if (source[index] === ".") {
      index++;
      if (!/[0-9]/.test(source[index] ?? "")) fail("Expected a digit after the decimal point.");
      while (/[0-9]/.test(source[index] ?? "")) index++;
    }
    if (source[index] === "e" || source[index] === "E") {
      index++;
      if (source[index] === "+" || source[index] === "-") index++;
      if (!/[0-9]/.test(source[index] ?? "")) fail("Expected a digit in the exponent.");
      while (/[0-9]/.test(source[index] ?? "")) index++;
    }
  };
  const parseValue = (depth: number): void => {
    if (depth > 512) fail("The JSON nesting depth exceeds the supported limit.");
    whitespace();
    const character = source[index];
    if (character === '"') { parseString(); return; }
    if (character === "{") {
      index++;
      whitespace();
      if (source[index] === "}") { index++; return; }
      while (index < source.length) {
        whitespace();
        if (source[index] !== '"') fail("Expected a quoted property name.");
        parseString();
        whitespace();
        expect(":", 'Expected ":" after the property name.');
        parseValue(depth + 1);
        whitespace();
        if (source[index] === "}") { index++; return; }
        expect(",", 'Expected "," or "}" after the object property.');
        whitespace();
        if (source[index] === "}") fail("Trailing commas are not allowed in JSON.");
      }
      fail("Unterminated JSON object.", source.length);
    }
    if (character === "[") {
      index++;
      whitespace();
      if (source[index] === "]") { index++; return; }
      while (index < source.length) {
        parseValue(depth + 1);
        whitespace();
        if (source[index] === "]") { index++; return; }
        expect(",", 'Expected "," or "]" after the array item.');
        whitespace();
        if (source[index] === "]") fail("Trailing commas are not allowed in JSON.");
      }
      fail("Unterminated JSON array.", source.length);
    }
    if (character === "t" || character === "f" || character === "n") {
      const literal = character === "t" ? "true" : character === "f" ? "false" : "null";
      for (let offset = 0; offset < literal.length; offset++) {
        if (source[index + offset] !== literal[offset]) fail(`Invalid JSON literal; expected ${literal}.`, index + offset);
      }
      index += literal.length;
      return;
    }
    if (character === "-" || /[0-9]/.test(character ?? "")) { parseNumber(); return; }
    if (character === undefined) fail("Expected a JSON value.", source.length);
    fail("Expected a JSON value (string, number, object, array, true, false, or null).");
  };

  try {
    parseValue(0);
    whitespace();
    if (index < source.length) fail("Unexpected content after the JSON value.");
    return { ok: true, value: JSON.parse(source) as unknown, diagnostics: [] };
  } catch (error) {
    const failure = error instanceof JsonSyntaxFailure
      ? error
      : new JsonSyntaxFailure("Invalid JSON syntax.", index);
    return {
      ok: false,
      diagnostics: [{
        category: "syntax",
        severity: "error",
        message: failure.message,
        ...locationAt(source, failure.offset),
      }],
    };
  }
}

export function sortJsonKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJsonKeys);
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record).sort((a, b) => a.localeCompare(b)).map((key) => [key, sortJsonKeys(record[key])]),
    );
  }
  return value;
}

function stableValue(value: unknown): unknown {
  return sortJsonKeys(value);
}

function childPath(path: string, key: string | number): string {
  if (typeof key === "number") return `${path}[${key}]`;
  return /^[A-Za-z_$][\w$]*$/.test(key)
    ? `${path}.${key}`
    : `${path}[${JSON.stringify(key)}]`;
}

export function compareJsonDocuments(leftText: string, rightText: string): JsonDifference[] {
  const left = JSON.parse(leftText) as unknown;
  const right = JSON.parse(rightText) as unknown;
  const differences: JsonDifference[] = [];
  function visit(a: unknown, b: unknown, path: string): void {
    if (JSON.stringify(stableValue(a)) === JSON.stringify(stableValue(b))) return;
    const ao = a !== null && typeof a === "object";
    const bo = b !== null && typeof b === "object";
    if (Array.isArray(a) && Array.isArray(b)) {
      for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const child = childPath(path, i);
        if (i >= a.length) differences.push({ path: child, kind: "added", after: b[i] });
        else if (i >= b.length) differences.push({ path: child, kind: "removed", before: a[i] });
        else visit(a[i], b[i], child);
      }
      return;
    }
    if (ao && bo && !Array.isArray(a) && !Array.isArray(b)) {
      const ar = a as Record<string, unknown>;
      const br = b as Record<string, unknown>;
      for (const key of [...new Set([...Object.keys(ar), ...Object.keys(br)])].sort()) {
        const child = childPath(path, key);
        if (!Object.prototype.hasOwnProperty.call(ar, key)) differences.push({ path: child, kind: "added", after: br[key] });
        else if (!Object.prototype.hasOwnProperty.call(br, key)) differences.push({ path: child, kind: "removed", before: ar[key] });
        else visit(ar[key], br[key], child);
      }
      return;
    }
    differences.push({ path, kind: "changed", before: a, after: b });
  }
  visit(left, right, "$");
  return differences;
}

export function escapeJsonStringContents(value: string): string {
  return JSON.stringify(value).slice(1, -1);
}

export function unescapeJsonStringContents(value: string): string {
  const parsed: unknown = JSON.parse(`"${value}"`);
  if (typeof parsed !== "string") throw new Error("The input is not valid escaped JSON string content.");
  return parsed;
}
