# Developer Tools Capability Proposal

**Status:** Proposal — not an implementation promise  
**Scope:** Developer Tools catalog and its standalone utilities. The Photo/Image, Audio, Video, Date & Time, and JSON workspaces remain independent product experiences.

## 1. Goal

Grow GaGet.dev into a practical, privacy-first collection of browser utilities without creating a separate page for every small operation. Group related capabilities into focused workspaces, reuse existing implementations, and expose only operations that are actually implemented and verified.

This document describes a candidate capability set. It does not imply that listed planned or future operations currently work.

## 2. Proposed consolidated workspaces

| Workspace | Candidate capabilities |
|---|---|
| **Encoding & Decoding** | Existing URL-component and Base64 text operations; Base64url, Base32, Base58/Base85 where justified, hex/binary conversion, HTML entities, Unicode escapes, quoted-printable, character-set conversion, and explicit text-versus-byte handling. |
| **Security & Cryptography** | Hashes (SHA-2/SHA-3 and clearly labelled legacy algorithms), HMAC, checksums/CRC, supported encryption/decryption, key and ciphertext representation conversion, and security-oriented data inspection. Keep secure primitives distinct from legacy algorithms and non-cryptographic checksums. |
| **Data Parsing & Conversion** | CSV ↔ JSON, XML parsing/formatting, YAML, query strings, URL/URI components, key-value records, and selected structured formats such as ASN.1/TLV where there is a maintainable parser and clear demand. Reuse the JSON Workspace rather than duplicating it. |
| **Text & Regular Expressions** | Regex testing and extraction, find/replace, split/join, trim, line sorting and deduplication, case conversion, Unicode normalization, escaping, text statistics, and text diff. |
| **Compression & Decompression** | Supported gzip, zlib and DEFLATE operations; format detection; compression ratio and size reporting; archive inspection/extraction only with strict resource limits. |
| **Binary & Number Systems** | Hexdump, byte inspection, binary/octal/decimal/hex conversion, signed/unsigned integers, endianness, XOR and bitwise operations, floating-point representation, and byte-range comparison. |
| **Network & Web Data** | IPv4/IPv6 and CIDR parsing, MAC normalization, URI/domain/email/IP extraction, HTTP headers and cookie parsing, and offline inspection of supplied DNS/network records. Clearly separate operations that make network requests. |
| **Token & Web Security Inspector** | JWT header/claim decoding, timestamp interpretation, HTTP header/cookie inspection, and optional signature verification only when correctly implemented. Decoding alone must never be described as signature validation. |
| **Certificates & Key Inspector** | Supported PEM/DER and X.509 parsing, certificate fields and fingerprints, public-key metadata, and selected SSH public-key formats. Do not claim trust-chain or revocation validation unless implemented. |
| **File & Binary Analysis** | File signatures/magic bytes, hexadecimal headers, printable-string extraction, byte frequency and entropy, basic metadata parsing, and binary comparison. Findings are indicators, not proof that a file is safe or authentic. |
| **Data Analysis & Mathematics** | Numeric-base conversion, arithmetic and modular arithmetic, statistics, character/byte frequency, entropy, and small data-inspection helpers. |
| **Workflow & Batch Processing** | A later-stage pipeline to chain compatible operations, reorder/configure steps, inspect intermediate results, process records in batches, and save/import/export versioned recipes. Do not build this until operation contracts are stable. |
| **Generators** | Preserve UUID generation and consider additional useful generators such as random test data, timestamps, identifiers, and structured sample payloads, with clear distinction between cryptographically secure and ordinary randomness. |
| **API & Developer Helpers** | Planned cURL parsing/conversion, HTTP request/response inspection, SQL formatting, HTML formatting, and other concrete developer workflows after route and implementation audits. |

## 3. Existing capabilities and boundaries

Current source-level inventory identifies these developer utilities:

- **JSON Workspace** at `/json/formatter`: formatting, minifying, validation, comparison, key sorting, tree viewing, key/value search, escaping and unescaping. Keep this as the canonical JSON experience; advanced JSONPath, schema validation, repair, merge and broader conversion remain candidates until verified.
- **URL Encoder / Decoder** at `/encoding/url`.
- **Base64 Encoder / Decoder** at `/encoding/base64`.
- **JWT Decoder** at `/security/jwt-decoder`: inspection only; it does not verify signatures.
- **UUID Generator** at `/generators/uuid`.
- **Planned registry entries** include Hash Generator, Regex Tester, XML Formatter, SQL Formatter, CSV ↔ JSON, HTML Formatter and cURL Converter. A registry entry is not proof of a working route or capability.

Consolidation should first improve discovery and reuse. Preserve existing routes where practical, and avoid breaking bookmarks or canonical URLs. A workspace category is not itself evidence that all of its operations are implemented.

The following remain separate application workspaces and must not be absorbed into Dev Tools: **Photo/Image Editor, Audio Editor, Video Editor, Date & Time Editor, and JSON Workspace**. Their existing functionality should be audited and completed within their own product contracts.

## 4. Implementation principles

1. **Audit before coding.** Compare every candidate operation with routes, registry status, source code, dependencies, tests and browser behavior. Mark each as Implemented, Verified, Partial, Planned, Unsupported or Deferred with evidence.
2. **One operation contract.** Use stable operation IDs, localized metadata, typed input/output, validated parameter schemas, execution boundaries, resource limits and consistent errors. Reuse current architecture where it already provides these capabilities.
3. **Local-first by default.** Prefer browser-native APIs and maintained libraries for local processing. Label network-dependent actions explicitly; never imply a file was processed locally unless that is true.
4. **Handle bytes correctly.** Do not force binary data through text conversions. Define encoding, malformed-input behavior and output format explicitly.
5. **Security and resource safety.** Use known test vectors; avoid unsafe cryptographic defaults; label legacy algorithms; limit file sizes, decompressed output, recursion, execution time and memory; avoid UI freezes with workers where useful.
6. **Honest capability states.** Planned and unavailable operations must not launch as if complete. Preview, inspection, parsing, cryptographic verification and actual export are distinct behaviors.
7. **Consistent UX.** Reuse the shared shell, design tokens, established controls, localization, RTL behavior, keyboard access and responsive patterns. Provide copy/download, clear/reset, errors and progress only where appropriate.
8. **Maintainable dependencies.** Add a dependency only for a real capability gap; assess bundle size, browser compatibility, license, maintenance and security before adoption.

## 5. Suggested delivery order

- **Phase 0 — Audit:** build a per-operation coverage matrix and reconcile registry, routes, specifications and tests.
- **Phase 1 — High-value basics:** consolidate Encoding & Decoding; deliver Text & Regex, common Data Parsing & Conversion, Binary & Number Systems, and practical compression operations.
- **Phase 2 — Security and inspection:** deliver hashes/checksums, token inspection, supported cryptography, network parsing, certificate inspection and file analysis with security review.
- **Phase 3 — Developer helpers:** complete planned XML/SQL/CSV/HTML/cURL capabilities and add justified formats and generators.
- **Phase 4 — Workflow engine:** add typed operation chaining, intermediate outputs, batch processing and recipe persistence after operation contracts are stable.

Prioritize by user value, frequency, correctness, browser feasibility, reuse, dependency cost and security risk—not by raw operation count.

## 6. Definition of done

- Each advertised operation is mapped to an implemented function and a canonical workspace.
- Known-answer tests cover normal, empty, malformed, Unicode, boundary and binary cases as applicable.
- Round-trip/property tests are used where mathematically appropriate.
- Component/integration tests verify parameters, output, errors, file handling, copy/download and operation chaining where supported.
- Security and privacy claims match actual execution behavior; adversarial input and resource limits are tested.
- Existing routes, JSON behavior, planned-state behavior, catalog search, localization, RTL, accessibility and responsive layouts have regression coverage.
- Relevant unit/component tests, lint, typecheck, production build and E2E checks are run; CI evidence is tied to the exact tested revision.
- Remaining unsupported formats, browser limits and unverified behaviors are documented before a capability is marked available.

## 7. Decision requested

Approve or revise the workspace boundaries and priorities before implementation. The first deliverable after approval should be a source-verified coverage matrix—not a bulk implementation of every candidate operation at once.
