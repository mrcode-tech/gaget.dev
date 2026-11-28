# M03 — Responsive Design Guidelines

## Purpose

Define responsive visual/behavior conventions for both the builder and its website samples. The builder's responsive behavior is distinct from the responsive website being composed.

## System A — Builder

- The main workspace follows M02's left library/navigation, center canvases, and right contextual properties arrangement.
- Desktop, tablet, and mobile website canvases remain visible simultaneously and side by side.
- If workspace width is insufficient, preserve this arrangement using horizontal scrolling or workspace zoom; do not silently switch to a single-device tab.
- Panels may collapse or resize to preserve canvas space.
- Small-screen builder use is simplified review and essential editing, not the mobile website canvas.
- Essential controls remain usable with keyboard, pointer, and touch where supported.

## System B — Website samples

Every sample defines intentional desktop, tablet, and mobile presentations. Design around content hierarchy and visitor intent, not merely shrinking desktop. Review navigation, primary actions, heading/body hierarchy, image crop/ratio, grid/list density, section spacing/order, calls to action, touch targets, long text, missing content, and overflow.

## Shared and breakpoint-specific behavior

Preserve M02:
- Component identity, selected sample, shared content, and shared sample configuration synchronize across canvases.
- Desktop is the structural source for adding, removing, and replacing high-level components.
- Tablet/mobile cannot independently add, remove, or replace high-level components.
- Tablet/mobile can independently reorder existing components, hide/show them, and adjust supported responsive presentation.
- Hiding affects only the selected breakpoint and never deletes the shared component or affects another breakpoint.
- Arbitrary internal layout editing and CSS controls are not exposed.

## Responsive quality review

Review intended desktop, tablet, and mobile viewport classes, plus intermediate widths where transitions occur. Include realistic long/short content and missing optional content. Check readability, hierarchy, navigation, interaction, clipping, overflow, and image behavior. Exact breakpoint values are implementation decisions; this baseline does not prescribe arbitrary pixel thresholds.
