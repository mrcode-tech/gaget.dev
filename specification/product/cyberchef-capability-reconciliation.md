# CyberChef Capability Reconciliation

**Status:** In progress — initial evidence-based audit and first implementation slice; not a claim of complete 506-operation reconciliation.
**Audit date:** 2026-10-26
**Reference application:** https://gchq.github.io/CyberChef/
**Reference source:** https://github.com/gchq/CyberChef
**Reference version evidence:** The live application's indexed page reports CyberChef commit `cc70a4530b86aff4bc40ccc74b1ad4857eccdca2`, build time 2026-10-16 09:07:22 UTC, and 506 operations. This is the most recent official live evidence found during this audit; confirm against the live UI before treating it as a release-pinned manifest.
**License note:** CyberChef states Apache License 2.0. This audit does not copy CyberChef code, assets, operation implementations, or UI.

## Scope and counting rules

CyberChef reports **506 operations** at the reference build above. An operation is counted once by its CyberChef catalog identity, even when it maps to multiple GaGet.dev workspaces. GaGet.dev destination capabilities are not counted as additional CyberChef operations. The five protected workspaces retain their identity and canonical routes: Photo Editor `/images/editor`, Audio Editor `/audio/editor`, Date & Time `/datetime/editor`, Video Editor `/video/editor`, and JSON Workspace `/json/formatter`.

This document is the canonical reconciliation record. It must be expanded into an operation-level manifest sourced from `src/core/config/OperationConfig.json` and the category definitions before the audit can be marked complete. The operation count and family-level disposition below are not a substitute for that per-operation manifest.

## Evidence and limits

- The official live application's About/help content reports the operation count, build metadata, input/output behavior, and the ability to chain operations as recipes.
- The live application demonstrates file drag-and-drop, configurable operation arguments, recipe chaining, and large-output download behavior. Its help warns that files around 2 GB may be accepted depending on browser, while operations can be slow and outputs over the configured threshold (default 1 MiB) may be offered as downloads.
- The live help describes local processing by default and identifies network-connected exceptions: **Show on map** downloads map tiles, **DNS over HTTPS** contacts the selected DNS provider, and **HTTP request** contacts a user-configured destination. These are not candidates for silent local-only claims in GaGet.dev.
- Operation-level inputs, outputs, argument defaults, and detailed implementation constraints remain to be extracted from the version-pinned source manifest. No operation should be marked fully reconciled solely from the examples below.

## Capability-family reconciliation

The table is a family-level first pass. It identifies the intended destination or disposition; it does not claim that every individual CyberChef operation in the family has already been inspected or implemented.

| Capability family | GaGet.dev destination | Disposition | Reason / safety boundary |
|---|---|---|---|
| Base64 text encoding/decoding | `/encoding/base64` | Existing capability; assess parity | Current workspace handles UTF-8 text. Binary-file/Base64 conversions must remain byte-accurate and distinct from media data-URL tools. |
| URL component encoding/decoding | `/encoding/url` | Existing capability; assess parity | Component encoding is not whole-URL validation. Malformed escapes must report errors. |
| HTML entities, general escapes, Unicode escapes, code points, character inspection | New encoding/text workspace or a justified extension after audit | Candidate / not yet implemented | Keep JSON-string escaping in the JSON workspace; do not conflate JSON escaping with generic string escaping. |\n| Regular-expression matching and capture inspection | `/text/regex` | Implemented; verification pending | JavaScript RegExp only; isolated Worker with a 300 ms termination boundary, bounded input/pattern/result count, and no server transfer. This does not provide cross-engine compatibility. |
| Hex, binary, ASCII, byte arrays, hexdump, file signatures | New binary inspection workspace candidate | Candidate / not yet implemented | Byte-oriented data needs explicit encodings, offset semantics, and bounded input sizes. |
| SHA-2 hashes | `/security/hash` | Implemented in this branch; CI verification pending | Web Crypto supports SHA-256/384/512. Does not imply HMAC, SHA-1, MD5, or file streaming. |
| SHA-1, MD5, SHA-3, HMAC, CRC and other checksums | Security/hash workspace only when justified | Deferred pending per-operation review | Different security properties must be named honestly; checksum is not equivalent to a cryptographic hash. |
| JWT structure decoding | `/security/jwt-decoder` | Existing capability | Decoding is not signature verification or authenticity validation. |
| AES and other encryption/decryption | Security workspace candidate | Deferred pending vetted implementation contract | Mode, IV/nonce, padding, key formats and authentication must be explicit; do not invent primitives or unsafe defaults. |
| Secure random bytes | Generator/security workspace candidate | Candidate / not yet implemented | Use `crypto.getRandomValues`; validate count and avoid logging or persisting output. |
| Compression/decompression | Binary workspace candidate | Deferred pending format and resource-limit design | Bound input/output and expansion ratio; no unbounded decompression or recursive parsing. |
| JSON parsing, formatting, validation, comparison, sorting, string escaping | `/json/formatter` | Consolidated in protected JSON workspace; parity audit pending | Do not add duplicate JSON routes. Preserve diagnostics, line numbers, File/Features behavior, and operation-specific results. |
| CSV ↔ JSON conversion | `/data/csv-json` | Implemented; CI/browser verification pending | CSV parsing handles quoting and embedded newlines, requires unique headers and consistent row widths, and preserves CSV values as strings. JSON-to-CSV accepts arrays of scalar objects only, uses first-seen header order, and documents null/missing-to-empty-field lossiness. |
| Timestamps, date parsing/formatting, timezone operations | `/datetime/editor` | Protected workspace destination; parity audit pending | No duplicate generic date converter. Calendar and timezone behavior must follow the Date & Time contract. |
| Image, audio, video transformations and metadata | Existing protected media workspaces | Protected destination; parity audit pending | Browser codecs, APIs, memory and metadata limitations must be truthful. Do not promise unsupported conversions. |
| URL/URI, IPv4/IPv6, protocol dates, HTTP headers and certificate metadata | Existing URL tool or future network/protocol workspace | Candidate / not yet implemented | Local parsing does not prove reachability, ownership, or authenticity. Network operations require explicit consent and destination controls. |
| Data extraction, statistics, entropy, mathematical transforms, parsing and detection | Consolidate into existing/future cohesive workspaces based on operation-level audit | Not yet dispositioned per operation | Do not create one route per operation or a monolithic switch. Preserve deterministic errors and resource limits. |
| Flow control, recipe/pipeline, fork, conditional and batch operations | Potential typed pipeline after architecture audit | Deferred | Do not claim CyberChef recipe compatibility. Pipeline requires typed values, validation, step-level errors, intermediate inspection and safe resource control. |
| Show on map, DNS-over-HTTPS, HTTP request, external-service operations | Exclude by default or implement only as explicit opt-in products | Excluded from local-first default pending separate security review | They send data or requests externally; require clear disclosure, destination validation, consent and protections against SSRF/open-proxy behavior. |
| Exploit, shellcode, malware-oriented, destructive, or otherwise high-risk operations | Case-by-case security review | Deferred/excluded unless a safe legitimate use contract is approved | Avoid exposing risky behavior without guardrails and a clear product need. |

## Implementation slice in this branch

### Hash Generator — `/security/hash`

- Uses the browser Web Crypto API for SHA-256, SHA-384 and SHA-512.
- Supports UTF-8 text and files up to 32 MiB; file hashing currently loads the complete file into memory.
- Displays the lowercase hexadecimal digest and supports copying the result.
- Explicitly discloses that these algorithms are hashes, not encryption, and that MD5, SHA-1, HMAC, streaming, and authenticity verification are not supported.
- Added known-answer tests for the empty SHA-256 input and a Unicode string, digest-length checks for all advertised algorithms, and invalid algorithm/input tests.
- Status becomes **Verified** only after the exact final commit passes CI and route/browser behavior is inspected.

### CSV ↔ JSON — `/data/csv-json`

- Implemented a local CSV parser with quoted delimiters, doubled quotes, embedded line breaks, BOM handling, and CRLF/LF support.
- CSV-to-JSON requires non-empty unique headers and consistent row widths; all cell values remain strings rather than guessing numeric/boolean/null types.
- JSON-to-CSV accepts arrays of objects with scalar values only. Nested objects/arrays are rejected. Header order follows first appearance across the array; missing and null values become empty fields and this lossy behavior is disclosed.
- Added tests for quoted fields, embedded newlines, BOM, malformed quotes, duplicate headers, inconsistent rows, stable headers, invalid JSON shapes, nested values, and empty input.
- Status becomes **Verified** only after exact-commit CI and route/browser verification.

## Required next steps before calling the overall task complete

1. Extract the full operation names, descriptions, categories, argument schemas/defaults, input/output expectations, and implementation evidence from the version-pinned CyberChef operation configuration and category files.
2. Generate a machine-readable inventory with one row per operation and exactly one primary disposition: `implemented`, `already-supported`, `consolidated`, `excluded`, or `deferred`; include GaGet.dev destination, evidence, safety/privacy notes, and reason.
3. Verify every currently planned GaGet.dev developer tool against its actual route, behavior, tests, and registry status. Complete tools only after their advertised actions work end to end.
4. Audit protected Photo, Audio, Date & Time, Video, and JSON workspaces for relevant operation gaps without changing their identity/routes or duplicating their functionality.
5. Implement the highest-value safe gaps in cohesive workspaces, with specifications, tests, responsive/RTL/a11y verification and explicit limits.
6. Open/update the pull request targeting `stage`; inspect every CI job, browser screenshots, and the evidence manifest. Fix failures at their root cause and verify the exact final commit.


## Additional implementation slice — Regex Tester

- Route: `/text/regex`; registered as available but not yet verified.
- Supports JavaScript RegExp flags, all-match enumeration, match offsets, full matches and capture groups.
- Runs in a dedicated browser Worker; a 300 ms watchdog terminates expensive expressions. Pattern length (2,000 characters), input size (256 KiB), and match count (1,000) are bounded. Worker creation failures are surfaced rather than falling back to the main thread.
- Unit tests cover captures and offsets, implicit global matching, zero-width Unicode matches, invalid syntax/flags, size limits and match-count limits.
- Verification still required: component tests, route smoke, lint, typecheck, build, E2E, responsive/RTL browser review and exact-commit GitHub CI. Do not mark this tool Verified until those checks pass.
