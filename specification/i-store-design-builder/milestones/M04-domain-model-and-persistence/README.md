# M04 — Domain Model and Persistence

**Status: Approved baseline.** This milestone specifies a browser-only, temporary MVP project model. It does not authorize implementation of persistence, authentication, import/export or collaboration.

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
- Future persistence, history, recovery, export/import, collaboration and auth are deferred.

## MVP scope
Temporary in-memory session. Refresh or browser close may discard work. No autosave, permanent storage, import/export, cloud assets or backend.

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
