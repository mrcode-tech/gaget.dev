# Dedicated GitHub Actions Workflow for MCP Verification

**Status:** Workflow design specification only; it does not claim a YAML workflow exists or has run. Existing .github/workflows/ci.yml remains the general quality gate.

## Objective and proposed path
Create a dedicated workflow such as .github/workflows/mcp-ci.yml for MCP protocol behavior, server execution, workflow chaining, privacy/security, and self-hosting. Review final filename/triggers against repository conventions.

## Triggers
Run on pull requests to supported integration branches when MCP/shared-runtime paths change; pushes to active branches per repository policy; manual dispatch; and changes to MCP specs/tests, schemas, registry, workflows, Docker, or runtime code. Path filters must include every dependency affecting MCP, not just specification/mcp. Shared operation changes must not bypass MCP tests. Main CI remains required.

## Proposed jobs
### mcp-unit-contract
Checkout exact commit; use pinned runtime and repository-approved dependency installation; run relevant lint/typecheck and operation contract/unit tests; upload reports on failure too.

### mcp-server-integration
Start server with synthetic test config; initialize compatible client; test discovery, valid/invalid calls, disabled tools, structured results, authorization, safe errors; stop service and verify cleanup; upload redacted logs.

### mcp-workflow-e2e
Run bounded sequential workflows against real approved operations; verify dataflow, errors, cancellation, budgets; verify deferred operations cannot run; upload machine-readable manifest.

### browser-privacy-e2e
Start web app and Playwright local-only scenarios; assert no file-content upload and no automatic server fallback; test help states when implemented; upload report, screenshots, failure traces.

### docker-smoke
When deployment artifacts exist, build candidate image, start minimal config, wait for health, invoke known-answer operation over MCP, verify non-root execution, operation disablement, shutdown, and upload logs.

### evidence-manifest
Produce JSON with commit SHA, workflow/run IDs, job conclusions, test summaries, artifact names, timestamp. Explicitly mark skipped/not-applicable jobs; never convert skipped to passed. Do not record secrets or payloads.

## Runtime and dependencies
Use pinned Node consistent with app. Do not change dependency installation strategy until the lockfile concern is reproduced/resolved. Pin MCP SDK/media dependencies. Avoid live external APIs; use synthetic fixtures, timeouts, and concurrency limits. Dependency caching must not bypass integrity checks.

## Required status behavior
Required failures fail the workflow. Success must match exact head SHA; stale green runs do not count. If MCP code is not implemented, do not add a fake green job checking documentation only. Add the workflow with executable tests or an intentionally red scaffold only if repository policy explicitly permits.

## Artifacts
Upload unit/contract output, MCP integration logs, Playwright report/traces, privacy assertions, Docker logs, and evidence manifest as applicable. Never include user data, secrets, credentials, or raw sensitive payloads.

## Acceptance
YAML validates; triggers/path filters cover shared runtime/tests; fixtures/timeouts are deterministic; reports survive failure; manifest SHA matches checkout; required tests cannot silently skip; dedicated MCP CI complements rather than replaces main CI.
