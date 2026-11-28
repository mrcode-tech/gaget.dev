# M11 — Testing Strategy

## Unit

Test breakpoint resolution, inherited/default values, override precedence, reset behavior, capability validation, per-breakpoint ordering, visibility, and invariant enforcement.

## Component

Test canvas labels, device presets, inherited/overridden indicators, responsive option controls, reorder alternatives, visibility toggles, and finding navigation.

## Integration

Test shared content synchronization, stable instance identity, desktop membership ownership, independent tablet/mobile order, local visibility, M09 token rendering, M10 section behavior, and M12 page compatibility.

## Visual/responsive

Test canonical widths 1440/768/390 and intermediate widths. Include long content, empty placeholders, large images, navigation variants, multi-column sections, and typography scaling. Check overflow, clipping, overlap, and content order.

## Accessibility

Keyboard-only reordering, focus management, accessible names, screen-reader announcements, hidden content semantics, text scaling, and contrast of responsive controls.

## Negative

Reject arbitrary CSS/number values, unknown capabilities, unsupported breakpoints, membership changes from tablet/mobile, and cross-breakpoint accidental state mutation.

Use synthetic sample versions and deterministic fixtures. Record evidence when implementation occurs.
