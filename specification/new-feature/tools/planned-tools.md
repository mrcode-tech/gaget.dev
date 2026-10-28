# Existing Planned Developer Tools

Source of status: lib/tools/registry.ts. Route strings are candidates, not proof a route or capability exists.

## Hash Generator — hash-generator
Route candidate /security/hash; Security; phase 4. Text and optional file-byte input. Algorithm selector lists only implemented algorithms. Output shows algorithm, input type and digest representation with copy. No input persistence/logging. Test known vectors, empty input, Unicode, bytes, large inputs and unavailable APIs.

## Regex Tester — regex-tester
Route candidate /text/regex; Text; phase 3. Separate pattern, flags and sample text. Show matches, ranges, captures and count. Replacement preview must not silently alter source. Test malformed/empty patterns, Unicode, zero-width matches, large input and pathological patterns.

## XML Formatter — xml-formatter
Route candidate /xml/formatter; Data Formats; phase 3. Format/minify XML; no implied schema validation. Invalid syntax gives actionable error; external entities and remote resolution disabled. Test namespaces, comments, CDATA, declarations and malformed nesting.

## SQL Formatter — sql-formatter
Route candidate /sql/formatter; SQL; phase 3. Formatter only; no SQL execution/database connection. Define dialects and report unsupported syntax. Test comments, strings, quoted identifiers, nested expressions and dialect-specific constructs.

## CSV ↔ JSON — csv-json-converter
Route candidate /data/csv-json; Data Formats; phase 3. Explicit direction, delimiter/quote/header/empty-cell/type policy. Test quoted newlines, duplicate headers, uneven rows, BOM, Unicode, nulls and nested JSON. Define safe CSV export behavior for formula-like cells.

## HTML Formatter — html-formatter
Route candidate /web/html-formatter; Web & API; phase 3. Format/minify as text without executing markup; preserve mixed inline text and raw script/style bodies, and respect quoted tag delimiters. This remains a heuristic formatter, not an HTML validator. Test malformed markup, comments, script/style content, Unicode and large inputs.

## cURL Converter — curl-converter
Route candidate /api/curl-converter; Web & API; phase 3. Parse supported command into request model and generate selected client snippets. Never execute; report unsupported flags rather than dropping semantics; redact likely secrets by default. Test quoting, multiline commands, headers, body variants, unknown flags and malformed input.

## Availability gate
A planned tool stays non-launchable until its route loads directly, the operation works beyond a shell, invalid/empty/boundary cases are handled, tests and responsive/accessibility checks pass, and registry/localization/docs agree with verified behavior.
