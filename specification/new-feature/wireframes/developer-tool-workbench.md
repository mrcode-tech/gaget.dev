# Developer Tool Workbench — Layout Record

**Status:** Proposal; this document records the current implementation and is not an approved target design.

## Desktop / wide viewport
- Existing application shell and ToolLayout breadcrumb/title remain unchanged.
- Operation-specific controls appear above the work area.
- Input panel is on the left and output panel on the right from XL width upward.
- Input has a labelled textarea, Process and Clear actions. Output has a read-only textarea and Copy/Download actions.
- Output is text-only; errors appear under output without removing source text.

## Tablet and mobile
- Panels stack in source-then-result order below XL.
- Parameter controls wrap to available width. CSV direction and delimiter remain reachable.
- Textareas are full width with a bounded minimum height; the page owns vertical scrolling.
- No horizontal scrolling is required for the page shell; long output wraps in the text area.

## Operation-specific controls
- Hash: SHA-256 / SHA-384 / SHA-512 selector.
- Regex: pattern and flags fields.
- XML, HTML and SQL: Format / Minify controls.
- CSV ↔ JSON: direction and one-character delimiter.
- cURL: source command only; output is a redacted parsed request and generated JavaScript fetch snippet.

This wireframe is editable Markdown, not a screenshot or proof of visual conformance. Matching browser evidence is captured by the CI design-baseline workflow.
