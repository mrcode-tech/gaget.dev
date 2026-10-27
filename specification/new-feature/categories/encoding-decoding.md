# Encoding & Decoding

**Status:** Partially implemented. The `/encoding/url` route is the unified text-representation workbench; `/encoding/base64` is a compatibility redirect to Base64 mode. Charset conversion now supports UTF-8, UTF-16LE/BE and Windows-1252 through explicit hex byte representations; arbitrary file-byte mode and several proposed variants remain pending.

| ID | Operation | Contract and acceptance tests |
|---|---|---|
| enc.url-component | URL component encode/decode | Implemented; reserved chars, spaces, Unicode and malformed percent sequences; distinguish component encoding from URL parsing |
| enc.base64-text | Text ↔ Base64 | Implemented; explicit UTF-8, standard padding and invalid-input errors |
| enc.base64url | URL-safe Base64 | Implemented; URL-safe alphabet and unpadded output; UTF-8 text only |
| enc.base32 | Base32 | Implemented RFC 4648 alphabet, case normalization, padding and invalid-character checks |
| enc.base58/base85 | Selected Base58/Base85 variants | Bitcoin Base58 implemented with leading-zero preservation and invalid-alphabet errors; Adobe ASCII85 implemented with explicit framing, bounded raw-byte decode and overflow/malformed-group validation |
| enc.hex | Hex ↔ bytes/text | Implemented for UTF-8 text; case/separators supported; odd-length and invalid characters rejected |
| enc.binary | Binary ↔ bytes | Implemented for UTF-8 text; eight-bit groups required; invalid bits rejected |
| enc.html-entities | Text ↔ HTML entities | Basic named and numeric entities implemented; decoded markup is never rendered; full HTML named-entity catalog pending |
| enc.unicode-escapes | Unicode escape conversion | Implemented BMP `\\uXXXX` and supplementary `\\u{...}` forms; invalid scalar values rejected |
| enc.quoted-printable | Quoted-printable | Implemented for UTF-8 text; escapes non-ASCII bytes, wraps MIME lines, rejects malformed escapes and invalid UTF-8; decoder normalizes line endings to LF |
| enc.charset | Selected charset conversion | Implemented for UTF-8, UTF-16LE/BE and Windows-1252; encode outputs hex bytes, decode accepts hex bytes; unsupported Windows-1252 characters and malformed bytes error |
| enc.text-byte-mode | Explicit text or byte/file mode | Implemented for Base64/Base64url/hex/binary/Base58/ASCII85; local input capped at 2 MB, encoded output capped at 1,000,000 characters, decoded bytes can be downloaded; other modes remain text-only |

## Interaction and processing
Use the existing Textarea/editor for text and styled file selection only for byte/file operations. Place alphabet/encoding/padding options near the operation. Copy text output; download byte output with correct MIME where known. Preserve compatible input when switching operations. Prefer local processing; never place sensitive input in URLs/logs/storage. Bound expensive allocations.

See [wireframes](../wireframes/workspace-layouts.md#encoding--decoding).

## Acceptance
Existing URL/Base64 routes remain functional, with `/encoding/base64` redirecting to `?mode=base64`; supported modes have known-answer and malformed-input tests; Unicode/binary data is UTF-8 text-based and unsupported variants are not presented as available. Copy/download uses actual text output. Encoding is not encryption.
