# Developer Tools Workspace Layouts

**Status:** Proposal; revise with implementation evidence and do not mark approved without approval.

## Shared standalone page
- Existing global shell/navigation.
- Breadcrumb, title, concise purpose and relevant privacy note.
- Operation toolbar: mode, format and options only when needed.
- Input region: Textarea/editor or file zone, label/help/validation.
- Output region: empty/result/error, with Copy or Download as applicable.
- Avoid nested cards for every region; use clear boundaries and readable line lengths.

## Current text-first workbench implementation
The shared Developer Tool Workbench uses labelled controls, a source textarea, explicit Process/Clear actions, a separate read-only output textarea, and copy/download actions. Input and output sit in two columns at XL widths and stack at smaller widths. Operation-specific controls appear above the editors. The output is text-only; HTML is never injected into the document. Error messages use an alert role and preserve the source input. The current layout is an implementation record, not an approved target design.

## Encoding & Decoding
The current /encoding/url route consolidates URL components, Base64, Base64url, Base32, hex, binary, basic HTML entities and Unicode escapes under one operation selector. It supports UTF-8 text encodings and quoted-printable, plus charset conversion for UTF-8, UTF-16LE/BE and Windows-1252 via explicit hexadecimal bytes. Base64/Base64url/hex/binary/Base58 also support optional local file bytes with a 2 MB input cap and decoded-byte download; other modes remain text-first. /encoding/base64 is a compatibility redirect that opens Base64 mode.
Desktop: operation/input mode above side-by-side input/output panels. Convert/clear near input; copy/download near output.
Mobile: operation selector, direction, editor, convert action, output and copy/download. Text and bytes remain explicit. Charset encoding returns hex bytes; charset decoding accepts hex bytes.

## Security & Cryptography
Selector distinguishes digest, HMAC and checksum modes; this workbench does not expose encryption. Algorithm and input type remain visible. Text or a local file up to 2 MB may be selected; file hashing consumes raw bytes. Key fields are separate from ordinary input. Result shows algorithm and representation. No risky default encryption configuration.

## Data Parsing & Conversion
Direction/format and relevant options above source/result editors. Desktop may use columns; mobile stacks. Parse errors include useful line/row context. Advanced options use an accessible disclosure where useful.

## Text & Regular Expressions
Pattern/flags/mode above sample editor. Show match count, previous/next navigation, captures and replacement preview. Mobile stacks controls and keeps match navigation reachable.

## Compression, Binary & Mathematics
Operation/format/width/endianness above text or file input. Summary shows input bytes, output bytes and ratio/interpretation. Hexdump is bounded and scrollable. Copy text and download bytes are separate.

## Network & Security Inspection
Inspector selection above text/byte/file input. Structured result distinguishes parse, decode, signature verification and trust. Pasted headers never trigger a request.

## Workflow, Generators & API Helpers
API helper: pasted command/request → parsed structured preview → generated output with unsupported-syntax warnings. `/workflow/pipeline` provides typed allowlisted text/encoding/JSON/query steps plus byte-preserving Base64/Base64url/Base32/Base58/ASCII85/Z85/binary/quoted-printable conversions through raw hex. The raw-hex input accepts pasted hex or a local file up to 100 KB; arbitrary bytes remain hex until an explicit UTF-8 decode step. When the final type is raw-hex, a Download raw bytes action exports the exact byte sequence. Reorder controls, bounded intermediate output, sequential line batches, versioned recipe import/export and worker cancellation are included. `/generators/sample-data` uses a single operation selector with bounded fields for random strings, integers, timestamps, synthetic JSON records and UUID batches. Opt-in local-only recipe saving stores only validated recipe definitions, names and timestamps (maximum 10 recipes/320 KB); source input, local file bytes, results and secrets are never saved. Parallel batches, arbitrary code and broader file workflows remain deferred pending additional typed-byte contracts and safety review. Cancellation is implemented by terminating the dedicated worker.

## Responsive contract

| Range | Layout |
|---|---|
| XS <640px | One column, controls wrap, no side-by-side editors, no horizontal page overflow |
| SM 640–767px | One column by default; editors full-width |
| MD 768–1023px | Side-by-side only if each panel remains usable |
| LG 1024–1279px | Persistent sidebar; settings column only when space permits |
| XL 1280–1535px | Full desktop split panels with bounded content |
| 2XL ≥1536px | Maintain max-width/readable lines; do not stretch output |

Short-height viewports use natural page scrolling; fixed panels must not clip primary actions. Menus stay within the viewport. Empty, valid, invalid, processing, success and unsupported states preserve user input. Focus follows visual order; Escape closes overlays and restores focus. Respect reduced motion, theme, RTL, zoom and long translations.
