export type DigestAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";

const allowedAlgorithms = new Set<DigestAlgorithm>(["SHA-256", "SHA-384", "SHA-512"]);

export async function digestBytes(bytes: Uint8Array, algorithm: DigestAlgorithm): Promise<string> {
  if (!allowedAlgorithms.has(algorithm)) throw new TypeError("Unsupported digest algorithm");
  if (!(bytes instanceof Uint8Array)) throw new TypeError("Digest input must be bytes");
  if (!globalThis.crypto?.subtle) throw new Error("Web Crypto is unavailable");

  // Copy the exact view into a fresh ArrayBuffer. This preserves subarray offsets
  // and satisfies Web Crypto's BufferSource typing without accepting SharedArrayBuffer.
  const data = new Uint8Array(bytes.byteLength);
  data.set(bytes);
  const digest = await globalThis.crypto.subtle.digest(algorithm, data.buffer);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function encodeUtf8(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}
