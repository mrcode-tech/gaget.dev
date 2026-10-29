# MCP Tool Catalog and Existing Capability Mapping

**Status:** Proposed exposure plan; tool list is not proof of server compatibility.

Sources: [Current state](../product/current-state.md), [Product inventory](../product/product-and-feature-inventory.md), [Tool catalog architecture](../product/tool-catalog-and-workspace-architecture.md), [Developer tools inventory](../new-feature/feature-inventory.md).

## Catalog principles
Use stable operation IDs; track status per operation; publish only audited server implementations; preserve current UI workspaces; do not expose deferred capabilities; avoid duplicate tools for redirects; describe limits honestly.

## Initial MCP surface
- **list_capabilities:** approved IDs, descriptions, modes, schemas, limits.
- **execute_operation:** one allowlisted operation with validated arguments.
- **execute_workflow:** bounded validated sequence after the base runtime is stable.
- **get_job_status / get_job_result:** only if long-running tasks and artifact retrieval need asynchronous jobs.

The generic dispatcher is internal machinery, not arbitrary code, path, shell, dynamic-import, or network execution. Add curated operation-specific tools if testing shows a generic tool is hard for models to choose.

## Existing tools to evaluate

Every item below is proposed for audit, not approved automatically. Phase labels are priorities, not current implementation status.

### P1 — Developer text/data
| Existing tool / route | Candidate operations | Requirements |
|---|---|---|
| Encoding & Decoding — /encoding/url; /encoding/base64 redirects here | URL component, Base64/Base64url, Base32, hex/binary, HTML entities, Unicode escapes, quoted-printable, Base58, ASCII85/Z85, selected charset conversion | Bounded text/bytes; preserve byte/text semantics and limits; redirect is not a second tool. |
| JWT Decoder — /security/jwt-decoder | Decode header/claims; interpret exp/iat/nbf | Decoding is not signature verification or trust validation. |
| Data Generator — /generators/sample-data; /generators/uuid redirects here | Bounded synthetic JSON, strings, integers, timestamps, UUID batches | Count/length caps; do not claim cryptographic randomness/password strength unless verified. |
| Hash & Checksum — /security/hash | SHA-256/384/512, HMAC-SHA-2, CRC32/IEEE, CRC-16/CCITT-FALSE, Adler-32 | Verify server parity/secret handling; distinguish digest, MAC and checksum. |
| Text & Regex — /text/regex | Match/capture, replacement preview, split/join, trim, sort/dedupe, case, normalization, escaping, statistics, bounded diff | Deadlines, input/result caps, regex DoS protection. |
| XML Formatter — /xml/formatter | Existing text-preserving format/minify and basic checks | Not full XML grammar/schema validation. |
| SQL Formatter — /sql/formatter | Heuristic format/minify | No complete dialect parser; never execute SQL. |
| CSV ↔ JSON — /data/csv-json | CSV-to-JSON and JSON-array-to-CSV | Explicit string/header policy and formula-injection safeguards. |
| HTML Formatter — /web/html-formatter | Text-safe heuristic format/minify | Never render submitted markup as active HTML; not full validation. |
| cURL Converter — /api/curl-converter | Parse supported cURL subset; generate redacted fetch preview | Never send request; redact credentials; disclose unsupported flags. |
| Data, Binary & Math — /data/binary-math | URL/query parsing, key-value, numeric/base/bitwise, byte analysis, supported gzip/zlib/raw DEFLATE | Cohesive operations, bounded decompression/output/computation; URL parsing is not fetching. |
| Network & File Inspector — /inspection/network-file | Offline IP/CIDR/MAC, DNS/HTTP parsing, redaction, file signatures and selected container/key metadata | Offline by default; no trust verdict or unrestricted fetching. |
| Workflow & Batch — /workflow/pipeline | Typed operation chains, sequential batch, recipe import/export | Audit/extract server engine; local recipes are not server job storage. |

### P1 — JSON Workspace
| Existing tool / route | Candidate operations | Requirements |
|---|---|---|
| JSON Workspace — /json/formatter; /json/diff opens Compare mode | Format, minify, validate, compare, sort keys, find keys/values, escape/unescape; tree traversal only with stable contract | Preserve compare semantics/diagnostics; no duplicate operation for redirect. |

JSON was excluded from the separate developer-tools expansion implementation scope; that does not prevent evaluation in this cross-cutting MCP proposal.

### P2 — Date & Time
| Existing workspace / route | Candidate operations | Requirements |
|---|---|---|
| Date & Time — /datetime/editor | Date parse/format, epoch conversion, arithmetic, comparison, selected calendar calculations | Define timezone, locale, invalid-date and clock semantics. |

### P2 — Image
| Existing workspace / route | Candidate operations | Requirements |
|---|---|---|
| Image Editor — /images/editor | Inspect dimensions/metadata; resize; crop; rotate/flip; format conversion; quality compression; selected adjustments | High value; needs server-compatible runtime, binary transfer, memory limits, output validation and license review. Canvas is not automatically server-compatible. |

### P3 — Audio
| Existing workspace / route | Candidate operations | Requirements |
|---|---|---|
| Audio Editor — /audio/editor | Only verified conversion, trimming, extraction, metadata or transformations | Defer until codecs, dependencies, licensing, duration, cleanup and limits are specified. Web Audio does not prove server support. |

### P3 — Video
| Existing workspace / route | Candidate operations | Requirements |
|---|---|---|
| Video Editor — /video/editor | Only verified media probe, conversion, extraction, trim or transform operations | Defer until codecs, worker/job model, resource budgets, artifacts, cancellation and licensing are validated. MediaRecorder preview does not prove server export. |

## Deferred
Do not expose encryption/decryption, advanced cryptography, JWT signature verification, YAML parser, full XML/HTML/SQL parsers, archive extraction, arbitrary code/shell, unrestricted URL fetching, certificate trust validation, unsupported codecs, or any operation without stable schema and bounded resources.

## Exposure mapping fields
For each candidate track current route, operation ID/version, browser status/limits, server implementation status, runtime modes, MCP status, schemas, binary strategy, safety/privacy requirements, test evidence, and help link/examples. A workspace is not MCP-compatible because one operation is exposed.

## Rollout
Start with bounded text/data; then JSON and selected date/time; then image; then audio/video only after runtime and artifact handling are proven. Phase 0 may revise the order.
