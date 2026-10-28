# Compression, Binary, Number Systems & Mathematics

## Compression & Decompression

The `/data/binary-math` workbench implements browser-native gzip and zlib-wrapped DEFLATE compression/decompression. It limits input to 2 MB and resulting output to 8 MB. Raw DEFLATE and archive formats are not exposed. A wrapper-signature detector distinguishes gzip, likely zlib-wrapped DEFLATE and unknown bytes; it is only a signature hint.

| ID | Operation | Contract |
|---|---|---|
| compress.gzip | gzip compress/decompress | Known fixtures, header/checksum validation and size reporting |
| compress.zlib | zlib compress/decompress | Distinguish wrapper from raw DEFLATE |
| compress.deflate | Supported DEFLATE mode | Raw vs wrapped format explicit |
| compress.detect | Detect supported format | Implemented for gzip magic and zlib header checksum pattern; reports unknown rather than claiming raw DEFLATE; signature match is not full stream validation |
| compress.ratio | Size and compression ratio | Formula and zero-byte behavior defined |
| compress.archive | Optional archive listing/extraction | Deferred until output size, expansion ratio, entry count, nesting and path-traversal protections |

## Binary & Number Systems

| ID | Operation | Contract |
|---|---|---|
| binary.hexdump | Offset, hex bytes, printable view | Stable offsets, row width, bounded/virtualized output |
| binary.bytes | Byte/range inspector | Implemented: select a local file and inspect 1–256 bytes from a zero-based offset; output includes hex, decimal and printable ASCII views. Input remains capped at 2 MB. |
| binary.strings | Printable-string extraction | Minimum length and character policy explicit |
| binary.compare | Byte/file comparison | Implemented: compares two local files up to 2 MB each; reports first differing zero-based offset, lengths, differing positions and at most 100 preview entries. |
| num.base-convert | Binary/octal/decimal/hex | Digit validation, range and arbitrary precision explicit |
| num.signed-unsigned | Fixed-width integer interpretation | Implemented for 8/16/32/64-bit signed two’s-complement and unsigned integers, with range validation and endian byte views |
| num.endianness | Interpret/serialize multi-byte values | Implemented in fixed-width integer and IEEE-754 views with big/little-endian known fixtures |
| num.bitwise | XOR and bitwise operations | Implemented AND/OR/XOR/NOT for 8/16/32/64-bit unsigned or signed two’s-complement operands; validates selected ranges and returns decimal, padded hexadecimal and binary representations. Signed results also report the unsigned bit pattern. |
| num.float | IEEE floating-point view | Implemented 32/64-bit DataView serialization; Float32 rounding disclosed and browser IEEE-754 behavior used for special values |

## Data Analysis & Mathematics

| ID | Operation | Contract |
|---|---|---|
| math.statistics | Descriptive statistics and distribution summary | Min/max/range/sum/mean/median/quartiles/IQR/modes/mean and median absolute deviation/population and sample variance and standard deviation; empty data and numeric overflow are explicit |
| math.frequency | Character/byte frequency | Character vs byte mode explicit |
| math.entropy | Shannon entropy estimate | Formula/units documented; not proof of encryption or malware |
| math.arithmetic | Basic arithmetic | Precision and divide-by-zero behavior defined |
| math.modular | Modular arithmetic | Modulus constraints and negative operand semantics defined |

See [wireframes](../wireframes/workspace-layouts.md#compression--binary--mathematics). Preserve bytes, show offsets and sizes, bound output rendering and use correct MIME where known. Use workers for expensive operations where justified. Decompression rejects output beyond limits; archive extraction prevents path traversal. Tests cover vectors, malformed streams, round trips, overflow, endianness and resource limits.
