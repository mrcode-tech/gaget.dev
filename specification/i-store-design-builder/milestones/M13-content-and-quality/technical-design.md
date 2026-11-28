# M13 — Technical Design

## Architecture

M13 composes M04/M06 typed content data, M07 sample schemas, M09 identity, M11 responsive findings, and M12 page/navigation validation. It must not create a separate CMS or asset service.

## Content editor

Generate controls from sample-declared field schemas. Validate values at command boundaries. Content readiness state is explicit project data.

## Temporary asset registry

Maintain an in-memory registry outside the JSON-serializable project document for File/Blob objects. Project state stores stable session asset IDs and metadata. Rendering resolves IDs through this registry.

The registry is volatile and cleared when the session ends. No IndexedDB, localStorage, Cache API, server upload, CDN, or cloud asset service.

## Media safety

Validate MIME type, extension consistency, file size, and decoded image dimensions. Treat file names and metadata as untrusted. Avoid SVG in MVP. Do not execute or interpret user files as markup.

## Quality evaluator

Validators are deterministic, read-only functions over project state, sample schemas, asset registry metadata, and derived responsive/contrast findings. Results are derived and may be recalculated. They do not mutate project data.

## Cross-milestone integration

M09 provides contrast findings; M11 provides responsive findings; M12 provides route/link integrity; M10 provides homepage-specific requirements. M13 aggregates findings and adds content/media checks without duplicating rule ownership.

## Runtime and export

All project data and asset registry entries are session-local. M14 consumes current project data and explicitly selected available media to produce exports. No background upload or persistence is introduced.
