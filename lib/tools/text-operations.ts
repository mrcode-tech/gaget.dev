export type TextOperation = "regex-test" | "regex-replace" | "find-replace" | "split-join" | "trim" | "sort-dedupe" | "case" | "normalize" | "escape" | "statistics" | "diff";
export type TextOperationOptions = { pattern?: string; flags?: string; replacement?: string; delimiter?: string; caseMode?: "upper" | "lower" | "title"; normalizeForm?: "NFC" | "NFD" | "NFKC" | "NFKD"; trimMode?: "both" | "start" | "end"; escapeMode?: "html" | "json"; secondInput?: string; regexFind?: boolean };
export const MAX_TEXT_TRANSFORM_LENGTH = 200_000;
const MAX_REGEX_INPUT_LENGTH = 50_000;
const MAX_MATCHES = 500;
function guard(value: string, label = "Input"): void { if (value.length > MAX_TEXT_TRANSFORM_LENGTH) throw new Error(label + " exceeds the 200,000 character safety limit."); }
function regexFlags(value = "g"): string {
  const flags = [...new Set(value.split(""))].join("");
  if (/[^dgimsuvy]/.test(flags) || (flags.includes("u") && flags.includes("v"))) throw new Error("One or more regular-expression flags are unsupported or incompatible.");
  return flags;
}
function advanceStringIndex(value: string, index: number, unicode: boolean): number {
  const point = unicode ? value.codePointAt(index) : undefined;
  return point !== undefined && point > 0xffff ? index + 2 : index + 1;
}
function collectMatches(value: string, pattern: string, flagsValue: string): Array<{ match: string; index: number; captures: Array<string | undefined> }> {
  if (value.length > MAX_REGEX_INPUT_LENGTH) throw new Error("Regex input is limited to 50,000 characters to reduce browser blocking.");
  if (!pattern) throw new Error("Enter a regular expression.");
  const expression = new RegExp(pattern, regexFlags(flagsValue));
  const matches: Array<{ match: string; index: number; captures: Array<string | undefined> }> = [];
  let current: RegExpExecArray | null;
  while ((current = expression.exec(value)) !== null && matches.length < MAX_MATCHES) {
    matches.push({ match: current[0], index: current.index, captures: current.slice(1) });
    if (!expression.global && !expression.sticky) break;
    if (current[0] === "") expression.lastIndex = advanceStringIndex(value, expression.lastIndex, expression.unicode);
  }
  return matches;
}
function regexReplacement(value: string, pattern: string, flagsValue: string, replacement: string): string {
  if (value.length > MAX_REGEX_INPUT_LENGTH) throw new Error("Regex input is limited to 50,000 characters to reduce browser blocking.");
  if (!pattern) throw new Error("Enter a regular expression.");
  return value.replace(new RegExp(pattern, regexFlags(flagsValue)), replacement);
}
function diffLines(beforeText: string, afterText: string): string {
  const before = beforeText ? beforeText.split(/\r\n|\r|\n/) : [];
  const after = afterText ? afterText.split(/\r\n|\r|\n/) : [];
  if (before.length > 500 || after.length > 500 || (before.length + 1) * (after.length + 1) > 250_000) throw new Error("Text diff is limited to 500 lines per side and 250,000 comparison cells.");
  const columns = after.length + 1, table = new Uint32Array((before.length + 1) * columns);
  for (let i = before.length - 1; i >= 0; i--) for (let j = after.length - 1; j >= 0; j--) {
    const at = i * columns + j;
    table[at] = before[i] === after[j] ? table[(i + 1) * columns + j + 1] + 1 : Math.max(table[(i + 1) * columns + j], table[i * columns + j + 1]);
  }
  const result: string[] = []; let i = 0, j = 0;
  while (i < before.length && j < after.length) {
    if (before[i] === after[j]) { result.push("  " + before[i]); i++; j++; }
    else if (table[(i + 1) * columns + j] >= table[i * columns + j + 1]) result.push("- " + before[i++]);
    else result.push("+ " + after[j++]);
  }
  while (i < before.length) result.push("- " + before[i++]);
  while (j < after.length) result.push("+ " + after[j++]);
  return result.join("\n");
}
export function transformText(operation: TextOperation, input: string, options: TextOperationOptions = {}): string {
  guard(input);
  if (operation === "diff") { const second = options.secondInput ?? ""; guard(second, "Comparison input"); return diffLines(input, second); }
  switch (operation) {
    case "regex-test": { const matches = collectMatches(input, options.pattern ?? "", options.flags ?? "g"); return JSON.stringify({ count: matches.length, truncated: matches.length === MAX_MATCHES, matches }, null, 2); }
    case "regex-replace": {
      const pattern = options.pattern ?? "", flags = regexFlags(options.flags ?? "g"), countFlags = flags.replace("y", "");
      const matches = collectMatches(input, pattern, countFlags.includes("g") ? countFlags : countFlags + "g");
      return JSON.stringify({ matchCount: matches.length, result: regexReplacement(input, pattern, flags, options.replacement ?? "") }, null, 2);
    }
    case "find-replace": {
      const search = options.pattern ?? ""; if (!search) throw new Error("Enter text to find.");
      const replacement = options.replacement ?? "";
      if (options.regexFind) {
        const flags = regexFlags(options.flags ?? "g"), countFlags = flags.replace("y", "");
        const matches = collectMatches(input, search, countFlags.includes("g") ? countFlags : countFlags + "g");
        return JSON.stringify({ matchCount: matches.length, result: regexReplacement(input, search, flags, replacement) }, null, 2);
      }
      return JSON.stringify({ matchCount: input.split(search).length - 1, result: input.split(search).join(replacement) }, null, 2);
    }
    case "split-join": { const delimiter = options.delimiter ?? ","; if (!delimiter) throw new Error("Delimiter cannot be empty."); return input.split(delimiter).join("\n"); }
    case "trim": return options.trimMode === "start" ? input.trimStart() : options.trimMode === "end" ? input.trimEnd() : input.trim();
    case "sort-dedupe": { if (!input) return ""; return [...new Set(input.split(/\r\n|\r|\n/).sort((a, b) => a < b ? -1 : a > b ? 1 : 0))].join("\n"); }
    case "case": {
      if (options.caseMode === "lower") return input.toLowerCase();
      if (options.caseMode === "title") return input.toLowerCase().replace(/(^|[\s\p{P}])(\p{L})/gu, (_all, boundary: string, letter: string) => boundary + letter.toUpperCase());
      return input.toUpperCase();
    }
    case "normalize": return input.normalize(options.normalizeForm ?? "NFC");
    case "escape": return options.escapeMode === "json" ? JSON.stringify(input).slice(1, -1) : input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    case "statistics": return JSON.stringify({ codePoints: Array.from(input).length, words: input.match(/\S+/gu)?.length ?? 0, lines: input ? input.split(/\r\n|\r|\n/).length : 0, utf8Bytes: new TextEncoder().encode(input).length }, null, 2);
  }
}
