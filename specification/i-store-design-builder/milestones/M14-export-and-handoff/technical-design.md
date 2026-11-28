# M14 — Technical Design

## Architecture
M14 is a client-side serialization and packaging layer over the typed M04 project model, M06 composition, M09 identity, M10–M12 page/layout data, and M13 content/media registry.

## Pipeline
1. Read a consistent project-state snapshot.
2. Validate structural integrity and resolve references.
3. Derive Complete/Incomplete using M01 rules.
4. Transform domain state into a versioned canonical export DTO.
5. Produce JSON and Markdown from the same snapshot.
6. Optionally resolve selected session asset IDs and package available files.
7. Verify package manifest and internal paths.
8. Trigger user-initiated local download.

No export stage mutates project state.

## Schema versioning
Use an explicit schema identifier and semantic version. Unknown future fields are handled according to documented compatibility rules by consumers; the MVP builder does not import them. Schema changes require compatibility notes.

## Determinism
Sort unordered collections by stable IDs; preserve user-defined page, section, and navigation order explicitly. Normalize JSON formatting and Markdown headings. ZIP entry paths/order are stable. Exclude volatile browser object URLs and raw runtime references.

## Media packaging
Resolve asset IDs against M13's in-memory registry. Copy bytes only for assets explicitly selected for inclusion and currently available. Compute checksums. Sanitize file paths and names. No network fetch is permitted.

## Privacy and performance
All serialization and ZIP work is local. Apply documented size limits and avoid blocking UI during larger package creation. If size exceeds supported limits, offer JSON/Markdown without media.

## Failure handling
Validate before packaging. Fail the affected output rather than produce incomplete/corrupt bytes. Keep project state unchanged.
