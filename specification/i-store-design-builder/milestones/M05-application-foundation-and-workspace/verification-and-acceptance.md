# Verification and Acceptance Criteria

## Purpose

Define how the M05 foundation implementation will be verified. This document specifies future implementation verification; it does not claim tests have already run.

## Automated checks

The M05 implementation should pass the repository's applicable:
- Unit tests.
- Component tests.
- Lint.
- Typecheck.
- Production build.
- Isolated builder workspace end-to-end tests.
- Automated accessibility checks where supported.

Tests must use synthetic projects, catalogue samples and content. They must not depend on real user or artist/store data.

## Functional verification

Verify:
1. The direct builder route opens the isolated builder experience.
2. The GaGet entry point leads to the same experience.
3. Project creation requires only project name and website purpose.
4. A valid project initializes with one default page and three empty responsive layout structures.
5. Invalid creation input produces accessible, recoverable validation feedback.
6. The workspace renders its contextual panel structure.
7. Desktop, tablet and mobile canvases are visible simultaneously.
8. Narrow workspace dimensions preserve all canvases through scrolling or zoom rather than switching to a single-device tab.
9. The synthetic catalogue loads and supports category browsing and sample selection.
10. Sample preview opens independently and uses its registered renderer.
11. Previewing does not mutate project composition.
12. Unknown renderer/sample cases produce a controlled unavailable/error state.
13. Light and dark themes work throughout the M05 workspace.
14. Keyboard navigation and focus behavior work for the primary flows.
15. Refresh/close is not represented as recoverable persistence.

## Responsive verification

At minimum, verify representative desktop and narrow viewport sizes. Confirm:
- Workspace panels remain usable.
- The three-canvas model is retained.
- Horizontal scrolling/zoom is discoverable and operable.
- Catalogue and preview remain usable without clipping critical controls.
- No unrelated GaGet page layout is changed.

## Isolation regression checks

Verify:
- No global CSS or theme changes leak into existing GaGet routes.
- Existing GaGet navigation and unrelated routes continue to behave as before.
- Builder domain and catalogue modules do not depend on GaGet business-specific data.
- Tests can target the builder module independently.

## Accessibility verification

Combine automated checks with manual keyboard review:
- Tab order and focus visibility.
- Preview open/close and focus restoration.
- Dialog semantics if modal preview is used.
- Accessible names for controls and canvases.
- Contrast in both themes.
- Reduced-motion behavior.

## Acceptance criteria

M05 is accepted as implemented only when:
- All included foundation capabilities work.
- The catalogue and preview are functional without composition mutation.
- Domain types and invariants are enforced.
- The renderer registry supports the included synthetic samples.
- The builder is isolated from unrelated GaGet behavior.
- Required automated checks pass.
- Responsive and accessibility checks are recorded with evidence.

## Explicit exclusions

M05 verification does not require or imply:
- Component insertion or full composition.
- Full responsive editing.
- Complete portfolio coverage.
- Full 11-level mission implementation.
- Persistence, autosave, history, undo/redo, recovery or import/export.
- Authentication, backend, database, collaboration or AI.
- Standalone codebase extraction.

## Status discipline

A passing specification review is not an implementation test result. Record implementation verification separately when the M05 code is built. Do not mark implementation acceptance complete based solely on this approved document set.
