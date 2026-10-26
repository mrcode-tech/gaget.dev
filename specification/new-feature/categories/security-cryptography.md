# Security & Cryptography

**Status:** Proposal gated by security review.

| ID | Operation | Required behavior |
|---|---|---|
| sec.sha2 | SHA-256/384/512 | Known-answer vectors; explicit text vs byte input; bounded large-input behavior |
| sec.sha3 | Supported SHA-3 | Maintained implementation and vectors; distinguish from SHA-2 |
| sec.legacy-digest | Optional legacy hashes | Explicit warning; never recommended for security-sensitive use |
| sec.hmac | HMAC | Explicit hash and key bytes; no key persistence/logging; known vectors |
| sec.crc-checksum | CRC/checksums | Label as error-detection, not cryptographic security; variant explicit |
| sec.encrypt-decrypt | Approved authenticated encryption only | Explicit algorithm/key/nonce/tag rules; no invented defaults; authentication failure never yields plaintext |
| sec.representation | Key/ciphertext representation conversion | Does not validate key strength or cryptographic correctness |
| sec.inspection | Security-oriented data inspection | Parsing, validation and verification are distinct |

## Hash Generator planned-tool contract
Registry ID hash-generator; route candidate /security/hash; status planned. Text mode and optional file-byte mode; algorithm selector lists only working algorithms. Output shows algorithm, input type and digest representation with copy. Errors preserve source input. Test known vectors, empty input, Unicode, bytes, large inputs and unavailable APIs. Browser Web Crypto does not cover every candidate algorithm; unsupported algorithms must not appear as working.

## UI and privacy
See [wireframes](../wireframes/workspace-layouts.md#security--cryptography). Visually distinguish digest, HMAC, checksum and approved encryption workflows. Never persist secrets/plaintext or transmit input. Do not include secrets in errors. Review cryptographic primitives and parameters before release.

## Acceptance
Tests cover known vectors and malformed keys/nonces/ciphertext. Wrong authentication tags fail safely. Unsupported algorithms are not launchable. UI never describes encoding as encryption, checksums as secure hashes, or local execution as a security guarantee.
