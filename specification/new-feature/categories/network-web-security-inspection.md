# Network, Token, Certificate & File Inspection

## Network & Web Data

The `/inspection/network-file` workbench implements IPv4/IPv6 normalization, IPv4/IPv6 CIDR range calculations, MAC normalization, supplied HTTP-header/cookie parsing, pattern-only IPv4/IPv6 candidate extraction, offline DNS record parsing, redacted HTTP request/response inspection, common file-signature matching, GZIP header metadata, and selected PNG/GIF/BMP/JPEG/TIFF/WebP/WAV/AVI/MP4-family/FLAC/Ogg/PDF/ZIP/ID3/PE/ELF/Mach-O metadata inspection, local byte-range inspection and two-file comparison. It performs no network requests. PEM/DER container inspection and selected OpenSSH RSA/Ed25519/ECDSA public-key metadata/fingerprints are implemented; full X.509 field parsing, SSH certificates, signature verification, trust validation and additional metadata parsers remain conditional/pending.

| ID | Operation | Acceptance criteria |
|---|---|---|
| net.ip | Parse/normalize IPv4 and IPv6 | Invalid ranges and malformed compression rejected |
| net.cidr | Parse CIDR and calculate network/range | Prefix validation and IPv4/IPv6 boundaries |
| net.mac | Normalize MAC formats | Length/separator validation and deterministic normalization |
| net.extract | Extract URI/domain/email/IP candidates | Implemented as deduplicated pattern candidates; explicitly not validation or resolution |
| net.headers | Parse supplied HTTP headers | Duplicate-header policy explicit; no implicit request |
| net.http-message | Inspect supplied HTTP request/response | Request/status line and duplicate headers parsed; sensitive headers and recognizable secret query parameters redacted (including Location/Referer URLs); body content omitted from parsed output; no network request |
| net.file-signatures | Inspect local file magic bytes | Common image/document/archive/audio/executable signatures; 2 MB file cap; matches are not a safety verdict |
| net.offline-records | Parse supplied DNS record text | Common record types parsed from zone/dig-style lines; offline only, skipped lines reported |
| net.cookies | Parse supplied cookie strings | No implication of browser cookie access or security validation |

## Token & Web Security Inspector

| ID | Operation | Acceptance criteria |
|---|---|---|
| token.jwt-decode | Decode JWT header/claims | Malformed segments error; never imply signature validation |
| token.jwt-time | Interpret exp/iat/nbf | Implemented for NumericDate values; missing/invalid claims explicit and compared with local clock, without implying signature verification |
| token.jwt-verify | Optional signature verification | Conditional on reviewed algorithm/key support; separate action/status |
| token.header-cookie | Inspect supplied headers/cookies | Parse supplied text only; no implied live browser access |

JWT registry entry jwt-decoder at /security/jwt-decoder is marked available, but the proposal describes it as inspection-only. Reverify before changing status.

## Certificates & Key Inspector

| ID | Operation | Acceptance criteria |
|---|---|---|
| cert.pem-der | Inspect PEM labels and DER outer container | Implemented for bounded PEM blocks and DER SEQUENCE length; malformed labels/lengths rejected |
| cert.fingerprint | SHA-256 fingerprint of exact PEM-decoded DER or selected DER bytes | Known digest algorithm, exact-byte semantics and no trust claim |
| cert.x509-fields | Inspect subject, issuer, validity, extensions and serial | Pending complete ASN.1/X.509 parsing; do not infer fields from string search |
| cert.public-key | Inspect supported public-key metadata | Show only reliably parsed fields |
| cert.ssh-key | Parse selected SSH public-key formats | Implemented for RSA, Ed25519, NIST P-256/P-384/P-521 ECDSA and selected security-key variants; validates embedded type/field lengths, returns SHA-256 fingerprint and omits comments; SSH certificates and trust remain deferred |
| cert.trust | Chain/hostname/revocation status | Deferred until real validation and trustworthy sources are specified |

## File & Binary Analysis

| ID | Operation | Acceptance criteria |
|---|---|---|
| file.magic | Inspect signature/magic bytes | Indicator, not proof of type or safety |
| file.metadata | Parse selected local metadata | GZIP flags/mtime/optional-field lengths without validating checksums; PNG/GIF/BMP/JPEG/TIFF/WebP dimensions; WAV audio format/duration; bounded AVI/MP4-family/FLAC/Ogg headers; PDF lexical page candidates; ZIP central-directory summary; ID3 tag header; 2 MB cap and explicit limitations |
| file.header | Hex/header preview | Bounded output and offsets |
| file.strings | Extract printable strings | Minimum length and character policy |
| file.frequency | Byte distribution | Counts sum to input length; empty-file behavior |
| file.entropy | Byte entropy | Limitations explained; not a safety verdict |
| file.metadata | Parse selected metadata | Explicit formats; no active content execution |
| file.diff | Compare files | First differing offset and lengths; bounded results |

No implicit network requests. Never persist tokens, cookies, private keys or file content by default. Parsing, decoding, signature verification and trust validation are distinct. File analysis never gives a binary safe/unsafe verdict from heuristics. Apply resource limits and contain parser failures.

See [wireframes](../wireframes/workspace-layouts.md#network--security-inspection).
