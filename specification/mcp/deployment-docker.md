# Docker, Self-Hosting, and Enterprise Deployment

**Status:** Implemented for a self-hosted Docker baseline; exact-revision evidence and remaining operational gaps are tracked in [implementation progress](./implementation-progress.md).

## Goal
Enable individuals and enterprises to deploy GaGet's web UI and MCP server in infrastructure they control without requiring public GaGet.dev to process their files.

## Deployment profiles
**Combined profile:** convenience image contains web UI and MCP service as separate logical processes/services. Lifecycle, health checks, signal handling, and failure isolation must be explicit. One image does not mean shared code paths or trust boundaries.

**Separate-service profile:** UI service, MCP service, optional worker for long-running media tasks, and optional temporary artifact storage. Services may share versioned operation packages and schemas.

**Recommendation:** establish logical separation first, then support a combined deployment and a separate UI/MCP deployment where useful. Do not require a microservice per category.

## Container requirements
- Run as non-root; pin runtime/base image and dependency versions.
- Use a minimal production image; exclude development/test tooling.
- Expose only required ports; provide health/readiness checks and graceful shutdown.
- Apply CPU, memory, process, request, and concurrency limits.
- Do not bake secrets or environment-specific URLs into images.
- Use read-only root filesystem where feasible with explicit temporary storage.
- Clean temporary files and artifacts.
- Generate an SBOM and review dependency licenses, especially media/codec dependencies.
- Document tags, compatibility, upgrade and rollback.
- Build and exercise the image in CI before claiming it verified.

## Configuration
Document and validate UI origin, MCP transport/bind address, auth/authorization, enabled operations and modes, request/file/output size, operation timeout, workflow budget, concurrency, temp directory/retention, artifact expiry, logging/redaction, health checks, and trusted-proxy settings. Choose exact names/defaults during implementation and document sample configuration. Never commit secrets.

## File transfer and artifacts
Remote MCP clients must send data through an explicitly supported mechanism or an authorized reference accessible to the server. A local path or browser object URL is not transferable by implication.

Large outputs need a scoped job/artifact contract: unpredictable or access-controlled IDs, caller authorization, expiry, size limits, cleanup, safe content type/download name, no public directory listing, and no persistent retention by default.

## Network deployment
Document TLS-terminating reverse proxy support, CORS/origin behavior, and allowed network paths. CORS is not authentication. Keep MCP private when a gateway is required. Restrict outbound network access by default. Document trusted-proxy settings.

## Acceptance
Clean Docker build; non-root runtime and health checks; documented MCP client invokes known-answer operation; UI-local operations work without MCP; auth/allowlists enforced; limits and cleanup demonstrated; interrupted jobs shut down safely; versions and deployment docs are current.
