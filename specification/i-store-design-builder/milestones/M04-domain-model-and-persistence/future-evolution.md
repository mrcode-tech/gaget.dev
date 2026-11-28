# Future Evolution (Conceptual Only)

Avoid coupling the domain model to browser storage, backend services, database technology, authentication or export formats.

Possible future capabilities, not MVP commitments:
- Local/server persistence.
- Authentication, project ownership and claiming.
- Autosave, synchronization and recovery.
- Named snapshots/version history.
- Undo/redo history.
- JSON import (deferred); explicit JSON/Markdown export is approved in M14 under MVP C, with optional ZIP handoff packaging.
- Archive/deletion/recovery lifecycle.
- Asset storage and management.
- Sharing/collaboration.
- Sample compatibility and migration tools.

This milestone does not prescribe detailed contracts, a database schema, event sourcing or implementation technology for these features.


## MVP C clarification

M14's explicit local export is now part of the first MVP: JSON blueprint and Markdown handoff, with optional ZIP packaging of selected available session media. Import remains deferred. Export does not change this milestone's in-memory-only project model and does not imply persistence or recovery.
