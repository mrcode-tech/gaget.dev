# JSON Workspace Contract

**Status:** Implemented workspace baseline; exact CI and browser evidence are required before claiming verification.
**Target wireframe (Proposal):** [JSON workspace layout](../assets/target/json-workspace-proposal.svg).

## Purpose and routes

The JSON workspace combines formatting, minification, strict syntax validation, structural comparison, key sorting, tree viewing, key/value search and JSON string-content escaping. It uses compact workspace mode in the regular GaGet.dev app shell: the mobile app header is replaced by the hamburger/File/Features command bar, while desktop retains the global app header. It adopts the established editor command-bar conventions for trigger-anchored File and Features menus, bounded menu scrolling, semantic focus states and direction-aware placement.

- Canonical route: `/json/formatter`.
- Compatibility route: `/json/diff`, opening the same workspace in Compare mode.
- Parsing and transformations run locally in the browser. Do not send JSON source to a server or external service.
- The source is not changed by a transform until the user explicitly runs that operation.

## Workspace contract

- File menu: import JSON, copy/download, undo/redo, load sample and clear.
- Features menu groups Core JSON, Inspect and Navigate, and Transform. Every listed operation must work; do not show placeholder actions.
- The editor uses a one-based line-number gutter beside one no-wrap textarea. The gutter follows vertical scroll; the editor owns horizontal scrolling. No second editor is used to draw line numbers.
- At wide screens, editor and result can sit side by side; at narrower widths they stack. Menus are viewport-bounded and internally scrollable.
- JSON source is always LTR even when surrounding labels are Persian or Arabic RTL.

## Supported operations

| Operation | Behavior |
|---|---|
| Format | Strictly parse and pretty-print with two-space indentation. |
| Minify | Strictly parse and serialize without optional whitespace. |
| Validate | Report valid syntax or a structured source diagnostic. |
| Compare | Compare parsed values, ignore object key order, preserve array order, and report added/removed/changed values. Missing properties differ from properties set to `null`. |
| Sort keys | Recursively sort object keys and preserve array order/scalar values. |
| Tree viewer | Expand/collapse nested objects and arrays and show scalar types. |
| Find keys/values | Case-insensitive substring search of object keys and scalar values; results capped at 1,000. |
| Escape string contents | Escape raw text for use inside a JSON string without adding surrounding quotes. |
| Unescape string contents | Decode escaped JSON string contents; invalid input is not silently changed. |

Comparison paths use `$` as root, dot notation for identifier-like keys (for example `$.profile.name`), bracket-quoted JSON strings for unusual keys (for example `$["a.b"]`), and zero-based array indices (for example `$.items[0]`).

## Diagnostics

- Syntax diagnostics include category, severity, message, UTF-16 source offset/range and one-based line/column.
- Positions come from the workspace's strict scanner, not guessed parsing of engine-specific `JSON.parse` error messages.
- LF and CRLF are supported. JavaScript textarea selection offsets and columns both count UTF-16 code units.
- Activating a diagnostic focuses the correct source editor and selects the offending character where one exists.
- Editing either source clears stale results/diagnostics immediately. Empty/whitespace input receives a clear input diagnostic at offset zero.
- JSON Schema and semantic diagnostics are not currently implemented and must remain separate from syntax validation.

## File and history behavior

- Import accepts JSON files up to 10 MiB. Failed reads and oversized files preserve the current document.
- Download creates a local `application/json` file named `document.json`; copy reports clipboard API failures.
- Undo/redo stores up to 50 source snapshots for both editor inputs. Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z and Ctrl/Cmd+Y are supported.
- Clear is undoable. Sample JSON is local and deterministic.

## Responsive, accessibility and localization

Use the existing Tailwind breakpoints, not a JSON-specific breakpoint system. Verify wide desktop, tablet portrait, mobile portrait, mobile landscape/short height, and resizing while content or diagnostics are present. Menus expose expanded state and support Escape. Diagnostic navigation is a named keyboard-operable button; error/success states do not rely on color alone. Code remains LTR in RTL interfaces. User-facing strings use the existing localization dictionary; English, Persian and Arabic workspace labels/actions/diagnostics are translated, while other locales fall back to English until reviewed translations are added.

## Limits and deferred capabilities

- Import limit: 10 MiB; parser nesting limit: 512; search-result limit: 1,000.
- Tree rendering is limited to 2,000 visited nodes and depth 60; additional content is represented by localized truncation markers.
- Parsing is synchronous and local; worker execution/cancellation is not claimed.
- Planned, not implemented: JSONPath (choose a dialect first); flatten/unflatten (define escaped delimiters and round-trip behavior); JSON Schema validation/schema generation (select version and prohibit implicit remote fetches); JSON repair (preserve original source and show proposed changes separately); YAML/CSV/XML/TypeScript conversions (define lossy mappings); deep merge and advanced diff policies (define array/primitive/null conflicts); report export and editor preferences; exact source mapping for tree/search results.
- Do not expose planned capabilities as working menu entries.

## Acceptance criteria

- [ ] Format/minify/validate/compare work for valid and invalid inputs.
- [ ] Diagnostics have dependable source offsets and navigate to the correct editor; stale diagnostics clear after edits.
- [ ] LF/CRLF, strings/escapes, numbers/literals, nesting and edit/fix cycles have regression tests.
- [ ] Compare distinguishes missing/null and uses unambiguous paths.
- [ ] Sort/tree/find/escape/unescape work and are tested.
- [ ] File import/export/copy/sample/clear/undo/redo work locally.
- [ ] Desktop, tablet, mobile portrait and short-height landscape E2E checks pass.
- [ ] Persian/Arabic surrounding UI remains RTL without reversing JSON source.
- [ ] The exact final CI run and its screenshot/manifest artifact are inspected before marking this contract verified.
