# GaGet.dev MCP Compatibility and Shared Runtime

**Status:** In progress. A bounded MCP runtime, SDK transport, workflow tool, and Docker packaging are implemented; see [implementation progress](./implementation-progress.md) for exact-revision verification and remaining gaps.

## Start here
- [End-to-end implementation prompt](./IMPLEMENTATION_PROMPT.md) — copy this prompt to direct an implementation agent through every phase, including tests, CI, Docker, privacy, and release gates.
- [Architecture](./architecture.md)
- [Shared operation contract](./operation-contract.md)
- [MCP tool catalog](./tool-catalog.md)
- [Workflow and pipeline contract](./workflow-pipelines.md)
- [Security and privacy](./security-privacy.md)
- [Docker and enterprise deployment](./deployment-docker.md)
- [Web UI help and wireframes](./web-ui-help-and-wireframes.md)
- [Testing strategy](./testing-strategy.md)
- [End-to-end acceptance tests](./e2e-acceptance-tests.md)
- [Dedicated MCP CI workflow design](./github-actions-ci.md)
- [Implementation roadmap](./implementation-roadmap.md)
- [Wireframe index](./wireframes/README.md)

## Executive decision
GaGet should become a multi-interface tool platform, not a web UI wrapped by an MCP endpoint. The web UI and MCP server are separate adapters over a shared capability model, operation contracts, and runtime-appropriate implementations. They may share pure transformation code and schemas, but must not share UI state, framework request objects, or assumptions that browser APIs exist on the server.

## Scope
This proposal covers MCP exposure, shared operation contracts, browser/server execution separation, bounded workflow orchestration, contextual per-tool MCP help, Docker/self-hosting, and dedicated CI. It evaluates existing developer tools, JSON Workspace, Image, Audio, Video, and Date & Time without merging their UI navigation models.

MUST, MUST NOT, SHOULD, and MAY express requirements. A proposal is not implementation evidence. Current routes and capabilities remain documented in the product inventories; MCP exposure status, runtime mode, schemas, limits, and prerequisites belong in this package. A route or registry item does not prove server compatibility.

## Required principles
1. One stable capability/operation identity model across interfaces.
2. Separate browser and server adapters and communication contracts.
3. Share implementation code only when runtime assumptions are valid.
4. Preserve browser-local processing for public features that support it.
5. Never upload local files implicitly to satisfy an MCP request.
6. Server-side processing is explicit, bounded, authorized, and documented.
7. MCP invokes allowlisted operations; no arbitrary code, shell, or unrestricted filesystem/network access.
8. Workflows are typed, bounded, observable, and cancellable where supported.
9. Docker deployments are reproducible, configurable, non-root, and testable.
10. Every MCP-enabled tool has accurate help and tested pipeline examples.
11. Dedicated MCP CI complements existing main CI.
12. Preserve routes, aliases, UI behavior, and privacy claims unless an approved spec changes them.

## Status vocabulary
**Proposed** design only; **Audited** current implementation inspected; **Contracted** schema/safety contract approved; **Implemented** code exists; **Verified** exact-revision tests and runtime evidence pass; **Partial** only a documented subset; **Deferred** intentionally unavailable; **Unsupported** not offered.

## Approval gate
Complete Phase 0 and reconcile source, runtime constraints, dependencies, tests, and privacy data flows before implementation. Do not mass-move files or expose every registry item before server compatibility and security audits.
