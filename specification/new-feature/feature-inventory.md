# Feature Inventory and Traceability

**Evidence inspected:** capability proposal, lib/tools/registry.ts, product inventory, tool catalog/workspace architecture, component inventory and route tree. Runtime behavior and CI were not executed during this documentation pass.

## Existing developer utilities

| Stable ID | Name | Canonical route | Registry status |
|---|---|---|---|
| url-encoder-decoder | URL Encoder / Decoder | /encoding/url | available |
| base64-encoder-decoder | Base64 Encoder / Decoder | /encoding/base64 | available |
| jwt-decoder | JWT Decoder | /security/jwt-decoder | available |
| uuid-generator | UUID Generator | /generators/uuid | available |
| hash-generator | Hash Generator | /security/hash | planned |
| regex-tester | Regex Tester | /text/regex | planned |
| xml-formatter | XML Formatter | /xml/formatter | planned |
| sql-formatter | SQL Formatter | /sql/formatter | planned |
| csv-json-converter | CSV ↔ JSON | /data/csv-json | planned |
| html-formatter | HTML Formatter | /web/html-formatter | planned |
| curl-converter | cURL Converter | /api/curl-converter | planned |

There are 11 relevant standalone registry entries: four marked available and seven planned. This is source metadata, not runtime verification. JSON Workspace is excluded from new-feature implementation. Photo, Audio, Video and Date & Time are separate and excluded.

## Proposed capability traceability

| Planning ID | Workspace and operations | Status / phase | Specification |
|---|---|---|---|
| enc.representations | URL component; Base64/Base64url; Base32; conditional Base58/Base85; hex/binary; HTML entities; Unicode escapes; quoted-printable; charset conversion; explicit text/byte modes | Mixed / 2 | [Encoding](./categories/encoding-decoding.md) |
| sec.digest | SHA-2/SHA-3; labelled legacy digests | Hash planned, rest proposed / 4 | [Security](./categories/security-cryptography.md) |
| sec.mac-checksum | HMAC; CRC/checksums | Proposed / 4 | [Security](./categories/security-cryptography.md) |
| sec.encrypt | Supported encryption/decryption; key/ciphertext representation | Conditional / 4 | [Security](./categories/security-cryptography.md) |
| data.csv-json | CSV ↔ JSON, delimiters, quoting, headers and type policy | Planned / 3 | [Data](./categories/data-parsing-conversion.md) |
| data.xml | XML parse/format/minify | Planned / 3 | [Data](./categories/data-parsing-conversion.md) |
| data.yaml | YAML parse/format and optional JSON conversion | Proposed / 3 | [Data](./categories/data-parsing-conversion.md) |
| data.query-string | Query-string parse/build, repeated keys, URI components | Proposed / 3 | [Data](./categories/data-parsing-conversion.md) |
| data.key-value | Key-value parse/build | Proposed / 3 | [Data](./categories/data-parsing-conversion.md) |
| data.asn1-tlv | Selected ASN.1/TLV inspection | Conditional / 5 | [Data](./categories/data-parsing-conversion.md) |
| text.regex | Regex flags, matches, captures and replacement preview | Planned / 3 | [Text](./categories/text-and-regex.md) |
| text.transform | Find/replace, split/join, trim, line sort/dedupe, case, Unicode normalization, escaping, stats, diff | Proposed / 3 | [Text](./categories/text-and-regex.md) |
| compress.formats | gzip, zlib, DEFLATE, detection, size/ratio | Proposed / 3 | [Binary & math](./categories/compression-binary-math.md) |
| compress.archive | Archive listing/extraction with strict limits | Conditional / 5 | [Binary & math](./categories/compression-binary-math.md) |
| binary.inspect | Hexdump, byte view, printable strings, byte-range compare | Proposed / 3 | [Binary & math](./categories/compression-binary-math.md) |
| binary.numeric | Base conversion, signed/unsigned, endianness, XOR/bitwise, float representation | Proposed / 3 | [Binary & math](./categories/compression-binary-math.md) |
| network.parse | IPv4/IPv6/CIDR, MAC, URI/domain/email/IP extraction, HTTP headers/cookies, offline records | Proposed / 4 | [Inspection](./categories/network-web-security-inspection.md) |
| token.jwt | JWT decode, claims and timestamp/expiry interpretation | Available entry; reverify / 4 | [Inspection](./categories/network-web-security-inspection.md) |
| token.verify | Optional signature verification | Conditional, separate from decode / 4 | [Inspection](./categories/network-web-security-inspection.md) |
| cert.inspect | PEM/DER, X.509 fields/fingerprints, key metadata, selected SSH public keys | Conditional / 4 | [Inspection](./categories/network-web-security-inspection.md) |
| file.inspect | Magic bytes, headers, strings, byte frequency, entropy, metadata, binary diff | Proposed / 4 | [Inspection](./categories/network-web-security-inspection.md) |
| math.numeric | Base conversion, arithmetic and modular arithmetic | Proposed / 3 | [Binary & math](./categories/compression-binary-math.md) |
| math.stats | Statistics, character/byte frequency and entropy | Proposed / 3 | [Binary & math](./categories/compression-binary-math.md) |
| workflow.pipeline | Typed chains, reorder/configure, intermediate results, batch and versioned recipes | Deferred / 6 | [Workflow/API](./categories/workflow-generators-api.md) |
| gen.uuid | UUID v4 | Existing available / 3 | [Workflow/API](./categories/workflow-generators-api.md) |
| gen.samples | Random test data, timestamps, identifiers and structured samples | Proposed / 3 | [Workflow/API](./categories/workflow-generators-api.md) |
| api.curl | Parse cURL, inspect request fields, generate client snippets | Planned / 3 | [Workflow/API](./categories/workflow-generators-api.md) |
| api.http | Inspect supplied HTTP request/response | Proposed / 4 | [Workflow/API](./categories/workflow-generators-api.md) |
| format.sql | SQL formatting and dialect handling | Planned / 3 | [Workflow/API](./categories/workflow-generators-api.md) |
| format.html | HTML formatting/minifying | Planned / 3 | [Workflow/API](./categories/workflow-generators-api.md) |

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
