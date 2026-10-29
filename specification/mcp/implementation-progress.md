# MCP Implementation Progress and Verification Evidence

**Overall status:** In progress; not release-ready. Do not infer completion from the existence of a tool or a green individual workflow.

## Phase status

| Phase | Status | Evidence / remaining work |
|---|---|---|
| 0 — Audit and decisions | Audited, partial | Repository instructions, runtime boundaries, tool helpers, tests, dependencies, CI, and Docker were inspected. Full per-capability privacy/dependency matrix remains incomplete. |
| 1 — Contract and registry | Partial | MCP operation IDs have schemas, output contracts, and limits. A single registry shared with all web UI workspaces is not yet implemented; exposure-status metadata needs reconciliation. |
| 2 — Shared operations | Partial | Encoding, text, JSON, developer formatting, hashing, generation, inspection, and date/time operations reuse existing operation modules where compatible. Browser/server parity coverage is incomplete. |
| 3 — Server runtime | Partial | Request-body byte cap, output cap, allowlist, schema validation, bounded workflow step/output budgets, safe errors, bearer authentication, per-process rate/concurrency gates, and request-body read timeout passed MCP CI at baseline commit `1f1ae50b7aec5be491464548478c7d1f6f8684e5`. Constant-time bearer comparison, a minimum configured token length, and the workflow error output contract passed MCP CI at commit `410fb4401f50581f0722abc61b2e07219ba75e5b` (run [40884400947](https://github.com/mrcode-tech/gaget.dev/actions/runs/40884400947)). Distributed quotas and preemptive cancellation of a synchronous operation remain. |
| 4 — MCP adapter | Implemented, partial verification | Maintained TypeScript SDK, Streamable HTTP transport, tool discovery/calls, bearer-token gate, and SDK client test. Compatibility with the latest stateless MCP version and formal conformance remain unverified. |
| 5 — Workflow engine | Implemented, partial | Sequential version-1 workflows, allowlisted operations, earlier text-result references, bounded steps/bytes/time budget, safe errors, and result manifest. Full static type inference, true preemption, and comprehensive cancellation/resource cleanup remain. |
| 6 — Operation expansion | Partial | Security, generator, offline inspection, date/time, JSON sort/escape/unescape/find, and stricter text schemas passed MCP CI at commit `1f1ae50b7aec5be491464548478c7d1f6f8684e5` (run [40879917356](https://github.com/mrcode-tech/gaget.dev/actions/runs/40879917356)). Broader catalog operations, binary/media transfer, and complete browser/server parity remain unevaluated. |
| 7 — Image runtime/artifacts | Partial | Bounded raster image inspect/resize/rotate/flip/flop/convert operations using Sharp passed MCP CI at commit `f4c09f5d7aceca1fc33d646c991b81b1b9787976` (run [40882818432](https://github.com/mrcode-tech/gaget.dev/actions/runs/40882818432)). Base64 transfer, input/output/pixel/dimension limits, and no-persistence behavior are tested. Artifact references, scoped retrieval, expiry, and cleanup verification remain unimplemented. |
| 8 — Audio/video | Not implemented | No server-side media job runtime, codecs, progress/cancellation, artifact transfer, or resource isolation. |
| 9 — Docker/self-hosting | Verified at baseline revision | Docker build, non-root runtime, authentication enforcement, and authenticated MCP discovery smoke passed in MCP CI run [40882818432](https://github.com/mrcode-tech/gaget.dev/actions/runs/40882818432), tested commit `f4c09f5d7aceca1fc33d646c991b81b1b9787976`. |
| 10 — Per-tool help | Partial | Contextual help is integrated into supported developer-tool, JSON, Date & Time, and bounded image-operation workspaces; these changes passed component tests in MCP CI run [40882818432](https://github.com/mrcode-tech/gaget.dev/actions/runs/40882818432). Audio/video help is not available because server-side operations are not implemented. Full 15-locale translations, actual-client setup testing, and accessibility/browser E2E remain. |
| 11 — Hardening and release gate | Not complete | Expanded MCP CI passed on exact implementation commit `f4c09f5d7aceca1fc33d646c991b81b1b9787976` (run [40882818432](https://github.com/mrcode-tech/gaget.dev/actions/runs/40882818432)). Existing main CI has not been shown on the same revision; formal MCP conformance and browser privacy E2E are still missing. |

## Last verified implementation revision

- Repository: `mrcode-tech/gaget.dev`
- Branch: `mcp-compatible`
- Tested commit: `410fb4401f50581f0722abc61b2e07219ba75e5b`
- MCP CI run: [40884400947](https://github.com/mrcode-tech/gaget.dev/actions/runs/40884400947)
- Result: passed for that exact revision (unit/contract tests, component tests, MCP tests, lint, typecheck, production build, production dependency audit, and Docker build/smoke).
- Result: passed for the exact tested commit, including dependency installation, unit/contract tests, component tests, MCP protocol/runtime/SDK client tests, lint, typecheck, production build, production dependency audit, and Docker build/startup/non-root/auth/discovery smoke. The CI artifact records the tested branch and SHA.

## Latest implementation increment (verified by MCP CI)

- Added bounded Sharp-backed `image.inspect` and `image.transform` operations for explicitly supplied Base64 raster data. Supported actions: resize, rotate, flip, flop, auto-orient, and conversion to JPEG/PNG/WebP/AVIF.
- Caps: 600,000 input bytes, 16 million pixels, 4096-pixel output dimensions, 600,000 output bytes, five-second Sharp timeout; no persistence or artifact retrieval.
- Known-answer tests create and resize a small PNG, validate metadata and output bounds, and reject malformed Base64/invalid rotation values.
- This increment passed the checks listed above at the exact tested revision. Image artifact lifecycle and audio/video operations are not complete.

## Pending image-runtime hardening (not yet verified)

- Normalize Sharp processing timeouts to the stable `TIMEOUT` error and test rejection of incompatible quality/format arguments.
- This change must pass the next exact-revision MCP CI run before it is considered verified.

## Explicit release blockers

1. Image support is limited to bounded raster inspection/transforms; scoped artifact lifecycle and all server-side audio/video operations are not implemented.
2. Distributed concurrency/rate limits and preemptive execution cancellation need a production-safe design and tests; current admission controls are per process and are defense-in-depth only.
3. The current shared bearer token is a minimal self-hosting gate, not a complete OAuth/enterprise authorization model.
4. Latest MCP protocol/stateless compatibility and formal conformance are not verified.
5. Main CI, browser privacy E2E, real deployed-client setup, and per-tool help coverage are incomplete.
6. Full 15-locale help translation and RTL/responsive browser tests are incomplete.

No phase may be promoted to **Verified** without exact-revision evidence.
