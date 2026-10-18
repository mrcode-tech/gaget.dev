# Unified Audio Editor — Proposal & Responsive Design

**Status:** Unified Audio Editor implemented; responsive UI consistency refinements are being validated on `fix/audio-editor-photo-editor-consistency`  
**Base reviewed:** `main`  
**Proposal branch:** `proposal/unified-audio-editor`  
**Date:** 2026-10-17  
**Reference design:** `specification/design.md` and the unified Photo Editor experience

## 1. Recommendation

Replace the 18 separate Audio tool destinations with one **Audio Editor** workspace, using the Photo Editor's established shell and responsive behavior: shared GaGet.dev navigation, a compact editor command bar (`[☰] File … Features`), one central workspace, one active feature panel, and a responsive inspector/bottom sheet. Audio-specific needs are a waveform timeline, transport controls, a clear selection range, and an export command in the File menu.

This is a consolidation of capabilities, not a proposal to build a full digital audio workstation (DAW) immediately. Start with single-file editing plus analysis/conversion tools; keep multi-file merge and microphone recording as workflows within the same editor.

## 2. Main-branch audit

The `main` branch has a shared `components/audio-workbench.tsx` rendered by `app/audio/[tool]/page.tsx`, but the 18 audio slugs remain separate public destinations and the tool registry lists them as separate tools. The common workbench already decodes supported audio in-browser and renders a basic waveform; it currently caps files at 80 MB and exports WAV in core paths.

### Existing 18 capabilities to preserve

| Group | Existing capability | Proposed location |
|---|---|---|
| Edit | Audio Editor | Edit / overview |
| Convert | Audio Converter | Export → format |
| Optimize | Audio Compressor | Export → size & quality |
| Level | Audio Volume Changer | Adjust → volume / normalize |
| Edit | Audio Trimmer & Ringtone Maker | Edit → range / trim |
| Arrange | Audio Merger | File → Add audio / Merge |
| Arrange | Audio Splitter | Edit → Split / segment export |
| Playback | Audio Speed Changer | Playback → speed |
| Pitch | Audio Pitch Changer | Playback → pitch (clearly label preview-only until real pitch-shift export exists) |
| Inspect | Audio Metadata Viewer | Analyze → file information |
| Tags | Audio Metadata Editor | File → metadata (currently sidecar export, not embedded tag writing) |
| Convert | Audio to WAV | Export → WAV |
| Encode | Audio to Base64 | File → Base64 encode |
| Decode | Base64 to Audio | File → Base64 decode |
| Analyze | Silence Detector | Analyze → silence |
| Visualize | Audio Waveform Generator | Analyze → waveform image |
| Analyze | Audio Frequency Analyzer | Analyze → spectrum |
| Capture | Microphone Recorder | File → Record audio |

**Important parity rule:** a feature must not be presented as fully supported merely because a legacy page exists. The current page descriptions note limitations: pitch shifting is preview-only, metadata editing does not write embedded tags, and some analysis pages currently expose only basic information. The unified UI should disclose these limitations until the underlying processing is implemented and tested.

## 3. Product scope

### P0 — unified shell and current capability parity
- Open one supported audio file (drag/drop or file picker), display filename, duration, sample rate, channels, and local-processing status.
- Central waveform with playhead, play/pause, current time/duration, zoom/fit, and a selected in/out range.
- Feature menu with exactly one active feature panel at a time.
- Trim, volume/gain, WAV export, supported conversion paths, file information, Base64 encode/decode, waveform image export, frequency view, silence detection, and microphone recording, aligned to verified engine behavior.
- Undo/redo/reset only for operations backed by a real edit history; don't show fake enabled controls.
- Keep all file processing local by default. Explicitly request microphone permission only when the user starts recording.

### P1 — complete workflow quality
- Non-destructive edit history and predictable preview-vs-export parity.
- Fade-in/fade-out, normalization, accurate split-at-markers and multi-segment export, merge with per-file ordering and format validation.
- Export dialog with format, sample rate, channel count, bit depth/quality where supported, estimated size, and explicit unsupported-format messaging.
- Real-time waveform rendering that avoids full-resolution work on every slider movement; move expensive analysis/encoding to workers where appropriate.
- Clear status, cancellation where possible, and graceful recovery from unsupported codecs or memory limits.

### Out of scope for first delivery
- Full multi-track DAW, MIDI, plugin hosting, cloud projects, AI audio generation, and promises of MP3/FLAC encoding unless the required encoders and licenses are selected and tested.

## 4. Information architecture

**Command bar**
- Leading: GaGet.dev menu/hamburger, **File**
- Trailing: **Features**
- Desktop may expose the same grouped menus in a horizontal command bar, consistent with the Photo Editor.

**Feature groups**
1. **Edit:** Trim & range, Split, Merge / arrange, Fade (when implemented), Speed, Pitch
2. **Adjust:** Volume, Normalize (when implemented), Channels
3. **Analyze:** File information, Silence detector, Frequency spectrum, Waveform image
4. **Export & data:** Format conversion, WAV, Compression/size, Base64 encode, Base64 decode, Metadata
5. **Record:** Microphone recorder

Feature names are grouped once; do not add 18 separate top-level Audio cards. Legacy URLs should remain functional during migration and then redirect to the unified editor with a feature selected when practical. Preserve useful SEO metadata/redirect behavior; do not remove routes until redirects and tests exist.

## 5. Desktop layout

- Shared site sidebar: 248 px expanded / 64 px collapsed, following `specification/design.md`.
- Editor command bar above workspace, never under the site header.
- Center stage: waveform timeline with readable time ruler and selection overlay.
- Bottom transport strip: play/pause, stop, current time, duration, playback speed, zoom, undo/redo.
- Right inspector: 320–360 px; contains only the currently selected feature's controls, internally scrollable.
- Export remains in the File menu; do not add a separate persistent Export button.
- Keep the waveform area useful when the inspector is open; collapse the site sidebar or use an overlay at constrained desktop widths rather than squeezing the canvas.

## 6. Responsive behavior — reuse photo editor breakpoints

Use the six existing breakpoint categories from `specification/design.md`: XS, SM, MD, LG, XL, and 2XL. Test the representative viewport matrix from that document.

- **XS (<640 px):** compact sticky top command bar `[☰] File … Features`; the global search box is hidden; waveform takes the available width; transport controls wrap into one compact row; feature controls open as a bottom sheet with internal vertical scroll. Export stays in File. No fixed bottom navigation and no horizontal page scrolling.
- **SM (640–767 px):** same top command bar, larger waveform, bottom sheet inspector; no separate File / Features / Export bottom bar.
- **MD (768–1023 px):** portrait uses bottom sheet (collapsed preview ≤ about 24dvh, expanded ≤ about 70dvh); landscape may use a right overlay if enough width remains. Do not force a narrow side-by-side layout in portrait.
- **LG (1024–1279 px):** desktop shell; sidebar may collapse automatically or inspector becomes an overlay if the waveform falls below a usable width.
- **XL (1280–1535 px):** sidebar + waveform stage + fixed-width inspector.
- **2XL (1536 px+):** center/max-width the workspace; keep inspector width fixed instead of growing with viewport.

Keep the header visible while scrolling, make all panel content scroll vertically inside its own bounds, and never combine vertical and horizontal scrolling in the mobile feature controls. Touch targets, keyboard dismissal, focus return, RTL, 200% zoom, and reduced-motion preferences must match the shared design system.

## 7. Interaction details

- Empty state: clear drop target, **Choose audio**, optional **Record** action, supported-file guidance, and local-privacy note.
- Loaded state: metadata row, waveform, playhead, draggable range handles, transport, and status.
- Feature selection closes the dropdown and opens exactly one inspector. Switching features must not discard the loaded source or current selection.
- Sliders update preview responsively; final export uses the same committed parameters.
- Errors must be specific: unsupported codec, invalid range, file too large, permission denied, encoder unavailable, or export failure.
- Use accessible names for icon-only controls and visible keyboard focus.

## 8. Proposed technical structure

Refactor the current slug-conditional workbench into reusable parts while keeping existing processing logic until tests establish safe replacements:

- `AudioEditorShell` — shared editor chrome and responsive layout
- `AudioDocument` — source files, decoded buffers, selection, metadata
- `AudioTimeline` — waveform, ruler, playhead, selection handles
- `AudioTransport` — play/pause, seek, time, speed
- `AudioFeatureRegistry` — groups, labels, required input, availability, control panel
- `AudioInspector` — renders one active feature panel
- `AudioProcessing` — pure/testable trim, gain, resample, channel mapping, WAV writing
- `AudioAnalysis` — silence detection, waveform peaks, spectrum
- `AudioExport` — capability-aware output and download lifecycle

Do not attempt a large rewrite in one commit. First write characterization tests around the existing behavior, then extract one concern at a time.

## 9. Test and acceptance plan

### Functional
- All 18 capabilities discoverable from the Features menu and searchable by their existing names.
- Every capability has a documented implemented/preview-only/unsupported status.
- File loading, decode errors, 80 MB boundary, malformed Base64, multi-file merge, range validation, output naming, object URL cleanup, microphone permission denial, and recording stop/cleanup are tested.
- Audio export is checked for WAV headers, duration, channel count, sample rate, clipping/gain bounds, and selected-range accuracy.
- Undo/redo only appears active when real history exists; changes don't corrupt the source buffer.

### Responsive and accessibility
- Run screenshot/layout checks at 320×720, 360×800, 390×844, 640×800, 768×1024, 844×390, 1024×768, 1280×800, 1440×900, 1536×960, and 1920×1080.
- Assert no horizontal overflow, sticky header placement, panel bounds, and reachable export controls.
- Test keyboard navigation, Escape dismissal/focus return, screen-reader labels, RTL, 200% zoom, light/dark themes, and Android/iPhone/Windows browsers where available.

### CI
- Update unit/component/E2E and smoke tests for the unified route and legacy redirects.
- Run the repository CI checks on the proposal implementation branch before opening a PR.
- Record exact commit and CI run in `current_working.md`; a wireframe or CI workflow definition is not evidence of a passing run.

## 10. Rollout sequence

1. Approve this information architecture and wireframes.
2. Implement the unified responsive shell and feature registry without deleting legacy routes.
3. Migrate features in small groups, starting with trim, playback, gain, and WAV export.
4. Add analysis/data/recording workflows and close functional gaps.
5. Add redirects and metadata/canonical updates; remove redundant catalog entries only after parity.
6. Run responsive, accessibility, performance, and CI gates; then propose merge.

## Wireframes

- `wireframes/audio-editor-xs.svg` — phone / bottom-sheet layout
- `wireframes/audio-editor-md.svg` — tablet portrait layout
- `wireframes/audio-editor-xl.svg` — desktop with inspector


## 11. UI acceptance refinements — compact command bar

The initial implementation's native select/list box and long in-flow explanatory copy do not meet this specification. The editor must use the Photo Editor command-bar pattern instead:

- A compact **File** menu for Open, Export, and Reset/Close actions.
- A **Features** menu grouped by Edit, Adjust, Analyze, Export & data, and Record; the full list is shown only when the menu is open, never as a persistent selector card.
- Desktop: grouped command-bar shortcuts and a fixed-width 320–360 px contextual inspector beside the waveform.
- Mobile: File and Features stay in the top command bar beside the in-flow navigation button. Export is inside File; there is no fixed bottom action bar. The selected feature's controls appear in a vertically scrollable bottom sheet with a close button. The waveform/player stay in the workspace behind it.
- Keep labels short. Remove repeated privacy/product explanations from the main canvas; use concise metadata and one-line capability limitations only where they affect expectations.
- Feature menus must close after selection, preserve the loaded source, have accessible names/focus states, and avoid horizontal scrolling.
- Playwright should select features through the menu and assert all 18 actions are available. Verify File-menu export placement, hidden mobile search, top-toolbar controls, bottom-sheet bounds, and overflow at the full viewport matrix.

