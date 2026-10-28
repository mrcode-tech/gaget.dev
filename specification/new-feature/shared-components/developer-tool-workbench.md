# Developer Tool Workbench Contract

**Status:** Implemented; target layout remains a proposal.

## Purpose and boundary
`DeveloperToolWorkbench` composes existing design-system primitives into a shared text-first workbench for the Hash Generator, Regex Tester, XML Formatter, SQL Formatter, CSV ↔ JSON, HTML Formatter, and cURL Converter. It does not own navigation, server processing, or persistence. File-byte workflows are limited to the explicitly bounded hash and encoding controls.

## API
- `operation`: one of `hash | regex | xml | sql | csv-json | html | curl`.
- Input and output remain separate. Source stays editable after errors; result is read-only until a new operation run.
- Operation controls are specific to the selected operation: digest algorithm, regex pattern/flags, CSV direction/delimiter, or format/minify.
- Copy and download apply only to displayed output. Errors are announced with `role="alert"`.

## States
- Empty input: Process is disabled except for hashing, where the empty string is a valid digest input.
- Processing: primary action is disabled and labelled Processing.
- Success: output appears in a separate read-only textarea.
- Error: preserve source, clear stale output, and announce an actionable message.
- Unsupported syntax: formatter/parser notes describe limitations; cURL unsupported flags are included in the structured preview.

## Privacy and safety
- All operations run in the browser. No tool sends input to a server, database, or external API.
- HTML is displayed only in a textarea and never injected as active markup.
- SQL is never executed. cURL is parsed as text and never executed; likely sensitive headers, bodies and query parameters are redacted in the preview.
- Hashing uses Web Crypto SHA-2 and is not encryption. Regex output is capped, but JavaScript regex execution cannot be forcibly interrupted; pathological patterns can still block the tab.
- Inputs are not written to URLs, storage, analytics, or logs by the workbench.

## Responsive and accessibility behavior
- Existing global shell and `ToolLayout` remain responsible for navigation and page gutters.
- Input and output panels are side-by-side at XL widths and stack below XL. Controls wrap on narrow screens.
- Every textarea and parameter input has an accessible name. Primary actions use visible text; copy/download icon buttons have accessible labels. Errors are announced; keyboard interaction relies on native controls and shared Button primitives.
- Use semantic theme classes and existing shared primitives. Do not introduce one-off colors, shadows, or breakpoints.
