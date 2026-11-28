# M03 — Design Tokens

## Ownership

This document defines the token architecture for System A, the builder interface. The existing repository is authoritative. Exact numeric and color values should be selected and validated during design exploration/implementation rather than invented in this baseline.

System B samples may use independent visual tokens/styles while complying with shared technical, semantic, content-slot, and responsive contracts.

## Token categories

### Color
Define semantic tokens for workspace backgrounds and elevated surfaces; primary, secondary, and muted text; subtle/default/strong borders; brand accent and interactive states; focus; success, warning, danger, and information; overlays and disabled states. Map each semantic role to light and dark values. Verify contrast for text, icons, controls, and focus indicators.

### Typography
Define font family/fallback, size, line height, weight, and letter-spacing roles for workspace titles, section/panel headings, sample titles, body/explanatory text, control labels/values, helper text, metadata, and compact canvas annotations. Validate at actual UI sizes.

### Spacing and sizing
Define a coherent spacing scale and semantic values for workspace gutters, panel padding/gaps, control heights/hit areas, gallery gaps/preview padding, canvas gutters/device-preview spacing, overlays, and panel constraints. Prefer consistent relationships over arbitrary one-off values.

### Shape, elevation, and motion
Define restrained radius, border, divider, and elevation roles. Do not apply a card radius or shadow to every surface. Define short duration/easing roles for feedback, panel movement, and preview changes; support reduced motion.

### Iconography
Use a consistent icon family, stroke/weight approach, optical sizing, and alignment. Icons that are not universally understood need labels or accessible names. Do not use emoji as a substitute for core interface iconography.

## Implementation rules

- Tokens have semantic names and documented purpose.
- Components consume tokens rather than duplicating raw values.
- Light/dark themes share semantic names and map to theme-specific values.
- Token changes are reviewed across representative screens and both themes.
- Do not couple sample-specific System B styling to System A tokens unless an explicit shared contract requires it.
- Keep token definitions in the existing application repository; do not create a nested application or separate source of truth.

## Validation

Validate contrast, focus visibility, disabled/error/success states, text scaling, panel density, theme consistency, and long labels/content.
