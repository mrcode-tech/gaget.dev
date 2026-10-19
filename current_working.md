# Current Working Branch: `feat/unified-editor-file-states`

**Last updated:** 2026-10-18  
**Repository:** `mrcode-tech/gaget.dev`  
**Base:** `stage`  
**Purpose:** Implement the unified empty-file entry state for Photo Editor and Audio Editor based on `proposal/unified-editor-file-states`.

## Scope and constraints
- Only change the no-file-selected state for the unified photo and audio editors.
- Preserve the existing loaded-file editing workspace and feature controls.
- Reuse existing file inputs, local processing, validation and editor behavior.
- Keep the intro and upload target bounded on desktop/tablet and fluid on mobile.
- Do not merge without explicit approval.

## Implementation log
- [x] Reviewed the design specification and empty-state wireframes in `proposal/unified-editor-file-states`.
- [x] Created this feature branch from `stage`.
- [x] Added a breadcrumb, title and description to the empty Photo Editor state.
- [x] Updated the Photo Editor drop target to a centered, bounded square-ish upload area with a primary action.
- [x] Added the equivalent empty-state hierarchy and bounded drag/drop target to Audio Editor; loaded audio continues to use its existing workspace.
- [x] Updated the existing Photo Editor component assertion to match the new empty-state copy and added intro/title assertions.
- [x] Updated Audio Editor Playwright checks to expect the breadcrumb, intro, and heading in the no-file-selected state.
- [x] Fixed the ESLint errors by using `next/link` for the new Home breadcrumbs in both editors.
- [x] Fixed the stale Audio Editor E2E assertions that expected no breadcrumb on the empty state.
- [ ] Re-run lint, typecheck, production build, smoke and E2E tests; record actual results.
- [ ] Review latest CI before proposing merge to `stage`.

## Verification
The original Photo Editor test contained stale expectations (old upload prompt and button label) that contradicted the requested UX; these assertions are updated. Unit tests and focused Photo Editor/sidebar regression tests passed in CI. The first CI run then failed at ESLint because the new breadcrumbs used raw `<a>` elements; both were changed to `next/link`. The next CI run exposed two stale Audio Editor Playwright assertions that expected no breadcrumb on the empty state. Updated both to assert the intended empty-state breadcrumb, intro, and heading. A fresh full CI run is required before considering this fixed.


## Empty-state description alignment refinement (2026-10-18)
- [x] Audio Editor: removed the nested centered/max-width wrapper from the empty-state content so the breadcrumb, title, and description align with the File menu/workspace gutter at desktop and tablet widths.
- [x] Audio Editor: added a deliberate 2rem minimum gap between the description and upload dropzone while preserving a bounded, centered upload target.
- [x] Photo Editor: moved the supporting description below the editor toolbar's bottom divider, directly after the “Drop a photo here or open one” toolbar row.
- [x] Photo Editor: aligned the description's text edge to the editor toolbar gutter and reserved 2rem below the text before the canvas/upload workspace.
- [x] Kept both descriptions exclusive to the no-file-selected state; the existing loaded-file editor remains unchanged.
- [x] Added Playwright coverage for description alignment, ordering, spacing, and horizontal overflow at 320, 360, 390, 640, 744, 768, 844, 1024, 1280, 1440, 1536, and 1920 CSS-pixel viewport widths; added assertions that descriptions disappear after loading a file.
- [ ] Run and review CI for the latest branch commit; fix any failures before considering the refinement complete.

### UX rationale
Use consistent left alignment with the editor toolbar/workspace gutter, a clear but not oversized separation between explanatory text and the primary upload action, responsive wrapping, and a real “Choose” button alongside drag-and-drop. This follows W3C/WAI guidance to use whitespace and proximity to group related content, keep layouts reflowable without horizontal scrolling, and provide non-drag alternatives for file uploads.


### Short-landscape correction
- The first responsive CI run found that the photo upload target could vertically center outside its scroll area when the viewport was short (844×390), overlapping the newly repositioned description.
- [x] For viewports at or below 500px tall, align the empty canvas content to the start of its scroll area instead of vertically centering an item taller than the available height. The description-to-upload spacing remains clear, and normal-height layouts remain centered.
- [x] Re-ran the complete CI suite; the 844×390 landscape case and all responsive/accessibility checks pass.


### Final verification
- [x] GitHub Actions run 639 passed: unit tests, focused Photo Editor/sidebar regressions, component tests, ESLint, TypeScript, production build, smoke tests, responsive browser tests, and accessibility checks.
- [x] Responsive empty-state geometry tests passed at all 12 configured viewport sizes, including short landscape (844×390).

## Photo Editor empty state parity (2026-10-18)

- [x] Align the empty-state breadcrumb and Photo Editor heading to the same horizontal gutter as the supporting description, at mobile, tablet, and desktop widths.
- [x] Hide the entire photo work toolbar (filename/status, undo/redo, zoom, fit-canvas) while no photo is loaded; keep it visible after a photo is selected.
- [x] Keep the “Drop a photo here or open one” prompt out of the empty state; the primary upload/drop target remains available.
- [x] Update component and responsive Playwright tests to assert the hidden toolbar and consistent alignment across all 12 viewport sizes.
- [ ] Run and verify the resulting CI checks before considering this change complete.


## Photo Editor upload target horizontal centering (2026-10-19)
- [x] On a fresh branch from `stage`, add horizontal auto margins to the empty Photo Editor drop target so its bounded 480px-wide layout is centered within the canvas workspace at all breakpoints.
- [x] Add responsive Playwright geometry coverage that compares the drop target center to the canvas workspace center across the existing empty-state viewport matrix.
- [ ] Run CI and review results before proposing merge to `stage`.
