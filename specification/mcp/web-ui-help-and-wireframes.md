# Web UI Integration, Per-Tool MCP Help, and Workflow Guidance

**Status:** Partially implemented for supported developer-tool routes. Coverage, localization, and media-workspace gaps remain; see [implementation progress](./implementation-progress.md).  
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
