# Workflow and Pipeline Contract

**Status:** Partially implemented. The current MCP workflow subset and remaining acceptance gaps are tracked in [implementation progress](./implementation-progress.md).

## User-facing workspace ownership

Batch Workbench is the only general-purpose workflow editor in GaGet.dev. It is separate from Dev Tools and sits immediately below Dev Tools in the primary sidebar. Do not create a second simple workflow or MCP-specific editor.

MCP & Integrations may demonstrate a curated pipeline, but should link to Batch Workbench for full authoring. Both interfaces use this canonical pipeline contract; MCP executes only the subset whose operations are verified for the server runtime. See [MCP Workflow UX Architecture](./workflow-ux-architecture.md).

## Goal and rules
Let AI clients compose approved GaGet operations without reimplementing each transformation. The engine is independent of MCP and the web UI. Browser adapters may execute local workflows; MCP may execute approved server workflows.

- Versioned declarative JSON only; no arbitrary code.
- Each step references an allowlisted operation ID/version.
- Validate each input and explicit output reference.
- Sequential execution first; bounded steps, bytes, time, and concurrency.
- Enforce operation authorization and runtime policy for every step.
- Intermediate values remain in selected runtime and are not persisted by default.
- Failures identify the step and safe error.
- Cancellation cleans workers, buffers, temp files and artifacts where possible.
- Parallel execution, loops, arbitrary expressions, external calls and custom code are deferred.

## Implemented MCP workflow schema

The current MCP endpoint accepts a strict version-1 recipe. A step has a unique ID, an allowlisted operation ID, and an `arguments` object. A direct argument value may reference a previous step's text result using `{ "$ref": "step-id.result" }`.

    {
      "schemaVersion": 1,
      "steps": [
        {
          "id": "decode",
          "operationId": "encoding.transform",
          "arguments": { "mode": "base64", "direction": "decode", "input": "eyJvayI6dHJ1ZX0=" }
        },
        {
          "id": "validate",
          "operationId": "json.validate",
          "arguments": { "input": { "$ref": "decode.result" } }
        }
      ]
    }

Only earlier-step references are allowed, and only operations with text results may be referenced. References are accepted only as direct argument values, not nested inside options. Literal option objects are permitted with bounded nesting. The engine is sequential and fail-fast; it returns step results and a bounded manifest. Unsupported media, arbitrary expressions, loops, parallel execution, and artifact/job references are not available through this workflow tool.

## Lifecycle
1. Validate schema/version.
2. Resolve operations and execution mode.
3. Validate references, graph, step count and budgets.
4. Validate concrete inputs.
5. Execute steps sequentially and record bounded metadata.
6. Validate outputs and size.
7. Apply explicit failure policy; default fail-fast.
8. Return manifest with status, operation IDs/versions, timing, output metadata and safe errors.
9. Clean intermediates unless explicitly returned/retained by policy.

## Help examples
Each MCP-enabled tool should have a short natural-language task prompt and explain which operations can chain. Examples must be tested against the real registry. Example task: parse a URL, extract query parameters, decode a selected value, validate/format JSON, return structured results.

## Browser/server differences
Browser workflows may accept user-selected File/Blob and show previews. Server workflows need explicit transfer, binary representation, authorization, quotas, temp-storage policy and possibly async jobs. A local path or browser object is never implicitly available to remote MCP. Shared schema is supported only for operations with compatible semantics.

## Recipe safety and acceptance
Recipes contain operation IDs, versions, parameters and references, not user data/secrets/file bytes/outputs by default. Imported recipes are untrusted. Reject unknown versions, unsupported operations, excessive steps and oversized files. Never auto-execute imported/AI-generated recipes.

Acceptance: deterministic order; invalid references rejected; outputs satisfy schema; total limits enforced; cancellation/cleanup tested; local workflows do not upload files; MCP cannot invoke disabled operations; examples stay synchronized with registry.
