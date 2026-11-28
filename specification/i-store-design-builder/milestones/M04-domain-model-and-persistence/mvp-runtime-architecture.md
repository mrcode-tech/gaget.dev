# MVP Runtime Architecture

Browser-only, session-based runtime with a structured JSON project model in memory. No backend, database, authentication, browser-storage requirement, import, or cloud synchronization. M14 adds explicit local JSON/Markdown export and optional ZIP packaging; it does not add persistence.

## Boundaries
- **Project model:** settings, pages, composition, sample/instance data and progression.
- **Sample catalogue:** authored definitions and field/configuration schemas.
- **Composition logic:** shared instance collection and breakpoint layouts.
- **Renderer:** desktop/tablet/mobile rendering using samples and bounded overrides.
- **Progression logic:** mission state and rules independent of composition.
- **Workspace state:** transient interactions only, without recovery guarantees.

Refresh or close may discard work; the interface must not imply saving or recoverability.

## Non-goals
Permanent storage, autosave, synchronization, authentication, version history, recovery, undo/redo infrastructure, import, collaboration, cloud asset management or deployment of a composed site. Future persistence technology remains open.


## Approved MVP C export boundary

Project state remains session-only and JSON-based in memory. M14 serializes a snapshot to local JSON/Markdown downloads and optionally packages available user-selected media in ZIP. Export is explicit and non-mutating. No import, persistent storage, or recovery is provided.
