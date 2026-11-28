# M09 — Testing Strategy

## Test principles

Use synthetic project data, synthetic visual directions, palettes, typography pairings, component samples, and content. Tests must not depend on the real identity or content of an individual business or artist.

Verify M09 in isolation and at its integration boundaries with M04/M05 project state, M06 composition, M07 sample definitions, and M01/M08 review semantics.

## Unit tests

Cover:
- Semantic color-role validation and supported value parsing.
- Identity draft creation, revision, and confirmation transitions.
- Curated catalogue reference validation.
- Typography role and finite-option validation.
- Image-direction option validation without asset-generation assumptions.
- Shared style and spacing preset validation.
- Sample identity compatibility resolution.
- Deterministic mapping of identity roles to sample slots.
- Atomic identity application and failure rollback.
- Preservation of component and responsive composition invariants.
- Contrast-ratio calculation and WCAG 2.2 AA threshold classification.
- Consistency finding generation.

## Component tests

Cover:
- Direction gallery, previews, comparison, and selection state.
- Palette role display and supported adjustment controls.
- Contrast feedback and user-controlled alternatives.
- Typography pairing preview and type-scale controls.
- Image-direction controls and placeholder behavior.
- Shared button/form style selection.
- Spacing/layout preset selection.
- Draft versus active identity presentation.
- Confirmation and error states.
- Keyboard operation, accessible names, focus visibility, and non-color state communication.

## Integration tests

Cover:
- Project identity data is separate from M03 Builder Interface tokens.
- Catalogue definitions are not mutated by project selections.
- Compatible samples consume only declared identity slots.
- Unsupported slots do not receive guessed mappings.
- Identity application preserves instance IDs, sample versions, content, configuration, placeholders, page membership, and responsive order/visibility.
- Draft preview does not mutate active project state.
- Failed application leaves the active identity and composition unchanged.
- Contrast findings remain review information rather than structural validation failures.
- M01/M08 mission status semantics are not changed by identity application.

## Responsive and visual tests

Use the existing desktop, tablet, and mobile canvases simultaneously. Test representative viewport classes and intermediate widths. Include:
- Long and short headings/body content.
- Missing optional content and generic placeholders.
- Palette and typography changes.
- Compatible and incompatible sample slots.
- Different sample designs to ensure visual diversity is preserved.
- Responsive order/visibility variations.
- Contrast examples that pass and fail relevant thresholds.

Record the identity fixture, sample IDs/versions, viewport coverage, and findings.

## Accessibility verification

- Verify WCAG 2.2 AA contrast calculations for normal text, large text, and applicable non-text elements.
- Include boundary values immediately below, at, and above thresholds.
- Verify labels, keyboard use, focus, selected states, and screen-reader announcements for controls.
- Ensure contrast failures are not represented by color alone.
- Verify reduced-motion and text-scaling behavior.
- Do not treat identity contrast unit tests as a full-site accessibility certification.

## Negative tests

- No arbitrary CSS or pixel geometry input.
- No unsupported token mapping.
- No mutation of catalogue definitions.
- No automatic component selection or composition.
- No silent palette correction.
- No identity application that partially updates project state.
- No persistence or browser-storage calls.
- No image generation or stock-image provider dependency.

## Evidence

Before implementation completion, record:
- Test suites and results.
- Sample identity fixtures and versions.
- Contrast test cases and expected ratios.
- Responsive viewport coverage.
- Accessibility findings and disposition.
- Known limitations and deferred cases.

This document defines future verification requirements; no tests are claimed to have been run as part of specification authoring.
