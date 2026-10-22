# Shared Editor Shell Contract

**Status:** Proposed reusable contract; not an approved pixel-perfect target design.
**Scope:** Shared layout and interaction behavior for Photo, Audio, Video, and Date & Time workspaces. Feature-specific controls, media processing, timelines, calendars, and export semantics remain owned by their feature contracts.
**Target wireframes:** [Shared editor shell proposal](../assets/target/shared-editor-shell-proposal.svg); [Enhanced mobile Features-menu proposal](../assets/target/enhanced-mobile-feature-menu-proposal.svg). Both remain Proposal, not approved pixel-perfect targets.
**Verification evidence:** CI uploads build-associated screenshots, test logs, Playwright failure context and a verification manifest with browser, viewport coverage, test outcomes and screenshot paths. Use the artifact from the exact build being evaluated. This evidence does not approve the proposed target design.

## 1. Ownership boundaries

### Shared shell owns
- Global navigation relationship to the editor, route-level header/sidebar visibility, and content offsets.
- Editor command-bar placement, File/Features menu anchoring and dismissal, shared feature-panel geometry, viewport constraints, theme-aware surfaces, and direction-aware shell layout.
- Empty/loading/error/loaded container boundaries where the consumer uses the shared pattern.
- Consistent focus, keyboard, responsive, scroll, and accessibility behavior for shared controls.

### Feature workspace owns
- Photo canvas, selection tools, crop/resize and image-specific controls.
- Audio waveform/player, recording and audio-specific controls.
- Video preview, timeline/seek model, codecs and video-specific controls.
- Date/time live display, calendar systems, locale/numeral/time-zone behavior and date-specific controls.
- File compatibility, processing/export capability, resource cleanup and feature-specific error content.

Shared shell changes must not imply media or date/time behavior parity where it is not implemented and tested. A consumer may diverge only with a documented reason and tests for the exception.

## 2. Responsive layout contract (proposed)

Use the repository's existing Tailwind ranges; do not add competing breakpoints.

| Width range | Navigation and command bar | Feature panel/workspace |
|---|---|---|
| XS <640px | Compact navigation; command actions remain reachable without page-wide horizontal scrolling. Menus fit viewport and scroll internally. | One-column workspace; contextual panel uses a viewport-bounded sheet when supported by the consumer. |
| SM 640–767px | Same compact model with wider gutters; do not force desktop inspector columns. | Sheet/workspace must not overlap critical actions. |
| MD 768–1023px | Site drawer remains the navigation model. Preserve a compact editor command bar. | Do not force a narrow desktop inspector; use the consumer's supported sheet/panel pattern. |
| LG 1024–1279px | Persistent collapsible sidebar and desktop menu behavior. | Show an inspector only when usable workspace width remains. |
| XL 1280–1535px | Full desktop shell with bounded content. | Workspace and inspector form distinct regions; inspector must not dominate the work area. |
| 2XL ≥1536px | Avoid unbounded stretching. | Bound workspace/panel widths and preserve readable content density. |

Height is a separate constraint. On short-height and landscape screens, controls must remain reachable; menus and panels scroll within their own bounds; do not assume a fixed viewport height. Use dynamic viewport sizing where available and respond to viewport resize/orientation changes.

## 3. Command bar and menus

- Keep the editor command bar visually and structurally distinct from global site navigation.
- Keep File and Features triggers in stable locations; preserve button hit areas and prevent flex shrink from producing accidental overlap.
- On compact editor routes, hide the global header and its spacer so the editor command bar is the single mobile navigation row. Date & Time places the hamburger and File trigger on the left and Features on the right; the hamburger must open the shared mobile sidebar drawer.
- Date & Time File and Features menus open directly below that command bar, remain within viewport bounds, and must not create a duplicate hamburger or a second navigation row.
- Menus anchor to their own trigger, remain within viewport margins, and own scrolling when content exceeds available height.
- Menu opening must not create an unexplained gap between command-bar divider, panel, and workspace.
- Keyboard operation includes Tab/Shift+Tab, Enter/Space activation, Escape dismissal, visible focus, and sensible focus restoration. Use native/Radix semantics already present rather than recreating menu behavior.
- When a menu is opened, selected/expanded state and accessible names must be exposed. Do not steal focus from a file input or editing surface without a deliberate interaction.

## 3.1 Mobile Features-menu search contract

**Status:** Proposed contract for review; not an approval of a pixel-perfect design.
**Applies to:** Photo/Image, Audio, Video, and Date & Time Features menus.

### Purpose and visibility

The Features menu can become long on small screens. Search should reduce scanning effort without adding permanent UI to short lists or changing desktop/tablet behavior.

- Define **mobile** using the existing project breakpoints: XS and SM widths below 768 CSS px. MD (768–1023 px) is tablet, not mobile, even where the compact command bar remains in use.
- Show the search input only when both conditions are true: the viewport width is **below 768 px** and the current menu contains **more than 8 available feature entries**.
- Exactly 8 entries: no search input. Exactly 9 entries: show search input on mobile.
- Count actual selectable feature entries from the current editor's feature menu data, not group headings, File actions, hidden navigation items, or features from another editor.
- The current source declares 13 Photo entries, 18 Audio entries, 23 Video entries, and 20 Date & Time entries. CI browser verification confirmed these menus show search on mobile and retain all features at tablet/desktop widths.
- At 768 px and above, do not render the new search input and do not filter or hide any entries as a side effect of this mobile-only feature. Preserve existing tablet and desktop menu behavior.

### Placement, anatomy, and responsive behavior

- Keep the existing menu trigger, anchoring, heading, close affordance, groups, icons, titles, descriptions, and selected state.
- When enabled, place the search input immediately after the Features-menu heading/close row and before the first feature group. It spans the available inner menu width and participates in the menu's existing vertical flow.
- Reuse the shared shadcn-style Input, semantic theme tokens, and existing Lucide search icon. Use direction-aware start positioning/padding, not hard-coded left/right alignment.
- Keep the existing viewport-bounded menu and its single vertical scroll owner. Search results reduce list content but must not create a second nested scrolling region or horizontal page overflow. The menu remains usable on short-height and landscape mobile screens.
- At widths below 768 px, filtering is enabled only while the search control is applicable. At 768 px and above, all entries remain visible in their normal group structure.

### Matching and result states

- Trim leading/trailing whitespace from the query. A whitespace-only query is equivalent to an empty query and shows all entries.
- Match case-insensitively against the visible feature title, description, and feature-group label, preserving the existing Date & Time search convention. Search must be scoped to the current editor's available feature entries only.
- Preserve original feature order and group order. Hide a group heading when none of that group's features match; do not show empty groups.
- When a non-empty query has no matches, keep the search field visible and show a concise localized empty-result message inside the menu. Do not render empty group headings, unrelated navigation items, or a fake feature row. Clearing the query restores all available entries.
- Use the existing locale/i18n conventions for the input accessible name, placeholder, and no-results message. Keep the input, icon and text direction-aware for Persian and Arabic RTL; do not reverse intrinsic icon/feature data order.

### Query lifecycle and interaction

- Start each menu opening with an empty query.
- Clear the query whenever the Features menu closes, including close button, Escape, outside click, or feature selection; reopening starts with the complete list.
- A tool/route change must not carry the previous editor's query into another editor. If a consumer is reused without unmounting, reset the query when its editor identity changes.
- Typing filters immediately; there is no submit button or delayed search action.
- Keep focus in the input while typing. Opening the menu must not unexpectedly steal focus from unrelated editing controls; the user can Tab to the search field and then through results. Escape closes the menu and restores focus to the Features trigger, following the existing shell convention.
- Use a programmatic label (not placeholder-only labeling), visible focus ring, semantic input type, and an accessible announcement for the no-results state where supported by the existing primitives. Decorative search icon is hidden from assistive technology.
- Feature rows retain their existing button semantics and pressed/selected state. Search does not activate a result merely by matching it.

### Localization and RTL

- Use existing translation/fallback mechanisms; do not introduce a new i18n library or silently claim that feature names themselves are translated if they are not.
- Search must accept Unicode input and perform case-insensitive matching where the locale has case mappings. Do not strip diacritics or transliterate scripts unless an established project convention already does so.
- For Persian and Arabic UI locales, inherit dir=rtl, align the input and placeholder according to the current direction, position the search icon with logical start spacing, and preserve correct focus/reading order.
- Include a Persian/Arabic RTL browser check and localized label/no-results assertions. If a locale lacks a translated string, use the established English fallback rather than an empty label.

### Verification evidence
Runtime acceptance must be checked against the latest CI run for the exact build under review; historical artifacts are not evidence for a different build.
### Acceptance criteria

- [x] 8 features: no search input at 390 px; all 8 entries are shown.
- [x] 9 features: search input at 390 px; matching, empty-query, and no-match states behave as specified.
- [x] Current source inventories (Photo 13, Audio 18, Video 23, Date & Time 20) each show search on mobile.
- [x] At 768 px tablet and 1440 px desktop, no search input is rendered and all menu features remain visible regardless of prior mobile query.
- [x] Query clears on menu close/reopen and on editor identity change.
- [x] Persian and Arabic RTL, keyboard focus/restoration, short-height layout, and no-horizontal-overflow checks pass.
- [ ] The authored wireframe is explicitly labeled Proposal until approved; browser screenshots remain verification evidence, not design authority.

## 4. Panel sizing, placement and scroll ownership

- At most one contextual feature panel is active per workspace unless a feature contract explicitly says otherwise.
- Desktop inspector placement is consumer-owned but must align with editor content bounds and must not cover command-bar controls or make the main work area unusable.
- On compact screens, a sheet must be bounded by the visual viewport, expose an obvious close affordance, and scroll its content independently.
- Where resize is supported, the handle must have a visible affordance, keyboard support, an accessible name/role and truthful min/max/current values. Pointer cancellation and viewport changes must leave the panel in a valid size.
- The shell must not introduce nested competing scroll regions. Empty-state heading, description and upload target scroll together where the consumer uses the empty-workspace pattern. A loaded canvas/timeline/player retains its own intended interaction and scroll behavior.
- Avoid unexplained large gaps, clipped separators, overlapping dividers, page-level horizontal overflow, or a panel positioned far from the command bar when the interaction implies a relationship.

## 5. State boundaries

- **Empty:** no stale file metadata, history, zoom/fit, timeline, or export affordances.
- **Drag-over:** clear visual cue without moving the overall layout unexpectedly.
- **Loading/processing:** clear status, disable conflicting actions, announce progress when meaningful.
- **Loaded:** preserve workspace-specific editing context and intended scroll ownership.
- **Error/unsupported:** actionable, accessible message; do not claim unsupported processing/export succeeded.
- **Panel open/closed/resizing:** stable command-bar position and no unexpected content jump.

Actual file validation, browser APIs, processing, and export errors are feature-owned. Do not fabricate shared success states.

## 6. Themes, direction and accessibility

- Consume existing semantic theme tokens and shared component variants; no arbitrary new palette or one-off shadows for the shell.
- Verify light/dark contrast for surfaces, borders, muted text and focus indicators. State must not rely on color alone.
- UI locale controls interface direction. Date-display locale, calendar system and numeral preferences must not implicitly change UI direction.
- RTL reverses direction-aware shell placement and alignment, but must not blindly reverse media timelines, time values, code, or other intrinsically ordered data.
- Support keyboard-only use, visible `:focus-visible`, Escape dismissal, accessible names/roles/states, logical reading order, reduced motion, long translations and zoom.
- Touch controls should generally be 40–44 CSS px where practical. Resizing must be possible without pointer input where a resize handle is provided.

## 7. Verification matrix and known limits

| Area | Existing evidence | Remaining verification |
|---|---|---|
| Component structure/menu classes | `tests/editor-command-bar.test.tsx` plus `tests/e2e/shared-editor-shell.spec.ts` | CI browser tests exercise File/Features menus, viewport bounds, Escape dismissal and focus restoration for all four editors |
| Date & Time mobile navigation parity | Dedicated shared-shell Playwright checks assert one command bar, File/Features menu bounds and real sidebar-drawer open/close at compact widths | Repeat on the evaluated build; wider RTL/landscape and additional keyboard scenarios remain separate coverage |
| Responsive baseline | CI baseline captures 390×844, 390×640, 768×1024, and 1440×1000 | The shared-shell E2E matrix directly checks menu bounds at 390×640, 768×1024, and 1440×900; the screenshot baseline also includes 390×844 and 1440×1000 |
| Theme and RTL | Shared-shell E2E matrix covers light/dark menus and panels; RTL menu checks cover Persian Photo/Audio/Video/Date & Time and Arabic Date & Time at 390×640 | RTL screenshots are dark-theme short-mobile only; full RTL theme/viewport parity and keyboard focus restoration in RTL remain unverified |
| Panel visibility and bounds | Shared-shell E2E panel matrix checks Photo/Audio/Video/Date & Time at 390×640 and 768×1024 in light/dark; loaded Video has a generated WebM fixture when supported | General loaded-state coverage is incomplete for Photo/Audio/Date & Time; video fixture may be skipped if runtime MediaRecorder lacks WebM support |
| Short-height behavior | Open menu and panel screenshots captured at 390×640; Video loaded-panel screenshot captured when fixture supported | Independent scroll ownership, panel content scroll reachability, orientation changes, and dynamic visual viewport behavior are not exhaustively asserted |
| Keyboard/focus | File/feature menu Escape dismissal and trigger focus restoration are asserted in the shared-shell matrix | Tab/Shift+Tab, Enter/Space, outside-click consistency, resize keyboard/cancel, and reduced-motion/zoom are not comprehensively covered by this suite |
| Approved design conformance | `shared-editor-shell-proposal.svg` remains Proposal | Product/design review required; this proposal is not approval |

## 8. Acceptance criteria

- [ ] Shell and global navigation do not overlap at the documented width ranges.
- [ ] File/Features menus are trigger-anchored, viewport-bounded and keyboard dismissible.
- [x] Date & Time mobile navigation uses one command bar with hamburger/File on the left, Features on the right, a functioning shared navigation drawer, and viewport-bounded menus directly below the bar.
- [ ] Selected panel and command bar have stable geometry without unexplained gaps or clipped separators.
- [ ] Compact panels are bounded and internally scrollable; resize affordance works by keyboard and pointer where provided.
- [ ] Empty and loaded states retain intentional scroll ownership and do not leak stale controls.
- [ ] Light/dark and LTR/RTL use semantic tokens and correct direction without changing feature data ordering.
- [x] Critical File/Features menu open/close, Escape, focus restoration, viewport bounds, theme, responsive menu states, panel bounds, and short-mobile RTL menu behavior have automated Playwright coverage on the evaluated commit.
- [ ] CI and visual evidence are available for the exact build under review; inspect its artifact manifest and screenshots before marking verification complete.
- [ ] Complete visual inspection of every artifact screenshot and every state/viewport combination; this review inspected a representative subset of desktop/tablet/mobile-short menus, panels, loaded Video and RTL states.
- [ ] Complete loaded/error/drag-over parity, panel internal scrolling and resizing across all consumers, keyboard navigation beyond Escape, zoom/orientation/dynamic viewport checks.
- [ ] Product/design approval is recorded separately before marking this target Approved.
