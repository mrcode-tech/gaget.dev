# MCP Workflow UX Architecture and Wireframe Specification

**Status:** Target design; not proof of current implementation.  
**Capability inventory:** [capabilities.md](./capabilities.md)  
**Desktop wireframe:** [wireframes/unified-batch-workbench.svg](./wireframes/unified-batch-workbench.svg)

## 1. Product and navigation decisions

Batch Workbench is the only pipeline editor. It is a main sidebar item immediately below Dev Tools and must not appear in the Dev Tools catalog, category navigation or search. Keep its existing canonical route; do not create a second simple workflow editor. MCP & Integrations is a separate destination for protocol overview, runtime-derived capability catalog, setup, security/privacy notes and showcase recipes. A showcase may load a recipe into Batch Workbench.

The pipeline orchestrates operations from existing product workspaces; it does not force Image, Audio, Video, Date & Time or JSON into a single UI.

## 2. Architecture

- Capability inventory: intended scope and audit checklist in capabilities.md.
- Runtime registry: actual executable MCP allowlist and schemas; the only source for current MCP claims.
- Operation adapters: translate UI input and MCP arguments to operation contracts.
- Browser runtime: verified browser-compatible operations; selected files stay local unless explicitly exported/transferred.
- Server runtime: only operations with tested server adapters; browser-only APIs cannot be assumed.
- Pipeline validator: validates IDs, versions, parameters, references, input/output types and budgets before execution.
- Pipeline executor: sequential by default; typed outputs, per-step status, deadlines/cancellation, cleanup and artifact manifests.
- MCP adapter: only allowlisted operations; bounded content or authorized expiring artifact references.
- Batch Workbench UI: input selector, typed source panel, searchable picker, step cards, run controls and typed result viewer.
- MCP landing page: setup/catalog/showcase, not a second editor; never call a mock a live run.

## 3. User journey

1. Open Batch Workbench and choose Text, JSON/structured text, Image, Audio, Video, File/Binary, Multiple files or Date & Time.
2. Paste/type input or explicitly select/drop a file. Show accepted formats, size and available metadata.
3. Search by task, operation, alias, category or type. Filter to operations compatible with current input/output and chosen runtime.
4. Add/configure steps. Output type becomes next step's input. Reordering or edits revalidate downstream steps.
5. Review preflight: incompatible steps, unsupported runtime operations, and known output/resource budgets.
6. Before remote transfer, show configured destination and known transfer/retention behavior.
7. Run sequentially. Show truthful state, safe errors and Cancel where supported. Never fake progress.
8. Preview/copy/download result or use it as the next compatible input.
9. Optionally export a versioned recipe containing configuration only. Import validates and never auto-runs.

## 4. Searchable operation picker

Use the existing shadcn/Radix combobox/listbox pattern. Support keyboard navigation, type-ahead, Escape, focus return, accessible names and an empty state. Search title, description, aliases, keywords, category and input/output types. Each result displays input → output, runtime, availability, MCP exposure and relevant limits. Browser availability is not MCP exposure. Planned/deferred operations cannot run. Suggest explicit conversion steps only when they actually exist.

## 5. Desktop wireframe anatomy

The linked SVG is a static concept wireframe, not a screenshot. Target desktop uses three zones when width permits:
- **Input (about 22–25%):** input type, editor or existing styled dropzone, file metadata, accepted formats/limits and execution/privacy mode.
- **Pipeline (about 43–48%):** operation search, compatible choices, ordered step cards, parameters, typed connectors, add/reorder/duplicate/remove and validation.
- **Result (about 30–33%):** type-specific preview, copy/download/use-as-next-input, artifact manifest, run summary and safe errors.

Run/Cancel remains prominent. Do not squeeze three columns at tablet widths. The crop → resize → Base64 sample is an illustrative target only until every operation is verified in the selected runtime.

## 6. Responsive and state wireframes

**Tablet:** compact input summary at top or left rail; pipeline is primary; parameter/result details in a side panel or sheet. Keep picker usable and Run/Cancel reachable.

**Mobile:** single vertical flow: input → steps → result. Full-width search; parameter controls in an accessible sheet/dialog; step cards show types. Provide move up/down as an alternative to drag. Never hide Run/Cancel behind a sheet.

**Short viewport/landscape:** scrollable panels must not trap focus or clip actions. Keep active step, close/return control and Run/Cancel reachable.

**Empty/input states:** empty workspace; text/JSON editor; image/audio/video/file dropzone; explicit multi-file list; permission-gated capture; unsupported format/codec rejection before expensive work.

**Pipeline states:** empty chain; compatible configured step; invalid type connection that blocks Run; running with real status; failed step preserving input/configuration; cancelled with cleanup; completed typed output; multi-artifact manifest; remote-transfer confirmation.

## 7. MCP landing page demo

The MCP & Integrations page should show transport/setup, runtime-derived executable capability list, hosted versus self-hosted distinctions, limitations, privacy/security notes and curated examples. Label each showcase either **Live run** only when a real MCP request traverses the configured transport and runtime allowlist, or **Guided example — not executed** for static output. Never put private inputs in URLs. The demo and Batch Workbench share recipe metadata, but remote execution is limited to server-exposed operations.

## 8. Safety and privacy

Validate the whole chain before execution. Bound bytes, characters, pixels, duration, frames, file count, output, time and concurrency. Clean temporary artifacts at every terminal state. No arbitrary code/shell, dynamic imports, filesystem paths, URL fetch or unrestricted network. Browser-local operations stay local; remote MCP sends data to the configured server. Remote MCP cannot read browser files, camera or microphone without an explicitly designed and permissioned bridge. Public anonymous demos require synthetic data, a narrow allowlist, quotas, timeouts, output/concurrency caps and abuse controls; otherwise keep them non-executed. Do not claim zero retention, encryption, compliance or air-gap without evidence.

## 9. Design system, accessibility and localization

Reuse GaGet shell, design tokens, themes, editors, file/dropzone, dialogs/sheets and shadcn-style controls. Avoid generic chatbot styling; emphasize operation types and execution state. Support keyboard selection/reordering, visible focus, screen-reader announcements, reduced motion, sufficient contrast, touch targets and non-color-only statuses. All strings localizable; Persian/Arabic RTL must remain correct.

## 10. Acceptance checklist

- [ ] Batch Workbench appears once in main sidebar directly below Dev Tools, never in Dev Tools catalog/search.
- [ ] Input selector covers applicable input types.
- [ ] Picker is accessible, searchable, localized, type-aware and truthful about runtime/MCP.
- [ ] Whole chain validates before execution; conversions are explicit.
- [ ] Text/file/media/date-time outputs can be chained when contracts permit.
- [ ] Crop → resize → Base64 runs only where every step is verified.
- [ ] Result viewer follows actual output type; multi-artifacts use manifests.
- [ ] Limits, cancellation, cleanup and transfer consent are enforced.
- [ ] Recipe import validates and never auto-runs; export excludes data/secrets by default.
- [ ] Showcase labels live execution versus guided example truthfully.
- [ ] Desktop/tablet/mobile/short-height, light/dark, RTL, keyboard and screen reader are tested.
- [ ] Inventory, registry, API, UI, help, demo and CI are reconciled.
