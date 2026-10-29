# Shared Capability and Operation Contract

**Status:** Proposal.

## Purpose and terminology
Define one generic, versioned contract for browser and MCP use. Standardize identity, schemas, limits, errors, runtime modes, and result metadata without forcing a single implementation across environments.

- **Workspace:** cohesive UI with shared state.
- **Capability:** user-facing task family.
- **Operation:** one callable transformation/computation.
- **Adapter:** maps a communication contract to an invocation.
- **Runtime:** environment that executes the operation.
- **Workflow:** validated composition of operations.
- **Artifact:** bounded binary output with defined lifecycle.

A route, menu item, capability, operation, and MCP tool are different concepts.

## Illustrative contract
The implementation must follow repository conventions and reuse existing schema validation where possible.

    type ExecutionMode = "browser" | "server";
    type OperationDefinition<I, O> = {
      id: string;
      version: string;
      title: string;
      description: string;
      inputSchema: unknown;
      outputSchema: unknown;
      supportedModes: ExecutionMode[];
      limits: {
        maxInputBytes?: number;
        maxOutputBytes?: number;
        timeoutMs?: number;
        maxItems?: number;
      };
      execute(input: I, context: OperationContext): Promise<O>;
    };
    type OperationContext = {
      executionMode: ExecutionMode;
      signal: AbortSignal;
      requestId: string;
    };

Schemas must be serializable or have explicit JSON Schema for MCP. Shared operations must not depend on React, Next.js request objects, MCP SDK objects, or browser globals.

## Required metadata
Every exposed operation declares stable namespaced ID/version, human/model descriptions, input/output schemas, supported modes, size/item/time limits, cancellation, file formats, network/filesystem needs, privacy/retention, dependencies, exposure status, and tests proving the subset. IDs must not derive from routes or localized labels. Breaking schema changes need versioning and compatibility tests.

## Invocation lifecycle
1. Resolve allowlisted ID.
2. Authenticate/authorize where required.
3. Validate input schema.
4. Check mode, quotas, sizes, dependency readiness.
5. Create bounded context and abort signal.
6. Execute runtime-specific implementation.
7. Validate output schema and size.
8. Return success or safe structured error.
9. Release buffers, object URLs, temporary files, and intermediates.

Do not trust client-declared size, MIME type, or permissions without server validation.

## Errors
Use stable categories: INVALID_INPUT, UNSUPPORTED_OPERATION, UNSUPPORTED_EXECUTION_MODE, UNSUPPORTED_FORMAT, RESOURCE_LIMIT_EXCEEDED, TIMEOUT, CANCELLED, PROCESSING_FAILED, DEPENDENCY_UNAVAILABLE, AUTHENTICATION_REQUIRED, PERMISSION_DENIED. Map domain failures to MCP results consistently. Never return stack traces, paths, secrets, environment variables, or raw sensitive values.

## Results and binary data
Results include success/failure, operation ID/version, result payload, warnings, and bounded metadata. Binary bytes remain bytes unless text encoding is explicit. Define per-adapter representation: bounded embedded content, supported MCP content blocks, or authorized artifact reference. Artifact references must be access-controlled and expire. Enforce limits before reading whole payloads. Never expose browser object URLs to remote clients. Avoid base64 expansion for large media.

## Contract tests
Every operation needs known-answer fixtures, malformed/boundary cases, schema checks, limits, stable errors, runtime capability tests, and browser/server parity tests only where equal semantics are claimed. UI availability alone does not qualify an operation for MCP exposure.
