# ADR-0001 — Lightweight Session-Based MVP with Explicit Export

**Status:** Accepted — user-selected MVP option C  
**Decision scope:** First MVP release boundary and downstream M10–M15 specifications  
**Affected milestones:** M00, M02, M04, M05, M10–M15

## Context

Earlier approved planning text was inconsistent. M00/M02 included save/recovery, autosave, undo/redo, and version history expectations. M04/M05 later established a temporary browser-only in-memory runtime and deferred persistence and export. The user was asked to choose the first MVP delivery model and explicitly selected:

> Lightweight usable MVP: session-based project state, explicit JSON/Markdown export, no accounts/cloud persistence/backend asset library, and support for placeholders and user-provided asset references.

## Decision

The first MVP uses a browser-only, temporary in-memory project runtime.

Included:
- Project and design state during the active session.
- User-triggered JSON blueprint export.
- User-triggered Markdown handoff export.
- Optional ZIP handoff containing JSON, Markdown, manifest, and user-selected available local media.
- Local user-provided image files held only in a session asset registry.
- Asset manifest and explicit missing/not-embedded notices in standalone JSON/Markdown.

Excluded from MVP:
- Authentication/accounts.
- Database or cloud project storage.
- Durable save/recovery, autosave, browser-storage persistence.
- Undo/redo and version history.
- Server-side uploads or hosted asset library.
- Import/restore of exported project files.
- Collaboration, analytics instrumentation, subscriptions, and payments.

## Rationale

This delivers a usable end-to-end design and developer-handoff workflow without requiring platform infrastructure before the core product is validated. Explicit exports provide a user-controlled way to retain/share work while preserving the approved temporary runtime.

## Consequences

- Refresh/browser close may discard unexported project state and local media.
- The UI must disclose session-only behavior and must not imply autosave or cloud backup.
- JSON/Markdown exports are local downloads and do not mutate project or progression state.
- ZIP packaging is optional; missing or unavailable media must be reported, never silently omitted.
- M15 account, cloud persistence, recovery, and asset hosting capabilities are post-MVP stages.
- Older M00/M02/M04 wording that conflicts with this decision is superseded for the first MVP.
- M14 is the owner of export formats and package integrity; M13 owns session media references; M04/M05 continue to own in-memory project state.

## Alternatives considered

- **A — Interactive prototype only:** no export; rejected because a usable handoff is important to the product outcome.
- **B — Fully hosted product:** accounts, cloud persistence, recovery, uploads, and export in the first release; rejected due to unnecessary infrastructure and operational complexity before validating the core journey.
- **C — Lightweight usable MVP:** accepted.

## Validation and review

This decision was explicitly selected by the user. Revisit only if implementation constraints or user research show that session-only work/export is insufficient. Any change to the release boundary requires a new explicit decision.
