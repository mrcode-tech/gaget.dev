# M10 — Technical Design

## Placement

M10 is a feature layer inside the isolated Website Design Builder module. It reuses M05 workspace, M06 composition commands, M07 catalogue contracts, M08 guidance/progress, and M09 identity resolution.

## Responsibilities

- Homepage context and page-specific mission links.
- Section-library navigation and filters.
- Sample preview orchestration.
- User-confirmed insertion workflow.
- Homepage structural/content validation.
- Shared frame reference handling.
- Visitor-action metadata.

## Reused services/contracts

Do not implement a second composition engine, catalogue, identity model, responsive model, or mission system. Use:
- M04 page/component/project entities.
- M06 section instance lifecycle and commands.
- M07 taxonomy/sample definition/version contracts.
- M09 active identity and compatibility mappings.
- M01 responsive membership/order/visibility invariants.

## Command boundaries

M10 UI actions dispatch existing M06 commands. Any M10-specific page metadata updates must be typed, validated project-state changes. Preview operations are read-only. No side effect may insert or reorder a section without explicit user action.

## Shared frame

Represent site-wide header/navigation/footer references separately from ordinary homepage-local sections if the existing model supports this distinction. The canonical data contract must avoid duplicate instances and define how M12 reuses these elements on other pages.

## Validation

Use deterministic validators over the typed project state and sample schemas. Validation reports findings; it does not mutate content or composition. Findings include stable target IDs for navigation.

## Runtime

Temporary in-memory project state only. No persistence, autosave, undo/redo, history, authentication, or backend.
