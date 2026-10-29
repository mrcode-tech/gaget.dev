# MCP Architecture and Runtime Separation

**Status:** Proposal. See [package overview](./README.md).

## Objective
Expose selected GaGet capabilities to compatible AI clients using MCP while preserving a first-class browser-local web app and supporting self-hosted server-side processing. The MCP server must not depend on the web UI being loaded. The web UI must not depend on MCP or a remote processing endpoint for local operations.

## Workflow product experience

The product has one general-purpose workflow editor: **Batch Workbench**, a primary sidebar destination immediately below Dev Tools. MCP & Integrations is an education/setup page with a curated demo, not a second workflow editor. See [MCP Workflow UX Architecture](./workflow-ux-architecture.md) for the navigation and acceptance contract.

The workflow engine is a shared capability service. Batch Workbench's web adapter and the MCP adapter may reuse the same versioned pipeline schema, operation IDs, validation, execution budgets, and result-manifest contract where runtime-compatible. Keep UI state, MCP transport, authentication/authorization adapters, and browser/server runtime assumptions separate. The public demo uses a constrained recipe from this same pipeline model and links to Batch Workbench. Only operations verified for server execution can be presented as MCP-executable.

## Logical architecture
    Human -> Web UI -> Browser adapter -> Browser runtime -----+
                                                               +--> Capability registry
    AI client -> MCP transport -> MCP adapter -> Server runtime+          |
                                                               +----> Workflow engine
                                                                            |
                                                                    Approved operations

This is a logical model, not a required folder layout or deployment topology.

## Responsibilities
- **Capability registry:** stable IDs, versions, descriptions, schemas, runtimes, limits, availability, dependencies, privacy behavior. Metadata is not proof of implementation.
- **Operation library:** transformations independent of React, Next.js route handlers, MCP SDK objects, navigation, and transport. Prefer pure functions for text/data. Media may need runtime-specific implementations.
- **Browser runtime:** Canvas, Web Audio, MediaRecorder, workers, File/Blob inputs, previews, object URLs, downloads. Local operations stay local; no silent server fallback.
- **Server runtime:** approved server-compatible operations, temporary files, worker/job lifecycle, resource limits, optional artifact retrieval. No browser UI dependencies.
- **Workflow engine:** validates bounded sequences of registered operations; no arbitrary code; enforces step count, payload budgets, deadlines, cancellation, types, and failure policy.
- **Web adapter:** maps UI state/input to operations and handles forms, accessibility, progress, previews, downloads.
- **MCP adapter:** maps MCP calls to server operation/workflow services, validates requests, authorizes, and returns structured results. It contains no transformation logic.
- **Deployment adapter:** configuration, health, logging, auth integration, runtime wiring.

## Same contract, different communication
| Concern | Browser web UI | MCP |
|---|---|---|
| Caller | Human using page | AI client |
| Input | Form, text, selected File/Blob | Structured args, supported binary content, authorized artifact reference |
| Execution | Browser for local-capable operations | Server for remote MCP calls |
| Local file access | Browser can read user-selected files | Remote MCP cannot access a browser tab file without explicit transfer/reference/local bridge |
| Progress | UI/worker state | Immediate result or explicit job/status API |
| Output | Preview/copy/download | Structured result, bounded binary content, or authorized artifact |
| Privacy | Locality must be testable | Transfer/retention must be explicit |
| Errors | Localized user-facing diagnostics | Stable codes and safe summaries |

A shared contract does not require one runtime. Unsupported modes must be rejected rather than silently switched.

## Runtime boundaries
- Browser modules must not import Node-only packages.
- Server modules must not rely on window, document, Canvas, AudioContext, MediaRecorder, or object URLs.
- Keep secrets and server config out of frontend bundles.
- Use build/bundle checks to catch boundary leaks.
- Share public capability metadata only if it contains no secrets.
- Text/JSON transforms are likely early cross-runtime candidates. Canvas, Web Audio and MediaRecorder are browser-specific unless separate server implementations are provided and verified.
- Date/time operations must define time zone, locale, invalid-date, and clock semantics.

## Compatibility and exit criteria
MCP is additive. Preserve canonical routes, redirects, semantics, and local browser execution. The registry/operation contract is transport-independent; web UI has no MCP SDK dependency; MCP adapter has no React/browser-state dependency; representative shared operations pass parity tests; unsupported modes fail clearly; privacy behavior remains intact.
