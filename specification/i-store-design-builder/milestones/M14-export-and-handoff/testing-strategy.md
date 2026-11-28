# M14 — Testing Strategy

## Unit
Test DTO mapping, schema version, M01 status derivation, stable ordering, JSON serialization, Markdown rendering, asset manifest, filename sanitization, checksum generation, and ZIP manifest.

## Integration
Verify all page/section/sample versions, M09 identity, M11 layouts, M12 navigation, M13 content statuses/findings, and asset references are represented consistently across outputs.

## Determinism
Export the same fixture repeatedly and compare JSON/Markdown bytes and ZIP entry order/content, excluding explicitly volatile package metadata.

## Media
Test available, missing, excluded, duplicate filename, unsupported, oversized, and corrupted files. Verify no object URL or raw runtime object leaks into portable output.

## Security/privacy
Test path traversal names, unsafe filenames, malformed metadata, large packages, and absence of network requests/browser persistence.

## End-to-end
Export incomplete and complete synthetic projects in each format; inspect generated files and verify package integrity. Confirm project state remains unchanged.

No import/round-trip project restoration is expected in MVP.
