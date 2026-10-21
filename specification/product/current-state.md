# Current-State Product Baseline

**Baseline branch:** `feature/design-system-token-handoff`  
**Baseline commit at initial audit:** `3b76f3127369f2d0979ff997b1bea450b4a4c1a7`  
**Audit method:** Source and route inspection. Browser screenshots are generated separately by the design-baseline workflow; this document does not claim a completed visual browser audit.

## What exists today

### Application shell
- Next.js App Router with shared `AppShell`, `AppHeader`, and `AppSidebar`.
- Desktop sidebar expands to 248px and collapses to 64px at the large-screen breakpoint; the shell offsets content according to sidebar state and text direction.
- Header height is 68px. The shell hides the standard header on media editor routes at smaller sizes and provides editor-specific spacing/controls.
- Mobile/tablet navigation uses a drawer opened through a shared custom event.
- Theme toggle and language switcher are shared controls. Persian and Arabic are RTL; locale translation completeness varies.

### Home and discovery
- `/` is the home/discovery experience.
- `/tools` is the tool catalog.
- `/categories/[slug]` is a category landing page.
- Tool registry metadata drives search, categories, featured/favorite experiences and tool links. Registry entries are not proof of a working destination or complete capability.

### Main workspaces
- `/images/editor`: unified image/photo workspace. Legacy image slugs redirect to the editor. Source includes canvas-based image adjustments, crop/resize, transforms, text layers, and format/quality export controls; capability claims must be checked against each active path.
- `/audio/editor`: unified audio workspace with feature selection, file workflow and browser-native audio operations. Export and metadata behavior vary by feature.
- `/video/editor`: unified video workspace based on browser media, canvas and MediaRecorder capabilities. Codec/export support is browser-dependent; some features are preview-only or experimental.
- `/datetime/editor`: unified date/time workspace with date, time, calendar and utility features. Locale/calendar behavior depends partly on browser internationalization data.

### Standalone tools
- `/json/formatter`
- `/encoding/url`
- `/encoding/base64`
- `/security/jwt-decoder` — decodes JWT contents but does not verify signatures.
- `/generators/uuid`

Additional registry entries may be planned or redirect to unified editors. Verify route existence and behavior before describing them as independent implemented pages.

## Current implementation-level design facts

- Semantic theme CSS variables are defined in `app/globals.css` using HSL channels, with light and dark values.
- Shared primitives exist under `components/ui/`; application styling also uses Tailwind utilities directly, so design tokenization is partial.
- Media and date/time editor routes use a full-viewport shell, with specialized command bars and feature controls. Do not assume their internal panels or scroll ownership are identical without inspecting the route.
- Shared shell and workbench components have automated tests, including selected Playwright end-to-end tests. Existing coverage is not complete visual regression coverage.
- Browser-native media processing is constrained by codec availability, file size, memory and browser APIs. Documentation must distinguish actual export from preview, sidecar output and unavailable processing.

## Visual audit status

The following are required before this document can be considered a fully verified visual baseline:
- [ ] Capture home, catalog, standalone tools and each main workspace from the exact audited commit.
- [ ] Inspect representative mobile, tablet and desktop widths.
- [ ] Capture light and dark themes, and RTL where applicable.
- [ ] Capture empty-file and loaded-file states for image, audio and video, plus representative feature-active panels.
- [ ] Record browser/version, route, viewport, theme, state and commit in the artifact manifest.
- [ ] Review screenshots for clipping, unexplained gaps, panel anchoring, scroll ownership and header/sidebar overlap.

Generated screenshots are the visual evidence for a specific build. This Markdown file records code-derived facts and audit status; update it when a durable current-state fact changes.
