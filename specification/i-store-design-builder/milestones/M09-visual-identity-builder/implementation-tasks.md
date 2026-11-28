# M09 — Implementation Tasks

These are dependency-ordered planning tasks for future implementation. They do not authorize or claim application-code changes.

## Phase 1 — Contracts and authored catalogue

1. Define typed identity domain contracts within the existing M04/M05 model.
2. Define stable identifiers/versioning for visual directions, palettes, typography pairings, image directions, shared styles, and spacing/layout presets.
3. Author the initial curated identity catalogue using synthetic previews and generic website contexts.
4. Define the sample-level identity compatibility contract and versioned mappings.
5. Document defaults, missing-option behavior, and unsupported-slot behavior.

## Phase 2 — Identity workflow

6. Add identity-stage navigation within the isolated builder module.
7. Keep the website canvas and three responsive previews available.
8. Implement direction discovery, comparison, selection, and explicit aspect combinations.
9. Implement palette selection and supported semantic-role adjustments.
10. Implement typography pairing and bounded hierarchy selection.
11. Implement image-direction choices without adding asset sourcing/generation.
12. Implement shared button/form styles and spacing/layout presets.

## Phase 3 — Preview and application

13. Implement draft identity state separate from the active project identity.
14. Render draft identity against representative compatible samples without project mutation.
15. Implement deterministic compatibility resolution.
16. Implement atomic confirmation/application.
17. Verify preservation of all M06 composition and instance invariants.
18. Surface unsupported or affected sample presentation for review.

## Phase 4 — Accessibility and consistency

19. Implement WCAG 2.2 AA contrast evaluation for applicable text and non-text combinations.
20. Present actionable contrast findings without silent correction or blocking exploration.
21. Implement identity consistency findings for color, typography, shared styles, and responsive presentation.
22. Verify keyboard, focus, semantic labels, non-color status communication, reduced motion, and text scaling.

## Phase 5 — Verification and refinement

23. Add unit, component, integration, responsive, visual, and accessibility tests from the M09 testing strategy.
24. Test multiple meaningfully distinct sample designs against the same identity.
25. Verify generic-purpose examples and the first store-focused journey without store-specific domain assumptions.
26. Record test evidence, known limitations, and deferred work.
27. Update project planning documents only when implementation planning is separately authorized.

## Dependencies and sequencing

- Phase 1 contracts precede workflow and renderer integration.
- Sample compatibility mapping must be explicit before applying identity to catalogue samples.
- Draft preview precedes confirmation/application.
- Atomic application and preservation tests precede declaring integration complete.
- Accessibility and consistency checks are part of the feature, not post-release optional polish.

## Out of scope for these tasks

No implementation is performed by this document. No persistence, backend, database, stock-image library, image generation, arbitrary design editor, multiple saved identities, deployment, or standalone extraction is included.
