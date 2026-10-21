# Current-State Product Baseline

**Baseline branch:** `feature/design-system-token-handoff`  
**Baseline commit inspected:** `450e3849b49dd8c6e2920305420eba594b245649`  
**Audit method:** GitHub source/configuration/specification inspection at `feature/design-system-token-handoff`. This is a source-level baseline, not a claim that the working tree was clean, commands ran, or browser behavior was verified. The connected repository API does not expose the local working-tree state or provide a project runtime in this audit.

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
- [ ] Inspect representative mobile, short-height mobile, tablet and desktop widths.
- [ ] Capture and inspect light and dark themes, including Persian and Arabic RTL routes where applicable.
- [ ] Capture empty-file and loaded-file states for image, audio and video, plus representative feature-active panels.
- [ ] Record browser/version, route, viewport, theme, state and commit in the artifact manifest.
- [ ] Review screenshots for clipping, unexplained gaps, panel anchoring, scroll ownership and header/sidebar overlap.

Generated screenshots are the visual evidence for a specific build. This Markdown file records code-derived facts and audit status; update it when a durable current-state fact changes.


## Project-wide reconciliation findings (source audit, 2026-10-21)

**Status: Partial / not yet verified.** The following are findings from repository files, not claims of successful runtime tests or completed visual inspection.

### Confirmed foundation and verification setup

- `AGENTS.md` delegates to `specification/AI_INSTRUCTIONS.md`; `command.md` correctly remains a shortcut index rather than a competing workflow.
- The package scripts define unit, component, lint, typecheck, build, Playwright E2E and design-baseline capture commands.
- `.github/workflows/ci.yml` is configured to run on pushes and pull requests across branches, cancels superseded runs for the same branch, and includes unit/component tests, lint, typecheck, build, route smoke tests, Playwright checks and the expanded design-baseline capture. The timeout is 30 minutes to allow for the larger capture matrix.
- `tests/smoke.test.mjs` now explicitly includes the video workspace, UUID generator and date/time editor, plus twelve Persian/Arabic route checks that assert the server-rendered document declares RTL direction. The assertions are source-reviewed and syntax-checked, but have not yet been executed against a running app in this session.
- `.github/workflows/design-baseline-screenshots.yml` and the main CI workflow invoke `scripts/capture-design-baseline.mjs`. The updated capture matrix defines 11 English routes at 390×844, 390×640, 768×1024 and 1440×1000 in light and dark themes (88 captures), plus six key routes in Persian (`/fa`) and Arabic (`/ar`) at mobile and desktop heights in both themes (48 more; 136 expected captures total).
- The capture script records commit, route, locale, direction, viewport, theme and screenshot path in its manifest. This is a source-level expectation only until the updated workflow runs successfully and the artifact is inspected.
- The capture matrix still captures default/empty initial states only. Loaded media, feature-active panels, explicit error/disabled states, keyboard/focus behavior, reduced motion and visual comparison against authored target designs remain unverified by this screenshot job unless separate tests cover them.
- The README reports that `package-lock.json` is stale and that `npm ci` fails due to missing declared dependency entries; CI currently uses `npm install`. This reported issue has not been reproduced in this audit.
- The combined commit-status endpoint returned no status records for the previously inspected baseline commit and for workflow/configuration commit `0176aebba3d739a84e906f0490b26b91f3622d62` and smoke-test change commit `93de47285807e02aa377802217526b93e435efad`. The available workflow-run lookup is limited to pull-request-triggered runs and returned none. These connector results do not establish that the push-triggered workflows completed; CI and screenshot evidence remain unverified.

### Source-level route and capability inventory

- Discovery routes: `/`, `/tools`, and `/categories/[slug]`.
- Unified workspaces: `/images/editor`, `/audio/editor`, `/video/editor`, and `/datetime/editor`, with legacy feature paths and redirects described in the product inventory.
- Standalone tools listed in the current inventory: `/json/formatter`, `/encoding/url`, `/encoding/base64`, `/security/jwt-decoder`, and `/generators/uuid`.
- The registry also declares planned tool destinations. Registry declarations are not proof of route existence or functional capability; every planned/available status still requires comparison with the actual route tree and feature implementation.
- The source registry descriptions advertise broad media capabilities. The product inventory correctly cautions that some browser-native video operations may be preview-only, unsupported or codec-dependent. These claims require per-feature source/test review and browser verification before the catalog can be considered capability-accurate.
- `app/globals.css` defines semantic light/dark theme variables and a small set of component classes, while the product uses Tailwind utility values directly. Tokenization remains partial.
- `components/app-shell.tsx` has route-specific full-viewport editor behavior and sidebar offsets; media and date/time editors do not share identical header visibility rules. Consumer-level layout and scroll behavior must be audited individually rather than assumed equivalent.

### Specification and target-design gaps

- The canonical index and AI instructions define the expected documentation structure, but the source inventory alone does not prove that every workspace has a complete feature contract.
- `specification/assets/target/README.md` explicitly says no new target designs are approved at the initial baseline milestone. The baseline must not be described as having approved target wireframes unless the corresponding authored assets and approval state are found.
- The current-state visual checklist remains open. The screenshot capture script can produce current-state evidence, but screenshots are not target designs and the capture script does not itself compare screenshots with approved wireframes.
- The baseline commit must be kept distinct from the live branch tip as work proceeds. This audit records the inspected source revision above; after any further changes, update the baseline to the resulting commit only when that commit is known and its checks are reported separately.

### Required follow-up before declaring conformance

1. Enumerate the actual App Router filesystem and redirect routes, then reconcile every entry against `lib/tools/registry.ts`, the feature slugs in each workspace, the sitemap and smoke/E2E tests.
2. Inspect every route and shared component implementation, its consumers, and existing tests; establish a route/component coverage matrix with evidence and status.
3. Locate or author canonical feature contracts and editable target SVG wireframes where expected behavior is missing. Mark new designs as proposals until approved.
4. Reproduce the reported dependency-install issue and establish a true baseline run for unit/component tests, lint, typecheck, build, smoke and Playwright checks.
5. Run the application and inspect screenshots from the exact evaluated commit, including loaded/empty/error/active states, short viewports, themes, RTL, keyboard/focus, menu anchoring and scroll ownership.
6. Refactor in staged groups only after target contracts are sufficiently clear; add regression tests and update affected inventories/contracts after each stage.

No implementation or browser check is marked complete by this source audit alone.
