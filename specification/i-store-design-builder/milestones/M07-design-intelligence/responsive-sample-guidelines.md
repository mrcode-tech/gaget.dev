# Responsive Sample Guidelines

## Purpose

Define quality and authoring requirements for the responsive presentations of every official component sample.

## Three intentional presentations

Every published sample must define:
- Desktop presentation.
- Tablet presentation.
- Mobile presentation.

These are deliberate designs, not merely one desktop layout scaled proportionally. Each presentation must preserve the component's purpose and usable content hierarchy.

## Review dimensions

Review each sample for:

- Navigation structure and access to important actions.
- Heading/body hierarchy and readable line lengths.
- Primary and secondary action visibility and placement.
- Image ratio, crop, order, and placeholder behavior.
- Grid/list density and item presentation.
- Section spacing and alignment.
- Long and short text behavior.
- Optional/missing content behavior.
- Touch-target usability and interactive controls.
- Clipping, overlap, and unintended horizontal overflow.

## M06 composition rules remain authoritative

M07 responsive sample design must not change the approved composition model:

- One shared component collection is rendered in three responsive layouts.
- Desktop owns shared membership and structural add/remove/replace/duplicate operations.
- Tablet and mobile cannot independently add, remove, or replace high-level components.
- Tablet and mobile can independently reorder existing instances and hide/show them.
- Shared content and sample configuration synchronize across all canvases.
- Only explicitly declared responsive presentation options may vary by breakpoint.
- Hiding is breakpoint-specific and never deletes an instance or changes another breakpoint.
- Arbitrary internal layout editing and CSS controls are not exposed.

## Responsive preview and quality evidence

Review representative viewport classes for desktop, tablet, and mobile, plus intermediate widths where layout transitions occur. Use synthetic content with varied lengths and optional content absent. Record the sample version, reviewed viewports, findings, known limitations, and disposition as part of release review.

Exact pixel breakpoint values are implementation decisions and are not prescribed here.

## Acceptance criteria

- [ ] Every official sample defines all three presentations.
- [ ] Responsive differences are intentional and documented.
- [ ] Long, short, and missing optional content are considered.
- [ ] Navigation, hierarchy, actions, media, and touch interactions remain usable.
- [ ] No clipping, overlap, or unintended overflow remains unresolved.
- [ ] Sample behavior respects M06 shared membership and responsive layout invariants.
- [ ] Review evidence identifies sample version and viewport coverage.
