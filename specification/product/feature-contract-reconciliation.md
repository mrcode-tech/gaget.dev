# Feature Contract Reconciliation

**Status:** Audit baseline / proposed expected behavior; not approved target design.  
**Audit branch:** `feature/design-system-token-handoff`  
**Audit date:** 2026-10-21  
**Purpose:** Preserve durable requirements from legacy feature specifications while separating them from verified implementation facts. This document does not imply pixel-level conformance or approval of a new visual design.

## 1. Evidence and status rules

- **Current implementation:** source files and tests on the audit branch. A test file indicates intended/tested behavior, not necessarily complete browser coverage.
- **Expected behavior:** requirements retained below from the legacy design proposals and shared editor template. Since the prior documents were marked proposal/design reference and no target assets are approved in `specification/assets/target/`, these requirements are carried forward as **proposed contracts** until reviewed and approved. The first authored target asset is [`shared-editor-shell-proposal.svg`](../assets/target/shared-editor-shell-proposal.svg); its status is Proposal, not Approved.
- **Verified:** only a behavior supported by an executed test or direct browser inspection of the evaluated commit. Source inspection alone is not runtime verification.
- **Not verified:** visual geometry, interaction, or browser-dependent capability not established by the evidence listed here.

## 2. Legacy document disposition

The branch replaces the former broad specification set with foundations, inventories, and a template. The following documents were present on `stage` but are absent from this branch; their durable requirements must not be considered implicitly obsolete:

| Legacy document | Durable requirements retained here | Migration status |
|---|---|---|
| `specification/design.md` | Shared shell, responsive navigation, editor command bar, menu anchoring, Photo Editor feature discovery, responsive and accessibility expectations | Core requirements summarized in sections 3–4; detailed per-breakpoint target wireframes still missing |
| `specification/tempalet_wirefram/template_single_app.md` | Shared File/Features menu anatomy, menu insets/row spacing, empty/loaded state distinction, mobile resizable sheet, scroll ownership, shell parity rules | Core requirements summarized in sections 3–4; old SVG template assets are not present on this branch |
| `specification/editor-file-states/design.md` | Empty/drag-over/loaded/error states, inline errors, no unintended focus theft, preserve loaded workspace while changing empty state | Summarized in section 5; authored state wireframes still missing |
| `specification/audio-editor/design.md` | Audio feature inventory, common shell, waveform/player state, browser processing and export limitations | Summarized in section 7; exhaustive feature-by-feature acceptance matrix still needed |
| `specification/video-editor/design.md` and `specification/video-editor-refactor.md` | Honest browser/codec capability claims, feature grouping, native seek vs custom timeline distinctions, unsupported/experimental operations | Summarized in section 8; full interactive capability matrix and browser evidence still needed |
| `specification/date-time/unified-date-time-app-proposal.md` | Live date/time centerpiece, shared date/time context, independent calendar/locale/numeral/time-zone settings, reusable localized input family, unsupported calendar handling | Summarized in section 9; feature-by-feature acceptance and target wireframes still needed |
| `specification/wireframes/README.md` and its SVG assets | Home/navigation and 13-feature Photo Editor breakpoint atlas | Not migrated as target assets; current-state screenshots are not substitutes |
| `specification/tempalet_wirefram/wireframe-*.svg` and editor state SVGs | Editable source for intended menu, workspace, and state anatomy | Not migrated; must be re-authored/reviewed before visual approval |
| `.github/workflows/render-audio-wireframes.yml`, `.github/workflows/render-editor-file-state-wireframes.yml` | Repeatable rendering of authored wireframes | Removed; generated screenshots are now captured by CI, but this does not replace rendering authored design SVGs |

**Decision:** these deletions are not treated as proof that their requirements were rejected. This file is the interim preservation record. Feature-specific canonical specifications and authored target SVGs are still required before conformance can be declared.

## 3. Shared application shell and responsive behavior

**Source inventory:** `components/app-shell.tsx`, `components/app-header.tsx`, `components/app-sidebar.tsx`, `components/tool-layout.tsx`, `components/use-resizable-feature-sheet.ts`, `app/globals.css`.  
**Tests:** `tests/app-shell.test.tsx`, `tests/app-sidebar.test.tsx`, `tests/editor-command-bar.test.tsx`.

### Proposed shared contract

**Target asset:** [`shared-editor-shell-proposal.svg`](../assets/target/shared-editor-shell-proposal.svg) — Proposal, desktop and mobile empty-state shell. It is schematic and does not replace the detailed state/feature wireframes still required.

- Breakpoints follow the repository's Tailwind ranges; they are width-based, not device-name assumptions. XS/SM/MD use compact navigation through 1023px; LG and wider use desktop navigation, with content bounded on wide displays.
- The mobile/tablet site navigation overlays the page with a backdrop rather than pushing or resizing page content. The desktop sidebar is direction-aware and the main workspace must account for its expanded/collapsed width.
- Editor command bars remain separate from global navigation and are not obscured by the header/sidebar. File and Features menus stay anchored to their triggers, bounded by viewport margins, and internally scroll when needed.
- Menus must retain visible focus, keyboard operation, Escape dismissal, and predictable focus restoration. Labels may wrap or truncate without horizontal overflow.
- Shared spacing/tokens come from the current theme and component primitives; do not introduce one-off colors, shadows, or competing breakpoint systems without an explicit design decision.
- Short-height and landscape viewports, dynamic mobile viewport height, 200% zoom, long translations, reduced motion, RTL, and light/dark themes are part of the responsive/accessibility contract.

### Current status

The code has shared shell and menu components plus component tests. The shell applies route-specific behavior, so parity cannot be inferred from shared components alone. The CI screenshot matrix currently captures initial/default states at 390×844, 768×1024, and 1440×1000 in light/dark themes. It does not yet prove short-height behavior, zoom, keyboard/focus behavior, loaded media states, open menus, or visual parity with approved target designs.

## 4. Shared editor command bar, panels, and scroll ownership

**Source inventory:** `components/photo-editor.tsx`, `components/audio-workbench.tsx`, `components/video-workbench.tsx`, `components/datetime-editor.tsx`, `components/use-resizable-feature-sheet.ts`.  
**Tests:** `tests/editor-command-bar.test.tsx`, `tests/photo-editor.test.tsx`, `tests/audio-workbench.test.tsx`, `tests/video-workbench.test.tsx`, `tests/datetime-editor.test.tsx`.

### Proposed shared contract

- Keep a single active feature panel at a time. File actions and feature controls must remain in their proper menu and not introduce unexplained gaps between the command bar, panel, and workspace.
- Empty-file state and loaded-file state are distinct. Do not show stale filename, dimensions, history, zoom, fit, or export controls when no compatible file is loaded.
- Empty-state breadcrumb, title, description, and upload target belong to one intended workspace/scroll region; avoid nested competing scroll containers and horizontal page overflow.
- Loaded-state layout and media-processing behavior must not be changed as a side effect of adjusting the empty state.
- For mobile/tablet, a contextual feature sheet should be viewport-bounded and internally scrollable. A draggable/resizable sheet is a proposed parity requirement where supported by the shared component; do not claim Audio/Video already satisfy it without browser evidence.
- For desktop, an inspector must be bounded and must not consume so much width that the primary workspace becomes unusable. The breakpoint is determined by the actual component contract and available workspace width, not forced identically for every media type.

### Missing visual evidence

The current baseline screenshots do not capture empty-vs-loaded transitions, drag-over, invalid-file errors, open File/Features menus, selected feature panels, sheet drag/snap states, or the relationship between the feature panel and command-bar separators. These need authored target wireframes and browser captures at matched viewports.

## 5. Image / Photo workspace

**Canonical route:** `/images/editor`.  
**Source inventory:** `components/photo-editor.tsx`, `components/image-workbench.tsx`, `lib/tools/image-tools.ts`.  
**Test:** `tests/photo-editor.test.tsx`.

### Current implementation facts

The branch contains image loading, canvas-based transformations and adjustments, crop/resize, text layers, and export format/quality controls. The broader workbench includes collage, metadata, palette/color sampling, Base64, favicon, SVG optimization, dimensions, and print-size workflows. Legacy slugs route into the unified editor; a registry entry is not proof of a separate page or a complete workflow. Each operation and export path still needs feature-level verification.

### Proposed contract to preserve

- The canvas remains the primary loaded workspace. Contextual parameters must not permanently consume the small-screen canvas area.
- Empty state communicates the open action, supported formats/limits, privacy/local-processing facts, and inline failure/retry behavior.
- File and Features menus remain compact and trigger-anchored. Desktop feature groups and mobile feature list expose the same implemented capabilities without implying unsupported actions.
- Crop ratios, aspect-locked resize, text/watermark, filters, pixel color sampling, image details, export/convert, print sizing, Base64, favicon, collage, and SVG optimization require clear labels and accessible controls.
- History, zoom, fit, reset, and export are only shown/enabled when applicable to the current loaded state.
- Responsive layouts preserve the canvas, avoid horizontal page overflow, and keep mobile contextual controls bounded and usable.

### Verification status

Component tests exist, but no feature-by-feature browser acceptance matrix or approved target SVGs are currently present in the canonical specification tree. Loaded states, menu placement, active inspectors, file errors, keyboard interaction, and exports are not fully verified by the screenshot baseline.

## 6. Shared file-entry states for Photo and Audio

**Source inventory:** Photo and Audio workbenches.  
**Tests:** `tests/photo-editor.test.tsx`, `tests/audio-workbench.test.tsx`.

### Proposed state model

1. **Empty:** clear title/description and a visible file picker; explain supported types and relevant limits.
2. **Drag-over:** visible but restrained drop-target feedback; no layout jump or viewport overflow.
3. **Loaded:** show media-appropriate workspace and metadata. Photo uses its canvas; Audio uses waveform/player and audio metadata. Keep the loaded layout's existing controls and processing behavior.
4. **Invalid/error:** inline error near the triggering workflow, actionable retry, and no blocking browser alert.

Keyboard file selection and drag/drop must both be supported where implemented. Focus should not be stolen on successful load without a clear interaction reason. Status changes should be accessible without repeatedly announcing progress. Empty, drag-over, loaded, and error states require automated tests at mobile and desktop widths. These requirements are proposed until approved and verified.

## 7. Audio workspace

**Canonical route:** `/audio/editor`.  
**Source inventory:** `components/audio-workbench.tsx`.  
**Test:** `tests/audio-workbench.test.tsx`.

### Current implementation facts

The audio workbench uses browser audio decoding, an audio buffer/waveform, and WAV-oriented export paths. Multi-file merge, segment-based splitting, playback-speed controls, and metadata handling have implementation-specific limits. Playback speed must not be described as pitch-shift export. Metadata inspection or sidecar behavior must not be described as embedded tag writing unless the code demonstrably writes tags. Microphone access must follow an explicit user action.

### Proposed contract to preserve

- Preserve the unified Photo-style shell without copying image-only controls such as canvas zoom/history where they do not apply.
- Loaded state presents waveform/player, filename and relevant metadata; file actions and export accurately describe supported formats.
- Audio controls remain usable on narrow and short viewports; feature controls must not obscure the waveform/player or create competing scroll regions.
- Unsupported codecs, export paths, and metadata operations must be disclosed instead of presented as successful.

### Verification status

The component test exists. The CI baseline does not yet capture loaded audio, playback, active feature panels, file errors, export results, or browser-specific format behavior. An exhaustive capability/feature acceptance table remains outstanding.

## 8. Video workspace

**Canonical route:** `/video/editor`.  
**Source inventory:** `components/video-workbench.tsx`, `app/video/[tool]/page.tsx`, `lib/tools/registry.ts`.  
**Test:** `tests/video-workbench.test.tsx`.

### Current implementation facts

The browser-native path relies on video/canvas playback and MediaRecorder capabilities. Selected-range WebM recording, canvas transforms/filters, PNG frame capture, basic metadata, subtitle sidecar export, Base64, and recording are capability- and browser-dependent. The source registry must not overstate experimental or unavailable operations.

### Proposed contract to preserve

- Keep the unified editor shell and group feature actions without adding controls irrelevant to the selected feature.
- Trim/Split should use the native player seek/range controls where that is the actual implementation; do not show a redundant custom timeline. Custom timelines belong only to features that need them.
- Keep workspace-first features' controls in the main workspace when specified; do not auto-open an irrelevant settings panel.
- Clearly disclose unsupported or experimental operations. Do not promise universal MP4/MOV transcoding, native GIF encoding, reliable reverse muxing, stabilization, merge/mux, or source-audio preservation for every canvas export unless a verified engine supports it.
- Validate browser codec support, output duration/dimensions, audio track presence, seeking, and download behavior before describing an export as successful.

### Verification status

The component test and a production-route smoke check exist. Browser-specific codec/export behavior and the feature-by-feature UI/timeline matrix remain unverified. The screenshot baseline captures only the initial empty/default route, not video loaded/active states.

## 9. Date & Time workspace and reusable inputs

**Canonical route:** `/datetime/editor`.  
**Source inventory:** `components/datetime-editor.tsx`, `components/datetime-workbench.tsx`, `components/date-time-fields.tsx`.  
**Tests:** `tests/datetime-editor.test.tsx`, `tests/date-time-fields.test.tsx`.

### Current implementation facts

The workspace consolidates date/time utilities. Locale/calendar behavior depends partly on browser internationalization support. Source and tests must be checked per feature; a route or registry entry does not establish complete behavior for every calendar, time zone, or calculation.

### Proposed contract to preserve

- The default workspace is a live date/time explorer, not a file-upload state. A bounded centerpiece shows the selected date/time context and offers a clear way to apply it to the active feature.
- Calendar system, display language/locale, numeral system, clock format, and time zone are independent settings. Keep technical values such as ISO dates, Unix timestamps, and IANA zone identifiers legible and directionally isolated in RTL presentation.
- Use a shared styled input family for date, time, date-time, ranges, calendar system, locale/numerals, and time zone. Do not use raw browser date/time inputs or an unstyled native select as the primary designed control.
- Date/time inputs need localized labels and digits, month/year navigation, explicit selected state, keyboard operation, bounded popovers, internal scrolling, and validation feedback.
- Normalize localized digits to canonical internal values where appropriate. Preserve canonical ISO date and 24-hour time representations internally.
- Feature-detect calendar and locale combinations and communicate unsupported behavior gracefully; do not promise identical results across all browsers without verification.

### Verification status

Date/time component tests exist. Calendar coverage, typed localized digits, unsupported locale/calendar combinations, timezone edge cases, keyboard operation, RTL layout, and active feature-panel visuals need explicit acceptance tests and browser review. No target SVGs for the centerpiece or input family are currently approved.

## 10. Cross-route audit matrix

| Area | Source reviewed | Automated test evidence | Main gap |
|---|---|---|---|
| Shared shell/navigation | App shell/header/sidebar/layout | `app-shell`, `app-sidebar`, editor command bar tests | Open drawer/menu focus, short-height, zoom, RTL placement and scroll ownership need browser evidence |
| Photo | Photo editor and image workbench | `photo-editor.test.tsx` | Empty/loaded/error/active feature states and exports need matched screenshot + functional coverage |
| Audio | Audio workbench | `audio-workbench.test.tsx` | Loaded waveform, capability-specific export and metadata claims need browser validation |
| Video | Video workbench and legacy route | `video-workbench.test.tsx` plus smoke route | Codec-specific behavior, unsupported features, timeline variants and audio preservation need validation |
| Date & Time | Date-time editor/workbench and field components | `datetime-editor`, `date-time-fields` tests | Locale/calendar/timezone combinations, localized input, keyboard behavior and active feature panels need broader coverage |
| Localization | i18n provider, middleware, message catalog | `i18n.test.mjs`, smoke tests | RTL and language assertions are now in CI; verify all localized routes and translated content, not only `dir` metadata |
| Visual evidence | `scripts/capture-design-baseline.mjs` | CI screenshot capture | Default/empty state only; no target comparison or interaction-state capture |

## 11. Required next increments

1. Author and review editable target SVG wireframes for the shared shell/command bar, Photo/Audio file states, and Date & Time centerpiece/input family. Keep all designs labeled **Proposal** until approved.
2. Extend screenshot capture or add Playwright scenarios for short-height mobile, open menus, active feature panels, empty/loaded/error states, RTL, and both themes.
3. Build a feature-by-feature capability matrix for Audio and Video tied to source code and tests; disable or label unavailable operations rather than relying on registry prose.
4. Expand date/time locale/calendar/numeral/time-zone tests and inspect the actual rendered input behavior.
5. Re-run CI and update the current-state baseline only with evidence from the exact evaluated commit. Do not mark the project conformant until each route has an approved target contract and matching verification evidence.


## 10. Shared shell contract handoff and verification (2026-10-21)

The reusable proposed contract is documented in [Shared Editor Shell Contract](../components/shared-editor-shell.md). It defines shared-shell versus feature-workspace ownership, width and short-height behavior, command menus, panel sizing, scroll ownership, state boundaries, themes, RTL/LTR, accessibility, acceptance criteria and known evidence gaps.

The verified checkpoint commit was `c5b6203c2789c9c7ed56b5c28cd22586857fd818`. Its [GaGet.dev CI run](https://github.com/mrcode-tech/gaget.dev/actions/runs/39670723789) completed successfully, including unit/component tests, lint, typecheck, production build, smoke and responsive/accessibility checks. This evidence applies to that exact commit; it does not establish manual inspection of open menus/panels or approval of the wireframe.

The capture script defines 390×844, 390×640, 768×1024 and 1440×1000, with light/dark and selected RTL route captures. A separate screenshot workflow on commit `dd0983eebdd60896b9b50c45594dc06c7fd931e1` succeeded, but that is not the same commit as the latest head; do not treat it as current-head visual proof. Current CI success uploads visual evidence artifacts, but screenshot capture completion and manual visual inspection must be checked from the exact run before claiming they passed.

**Still open:** target wireframe remains Proposal; selected feature panel/open menu/loaded/error state screenshot inspection is not evidenced here; full keyboard and touch browser coverage and cross-consumer parity require follow-up. Do not declare the shared shell fully verified or approved solely from CI passing.

## 10. Enhanced mobile Features-menu search

**Status:** Proposed contract; not approved pixel-perfect target design.
**Source files inspected on the task baseline:** components/photo-editor.tsx, components/audio-workbench.tsx, components/video-workbench.tsx, components/datetime-editor.tsx, tests/datetime-editor.test.tsx, and tests/e2e/shared-editor-shell.spec.ts.

### Source-derived baseline

| Editor | Feature entries in source | Current mobile/compact search behavior |
|---|---:|---|
| Photo/Image | 13 | No search input; grouped Edit/Image/Create list in mobile Features menu |
| Audio | 18 | No search input; grouped feature menus, each currently opens one group at a time |
| Video | 23 | No search input; grouped feature menus, each currently opens one group at a time |
| Date & Time | 20 | Search input exists in the Features menu; it matches title, description and group using lowercase substring matching, but is currently shown throughout the compact menu breakpoint and its query persists when the menu closes |

These counts and behaviors are source inspections, not a claim that browser tests have run. Audio and Video currently expose group-triggered menus rather than a single all-groups mobile list. The implementation must preserve the existing menu/navigation structure while applying a consistent search experience to the feature list actually available in each open menu. The product contract requires searching the current editor's available features, not another editor or global navigation.

### Target rule

Follow the Shared Editor Shell Contract — Mobile Features-menu search. In short: below 768 px only, show the search field when the current Features menu has more than 8 selectable feature entries; at 8 or fewer, omit it. Do not add the search field at tablet widths (768–1023 px) or desktop widths (1024 px and above). Keep the current groups/order/labels/descriptions/icons and feature activation semantics.

**Architecture note:** Because Audio and Video currently open one group at a time while Photo and Date & Time present broader lists, do not flatten or redesign their navigation merely to imitate another editor. Count the available selectable features represented by the current Features menu interaction, and apply the same visibility rule and matching semantics to the current menu's available feature set. If implementation inspection establishes that the user intends all Audio/Video groups to become one combined menu, that would be a material navigation redesign and must be confirmed separately.

### Search lifecycle and verification

The query starts empty for every menu opening and clears on menu close, Escape, outside click, feature selection, and editor identity change. Match trimmed, case-insensitive substrings across title, description and group label; preserve source ordering and suppress empty groups. Show a localized no-results state for a non-empty query with no matches. Use existing i18n fallback and logical-direction styles for Persian/Arabic.

The existing shared-shell Playwright matrix covers 390×640 mobile-short, 768×1024 tablet and 1440×900 desktop for menu geometry and Escape focus restoration, but it does not yet verify the new search threshold/results/RTL contract. Add targeted unit/component and browser coverage, and associate generated screenshots and a manifest with the exact tested commit. No implementation or visual verification is claimed by this baseline entry.
