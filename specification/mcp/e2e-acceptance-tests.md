# MCP End-to-End and Acceptance Test Specification

**Status:** Proposed acceptance contract.

## MCP server scenarios
- **MCP-E2E-001 Initialization:** compatible client initializes; only supported capabilities are advertised.
- **MCP-E2E-002 Discovery:** enabled operations expose valid IDs, descriptions, schemas, modes, and limits.
- **MCP-E2E-003 Invocation:** known-answer input returns expected result and no unexpected sensitive fields.
- **MCP-E2E-004 Invalid arguments:** malformed/schema-invalid input is rejected before execution with a stable safe error.
- **MCP-E2E-005 Unknown/disabled operation:** unknown or disabled ID is rejected before dispatch.
- **MCP-E2E-006 Authorization:** unauthorized invocation and cross-caller artifact retrieval are denied without data leakage.
- **MCP-E2E-007 Resource limits:** oversized/time-expensive input is rejected or terminated within bounds; temporary data is cleaned.
- **MCP-E2E-008 Safe errors:** internal failure reveals no stack trace, path, secret, environment variable, or raw sensitive input.

## Workflow scenarios
- **WF-E2E-001 Valid chain:** decode bounded input, validate JSON, format JSON; each step receives declared output and final result matches fixture.
- **WF-E2E-002 Invalid reference:** missing step/output reference is rejected.
- **WF-E2E-003 Deferred operation:** workflow referencing deferred operation is rejected without substitution.
- **WF-E2E-004 Failure/cancellation:** failed/cancelled step is identified and intermediates/workers/temp files/artifacts are cleaned.
- **WF-E2E-005 Total budget:** chain exceeding cumulative data/time budget stops with bounded result.

## Browser privacy scenarios
- **WEB-E2E-001 Local text:** correct output and no request sends input to server.
- **WEB-E2E-002 Local file:** fixture is processed; no request body contains file content or derived payload.
- **WEB-E2E-003 No fallback:** server unavailable; local browser operation still works without upload.
- **WEB-E2E-004 Unsupported mode:** server-only capability requested through local path reports unavailable, not transfer.
- **WEB-E2E-005 Help UI:** enabled tool help shows accurate status, runtime, privacy, setup, examples, copy behavior and accessibility.

## Docker scenarios
- **DOCKER-E2E-001 Startup:** clean build, start with example config, health/readiness succeeds.
- **DOCKER-E2E-002 Invocation:** test client invokes known-answer operation.
- **DOCKER-E2E-003 Policy:** disabled operation is unavailable and direct invocation rejected.
- **DOCKER-E2E-004 Cleanup:** success, failure, timeout, cancellation follow retention policy.
- **DOCKER-E2E-005 Non-root/shutdown:** service uses documented non-root identity and exits cleanly.

## Evidence and release acceptance
Use deterministic synthetic fixtures. Record test ID, expected/actual, status, commit SHA, run and artifact. Never commit outputs/secrets. A green job is insufficient if it tested a different commit.

Release requires all required MCP E2E tests, browser privacy tests, workflow limit/cancellation tests, catalog parity with server support, Docker checks for supported profile, main CI green, and docs/help describing verified behavior.
