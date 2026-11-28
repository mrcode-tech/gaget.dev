# MVP Runtime Architecture

Browser-only, session-based runtime with a structured JSON project model in memory. No backend, database, authentication, browser-storage requirement, import/export or cloud synchronization.

## Boundaries
- **Project model:** settings, pages, composition, sample/instance data and progression.
- **Sample catalogue:** authored definitions and field/configuration schemas.
- **Composition logic:** shared instance collection and breakpoint layouts.
- **Renderer:** desktop/tablet/mobile rendering using samples and bounded overrides.
- **Progression logic:** mission state and rules independent of composition.
- **Workspace state:** transient interactions only, without recovery guarantees.

Refresh or close may discard work; the interface must not imply saving or recoverability.

## Non-goals
Permanent storage, autosave, synchronization, authentication, version history, recovery, undo/redo infrastructure, import/export, collaboration, cloud asset management or deployment of a composed site. Future persistence technology remains open.
