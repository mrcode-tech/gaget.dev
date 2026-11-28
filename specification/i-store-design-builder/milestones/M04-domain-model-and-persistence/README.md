# M04 — Domain Model and Persistence

**Status: Approved baseline, amended by MVP C decision.** This milestone specifies a browser-only, temporary MVP project model. It does not authorize persistence, authentication, import, or collaboration. Explicit JSON/Markdown export is approved later by the user's MVP C decision and specified in M14.

## Objective
Define a coherent model for generic, user-directed website composition. Validate selection of predefined samples, high-level composition, bounded content editing and three responsive layouts.

## Decisions
- Browser-only; no backend or database.
- Anonymous temporary projects; no authentication or ownership infrastructure.
- In-memory JSON representation; no permanent storage or browser-storage requirement.
- One project contains multiple pages, each with metadata, route, purpose, settings, composition and status.
- Catalogue sample definitions separate from unique inserted instances.
- Sample-defined typed content schema and bounded configurations.
- Shared content/identity; responsive ordering, visibility and supported presentation overrides.
- Desktop controls shared component membership; tablet/mobile cannot add/remove/replace.
- Placeholder metadata and optional asset references; no asset-management infrastructure.
- Progression conceptually separate from composition.
- Technology-neutral conceptual future model.
- Durable persistence, history, recovery, import, collaboration, and auth are deferred. Explicit JSON/Markdown export is an approved M14 exception; it is a local download, not persistence.

## MVP scope
Temporary in-memory session. Refresh or browser close may discard work. No autosave, permanent storage, import, cloud assets or backend. M14 adds explicit local JSON/Markdown export and optional ZIP packaging of currently available user-selected media without changing the in-memory-only runtime.

## Documents
- [Domain model](domain-model.md)
- [Relationships](entity-relationships.md)
- [Responsive model](responsive-data-model.md)
- [Sample and instance model](component-sample-and-instance-model.md)
- [Mission model](mission-and-progression-model.md)
- [Runtime architecture](mvp-runtime-architecture.md)
- [Future evolution](future-evolution.md)
- [Acceptance criteria](acceptance-criteria.md)

Generic website support, user-directed sample selection, bounded content editing and isolation from the existing GaGet shell remain guardrails. This is not a detailed visual editor.


## Approved MVP C clarification

M04's original export deferral is narrowed: M14 is authorized to implement explicit user-triggered JSON and Markdown export, plus optional ZIP handoff packaging. This does not authorize project import, persistent storage, browser storage, backend services, autosave, or recovery. M13 local image files remain session-only and may be packaged only while available in the active session.
