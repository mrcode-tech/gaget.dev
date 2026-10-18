# Unified Video Editor — Design and Implementation Specification

**Status:** Initial implementation on `feature/unified-video-editor`  
**Base branch:** `stage`  
**Reference:** `specification/design.md`, `specification/audio-editor/design.md`, and `specification/editor-file-states/design.md`

## 1. Product decision

Provide one **Video Editor** at `/video/editor`. Video operations are feature panels in a shared workbench, not independent top-level tools. Preserve the GaGet shell, File menu, desktop grouped feature menus, mobile Features menu, empty/loaded file states, and responsive behavior used by the Photo Editor and Audio Editor.

## 2. Feature inventory and honest capability labels

| Group | Feature | Current browser-native implementation |
|---|---|---|
| Edit | Trim video | Select range and record canvas output in real time to WebM where supported |
| Edit | Split video | Range-based segment export; multiple segment batch export remains future work |
| Edit | Merge videos | Menu and multiple-file selection are present; actual muxed merge requires a dedicated media engine |
| Edit | Crop, rotate, flip | Preview transform and canvas export controls |
| Edit | Text / watermark | Text overlay on canvas recording |
| Edit | Reverse video | Listed with explicit not-yet-supported message |
| Adjust | Color adjustments | Brightness, contrast, saturation preview and canvas output |
| Adjust | Speed changer | Browser playback rate; export runs in real time |
| Adjust | Audio track | Source playback mute and volume; current canvas-only export omits source audio |
| Adjust | Stabilization | Listed with explicit not-yet-supported message |
| Analyze | Metadata | File size, MIME type, duration, dimensions |
| Analyze | Frame extraction | Export current frame to PNG |
| Analyze | Thumbnail generator | Export selected frame to PNG |
| Analyze | Subtitle editor | Load SRT/VTT text and export a WebVTT sidecar |
| Analyze | Video comparison | Basic source/adjusted-preview workflow |
| Export & data | Converter | WebM canvas recording when MediaRecorder supports it; no universal MP4 guarantee |
| Export & data | Compressor | Output dimensions and frame-rate controls; actual size depends on content and codec |
| Export & data | Resolution / frame rate | Output canvas dimensions and recording frame rate |
| Export & data | Video to audio | Explains current codec limitation and points to Audio Editor for WAV |
| Export & data | Video to GIF | Explains need for a dedicated GIF encoder |
| Export & data | Metadata cleaner | Canvas re-recording creates a new container; do not claim every metadata field is removed |
| Export & data | Base64 | Encode local file to data URL and decode pasted Base64 bytes |
| Record | Video recorder | Canvas capture + MediaRecorder when supported |

The menu exposes the full proposal inventory, but operations that need muxing, reverse-frame buffering, stabilization, audio encoding, or GIF encoding must remain explicitly marked as unavailable until a dedicated engine is integrated. Do not imply that a feature works merely because it has a menu item.

## 3. Command bar and workspace

- Keep the existing site shell and navigation; do not add a second navigation rail.
- Use the same 68px command bar pattern as Audio Editor: mobile navigation trigger, File menu, desktop grouped menus, and mobile Features dropdown.
- File menu: open/replace video, export current feature, close/reset.
- Empty state: breadcrumb, title, concise description, centered dashed drop zone, Choose video button, supported-format note, and local-processing message.
- Loaded state: filename and media information; video preview; timeline with current time and start/end inputs; contextual inspector containing only the selected feature's controls.
- Export state: report errors and status accessibly; keep the tab active for real-time canvas recording; stop recording cleanly when requested.
- Preserve the source file and feature state while switching menus. Replacing a file must revoke the old object URL.

## 4. Responsive breakpoint contract

Reuse the established Tailwind breakpoints from `specification/design.md`; do not introduce a separate breakpoint system.

| Breakpoint | Required behavior |
|---|---|
| XS <640px | Compact sticky command bar; File and Features menus; single-column preview/timeline/inspector; no horizontal page scrolling |
| SM 640–767px | Same mobile command bar; centered bounded empty state; single-column editing |
| MD 768–1023px | Keep mobile site navigation; single-column workbench unless a split is demonstrably usable |
| LG 1024–1279px | Desktop grouped feature menus; use inspector beside preview only when sufficient workspace width remains |
| XL 1280–1535px | Preview/timeline plus fixed-width 320px inspector |
| 2XL ≥1536px | Center the workspace in a max-width container; inspector stays bounded at 360px |

Menu popovers and inspector content must scroll internally and stay within the dynamic viewport. Avoid horizontal scrolling, persistent bottom navigation, and oversized full-width controls on desktop. Preserve visible focus, Escape dismissal, keyboard-accessible file selection, and live status/error announcements.

## 5. Processing strategy

The initial implementation deliberately uses browser-native `HTMLVideoElement`, `Canvas`, `captureStream()`, and `MediaRecorder`. It avoids a new server upload pipeline and does not add a large FFmpeg WebAssembly bundle to the initial page. Native browser support is not a guarantee of codec availability.

The initial recorder re-renders frames in real time and exports WebM when the browser supports a compatible recorder. It currently omits source audio from canvas export. For reliable merging, MP4 encoding, GIF generation, audio muxing, reverse playback/export, and stabilization, evaluate a lazy-loaded FFmpeg.wasm or WebCodecs pipeline in a later phase. Keep heavy processing off the main thread and test real outputs across Chromium, Firefox, and Safari.

## 6. Acceptance checks

- One Video Editor registry entry under the Video category.
- `/video/editor` is the canonical unified route; legacy feature slugs redirect to it with the feature selected.
- Empty and loaded states follow existing editor spacing and breakpoint behavior.
- File menu and grouped desktop/mobile feature menus expose the same inventory.
- Unsupported operations explain their limitation rather than claiming success.
- Local file validation, unsupported codec errors, object URL cleanup, and reset work.
- Tests cover the registry invariant and route/editor smoke behavior; verify exported media playback in browser tests before treating codec workflows as production-complete.
