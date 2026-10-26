# Encoding & Decoding

**Status:** Proposal; URL and Base64 entries are marked available in registry but require runtime re-verification.

| ID | Operation | Contract and acceptance tests |
|---|---|---|
| enc.url-component | URL component encode/decode | Reserved chars, spaces, Unicode and malformed percent sequences; distinguish component encoding from URL parsing |
| enc.base64-text | Text ↔ Base64 | Explicit UTF-8, padding/whitespace policy, empty and invalid input |
| enc.base64url | URL-safe Base64 | Alphabet/padding policy, text vs bytes, known vectors |
| enc.base32 | Base32 | Exact alphabet, case and padding; invalid characters |
| enc.base58/base85 | Selected Base58/Base85 variants | Conditional on maintenance/demand; alphabet variant explicit |
| enc.hex | Hex ↔ bytes/text | Case, separators, odd-length and invalid characters |
| enc.binary | Binary ↔ bytes | Grouping, leading zeros and invalid bits |
| enc.html-entities | Text ↔ HTML entities | Named/numeric entities; never render decoded untrusted markup |
| enc.unicode-escapes | Unicode escape conversion | BMP/supplementary code points and invalid surrogates |
| enc.quoted-printable | Quoted-printable | Soft line breaks, invalid escapes, byte/text policy |
| enc.charset | Selected charset conversion | Supported labels explicit; malformed/unsupported sequences fail clearly |
| enc.text-byte-mode | Explicit text or byte/file mode | No implicit binary-to-text conversion; non-text bytes round-trip |

## Interaction and processing
Use the existing Textarea/editor for text and styled file selection only for byte/file operations. Place alphabet/encoding/padding options near the operation. Copy text output; download byte output with correct MIME where known. Preserve compatible input when switching operations. Prefer local processing; never place sensitive input in URLs/logs/storage. Bound expensive allocations.

See [wireframes](../wireframes/workspace-layouts.md#encoding--decoding).

## Acceptance
Existing URL/Base64 routes remain functional or have tested aliases; every operation has known-answer and malformed-input tests; Unicode/binary data is not silently corrupted; unsupported variants are not presented as available; copy/download matches actual output. Encoding is not encryption.
