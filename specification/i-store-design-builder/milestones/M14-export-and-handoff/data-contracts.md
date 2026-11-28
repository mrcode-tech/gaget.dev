# M14 — Export Data Contracts

## Canonical blueprint
Top-level conceptual shape:
- schemaId
- schemaVersion
- exportStatus: complete | incomplete
- project
- websiteIdentity
- sharedElements
- pages
- navigation
- progressionSummary
- contentAndMediaManifest
- qualityFindings
- limitations
- exportOptions

## Project
Includes stable project ID, project name, purpose, audience/offering/outcome where supplied, and optional user notes. Do not invent missing values.

## Pages
Each page includes stable ID, kind, title, purpose, route, page order, shared-element references, ordered section instances, and desktop/tablet/mobile layouts.

## Section instance
Includes instance ID, component type, exact sample ID/version, sample-defined content values, finite options, content statuses, placeholder purposes, identity compatibility summary, and responsive settings.

## Media manifest
Each asset record includes assetId, originalFileName, mediaType, byteSize, dimensions when known, referencedBy slot IDs, availability (available | missing | notIncluded), packagedPath only when embedded, and checksum when embedded. Never export object URLs or runtime File/Blob references as portable URIs.

## Markdown output
The report is a human-readable projection of the same canonical snapshot. It must not contain contradictory status or omit known blocking findings.

## ZIP manifest
Includes package schema version, files, sizes, checksums, asset mapping, and export status. Paths are relative and sanitized.

## Invariants
- JSON and Markdown represent the same project snapshot.
- Complete/Incomplete follows M01.
- Export does not modify project state.
- Asset omission is explicit.
- Sample ID/version and stable page/instance IDs are preserved.
- No generated production source code is included.
