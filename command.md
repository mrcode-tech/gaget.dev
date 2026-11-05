# AI Task Command Patterns

Use this file as a short prompt menu for everyday work in GaGet.dev. It does not replace the canonical workflow: every non-trivial task must follow [`AGENTS.md`](./AGENTS.md) and [`specification/AI_INSTRUCTIONS.md`](./specification/AI_INSTRUCTIONS.md).

## How to use

Write a brief request in this form:

> Based on `command.md`, **[command]**: **[task or feature]**.

Replace the bracketed text with the actual task. The agent must infer the relevant repository scope, inspect the active branch and existing implementation, and follow the required specification and verification workflow. Do not create or switch branches, or merge, unless explicitly requested.

## Shortest commands

Use any of these one-line prompts; replace the example scope with your task:

- **New feature:** `Based on command.md, add feature: [feature]. Specify it, create/update its wireframes, implement it, test it, and sync affected docs.`
- **Refactor:** `Based on command.md, refactor [scope] to [outcome]. Update affected specs/wireframes, implement, and test.`
- **Bug fix:** `Based on command.md, fix [bug]. Find the root cause, add a regression test, fix it, and verify.`
- **Tests only / diagnose:** `Based on command.md, test [scope], diagnose failures, fix regressions from this task, and report exact results.`
- **Design and wireframe sync:** `Based on command.md, sync all affected specs, wireframes, component contracts, inventories, and implementation for [scope].`
- **Audit only:** `Based on command.md, audit [scope] and report prioritized findings; do not implement yet.`

The command name and task scope are enough to start. Follow-up details can be added in ordinary language; the agent must still inspect repository evidence and apply the canonical workflow below.

## Commands

### 1. Add a feature

> Based on `command.md`, **add feature**: [feature description].

The agent must inspect existing routes, components, feature specifications, inventories, and tests; define the feature contract and acceptance criteria; create or update the feature specification and target SVG/PNG wireframes when the design requires them; implement the feature; test it; inspect browser behavior where possible; and synchronize all affected docs and assets.

### 2. Refactor existing code or UI

> Based on `command.md`, **refactor**: [component, feature, or workspace] to [desired outcome].

The agent must inspect the current behavior and all relevant consumers before editing, identify regression risks, define the target behavior, reuse existing tokens and primitives, update affected contracts/wireframes when the intended experience changes, and verify the refactor without unrelated rewrites.

### 3. Fix a bug

> Based on `command.md`, **fix bug**: [problem and reproduction details].

The agent must reproduce or inspect the reported behavior, identify the root cause, check existing requirements before changing them, make the smallest coherent fix, add or update regression tests, and update documentation only where facts or expectations changed.

### 4. Test and diagnose

> Based on `command.md`, **test**: [feature, route, bug, or change]; diagnose failures and fix regressions caused by this task.

The agent must inspect available test scripts and relevant tests, run focused checks first, then broader applicable checks, report exact commands and outcomes, and distinguish failures caused by the task from pre-existing or environmental failures. It must not claim a test passed if it was not run successfully. Do not broaden the task into unrelated refactoring without approval.

### 5. Synchronize design and wireframes

> Based on `command.md`, **sync design**: [feature, workspace, or design change] across all affected specifications and wireframes.

The agent must search for related specifications, SVG/PNG target assets, component contracts, inventory entries, source code, and tests; list the affected files and reasons; resolve contradictory documentation; update all genuinely affected files; preserve the distinction between current-state screenshots and authored target designs; and search for stale links and references. Mark a target design Approved only when approval is actually given.

### 6. Audit before changing

> Based on `command.md`, **audit**: [scope]; report inconsistencies and propose a prioritized plan before implementation.

The agent must inspect relevant documentation and code, cite concrete paths and evidence, separate verified facts from assumptions, identify missing specifications or designs, and return a prioritized impact list. Do not implement changes during this audit unless asked.

### 7. Complete an existing task

> Based on `command.md`, **finish**: [existing task, branch, PR, or incomplete change].

The agent must inspect the actual current status, diffs, tests, CI, and documentation; identify unfinished or unverified work; complete only the in-scope work; and provide an evidence-based handoff. Do not assume a prior task or CI run succeeded.

### 8. Plan and implement MCP compatibility

> Based on command.md, **MCP compatibility**: implement the approved plan in specification/mcp/ phase by phase, refactor the app to the shared operation contract, keep browser and MCP adapters independent, add contextual MCP help, tests, Docker support where scheduled, and verify through main CI plus dedicated MCP CI.

Read specification/mcp/README.md and follow the roadmap and architecture, operation contract, tool catalog, workflow, security/privacy, deployment, UI help, testing, acceptance, and CI documents as relevant. First complete Phase 0 audit. Do not mass-refactor or expose every registry item before verifying server compatibility, privacy, schemas, limits, dependencies, and tests. Keep the web UI browser-local by default and MCP transport/server code out of UI components. Update statuses only with exact-revision evidence.

### 10. MCP landing page, demo, and Batch Workbench

> Based on command.md, **MCP web experience**: implement and verify the MCP & Integrations landing page, truthful interactive workflow demo, and a separate Batch Workbench navigation item immediately below Dev Tools. Include hosted and self-hosted/on-premises guidance, accessibility, responsive layouts, localization/RTL, privacy disclosures, tests, and CI evidence.

Read `specification/mcp/README.md`, `specification/mcp/web-ui-help-and-wireframes.md`, `specification/mcp/wireframes/mcp-landing-page-and-workflow-demo.svg`, `specification/mcp/implementation-roadmap.md`, and `specification/mcp/IMPLEMENTATION_PROMPT.md`. Audit actual routes and server-exposed operations first. A demo may be described as live only if it calls the real MCP adapter and allowlisted runtime; otherwise explicitly label it a guided example that was not executed. Never embed privileged tokens in browser code or expose unsupported operations. Hosted/on-premises claims must match verified auth, data flow, retention, network, and deployment behavior. Implement, test, and verify the experience; do not stop at updating the proposal.

### 9. MCP specification or audit only

> Based on command.md, **MCP spec/audit**: audit specification/mcp/ against source, registry, tests, runtime dependencies, CI, and privacy behavior; update the specification and traceability without implementing application code unless explicitly requested.

## Required rules for every command

- Follow `specification/AI_INSTRUCTIONS.md` and the relevant foundation documents.
- For implementation and CI-maintenance tasks, follow the canonical local-verification, pinned browser-environment, workflow-timing, and GitHub Actions evidence requirements in `specification/AI_INSTRUCTIONS.md`; inspect the exact tested commit, required job conclusions and artifact contents before claiming completion.
- Inspect the active branch, baseline commit, actual code, and existing tests before editing.
- Keep current behavior, approved expected behavior, and generated verification evidence distinct.
- For substantial UI or feature changes, specify the target behavior before implementation. Create or update editable target wireframes when layout or interaction needs visual communication.
- Update every affected canonical specification, component contract, inventory, wireframe, and test; do not change unrelated files just to make the update appear comprehensive.
- Reuse established tokens and components unless a justified, documented extension is needed.
- Run relevant tests and inspect rendered browser results when available. Fix regressions introduced by the task and rerun the relevant checks.
- Report the baseline, files changed, exact checks and results, visual coverage, and anything not verified.
- Ask before making consequential product decisions when the intended behavior is unclear.
- Do not create or switch branches, merge, or claim approval unless explicitly requested or actually granted.

## What “done” means

A task is not complete merely because code or documentation was edited. It is complete when the requested scope is implemented, affected specifications and assets are synchronized, applicable verification has been run and reported honestly, and remaining gaps are clearly stated.

## Developer Tools Expansion — phased implementation

For this initiative, use the authoritative [implementation roadmap](specification/new-feature/implementation-roadmap.md), [package README](specification/new-feature/README.md) and [feature inventory](specification/new-feature/feature-inventory.md). Read linked category/tool specifications, wireframes and shared-component contracts for the selected phase before coding.

Reusable command:

> Based on command.md, continue the GaGet.dev developer-tools roadmap: inspect current Git status and verification evidence, select the next eligible incomplete phase from specification/new-feature/implementation-roadmap.md, implement only that phase, test it, update the roadmap with evidence/blockers, and report the next eligible phase. Do not create or switch branches, commit, push, merge or deploy unless separately authorized.

Repeated invocations must resume from code/test evidence and dependencies. Do not repeat completed work or mark a phase complete because a page shell exists. This roadmap supplements the canonical AI workflow and existing command requirements.
