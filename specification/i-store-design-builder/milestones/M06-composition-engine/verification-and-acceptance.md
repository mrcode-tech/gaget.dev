# Verification and Acceptance

## Purpose

Define testable completion criteria and verification coverage for M06.

## Acceptance criteria

| ID | Criterion |
|---|---|
| M06-AC01 | Users can browse, select, and independently preview predefined samples. |
| M06-AC02 | Preview and selection do not mutate project composition. |
| M06-AC03 | Users explicitly confirm a sample before insertion. |
| M06-AC04 | After confirmation, users choose a relative insertion position or append. |
| M06-AC05 | Insertion creates a unique independent instance and updates all three layouts. |
| M06-AC06 | Users can reorder instances through drag/drop and accessible non-drag controls. |
| M06-AC07 | Ordering is independent across desktop, tablet, and mobile. |
| M06-AC08 | Users can replace a sample only with another sample of the same component type. |
| M06-AC09 | Replacement preserves compatible content, defaults incompatible fields, previews the result, and requires confirmation. |
| M06-AC10 | Replacement cancellation leaves the original instance unchanged. |
| M06-AC11 | Removal requires confirmation and removes shared membership across all breakpoints. |
| M06-AC12 | Hiding a component is breakpoint-specific and does not delete it. |
| M06-AC13 | Duplication creates a new identity with independent content/configuration/placeholders. |
| M06-AC14 | Users can edit only sample-defined content fields. |
| M06-AC15 | Users can select only finite sample-defined configuration options. |
| M06-AC16 | Users can configure purpose-aware placeholders and supported optional user asset references. |
| M06-AC17 | Shared content/configuration updates all three previews. |
| M06-AC18 | Breakpoint-specific order, visibility, and supported presentation update only the intended canvas. |
| M06-AC19 | Structural and schema validation prevents invalid composition states. |
| M06-AC20 | Valid operations update previews immediately; invalid operations leave state unchanged. |
| M06-AC21 | The implementation preserves M04/M05 module isolation, runtime, and domain boundaries. |
| M06-AC22 | Existing GaGet application behavior and global styling are unaffected. |

## Unit tests

Cover:
- Instance identity and ownership.
- Insert position calculation.
- Responsive order updates.
- Move validation and no-op boundaries.
- Replacement schema compatibility and defaults.
- Removal reference cleanup.
- Duplication identity and value independence.
- Content/configuration schema validation.
- Visibility and responsive presentation updates.
- Placeholder compatibility.
- Atomic failure behavior and invariant enforcement.

## Component/integration tests

Cover:
- Catalogue selection and independent preview.
- Confirm/position/insert flow.
- Insertion indicators and accessible move controls.
- Replacement preview, confirmation, and cancellation.
- Removal confirmation and cancellation.
- Duplicate behavior.
- Sample-defined properties controls.
- Placeholder editing.
- Three-canvas synchronization and breakpoint isolation.
- Recoverable renderer and validation errors.

## End-to-end and accessibility verification

Use synthetic project/sample data. Verify the isolated builder route and complete core composition workflow. Include keyboard-only operation for insertion, ordering, replacement, removal, and properties editing. Verify visible focus, semantic labels, accessible announcements for meaningful state changes, and drag/drop alternatives.

Test responsive workspace sizes without collapsing the three-canvas model into a single-device tab. Verify horizontal scrolling or workspace zoom where necessary.

## Engineering verification

Run the repository's applicable:
- Unit tests.
- Component/integration tests.
- End-to-end tests.
- Accessibility checks.
- Lint.
- Typecheck.
- Production build.

Record actual evidence and failures. Do not mark implementation or verification complete merely because the specification is approved.

## Explicit non-goals for verification

Do not require backend/database/authentication, browser persistence, autosave, undo/redo, history, recovery, collaboration, import/export, AI, stock imagery, image generation, or detailed visual editing.

## Definition of done

- [x] M06 product decisions are approved.
- [x] Scope, boundaries, and acceptance criteria are specified.
- [ ] Composition engine implementation is complete.
- [ ] Required automated and manual verification passes with evidence.
- [ ] Known limitations and follow-up work are recorded.

Approval of this document set completes the specification milestone only.
