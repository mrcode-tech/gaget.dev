# Tool Catalog and Workspace Architecture

**Status:** Implemented navigation and JSON workspace baseline. The seven formerly planned standalone routes now have browser-local workbenches and operation/route verification; their exact capability limits are recorded in the product inventory. Other registry entries retain planned status until their routes and runtime behavior are verified.

## Purpose and vocabulary

Keep three concepts independent:

- **Functional category:** a discovery grouping based on the user's task. It may contain workspaces and standalone tools.
- **Workspace:** a cohesive application with shared editing state, input/output model, interaction patterns, and related operations.
- **Tool/operation:** a specific capability. A standalone tool owns its own workflow; a workspace operation is selected inside its owning workspace.

A category must not imply that its tools share an editor. A registry entry or visible link does not prove that a route or capability is implemented.

## Current contract

`lib/tools/registry.ts` is the source for catalog tool identity, discovery metadata, canonical destination, availability, and whether the entry is a workspace or standalone tool. Each entry has a stable kebab-case `id`, an explicit `status` (`available` or `planned`), and a `kind`. Workspace entries declare a typed `workspaceId`; standalone entries must not claim one.

The catalog must render available tools as launchable links and planned tools as clearly marked, non-launchable entries. Planned status must not be inferred from a route string or name. Keep canonical routes stable. Any future alias or redirect must be explicit, unique, and tested.

`developerTools` is derived from the authoritative `tools` registry and contains standalone utilities plus the JSON workspace only. `developerToolCategories` derives from the same registry and includes only categories with developer-tool entries. The Dev Tools catalog searches and groups this developer-only set; it must not consume the entire application registry directly or render Photo, Audio, Video, or Date & Time workspaces.

## Current workspace boundaries

| Registry entry | Canonical route | Decision | Rationale |
|---|---|---|---|
| Photo Editor | `/images/editor` | Workspace | Image operations share image/canvas state and export workflow. |
| Audio Editor | `/audio/editor` | Workspace | Audio operations share file, waveform/playback and export concerns, with feature-specific capability limits. |
| Video Editor | `/video/editor` | Workspace | Video operations share media playback, timeline/seek and browser capability constraints. |
| Date & Time Editor | `/datetime/editor` | Workspace | Date/time utilities share locale, calendar, time-zone and date-value semantics. |
| JSON Workspace | `/json/formatter` | Workspace | Format, minify, validate, compare, sort keys, tree, find, and escape/unescape are operations inside one workspace; `/json/diff` remains a compatibility entry point into Compare mode. See [JSON Workspace Contract](./json-workspace.md). |
| URL Encoder / Decoder | `/encoding/url` | Standalone for now | Component encoding has reserved-character and malformed-input semantics distinct from Base64. |
| Base64 Encoder / Decoder | `/encoding/base64` | Standalone for now | Text encoding requires explicit UTF-8 and invalid-input behavior. Similar input/output UI alone is insufficient reason to merge. |
| JWT Decoder | `/security/jwt-decoder` | Standalone | Token inspection differs from hashing and does not verify a signature. |
| UUID Generator | `/generators/uuid` | Standalone | Focused generation workflow. |
| Hash Generator | `/security/hash` | Available with documented limits | Keep separate from JWT inspection; verify cryptographic implementation before launch. |
| Regex Tester | `/text/regex` | Available with documented limits | Distinct pattern-and-sample testing workflow. |
| XML Formatter | `/xml/formatter` | Available with documented limits | Standalone formatting workflow. |
| SQL Formatter | `/sql/formatter` | Available with documented limits | Standalone SQL-specific formatting workflow. |
| CSV ↔ JSON | `/data/csv-json` | Available with documented limits | Conversion workflow; do not combine with XML merely because both concern data formats. |
| HTML Formatter | `/web/html-formatter` | Available with documented limits | Standalone markup formatting workflow. |
| cURL Converter | `/api/curl-converter` | Available with documented limits | Request parsing and client-code generation are distinct from formatters. |

These decisions describe current source boundaries. The seven newly implemented standalone routes are available with the limitations documented in the product inventory; any remaining planned entry must stay unavailable until source routes, behavior and tests prove otherwise.

## Proposed functional taxonomy

Prefer a small taxonomy grounded in user intent:

| Category | Scope | Candidate tools | Boundary |
|---|---|---|---|
| Data & Formats | Read, validate, format or transform structured data | JSON Formatter; XML Formatter; CSV ↔ JSON | Keep different document models as separate tools unless a shared workflow is proven. |
| Encoding & Conversion | Transform representations of text/data | URL Encoder / Decoder; Base64 Encoder / Decoder | Share category discovery, not necessarily an editor or state. |
| Security | Inspect token structure or compute digests | JWT Decoder; Hash Generator | Category only; independent workflows. |
| Generators | Create identifiers and similar values | UUID Generator | Group by generation intent. |
| Code & Text | Inspect or format text/code patterns | Regex Tester; HTML Formatter | Do not combine unrelated editing models. |
| Database & SQL | Work with SQL statements | SQL Formatter | Keep focused. |
| Web & API | Inspect HTTP requests and related representations | cURL Converter | Keep focused. |

The current media and Date & Time destinations remain first-class global workspace destinations, not children of this developer-tool taxonomy. The existing category URLs must remain compatible; if labels or category membership change, preserve old slugs through deliberate mappings and regression tests rather than silently changing destinations.

## Navigation and discovery contract

- The main sidebar orders workspace destinations as **Photo, Audio, Video, Date & Time, Dev Tools**, with Dev Tools immediately after Date & Time. Home, Popular tools and Favorites remain application-level shortcuts.
- Clicking Dev Tools opens `/tools`, a dedicated developer-only catalog. Its category sections are derived from `developerToolCategories`; search is restricted to `developerTools`. Photo, Audio, Video and Date & Time remain independent workspaces and must never appear as catalog categories or cards.
- Keep functional categories inside the Dev Tools catalog instead of listing every category globally.
- Search matches developer-tool name, description, category and keywords, case-insensitively; media/date-time workspace metadata is excluded before searching.
- Render tools in category sections, omit categories with no matching tools, and preserve one primary category per tool. Show planned tools only as explicitly labelled, non-launchable cards.
- Category discovery must not duplicate a canonical tool entry merely because a tool has secondary search keywords.
- Use existing localized strings and design-system components. Persian and Arabic require verified RTL alignment and logical icon/control placement; translations alone are not RTL verification.
- Keep privacy claims specific to the actual processing path. Do not imply server-free processing for an operation until its implementation supports that claim.

## Verification contract

Registry and workspace tests cover stable unique IDs, unique canonical destinations, category membership, explicit status, workspace IDs, and canonical workspace routes. JSON tests cover structural comparison including object key-order independence, nested edits, additions/removals, arrays, and invalid input. Keep `/json/diff` as a tested compatibility route into Compare mode. Catalog/browser tests must verify search, category discovery, empty results, planned-state non-launchability, direct canonical routes, legacy aliases, keyboard access, responsive behavior, and Persian/Arabic RTL.

A green CI run is evidence only for the exact tested revision. Inspect its required job results, generated manifest and artifact contents. A mockup is target-design evidence, not proof that the running application conforms. Keep authored target wireframes labelled **Proposal** until explicitly approved.
