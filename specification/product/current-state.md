# Current-State Product Baseline

**Scope:** Application-wide source baseline. Re-check source, tests, and the latest matching CI evidence before relying on any implementation claim.

**Evidence policy:** This page records durable source-derived facts and open verification gaps. It does not identify a task branch or commit. CI results and generated screenshots are tied to the exact build that produced them; inspect the latest run for the change being evaluated. Source inspection alone is not runtime or visual verification.

## What exists today

### Application shell
- Next.js App Router with shared `AppShell`, `AppHeader`, and `AppSidebar`.
- Desktop sidebar expands to 248px and collapses to 64px at the large-screen breakpoint; shell offsets content according to sidebar state and text direction.
- The global header is 68px high. Photo, Audio, Video, and Date & Time editor routes use a compact editor command bar as the single navigation row below the large-screen breakpoint.
- The Date & Time compact command bar places the hamburger and File trigger on the left and Features on the right; the hamburger opens the shared mobile sidebar drawer.
- Theme and language controls are shared. Persian and Arabic are RTL; translation completeness varies by route and string.

### Home and discovery
- `/` is the home/discovery experience.
- `/tools` is the Dev Tools catalog.
- `/categories/[slug]` is a category landing page.
- Tool registry metadata drives search, catalog categories, featured/favorite experiences and tool links. The sidebar orders Photo, Audio, Video, and Date & Time workspaces followed immediately by Dev Tools. The `/tools` catalog includes only standalone developer utilities and the JSON workspace, grouped into non-empty functional categories; it excludes media and date/time workspaces. Tool entries declare stable IDs, explicit availability status, and standalone/workspace kind; workspace entries declare their canonical workspace ID. A registry entry is not proof that a destination exists or that a capability works. See [Tool Catalog and Workspace Architecture](./tool-catalog-and-workspace-architecture.md) for the category/workspace model and verification contract.

### Main workspaces
- `/images/editor`: unified image/photo workspace. Legacy image slugs redirect to the editor. Source includes canvas-based image adjustments, crop/resize, transforms, text layers, and format/quality export controls; verify each active path before making broader capability claims.
- `/audio/editor`: unified audio workspace with feature selection, file workflow and browser-native audio operations. Export and metadata behavior vary by feature.
- `/video/editor`: unified video workspace based on browser media, canvas and MediaRecorder capabilities. Codec/export support is browser-dependent; some features are preview-only or experimental.
- `/datetime/editor`: unified date/time workspace with date, time, calendar and utility features. Locale/calendar behavior depends partly on browser internationalization data.

### Standalone tools
- `/json/formatter` — JSON Workspace with Format, Minify, Validate, Compare, Sort Keys, Tree Viewer, Find Keys/Values and Escape/Unescape operations, structured source diagnostics and local File actions. Its command bar spans the available workspace width; below 768 CSS px, File and Feature are separate menus, with File on the left and Feature aligned to the right; tablet/desktop show separate File, Utilities, View and Convert menus. Operation status and diagnostics are placed near the top of the workspace.
- `/json/diff` — compatibility route opening Compare mode in the JSON Workspace.
- `/encoding/url` — unified text-representation workbench for URL components, Base64/Base64url, Base32, hex, binary bytes, basic HTML entities, Unicode escapes, quoted-printable, Bitcoin Base58, Adobe ASCII85, ZeroMQ Z85, and UTF-8/UTF-16LE/BE/Windows-1252 conversion via hex bytes or local-file decoding; URL, HTML-entity and Unicode-escape modes accept selected files as strict UTF-8 text. Base64/Base64url/Base32/hex/binary/Base58/ASCII85/Z85/quoted-printable support local raw-byte encode/decode and byte downloads within explicit limits.
- `/encoding/base64` — compatibility redirect to `/encoding/url?mode=base64`; it is not a separate catalog tool.
- `/security/jwt-decoder` — decodes JWT contents but does not verify signatures.
- `/generators/uuid` — generates UUID v4 values using the browser cryptographic API.
- `/generators/sample-data` — generates synthetic JSON records, random strings and integers, timestamps, and UUID batches with bounded counts and lengths.
- `/security/hash` — SHA-256/384/512 digests and HMAC-SHA-2 over text or local file bytes (2 MB file limit), plus CRC32/IEEE, CRC-16/CCITT-FALSE and Adler-32 text/file checksums; uses Web Crypto for cryptographic algorithms and does not encrypt. The shared workbench label is Hash & Checksum Generator.
- `/data/binary-math` — URL component parsing with repeated query values and credential redaction; query-string/key-value conversions, number/bitwise/float views, bounded byte analysis and gzip/zlib-wrapped DEFLATE operations.
- `/inspection/network-file` — offline IP/CIDR/MAC, HTTP-header/cookie/DNS parsing, HTTP message redaction of sensitive headers, recognizable secret URL query parameters and URL-bearing Location/Referer headers, file signatures and selected local PNG/GIF/BMP/JPEG/WebP/WAV/AVI/MP4-family/FLAC/Ogg/PDF/ZIP/ID3/PE/ELF/Mach-O metadata. PEM/DER container inspection reports labels/outer lengths and SHA-256 fingerprints; it does not validate certificate trust.
- `/text/regex` — reports matches, indexes and capture groups with a 50,000-character input cap and 500-match output cap. Regex matching and replacement run in a dedicated worker terminated after 1 second, keeping pathological patterns from blocking the tab.
- `/xml/formatter` — lightweight XML text formatting/minifying with element-nesting checks; not a complete XML parser or schema validator.
- `/sql/formatter` — heuristic SQL formatting/minifying only; no dialect-complete parser or query execution.
- `/data/csv-json` — CSV and JSON-array-of-objects conversion; CSV cells remain strings and formula-like exported cells are prefixed.
- `/web/html-formatter` — heuristic HTML text formatting/minifying that preserves mixed inline text, respects quoted tag delimiters, and treats script/style bodies as raw text; markup is never rendered as active HTML and full HTML validation is not claimed.
- `/api/curl-converter` — parses a supported cURL subset including GET query mode, literal URL-encoded data and --json body shorthand, produces a redacted request preview (URL credentials, recognizable query/fragment values, sensitive headers and secret-like bodies), never executes requests, and reports unsupported flags.
- `/workflow/pipeline` — typed allowlisted text/encoding/JSON/query pipeline (including ASCII85 and Z85) with reorderable steps, bounded intermediate previews, sequential line batches and versioned recipe import/export; each run executes in a dedicated worker and cancellation terminates it; no arbitrary code execution or input persistence.

Broader capability families in the developer-tools proposal (full format parsers, advanced certificate/key parsing, archive formats, deeper metadata parsers and advanced workflow features) remain incomplete or conditional; do not infer their availability from these routes.

## Current implementation-level design facts

- Semantic theme CSS variables are defined in `app/globals.css` using HSL channels, with light and dark values.
- Shared primitives exist under `components/ui/`, including the Date & Time native select wrapper for consistent, direction-aware select triggers; application styling also uses Tailwind utilities directly, so design tokenization is partial.
- Media and date/time editor routes use a full-viewport shell, specialized command bars and feature controls. Their internal panels and scroll ownership are not assumed to be identical.
- The shared editor contract describes compact navigation, trigger-anchored File/Features menus, responsive panel bounds, theme/RTL behavior, and mobile-only Features search. The contract and authored SVGs remain proposals unless separately approved.
- Browser-native media processing is constrained by codec availability, file size, memory and browser APIs. Documentation must distinguish actual export from preview, sidecar output and unavailable processing.

## Verification status and known gaps

- Automated unit, component, lint, typecheck, production build, route smoke, Playwright E2E and design-baseline capture scripts are defined in `package.json` and `.github/workflows/ci.yml`.
- CI uploads test logs, Playwright output, screenshot captures and a verification manifest. Use the artifact from the exact run for the change under review; do not treat an older artifact as evidence for a different build.
- The CI screenshot matrix covers initial/default states at representative mobile, short-height mobile, tablet and desktop dimensions, light/dark themes and selected Persian/Arabic routes. This does not by itself establish complete visual conformance.
- Loaded media, feature-active panels, explicit error/disabled states, keyboard/focus behavior, reduced motion and comparison against authored target designs require additional targeted evidence where not covered by tests.
- The repository workflow currently uses `npm install` because its comments identify the lockfile as stale. The dependency-install concern should be reproduced and resolved before changing the workflow to `npm ci`.
- This source-level specification alone does not imply that tests, a build, or visual review passed.

## Required follow-up before declaring conformance

1. Reconcile App Router routes and redirects against `lib/tools/registry.ts`, feature slugs, sitemap and smoke/E2E tests.
2. Inspect each route and shared component with its consumers and tests; maintain an evidence-based route/component coverage matrix.
3. Add canonical feature contracts and editable target wireframes where expected behavior is missing. New designs remain proposals until approved.
4. Reproduce the dependency-install issue and run unit/component tests, lint, typecheck, build, smoke and Playwright checks on the evaluated build.
5. Inspect rendered screenshots from the exact evaluated build, including empty/loaded/error/active states, short viewports, themes, RTL, keyboard/focus, menu anchoring and scroll ownership.
6. Update this page only when durable implementation facts or verification status change. Keep task progress and build-specific evidence in pull requests and CI artifacts, not as a rolling audit diary.
