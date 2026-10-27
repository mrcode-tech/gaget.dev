export type HashMode = "digest" | "hmac" | "crc32" | "crc16-ccitt" | "adler32";
export type DigestAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";
export type HashOptions = { mode: HashMode; algorithm: DigestAlgorithm; key?: string };
export const MAX_HASH_INPUT_LENGTH = 200_000;
export const MAX_HASH_BYTES = 2_000_000;
function hex(bytes: ArrayBuffer): string { return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, "0")).join(""); }
export function crc32Bytes(bytes: Uint8Array): string {
  if (bytes.byteLength > MAX_HASH_BYTES) throw new Error("File input exceeds the 2,000,000 byte safety limit.");
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0").toUpperCase();
}
export function crc16CcittBytes(bytes: Uint8Array): string {
  if (bytes.byteLength > MAX_HASH_BYTES) throw new Error("File input exceeds the 2,000,000 byte safety limit.");
  let crc = 0xffff;
  for (const byte of bytes) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit++) crc = ((crc << 1) ^ ((crc & 0x8000) ? 0x1021 : 0)) & 0xffff;
  }
  return crc.toString(16).padStart(4, "0").toUpperCase();
}
export function adler32Bytes(bytes: Uint8Array): string {
  if (bytes.byteLength > MAX_HASH_BYTES) throw new Error("File input exceeds the 2,000,000 byte safety limit.");
  let a = 1, b = 0;
  for (const byte of bytes) { a = (a + byte) % 65521; b = (b + a) % 65521; }
  return (((b << 16) | a) >>> 0).toString(16).padStart(8, "0").toUpperCase();
}
export function crc32Text(value: string): string {
  if (value.length > MAX_HASH_INPUT_LENGTH) throw new Error("Input exceeds the 200,000 character safety limit.");
  return crc32Bytes(new TextEncoder().encode(value));
}
export async function computeHashBytes(bytes: Uint8Array, options: HashOptions): Promise<string> {
  if (bytes.byteLength > MAX_HASH_BYTES) throw new Error("File input exceeds the 2,000,000 byte safety limit.");
  if (options.mode === "crc32") return crc32Bytes(bytes);
  if (options.mode === "crc16-ccitt") return crc16CcittBytes(bytes);
  if (options.mode === "adler32") return adler32Bytes(bytes);
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error("Web Crypto is unavailable in this browser context.");
  const data = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  if (options.mode === "digest") return hex(await subtle.digest(options.algorithm, data));
  const key = options.key ?? "";
  if (!key) throw new Error("Enter a key for HMAC.");
  if (key.length > 10_000) throw new Error("HMAC keys are limited to 10,000 characters.");
  const cryptoKey = await subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: options.algorithm }, false, ["sign"]);
  return hex(await subtle.sign("HMAC", cryptoKey, data));
}
export async function computeHash(value: string, options: HashOptions): Promise<string> {
  if (value.length > MAX_HASH_INPUT_LENGTH) throw new Error("Input exceeds the 200,000 character safety limit.");
  return computeHashBytes(new TextEncoder().encode(value), options);
}
