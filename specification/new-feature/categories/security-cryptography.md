# Security & Cryptography

**Status:** SHA-2 text/file-byte digests, HMAC-SHA-2, CRC32/IEEE, CRC-16/CCITT-FALSE and Adler-32 are implemented for text or local file bytes. Encryption, SHA-3 and legacy hashes remain gated by separate security and feasibility review.

| ID | Operation | Required behavior |
|---|---|---|
| sec.sha2 | SHA-256/384/512 | Known-answer vectors; explicit text vs byte input; bounded large-input behavior |
| sec.sha3 | Supported SHA-3 | Maintained implementation and vectors; distinguish from SHA-2 |
| sec.legacy-digest | Optional legacy hashes | Explicit warning; never recommended for security-sensitive use |
| sec.hmac | HMAC | Implemented for SHA-256/384/512 over UTF-8 text; explicit hash and key; no key persistence/logging; known vectors |
| sec.crc-checksum | CRC/checksums | CRC32/IEEE, CRC-16/CCITT-FALSE and Adler-32 implemented and labelled as error-detection, not cryptographic security |
| sec.encrypt-decrypt | Approved authenticated encryption only | Explicit algorithm/key/nonce/tag rules; no invented defaults; authentication failure never yields plaintext |
| sec.representation | Key/ciphertext representation conversion | Does not validate key strength or cryptographic correctness |
| sec.inspection | Security-oriented data inspection | Parsing, validation and verification are distinct |

## Hash & Checksum Generator contract
Registry ID hash-generator; canonical route `/security/hash`. Supports SHA-256/384/512 digests and HMAC-SHA-256/384/512 with an explicit UTF-8 text key, plus CRC32/IEEE, CRC-16/CCITT-FALSE and Adler-32. Text input is capped at 200,000 characters; local file input is capped at 2 MB. Raw file bytes are hashed without text decoding. The key remains in component memory only and is cleared by Clear or when leaving HMAC mode. CRC32 is an error-detection checksum, not cryptographic security. Web Crypto availability errors are shown without clearing source text.

## UI and privacy
See [wireframes](../wireframes/workspace-layouts.md#security--cryptography). Visually distinguish digest, HMAC and checksum modes. Do not imply encryption or signature verification is available. Never persist secrets/plaintext or transmit input. Do not include secrets in errors. Review cryptographic primitives and parameters before release.

## Acceptance
Tests cover known vectors and malformed keys/nonces/ciphertext. Wrong authentication tags fail safely. Unsupported algorithms are not launchable. UI never describes encoding as encryption, checksums as secure hashes, or local execution as a security guarantee.
