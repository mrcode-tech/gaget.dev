# JSON Workspace Contract

**Status:** Implementation contract; each source revision requires completed CI and matching visual evidence before conformance is claimed.
**Target wireframe (Proposal):** [JSON workspace layout](../assets/target/json-workspace-proposal.svg).

## Purpose and routes

The JSON workspace combines formatting, minification, strict syntax validation, structural comparison, key sorting, tree viewing, key/value search and JSON string-content escaping. It uses compact workspace mode in the regular GaGet.dev app shell: the mobile app header is replaced by the hamburger/Features command bar, while desktop retains the global app header. At widths below 768 CSS px, all File actions are grouped at the top of the Features menu; from 768px upward, File remains a separate menu. The command bar and workspace body use the full available shell width after the sidebar, with no second centered page-width wrapper. The command bar owns its horizontal padding; the workspace body uses 12px horizontal gutters below 640px, 24px from 640px through 1023px, and 32px at 1024px and wider. It adopts the established editor command-bar conventions for trigger-anchored File and Features menus, bounded menu scrolling, semantic focus states and direction-aware placement. The command bar stays sticky during document scrolling, using the viewport top on compact layouts and sitting below the 68px global header on desktop. JSON remains a regular document-flow workspace rather than a nested full-viewport media canvas. The generic “Privacy & data” disclosure is not rendered in tool interfaces.

- Canonical route: `/json/formatter`.
- Compatibility route: `/json/diff`, opening the same workspace in Compare mode.
- Parsing and transformations run locally in the browser. Do not send JSON source to a server or external service.
- The source is not changed by a transform until the user explicitly runs that operation.

## Workspace contract

- File actions: import JSON, copy/download, undo/redo, load sample and clear. The File trigger and its action menu are available at every breakpoint; mobile File actions are not duplicated inside the Feature menu.
- The command bar has exactly four menu triggers on desktop/tablet widths (768 CSS px and above), ordered left-to-right in LTR as File, Utilities (Core Tools), View, and Convert. File opens file/history actions. Utilities (Core Tools) opens Format, Minify, Validate, Compare, and Sort Keys; View opens Tree Viewer and Find Keys and Values; Convert opens Escape and Unescape string contents. Each feature category is its own top-level menu, not a heading nested inside a single Features menu. Use the existing localized JSON group keys and keep all four triggers aligned together at the start of the command bar.
- Below 768 CSS px, show exactly two command-menu triggers: File and the singular Feature. File opens file/history actions. Feature opens one flat list of all nine JSON operations with no category headings, accordion controls, or disclosure arrows. Show the shared feature-search input only when the list has more than eight operations; search filters operation title, description, and group text, displays a localized no-results state, and resets on close/reopen. Every listed operation must work; do not show placeholder actions.
- The editor uses a one-based line-number gutter beside one no-wrap textarea. The gutter follows vertical scroll; the editor owns horizontal scrolling. No second editor is used to draw line numbers.
- At wide screens, the source editor and a relevant secondary workspace panel can sit side by side; at narrower widths they stack. Validate and Find keys/values are single-column, result-only operations and do not reserve an output panel. Format, Minify, Sort Keys, Escape and Unescape show a transformed-text output panel; Tree Viewer shows its tree panel; Compare uses two source editors and its own difference results. Menus remain below the command bar and cap at 180px with internal scrolling when viewport height is 700px or less; otherwise they use the shared viewport-bounded maximum height.
- JSON source is always LTR even when surrounding labels are Persian or Arabic RTL.

## Supported operations

| Operation | Behavior |
|---|---|
| Format | Strictly parse and pretty-print with two-space indentation. |
| Minify | Strictly parse and serialize without optional whitespace. |
| Validate | Report valid syntax or a structured source diagnostic. |
| Compare | Compare parsed values, ignore object key order, preserve array order, and report added/removed/changed values. Previous/next controls navigate the difference cards. Missing properties differ from properties set to `null`; semantic differences do not claim exact source offsets. |
| Sort keys | Recursively sort object keys and preserve array order/scalar values. |
| Tree viewer | Expand/collapse nested objects and arrays and show scalar types. |
| Find keys/values | Case-insensitive substring search of object keys and scalar values; previous/next controls navigate result rows, and results are capped at 1,000. Exact source offsets are deferred because duplicate values require reliable token spans. |
| Escape string contents | Escape raw text for use inside a JSON string without adding surrounding quotes. |
| Unescape string contents | Decode escaped JSON string contents; invalid input is not silently changed. |

Comparison paths use `$` as root, dot notation for identifier-like keys (for example `$.profile.name`), bracket-quoted JSON strings for unusual keys (for example `$["a.b"]`), and zero-based array indices (for example `$.items[0]`).

## Result presentation and operation actions

- Result presentation is explicitly operation-specific: output-producing transforms show the output panel; Validate presents status/diagnostics only; Find keys/values presents match results only; Tree Viewer presents the tree; Compare presents its two inputs and difference list. Do not render an empty output panel or retain an empty grid column for Validate or Find.
- The operation title and description precede the primary Run action. Below the existing `md` breakpoint (768px), stack the action beneath the description and make it full width; at tablet/desktop widths, align it beside the description when space permits. Use existing button primitives and support long translated text and RTL direction without clipping or horizontal overflow.
- Do not repeat the JSON-specific local-processing disclosure inside the workspace or its File menu. Preserve the independent shared tool privacy disclosure and the actual local-only processing behavior.

## Diagnostics

- Syntax diagnostics include category, severity, message, UTF-16 source offset/range and one-based line/column.
- Positions come from the workspace's strict scanner, not guessed parsing of engine-specific `JSON.parse` error messages.
- LF and CRLF are supported. JavaScript textarea selection offsets and columns both count UTF-16 code units.
- Activating a diagnostic focuses the correct source editor and selects the offending character where one exists.
- Editing either source clears stale results/diagnostics immediately. Empty/whitespace input receives a clear input diagnostic at offset zero.
- JSON Schema and semantic diagnostics are not currently implemented and must remain separate from syntax validation.

## File and history behavior

- Import accepts JSON files up to 10 MiB. Failed reads and oversized files preserve the current document.
- JSON output downloads as a local `application/json` file named `document.json`. Escape/Unescape string-content results download as `text/plain` in `string-content.txt`, including an empty valid result. Copy reports clipboard API failures.
- Undo/redo stores up to 50 source snapshots for both editor inputs. Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z and Ctrl/Cmd+Y are supported.
- Clear is undoable. Sample JSON is local and deterministic.

## Responsive, accessibility and localization

Use the existing Tailwind breakpoints, not a JSON-specific breakpoint system. Verify wide desktop, tablet portrait, mobile portrait, mobile landscape/short height, and resizing while content or diagnostics are present. Exercise widths 1023, 1024 and 1025px around the existing `lg` boundary while a diagnostic and menu are open. Menus expose expanded state and support Escape. On narrow viewports, open File and Feature menus are anchored below their trigger and use viewport-inset positioning so long translated labels and RTL direction cannot push the menu beyond either horizontal edge; menus retain bounded vertical scrolling. The mobile JSON Feature menu is a flat list with no category accordion headings or disclosure arrows; search is shown only for more than eight operations. Desktop exposes four separate triggers: File, Utilities (Core Tools), View, and Convert (localized through existing keys). Diagnostic navigation is a named keyboard-operable button; error/success states do not rely on color alone. Code remains LTR in RTL interfaces. User-facing strings use the existing localization dictionary; English, Persian and Arabic workspace labels/actions/diagnostics are translated, while other locales fall back to English until reviewed translations are added.

## Limits and deferred capabilities

- Import limit: 10 MiB; parser nesting limit: 512; search-result limit: 1,000.
- Tree rendering is limited to 2,000 visited nodes and depth 60; additional content is represented by localized truncation markers.
- Parsing is synchronous and local; worker execution/cancellation is not claimed.
- Planned, not implemented: JSONPath (choose a dialect first); flatten/unflatten (define escaped delimiters and round-trip behavior); JSON Schema validation/schema generation (select version and prohibit implicit remote fetches); JSON repair (preserve original source and show proposed changes separately); YAML/CSV/XML/TypeScript conversions (define lossy mappings); table view for arrays of objects (define column typing and handling of nested or heterogeneous rows); deep merge and advanced diff policies (define array/primitive/null conflicts); report export and editor preferences; exact source mapping for tree/search results; source-offset navigation from semantic comparison results.
- Do not expose planned capabilities as working menu entries.

## Acceptance criteria

- [x] Format/minify/validate/compare work for valid and invalid inputs.
- [x] Validate and Find keys/values show their operation-specific status/results without an irrelevant output panel; transformed output, Tree Viewer and Compare presentations remain available as appropriate.
- [x] The Run action stacks below its description below 768px and aligns responsively at wider widths; no repeated JSON-specific privacy disclosure appears in the workspace or File menu.
- [x] Diagnostics have dependable source offsets and navigate to the correct editor; stale diagnostics clear after edits.
- [x] LF/CRLF, strings/escapes, numbers/literals, nesting and edit/fix cycles have regression tests.
- [x] Compare distinguishes missing/null and uses unambiguous paths.
- [x] Sort/tree/find/escape/unescape work and are tested.
- [x] File import/export/copy/sample/clear/undo/redo work locally.
- [ ] Desktop shows exactly four adjacent triggers (File, Utilities (Core Tools), View, Convert), each opening only its own actions; mobile shows exactly two menu triggers (File, Feature), with a flat nine-operation Feature list and search for more than eight features; menus remain within the viewport in LTR and RTL.
- [x] Desktop, tablet, mobile portrait and short-height landscape E2E checks pass.
- [x] Persian/Arabic surrounding UI remains RTL without reversing JSON source.
- [x] The exact final CI run and its screenshot/manifest artifact are inspected before marking this contract verified.
