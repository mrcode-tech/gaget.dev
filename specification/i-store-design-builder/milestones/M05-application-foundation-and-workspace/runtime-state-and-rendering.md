# Runtime State and Rendering

## Purpose

Define the lightweight runtime architecture for the first workspace foundation, aligned with the approved M04 model.

## Runtime constraints

- Browser-only.
- Temporary project state held in memory.
- Structured typed JSON domain representation.
- No backend, database or authentication.
- No browser-storage persistence requirement.
- Refresh or browser close may discard the project.
- No autosave, undo/redo infrastructure, history or recovery guarantee.

## State boundaries

Keep distinct responsibilities for:
- **Project domain state:** project identity, settings and pages.
- **Page/composition state:** page metadata and component composition model, initially empty.
- **Responsive layout state:** desktop/tablet/mobile structures.
- **Catalogue state:** static sample definitions and catalogue browsing metadata.
- **Mission state:** progression data separate from composition.
- **Workspace UI state:** transient panel, selected category, selected sample and preview visibility.

Transient UI state must not be confused with persisted project data.

## Domain model

Use typed domain structures and validate explicit invariants at appropriate state boundaries. M04 remains the source of truth for conceptual entities and relationships.

Keep:
- Catalogue sample definitions separate from inserted component instances.
- Shared project/page content separate from breakpoint-specific layout data.
- Progression separate from composition.
- Placeholder metadata separate from optional asset references.

M05 initializes the project and empty responsive layouts but does not need to implement the complete instance lifecycle or composition engine.

## Actions and update boundaries

Use a centralized project-state owner with lightweight action/command boundaries. UI components should request domain changes through explicit actions rather than mutate nested project objects directly.

M05 actions cover only what the foundation needs, such as:
- Creating/initializing a project.
- Updating permitted initial project metadata.
- Changing transient workspace selection and panel state.
- Selecting and clearing a catalogue preview.

Do not implement insertion, reorder, replacement, responsive visibility, or full content editing actions in M05.

State updates should preserve immutability and validate relevant invariants. Invalid updates should return a controlled failure/result for the UI to explain; they must not leave partially mutated project data.

## Renderer registry

Use a registry that maps a stable component/sample rendering key to an isolated renderer implementation.

Each renderer receives a typed sample definition and validated preview data through a consistent contract. Renderers must not own project state or modify the project as a side effect.

The registry should:
- Detect unknown or missing renderer registrations.
- Provide a controlled unavailable-preview state.
- Permit adding a sample renderer without turning the catalogue into a large conditional component.
- Keep sample-specific markup and styling isolated.

M05 only requires renderers for the synthetic samples included in the initial catalogue.

## Error boundaries and resilience

Handle malformed sample data, missing renderer registration and preview rendering failures with understandable local error states. Avoid introducing a broad recovery framework or persistence recovery mechanism.

## Acceptance checks

- Project state is centralized and typed.
- UI does not mutate domain objects directly.
- Domain invariants are checked at update/initialization boundaries.
- Workspace transient state is separate from project domain state.
- Catalogue definitions and renderer implementations are separate.
- Renderer registry handles unknown registrations without crashing the entire workspace.
- No persistence or recovery behavior is implied.
