# Quality, Accessibility & Verification

## 1. Quality model

A feature is ready only when the relevant functional, visual, interaction, accessibility, privacy and resilience requirements have been checked. A passing unit test is necessary evidence for tested logic, not proof of visual quality or complete browser compatibility.

## 2. Responsive contract

Use Tailwind's current breakpoint ranges as documented by the application:

| Range | Contract |
|---|---|
| XS <640px | Compact navigation; one-column content; mobile editor command bar and resizable feature sheet where applicable. |
| SM 640–767px | Same compact navigation/editor model with comfortable gutters. |
| MD 768–1023px | Mobile/tablet site drawer remains in use; avoid forcing a narrow desktop inspector. |
| LG 1024–1279px | Persistent collapsible sidebar and desktop editor menus; inspector only when workspace width allows. |
| XL 1280–1535px | Full desktop layout with bounded work area and inspector. |
| 2XL ≥1536px | Keep content, cards, text and panels bounded rather than stretching to the viewport edge. |

These ranges are design contracts. Verify them in the actual CSS and browser; do not assume every current component follows the contract perfectly.

Also test short viewport height, mobile browser dynamic viewport changes, browser zoom, long localized strings, large text, RTL, and the collapsed/expanded sidebar.

## 3. Navigation and layout checks

- [ ] Sidebar offsets and content never overlap.
- [ ] Collapsed navigation retains accessible labels.
- [ ] Mobile drawer opens from the shared trigger, overlays rather than pushes the page, and closes by destination selection, close button, backdrop and Escape where implemented.
- [ ] Search suggestions have sensible keyboard behavior, result labels and dismissal.
- [ ] Header, command bar, File menu and Features menu have consistent anchoring and stacking.
- [ ] Menus/sheets remain inside the viewport and scroll independently when needed.
- [ ] Scroll ownership is intentional: the full empty workspace (title, description and upload target) can scroll where required; loaded workspaces preserve the editing canvas/timeline.
- [ ] Feature panel placement does not create unexplained gaps, overlap or clipping.
- [ ] RTL layout reverses direction-aware placement without reversing media timelines or numeric data inappropriately.

## 4. File and media workflow checks

- [ ] Empty state offers a clear supported-file action and an accurate local-processing statement.
- [ ] Drag/drop and file picker do not produce nested interactive controls.
- [ ] Unsupported format, oversize input, decode failure and browser API failure produce actionable messages.
- [ ] Loading a replacement file releases old object URLs, listeners, streams and media resources.
- [ ] Empty-to-loaded transition is intentional; unrelated state is not lost.
- [ ] Export is disabled until a valid output exists and reflects the actual output format.
- [ ] Preview-only operations are not represented as completed exports.
- [ ] Progress, completion and errors are announced accessibly.
- [ ] Permission requests (microphone/camera) happen only after a user action.
- [ ] Test memory limits and browser-dependent codec support for media features.

## 5. Accessibility checks

- Keyboard-only navigation through shell, search, menus, inputs, feature panels, date/calendar controls and export actions.
- Visible `:focus-visible` indicator in light and dark themes.
- Correct labels, accessible names, roles, expanded/selected/disabled state, and meaningful live status where needed.
- Dialogs/sheets/popovers have appropriate dismissal and focus behavior.
- Do not rely on color alone to indicate error, success, selection or availability.
- Contrast review for body text, muted text, borders, controls and focus ring.
- Touch controls generally target 40–44 CSS px where practical.
- Honor `prefers-reduced-motion`; content and state remain understandable without animation.
- Validate screen-reader reading order and RTL direction for Persian/Arabic.
- Date/time controls communicate invalid values and unsupported calendar/locale combinations.
- JWT disclosure states that decoding does not verify signatures.

The repository declares `@axe-core/playwright`; use it in browser checks when the test harness supports it, and manually review issues it cannot judge.

## 6. Design Engineering visual audit

For each changed route, inspect:
- Hierarchy: is the primary task obvious and is supporting content subordinate?
- Geometry: consistent alignment, spacing rhythm, widths, heights and control density?
- Surfaces: are borders, cards and separators useful rather than redundant?
- States: default, hover, active, focus, disabled, loading, error, success and selected?
- Anchoring: do popovers and panels appear at the expected origin and stay in the viewport?
- Scrolling: is the intended region scrollable, without double-scroll traps or inaccessible content?
- Motion: purposeful, quick, no unnecessary delays, reduced-motion respected?
- Consistency: same shared component produces the same layout behavior across Photo, Audio, Video and Date & Time, except for documented exceptions?
- Content: labels concise and truthful; no unsupported claims?
- Themes/locales: light/dark, LTR/RTL, long labels, numerals and fallback fonts?

Visual screenshots may be used temporarily as evidence in PRs or CI artifacts, but this specification directory intentionally stores Markdown only.

## 7. Automated checks

Repository scripts currently include:

```bash
npm run test:unit
npm run test:component
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Run the most relevant checks first, then the full set when practical. The root README notes a stale `package-lock.json` and that `npm ci` has been unreliable; do not report an install/test suite as clean unless the commands actually complete. Existing tests cover shell/sidebar, media workbenches, date/time controls, catalog, favorites, smoke tests, and selected end-to-end flows. Test coverage is not exhaustive.

For responsive/media work, include the relevant Playwright tests and manually inspect at least one viewport from each affected range. A test that only asserts the presence of a component is not visual QA.

## 8. Release report format

Every implementation handoff must report:
1. What changed and why.
2. Relevant routes/components and affected behavior.
3. Tests/commands actually run, with pass/fail and useful error summaries.
4. Viewports, browser and themes inspected.
5. Accessibility/privacy/capability limitations.
6. Remaining risks or follow-up work.

Never mark a check as passed if it was not run. If visual inspection or a browser/codec combination could not be tested, state that limitation explicitly.
