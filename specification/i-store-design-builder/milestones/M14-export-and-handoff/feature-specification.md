# M14 — Feature Specification

## 1. Export entry
A clearly labeled Export / Handoff action is available from project review/workspace. Export is always user-initiated and available for partial projects.

## 2. JSON blueprint
The canonical JSON contains:
- schema name and version.
- export status Complete/Incomplete.
- project identity and purpose context.
- pages, page routes, purposes, and ordering.
- shared site elements and navigation relationships.
- active M09 identity and semantic token selections.
- section/component instances with exact sample IDs/versions.
- sample-defined content values and finite configuration.
- content status and placeholder purposes.
- desktop/tablet/mobile order, visibility, and responsive overrides.
- asset manifest metadata and embedding state.
- mission/level progress summary and unfinished/Needs review items.
- quality findings and known limitations.

Use stable identifiers and preserve referential integrity. Do not serialize runtime File/Blob objects or browser object URLs as portable asset locations.

## 3. Markdown handoff
Provide project summary and intended visitor outcome; Complete/Incomplete status and explanation; page map and navigation; shared identity; ordered sections and sample/version; responsive differences; content readiness and placeholders; media manifest and missing/unembedded notices; blocking errors, warnings, informational findings; developer notes and limitations.

The report must not imply production implementation or deployment.

## 4. Optional ZIP package
Include project.json, handoff.md, manifest.json, and assets/ with explicitly selected, currently available user files. The manifest maps asset IDs and original names to packaged relative paths and includes media type, size, and checksum. Sanitize paths and filenames. Prevent path traversal and duplicate-name collisions.

The user may exclude media. If a referenced file is unavailable in the current session, mark it missing and list it in the manifest; do not silently omit it.

## 5. Determinism and versioning
For identical project state, schema version, and options, JSON/Markdown content and ZIP entry ordering must be deterministic. A volatile export timestamp may be included in package metadata only and must not affect semantic comparison. Schema version changes require documented compatibility notes.

## 6. Export review
Before download, show Complete/Incomplete state; page and section counts; unfinished missions and review items; warnings/blocking findings; referenced, included, and missing media counts. The user explicitly chooses format and whether to include available media.

## 7. Privacy and local processing
Generate output locally in the browser. No project or asset content is transmitted to a server. Explain that downloads are user-controlled and may contain sensitive project information.

## 8. Failure behavior
If serialization fails, report the affected area and allow retry. Do not produce a silently truncated export. If ZIP media packaging fails, allow JSON/Markdown export separately and report missing assets.
