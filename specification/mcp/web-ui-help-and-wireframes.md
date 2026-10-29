# Web UI Integration, Per-Tool MCP Help, and Workflow Guidance

**Status:** Partially implemented for supported developer-tool routes. Date & Time workspace integration is added in the next revision and remains pending CI. Full localization and media-workspace gaps remain; see [implementation progress](./implementation-progress.md).  
**Wireframe:** [MCP help panel proposal](./wireframes/mcp-help-panel-proposal.svg)

## Objective
Make MCP discoverable without mixing MCP transport into the web UI. Every tool/workspace with a verified MCP capability should provide contextual help explaining what an AI can do, how to configure a compatible client, and how to chain supported operations.

Help is documentation/discovery, not an MCP client, live connection indicator, or remote execution switch. Browser-local actions continue to use browser runtime.

## Placement
- Add a consistent **AI / MCP help** entry to each tool/workspace with at least one verified MCP capability.
- Open a shared dialog, sheet, or help route using existing project shadcn-style components.
- Inspect existing dialogs, sheets, code blocks, copy controls, and command bars before creating a new pattern.
- A tool without verified support may show “MCP support planned” only if approved; never show fake connection status.
- A public overview may explain supported capabilities but must not imply every UI operation is remotely executable.

## Required per-tool content
1. Name and MCP exposure status.
2. Supported operations and limits.
3. Runtime mode: browser-local, server-side, or both.
4. File-transfer/privacy explanation and whether server upload is required.
5. A minimal natural-language task prompt.
6. Operation chain in plain language and stable IDs where useful.
7. Tested workflow example once workflows are available.
8. MCP setup instructions and tested client configuration.
9. Failure cases, size/format limits, unsupported behavior.
10. Full docs link and version/compatibility notes.

Never include credentials/private endpoints in public copy. Do not assume every AI client supports every transport.

## Example
Image Editor prompt: “Resize these images to 1200 × 1200, convert them to WebP, and return a result manifest.” The proposed chain inspects dimensions/format, validates parameters, resizes, converts/compresses, and returns outputs plus a manifest. Help must state whether the server supports the chain. If only browser-local editing exists, explain that remote MCP cannot access files open in the browser and mark the remote workflow unavailable.

Developer tools prompt: “Decode this Base64 text, validate it as JSON, then format the result.” Advertise as supported only when each operation and the chain are verified. Test examples against the registry.

## States
**Available:** verified operations/setup/limits/examples. **Partial:** supported subset distinguished from unavailable operations. **Planned:** no functional invocation action. **No supported operation:** honest status and overview link. Loading/error states are needed only for dynamically fetched help.

## Accessibility and acceptance
Keyboard reachable, visible focus, Escape closes and focus returns, dialog has accessible name/description, code samples selectable with copy confirmation, mobile layout avoids overflow, long config is bounded/scrollable, theme/localization/RTL/reduced-motion supported. Essential help must not be hover-only.

The SVG is a target concept labelled Proposal, not current-state evidence. Update it with the prose contract after design review. Every verified MCP tool must link accurate help; privacy is explained before server transfer; help passes accessibility, responsive, theme, localization/RTL, and copy tests.

## Public MCP landing page and interactive demonstration

**Target route:** `/mcp` (or the repository's established equivalent after route audit). This is a public product/education page, distinct from contextual per-tool help and distinct from the MCP transport endpoint. Do not use a route name that conflicts with the actual protocol endpoint.

### Product goals

The page should explain the value of MCP to both developers and technical decision-makers, demonstrate a real supported operation, and give visitors a clear path to use GaGet.dev as a hosted service or run it in infrastructure they control. It must not imply that every browser feature is remotely callable or that a self-hosted deployment is already enterprise-certified.

### Page structure

1. **Hero:** concise value proposition such as “Bring GaGet.dev tools into your AI workflows.” Explain that compatible MCP clients can discover and call supported GaGet operations. Primary CTA: **Try the MCP demo**. Secondary CTA: **Connect your client**. Tertiary text link: **Self-host GaGet.dev**.
2. **Three-step explainer:** connect a compatible MCP client; discover the verified tool catalog; run an operation or a bounded workflow. Use a small request → operation → result visual, not generic AI artwork.
3. **Interactive demo / Workflow Lab:** a safe, guided sample that chains supported text/encoding/JSON operations. Include a task prompt, ordered steps, editable sample input, Run, per-step status, output preview, and a result manifest. A “Show MCP request/response” disclosure exposes the actual tool name, bounded arguments, and sanitized result/error. Include a reset action and clear size/time limits.
4. **Demo execution truthfulness:** a live demo must invoke the real MCP adapter/transport and actual allowlisted runtime; it must not call a mocked function and label it “live MCP.” Public anonymous access, if supported, must use a dedicated demo policy with a narrow operation allowlist, synthetic/sample data by default, strict request/output/time/concurrency quotas, abuse controls, and no access to production secrets or arbitrary URLs/filesystem/network. Never embed a privileged bearer token in browser code. If a safe public live path is not available, present a clearly labelled guided example with copyable request/response and do not claim it executed. Do not accept sensitive user data in a public demo by default.
5. **Batch Workbench and MCP workflow demo:** explain that Batch Workbench is the one first-class user-facing workspace where people compose and run multiple supported operations. The landing page demonstrates a curated example of that same pipeline model and links to the workbench; it is not a second workflow editor. Offer “Use this workflow with MCP” only for operations verified by the server registry. Do not conflate browser-only file workflows with remote MCP workflows.
6. **Tool catalog and compatibility:** show only verified server-exposed operations, runtime mode, input/output types, limits, version/compatibility, and supported workflow composition. Distinguish Available, Partial, Planned, and Unsupported. Never derive availability from a UI route alone.
7. **Choose how to run GaGet.dev:** present two equally understandable deployment paths:
   - **Hosted GaGet.dev:** quickest start; connect a compatible client to the documented hosted endpoint if one is actually available. State authentication, data transfer, retention, limits, availability, and pricing only when confirmed. Explain that data sent to remote MCP is processed by that server according to the published policy; browser-local UI operations remain local unless the user explicitly transfers data.
   - **Self-hosted / on-premises:** link to Docker/deployment docs and a configuration checklist. Explain that operators control the deployment environment and its network/storage policy, but must configure authentication, TLS/reverse proxy, access controls, logs, updates, backups if needed, and resource limits. Do not claim “air-gapped,” “zero data leaves your network,” or compliance certification unless tests and deployment documentation support the claim. Document outbound network behavior and optional external dependencies accurately.
8. **Trust and security:** summarize explicit transfer, allowlisted operations, bounded inputs/workflows, authentication expectations, no arbitrary code execution, and retention/cleanup behavior supported by the current implementation. Link to the full security/privacy contract and publish known limitations.
9. **Getting started and FAQ:** tested client configuration, supported transports/protocol version, common auth errors, workflow example, local-vs-remote file access, and links to API/tool docs.

### Single workflow experience and shared pipeline model

**Product decision:** GaGet.dev has one user-facing multi-operation workflow experience: **Batch Workbench**. Do not create a second “Simple Workflow”, “Workflow Builder”, or pipeline workspace under Dev Tools or as a competing MCP-specific workspace.

- Batch Workbench is the canonical UI for composing, reviewing, running, and re-running a sequence of supported operations. It is a first-class primary sidebar destination directly below **Dev Tools**, and it remains useful without an MCP client.
- The workflow/pipeline engine is a shared capability contract, not a second menu destination. The web adapter and MCP adapter may call the same validated, bounded workflow service where runtime-compatible, but must keep their transport, authorization, and UI state separate.
- The MCP & Integrations landing page contains a **demo of the same workflow concept**, not another full workflow editor. It should use a guided sample or the real, policy-limited MCP path and link to Batch Workbench for building and managing user workflows.
- An MCP client can invoke a workflow only when the workflow operation and every step are exposed and verified in the server-side MCP registry. UI-only operations must not appear in MCP recipes.
- Keep workflow definitions portable and versioned where practical. Share the canonical schema, operation IDs, validation, limits, and result-manifest shape; avoid duplicating pipeline logic in the landing-page demo, Batch Workbench, and MCP server.
- The demo may have a constrained, curated recipe UI, but must not silently grow into a second general-purpose editor. If it cannot execute through the real MCP path safely, label it as a guided, non-executed example.

### Navigation and information architecture

- Add **Batch Workbench** as its own primary sidebar item immediately below **Dev Tools**. It is a multi-operation workspace, not a category inside the individual tool catalog. Reuse the existing app shell and responsive navigation conventions.
- Add a public **MCP & Integrations** destination in the product's appropriate navigation surface (or a discoverable link from the main navigation/footer if a primary slot would overcrowd the shell). It leads to the landing page, not directly to an endpoint or raw technical docs.
- Keep individual Dev Tools, Batch Workbench, MCP & Integrations, and the transport endpoint as distinct concepts. Confirm actual routes and avoid duplicate/conflicting navigation entries before implementation.
- Link contextual MCP help from supported tools to the landing page and back to relevant operation documentation.

### Interaction, privacy, and accessibility requirements

- The demo starts with synthetic sample data and makes the execution mode visible: **Live MCP request** or **Guided example — not executed**. Never imply a live request succeeded before a real response is received.
- Before a user submits custom data to a remote demo, show that it leaves the browser and is sent to the configured server. Keep sample-only mode as the default; do not retain demo input/output by default.
- Never expose auth tokens, private endpoint URLs, internal stack traces, or unredacted server logs in displayed MCP payloads. Keep request and result displays bounded and copyable.
- The demo must work with keyboard and screen readers, provide visible focus and accessible step statuses, avoid color-only state, and handle loading, timeout, rate-limit, auth, unsupported-operation, and server-error states.
- Responsive layout: desktop can use side-by-side workflow/result panels; tablet and mobile stack the steps, input, output, and request inspector without horizontal overflow. Support existing theme, localization, RTL, and reduced-motion conventions.
- Track product analytics only if already approved and implemented under the privacy policy; do not add hidden content capture or telemetry as part of the demo.

### Acceptance criteria

- The page route, navigation, content, and links are verified against the actual app.
- Demo operations are selected from the verified MCP registry and covered by end-to-end tests.
- A live demo proves a real request/response and enforces its restricted policy; otherwise the UI explicitly identifies the example as not executed.
- Hosted and self-hosted guidance matches implemented deployment/authentication/data-flow behavior and lists limitations.
- The Batch Workbench appears below Dev Tools in desktop and responsive navigation, has its own route, and can demonstrate at least one supported multi-step workflow.
- The demo and catalog do not advertise browser-only operations as remotely available.
- Accessibility, localization/RTL, responsive, error-state, privacy, and route/navigation tests pass.

