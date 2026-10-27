# Network, Token, Certificate & File Inspection

## Network & Web Data

The `/inspection/network-file` workbench currently implements IPv4/IPv6 normalization, IPv4/IPv6 CIDR range calculations, MAC normalization, supplied HTTP-header parsing and supplied cookie-string parsing. It performs no network requests. Candidate extraction for URLs, domains, email addresses and IPv4-shaped strings is now implemented as pattern-only/offline output; Offline DNS record parsing and full HTTP request/response text inspection are implemented; certificate/key inspection remains conditional/pending.

| ID | Operation | Acceptance criteria |
|---|---|---|
| net.ip | Parse/normalize IPv4 and IPv6 | Invalid ranges and malformed compression rejected |
| net.cidr | Parse CIDR and calculate network/range | Prefix validation and IPv4/IPv6 boundaries |
| net.mac | Normalize MAC formats | Length/separator validation and deterministic normalization |
| net.extract | Extract URI/domain/email/IP candidates | Implemented as deduplicated pattern candidates; explicitly not validation or resolution |
| net.headers | Parse supplied HTTP headers | Duplicate-header policy explicit; no implicit request |
| net.http-message | Inspect supplied HTTP request/response | Request/status line and duplicate headers parsed; sensitive headers redacted; body content omitted from parsed output; no network request |
| net.offline-records | Parse supplied DNS record text | Common record types parsed from zone/dig-style lines; offline only, skipped lines reported |
| net.cookies | Parse supplied cookie strings | No implication of browser cookie access or security validation |

## Token & Web Security Inspector

| ID | Operation | Acceptance criteria |
|---|---|---|
| token.jwt-decode | Decode JWT header/claims | Malformed segments error; never imply signature validation |
| token.jwt-time | Interpret exp/iat/nbf | Missing/invalid claims explicit; clock assumptions documented |
| token.jwt-verify | Optional signature verification | Conditional on reviewed algorithm/key support; separate action/status |
| token.header-cookie | Inspect supplied headers/cookies | Parse supplied text only; no implied live browser access |

JWT registry entry jwt-decoder at /security/jwt-decoder is marked available, but the proposal describes it as inspection-only. Reverify before changing status.

## Certificates & Key Inspector

| ID | Operation | Acceptance criteria |
|---|---|---|
| cert.pem-der | Parse supported PEM/DER | Supported labels/encodings explicit |
| cert.x509-fields | Inspect subject, issuer, validity, extensions and serial | Parsing only unless trust validation actually exists |
| cert.fingerprint | Calculate selected digest fingerprint | Known vectors and exact input bytes documented |
| cert.public-key | Inspect supported public-key metadata | Show only reliably parsed fields |
| cert.ssh-key | Parse selected SSH public-key formats | Supported types/comment policy explicit |
| cert.trust | Chain/hostname/revocation status | Deferred until real validation and trustworthy sources are specified |

## File & Binary Analysis

| ID | Operation | Acceptance criteria |
|---|---|---|
| file.magic | Inspect signature/magic bytes | Indicator, not proof of type or safety |
| file.header | Hex/header preview | Bounded output and offsets |
| file.strings | Extract printable strings | Minimum length and character policy |
| file.frequency | Byte distribution | Counts sum to input length; empty-file behavior |
| file.entropy | Byte entropy | Limitations explained; not a safety verdict |
| file.metadata | Parse selected metadata | Explicit formats; no active content execution |
| file.diff | Compare files | First differing offset and lengths; bounded results |

No implicit network requests. Never persist tokens, cookies, private keys or file content by default. Parsing, decoding, signature verification and trust validation are distinct. File analysis never gives a binary safe/unsafe verdict from heuristics. Apply resource limits and contain parser failures.

See [wireframes](../wireframes/workspace-layouts.md#network--security-inspection).
