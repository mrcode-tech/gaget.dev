export const REGEX_INPUT_LIMIT = 256 * 1024;
export const REGEX_PATTERN_LIMIT = 2_000;
export const REGEX_MATCH_LIMIT = 1_000;
export const REGEX_FLAGS = ["d", "g", "i", "m", "s", "u", "v", "y"] as const;
export type RegexFlag = (typeof REGEX_FLAGS)[number];

export type RegexMatch = {
  index: number;
  match: string;
  captures: Array<string | undefined>;
};

export function validateRegexInput(pattern: string, flags: string, input: string): void {
  if (pattern.length > REGEX_PATTERN_LIMIT) throw new RangeError("Pattern is too long.");
  if (input.length > REGEX_INPUT_LIMIT) throw new RangeError("Input is too large (maximum 256 KiB).");
  if ([...flags].some((flag) => !REGEX_FLAGS.includes(flag as RegexFlag))) throw new TypeError("Unsupported regular-expression flag.");
  if (new Set(flags).size !== flags.length) throw new TypeError("Regular-expression flags must not be repeated.");
  if (flags.includes("u") && flags.includes("v")) throw new TypeError("The u and v flags cannot be used together.");
  // Compile once for deterministic syntax validation. Execution is isolated in a worker by the UI.
  new RegExp(pattern, flags);
}

export function findRegexMatches(pattern: string, flags: string, input: string): RegexMatch[] {
  validateRegexInput(pattern, flags, input);
  const executionFlags = flags.includes("g") ? flags : flags + "g";
  const expression = new RegExp(pattern, executionFlags);
  const matches: RegexMatch[] = [];
  let match: RegExpExecArray | null;
  while ((match = expression.exec(input)) !== null) {
    if (matches.length >= REGEX_MATCH_LIMIT) throw new RangeError("More than 1,000 matches were found. Refine the pattern or input.");
    matches.push({ index: match.index, match: match[0], captures: match.slice(1) });
    if (match[0] === "") {
      const point = input.codePointAt(expression.lastIndex);
      expression.lastIndex += point === undefined ? 1 : point > 0xffff ? 2 : 1;
    }
  }
  return matches;
}
