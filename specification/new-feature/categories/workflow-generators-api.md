# Workflow, Generators & API Developer Helpers

## Workflow & Batch Processing — implemented safe subset; advanced execution/persistence deferred

| ID | Operation | Contract |
|---|---|---|
| flow.pipeline | Chain compatible operations | Implemented allowlisted typed text/encoding/JSON/query and byte-preserving Base64/Base64url/Base32/Base58/ASCII85/Z85/binary/quoted-printable operations through raw-hex; local file input up to 100 KB; final raw-hex output can be downloaded as exact bytes; incompatible steps blocked before run; 20-step cap |
| flow.reorder | Reorder/configure steps | Implemented up/down reordering; failures identify step index and operation |
| flow.intermediate | Inspect intermediate output | Implemented previews capped at 2,000 characters per step; only allowlisted non-secret operations |
| flow.batch | Process records | Implemented sequential line batches capped at 100 records and 200,000 total input characters with per-line errors; each run executes in a dedicated worker and cancellation terminates the worker |
| flow.recipe | Import/export versioned recipes | Implemented version 1 JSON import/export, 32 KB cap, strict field/operation/compatibility validation; recipes contain no input or secret values |
| flow.persistence | Save recipes | Defer persistence decision; do not store inputs/secrets by default |

Do not build a pipeline engine until several operation contracts, errors and resource limits are stable.

## Generators\n\n`/generators/sample-data` (Data Generator) implements bounded random alphanumeric strings, inclusive integer ranges, device-clock timestamps, synthetic JSON records and UUID v4 batches. Output counts and lengths are capped; randomness is browser-local and is not presented as a password-strength recommendation.

| ID | Operation | Contract |
|---|---|---|
| gen.uuid-v4 | Existing UUID v4 | Registry ID uuid-generator, route /generators/uuid; verify randomness and output |
| gen.random-data | Sample strings/numbers/records | Implemented random alphanumeric strings, inclusive bounded integers, and synthetic JSON records; uses browser crypto randomness and clearly labels values as test data |
| gen.timestamps | Timestamp forms | Implemented ISO UTC, Unix seconds/milliseconds and detected browser time zone; device clock is explicitly not trusted |
| gen.identifiers | Selected identifiers | UUID v4 batch generation is available as an operation inside Data Generator, with cryptographic randomness when available; collision probability is not zero |
| gen.payloads | Structured sample payloads | Synthetic examples only; no real user data |

## API & Developer Helpers

| ID | Operation | Contract |
|---|---|---|
| api.curl-parse | Parse supported cURL commands | Never execute; support -G/--get query mode, ordered data combination, --data-ascii as a --data alias, -A/--user-agent as a User-Agent header, --data-urlencode for literal values and --json with default JSON headers; file-backed data is not read; unsupported value-taking flags consume their argument and are reported rather than silently dropped |
| api.snippets | Generate client snippets | Supported languages explicit; preserve request semantics; redact likely secrets by default |
| api.http-inspect | Inspect supplied HTTP request/response | Header/body boundaries documented; no implicit request |
| format.sql | SQL formatting | Supported dialects explicit; never execute SQL |
| format.html | HTML formatting/minifying | Output displayed as escaped text, never active markup; preserves mixed inline text, respects quoted tag delimiters, and keeps raw-text element bodies intact; full parser/validation remains out of scope |

## Planned tool details

### cURL Converter — curl-converter, /api/curl-converter
Accept pasted command as text; never execute. Parse method, URL, headers, body and supported flags. Report unsupported shell constructs and flags. Generated snippets state target language and limitations. Test quoting, multiline input, escaped quotes, duplicate headers, body variants, unknown flags and malformed commands.

### SQL Formatter — sql-formatter, /sql/formatter
Define dialects before implementation. Format only; never connect to a database or execute SQL. Unsupported syntax must not replace source with misleading partial output. Test comments, strings, quoted identifiers, nested queries and dialect-specific syntax.

### HTML Formatter — html-formatter, /web/html-formatter
Format/minify without executing markup; display output as escaped text. Document comment, whitespace and void-element behavior. Test malformed markup, script/style blocks as text, Unicode and large inputs.

See [wireframes](../wireframes/workspace-layouts.md#workflow--generators--api-helpers).
