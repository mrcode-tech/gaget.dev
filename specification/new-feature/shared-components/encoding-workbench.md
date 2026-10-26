# Encoding Workbench Contract

**Status:** Implemented subset; broader byte/file modes remain pending.

## Purpose and API
EncodingWorkbench is the single catalog entry for common text representation operations. It accepts an initialMode from the EncodingMode union: URL component, Base64, Base64url, Base32, hexadecimal, binary bytes, basic HTML entities, or Unicode escapes. The existing /encoding/base64 route redirects to /encoding/url?mode=base64 to preserve bookmarks without duplicating catalog entries.

## Input and output
- Direction is explicitly Encode or Decode.
- Text is the current input type. Byte-oriented encodings convert through UTF-8; arbitrary file/byte input and byte-download output are not implemented.
- Operation changes preserve the source input and clear stale output/errors.
- Errors distinguish malformed percent sequences, invalid Base64/Base32, incomplete hex/binary groups, unsupported HTML entities, invalid Unicode escapes, and the common input-size limit.
- Copy/download act on the actual output text. No decoded markup is rendered.

## Supported formats
- URL component via encodeURIComponent / decodeURIComponent; not whole-URL parsing.
- Standard Base64 with UTF-8 and standard padding; URL-safe Base64 with URL-safe alphabet and unpadded encode output.
- RFC 4648 Base32.
- UTF-8 bytes as hexadecimal or eight-bit binary groups.
- Basic HTML named entities (amp, lt, gt, quot, apos) and numeric decimal/hexadecimal entities; not the complete HTML named-entity catalog.
- BMP Unicode escapes in \uXXXX form and supplementary code points in \u{...} form.

## Privacy, accessibility and limits
All transforms run in the browser, inputs are not persisted, and no network request is made. Text input is capped at 1,000,000 characters. Controls use existing shadcn/Radix Select, Button, Textarea and Card primitives; input/output have accessible names, and errors use an alert role. Encoding is not encryption.
