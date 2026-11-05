# MCP Compatibility — Implementation Roadmap

**Status:** In progress. Phase status and exact-revision evidence are maintained in [implementation progress](./implementation-progress.md). Phase completion requires implementation and verification evidence, not documentation alone.

## Phase 0 — Audit and decisions (P0 prerequisite)
Inspect routes/source, registry, operation helpers, JSON/media/date-time workspaces, workflow pipeline, dependencies/licenses, tests, CI, runtime boundaries, Docker feasibility.

Deliver an audited capability matrix; browser-only/shared/server-compatible classification; missing schemas; dependency/license risks; privacy/data-flow matrix; module boundaries; first-wave tool list; decisions for auth, transport, artifacts and deployment profile.

Evidence: current unit/component/E2E/CI state for exact revision and source references. **Exit:** no hidden high-impact privacy, security, runtime, or dependency assumptions.

## Phase 1 — Contract and registry (P0)
Define stable IDs/versions, serializable schemas, errors, execution modes, limits, privacy metadata, and exposure status. Reconcile with current registry without breaking UI discovery. Exit when representative operations are described without UI/transport types and contract tests validate registry.

## Phase 2 — Extract representative shared operations (P0/P1)
Extract a small set of pure operations starting with encoding, text transforms, and JSON. Preserve UI behavior and local execution; avoid mass refactoring. Exit when web adapter uses extracted operations and parity tests pass.

## Phase 3 — Server runtime (P1)
Implement server invocation, validation, quotas, deadlines, cancellation, safe errors, cleanup. Add only operations proven server-compatible. Exit when real operations run in controlled tests with limits and cleanup verified.

## Phase 4 — MCP adapter (P1)
Integrate maintained SDK/transport; implement discovery, list_capabilities, execute_operation; apply appropriate auth/authorization; expose only approved operations. Exit when compatible client initializes, discovers, invokes, receives safe errors, and cannot invoke disabled/deferred operations.

Detailed navigation, shared pipeline boundaries, demo safety, and acceptance criteria are specified in [MCP Workflow UX Architecture](./workflow-ux-architecture.md).

## Product architecture decision — one workflow workspace

There is one general-purpose user-facing workflow workspace: **Batch Workbench**, a separate primary sidebar destination immediately below **Dev Tools**. Do not create a second simple workflow/pipeline workspace under Dev Tools or a parallel MCP-only editor.

The workflow engine and versioned pipeline contract are shared capabilities, not additional navigation destinations. Batch Workbench, the MCP adapter, and the public MCP demo reuse the canonical operation IDs, schemas, validation, budgets, and result manifest where runtime-compatible. Keep adapters, authorization, transport, and UI state separate. The landing page demonstrates a curated recipe from the same pipeline model and links to Batch Workbench; it does not duplicate the full editor. Only server-verified operations may be represented as remotely executable MCP steps.

## Phase 5 — Workflow engine (P1)
Define versioned schema, typed references, sequential execution, budgets, cancellation and result manifest. Audit existing browser Workflow & Batch Workbench; do not assume server compatibility. Exit when valid workflows run and invalid/unbounded workflows are rejected.

## Phase 6 — JSON, date/time and operation expansion (P1/P2)
Add pure/bounded operations one at a time; define timezone/locale semantics; keep workspace UIs independent; update mapping, help and tests. Exit when each exposure has schemas, limits, docs, tests, exact CI evidence.

## Phase 7 — Image runtime and artifacts (P2)
Add selected server image operations with approved dependencies, binary transfer, artifact access, output limits, metadata handling, cleanup and license review. Keep Canvas implementation independent when runtime differs. Exit when fixture, MCP E2E, resource and Docker tests pass.

## Phase 8 — Audio/video (P3)
Audit codecs, licenses, dependencies, resource costs, worker isolation, async jobs, cancellation, progress, retention and transfer. Expose only verified server operations. Exit after one narrow media workflow is reliable.

## Phase 9 — Docker/self-hosting (P1/P2 after runtime design)
Package UI/MCP services; secure configuration, health, non-root runtime, limits, cleanup and upgrade docs. Add combined/separate profiles only when testable. Exit when clean build, MCP smoke and policy tests pass.

## Phase 10 — MCP discovery, public landing page, and help (P1/P2)
Add shared contextual help to each MCP-enabled workspace/tool with verified examples, runtime, privacy/file transfer, limits, setup and operation chains. Design and implement a public MCP & Integrations landing page with a guided workflow demo, verified capability catalog, tested client setup, and explicit hosted versus self-hosted/on-premises guidance. The demo must execute against the real MCP adapter/runtime to be labelled live; otherwise it must be visibly labelled as a guided, non-executed example. Any anonymous live demo requires a dedicated narrow allowlist, strict quotas/timeouts, abuse controls, synthetic sample defaults, and no privileged credentials in frontend code.

Add **Batch Workbench** as the single general-purpose multi-operation workspace and a separate primary sidebar destination immediately below **Dev Tools**. Do not add a second workflow/pipeline editor. The public MCP landing page demonstrates a curated recipe from the same pipeline model and links to Batch Workbench; it must link to an MCP-equivalent recipe only for operations verified in the server registry. Keep the MCP landing page, Batch Workbench, individual tools, contextual help, and protocol endpoint distinct. Reuse existing app shell, navigation, shadcn-style primitives, theme, responsive, localization and RTL conventions. Add route/navigation, demo execution, privacy, accessibility, error-state, and hosted/self-hosted content tests. Add registry-driven docs checks where practical.

Exit when each exposed tool has accessible, localized help and tested examples; the landing page truthfully distinguishes live execution from examples; Batch Workbench is independently navigable; and hosted/on-premises claims match implemented deployment and security behavior.

## Phase 11 — Hardening and release gate (P0)
Run main CI, MCP CI, security/privacy, browser E2E, Docker smoke and acceptance matrix. Inspect artifacts for exact commit. Publish support matrix and limitations. Exit when required jobs pass, manifest matches commit, no critical security/privacy findings remain, docs match shipped behavior.

## Ordering and global definition of done
Phase 0 precedes broad refactor. Phases 1–4 establish foundation; workflow depends on stable contracts; media depends on binary transfer/server runtime; help reflects verified status. CI/Docker may be scaffolded early but cannot report success before executable checks exist.

Done means no UI/MCP coupling; shared contract with separate runtimes; browser-local operations remain local; allowlisted operation-level exposure; typed/bounded workflows; tested privacy/security; reproducible Docker; accurate per-tool help; main and MCP CI pass on same revision; inventories/roadmap updated with evidence.
