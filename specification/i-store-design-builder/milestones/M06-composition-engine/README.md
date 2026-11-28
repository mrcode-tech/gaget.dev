# M06 — Website Composition Engine

**Status: Approved baseline — specification complete.** This milestone defines the user-directed, sample-based high-level composition engine. Approval covers the product and technical specifications only; it does not claim application implementation or verification is complete.

## Objective

Extend the M05 catalogue and workspace foundation into a functional page-composition experience. Users select predefined samples, preview them independently, explicitly insert them into an active page, arrange high-level component instances, and edit only the content and finite configuration options declared by each sample.

**Product boundary:** this is a high-level website composition builder, not a Figma-like detailed editor. Users do not author internal component structure, arbitrary CSS, pixel geometry, or unrestricted nested layouts.

## Architectural context

GaGet is the temporary environment for specifications and the first MVP. The builder remains an isolated, portable module that can later be extracted into a standalone codebase. M06 must preserve M04's conceptual model and M05's typed runtime, command boundaries, sample catalogue, and renderer registry.

The MVP remains browser-only, temporary, in-memory JSON. No backend, database, authentication, browser-storage persistence, autosave, undo/redo, history, or recovery guarantee is introduced.

## Approved decisions

| ID | Area | Decision |
|---|---|---|
| M06-01 | Composition | High-level component instances only; no internal freeform editing |
| M06-02 | Insertion | Select, independently preview, confirm, choose position, then insert |
| M06-03 | Position | Choose before/after an existing component or append |
| M06-04 | Ordering | Drag/drop plus accessible non-drag move controls |
| M06-05 | Replacement | Replace with a sample of the same component type; preserve compatible content |
| M06-06 | Removal | Confirmation identifying the component before removal |
| M06-07 | Content | Edit sample-defined typed content fields only |
| M06-08 | Configuration | Finite sample-defined options; no arbitrary styling or geometry |
| M06-09 | Identity | Every inserted instance has independent identity and data |
| M06-10 | Duplication | Create a new independent instance |
| M06-11 | Visibility | Breakpoint-specific visibility |
| M06-12 | Ordering | Independent ordering for desktop, tablet, and mobile |
| M06-13 | Shared content | Shared content/configuration across breakpoints except explicitly supported responsive overrides |
| M06-14 | Placeholders | Purpose-aware placeholders and optional user asset references |
| M06-15 | Sample change | Replace sample within the existing instance, preserving compatible content |
| M06-16 | Page scope | Edit one active page at a time |
| M06-17 | Validation | Structural and schema validation |
| M06-18 | Feedback | Immediate preview updates after valid operations |
| M06-19 | History | No undo/redo or history infrastructure in this MVP |
| M06-20 | Scope | Core composition engine; advanced assets and extensive styling excluded |

## Key interaction flows

### Insert

Browse catalogue → select sample → independent preview → confirm sample → choose insertion position → create instance → update all three canvases.

Previewing never mutates composition. No insertion occurs without explicit confirmation and position selection.

### Replace

Choose another sample of the same component type → preview candidate → compare schemas → preserve compatible values and default incompatible/new fields → preview replacement → confirm → update the existing instance atomically.

Cancellation leaves the original unchanged. Replacement preserves instance identity and valid responsive state.

### Remove and duplicate

Removal requires a clear confirmation and removes shared membership from all three responsive layouts. Hiding is a separate breakpoint-specific operation.

Duplication creates a new identity with copied values and independent subsequent edits.

## Responsive composition

The page has one shared component collection and three responsive layouts. Desktop is the membership surface for insert, remove, replace, and duplicate. Tablet and mobile cannot change shared membership; they can independently reorder, hide/show, and adjust sample-declared responsive presentation options.

Shared content changes update all three previews. Breakpoint-specific changes affect only the target canvas. All three canvases remain simultaneously available; narrow workspaces use horizontal scrolling or zoom.

## Validation and rendering

All domain mutations pass through explicit command boundaries and validate before commit. Invalid operations return controlled failures and leave the prior valid state unchanged. Extend the M05 renderer registry; sample renderers receive validated definitions, instance content/configuration, and responsive presentation inputs, and never mutate project state.

## Scope exclusions

- Figma-like detailed editing, arbitrary CSS, freeform geometry, and unrestricted nested elements.
- User-authored component templates.
- Backend, database, authentication, persistence, autosave, undo/redo, history, or recovery.
- Collaboration, import/export, or asset-management infrastructure.
- AI recommendations or generation, stock imagery, or image generation.
- Cross-page component movement or simultaneous multi-page editing.

## Documents

- [Composition domain model](composition-domain-model.md)
- [Insertion and ordering](insertion-and-ordering.md)
- [Replacement, removal, and duplication](replacement-removal-and-duplication.md)
- [Content and configuration](content-and-configuration.md)
- [Responsive composition](responsive-composition.md)
- [Placeholders and user assets](placeholders-and-assets.md)
- [Commands, validation, and rendering](commands-validation-and-rendering.md)
- [Verification and acceptance](verification-and-acceptance.md)

## Relationship to earlier milestones

- **M00:** generic, user-directed product strategy and guardrails.
- **M01:** free navigation, user-directed composition, shared component collection, independent responsive layouts, placeholders.
- **M02:** sample-based high-level editing boundary and three-canvas workspace.
- **M03:** builder visual system and progressive website component portfolio.
- **M04:** conceptual entities, sample/instance separation, typed content, responsive data model, and temporary in-memory runtime.
- **M05:** isolated workspace, typed runtime, static sample catalogue, independent preview, and renderer registry.

M06 refines composition operations without silently changing earlier approved decisions. M04/M05's later-approved deferral of persistence and history governs over earlier provisional M02 expectations for autosave/undo/redo.

## Completion status

- [x] M06 decisions reviewed and approved.
- [x] Composition model and lifecycle operations specified.
- [x] Responsive behavior and validation rules specified.
- [x] Content, configuration, and placeholder boundaries specified.
- [x] Verification strategy and acceptance criteria documented.
- [ ] Application implementation — future work.
- [ ] Automated and manual implementation verification — future work.

## Governance

Use synthetic project and sample data in specifications and tests. Keep specification approval distinct from implementation and test completion. Do not modify GaGet global behavior or couple the module to GaGet-specific business logic.
