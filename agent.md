# Agent Entry Point

This file is a compatibility pointer for agents that look for `agent.md`. The canonical repository-wide instructions are in [`AGENTS.md`](./AGENTS.md); read and follow that file and [`specification/AI_INSTRUCTIONS.md`](./specification/AI_INSTRUCTIONS.md) before non-trivial work. If any text here conflicts with those canonical instructions, the canonical files take precedence.

## MCP compatibility and web product experience

For MCP tasks, read [`specification/mcp/README.md`](./specification/mcp/README.md) and follow [`specification/mcp/implementation-roadmap.md`](./specification/mcp/implementation-roadmap.md) and [`specification/mcp/IMPLEMENTATION_PROMPT.md`](./specification/mcp/IMPLEMENTATION_PROMPT.md). For UI work, also read [`specification/mcp/web-ui-help-and-wireframes.md`](./specification/mcp/web-ui-help-and-wireframes.md) and the [MCP landing page and workflow demo wireframe](./specification/mcp/wireframes/mcp-landing-page-and-workflow-demo.svg).

Workflow UX decision: Batch Workbench is the only general-purpose workflow/pipeline editor and must be a separate primary sidebar item immediately below Dev Tools. Do not create a second simple workflow feature/menu or MCP-only editor. The MCP landing page demonstrates a curated recipe from the same canonical pipeline model and links to Batch Workbench; reuse contracts and validation where runtime-compatible, but keep web and MCP adapters, authorization, transport, and UI state separate. Only server-verified operations can be included in MCP-executable workflows.

Required product direction:
- Implement a public **MCP & Integrations** landing page that explains supported operations, setup, and hosted versus self-hosted/on-premises use.
- Keep **Batch Workbench** as a separate primary sidebar item immediately below **Dev Tools**. It must be useful without MCP and remain distinct from individual tools, MCP help, the landing page, and the transport endpoint.
- A demo is “live” only when it invokes the real MCP adapter and allowlisted runtime. Otherwise, label it as a guided example that was not executed.
- Use synthetic sample data by default. Never embed privileged credentials in frontend code. If anonymous live execution is enabled, enforce a narrow allowlist, strict quotas/timeouts/output limits, and abuse controls; disclose remote data transfer before custom input is sent.
- Advertise only verified server-exposed operations. Browser-only features and UI routes do not prove MCP compatibility.
- Ensure hosted and on-premises guidance matches verified authentication, data transfer, retention, network, and deployment behavior. Do not make unsupported security, privacy, air-gap, or compliance claims.
- Follow existing design-system, responsive, accessibility, localization/RTL, and testing requirements. Update roadmap/progress only with exact-revision test and CI evidence; documentation and wireframes alone do not prove implementation.

Use `command.md` command **MCP web experience** for this scope. Do not skip the phase audit, tests, or CI verification.
