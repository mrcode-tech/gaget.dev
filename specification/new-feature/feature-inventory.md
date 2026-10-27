# Feature Inventory and Traceability

**Evidence inspected:** capability proposal, registry, route tree, operation tests, production smoke/E2E checks, and matching CI evidence for the initial workbench implementation. This inventory distinguishes implemented subsets from broader proposed operations.

## Existing developer utilities

| Stable ID | Name | Canonical route | Registry status |
|---|---|---|---|
| url-encoder-decoder | URL Encoder / Decoder | /encoding/url | available |

| jwt-decoder | JWT Decoder | /security/jwt-decoder | available |
| uuid-generator | UUID Generator | /generators/uuid | available |
| hash-generator | Hash Generator | /security/hash | available with documented limits |
| regex-tester | Regex Tester | /text/regex | available with documented limits |
| xml-formatter | XML Formatter | /xml/formatter | available with documented limits |
| sql-formatter | SQL Formatter | /sql/formatter | available with documented limits |
| csv-json-converter | CSV ↔ JSON | /data/csv-json | available with documented limits |
| html-formatter | HTML Formatter | /web/html-formatter | available with documented limits |
| curl-converter | cURL Converter | /api/curl-converter | available with documented limits |
| binary-math-workbench | Data, Binary & Math Workbench | /data/binary-math | available with documented limits |
| network-file-inspector | Network & File Inspector | /inspection/network-file | available with documented limits |
| binary-math-workbench | Data, Binary & Math Workbench | /data/binary-math | available with documented limits |
| network-file-inspector | Network & File Inspector | /inspection/network-file | available with documented limits |

There are now 12 relevant standalone registry entries. Encoding & Decoding consolidates the URL/Base64 category and preserves `/encoding/base64` as a compatibility redirect. All seven formerly planned routes now have source implementations, operation tests and direct-route CI coverage; availability is limited to the implemented subsets described in the product inventory. JSON Workspace remains excluded from new-feature implementation. Photo, Audio, Video and Date & Time remain independent and excluded.

## Proposed capability traceability

| Planning ID | Workspace and operations | Status / phase | Specification |
|---|---|---|---|
| enc.representations | URL component; Base64/Base64url; Base32; hex/binary; basic HTML entities; Unicode escapes; conditional Base58/Base85; quoted-printable; charset conversion; explicit text/byte modes | Core text representations, quoted-printable and selected charset conversion implemented / 2; Base58/Base85 and dedicated arbitrary-file byte mode pending | [Encoding](./categories/encoding-decoding.md) |
| sec.digest | SHA-256/SHA-384/SHA-512 text digests | SHA-2 text and local file-byte digests implemented / 3–4; SHA-3 and other digest families pending / 4 | [Security](./categories/security-cryptography.md) |
| sec.mac-checksum | HMAC; CRC/checksums | HMAC-SHA-2 and CRC32/IEEE text subset implemented / 4; other checksum variants pending | [Security](./categories/security-cryptography.md) |
| sec.encrypt | Supported encryption/decryption; key/ciphertext representation | Conditional / 4 | [Security](./categories/security-cryptography.md) |
| data.csv-json | CSV ↔ JSON, delimiters, quoting, headers and type policy | CSV ↔ JSON implemented with string-cell policy / 3; broader type inference remains out of scope | [Data](./categories/data-parsing-conversion.md) |
| data.xml | XML parse/format/minify | Lightweight element-nesting format/minify implemented / 3; complete XML parsing/validation pending | [Data](./categories/data-parsing-conversion.md) |
| data.yaml | YAML parse/format and optional JSON conversion | Proposed / 3 | [Data](./categories/data-parsing-conversion.md) |
| data.query-string | Query-string parse/build, repeated keys, URI components | Implemented in `/data/binary-math` / 3; repeated keys and plus-space policy tested | [Data](./categories/data-parsing-conversion.md) |
| data.key-value | Key-value parse/build | Key-value parse implemented in `/data/binary-math` / 3; builder remains pending | [Data](./categories/data-parsing-conversion.md) |
| data.asn1-tlv | Selected ASN.1/TLV inspection | Conditional / 5 | [Data](./categories/data-parsing-conversion.md) |
| text.regex | Regex flags, matches and captures | Implemented / 3; match/capture, replacement preview and bounded output; pathological patterns remain a browser-runtime risk | [Text](./categories/text-and-regex.md) |
| text.transform | Find/replace, split/join, trim, line sort/dedupe, case, Unicode normalization, escaping, stats, diff | Core text transformations implemented / 3; operations have bounded input and line-diff limits | [Text](./categories/text-and-regex.md) |
| compress.formats | gzip, zlib, DEFLATE, detection, size/ratio | gzip and zlib-wrapped DEFLATE compress/decompress implemented / 3; format detection pending | [Binary & math](./categories/compression-binary-math.md) |
| compress.archive | Archive listing/extraction with strict limits | Conditional / 5 | [Binary & math](./categories/compression-binary-math.md) |
| binary.inspect | Hexdump, printable strings, byte statistics/entropy | Implemented in `/data/binary-math` and `/inspection/network-file` / 3–4; byte-range/file comparison pending | [Binary & math](./categories/compression-binary-math.md) |
| binary.numeric | Base conversion, signed/unsigned, endianness, XOR/bitwise, float representation | Proposed / 3 | [Binary & math](./categories/compression-binary-math.md) |
| network.parse | IPv4/IPv6/CIDR, MAC, URI/domain/email/IP extraction, HTTP headers/cookies, offline records | IP/CIDR/MAC, supplied headers and cookies implemented / 4; candidate extraction and offline DNS records pending | [Inspection](./categories/network-web-security-inspection.md) |
| token.jwt | JWT decode, claims and timestamp/expiry interpretation | Available entry; reverify / 4 | [Inspection](./categories/network-web-security-inspection.md) |
| token.verify | Optional signature verification | Conditional, separate from decode / 4 | [Inspection](./categories/network-web-security-inspection.md) |
| cert.inspect | PEM/DER, X.509 fields/fingerprints, key metadata, selected SSH public keys | Conditional / 4 | [Inspection](./categories/network-web-security-inspection.md) |
| file.inspect | Magic bytes, headers, strings, byte frequency, entropy, metadata, binary diff | Selected local file byte view, printable strings, byte frequency and entropy implemented / 4; full signature catalog, metadata parsers and file-to-file diff pending | [Inspection](./categories/network-web-security-inspection.md) |
| math.numeric | Base conversion, arithmetic and modular arithmetic | BigInt base conversion, arithmetic, modular integer operations and numeric statistics implemented / 3; signed-width, endianness and IEEE float views pending | [Binary & math](./categories/compression-binary-math.md) |
| math.stats | Statistics, character/byte frequency and entropy | Proposed / 3 | [Binary & math](./categories/compression-binary-math.md) |
| workflow.pipeline | Typed chains, reorder/configure, intermediate results, batch and versioned recipes | Deferred / 6 | [Workflow/API](./categories/workflow-generators-api.md) |
| gen.uuid | UUID v4 | Existing available / 3 | [Workflow/API](./categories/workflow-generators-api.md) |
| gen.samples | Random test data, timestamps, identifiers and structured samples | Proposed / 3 | [Workflow/API](./categories/workflow-generators-api.md) |
| api.curl | Parse supported cURL subset and generate a redacted JavaScript fetch preview | Implemented subset / 3; broad flag and language coverage pending | [Workflow/API](./categories/workflow-generators-api.md) |
| api.http | Inspect supplied HTTP request/response | Proposed / 4 | [Workflow/API](./categories/workflow-generators-api.md) |
| format.sql | SQL formatting and dialect handling | Heuristic common-clause formatter implemented / 3; dialect-complete parsing pending | [Workflow/API](./categories/workflow-generators-api.md) |
| format.html | HTML formatting/minifying | Heuristic text formatting/minifying implemented / 3; complete parser pending | [Workflow/API](./categories/workflow-generators-api.md) |

All 13 proposed workspace names are mapped. During Phase 0, expand each operation family into test cases and add any further incomplete registry entries found by source audit before coding.

## Component traceability

| Need | Existing source | Decision |
|---|---|---|
| Text input | components/ui/input.tsx | Reuse |
| Multiline text | components/ui/textarea.tsx and .tool-textarea | Reuse/compose |
| Buttons, cards, selects, scroll areas | components/ui/* | Reuse existing variants |
| Tool shell/catalog | components/tool-layout.tsx, tool-card.tsx, tool-catalog.tsx | Reuse |
| File dropzone | Not confirmed in component inventory | Search source; propose only if gap remains |
| Operation settings panel | No dedicated contract confirmed | Compose primitives first |
