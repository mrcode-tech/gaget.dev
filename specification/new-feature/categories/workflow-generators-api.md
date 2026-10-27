# Workflow, Generators & API Developer Helpers

## Workflow & Batch Processing — implemented safe subset; advanced execution/persistence deferred

| ID | Operation | Contract |
|---|---|---|
| flow.pipeline | Chain compatible operations | Implemented allowlisted typed text/encoding/JSON/query operations; incompatible steps blocked before run; 20-step cap |
| flow.reorder | Reorder/configure steps | Implemented up/down reordering; failures identify step index and operation |
| flow.intermediate | Inspect intermediate output | Implemented previews capped at 2,000 characters per step; only allowlisted non-secret operations |
| flow.batch | Process records | Implemented sequential line batches capped at 100 records and 200,000 total input characters with per-line errors; workers/cancellation remain deferred |
| flow.recipe | Import/export versioned recipes | Implemented version 1 JSON import/export, 32 KB cap, strict field/operation/compatibility validation; recipes contain no input or secret values |
| flow.persistence | Save recipes | Defer persistence decision; do not store inputs/secrets by default |

Do not build a pipeline engine until several operation contracts, errors and resource limits are stable.

## Generators

| ID | Operation | Contract |
|---|---|---|
| gen.uuid-v4 | Existing UUID v4 | Registry ID uuid-generator, route /generators/uuid; verify randomness and output |
| gen.random-data | Sample strings/numbers/records | Seed/randomness semantics explicit; ordinary randomness is not cryptographically secure |
| gen.timestamps | Timestamp forms | Seconds/milliseconds and timezone conventions explicit |
| gen.identifiers | Selected identifiers | Stable format and collision expectations documented |
| gen.payloads | Structured sample payloads | Synthetic examples only; no real user data |

## API & Developer Helpers

| ID | Operation | Contract |
|---|---|---|
| api.curl-parse | Parse supported cURL commands | Never execute; report unsupported flags rather than dropping them |
| api.snippets | Generate client snippets | Supported languages explicit; preserve request semantics; redact likely secrets by default |
| api.http-inspect | Inspect supplied HTTP request/response | Header/body boundaries documented; no implicit request |
| format.sql | SQL formatting | Supported dialects explicit; never execute SQL |
| format.html | HTML formatting/minifying | Output displayed as escaped text, never active markup |

## Planned tool details

### cURL Converter — curl-converter, /api/curl-converter
Accept pasted command as text; never execute. Parse method, URL, headers, body and supported flags. Report unsupported shell constructs and flags. Generated snippets state target language and limitations. Test quoting, multiline input, escaped quotes, duplicate headers, body variants, unknown flags and malformed commands.

### SQL Formatter — sql-formatter, /sql/formatter
Define dialects before implementation. Format only; never connect to a database or execute SQL. Unsupported syntax must not replace source with misleading partial output. Test comments, strings, quoted identifiers, nested queries and dialect-specific syntax.

### HTML Formatter — html-formatter, /web/html-formatter
Format/minify without executing markup; display output as escaped text. Document comment, whitespace and void-element behavior. Test malformed markup, script/style blocks as text, Unicode and large inputs.

See [wireframes](../wireframes/workspace-layouts.md#workflow--generators--api-helpers).
