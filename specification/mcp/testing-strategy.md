# MCP and Shared Runtime Testing Strategy

**Status:** Proposed quality contract.

## Test layers
- **Unit:** known-answer operations, malformed input, Unicode/binary edges, limits, schemas, stable errors.
- **Operation contracts:** unique IDs/versions, schema/runtime agreement, limits, status consistency, unsupported-mode rejection.
- **Browser adapter:** UI mapping, local file behavior, worker cancellation/cleanup, previews/downloads, no unexpected upload for local-only operations.
- **Server runtime:** validation, limits, cancellation, temp cleanup, safe errors, authorization, no persistence by default.
- **MCP protocol:** initialize client, list tools, invoke valid/invalid input, unknown/disabled tools, structured results, deployed transport.
- **Workflow:** typed references, order, invalid graph, budgets, fail-fast, cancellation, intermediate cleanup, manifest.
- **Integration:** MCP adapter plus real approved operations; do not mock the entire operation layer in every test.
- **E2E:** compatible MCP client against running service; browser flows independently; Docker where applicable.
- **Security/privacy:** authorization, limits, path traversal, secret redaction, artifact access, retention, network egress.

## Determinism
Use fixed fixtures and injected clocks/random sources where needed. Avoid live external services in required CI. Use synthetic redistributable media fixtures. Bound test timeouts. Never use production files, real credentials, or sensitive data.

## Coverage matrix
For every exposed operation trace ID/version, unit test, contract test, runtime test, MCP invocation, browser E2E where applicable, server E2E where applicable, security/privacy test, CI job/artifact, and support status. Require both browser and server tests for claimed parity.

## Quality gates
Pass existing main CI plus MCP unit/contract/integration tests, MCP E2E, relevant lint/typecheck, client/server boundary checks, privacy/security regressions, and Docker build/smoke when deployment files change. Dedicated MCP CI complements and never replaces main CI.

## Failure policy
Required failures block the MCP check. Diagnose flaky tests instead of hiding them behind broad retries. Retries only for known transient infrastructure behavior and preserve first-attempt evidence. If a test cannot run, report not verified. Evidence identifies exact commit, run, job conclusions, and artifacts.
