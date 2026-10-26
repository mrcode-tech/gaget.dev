export type EncodingMode = "url" | "base64" | "base64url" | "base32" | "hex" | "binary" | "html-entities" | "unicode-escapes";
export type EncodingDirection = "encode" | "decode";
const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function utf8(text: string): Uint8Array { return new TextEncoder().encode(text); }
function textFrom(bytes: Uint8Array): string { return new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
function base64FromBytes(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}
function bytesFromBase64(value: string, urlSafe = false): Uint8Array {
  let text = value.replace(/\s/g, "");
  if (urlSafe) text = text.replace(/-/g, "+").replace(/_/g, "/");
  if (!/^[A-Za-z0-9+\/]*={0,2}$/.test(text) || text.length % 4 === 1 || /=/.test(text.slice(0, -2))) throw new Error("Invalid Base64 alphabet or padding.");
  text = text.replace(/=+$/, "");
  text += "=".repeat((4 - text.length % 4) % 4);
  try { return Uint8Array.from(atob(text), c => c.charCodeAt(0)); }
  catch { throw new Error("Invalid Base64 input."); }
}
function encodeBase32(bytes: Uint8Array): string {
  let buffer = 0, bits = 0, output = "";
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte; bits += 8;
    while (bits >= 5) { output += BASE32[(buffer >>> (bits - 5)) & 31]; bits -= 5; }
  }
  if (bits) output += BASE32[(buffer << (5 - bits)) & 31];
  while (output.length % 8) output += "=";
  return output;
}
function decodeBase32(value: string): Uint8Array {
  const text = value.replace(/\s/g, "").toUpperCase().replace(/=+$/, "");
  if (!/^[A-Z2-7]*$/.test(text) || ![0,2,4,5,7].includes(text.length % 8)) throw new Error("Invalid Base32 alphabet or padding.");
  let buffer = 0, bits = 0; const output: number[] = [];
  for (const char of text) {
    buffer = (buffer << 5) | BASE32.indexOf(char); bits += 5;
    if (bits >= 8) { output.push((buffer >>> (bits - 8)) & 255); bits -= 8; }
  }
  if (bits && (buffer & ((1 << bits) - 1)) !== 0) throw new Error("Invalid non-zero trailing Base32 bits.");
  return Uint8Array.from(output);
}
function encodeHex(bytes: Uint8Array): string { return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join(""); }
function decodeHex(value: string): Uint8Array {
  const text = value.replace(/0x/gi, "").replace(/[\s:_-]/g, "");
  if (!/^(?:[0-9a-f]{2})*$/i.test(text)) throw new Error("Hex input must contain complete pairs of hexadecimal digits.");
  return Uint8Array.from(text.match(/.{2}/g) ?? [], pair => Number.parseInt(pair, 16));
}
function decodeBinary(value: string): Uint8Array {
  const text = value.replace(/[\s_]/g, "");
  if (!/^[01]*$/.test(text) || text.length % 8 !== 0) throw new Error("Binary input must contain complete groups of eight bits.");
  const bytes: number[] = [];
  for (let i = 0; i < text.length; i += 8) bytes.push(Number.parseInt(text.slice(i, i + 8), 2));
  return Uint8Array.from(bytes);
}
function encodeEntities(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function decodeEntities(value: string): string {
  return value.replace(/&([^;]+);/g, (whole, entity: string) => {
    const lower = entity.toLowerCase();
    if (lower === "amp") return "&";
    if (lower === "lt") return "<";
    if (lower === "gt") return ">";
    if (lower === "quot") return '"';
    if (lower === "apos") return "'";
    let code: number | undefined;
    if (/^#\d+$/.test(lower)) code = Number(lower.slice(1));
    else if (/^#x[0-9a-f]+$/.test(lower)) code = Number.parseInt(lower.slice(2), 16);
    if (code !== undefined && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff)) return String.fromCodePoint(code);
    throw new Error("Unsupported or invalid HTML entity: &" + entity + ";");
  });
}
function encodeUnicode(value: string): string {
  return Array.from(value, character => {
    const point = character.codePointAt(0)!;
    return point <= 0xffff ? "\\u" + point.toString(16).padStart(4, "0") : "\\u{" + point.toString(16) + "}";
  }).join("");
}
function decodeUnicode(value: string): string {
  if (/\\u(?![0-9a-f]{4}|\{[0-9a-f]{1,6}\})/i.test(value)) throw new Error("Use valid \\uXXXX or \\u{1F600} Unicode escapes.");
  return value.replace(/\\u\{([0-9a-f]{1,6})\}|\\u([0-9a-f]{4})/gi, (_whole, point: string | undefined, unit: string | undefined) => {
    if (unit) return String.fromCharCode(Number.parseInt(unit, 16));
    const code = Number.parseInt(point!, 16);
    if (code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff)) throw new Error("Unicode escape is not a valid scalar value.");
    return String.fromCodePoint(code);
  });
}
export function transformEncoding(mode: EncodingMode, direction: EncodingDirection, input: string): string {
  if (input.length > 1_000_000) throw new Error("Input exceeds the 1,000,000 character safety limit.");
  if (direction === "encode") {
    switch (mode) {
      case "url": return encodeURIComponent(input);
      case "base64": return base64FromBytes(utf8(input));
      case "base64url": return base64FromBytes(utf8(input)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      case "base32": return encodeBase32(utf8(input));
      case "hex": return encodeHex(utf8(input));
      case "binary": return Array.from(utf8(input), b => b.toString(2).padStart(8, "0")).join(" ");
      case "html-entities": return encodeEntities(input);
      case "unicode-escapes": return encodeUnicode(input);
    }
  }
  switch (mode) {
    case "url": try { return decodeURIComponent(input); } catch { throw new Error("Invalid percent-encoded URL component."); }
    case "base64": return textFrom(bytesFromBase64(input));
    case "base64url": return textFrom(bytesFromBase64(input, true));
    case "base32": return textFrom(decodeBase32(input));
    case "hex": return textFrom(decodeHex(input));
    case "binary": return textFrom(decodeBinary(input));
    case "html-entities": return decodeEntities(input);
    case "unicode-escapes": return decodeUnicode(input);
  }
}
