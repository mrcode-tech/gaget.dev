# Developer Tools Expansion — Design Package

**Status:** Active implementation package. Seven planned standalone tools now have working subsets; the inventory and roadmap identify their limits and the remaining proposed capabilities.

## Start here
1. [Feature inventory](./feature-inventory.md) — stable IDs, status and traceability.
2. [Implementation roadmap](./implementation-roadmap.md) — authoritative phased execution plan.
3. [Architecture and integration](./architecture-and-integration.md).
4. [Design system and reuse](./design-system-and-reuse.md).
5. [Category specifications](./categories/).
6. [Planned tool specifications](./tools/planned-tools.md).
7. [Wireframes](./wireframes/README.md).
8. [Shared component contracts](./shared-components/README.md).

## Source and exclusions
Primary source: [Developer Tools Capability Proposal](../product/developer-tools-capability-proposal.md). Registry: lib/tools/registry.ts. Catalog contract: [Tool Catalog and Workspace Architecture](../product/tool-catalog-and-workspace-architecture.md).

Scope includes all proposed developer-tool workspaces and existing planned standalone developer utilities. Photo/Image, Audio, Video, Date & Time and the existing JSON Workspace are excluded from implementation scope. JSON remains canonical and may be referenced by conversion tools.

Registry metadata is not proof of runtime behavior. Recheck source, tests and browser evidence before claiming availability.

## Status vocabulary
- **Available in registry; runtime not verified:** registry marks available, but this task did not run the app.
- **Planned:** registry explicitly marks planned.
- **Proposed:** candidate capability from the proposal.
- **Conditional/deferred:** requires feasibility, security, dependency or demand review.
- **Verified:** only after implementation, tests and applicable runtime evidence.

## Core rules
Reuse existing components first. Prefer project shadcn/ui-style primitives and wrappers over raw, unstyled controls. File-only workflows reuse the existing file-input zone if suitable; mixed text/file workflows retain the styled editor and add styled file selection. A new reusable component requires both a justified specification and wireframe. Prefer local processing where technically supported and disclose exceptions. Encoding is not encryption; JWT decoding is not signature verification; file indicators are not a safety verdict.

All wireframes here are **Proposal** until approved.


## Cross-cutting MCP initiative

MCP compatibility is specified separately in specification/mcp/. That initiative may evaluate developer tools in this package, but it does not override this package's existing scope exclusions or imply that browser operations are server-compatible. MCP operation mapping and server exposure status must be verified independently.
