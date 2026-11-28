# M11 — Responsive Design and Device Adaptation

**Status: Prepared baseline — ready for consolidated user review.** Specification only; no implementation or test completion is claimed.

## Purpose

Make responsive website behavior understandable and user-directed through three simultaneous previews and curated, finite presentation controls rather than CSS breakpoints or pixel editing.

## Approved decisions

| ID | Decision |
|---|---|
| M11-01 | Keep desktop, tablet, and mobile canvases visible simultaneously. |
| M11-02 | Desktop remains the structural source for shared component membership. |
| M11-03 | Tablet/mobile independently control order, visibility, and supported presentation only. |
| M11-04 | Shared content and sample configuration synchronize across all canvases. |
| M11-05 | Responsive settings use shared defaults plus explicit bounded overrides. |
| M11-06 | Each sample declares supported responsive capabilities and defaults. |
| M11-07 | Provide understandable curated patterns for stacking, navigation, media, typography, spacing, and alignment. |
| M11-08 | No arbitrary breakpoint editor, CSS media-query editor, or pixel geometry controls. |
| M11-09 | Preview widths are named representative test presets, not required CSS breakpoint values. |
| M11-10 | Responsive validation reports issues; it never silently rearranges the website. |
| M11-11 | M09 identity and M10 homepage samples retain their own compatibility contracts. |
| M11-12 | Runtime remains in-memory; no persistence or recovery. |

## Device preview presets

Use representative preview widths for predictable review:
- Desktop: 1440 CSS pixels.
- Tablet: 768 CSS pixels.
- Mobile: 390 CSS pixels.

These are preview/test presets only. They do not mandate implementation breakpoint thresholds. The canvases represent three named device classes and remain side by side; narrow workspaces use horizontal scrolling or zoom.

## Scope

- Responsive preview and canvas behavior.
- Shared defaults and bounded overrides.
- Component order and visibility by breakpoint.
- Sample-declared adaptation options.
- Navigation, stacking, image, typography, and spacing patterns.
- Overflow and responsive consistency findings.
- Accessibility and interaction requirements.

## Exclusions

Arbitrary breakpoints, CSS editing, exact pixel positioning, nested element manipulation, independent tablet/mobile membership, and automatic responsive redesign are excluded.

## Documents

- [Objectives and scope](objectives-and-scope.md)
- [Feature specification](feature-specification.md)
- [User stories](user-stories.md)
- [Interaction specification](interaction-specification.md)
- [Technical design](technical-design.md)
- [Data contracts](data-contracts.md)
- [Acceptance criteria](acceptance-criteria.md)
- [Testing strategy](testing-strategy.md)
- [Implementation tasks](implementation-tasks.md)

## Dependencies

M01/M02/M06 responsive invariants are authoritative. M07 defines sample capabilities; M09 defines identity tokens; M10 supplies homepage samples; M12/M13 extend responsive checks to multi-page and real content.

## Completion criteria

- [x] Three-canvas model and edit permissions specified.
- [x] Shared and breakpoint-specific state defined.
- [x] Supported responsive control families and validation specified.
- [x] Data, accessibility, acceptance, and test requirements documented.
- [ ] Implementation and verification — future work.
