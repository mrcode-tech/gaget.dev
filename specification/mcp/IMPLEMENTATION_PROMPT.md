# GaGet.dev — End-to-End MCP Compatibility Implementation Prompt

> **Purpose:** Copy this entire prompt into an implementation agent working on the GaGet.dev repository. It is the execution brief for implementing every approved phase in this directory, from repository audit through release-gate verification. It is not permission to skip phases, invent current-state facts, weaken privacy boundaries, or report unrun checks as passing.
>
> **Canonical specifications:** This prompt supplements, and does not replace, `AGENTS.md`, `command.md`, `specification/AI_INSTRUCTIONS.md`, and the specifications linked from `specification/mcp/README.md`. If this prompt conflicts with repository-wide safety instructions, follow the repository-wide instructions and record the conflict.

## Mandatory workflow UX decision: one Batch Workbench

Implement exactly one general-purpose user-facing workflow workspace: **Batch Workbench**, shown as a primary sidebar item immediately below **Dev Tools**. Do not build a separate “simple workflow”, pipeline builder, or MCP-specific workflow editor elsewhere in the application.

Treat the workflow engine and pipeline schema as shared capabilities, not as additional menu destinations. Batch Workbench is the canonical web UI; the public MCP & Integrations page demonstrates a curated recipe from the same pipeline model and links to Batch Workbench rather than duplicating its full editor. The MCP adapter may expose only workflows composed entirely of verified server-exposed operations. Reuse canonical operation IDs, schemas, validation, budgets, and result manifests where runtime-compatible, while keeping web/MCP adapters, authorization, transport, and UI state independent. The landing-page demo must either execute through the real MCP adapter/runtime under its explicit demo policy or be clearly marked as a guided example that was not executed.

## 1. Role and objective

Act as the senior software architect and implementation engineer responsible for delivering GaGet.dev's MCP compatibility initiative to production quality.

Implement the approved MCP capabilities in the existing `mrcode-tech/gaget.dev` repository. Deliver a working, independently testable MCP interface and server runtime, a shared capability/operation contract used by both the existing web application and MCP adapter where runtime compatibility allows, validated workflow composition, safe self-hosted Docker deployment, contextual MCP help in applicable tool workspaces, a public MCP & Integrations landing page with a truthful interactive workflow demo, a first-class Batch Workbench navigation item immediately below Dev Tools, hosted and on-premises usage guidance, automated tests, a dedicated MCP CI workflow, and evidence-backed documentation.

This is a **full implementation task across all roadmap phases**, not a proposal-only task. Do not stop after auditing or writing documentation. Continue phase by phase until each feasible phase is implemented and verified, or until a concrete blocker requiring user input is reached. Do not claim the initiative is complete while any required phase is unimplemented or unverified.

## 2. Repository and change-safety rules

1. Start by inspecting the repository, current branch, worktree/status, latest commit, repository instructions, existing CI workflows, package manager, supported Node/runtime versions, tests, application architecture, and current tool registry. Use actual repository evidence, not assumptions.
2. Work only in the user-authorized MCP feature branch. The expected branch for this initiative is `mcp-compatible`. If the environment does not provide that branch or the checked-out state differs from the expected branch, do not create, switch, reset, delete, or rename branches; stop and report the exact state and ask for direction.
3. Do not merge to `main` or `stage`, push, deploy, publish a package/image, alter production settings, or trigger production workflows unless the user explicitly authorizes that specific action. Running an authorized branch-scoped CI workflow is allowed when available.
4. Preserve unrelated changes. Never reset/clean the worktree or overwrite user changes to make tests pass. Before editing, capture the status and identify any pre-existing modifications.
5. Follow `AGENTS.md`, `command.md`, `specification/AI_INSTRUCTIONS.md`, the complete `specification/mcp/` package, and relevant current feature/component specifications. The implementation roadmap is the phase order authority; operation contracts, security/privacy, workflow, deployment, help, testing, E2E, and CI documents define the detailed acceptance requirements.
6. Use the repository's existing package manager, formatting, linting, test, build, and CI conventions. Inspect scripts before invoking commands. Do not introduce a second package manager or redundant framework without a demonstrated need.
7. Do not commit until implementation and all feasible required verification for the change are complete and results have been reviewed. If a commit is not explicitly authorized by the current task, leave changes uncommitted and report that state.
8. Do not push, merge, or deploy. Never claim a remote CI run was triggered or passed unless you actually triggered/read its run and inspected its logs/results.
9. Do not name external competitor products in source, UI, documentation, commit messages, workflow names, package names, or pipeline identifiers. Describe requirements generically and keep the initiative independently branded.
10. Keep repository documentation in English unless an existing specific document explicitly requires another language.

## 3. Required operating method

Use this loop for every phase and meaningful sub-phase:

1. Read the relevant specification and inspect current implementation.
2. Write a short phase plan with concrete file/module targets and acceptance checks.
3. Implement the smallest coherent increment; avoid a risky all-at-once refactor.
4. Add or update tests alongside the behavior.
5. Run focused tests first, then relevant lint/type/build/integration checks.
6. Inspect failures and fix regressions introduced by this task. Do not hide failures, weaken assertions, delete tests, or mark a check optional merely to get a green result.
7. Review diffs for accidental scope, secrets, unsafe defaults, UI regressions, and unsupported claims.
8. Update phase status, capability inventory, help, specifications, and evidence only when the relevant code and tests justify the status.
9. Continue to the next phase. Do not ask for confirmation for routine implementation decisions already covered by the specifications. Ask a concise question only when a real ambiguity or security/product decision cannot be resolved from repository evidence and would materially affect architecture, data handling, public compatibility, or user-visible behavior.

Maintain a durable implementation checklist in the MCP specification package (update the roadmap or add a progress/evidence document if needed). Each phase entry must identify status, changed paths, tests/commands, result, exact revision, and unresolved limitations. Never mark a phase `verified` on the basis of code review alone.

## 4. Non-negotiable architecture

### 4.1 Separate interfaces, shared contracts

- Keep the existing web UI and MCP server as separate adapters/interfaces. MCP is not a thin wrapper around React pages, Next.js routes, browser DOM, or UI state.
- Define a stable, versioned, serializable operation contract: stable capability/operation IDs, versions, input/output schemas, limits, runtime/execution mode, exposure status, privacy/data-transfer metadata, cancellation behavior where supported, and normalized safe errors.
- Keep pure business/transform logic independent from React, Next.js, browser globals, and MCP SDK/transport objects.
- Share operation implementations and validation only when they are genuinely runtime-compatible. Use separate browser and server implementations behind the same contract when APIs, dependencies, security, or performance require it.
- Do not import browser-only APIs such as `window`, `document`, Canvas, Web Audio, MediaRecorder, or browser-only libraries into server/shared modules. Do not import MCP SDK types into pure shared operation modules.
- Avoid creating two sources of truth for operation IDs, schemas, limits, labels, and exposure status. Prefer a registry or generated contract artifacts consistent with repository conventions.
- Do not silently change existing web tool behavior, URLs, localization, accessibility, or browser-local processing while extracting operations.

### 4.2 Privacy-first execution

- Operations that currently process user files locally in the browser must remain browser-local by default. Do not silently upload content to an MCP server or use a server fallback when local execution fails.
- MCP server operations necessarily receive the input explicitly sent by the MCP client. Document that transfer clearly; do not imply that server execution is local to the browser or that data is encrypted/secure merely because HTTPS or Docker is used.
- Do not persist submitted content by default. Define explicit temporary-file lifecycle, retention, cleanup, output artifact expiry, and logging redaction. Never log raw input/output by default.
- Keep browser-only, shared-runtime, and server-compatible status distinct. Do not expose a browser-only capability through MCP until a server-compatible implementation and its tests exist.
- Use explicit operation allowlists. No arbitrary JavaScript evaluation, shell execution, unrestricted filesystem access, arbitrary URL fetch, dynamic package loading, or user-controlled executable pipelines.
- Bound input size, output size, CPU, memory, execution time, concurrency, chain length, artifact size, and temporary storage. Reject unsupported or over-budget work with stable errors.

### 4.3 MCP interface and workflow safety

- Use a maintained MCP SDK and supported transport after auditing the current ecosystem and project runtime compatibility. Pin and manage dependencies using existing repository conventions and review license/security implications.
- Support protocol initialization, tool discovery, schema-backed invocation, structured results, useful safe errors, and the documented transport/deployment mode.
- Expose only operations explicitly marked approved and implemented for the server runtime. Deferred, browser-only, unavailable, or unsupported operations must not appear callable.
- Workflows must be typed, sequential initially, bounded, validated before execution, cancellable where supported, and observable through safe status/results. Intermediate values must be typed references, not interpolated executable code.
- A workflow must reject unknown operations, invalid schemas, type mismatches, missing references, cycles if the chosen schema permits graph descriptions, oversized intermediates, excessive steps, and exceeded budgets. Define fail-fast/partial-result semantics explicitly.
- Do not assume the existing browser Workflow & Batch workbench is server-ready; audit and reuse only its genuinely portable parts.

## 5. Required phase plan

Follow `specification/mcp/implementation-roadmap.md` and complete every phase below. If the existing roadmap has more detailed requirements, the detailed specification wins. Do not reorder dependent phases without documenting why and preserving all gates.

### Phase 0 — Audit and architecture decisions

- Establish exact branch, commit, worktree status, current CI state, available test infrastructure, package/runtime versions, routes, tools, registries, shared helpers, browser-only dependencies, file transfer paths, and deployment constraints.
- Build an evidence-backed capability matrix for every tool/workspace listed in `tool-catalog.md`: current implementation state, operation IDs, browser execution, shared implementation availability, server feasibility, MCP exposure state, dependencies/licenses, file/binary handling, risks, and missing tests.
- Inspect JSON, date/time, text/data tools, image/audio/video tools, and workflow workbench independently. Do not infer capabilities based on menu labels alone.
- Record data flows and trust boundaries for web-local execution, MCP requests, temporary files, logs, and generated artifacts.
- Decide transport, authentication/authorization model, configuration shape, rate/size limits, artifact delivery, process/job model, and Docker profiles based on evidence. Use safe defaults and record unresolved decisions.
- Baseline current tests and CI without changing unrelated behavior.
- **Exit gate:** the first-wave operations, module boundaries, security model, runtime compatibility, and high-impact dependency/license/privacy risks are documented with source/test evidence. Continue with reasonable low-risk decisions; ask the user only for material unresolved choices.

### Phase 1 — Contract and registry foundation

- Implement the versioned shared capability/operation model described in `operation-contract.md`.
- Define stable identifiers, contract versions, JSON-serializable input/output schemas, runtime modes, execution limits, privacy/transfer metadata, status, normalized errors, and result/artifact metadata.
- Reconcile the model with the current registry without breaking existing tool discovery or URLs. Keep category, workspace, capability, operation, adapter, runtime, and MCP tool as distinct concepts.
- Validate duplicate IDs, missing schemas, invalid limits, status contradictions, unsupported runtime declarations, and schema drift.
- Add contract tests and registry consistency checks.
- **Exit gate:** representative operations are described without UI/transport-specific types; registry tests prove uniqueness, validity, and honest exposure status.

### Phase 2 — Extract representative shared operations

- Start with a small, representative first wave of bounded text/data operations (for example encoding/decoding, text transforms, and JSON operations that are verified to exist). The audit decides the exact set.
- Extract pure transformations and validation into shared modules without rewriting unrelated tools.
- Make the existing browser UI invoke these modules through its browser adapter while preserving local processing, current outputs, error messages where contractual, accessibility, responsive behavior, localization, and existing route semantics.
- Add parity/golden tests comparing pre-existing behavior with the extracted implementation and edge-case tests for Unicode, empty input, malformed data, and limits.
- Ensure browser-only dependencies remain in browser-specific adapters.
- **Exit gate:** web UI behavior remains compatible, shared operation tests pass, and no unexpected network upload is introduced.

### Phase 3 — Server operation runtime

- Implement a server-side invocation layer that accepts only validated contract requests and allowlisted operations.
- Add input/output validation, execution deadlines, resource limits, cancellation where feasible, concurrency control, normalized safe errors, redaction, temp-directory isolation, cleanup, and no-persistence-by-default behavior.
- Ensure exceptions do not leak secrets, paths, stack traces, submitted content, or internal environment configuration to clients.
- Add negative tests for oversized inputs/outputs, invalid schemas, timeout, cancellation, unsupported operation, cleanup after failure, and concurrent requests.
- **Exit gate:** approved representative operations execute on the server under enforced limits and cleanup is verified in automated tests.

### Phase 4 — MCP adapter and protocol integration

- Implement the MCP server adapter using the audited SDK and transport. Keep adapter code separate from the shared operation layer.
- Register descriptive tools with accurate input schemas, concise descriptions, stable names, and operation IDs. Implement initialization, tool discovery, invocation, result formatting, and safe error mapping according to the selected SDK/version.
- Implement authentication/authorization appropriate to the selected deployment profile. Do not ship a remotely reachable unauthenticated service with sensitive or resource-intensive operations. Local stdio and network transports must each have explicit threat models.
- Ensure only approved, implemented, server-compatible operations are discoverable/callable. The adapter must not infer availability from a UI route or label.
- Add protocol-level integration tests with a real MCP client, including unknown/disabled tools, invalid arguments, authorization failures, and safe structured results.
- **Exit gate:** a real client initializes, lists tools, invokes a known operation, receives predictable results/errors, and cannot invoke deferred or unauthorized operations.

### Phase 5 — Typed workflow engine

- Implement the versioned workflow contract in `workflow-pipelines.md`. Initially support sequential pipelines unless repository evidence and specifications explicitly justify a safer alternative.
- Validate the complete workflow before executing any step. Support typed input/output references and bounded intermediate data. Set maximum steps, chain depth, aggregate time, total bytes, per-operation budgets, and concurrency.
- Define cancellation, failure behavior, intermediate cleanup, partial results, and final result manifest.
- Do not support arbitrary code, expressions that execute code, shell commands, unrestricted network calls, or implicit side effects.
- Audit existing workflow UI and reuse portable schema/validation/operation code only. Browser workflow execution must retain its local-processing semantics.
- Add tests for valid chains, wrong types, missing references, invalid operations, cycles if relevant, budgets, cancellation, failure cleanup, and manifest correctness.
- **Exit gate:** valid bounded chains work end-to-end and invalid/unbounded chains are rejected before side effects.

### Phase 6 — Expand text/data, JSON, and date/time operations

- Expand one operation at a time using the audit matrix and tool catalog. Do not add placeholder tools that claim support without real behavior.
- Verify each operation's schema, semantics, locale/timezone behavior, dependency compatibility, runtime, limits, help, and tests before changing its status to implemented/verified.
- Keep independent workspace boundaries and existing web UX. The MCP initiative must not silently expand the prior developer-tools scope or replace existing Image/Audio/Video/Date & Time/JSON workspace decisions.
- Update catalog, registry, contextual help, operation contract tests, MCP protocol tests, and representative workflow tests together.
- **Exit gate:** every newly exposed operation has a tested implementation, schema, limits, documentation, and exact CI evidence.

### Phase 7 — Image operations and binary artifacts

- Audit existing image operations and browser-only APIs. Select a narrow, valuable server-compatible subset rather than assuming all browser features can be ported.
- Review server image libraries for maintenance, vulnerability, license, memory, CPU, and platform compatibility. Do not introduce dependencies before this review.
- Define bounded binary input transfer, MIME/content validation, decompression/pixel limits, metadata policy, artifact result schema, artifact retrieval authorization, expiry, cleanup, and download behavior.
- Prevent path traversal, unsafe file names, content-type confusion, archive/decompression bombs, and unbounded image dimensions.
- Add fixture-based operation tests, binary contract tests, MCP E2E, cleanup tests, and Docker tests.
- **Exit gate:** only selected verified image operations are exposed and their binary artifacts obey documented limits and lifecycle rules.

### Phase 8 — Audio/video operations

- Audit codec/toolchain availability, native binaries, licenses, runtime platform support, processing cost, job duration, memory, cancellation, progress reporting, binary transfer, and temporary artifacts.
- Do not make audio/video tools callable through MCP until a real server implementation exists and end-to-end resource limits have been proven.
- Implement a narrow first vertical slice, then expand incrementally. If long-running jobs are required, define explicit job IDs, status/progress, cancellation, timeouts, ownership, expiry, and cleanup.
- Keep browser-native media processing independent where server execution would materially change privacy, features, or behavior.
- Add realistic fixtures, codec/dependency checks, resource/timeout tests, MCP E2E, and Docker validation on supported platforms.
- **Exit gate:** at least the intended release subset has reproducible, licensed, resource-bounded end-to-end tests; unsupported formats/platforms are clearly marked.

### Phase 9 — Docker and self-hosted deployment

- Implement the deployment profiles described in `deployment-docker.md`, based on the architecture selected during Phase 0. Separate web and MCP services where that gives clearer isolation; use a combined image only if justified and operationally testable.
- Use non-root users, minimal images, pinned dependencies, health checks, safe signal handling, read-only filesystem where feasible, restricted writable temp/artifact directories, CPU/memory/process limits, and explicit ports.
- Require explicit configuration for network exposure and authentication; never bake credentials or secrets into images, source, examples, or logs.
- Document environment variables, volumes, ports, reverse-proxy assumptions, TLS termination, updates, backup/retention expectations, health checks, and troubleshooting.
- Add image build, startup/shutdown, health, protocol smoke, auth configuration, temp cleanup, and non-root/policy tests. Do not publish images without authorization.
- **Exit gate:** clean Docker build and repeatable smoke tests pass, security defaults are safe, and documented configuration matches actual runtime behavior.

### Phase 10 — Per-tool contextual MCP help

- Add accessible, localized, registry-consistent MCP help to each applicable tool/workspace, following `web-ui-help-and-wireframes.md` and approved design-system patterns.
- Help must state current verified status; supported operations and stable IDs; required/optional inputs; example calls; browser versus server runtime; whether data is transferred to an MCP server; input/output limits; authentication/setup; workflow-chain examples; artifact behavior; known gaps; and links to relevant documentation.
- Examples must be executable against actual registered operations and must be covered by tests or validation where practical.
- Do not show fake green/connected statuses, invented tool availability, unsupported examples, or unverified security claims. Keep help distinct from the core tool workflow and preserve responsive/keyboard/screen-reader behavior.
- Add localization keys for supported locales and verify RTL behavior where the existing application supports RTL.
- **Exit gate:** every MCP-exposed tool has accurate contextual help, accessibility checks, and tested examples; non-exposed tools are labelled accurately.

### Phase 11 — Dedicated MCP CI, hardening, and release gate

- Implement the actual dedicated workflow described in `github-actions-ci.md` as a real GitHub Actions YAML workflow in the repository's established `.github/workflows/` conventions. The Markdown design document alone does not satisfy this phase.
- Trigger on relevant pull requests, pushes to the authorized feature branch, and manual dispatch where appropriate. Use least-privilege permissions, concurrency controls, pinned actions consistent with repository policy, dependency caching, deterministic setup, and safe artifact retention.
- Run applicable lint/type/build checks, shared operation unit tests, contract/registry validation, MCP protocol integration tests, workflow E2E, browser privacy E2E, security/dependency checks, Docker build/smoke tests, and artifact/cleanup checks. Split jobs when useful, but do not mark skipped tests as passing.
- Ensure all reports and screenshots/manifests identify the exact commit SHA. Fail the workflow if a required test is absent, a registry exposes an unsupported operation, or docs/tests contradict implementation.
- Run existing main CI and MCP CI on the same revision when the available branch/permissions allow it. Inspect actual logs and artifacts; fix failures introduced by this work.
- Perform a final threat-model review, privacy/data-flow review, dependency/license review, public API/contract review, accessibility/localization review, and regression review.
- Update the capability matrix and roadmap with implemented/partial/deferred/unsupported status and evidence. Publish a support matrix and known limitations in documentation.
- **Exit gate:** all required jobs pass on the same exact commit; evidence artifacts are inspected; no unresolved critical/high security or privacy issue remains; no capability is described as supported without verification.

## 6. Capability rollout and honest status

Use `tool-catalog.md` as the starting inventory, then reconcile it against the actual source. Consider these families without assuming they are all currently implemented or server-compatible:

- Text/data/encoding/decoding and bounded transforms.
- JSON workspace operations.
- JWT decoding and other security-related parsing/generation operations, with precise descriptions and no misleading claim that decoding verifies a token.
- Hash/checksum operations.
- Text and regular-expression utilities.
- XML/SQL/HTML formatting and CSV/JSON conversion.
- cURL conversion and bounded data/binary/math helpers.
- Network/file inspection only when safe and explicitly scoped; never add arbitrary server-side network fetch or unrestricted filesystem reads.
- Date/time operations with explicit timezone and locale semantics.
- Image operations after binary handling, dependency and resource reviews.
- Audio/video operations only after codec/toolchain and resource validation.
- Workflow/batch composition under the typed, bounded workflow contract.

For every capability distinguish at least: `proposed`, `audited`, `contracted`, `implemented`, `verified`, `partial`, `deferred`, and `unsupported` as appropriate. A status is not proof by itself: link it to source paths, tests, and exact revision evidence. A feature may be available in the browser but unavailable through MCP. Do not collapse those states.

## 7. Required tests and acceptance coverage

Implement and execute applicable tests from `testing-strategy.md` and `e2e-acceptance-tests.md`. At minimum cover:

- Known-answer tests and malformed/edge inputs for every exposed operation.
- Contract/registry schema consistency, unique IDs, exposure gates, limits, and error mapping.
- Browser parity and regression tests after extraction; browser-local operations must not unexpectedly upload file contents.
- Real MCP client initialization, discovery, successful invocation, invalid input, unknown/disabled operation, authorization failure, and structured output.
- Workflow validation-before-execution, typed references, operation ordering, invalid chains, budget exhaustion, cancellation, failure semantics, and cleanup.
- Binary transfer, content validation, artifact authorization/expiry, size/pixel/duration limits, and cleanup where relevant.
- Docker build/startup/health/shutdown, non-root behavior, configuration validation, MCP smoke, and temporary-data cleanup.
- Accessibility, responsive UI, localization/RTL, and contextual help examples.
- Main CI and dedicated MCP CI on the exact same revision where executable in the available environment.

Tests must be deterministic and isolated. Use fixtures, mocks, and local test servers where appropriate; do not depend on third-party production services. Do not weaken existing assertions or skip a failing required check without clearly documenting the reason and leaving the release gate blocked.

## 8. Security and privacy review checklist

Before considering any phase complete, verify the applicable items:

- [ ] Explicit operation allowlist and server-compatible status gate.
- [ ] Strict schema validation and rejection of unknown fields where required.
- [ ] Authentication/authorization for network-accessible deployment profiles.
- [ ] Request size, response size, rate, concurrency, CPU, memory, and execution deadlines.
- [ ] No arbitrary code execution, shell execution, arbitrary filesystem access, or unrestricted network fetch.
- [ ] No raw payloads, credentials, secrets, or sensitive file paths in logs/errors.
- [ ] Temporary files are isolated, unpredictable, access-controlled where applicable, and cleaned up after success, error, timeout, and cancellation.
- [ ] Artifact access is authorized, bounded, expires, and is cleaned up.
- [ ] Browser-local execution never silently switches to server execution.
- [ ] MCP transfer is disclosed honestly in help and docs.
- [ ] Dependencies, licenses, native binaries, and container base images reviewed.
- [ ] Docker runs non-root with least privilege and constrained writable locations.
- [ ] Workflow steps and intermediate results are typed and budgeted.
- [ ] No security, encryption, verification, or privacy claim exceeds the implemented and tested behavior.

## 9. Documentation and repository synchronization

Keep these artifacts synchronized with actual code:

- `specification/mcp/README.md`
- `architecture.md`
- `operation-contract.md`
- `tool-catalog.md`
- `workflow-pipelines.md`
- `security-privacy.md`
- `deployment-docker.md`
- `web-ui-help-and-wireframes.md` and relevant wireframes
- `testing-strategy.md`
- `e2e-acceptance-tests.md`
- `github-actions-ci.md` and the actual workflow YAML
- `implementation-roadmap.md` and progress/evidence records
- `specification/AI_INSTRUCTIONS.md`, `AGENTS.md`, and `command.md` if implementation changes the required workflow or task command
- Existing product/tool inventory and affected feature specifications

Do not rewrite specifications to retroactively make incomplete behavior appear complete. Document deviations, update acceptance requirements only when a justified decision is made, and preserve the rationale.

## 10. Required deliverables

By the end of the task, deliver:

1. A verified audit and capability/runtime matrix.
2. Shared versioned contracts and validated registry.
3. Shared operation modules for the verified first wave, with web adapter parity.
4. A separately deployable/testable MCP server adapter and bounded server runtime.
5. A typed, bounded workflow engine and real end-to-end examples.
6. Incrementally expanded, explicitly gated MCP tool exposure, including media only where proven feasible.
7. Safe self-hosted Docker packaging and operational documentation.
8. Accessible per-tool MCP help with tested examples.
9. A public MCP & Integrations page with a real MCP-backed demo where safely available; otherwise an unmistakably non-executed guided example. Include the Batch Workbench as a separate primary navigation destination directly below Dev Tools, with verified MCP recipe mapping.
10. Hosted and self-hosted/on-premises guidance that matches actual auth, transfer, retention, network, and deployment behavior; no unsupported privacy/compliance claims.
11. A real dedicated MCP GitHub Actions workflow, not only a Markdown plan.
12. Unit, contract, integration, protocol, workflow, browser privacy, E2E, navigation/accessibility, Docker, and security tests as applicable.
13. Updated specifications, inventories, support matrix, phase status, exact-revision evidence, and known limitations.
14. A final implementation report with changed paths, architectural decisions, tests actually run, CI run identifiers/links and outcomes if available, inspected artifacts, residual risks, and explicit not-done items.

## 11. Final verification and report format

Before reporting completion:

1. Inspect the final diff and repository status; confirm no unrelated changes were overwritten.
2. Run formatting, lint, type checks, unit tests, contract tests, integration/E2E tests, build, and Docker checks that the repository supports and the changed code requires.
3. Trigger branch-scoped CI only if available and authorized. Read the actual workflow run and logs. Never infer CI success from a local test or a workflow file's existence.
4. Confirm all phase statuses match the evidence. If a test cannot run because of missing credentials, unavailable runner/runtime, missing secrets, unsupported platform, or absent tooling, report it as **not run / blocked**, not passed.
5. Ensure no commit, push, merge, deploy, or publish happened without explicit authorization.

The final report must use this structure:

- **Branch and exact commit**
- **Executive status** — complete / partial / blocked, with one-sentence rationale
- **Phase-by-phase table** — phase, status, implementation evidence, tests/CI evidence, remaining gaps
- **Capabilities exposed through MCP** — list only verified operations and their runtime/limits
- **Browser privacy and server data-transfer behavior**
- **Workflow, artifact, and Docker status**
- **CI results** — workflow name, run/commit, jobs, actual outcomes; distinguish local checks from remote CI
- **Changed files**
- **Known limitations and residual risks**
- **Explicitly not done / blocked**
- **Recommended next action**

Do not use a vague “all done” statement. Do not call the initiative complete until every required release-gate criterion is satisfied.

## 12. Start now

Begin with Phase 0. Inspect the actual repository and current branch first. Read all canonical instructions and MCP specifications, capture the baseline, and then implement the phases in order with tests and evidence. Do not stop after producing another plan or checklist. Continue until all phases are complete or a concrete blocker requiring user input prevents safe progress.
