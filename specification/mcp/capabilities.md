# GaGet.dev MCP Capabilities

**Status:** Comprehensive target inventory and audit contract. This proposal is not proof that every listed feature is implemented or MCP-exposed.

## 1. Goal and navigation

All useful operations across GaGet.dev should eventually be discoverable and chainable through a single typed pipeline model. Batch Workbench is the sole pipeline editor and belongs in the main sidebar directly below Dev Tools; it must not also appear in the Dev Tools catalog, categories or search. MCP & Integrations is a separate setup/catalog/showcase page, not another pipeline editor. It may load a recipe into Batch Workbench.

Keep these states distinct: browser available, shared implementation, server available, MCP-exposed, planned/deferred. A route or browser button is not evidence of MCP support. An operation is remotely executable only after a tested server adapter is registered in the real MCP runtime.

## 2. Input, output and pipeline contract

### Input types
- Text: UTF-8 plain text, code, query or multiline content.
- Structured text: JSON, XML, HTML, SQL, CSV, URI/query strings, cURL snippets, regex, cron and ICS where supported.
- Image, audio and video files/artifacts with verified format support and inspectable metadata.
- Generic file/binary with strict byte limits and detected media type.
- Multiple files as an explicitly ordered collection only for operations that declare it.
- Structured date/time values with explicit time zone/offset, locale/calendar and date-only versus instant semantics.
- Structured parameters and records.
- Browser capture from microphone/camera/screen only after an explicit user gesture and permission. Remote MCP must never silently access local capture devices.

### Output types
Text, JSON, diagnostics, metadata, binary file, image, audio, video, date/time and multi-artifact manifest. A file may produce text (Base64 or metadata); text may produce a file (Base64 decode or text export). The operation determines the output type.

### Required capability metadata
Every operation must define a stable ID and contract version; localized title/description/category/aliases/keywords; accepted input and output types; strict parameter schema and defaults; runtime modes; availability and MCP exposure status; limits for bytes, characters, pixels, duration, frames, file count, time, output and concurrency; privacy and side effects; determinism; safe error codes; known limitations; and required tests.

The full inventory is the target coverage list. The actual runtime registry is the source of truth for currently executable MCP operations. Public capability API, MCP discovery, picker badges, help and showcase must derive from that registry. CI must detect undocumented drift.

### Pipeline semantics
A recipe includes a schema version, declared input, ordered steps, stable operation IDs/versions, parameters, explicit references to prior outputs, and a final output reference/view. Recipe import validates but never auto-runs. Recipe export excludes source content, file bytes, outputs, credentials and secrets by default.

Illustrative target chain: image input → crop → resize → encode bytes as Base64 → text output. Each conversion must be explicit and each step must declare compatible input/output types. This is a design example, not a claim that those operations are currently registered in MCP.

Validate the entire chain and known size budgets before step one. Execute sequentially by default; no implicit parallelism, loops or nested workflows. Stop on failure by default and preserve safe step-level diagnostics. Enforce cumulative byte, pixel, duration, frame, output, deadline and concurrency budgets. Cancellation and every terminal state must trigger temporary-artifact cleanup. Never allow arbitrary code, shell commands, dynamic imports, filesystem paths, unrestricted network access or URL fetching. Large binary output must use bounded content or authorized expiring artifact handles rather than unlimited Base64 in JSON. Artifact manifests should include safe name, media type, size, optional checksum, expiry and retrieval mechanism.

## 3. Searchable operation picker and workbench

The user chooses an input type first, then pastes text/structured input or selects/drops a file. A keyboard-accessible shadcn/Radix combobox/listbox filters operations by current input or previous step output. Search by title, alias, category, input/output type and task language such as crop, resize, rotate, Base64, extract audio or timestamp. Each result shows input → output, runtime, availability/MCP state and limits. Planned/deferred features are not executable options. Incompatible options should be filtered or explain the incompatibility; conversions are never implicit.

Step cards support configure, reorder, duplicate and remove, with downstream revalidation after changes. Provide accessible move-up/down actions as an alternative to drag. Show truthful pending/running/success/error/skipped/cancelled states and progress only when actually reported.

Result viewer follows the actual type:
- Text: bounded preview, copy and text download.
- JSON: tree/raw view, copy and download.
- Image: safe preview, dimensions, format and download.
- Audio/video: supported preview/playback, metadata and download.
- Binary: size/media type and safe hex/metadata view; never render arbitrary bytes as markup.
- Multiple outputs: artifact manifest with per-item preview/download and expiry.
- Errors: safe code, failed step and actionable message, without stack traces or secrets.

Use existing GaGet styled file/dropzone, editors, dialogs, theme and shadcn/Radix controls. Localize all visible strings and preserve RTL for Persian and Arabic.

## 4. Target feature inventory

The following is the broad capability checklist for documented GaGet.dev product areas and planned developer tools. Each item must be audited against source, UI behavior, tests and runtime before claiming implementation. A listed idea is not proof of availability.

### 4.1 Dev Tools: encoding, text and representation

| Family | Features to inventory | Input → output |
|---|---|---|
| Encoding | URL component/full URL; Base64/Base64url; hex; binary; Base32; Base58; ASCII85; Z85; HTML entities; Unicode escapes; quoted-printable; explicit text/bytes modes | text/bytes → text/bytes |
| Character sets | UTF-8, UTF-16LE/BE and actually supported charsets; malformed input policy | text/bytes → text/bytes |
| Hash/checksum | SHA-256/384/512; HMAC-SHA-2; CRC32; CRC-16/CCITT-FALSE; Adler-32 where implemented | text/bytes + optional key → digest |
| JWT | Decode header/payload; inspect exp/iat/nbf claims | JWT text → JSON/metadata |
| Text transforms | Find/replace; trim; split/join; sort/dedupe lines; case conversion; Unicode normalization; escaping; statistics; bounded diff; safe regex match/capture/replacement | text → text/JSON |
| Format/parse | JSON format/minify/validate/diff/find/tree/key sort/escape; XML format/minify and documented checks; SQL/HTML heuristic formatting as inert text; CSV↔JSON; key-value/query parsing; cURL subset parse/generate/redact | text/JSON → text/JSON/diagnostics |
| Generators | UUID v4; random strings/integers; synthetic JSON; timestamps and documented generators | parameters → text/JSON |
| Data inspection | URL/data URI; IP/CIDR/MAC parsing; offline HTTP messages; file signature/metadata; hexdump; printable strings; entropy/byte stats; binary compare; PEM/DER/OpenSSH public-key metadata/fingerprints where supported | text/bytes → JSON/text |
| Compression | gzip/zlib/DEFLATE variants actually supported; wrapper detection; compression ratio; bounded decompression | bytes → bytes/metadata |
| Binary/numeric | radix conversion; signed/unsigned fixed-width integers; endianness; IEEE-754; bitwise operations; numeric statistics | text/bytes/numbers → text/JSON |

Security semantics must be explicit: JWT decoding is not signature verification; hashing is not encryption; HMAC keys are secrets; cURL parsing does not send requests; no arbitrary network lookup.

### 4.2 JSON Workspace
- Pretty print/format with supported indentation options.
- Minify while rejecting invalid JSON rather than silently repairing it.
- Syntax validation with safe error and line/column/offset when available.
- Structural diff: object key order ignored, array order preserved, missing distinct from null, escaped paths.
- Recursive or selected-level key sorting where supported.
- Find keys, values and paths with result/depth limits.
- JSON string escape/unescape, distinct from full-document serialization.
- Tree/path inspection with machine-readable paths.
- JSON results and diagnostics can feed later compatible steps.

### 4.3 Image Editor

| Operation | Detailed features to inventory | Input → output |
|---|---|---|
| Inspect | Dimensions, aspect ratio, format, byte size, available metadata, orientation/color profile where supported | image → metadata JSON |
| Crop | x/y/width/height; normalized rectangle; aspect presets; freeform crop | image → image |
| Resize | Width/height; aspect-ratio lock; contain/cover/fill; anchor; supported interpolation modes | image → image |
| Rotate | 90-degree increments and arbitrary angles if supported; canvas expansion/background | image → image |
| Flip | Horizontal and vertical | image → image |
| Convert | Only verified formats such as PNG/JPEG/WebP where supported; alpha/background behavior | image → image file |
| Compress | Quality and best-effort target size; before/after metrics | image → image + metrics |
| Adjust | Brightness, contrast, saturation, grayscale, blur and other real controls | image → image |
| Text layer | Text overlays, font/size/color/position where implemented; font fallback | image + parameters → image |
| Collage | Multiple images, grid/layout and spacing | image[] → image |
| Palette/color | Dominant colors; sample pixel at coordinates | image → JSON/color |
| Base64 | Image bytes to Base64 and supported reverse conversion | image/bytes/text → text/image |
| Favicon | Generate verified sizes/formats and artifact manifest | image → manifest |
| SVG optimization | Safe whitespace/comment optimization with safe XML parsing; never execute SVG | SVG text → SVG text |
| Dimensions/print size | Dimension calculations and DPI-based estimates | metadata + DPI → JSON/text |
| Metadata cleaning | Remove selected metadata only where code/tests verify removal; report what was changed | image → image + report |

Image limits cover encoded bytes, decoded pixels, dimensions, output bytes and memory. Validate crop bounds and rotation behavior. Never render untrusted SVG as active content or promise complete metadata privacy without verification.

### 4.4 Audio Editor
- Inspect: verified format, size, duration, sample rate, channels, bit depth and available tags.
- Trim and split: start/end time, boundaries, bounded segment count.
- Merge: compatible files, format/sample-rate/channel rules and resampling behavior.
- Volume/gain/normalization: units and clipping policy.
- Dynamic-range compression, distinct from file-size compression.
- Speed: distinguish playback rate from time-stretching; pitch shift only with a real engine.
- Waveform: `audio.waveform` computes bounded per-channel min/max/RMS envelopes for explicitly supplied PCM/IEEE-float WAV; bucket count is capped at 1,000. Spectrum/FFT remains unexposed until a tested spectral implementation exists.
- Silence detection: threshold, minimum duration and dBFS semantics.
- Convert/WAV: only verified codecs, sample format and channel behavior.
- Explicit audio bytes ↔ Base64.
- Microphone capture only after user gesture and permission.
- Metadata editing: distinguish actual embedded tag mutation from sidecar metadata.

Audio limits include codecs, decoded duration, channels/sample rate, time and output bytes. Remote MCP cannot silently access the browser microphone or AudioContext.

### 4.5 Video Editor
- Inspect dimensions, duration and available codec/container/track metadata.
- Trim/split with defined time/frame precision and bounded segment count.
- Merge/mux only with a verified codec/mux implementation.
- Crop and resize resolution.
- Text/image watermark with font and alpha behavior.
- Reverse with explicit audio policy and resource bounds.
- Color filters and speed with defined frame interpolation/drop and audio pitch behavior.
- Extract/replace/remove audio only when actual muxing supports it.
- Stabilize only with a real engine; otherwise deferred.
- Extract frames by timestamp/interval; thumbnails/contact sheets with frame and pixel caps.
- Subtitle sidecar import/export; burn-in only if supported.
- Compare metadata/aligned previews with declared semantics.
- Convert/compress/resolution/bitrate only for verified codecs and containers.
- Video segment to GIF only if encoder exists.
- Metadata cleaning only when actual container mutation is verified.
- Explicit video bytes ↔ Base64; high limits and no implicit encoding.
- Camera/screen capture only after explicit user action and browser permission.

Video limits cover duration, resolution, frames, memory/disk, processing time and output bytes. Never promise universal MP4/MOV conversion.

### 4.6 Date & Time
- Parse/format ISO instants, epoch seconds/milliseconds, offsets and named time zones.
- Locale/calendar-aware formatting; locale, numbering system, calendar and zone are separate.
- Elapsed-duration arithmetic versus local calendar-day/month arithmetic.
- Compare instants, elapsed duration and date-only differences.
- Calendar display, month/year calculations, leap year and week number with explicit ISO-week semantics.
- Age calculation with date-only and invalid/future-date rules.
- Business days with explicit weekend and holiday dataset policy.
- World clock, zone conversion and meeting overlap; define DST ambiguous/nonexistent local times.
- Countdown/duration snapshot; remote call is not a live-updating timer.
- Inspect/generate ICS with escaping/validation and no implicit calendar network access.
- Parse/build a documented cron subset and timezone behavior.
- Stable JSON date/time representation with explicit zone/calendar.
- Holiday lists only with region, date range and authority disclosed.

### 4.7 Workbench and cross-cutting actions
- Select input type; paste/edit text; choose/drop files; explicit multi-file mode.
- Show safe filename, media type, size and available metadata.
- Add/configure/reorder/duplicate/remove steps; whole-chain validation; run/cancel/reset.
- Per-step state, bounded intermediate preview, safe errors and truthful progress.
- Copy text, preview media, download one/multiple artifacts, inspect metadata, feed output into the next compatible step.
- Import/export versioned recipes without source data/secrets; import never auto-runs.
- Batch input only where supported, with per-item mapping and aggregate limits.
- Remote-transfer consent, configured destination and retention disclosure.
- Keyboard accessibility, focus management, screen-reader status announcements, reduced motion and non-color-only status.
- Responsive desktop/tablet/mobile/short-height, light/dark, localization and RTL.

## 5. MCP and privacy requirements

The public capability endpoint, MCP discovery, picker MCP badges, help and showcase must derive from the actual runtime registry. Operation execution validates ID/version/schema/types/limits; workflow execution validates the entire chain and cumulative budgets.

Remote MCP cannot access browser File/Blob objects, object URLs, local filesystem, camera, microphone or screen. Binary transfer requires a supported MCP content mechanism, disclosed bounded artifact API or separate permissioned local bridge. Explain remote transfer and known retention before sending bytes. Do not claim browser-local privacy for remote execution.

No privileged frontend token. Anonymous public demos require synthetic defaults, narrow allowlist, quotas, deadlines, concurrency/output limits and abuse controls; otherwise label the demo as guided and not executed. No arbitrary shell/code, filesystem paths, dynamic import, URL fetch or unrestricted network. Media dependencies require license review, resource isolation and adversarial fixtures.

## 6. Acceptance criteria

1. Every user-visible tool feature is inventoried or explicitly marked not a pipeline operation.
2. Each executable operation has stable ID/version, schema, types, limits, runtime, privacy/side-effect declaration, safe errors and tests.
3. Picker is accessible, searchable, localized, type-aware and truthful about runtime/MCP state.
4. Explicit compatible text→file, file→text, file→file and multi-artifact chains work where supported.
5. Image crop→resize→Base64 is enabled only where every step is verified in the chosen runtime.
6. Result viewers follow actual output type and allow chaining.
7. Recipes exclude user data/secrets by default and import never auto-runs.
8. Limits, cancellation, cleanup, remote transfer and artifact expiry are enforced and tested.
9. Showcase distinguishes real MCP execution from a static/guided example.
10. Inventory, runtime registry, public API, UI, help and CI are reconciled.
11. Tests cover valid/invalid inputs, type mismatch, format support, size caps, timeout/cancellation, cleanup, authorization, accessibility, RTL and responsive behavior.
12. No operation is MCP-exposed until a real MCP invocation and exact-revision CI evidence pass.
