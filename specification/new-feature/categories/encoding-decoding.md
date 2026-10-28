# Encoding & Decoding

**Status:** Partially implemented. The `/encoding/url` route is the unified text-representation workbench; `/encoding/base64` is a compatibility redirect to Base64 mode. Charset conversion supports UTF-8, UTF-16LE/BE and Windows-1252 through explicit hex bytes and local-file decoding. Raw-byte mode now includes Base32 and quoted-printable in addition to Base64/Base64url/hex/binary/Base58/ASCII85.

| ID | Operation | Contract and acceptance tests |
|---|---|---|
| enc.url-component | URL component encode/decode | Implemented; reserved chars, spaces, Unicode and malformed percent sequences; distinguish component encoding from URL parsing |
| enc.base64-text | Text ↔ Base64 | Implemented; explicit UTF-8, standard padding and invalid-input errors |
| enc.base64url | URL-safe Base64 | Implemented; URL-safe alphabet and unpadded output; UTF-8 text only |
| enc.base32 | Base32 | Implemented RFC 4648 alphabet, case normalization, padding and invalid-character checks; raw file-byte encode/decode is supported |
| enc.base58/base85 | Selected Base58/Base85 variants | Bitcoin Base58 implemented with leading-zero preservation and invalid-alphabet errors; Adobe ASCII85 and ZeroMQ Z85 implemented with explicit variant labels, bounded raw-byte decode and overflow/malformed-group validation; Z85 enforces four-byte input and five-character output blocks without implicit padding |
| enc.hex | Hex ↔ bytes/text | Implemented for UTF-8 text; case/separators supported; odd-length and invalid characters rejected |
| enc.binary | Binary ↔ bytes | Implemented for UTF-8 text; eight-bit groups required; invalid bits rejected |
| enc.html-entities | Text ↔ HTML entities | Basic named and numeric entities implemented; decoded markup is never rendered; full HTML named-entity catalog pending |
| enc.unicode-escapes | Unicode escape conversion | Implemented BMP `\\uXXXX` and supplementary `\\u{...}` forms; invalid scalar values rejected |
| enc.quoted-printable | Quoted-printable | Implemented for UTF-8 text and raw file bytes; raw-byte mode escapes CR/LF to preserve binary data, wraps MIME lines and rejects malformed escapes; text decoder normalizes line endings to LF |
| enc.charset | Selected charset conversion | Implemented for UTF-8, UTF-16LE/BE and Windows-1252; encode outputs hex bytes, decode accepts hex bytes; unsupported Windows-1252 characters and malformed bytes error |
| enc.text-byte-mode | Explicit text or byte/file mode | Implemented for Base64/Base64url/Base32/hex/binary/Base58/ASCII85/Z85/quoted-printable raw-byte files; URL component, basic HTML entities and Unicode escapes accept selected UTF-8 text files and produce text output; charset mode can decode selected file bytes. Local input capped at 2 MB, encoded output capped at 1,000,000 characters, decoded bytes can be downloaded; raw-byte mode remains limited to the listed byte encoders |

## Interaction and processing
Use the existing Textarea/editor for text and styled file selection only for byte/file operations. Place alphabet/encoding/padding options near the operation. Copy text output; download byte output with correct MIME where known. Preserve compatible input when switching operations. Prefer local processing; never place sensitive input in URLs/logs/storage. Bound expensive allocations.

See [wireframes](../wireframes/workspace-layouts.md#encoding--decoding).

## Acceptance
Existing URL/Base64 routes remain functional, with `/encoding/base64` redirecting to `?mode=base64`; supported modes have known-answer and malformed-input tests; Unicode/binary data is UTF-8 text-based and unsupported variants are not presented as available. Copy/download uses actual text output. Encoding is not encryption.
