# Unified Photo & Audio Editor Entry States — Proposal

**Status:** Proposal only; no product implementation changes
**Base branch:** `stage`
**Proposal branch:** `proposal/unified-editor-file-states`
**Date:** 2026-10-18
**Scope:** Playground header and empty/loaded file states for Photo Editor and Audio Editor

## 1. Summary and decision requested

Standardize the first screen and file-loading transition for both editors. Before a file is selected, show a breadcrumb, prominent tool title, concise description, and a consistent centered upload composition. After a valid file is selected, remove the introductory content and transition to the normal editing workspace.

Retain the image editor's centered, square drop target as the visual basis for the upload area. Use the audio editor's clearer blue primary action treatment for the Choose file button. Reuse the same layout, spacing, border, typography, button hierarchy, drag/drop states, errors, and responsive rules; keep file-specific copy and the loaded document surfaces appropriate to each medium.

This proposal does not implement the UI, alter processing, remove features, or change public routes.

## 2. Stage-branch audit

Reviewed `specification/design.md`, `specification/audio-editor/design.md`, `components/photo-editor.tsx`, and `components/audio-workbench.tsx` on `stage`.

- The Photo Editor is canvas-first and has an existing editor shell and feature controls. The empty-state layout should follow its centered canvas/drop-zone composition.
- The Audio Editor uses `components/audio-workbench.tsx`, with an audio file input, dashed upload area, and a loaded waveform/player plus metadata.
- The shared specification defines XS (<640px), SM (640–767px), MD (768–1023px), LG (1024–1279px), XL (1280–1535px), and 2XL (1536px+).
- Keep this as a design proposal branch, separate from feature/bug-fix branches. Preserve current capabilities and behavior.

## 3. Shared empty-state composition

Order within the Playground content region:

1. **Breadcrumb**, top-left: Home icon + “Home” + chevron + current tool name (e.g. “Photo Editor” or “Audio Editor”). Home links to the homepage. Use an accessible text label even if the home icon is visible.
2. **Tool title**, immediately below: prominent bold heading, 28–32px desktop and 24–28px mobile.
3. **Description**, one or two readable lines under the title. Example Photo Editor: “Edit, crop, resize, and enhance images in your browser.” Audio Editor: “Trim, adjust, analyze, and convert audio in your browser.”
4. **Upload workspace**, centered in the remaining available content area. It uses a square-ish target (prefer 1:1; cap width and height) rather than a screen-wide banner. Keep a dashed neutral border, upload illustration/icon, short prompt, file format/size hint, privacy hint, and one primary action.
5. **Primary action**: use the Audio Editor's blue primary-button treatment for “Choose photo” / “Choose audio”. The drop target remains clickable, and the button is visually dominant. Avoid nesting interactive buttons inside a clickable label/drop target.
6. **Secondary actions**: audio may show “Record audio” only if that workflow is supported and permission is requested only after an explicit click. Do not add unrelated secondary actions to photo upload.
7. **Status and errors**: show unsupported type, size limit, decode errors and success feedback inline near the drop target.

The target is centered horizontally in the content region and vertically within the available playground space after the header content. It must not be stretched to the full viewport width on desktop/tablet. Suggested maximum target width: 480px; desktop content itself remains max-width constrained.

## 4. Upload target visual specification

- Target: square or near-square on desktop (max 480 × 400px; preserve practical 1:1 feel), fluid on mobile with a 16px minimum viewport gutter.
- Border: dashed, 1px, neutral border token; use a subtle muted background. On drag-over, apply a clear primary-color border/ring and light primary tint.
- Content: centered upload icon, concise “Drag and drop a photo/audio file here” copy, short “or” separator, blue primary button, supported formats and size limit.
- Button: use the existing shared primary button styles and the Audio Editor's blue emphasis. Do not hard-code a new color outside design tokens.
- Pointer and keyboard: drop zone can receive keyboard focus; Enter/Space activates file selection. Button and drop target do not create duplicate focus stops unless each has a distinct useful action.
- Hidden file input must be associated with an accessible label/button and accept the relevant formats.
- Local-processing/privacy text must be truthful and consistent with actual behavior.

## 5. Loaded-file transition

Once the file has passed validation and is ready to render:
- Hide breadcrumb, tool title, and introductory description from the active editing workspace (do not merely fade them while reserving their layout height).
- Keep the compact editor command bar and shared site navigation as defined by the existing editor specification.
- Show the selected document immediately, preserving existing feature-menu behavior.
- Photo: show image canvas/preview, filename and relevant dimensions, with existing canvas and contextual inspector.
- Audio: show filename, duration, sample rate/channel metadata, waveform and playback controls.
- Put replace/open and reset actions in the existing File menu where available; do not introduce a competing second toolbar.
- Keep the loaded file and current selection when switching features.
- If validation or decoding fails, remain in the empty state, retain the explanatory header and upload target, and show an inline actionable error.
- For a replacement file, keep the current document visible until the replacement has passed validation; avoid blanking the workspace during decode.

## 6. Four primary states and wireframes

The proposal includes four SVG wireframes:
- `wireframes/photo-empty.svg`
- `wireframes/photo-loaded.svg`
- `wireframes/audio-empty.svg`
- `wireframes/audio-loaded.svg`

They show the common structure and the medium-specific workspace. They are schematic design references, not pixel-perfect screenshots.

## 7. Responsive behavior

Reuse the established breakpoints from `specification/design.md`; do not introduce a second breakpoint system.

| Breakpoint | Header and breadcrumb | Empty upload area | Loaded workspace |
|---|---|---|---|
| XS <640px | Breadcrumb wraps only if needed; title 24–28px; compact vertical spacing | Fluid width with 16px gutters; near-square target, but allow a shorter target when keyboard/viewport height is limited; button full-width if useful | Single-column canvas/waveform; contextual feature controls use existing bottom-sheet pattern; no horizontal page overflow |
| SM 640–767px | Same mobile pattern; title 26–28px | Centered target, capped at 440px; never viewport-wide | Mobile shell and bottom-sheet inspector remain |
| MD 768–1023px | Breadcrumb/title aligned to content start | Centered, bounded target (max 480px); no full-width upload banner | Tablet behavior stays as defined in existing editor spec; do not force a cramped split |
| LG 1024–1279px | Breadcrumb/title at top-left of constrained playground content | Centered target; 400–480px maximum | Desktop shell; inspector may overlay/collapse if canvas becomes too narrow |
| XL 1280–1535px | Same content alignment and type scale | Centered target within max-width workspace | Canvas/waveform plus fixed-width contextual inspector |
| 2XL ≥1536px | Content centered in a max-width region | Target does not grow with viewport | Keep workspace and inspector bounded; no screen-wide stretching |

The shared site/editor navigation behavior and sticky command bar are not redesigned by this proposal. Honor safe areas, dynamic viewport height, reduced motion, RTL direction, 200% zoom and keyboard navigation.

## 8. Accessibility and interaction requirements

- Use a semantic breadcrumb navigation landmark and ordered heading hierarchy.
- Give each file input an accessible name and specific accepted-file guidance.
- Support drag/drop and standard file picker; never make drag/drop the only path.
- Provide visible focus states, sufficient contrast, and touch targets around 44px.
- Announce loading/error/status changes with appropriate live regions without repeatedly announcing progress.
- Do not auto-open microphone permissions; request permission only when Record is activated.
- Keep errors actionable and avoid browser alert dialogs.
- On successful file load, move focus only when needed; do not unexpectedly steal keyboard focus.
- Respect RTL and ensure the Home icon, separators, button and breadcrumb order follow direction.

## 9. Acceptance criteria

1. Both empty editors use the same breadcrumb/title/description hierarchy and alignment.
2. The primary upload control uses the same blue shared button treatment in both editors.
3. Both use a centered bounded square-ish drop target, not a full-width desktop banner.
4. Selecting a valid file removes the introductory header and its reserved vertical space.
5. Photo loaded state presents the canvas and image details; audio loaded state presents waveform, player and audio metadata.
6. Invalid/unsupported files leave the user in the empty state with an inline error and a way to retry.
7. The upload area remains usable at 320×720, 360×800, 390×844, 640×800, 768×1024, 844×390, 1024×768, 1280×800, 1440×900, 1536×960 and 1920×1080.
8. No horizontal page overflow at any supported viewport.
9. Existing tools, feature menus, file limits, routes, privacy behavior and exports are unchanged.
10. Unit/component and Playwright tests cover empty state, drag-over, file picker, valid load, invalid file, header disappearance and responsive bounds for both editors.

## 10. Implementation sequence after approval

1. Approve the visual hierarchy and four state wireframes.
2. Add shared, small UI primitives only where they reduce duplication; do not merge image/audio processing logic.
3. Update each editor's empty state to consume the shared layout tokens and button styles.
4. Add/adjust tests for the four states and breakpoints.
5. Run unit, component, lint, typecheck, build, smoke and E2E checks. Record actual results; do not infer success from a configured workflow.
6. Review preview deployment and propose the implementation separately to `stage`.

## 11. Out of scope

- Rewriting the Photo Editor or Audio Editor.
- Changing file formats, file-size limits, codec support, exports or privacy guarantees.
- Redesigning the global site navigation or feature menus.
- Adding features, removing legacy routes, or changing processing architecture.
