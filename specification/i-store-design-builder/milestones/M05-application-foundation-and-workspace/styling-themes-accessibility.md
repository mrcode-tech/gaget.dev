# Styling, Themes and Accessibility

## Purpose

Specify the visual and accessibility foundation of the isolated builder workspace.

## Visual source of truth

M03 remains authoritative for the product visual design system. M05 applies its foundations; it does not redefine the visual identity or the website component portfolio.

Preserve the two distinct systems:
- **System A — Builder Interface:** navigation, panels, controls, catalogue, workspace, canvases, progress and guidance.
- **System B — Website Component Design Portfolio:** the independently designed samples users browse and preview.

## Styling isolation

- Keep builder styles within the builder module boundary.
- Avoid global selectors or changes that alter unrelated GaGet screens.
- Use module-scoped styles, scoped utility conventions, or another repository-compatible isolation technique.
- Reuse existing primitives selectively through a narrow boundary.
- Do not let GaGet-specific styling assumptions become requirements of the builder domain or sample renderers.
- Keep sample-specific visual styling isolated from builder chrome.

Exact implementation mechanism should follow the repository's existing stack while satisfying these isolation requirements.

## Theme

Support light and dark themes from the beginning.

Where practical, integrate with existing GaGet theme infrastructure through a narrow adapter or explicit theme boundary. The builder must retain control over its own token mapping and component appearance. Theme integration must not change global theme behavior or create hard dependencies on host-only state.

Theme behavior should be consistent across the workspace panels, catalogue, preview surfaces, empty states and canvas frames. Sample designs may define their own visual presentation, while remaining legible within the preview environment.

## Density and hierarchy

Follow M03:
- Compact navigation and controls.
- Generous canvas and preview space.
- Clear heading and control typography.
- Neutral foundation, restrained semantic colors and distinctive brand accent.
- Purposeful, subtle interaction feedback.
- Avoid generic dashboard styling and excessive borders, shadows, pills or decorative effects.

## Accessibility requirements

Implement and verify:
- Semantic landmarks and headings.
- Accessible names and descriptions for controls.
- Keyboard access to navigation, catalogue selection, preview opening and closing, and panel controls.
- Visible, predictable focus indication.
- Focus management when opening/closing preview dialogs or equivalent overlays.
- Correct dialog semantics and focus containment when a modal is used.
- Escape-key behavior where appropriate.
- Accessible labels for desktop/tablet/mobile canvas regions.
- Sufficient text and control contrast in both themes.
- No reliance on color alone to communicate selection, status or breakpoint.
- Respect for reduced-motion preferences.

## Acceptance checks

- Builder styles do not alter unrelated GaGet routes.
- Light and dark themes are usable across all M05 surfaces.
- Keyboard users can navigate the initial workspace and preview flow.
- Focus remains visible and is managed correctly for overlays.
- Canvas and panel controls have meaningful accessible names.
- Automated accessibility checks are included in the verification plan, supplemented by manual keyboard review.
