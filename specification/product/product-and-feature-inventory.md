# Product and Feature Inventory
**Evidence:** App Router source routes, `lib/tools/registry.ts`, `lib/tools/image-tools.ts`, workbench components, and test filenames.
**Important:** This is a code-oriented inventory, not a promise that every listed menu action has complete processing support.

## Product intent and experience principles

- Provide practical, easy-to-find browser tools with a consistent navigation and workspace model.
- Prefer local processing for user-selected content where the implementation supports it; state exceptions and browser permissions clearly.
- Keep tool discovery simple: Home, Popular tools, Favorites, the independent Photo, Audio, Video, and Date & Time workspaces, followed by Dev Tools. The Dev Tools catalog contains developer utilities grouped by category only; media/date-time workspaces never appear in its results.
- Reuse shell and UI primitives without forcing media-specific controls into unrelated tools.
- Make capability limits visible at the point of action. Do not describe a preview, menu item, sidecar, or unsupported export as completed processing.

## Tool catalog architecture

See [Tool Catalog and Workspace Architecture](./tool-catalog-and-workspace-architecture.md) for the category/workspace/operation model and candidate boundaries. The registry records stable IDs, explicit availability status, and standalone/workspace kind. The JSON Workspace consolidates format, minify, validate and structural compare; `/json/diff` opens Compare mode for compatibility. Hash & Checksum Generator, Text & Regex Workbench, XML Formatter, SQL Formatter, CSV ↔ JSON, HTML Formatter, cURL Converter, Sample Data Generator, Data/Binary/Math Workbench, Network/File Inspector and Workflow & Batch Workbench have standalone routes and browser-local implementations. The binary workbench includes bounded byte-range inspection, two-file comparison, signed/unsigned AND/OR/XOR/NOT and Unicode character-frequency analysis. The network/file workbench includes offline DNS and redacted HTTP message parsing (including recognizable secrets in request targets and URL-bearing headers), common file signatures, selected PNG/GIF/BMP/JPEG/TIFF/WebP/WAV/AVI/MP4-family/FLAC/Ogg/PDF/ZIP/ID3/PE/ELF/Mach-O metadata, and bounded PEM/DER container inspection with exact-byte SHA-256 fingerprints, structural OpenSSH RSA/Ed25519/ECDSA public-key parsing with SHA-256 fingerprints, and JWT `exp`/`iat`/`nbf` NumericDate interpretation. These operations do not establish key/token trust or signature validity. URL component parsing is available in the data workbench and omits credential values. These are local parsers, not trust/safety verdicts. Full XML/HTML/SQL parsers, broad cURL flag semantics, additional metadata formats, full X.509/key fields, certificate trust validation, archive extraction and advanced workflow features remain incomplete or conditional.

## Global routes and shell

| Route / area | Current implementation | Notes |
|---|---|---|
| `/` | Home discovery page | Search, featured/popular tools, favorites, all-tools section, benefit messaging. |
| `/tools` | Dev Tools catalog | Search filters only developer utilities; registry categories render as sections and empty categories are omitted. Planned tools remain visibly planned and non-launchable. |
| `/categories/[slug]` | Category landing | Filters the central registry by category. Empty categories are possible. |
| Shared shell | App header + sidebar | Collapsible desktop sidebar, mobile/tablet navigation drawer, search suggestions, theme and language controls. |
| Locale handling | Locale provider and locale links | Locale metadata includes English, Persian, Arabic, Spanish, Chinese variants, Portuguese (Brazil), French, German, Japanese, Hindi, Russian, Indonesian, Korean and Italian. Translation completeness varies; English is the only approved indexable locale. Persian and Arabic use RTL direction. |
| Theme | `next-themes` provider and toggle | Light/dark theme variables are defined in CSS. Verify contrast in both themes. |
| SEO/technical routes | `app/robots.ts`, `app/sitemap.ts`, route metadata | Canonical/alternate metadata exists in route modules; check locale behavior before changing indexability. |

## Implemented standalone tools

| Route | Capability | Important boundaries |
|---|---|---|
| `/json/formatter` | JSON workspace: format, minify, validate, compare, sort keys, tree view, find keys/values, escape/unescape, line-numbered input, diagnostics, File/Features menus, local import/export/copy and undo/redo | Strict local syntax scanner provides source offsets and one-based line/column; comparison ignores object key order, preserves array order, distinguishes missing/null and uses escaped paths. Advanced JSONPath/schema/repair/conversion/merge capabilities remain planned. See [JSON Workspace Contract](./json-workspace.md). |
| `/json/diff` | Compatibility route into JSON Workspace Compare mode | Canonical metadata points to `/json/formatter`; no duplicate catalog entry. |
| `/encoding/url` | Unified text-representation workbench: URL component, Base64, Base64url, Base32, Bitcoin Base58, Adobe ASCII85, hex, binary bytes, basic HTML entities, Unicode escapes, quoted-printable and charset conversion | Charset conversion supports UTF-8, UTF-16LE/BE and Windows-1252 through explicit hex bytes. Base64/Base64url/Base32/hex/binary/Base58/ASCII85/quoted-printable support local files up to 2 MB and raw decoded-byte downloads; encoded output is capped at 1,000,000 characters. URL component, basic HTML entity and Unicode-escape modes also accept selected UTF-8 text files and return text; charset conversion can decode selected files using the chosen charset. Encoding is not encryption. |
| `/encoding/base64` | Compatibility redirect to the unified workbench Base64 mode | Preserves existing bookmarks; not a separate catalog entry. |
| `/security/jwt-decoder` | Decode JWT header and claims; inspect expiration | **Does not verify signatures.** This must remain explicit. |
| `/generators/uuid` | Generate UUID v4 values with browser cryptographic API | Do not claim server-side uniqueness guarantees. |
| `/generators/sample-data` | Generate bounded random strings/integers, synthetic JSON records, timestamps and UUID batches | Values are synthetic; timestamps use device clock; random output is not a password-strength recommendation. |
| `/security/hash` | SHA-256/384/512 digests and HMAC-SHA-2 over text or local files up to 2 MB, plus CRC32/IEEE, CRC-16/CCITT-FALSE and Adler-32 text/file checksums | HMAC key remains in component memory and is cleared by Clear or leaving HMAC mode; CRC32 is not cryptographic security; raw file bytes are not decoded or persisted. |
| `/text/regex` | Text & Regex Workbench: regex match/capture and replacement previews, find/replace, split/join, trim, sort/dedupe, case conversion, Unicode normalization, escaping, statistics and line diff | Regex input capped at 50,000 characters and 500 results; line diff capped at 500 lines per side; regex operations run in a dedicated worker terminated after 1 second, so pathological patterns cannot block the main UI thread. |
| `/xml/formatter` | XML text formatting/minifying with quote-aware tokenization, attribute and root checks; no schema validation or entity/network resolution | Not a complete XML parser or schema validator; external entities are not resolved. |
| `/sql/formatter` | Heuristic formatting/minifying of common SQL clauses | Not dialect-complete; never executes SQL. |
| `/data/csv-json` | CSV to JSON and JSON arrays of objects to CSV | CSV imports remain strings; duplicate headers are disambiguated; formula-like CSV export values are prefixed, including formula triggers after leading whitespace/control characters. |
| `/web/html-formatter` | Heuristic HTML formatting/minifying as text | Does not validate HTML or render markup. |
| `/api/curl-converter` | Parse supported cURL options and produce a redacted JavaScript fetch preview | Never sends requests; unsupported flags are disclosed; URL userinfo, recognizable query/fragment secrets, sensitive headers and secret-like bodies are redacted. |
| `/workflow/pipeline` | Typed allowlisted text/encoding/JSON/query pipelines, reorderable steps, intermediate previews, sequential line batches and versioned recipe import/export | No arbitrary code execution or input persistence; recipes and batches are size-limited; execution uses a dedicated worker with a 15-second deadline and cancellation terminates the worker; broader binary operations and persistence remain deferred; the workflow now supports byte-preserving conversion steps through raw hex and local file input up to 100 KB. |

The standalone routes above are launchable subsets backed by registry entries. `/json/diff` is a compatibility route, not a separate catalog tool. The registry status describes launchability of the current documented subset, not every capability in the broader proposal.

## Image workspace

Primary route: `/images/editor`; route slugs for legacy image tools redirect to the unified editor. Current `lib/tools/image-tools.ts` slugs: `editor`, `collage`, `metadata`, `palette`, `color-picker`, `base64`, `base64-to-image`, `favicon`, `svg-optimizer`, `dimensions`, `print-size`.

The Photo Editor implementation contains image loading, canvas-based transforms and adjustments, crop/resize, rotation/flip, text layers, export format/quality, and feature-specific controls. The broader image workbench code includes workflows for collage, metadata inspection/cleaning on export, dominant palette, pixel color sampling, Base64, favicon creation, SVG whitespace/comment optimization, dimensions, and print sizing. **Do not infer each legacy slug has a separate UI:** the dynamic route redirects non-editor slugs to `/images/editor`; the single editor is the canonical destination. Verify the currently exposed menu and each export path before claiming all listed operations are fully supported.

Implementation safety limits visible in image code include 25 MiB source size and 50 million pixels. Error states must cover decode/context failures and large files. Browser memory and format support remain relevant constraints.

## Audio workspace

Canonical route: `/audio/editor`. Legacy `/audio/[tool]` routes redirect to the unified editor with a feature query parameter. Feature slugs declared in the route are:

- Editing/arrangement: `editor`, `trimmer`, `splitter`, `merger`
- Adjustment/playback: `volume`, `compressor`, `speed`, `pitch`
- Inspection/analysis: `metadata`, `metadata-editor`, `silence-detector`, `waveform`, `frequency`
- Export/data: `converter`, `to-wav`, `base64`, `base64-to-audio`
- Capture: `recorder`

Current engine uses browser audio decoding, an audio buffer/waveform and WAV-oriented export paths. Audio merger can join multiple supported files; split behavior is limited to the current segment workflow. Playback speed is not the same as pitch-shift export. Metadata editor is currently inspection/sidecar-oriented rather than embedded tag writing. Microphone access must be requested only after explicit user action. Describe only formats and processing that are verified in the active browser.

## Video workspace

Canonical route: `/video/editor`; legacy `/video/[tool]` routes redirect to the unified editor and feature selection. Declared feature slugs include:

`trim`, `split`, `merge`, `crop`, `watermark`, `reverse`, `color`, `speed`, `audio`, `stabilize`, `metadata`, `frames`, `thumbnail`, `subtitles`, `compare`, `convert`, `compress`, `resolution`, `extract-audio`, `gif`, `clean-metadata`, `base64`, `record`.

The current browser-native path relies on video/canvas playback and MediaRecorder capabilities. Supported paths include selected-range recording/export to supported WebM, canvas transforms and filters, PNG frame capture, basic metadata display, subtitle sidecar export, Base64, and recording where supported. A split can export segments. Do not claim reliable merge/mux, universal MP4/MOV conversion, GIF encoding, frame-accurate reverse export, stabilization, or source-audio preservation on every canvas export. If the current implementation exposes a menu item for a missing engine, it must clearly communicate that it is unavailable or experimental.

## Date & Time workspace

Canonical design contract: [Date & Time Workspace and Controls](./date-time-workspace.md). The workspace introduction follows the shared editor spacing/typography contract; Date & Time selects use the shared direction-aware `NativeSelect` trigger.

Primary route: `/datetime/editor`, with related `/datetime/[tool]` routes. The unified editor declares these feature slugs:

- Date: `calendar`, `date-calculator`, `date-converter`, `date-difference`, `age`, `business-days`, `week-number`, `leap-year`, `date-format`
- Time: `world-clock`, `meeting-planner`, `countdown`, `duration`, `timestamp`
- Calendar: `calendar-generator`, `holidays`, `ics-viewer`, `ics-generator`
- Utilities: `json`, `cron`

The implementation includes locale-aware formatting through `Intl.DateTimeFormat`, time-zone formatting/conversion, selectable calendars and numbering systems, calendar date inputs, calculations, timestamps, event countdowns, calendar generation, ICS inspection/generation, JSON representations and a common five-field cron helper. Browser ICU data determines some calendar/locale support; unsupported combinations must degrade gracefully. The holiday list is an included sample, not a global authoritative holiday service. Verify daylight-saving transitions and ambiguous/nonexistent local times for time-zone conversion.

## Navigation, search, and favorites

- Tool metadata and category membership are centralized in `lib/tools/registry.ts`.
- Header search matches name, description, and keywords; Enter opens the first result.
- Home and catalog search filter the registry.
- Favorites are client-side via `lib/tools/use-favorites.ts`; do not imply cross-device sync or account persistence unless implementation changes.
- Sidebar exposes a Dev Tools catalog entry plus separate Image, Audio, Video and Date & Time workspace links. Functional categories remain discoverable inside the catalog.
- Test keyboard access, route localization, mobile drawer dismissal, collapsed sidebar labels, and search result focus/escape behavior.

## Shared interaction patterns

- `ToolLayout` provides breadcrumb, category, title/description. Do not render the repeated generic “Privacy & data” disclosure in tool interfaces; preserve independent privacy-policy/documentation pages and tool-specific safety guidance.
- Shared primitives are under `components/ui/`; current CSS variables live in `app/globals.css`.
- Media/date editors use a full-viewport editor shell, compact command bar, File/Features controls, one active feature panel, and a resizable mobile feature sheet where implemented.
- Empty-file and loaded-file states are separate experiences. Loading a file must not unexpectedly change unrelated layout, lose user edits, or leave stale object URLs.
- Use the current implementation and tests to resolve conflicts with old proposals. Record unresolved differences as audit findings rather than silently assuming desired behavior already exists.


## Date & Time calendar correctness contract

The Date & Time workspace exposes Gregorian, Persian Solar Hijri, Islamic, Islamic Umm al-Qura, Hebrew, Buddhist, and Indian calendar options through the browser's Intl implementation. Display language and calendar system are independent settings: locale controls language and default numerals, while the selected calendar controls visible calendar day numbers, month boundaries, calendar year/month/day fields, and calendar-aware arithmetic. Visible day numbers are formatted directly with the selected `Intl.DateTimeFormat` calendar. Calendar display and calendar arithmetic are distinct from storage: selected-calendar year/month/day values drive calendar views, month/year arithmetic and leap-year detection. Time-zone, timestamp, JSON and fixed-date holiday displays honor the selected calendar where applicable, while ISO/Gregorian dates remain stable internal values for timestamps, date differences, and calendar exports. Week-number results are explicitly Gregorian ISO weeks. Islamic calendar dates follow the browser's locale data and can differ between conventions. Automated regression coverage lives in `tests/date-time-fields.test.tsx` and `tests/datetime-editor.test.tsx`; unsupported Intl combinations must be reported rather than silently presented as correct.
