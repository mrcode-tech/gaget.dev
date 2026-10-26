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

See [Tool Catalog and Workspace Architecture](./tool-catalog-and-workspace-architecture.md) for the category/workspace/operation model and candidate boundaries. The registry records stable IDs, explicit availability status, and standalone/workspace kind. The JSON Workspace consolidates format, minify, validate and structural compare; `/json/diff` opens Compare mode for compatibility. Hash Generator is implemented at `/security/hash`; its full CI and browser verification is pending. Regex Tester, XML Formatter, SQL Formatter, CSV ↔ JSON, HTML Formatter, and cURL Converter remain planned until their route and runtime behavior are verified.

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
| `/encoding/url` | Encode/decode URL components | Decode errors are surfaced. This is component encoding, not full URL validation. |
| `/encoding/base64` | UTF-8 text Base64 encode/decode | Distinguish text Base64 from media Base64 tools. |
| `/security/jwt-decoder` | Decode JWT header and claims; inspect expiration | **Does not verify signatures.** This must remain explicit. |
| `/security/hash` | SHA-256, SHA-384, and SHA-512 for UTF-8 text or files up to 32 MiB using Web Crypto | Local browser processing; files are loaded fully into memory. HMAC, MD5, SHA-1, streaming, and authenticity verification are not supported. CI/browser verification pending. |
| `/generators/uuid` | Generate UUID v4 values with browser cryptographic API | Do not claim server-side uniqueness guarantees. |

The route tree also contains planned registry destinations for Regex Tester, XML Formatter, SQL Formatter, CSV ↔ JSON, HTML Formatter, and cURL Converter. Hash Generator now has a route and is marked available in the registry; see the capability notes above. A registry item with `status: "planned"` is not an implemented route. Reconcile catalog status with actual route existence when adding tools.

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
