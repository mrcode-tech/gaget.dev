# Data Parsing & Conversion

Reuse the existing JSON Workspace as the canonical JSON experience; do not duplicate it.

| ID | Operation | Acceptance criteria |
|---|---|---|
| data.csv-json | CSV ↔ JSON | Quoted delimiters/newlines, escaped quotes, invalid quote placement, characters after closing quotes, duplicate headers, uneven rows, empty cells, BOM, Unicode, nested JSON and type policy tested |
| data.xml | XML parse/format/minify | Namespaces, comments, CDATA, declarations and malformed nesting; external entities/network resolution disabled |
| data.yaml | YAML parse/format, optional JSON conversion | Scalar typing, indentation, multi-document policy and alias/anchor limits documented |
| data.data-uri | Parse data URI metadata and percent/Base64 payloads | Implemented offline with a 200,000-character input and 2 MB decoded-byte limit; accepts valid padded/unpadded Base64, returns byte metadata and bounded previews, never executes payloads |
| data.query-string | Query-string parse/build | Repeated keys, empty values, plus vs encoded space, malformed escapes and ordering policy |
| data.key-value | Key-value parse/build | Parse and JSON-to-key=value builder implemented; repeated array values become repeated lines; multiline values and delimiter-containing keys rejected |
| data.asn1-tlv | Selected ASN.1/TLV inspection | Conditional; maintained parser, bounded recursion and demand review |
| data.uri-components | Parse absolute URL into components | Implemented offline in `/data/binary-math`; repeated query keys, origin/port/path/hash and credential redaction; no requests |

## CSV ↔ JSON implemented subset
Registry ID csv-json-converter; canonical route /data/csv-json; available with documented limits. Direction is explicit. CSV cells remain strings; duplicate headers are disambiguated deterministically and exported formula-like cells are prefixed. CSV options include delimiter, quote, header and empty-cell policy. Define accepted JSON shapes, defaulting to arrays of objects for CSV export. Duplicate/empty headers and uneven columns are deterministic and visible. Type inference is explicit, not silent. Copy/download use correct format. Consider spreadsheet formula injection; never execute cell contents.

## XML Formatter implemented subset
Registry ID xml-formatter; canonical route /xml/formatter; available with documented limits. The lightweight tokenizer handles nested elements, attributes, comments, CDATA, processing instructions and inert DOCTYPE text. It is not a complete XML parser or schema validator; malformed nesting yields an error rather than partial output. Do not imply schema validation. Disable external entity and remote resolution.

Use text editor/textarea for pasted data; file input is optional and follows the shared contract. Desktop may show source/result columns; mobile stacks. Parsing is local by default.

See [wireframes](../wireframes/workspace-layouts.md#data-parsing--conversion).

## Acceptance
Round-trip fixtures preserve documented semantics; invalid syntax reports useful context; duplicate keys/headers and type policy are explicit; XML cannot fetch external entities; JSON Workspace remains canonical; copy/download matches displayed output.
