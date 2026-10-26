# Compression, Binary, Number Systems & Mathematics

## Compression & Decompression

| ID | Operation | Contract |
|---|---|---|
| compress.gzip | gzip compress/decompress | Known fixtures, header/checksum validation and size reporting |
| compress.zlib | zlib compress/decompress | Distinguish wrapper from raw DEFLATE |
| compress.deflate | Supported DEFLATE mode | Raw vs wrapped format explicit |
| compress.detect | Detect supported format | Detection is heuristic until parse succeeds |
| compress.ratio | Size and compression ratio | Formula and zero-byte behavior defined |
| compress.archive | Optional archive listing/extraction | Deferred until output size, expansion ratio, entry count, nesting and path-traversal protections |

## Binary & Number Systems

| ID | Operation | Contract |
|---|---|---|
| binary.hexdump | Offset, hex bytes, printable view | Stable offsets, row width, bounded/virtualized output |
| binary.bytes | Byte/range inspector | Offsets and byte values; no implicit text conversion |
| binary.strings | Printable-string extraction | Minimum length and character policy explicit |
| binary.compare | Byte/file comparison | First differing offset, lengths and bounded output |
| num.base-convert | Binary/octal/decimal/hex | Digit validation, range and arbitrary precision explicit |
| num.signed-unsigned | Fixed-width integer interpretation | Width, signedness and overflow explicit |
| num.endianness | Interpret/serialize multi-byte values | Endianness explicit; known fixtures |
| num.bitwise | XOR and bitwise operations | Operand width and truncation explicit |
| num.float | IEEE floating-point view | 32/64-bit mode; NaN, infinities and signed zero tested |

## Data Analysis & Mathematics

| ID | Operation | Contract |
|---|---|---|
| math.statistics | Min/max/mean/median/variance where supported | Empty data, non-numeric values, precision and sample/population formulas explicit |
| math.frequency | Character/byte frequency | Character vs byte mode explicit |
| math.entropy | Shannon entropy estimate | Formula/units documented; not proof of encryption or malware |
| math.arithmetic | Basic arithmetic | Precision and divide-by-zero behavior defined |
| math.modular | Modular arithmetic | Modulus constraints and negative operand semantics defined |

See [wireframes](../wireframes/workspace-layouts.md#compression--binary--mathematics). Preserve bytes, show offsets and sizes, bound output rendering and use correct MIME where known. Use workers for expensive operations where justified. Decompression rejects output beyond limits; archive extraction prevents path traversal. Tests cover vectors, malformed streams, round trips, overflow, endianness and resource limits.
