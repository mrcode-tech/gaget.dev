# Repository AI Instructions

Before any non-trivial feature, refactor, UI, design-system, route, or interaction task, read and follow [specification/AI_INSTRUCTIONS.md](specification/AI_INSTRUCTIONS.md).

That document is the canonical AI workflow, including CI runtime maintenance and evidence verification. It defines how to:
- Discover current-state baseline evidence and approved target design specifications.
- Read shared design foundations and component contracts.
- Update or add required design specifications before implementation.
- Implement against approved behavior and existing design tokens.
- Run tests and inspect browser screenshots.
- Update specifications, inventories, and target SVG/PNG assets after verification.
- Report exact test results and anything not verified.

Do not duplicate the full workflow in this file. If this pointer conflicts with the canonical instructions, the canonical specification wins.

## Developer-tools expansion

For tasks covered by the proposed developer-tools expansion, read [the package README](specification/new-feature/README.md) and follow [the implementation roadmap](specification/new-feature/implementation-roadmap.md). Consult the linked inventory, category/tool specifications, wireframes and component contracts before implementation. Inspect existing components before proposing replacements; prefer existing shadcn/ui-style controls and wrappers. Update roadmap progress only with code/test evidence. This roadmap is additive and does not override specification/AI_INSTRUCTIONS.md.


## MCP compatibility and shared runtime

For any MCP, shared-operation, workflow-engine, server-runtime, Docker, or per-tool MCP-help task, read specification/mcp/README.md and follow specification/mcp/implementation-roadmap.md. Treat architecture.md, operation-contract.md, tool-catalog.md, workflow-pipelines.md, security-privacy.md, deployment-docker.md, web-ui-help-and-wireframes.md, and the testing/CI documents as canonical for this initiative.

Do not couple the web UI to MCP transport or server endpoints. Preserve browser-local execution for local-capable operations; never silently upload a browser-selected file. Reuse schemas and operation logic where runtime-compatible, but maintain separate browser/server adapters and implementations where required. Expose only audited, allowlisted operations. Workflow definitions must be typed, bounded, and non-executable. Do not mark a phase or capability verified without tests and evidence from the exact commit in GitHub CI. This package is additive to the existing developer-tools expansion and does not silently change its scope.
