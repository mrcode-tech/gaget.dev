# MCP Workflow UX Architecture — One Batch Workbench

**Status:** Required target design; implementation status must be verified separately.  
**Scope:** Product navigation, workflow composition, MCP integration, and the public MCP demo.

## Decision

GaGet.dev has exactly one general-purpose user-facing workflow/pipeline editor: **Batch Workbench**. It is a first-class primary sidebar destination immediately below **Dev Tools**. Do not create a second “Simple Workflow”, pipeline builder, or MCP-only workflow editor under Dev Tools, MCP & Integrations, or another navigation group.

This is a product UX decision, not a claim that all pipeline operations are already implemented or MCP-compatible.

## Navigation model

- **Dev Tools:** individual developer tools and their catalog/categories.
- **Batch Workbench:** the single general-purpose workspace for composing, reviewing, running, inspecting, importing/exporting where supported, and reusing multi-step operation recipes.
- **MCP & Integrations:** public education and setup destination. It explains supported operations, transport/client configuration, deployment modes, security/data flow, and shows a curated workflow demonstration. It is not a second pipeline editor.
- **Individual tool/workspace routes:** remain focused on the single capability and may link to contextual MCP help.
- **MCP transport endpoint:** protocol endpoint only; never use it as a human-facing landing page.

The landing page should be discoverable from an appropriate navigation surface without overcrowding the existing app shell. The sidebar position for Batch Workbench is mandatory; the exact placement of MCP & Integrations should be confirmed against the actual responsive navigation and existing route conventions.

## Shared execution architecture

Use a shared, versioned declarative pipeline contract and compatible workflow service across interfaces. Reuse stable operation IDs, schemas, validation, authorization checks, budgets, error shapes, and result-manifest semantics where technically compatible.

Keep these concerns separate:
- **Shared capability layer:** operation registry and status, versioned schema, typed references, validation, execution budgets, safe errors, and result manifest.
- **Batch Workbench web adapter:** editor state, human interaction, preview, progress, accessibility, localization, and browser-specific file handling.
- **MCP adapter:** protocol transport, authentication/authorization, server runtime policy, structured MCP results, and protocol errors.
- **MCP landing-page demo:** a constrained sample flow or real, explicitly policy-limited MCP invocation. It is not a parallel general-purpose editor.

Do not share React state, framework request objects, MCP SDK objects, or browser-only assumptions across these boundaries. The web UI must not require MCP to perform browser-local operations. The MCP adapter must not rely on a browser tab or silently access its selected files.

## MCP workflow compatibility

A pipeline may be offered for MCP execution only if:
1. Every step references a stable operation ID exposed by the current server registry.
2. Each operation is implemented for the server runtime and marked available/approved.
3. Input/output schemas, data references, limits, authorization, and error behavior are validated.
4. The complete chain satisfies aggregate step, input, output, time, memory, concurrency, and artifact budgets.
5. Runtime and privacy behavior are documented, including explicit data transfer where applicable.
6. Tests exercise the actual MCP adapter/runtime and reject unavailable or browser-only operations.

A route, catalog card, browser-only capability, or Batch Workbench feature does not prove MCP support.

## Public MCP demo

The landing page should demonstrate the same pipeline model with a curated example such as Base64 decode → JSON validation → JSON formatting, only when those operations are verified for server execution.

- Use synthetic sample data by default.
- Show ordered steps, status, output, result manifest, and a disclosure for the actual MCP request/response with secrets and sensitive values redacted.
- Label the execution state prominently: **Live MCP request** only for real adapter/transport/runtime execution; otherwise **Guided example — not executed**.
- A public anonymous live demo needs its own narrow allowlist, quotas, deadlines, payload/output limits, concurrency limits, abuse controls, and no production secrets or arbitrary network/filesystem access.
- Never put a privileged token in frontend code. Explain remote transfer before allowing custom input to be submitted.
- Link to **Open Batch Workbench** for full pipeline authoring. Do not duplicate the full editor on the landing page.

## Hosted and self-hosted paths

Present hosted GaGet.dev and self-hosted/on-premises as distinct ways to connect. Describe only verified transport, authentication, retention, logging, external network dependencies, and configuration behavior. Self-hosting gives operators control over their deployment environment; it does not by itself establish air-gap operation, compliance, or that no data leaves their network.

## Design-system requirements

Inspect existing app shell, sidebar, route conventions, shadcn-style controls, code editor/output panels, dialogs, copy controls, status indicators, and responsive behavior before implementation. Reuse established components and tokens. Support keyboard navigation, visible focus, screen-reader labels, mobile and short-height layouts, theme, localization, RTL, reduced motion, loading/error/empty states, and bounded output presentation.

## Acceptance criteria

- Batch Workbench is the sole general-purpose workflow editor and appears immediately below Dev Tools in the primary sidebar.
- No duplicate simple workflow or MCP-only workflow editor is added.
- MCP & Integrations demonstrates a curated recipe and links to Batch Workbench.
- Both web and MCP paths use the canonical pipeline contract where runtime-compatible without coupling UI state and transport.
- The MCP catalog/demo advertises only server-verified operations.
- Live and guided demo states are truthful and distinguishable.
- Privacy, authentication, retention, and deployment claims match code and tests.
- Automated tests cover navigation, workflow contract reuse, unavailable operation rejection, demo mode labelling, transfer disclosure, responsive/accessibility behavior, and relevant errors.
- Exact commit, CI runs, and test artifacts are recorded before marking the design implemented or verified.

## Related specifications

- [MCP overview](./README.md)
- [Architecture and runtime separation](./architecture.md)
- [Workflow and pipeline contract](./workflow-pipelines.md)
- [Web UI help, landing page, and demo requirements](./web-ui-help-and-wireframes.md)
- [Implementation roadmap](./implementation-roadmap.md)
- [End-to-end implementation prompt](./IMPLEMENTATION_PROMPT.md)
- [Landing page and demo wireframe](./wireframes/mcp-landing-page-and-workflow-demo.svg)
