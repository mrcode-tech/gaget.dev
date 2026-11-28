# M13 — Testing Strategy

## Unit

Test field schema validation, content status transitions, placeholder requirements, link syntax, route references, asset metadata, MIME/size/dimension validation, asset ID resolution, alt-text rules, finding severity, and readiness aggregation.

## Component

Test text/URL/collection controls, content-state selection, placeholder purpose, local file picker, preview/replacement/removal, asset reuse, alt-text controls, quality finding navigation, and session-loss messaging.

## Integration

Test M07 sample field schemas, M06 instance data, M09 contrast findings, M11 responsive findings, M12 route/navigation integrity, and M14 export manifest/package handoff.

## Media tests

Use synthetic JPEG/PNG/WebP fixtures, malformed files, spoofed extensions, oversized files, corrupt image data, missing registry IDs, and repeated asset references. Verify no network upload or persistent browser storage.

## Accessibility

Keyboard content editing, field labels, required state, status announcements, image alt text, error association, focus, and non-color severity communication.

## Negative

Reject arbitrary field creation, unsupported content types, SVG in MVP, invalid file types, unbounded crop values, unknown asset IDs, automatic media assignment, automatic rewriting, and persistent storage.

All test media must be synthetic and safe. No real user assets in test fixtures.
