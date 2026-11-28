# M11 — Objectives and Scope

## Goals

- Help users understand how the same website adapts across desktop, tablet, and mobile.
- Preserve M01/M06 shared structure and independent responsive presentation.
- Provide sample-aware controls with finite options and visible inheritance.
- Support predictable, reversible user-directed responsive choices.
- Identify overflow, clipping, readability, and layout issues across representative widths.
- Ensure responsive behavior remains consistent with M09 identity and sample-specific design.

## Non-goals

- User-defined CSS breakpoints or media queries.
- Arbitrary numeric width/height, margins, padding, or coordinates.
- Independent component membership on tablet/mobile.
- Automatic layout redesign or automatic content rewriting.
- Browser/device emulation beyond the three named preview classes.
- A replacement for M07 sample responsive authoring or M13 content quality review.
- Persistence, autosave, history, or cloud services.

## Responsive principles

1. Desktop owns shared section membership and structural insertion/removal/replacement.
2. Tablet/mobile may independently reorder, hide/show, and adjust only sample-supported presentation.
3. Hiding never deletes an instance or affects another breakpoint.
4. Shared content/configuration is synchronized.
5. Responsive overrides are explicit and bounded.
6. A missing sample capability is not synthesized by the builder.
7. Preview is deterministic and does not mutate project state.
8. Responsive findings are advisory or structurally blocking only when a defined invariant is violated; they do not automatically repair the page.

## Initial scope

Responsive preview controls, shared/default state display, bounded override controls, responsive pattern catalogue, per-breakpoint ordering and visibility, sample capability resolution, validation findings, and responsive acceptance tests.
