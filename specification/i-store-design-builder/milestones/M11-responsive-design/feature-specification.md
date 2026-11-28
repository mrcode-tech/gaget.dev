# M11 — Feature Specification

## 1. Three simultaneous canvases

Desktop, tablet, and mobile previews show the same page and component instances at representative widths. Each canvas identifies its simulated width and selected editing scope. Narrow builder viewports preserve side-by-side canvases through horizontal scrolling or workspace zoom; do not replace them with a single-device tab.

Representative test widths: desktop 1440px, tablet 768px, mobile 390px. These are preview fixtures, not CSS breakpoint definitions.

## 2. Shared and local state

Shared across all canvases:
- Project/page identity.
- Component membership and stable instance identity.
- Selected sample ID/version.
- Content and shared sample configuration.
- Active M09 identity.

Independent by breakpoint:
- Component order.
- Component visibility.
- Supported sample-declared responsive presentation overrides.

Desktop is the source for shared membership. Tablet/mobile cannot add, remove, replace, or duplicate high-level components. M06 commands remain authoritative.

## 3. Inheritance model

Every responsive capability has:
- A sample-authored default.
- Optional breakpoint-specific override where supported.
- An explicit indication of whether the current value is inherited or overridden.

Resetting an override returns to the sample default. Overrides must not be copied to unrelated samples during replacement unless M06's compatible-field rules explicitly support it.

## 4. Supported responsive patterns

Samples may expose finite options such as:
- Stack or retain a supported multi-column arrangement.
- Navigation collapse pattern (for example, menu button versus compact inline links).
- Image behavior (preserve ratio, crop to authored focal area, or use a sample-defined alternate presentation).
- Typography scale preset.
- Spacing density preset.
- Alignment preset.
- Content order where the sample explicitly supports it.

The exact options belong to each sample contract. The builder does not expose arbitrary values or promise that every sample supports every pattern.

## 5. Order and visibility

Tablet/mobile order is independent from desktop and from each other. Hiding a component is breakpoint-local and does not remove content. Provide equivalent accessible move controls for drag-and-drop.

## 6. Responsive preview

Changes update the relevant canvas immediately. Shared changes update all three. A breakpoint override updates only the selected canvas. Preview operations do not change other breakpoint state.

## 7. Validation

Check:
- Horizontal overflow and clipping.
- Overlapping or obscured content.
- Unreadable or excessively constrained text in representative content.
- Missing/invalid image presentation.
- Navigation controls that are unavailable or unusable at a viewport.
- Inconsistent hidden/visible states that conflict with explicit required behavior.
- Unsupported override values.

Findings identify viewport, page, component, and field. They link to correction controls and never silently reorder, hide, resize, or rewrite content.

## 8. Accessibility

Responsive controls are keyboard-operable and labeled in plain language. Reordering has a non-drag alternative. Focus order follows rendered visual/semantic order as applicable. Hidden content is removed from the relevant breakpoint's interactive presentation without deleting shared data.
