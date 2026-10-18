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
