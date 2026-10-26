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
Desktop: operation/input mode above side-by-side input/output panels. Convert/clear near input; copy/download near output.
Mobile: operation selector, input mode/options, editor/file selection, convert action, output and copy/download. Text and bytes remain explicit.

## Security & Cryptography
Selector distinguishes Hash, HMAC, Checksum and only approved Encrypt/Decrypt. Algorithm/input type remain visible. Key fields are separate from ordinary input. Result shows algorithm and representation. No risky default encryption configuration.

## Data Parsing & Conversion
Direction/format and relevant options above source/result editors. Desktop may use columns; mobile stacks. Parse errors include useful line/row context. Advanced options use an accessible disclosure where useful.

## Text & Regular Expressions
Pattern/flags/mode above sample editor. Show match count, previous/next navigation, captures and replacement preview. Mobile stacks controls and keeps match navigation reachable.

## Compression, Binary & Mathematics
Operation/format/width/endianness above text or file input. Summary shows input bytes, output bytes and ratio/interpretation. Hexdump is bounded and scrollable. Copy text and download bytes are separate.

## Network & Security Inspection
Inspector selection above text/byte/file input. Structured result distinguishes parse, decode, signature verification and trust. Pasted headers never trigger a request.

## Workflow, Generators & API Helpers
API helper: pasted command/request → parsed structured preview → generated output with unsupported-syntax warnings. A later workflow builder uses typed steps/intermediate output but is deferred until contracts stabilize.

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
