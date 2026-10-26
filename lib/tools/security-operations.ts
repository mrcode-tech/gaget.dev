export type HashMode = "digest" | "hmac" | "crc32";
export type DigestAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";
export type HashOptions = { mode: HashMode; algorithm: DigestAlgorithm; key?: string };
export const MAX_HASH_INPUT_LENGTH = 200_000;
function hex(bytes: ArrayBuffer): string { return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join(""); }
export function crc32Text(value: string): string {
  if (value.length > MAX_HASH_INPUT_LENGTH) throw new Error("Input exceeds the 200,000 character safety limit.");
  let crc = 0xffffffff;
  for (const byte of new TextEncoder().encode(value)) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0").toUpperCase();
}
export async function computeHash(value: string, options: HashOptions): Promise<string> {
  if (value.length > MAX_HASH_INPUT_LENGTH) throw new Error("Input exceeds the 200,000 character safety limit.");
  if (options.mode === "crc32") return crc32Text(value);
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("Web Crypto is unavailable in this browser context.");
  const data = new TextEncoder().encode(value);
  if (options.mode === "digest") return hex(await subtle.digest(options.algorithm, data));
  const key = options.key ?? "";
  if (!key) throw new Error("Enter a key for HMAC.");
  if (key.length > 10_000) throw new Error("HMAC keys are limited to 10,000 characters.");
  const cryptoKey = await subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: options.algorithm }, false, ["sign"]);
  return hex(await subtle.sign("HMAC", cryptoKey, data));
}
