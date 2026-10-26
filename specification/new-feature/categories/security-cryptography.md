# Security & Cryptography

**Status:** SHA-2 text digests, HMAC-SHA-2 and CRC32 are implemented. Encryption, SHA-3, legacy hashes and other checksum variants remain gated by separate security and feasibility review.

| ID | Operation | Required behavior |
|---|---|---|
| sec.sha2 | SHA-256/384/512 | Known-answer vectors; explicit text vs byte input; bounded large-input behavior |
| sec.sha3 | Supported SHA-3 | Maintained implementation and vectors; distinguish from SHA-2 |
| sec.legacy-digest | Optional legacy hashes | Explicit warning; never recommended for security-sensitive use |
| sec.hmac | HMAC | Implemented for SHA-256/384/512 over UTF-8 text; explicit hash and key; no key persistence/logging; known vectors |
| sec.crc-checksum | CRC/checksums | CRC32/IEEE implemented and labelled as error-detection, not cryptographic security; other variants pending |
| sec.encrypt-decrypt | Approved authenticated encryption only | Explicit algorithm/key/nonce/tag rules; no invented defaults; authentication failure never yields plaintext |
| sec.representation | Key/ciphertext representation conversion | Does not validate key strength or cryptographic correctness |
| sec.inspection | Security-oriented data inspection | Parsing, validation and verification are distinct |

## Hash & Checksum Generator contract
Registry ID hash-generator; canonical route `/security/hash`. Supports SHA-256/384/512 text digests, HMAC-SHA-256/384/512 with an explicit text key, and CRC32/IEEE. The key remains in component memory only and is cleared by Clear; no file-byte mode is claimed. CRC32 is an error-detection checksum, not cryptographic security. Web Crypto availability errors are shown without clearing source text.

## UI and privacy
See [wireframes](../wireframes/workspace-layouts.md#security--cryptography). Visually distinguish digest, HMAC, checksum and approved encryption workflows. Never persist secrets/plaintext or transmit input. Do not include secrets in errors. Review cryptographic primitives and parameters before release.

## Acceptance
Tests cover known vectors and malformed keys/nonces/ciphertext. Wrong authentication tags fail safely. Unsupported algorithms are not launchable. UI never describes encoding as encryption, checksums as secure hashes, or local execution as a security guarantee.
