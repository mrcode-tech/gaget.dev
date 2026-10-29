# Workflow and Pipeline Contract

**Status:** Proposal.

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

## Illustrative schema
    {
      "schemaVersion": 1,
      "steps": [
        { "id": "decode", "operationId": "encoding.base64.decode",
          "input": { "text": "eyJvayI6dHJ1ZX0=" } },
        { "id": "validate", "operationId": "json.validate",
          "input": { "text": { "$ref": "decode.result.text" } } },
        { "id": "format", "operationId": "json.format",
          "input": { "text": { "$ref": "decode.result.text" }, "indent": 2 } }
      ]
    }

Illustrative only; IDs and fields must match the registry before advertised as executable. Reject missing references, incompatible types, cycles, unknown operations, oversized payloads, and invalid parameters.

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
