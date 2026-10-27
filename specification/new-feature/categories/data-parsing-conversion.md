# Data Parsing & Conversion

Reuse the existing JSON Workspace as the canonical JSON experience; do not duplicate it.

| ID | Operation | Acceptance criteria |
|---|---|---|
| data.csv-json | CSV ↔ JSON | Quoted delimiters/newlines, escaped quotes, duplicate headers, uneven rows, empty cells, BOM, Unicode, nested JSON and type policy tested |
| data.xml | XML parse/format/minify | Namespaces, comments, CDATA, declarations and malformed nesting; external entities/network resolution disabled |
| data.yaml | YAML parse/format, optional JSON conversion | Scalar typing, indentation, multi-document policy and alias/anchor limits documented |
| data.query-string | Query-string parse/build | Repeated keys, empty values, plus vs encoded space, malformed escapes and ordering policy |
| data.key-value | Key-value parse/build | Parse and JSON-to-key=value builder implemented; repeated array values become repeated lines; multiline values and delimiter-containing keys rejected |
| data.asn1-tlv | Selected ASN.1/TLV inspection | Conditional; maintained parser, bounded recursion and demand review |
| data.uri-components | Parse absolute URL into components | Implemented offline in `/data/binary-math`; repeated query keys, origin/port/path/hash and credential redaction; no requests |

## CSV ↔ JSON planned tool
Registry ID csv-json-converter; route candidate /data/csv-json; status planned. Direction is explicit. CSV options include delimiter, quote, header and empty-cell policy. Define accepted JSON shapes, defaulting to arrays of objects for CSV export. Duplicate/empty headers and uneven columns are deterministic and visible. Type inference is explicit, not silent. Copy/download use correct format. Consider spreadsheet formula injection; never execute cell contents.

## XML Formatter planned tool
Registry ID xml-formatter; route candidate /xml/formatter; status planned. Provide format/minify; malformed XML yields actionable error without replacing source with partial output. Do not imply schema validation. Disable external entity and remote resolution.

Use text editor/textarea for pasted data; file input is optional and follows the shared contract. Desktop may show source/result columns; mobile stacks. Parsing is local by default.

See [wireframes](../wireframes/workspace-layouts.md#data-parsing--conversion).

## Acceptance
Round-trip fixtures preserve documented semantics; invalid syntax reports useful context; duplicate keys/headers and type policy are explicit; XML cannot fetch external entities; JSON Workspace remains canonical; copy/download matches displayed output.
