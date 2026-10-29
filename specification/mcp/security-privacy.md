# MCP Security, Privacy, and Threat Model

**Status:** Partially implemented. The current bearer-token gate and per-process admission controls are implemented; deployment and authorization gaps remain.

## Security goals
Prevent unauthorized invocation, data access, resource exhaustion, unsafe file/network behavior, and sensitive data leakage. Preserve the public website's browser-local privacy model. Make server-side data flow and retention explicit. AI clients must not gain ambient filesystem, network, or code-execution privileges.

## Threats
Address malicious files; oversized inputs and decompression bombs; regex denial of service; path traversal and temp-file leakage; SSRF if URL fetching is introduced; prompt injection in supplied content; unauthorized artifact/job retrieval; secrets in logs/errors; public endpoint abuse/cost; dependency and container supply-chain risks.

## Authentication and authorization
- Public browser UI does not require MCP access.
- Do not deploy an unlimited anonymous public MCP compute endpoint by default.
- Self-hosted deployments need documented authentication/authorization appropriate to their environment.
- Enforce operation allowlists and quotas server-side; never trust model-supplied permission arguments.
- Job IDs/artifact references do not replace authorization.
- Secrets never belong in client bundles, tool descriptions, logs, or recipes.
- Choose an established authorization approach during Phase 0; do not invent a custom protocol without a documented need.

## Runtime admission controls

The endpoint rejects configured tokens shorter than 32 bytes and compares bearer credentials using a constant-time comparison. The current MCP runtime adds per-process admission controls: a bounded request rate, a bounded number of active requests, and a timeout while reading request bodies. These controls are defense-in-depth for a single server process, not a distributed quota. They can be bypassed across multiple serverless instances or replicas and must not be presented as sufficient protection for an unrestricted public endpoint. Public or multi-replica deployments should enforce identity-aware rate/concurrency limits at a trusted gateway or reverse proxy as well.

## Limits
Every server operation must define applicable request, file, item, expanded/decompressed output, CPU/wall-clock, memory/worker, result, artifact, workflow, and concurrency limits. Reject oversized data before expensive processing where possible. Defaults must be safe; unlimited values are not acceptable.

## Network and filesystem
- Operations are offline by default.
- Parsing a URL, cURL command, IP address, or HTTP message does not authorize sending a request.
- Any remote fetch requires separate approval, authorization, SSRF defenses, redirect/DNS controls, and explicit disclosure.
- No arbitrary shell commands, dynamic imports, eval, or user-provided executable code.
- Restrict file access to service-managed temporary directories; prevent traversal and unsafe symlinks.
- Clean temporary data on success, error, timeout, and cancellation.

## Privacy contract
**Browser-local:** files/intermediates remain in browser; no automatic server fallback; tests verify no unexpected file transmission; release object URLs/buffers; telemetry must not capture raw inputs/outputs.

**Server-side:** clearly indicate data transfer; define temporary storage, retention, cleanup and logging; default to no persistent input/output storage; never log files, tokens, credentials, HMAC keys, or user source text. A remote MCP client cannot access a browser-local file without explicit transfer or a separate local bridge.

**Self-hosted:** does not automatically guarantee privacy. Document administrator responsibility for network, logs, backups, identity, storage, and upgrades.

## Sensitive operation boundaries
- JWT decoding is not signature verification or trust validation.
- Hashes/checksums are not encryption or proof of authenticity; HMAC keys are secret.
- cURL conversion never executes requests.
- HTML/XML formatting never executes markup or resolves external entities.
- File signatures are not malware scanning or a safety verdict.
- Certificate/key metadata does not prove ownership or trust.
- Compression/decompression has output and ratio limits.
- Encryption/decryption stays deferred until algorithm, nonce/IV, authentication tag, key handling, and review requirements are approved.

## Logging and security gate
Log request IDs, operation IDs, duration, outcome, resource use, and coarse failure categories. Redact/omit payloads, credentials, auth headers, sensitive filenames, and internal paths. Before MCP exposure, test validation, authorization, limits, cleanup, safe errors, output size, and operation-specific threats.
