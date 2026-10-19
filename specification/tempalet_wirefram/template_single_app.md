# Single-App Editor Design Template — Photo Editor Baseline

**Status:** documentation of the existing Photo Editor design on `stage`; this is not a redesign proposal.  
**Repository:** `mrcode-tech/gaget.dev`  
**Template root:** `specification/tempalet_wirefram/`  
**Baseline reviewed:** `stage` at merge commit `78ff386f6d6680101a0b55c3575b47f1fbb1f688` (2026-10-19).  
**Purpose:** give an implementation agent one self-contained reference for refactoring another tool into the same single-page editor shell without changing the established visual design.

> Treat live components and the most recent merged code as authoritative when a detail in an older proposal differs. Wireframes are schematic, not pixel-perfect screenshots. Do not silently reinterpret any unspecified token as a new design decision.

## 1. Non-negotiable scope

- Reuse the current Photo Editor structure, visual hierarchy, spacing rhythm, responsive behavior, and interaction model.
- Do not redesign the shell, menu appearance, feature panel, command bar, empty state, or loaded workspace while adapting another tool.
- A target editor may replace the feature names, icons, description copy, input controls, canvas content, and supported formats. Keep the common frame and interaction contract.
- Preserve the loaded-file editor. Empty-file state changes must not alter loaded-file geometry or tool behavior.
- All file processing and editing behavior remains owned by the target tool; this document specifies the presentation shell, not a mandate to change implementation internals.
- Use existing design tokens, shared components, icon package, and utility classes from the repository. Do not introduce a second styling system.

## 2. Source-of-truth and change history

Reviewed current branch `stage` and the existing `specification/design.md`, `current_working.md`, and the latest implementation history. Important changes that explain the present design:

| Commit / PR | Design outcome to preserve |
|---|---|
| [d32aa735 / PR #23](https://github.com/mrcode-tech/gaget.dev/commit/d32aa735e80f80c056fa110eadf2253e5727ed72) | Compact Photo Editor navigation on mobile and tablet. |
| [a022b5ac / PR #23 merge](https://github.com/mrcode-tech/gaget.dev/commit/a022b5ac306663c2d864ebdcc353333ab1533ae2) | Compact navigation change landed in stage. |
| [58f00d67](https://github.com/mrcode-tech/gaget.dev/commit/58f00d676cd21ce6dab62fed8ae48ceb64032a9e) | Resizable mobile feature panel; preserve the sheet handle/drag-resize interaction. |
| [84a00ee5 / PR #29](https://github.com/mrcode-tech/gaget.dev/commit/84a00ee5035a7d40293f4cc12c4b65802a8adea8) | Resize controls keep accessibility bounds valid. |
| [931c2fce / PR #30](https://github.com/mrcode-tech/gaget.dev/commit/931c2fce1858da9d3c6bd5423be1664eec338fa1) | Navigation/accessibility fixes integrated. |
| [da98c53d](https://github.com/mrcode-tech/gaget.dev/commit/da98c53d8e52437e4df1d78387fb69d9482d9d83) | Audio editor refactor aligned navigation and feature panel to Photo Editor. |
| [24950883](https://github.com/mrcode-tech/gaget.dev/commit/249508835d7068b3943c880f31bd857e9f162ff3) | Follow-up audio navigation parity. |
| [0a674776](https://github.com/mrcode-tech/gaget.dev/commit/0a67477605674aa433e43006d02ae7815d7bcbff) | Empty Photo Editor intro moved inside the full vertically scrollable workspace; preserve breadcrumb/title/description/upload scrolling as one region. |
| [8f97e7ab](https://github.com/mrcode-tech/gaget.dev/commit/8f97e7ab9110a1848d35a8a18269964ac042fe6b) | Maintains deliberate gap above the empty upload target. |
| [1922297e / PR #66](https://github.com/mrcode-tech/gaget.dev/commit/1922297e470a8666a2f0a0a997899780c706dc60) | Full empty-workspace vertical scrolling fix merged. |
| [78ff386f / PR #67](https://github.com/mrcode-tech/gaget.dev/commit/78ff386f6d6680101a0b55c3575b47f1fbb1f688) | Latest stage baseline at time of review. |

History is a design rationale index, not a claim that every listed commit changed only CSS. Before refactoring, inspect current component implementations and tests at the target branch; do not copy an older snapshot over newer behavior.

## 3. Breakpoint contract

Use the repository Tailwind breakpoints. Breakpoints are CSS widths, not device labels.

| Name | Width | Shared navigation | Editor shell |
|---|---:|---|---|
| XS | <640px | Header with hamburger; shared navigation drawer | Compact File + Features command bar; one-column workspace; feature panel is a resizable bottom sheet |
| SM | 640–767px | Same drawer behavior | Same compact command bar and bottom sheet; preserve comfortable gutters |
| MD | 768–1023px | Tablet still uses hamburger + overlay drawer | Keep compact editor navigation; do not force a cramped desktop inspector |
| LG | 1024–1279px | Persistent desktop sidebar, collapsible | Desktop command groups; active feature inspector where width allows |
| XL | 1280–1535px | Persistent desktop sidebar | Full desktop composition |
| 2XL | ≥1536px | Persistent desktop sidebar | Same layout, bounded content/inspector; do not stretch controls across the display |

Test both width and height. For short landscape viewports (especially height ≤500px), start-align content that cannot fit vertically; keep menus and panels internally scrollable and use dynamic viewport units for sheet caps.

## 4. Shared site navigation

### Desktop (LG and wider)

- Sidebar is fixed to the leading edge; page content is offset by its current width.
- Expanded sidebar: 248px. Collapsed sidebar: 64px.
- Expanded sidebar shows brand mark/wordmark, collapse control, icon + text destinations, category heading, and bottom footer.
- Collapsed sidebar shows icons with accessible labels/tooltips; never rely on icons alone for accessible names.
- Main navigation inventory: Home, Popular, All tools, Favorites, Categories, followed by Images, Audio, Date & Time, Generators, JSON, Encoding, Text, Security, Web & API, Data Formats, SQL.
- Preserve active/hover/focus states, borders, spacing, footer placement, and RTL-aware leading/trailing behavior.

### Mobile and tablet (below 1024px)

- Hamburger remains in the shared header and opens the shared navigation drawer.
- Drawer overlays the current page with a dimmed backdrop; it must not push or resize page content.
- Drawer closes from the close button, backdrop, Escape, or selecting a destination; restore focus to its trigger.
- Drawer content scrolls independently on short screens.
- Keep Language and Appearance as separate, captioned rows. Do not merge them into one row.
- Do not create an editor-specific duplicate of the global drawer.

## 5. Editor command/navigation bar

The editor command bar is the stable top edge of the working application, distinct from the global site navigation. Preserve its existing dimensions, border, padding, icon sizing, spacing, responsive wrapping, and z-index from the live implementation rather than inventing new values.

### Compact view (XS / SM / MD)

- File menu is at the leading side; Features menu is at the trailing side.
- Keep the bar short and compact; do not expose all desktop menu groups as a long row.
- File and Features triggers are icon + label or the exact current compact trigger treatment from the component. Preserve current wording and iconography.
- The dropdown is anchored to its own trigger. The Features dropdown stays compact (maximum width 256px, constrained to viewport width minus side margins), aligned to the Features trigger, capped by viewport height, and vertically scrollable inside.
- The menu is layered above the canvas but below the fixed command bar; it must not cover the global brand/hamburger or escape the viewport.
- Selecting a feature closes the dropdown and opens only the selected feature panel.

### Desktop (LG / XL / 2XL)

- Use File, Edit, Image, Create groups, retaining the same feature names and groupings as the compact Features menu.
- Menus are trigger-anchored, use consistent menu item rows, icon + label, selected/hover/focus treatment, and internal scrolling where required.
- File actions include opening a photo and exporting the image. Actions requiring a loaded image are disabled or unavailable until a compatible file is loaded; communicate disabled state accessibly.
- Keep the global navigation/sidebar and editor command bar separate. The editor bar must never sit underneath the shared site header or sidebar.

## 6. File menu and feature menu item anatomy

Each menu item follows the existing visual pattern:
1. Consistent icon box using the same icon family/stroke and size as sibling entries.
2. Feature name as the primary label.
3. Optional short description as secondary, muted text where the current menu variant uses descriptions.
4. Entire row is a clear hit target; align icons and text to a common start edge.
5. Keep item row padding, line height, row gaps, corner radius, menu padding, divider placement, focus ring, hover background, disabled opacity, and active state consistent with the live Photo Editor.
6. Long labels wrap or truncate according to the current implementation; they must not create horizontal overflow.
7. Icons are decorative when adjacent text provides the name; icon-only buttons require accessible names and tooltips.
8. Keyboard navigation, Escape dismissal, focus restoration, and visible focus styling are mandatory.

### Current feature inventory and grouping

| Desktop group | Feature | Icon/description guidance |
|---|---|---|
| Edit | Crop | Crop icon; select and apply a crop region |
| Edit | Resize | Resize/dimensions icon; change output dimensions |
| Edit | Text & watermark | Text icon; add and style text overlays |
| Image | Color & filters | Sliders/sun icon; tune color and image effects |
| Image | Color picker | Pipette icon; sample a color from the image |
| Image | Image details | Info/image icon; inspect dimensions and metadata |
| Image | Export & convert | Download/format icon; export in a supported format |
| Image | Print size | Ruler icon; set print dimensions/DPI |
| Image | Image to Base64 | Code/braces icon; encode image data |
| Image | Base64 to image | Image/code icon; decode image data |
| Create | Favicon | App/window icon; create favicon assets |
| Create | Collage | Grid icon; combine multiple images |
| Create | SVG optimize | File-code icon; compact SVG source |

This table describes semantic icon intent only. Use the actual current icon imports in the app; do not replace them with emoji or introduce a new icon set.

## 7. Empty-file-selected state (important)

The empty state is not a separate landing page inside the editor. It lives inside the same main working-space/canvas scroll region as the upload target.

Vertical order:
1. Editor command bar remains above the workspace.
2. Breadcrumb: Home › Photo Editor (target tool replaces the final label).
3. Title, using the current heading scale and weight.
4. Short supporting description, muted, with comfortable line height and a bounded text measure.
5. A deliberate gap after the description.
6. Centered, bounded drag-and-drop upload target with dashed border, rounded corners, icon tile, clear prompt, secondary “or”, and an explicit Choose/open-file button.
7. Supported formats / file limits / local processing/privacy copy in the existing position and typography.

Current Photo Editor implementation evidence:
- Breadcrumb, title, description, and upload target are children of the same vertically scrollable workspace.
- The workspace uses a single vertical scroll path for the complete empty state; do not make only the upload card scrollable.
- Horizontal overflow is clipped; the upload target is centered in the workspace.
- Upload target is bounded at 480px wide, square-ish, minimum height 280px and maximum height 400px; use these as the current Photo Editor measurements, not as permission to alter them.
- The target has a dashed border, rounded-2xl treatment, neutral background, centered content, and visible keyboard focus ring.
- The empty-state intro has a consistent horizontal gutter with the command bar/workspace. At mobile, use the existing small gutter; at SM and wider, use the existing larger gutter.
- Preserve the deliberate spacing between supporting text and upload card (current card includes a top margin equivalent to 2rem).
- On low-height viewports, content starts at the top of the scroll area rather than vertically centering a target that is taller than the available space.
- Hide loaded-file toolbar/status/history controls while no file is loaded. Do not show stale filename, dimensions, undo/redo, zoom, or fit controls in the empty state.
- On file selection, the empty intro disappears and the current loaded-file workspace takes over. Do not add the intro above a loaded canvas.

## 8. Loaded workspace and editor utility navigation

When a file is loaded, preserve the existing workspace rather than layering the empty-state intro on top of it.

### File/status toolbar

- Show filename and image dimensions; filename must truncate safely instead of pushing utility controls off-screen.
- Status text may be hidden at narrower widths as in the current implementation.
- Use compact icon buttons and dividers; allow wrapping only as the existing component does.
- Show disabled states accurately when there is no undo/redo history or an action is unavailable.

### Common actions

The shared editing toolbar/navigation contract includes the available actions in the current tool: Undo, Redo, reset where implemented, zoom out, fit/reset zoom, zoom in, and export. Keep the order, separators, labels/tooltips, icon choices, and responsive visibility consistent with the Photo Editor baseline. Do not invent a new bottom bar or duplicate actions if the target tool has an equivalent existing toolbar.

- **Undo / Redo:** history-aware, visibly disabled when unavailable, keyboard accessible, labels/tooltips.
- **Zoom out / Zoom in:** change canvas scale; when zoom exceeds fit, keep both axes reachable through the canvas/workspace scroll container.
- **Fit:** restore the canvas to the workspace fit size without clipping or an unexpected maximum-size clamp.
- **Reset:** restore the appropriate initial edit state, with confirmation only if the current implementation requires it.
- **Export:** explicit, accessible action; show feedback near the workflow, not via blocking browser alerts.
- **History navigation is part of the app chrome** and must be considered in every breakpoint wireframe, even where it is integrated into a compact toolbar or menu.

## 9. Desktop feature inspector

- Active feature opens one contextual inspector; never show multiple feature panels simultaneously.
- Inspector is on the trailing/right side in LTR, bounded to the existing implementation width (design reference approximately 300–360px; verify live code before changing).
- Canvas remains the primary region and uses the remaining width.
- Inspector has a title/feature identity, close affordance where currently implemented, feature-specific controls, consistent labels, fields, slider styling, grouping, and internal vertical scrolling when needed.
- At the 1024px threshold, preserve a usable canvas. If the existing component uses a narrower/overlay treatment at a constrained width, keep that behavior; do not force three cramped columns.
- On 2XL, inspector width stays bounded; do not scale it with the viewport.
- Closing the panel returns to the workspace without losing edits unless the feature explicitly cancels a draft.

## 10. Mobile resizable feature panel / bottom sheet

**This is a core interaction and must not be simplified away.** See `wireframe-mobile-sheet.svg`.

- Feature selection opens a contextual sheet over the editor workspace; the canvas remains visible behind/above it where viewport height allows.
- The sheet has a visible drag handle at its top edge and a clear feature title/identity. Keep the same sheet surface, border/radius, shadow, spacing, and close control as the current component.
- User can drag the handle vertically to resize the panel between its collapsed/peek and expanded states. The resize affordance must be visually discoverable and have an adequate touch target.
- Preserve existing snap points/state transitions and the current resize slider/handle behavior in the source. Do not replace the interaction with a static-height modal or a page-level scroll.
- Collapsed sheet should expose a small amount of feature context while leaving the working area visible; expanded sheet shows the controls and an internally scrollable control region.
- Sheet height is constrained by viewport height; the expanded panel is approximately capped around 70dvh, and short landscape must remain operable.
- The panel's control content scrolls vertically inside the panel; the page/workspace must not acquire a second competing scroll path.
- Dragging/resizing must not accidentally trigger controls or select text. Respect pointer/touch cancellation and reduced-motion preferences where applicable.
- Provide keyboard-accessible close and resize affordances when supported by the existing component; retain accessible names and focus visibility.
- Do not introduce horizontal scrolling in the sheet. Labels and inputs wrap/stack as in the current mobile controls.
- When switching features, keep exactly one active panel and close the feature dropdown.

## 11. Feature input area

### Shared visual rules

- Use existing field components, tokens, typography, and spacing utilities.
- Labels sit close to their inputs and are consistently aligned. Related fields form compact groups with consistent vertical rhythm.
- Numeric dimensions use number fields and clear units; sliders show the current value where the existing feature supports it.
- Primary actions are visually distinct; secondary/reset actions follow the established button treatment.
- Keep the active feature heading visible when controls scroll.
- Error, validation, success, and disabled states are inline and accessible.
- Avoid a fixed control panel height that clips fields. Use a bounded panel with internal vertical scrolling.

### Mobile

- Controls are stacked vertically in the resizable sheet; no narrow desktop two-column form.
- Keep the drag handle/title separate from the scrollable controls area so content scrolling does not make the handle disappear.
- Inputs must fit the panel width; no horizontal page scrolling.
- When the panel is expanded, all fields and action buttons remain reachable by scrolling within the panel.

### Desktop

- Controls live in the inspector with bounded width. Use the existing control column and spacing; do not widen fields merely because the monitor is wider.
- Related width/height inputs may share a row only where the existing Photo Editor does so.
- Keep controls in logical order and maintain consistent labels, help text, and action placement.

## 12. Spacing, surfaces, and visual tokens

The repository's current Tailwind/theme tokens are authoritative. Do not invent exact colors or new design tokens in a refactor. Use the same tokens for background, foreground, muted foreground, muted surface, border, primary, ring, and destructive/error states.

Known concrete spacing/layout details from current code/spec:
- Global desktop sidebar widths: 248px expanded / 64px collapsed.
- Feature menu compact max width: 256px, with viewport margin constraint and internal vertical scroll.
- Empty upload target: max-width 480px; min-height 280px; max-height 400px; aspect-square.
- Empty target outer top gap: 2rem equivalent.
- Empty state gutters: 12px on XS, 24px at SM and above (current Tailwind `px-3 sm:px-6`).
- Empty state heading: 24px base, 30px from SM (current `text-2xl sm:text-3xl`).
- Description: 14px base, 16px from SM; line-height 24px, muted; max text width around 42rem.
- Breadcrumb-to-heading gap follows the current `mb-5` breadcrumb spacing.
- Inspector design reference: approximately 300–360px, but actual component code is authoritative.
- Mobile sheet expanded-height design reference: about 70dvh; preserve the actual snap/drag logic and current bounds from source.
- Use existing 4px-based Tailwind spacing rhythm and utility classes; where a value is not stated, inspect the current component rather than guessing.

## 13. Scroll ownership and overflow rules

- **Empty state:** one vertical scroll container includes breadcrumb + title + description + upload target. This is a regression-critical behavior.
- **Loaded canvas:** the canvas/workspace scrolls in both axes when zoom exceeds fit; normal fit is centered as in the current implementation.
- **Feature sheet/inspector:** controls scroll inside their panel when content exceeds available height.
- **Dropdown:** menu items scroll inside the dropdown; dropdown must not cause document horizontal overflow.
- **Global mobile drawer:** drawer content scrolls inside the overlay.
- Never add nested scrolling to only the upload card or a decorative margin wrapper.
- Keep `min-w-0`/equivalent constraints on flex children where needed; clip horizontal overflow on the empty workspace while preserving zoomed-canvas two-axis scrolling in the loaded state.
- At height ≤500px, do not vertically center a tall empty upload card if it cannot fit; align content to the top so all content is reachable.

## 14. Responsive acceptance and regression checklist

Run tests at widths 320, 360, 390, 640, 744, 768, 844, 1024, 1280, 1440, 1536, and 1920 CSS px. Include 844×390 short landscape and other representative heights.

### Shell / navigation
- [ ] At widths <1024, hamburger is visible and opens the shared overlay drawer.
- [ ] At widths ≥1024, sidebar is persistent and content offset matches expanded/collapsed widths.
- [ ] File is leading and Features trailing on compact editor bar.
- [ ] Desktop groups remain File / Edit / Image / Create.
- [ ] Menu anchors to its trigger, stays in viewport, scrolls internally, and closes after selection.
- [ ] Menu item icons, labels, descriptions, row spacing, focus/hover/disabled states match baseline.
- [ ] Undo, Redo, Zoom out, Fit, Zoom in, and Export are discoverable in each breakpoint's actual toolbar/menu presentation.

### Empty / loaded state
- [ ] Empty breadcrumb, title, description, and upload card share one vertically scrollable workspace.
- [ ] Upload target is centered, bounded, and has a working Choose/open action as well as drag-and-drop.
- [ ] No horizontal overflow at any viewport.
- [ ] Short landscape can scroll the complete empty state without overlap.
- [ ] Loaded file removes empty-state intro and restores existing loaded-file toolbar/canvas.
- [ ] Loaded canvas supports two-axis scroll when zoomed beyond fit.

### Feature panel
- [ ] Mobile sheet can be resized with its visible handle/slider and stays within viewport bounds.
- [ ] Sheet content scrolls independently; drag gesture does not break input interaction.
- [ ] One feature panel is active at a time.
- [ ] Desktop inspector does not overwhelm the canvas.
- [ ] Inputs wrap/stack on mobile; no horizontal overflow.
- [ ] Close, Escape (where applicable), keyboard focus, and accessible labels are correct.

### Quality
- [ ] Run lint, typecheck, production build, relevant unit/component tests, Playwright responsive tests, and accessibility checks.
- [ ] Record actual CI run, commit SHA, and failures. Never mark tests passed without an observed result.
- [ ] Compare screenshots with the existing Photo Editor at the same viewport; do not accept a visually plausible but structurally different shell.

## 15. How to use this template in one implementation prompt

For another editor, instruct the coding agent to:

1. Read this file and every wireframe in this folder before editing.
2. Inspect the current Photo Editor components and tests on the target branch; treat current source as the pixel/interaction authority.
3. Identify reusable shared shell pieces: global navigation, command bar, File/Features menus, empty state, loaded toolbar, canvas/workspace, mobile resizable sheet, desktop inspector, history/zoom/export actions.
4. Map the target tool's features into menu groups and icon + name + optional description rows. Do not invent features or change names without product direction.
5. Replace only tool-specific copy, file handling, canvas/preview, feature inventory, and input controls. Preserve all common geometry, breakpoints, spacing, menu treatment, scroll ownership, and sheet resizing.
6. Keep empty and loaded states mutually exclusive. For empty state, put breadcrumb/title/description/upload into the same scroll container.
7. Implement or preserve Undo / Redo / Zoom out / Fit / Zoom in / Export wherever applicable, with real enabled/disabled states.
8. Add responsive tests for the full viewport matrix and short landscape; include assertions for sheet bounds, scroll container ownership, menu bounds, and no horizontal overflow.
9. Run all checks and report exact results. Do not change design as a side effect of refactoring.

## 16. Wireframe index

- `wireframe-complete.svg` — complete existing app composition and labeled design regions.
- `wireframe-mobile.svg` — compact phone editor, empty state, menus, and loaded toolbar.
- `wireframe-tablet.svg` — tablet navigation and compact editor behavior.
- `wireframe-desktop.svg` — desktop sidebar, grouped menu, canvas, inspector, and history/zoom/export.
- `wireframe-mobile-sheet.svg` — resizable mobile feature sheet and input scroll ownership.
- `wireframe-menus.svg` — File/Features menu anatomy and feature grouping.
- `wireframe-components.svg` — breadcrumb, heading, upload target, feature input, history/zoom controls, and spacing callouts.

The SVGs are structural design references; their labels and proportions explain hierarchy, not exact rendered pixels. This template folder intentionally documents the Photo Editor as currently implemented rather than proposing a new design.
