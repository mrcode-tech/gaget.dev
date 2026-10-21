# Shared Editor Shell Contract

**Status:** Proposed reusable contract; not an approved pixel-perfect target design.  
**Scope:** Shared layout and interaction behavior for Photo, Audio, Video, and Date & Time workspaces. Feature-specific controls, media processing, timelines, calendars, and export semantics remain owned by their feature contracts.  
**Target wireframe:** [Shared editor shell proposal](../assets/target/shared-editor-shell-proposal.svg).  
**Verification record:** branch `feature/design-system-token-handoff`, evaluated commit `ac9e781d159268bbd537d3c3108a5bbe705fc88d`; [latest successful CI run 39681760205](https://github.com/mrcode-tech/gaget.dev/actions/runs/39681760205). The run completed its configured CI job successfully. The associated browser evidence is retained in GitHub Actions artifacts; the [matching-commit evidence artifact from run 39677615422](https://api.github.com/repos/mrcode-tech/gaget.dev/actions/artifacts/12382203414/zip) includes menu/panel screenshots and the design-baseline manifest. This is verification evidence, not approval of the proposed target design.

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
- Menus anchor to their own trigger, remain within viewport margins, and own scrolling when content exceeds available height.
- Menu opening must not create an unexplained gap between command-bar divider, panel, and workspace.
- Keyboard operation includes Tab/Shift+Tab, Enter/Space activation, Escape dismissal, visible focus, and sensible focus restoration. Use native/Radix semantics already present rather than recreating menu behavior.
- When a menu is opened, selected/expanded state and accessible names must be exposed. Do not steal focus from a file input or editing surface without a deliberate interaction.

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
| Responsive baseline | CI baseline captures 390×844, 390×640, 768×1024, and 1440×1000 | The shared-shell E2E matrix directly checks menu bounds at 390×640, 768×1024, and 1440×900; the screenshot baseline also includes 390×844 and 1440×1000 |
| Theme and RTL | Shared-shell E2E matrix covers light/dark menus and panels; RTL menu checks cover Persian Photo/Audio/Video/Date & Time and Arabic Date & Time at 390×640 | RTL screenshots are dark-theme short-mobile only; full RTL theme/viewport parity and keyboard focus restoration in RTL remain unverified |
| Panel visibility and bounds | Shared-shell E2E panel matrix checks Photo/Audio/Video/Date & Time at 390×640 and 768×1024 in light/dark; loaded Video has a generated WebM fixture when supported | General loaded-state coverage is incomplete for Photo/Audio/Date & Time; video fixture may be skipped if runtime MediaRecorder lacks WebM support |
| Short-height behavior | Open menu and panel screenshots captured at 390×640; Video loaded-panel screenshot captured when fixture supported | Independent scroll ownership, panel content scroll reachability, orientation changes, and dynamic visual viewport behavior are not exhaustively asserted |
| Keyboard/focus | File/feature menu Escape dismissal and trigger focus restoration are asserted in the shared-shell matrix | Tab/Shift+Tab, Enter/Space, outside-click consistency, resize keyboard/cancel, and reduced-motion/zoom are not comprehensively covered by this suite |
| Approved design conformance | `shared-editor-shell-proposal.svg` remains Proposal | Product/design review required; this proposal is not approval |

## 8. Acceptance criteria

- [ ] Shell and global navigation do not overlap at the documented width ranges.
- [ ] File/Features menus are trigger-anchored, viewport-bounded and keyboard dismissible.
- [ ] Selected panel and command bar have stable geometry without unexplained gaps or clipped separators.
- [ ] Compact panels are bounded and internally scrollable; resize affordance works by keyboard and pointer where provided.
- [ ] Empty and loaded states retain intentional scroll ownership and do not leak stale controls.
- [ ] Light/dark and LTR/RTL use semantic tokens and correct direction without changing feature data ordering.
- [x] Critical File/Features menu open/close, Escape, focus restoration, viewport bounds, theme, responsive menu states, panel bounds, and short-mobile RTL menu behavior have automated Playwright coverage on the evaluated commit.
- [x] CI and visual evidence are available for commit `ac9e781d159268bbd537d3c3108a5bbe705fc88d`; inspect the artifact linked above for the manifest and screenshots.
- [ ] Complete visual inspection of every artifact screenshot and every state/viewport combination; this review inspected a representative subset of desktop/tablet/mobile-short menus, panels, loaded Video and RTL states.
- [ ] Complete loaded/error/drag-over parity, panel internal scrolling and resizing across all consumers, keyboard navigation beyond Escape, zoom/orientation/dynamic viewport checks.
- [ ] Product/design approval is recorded separately before marking this target Approved.
