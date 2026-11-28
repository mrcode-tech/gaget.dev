# M03 — Design Quality Checklist

Use this checklist for design reviews and sample acceptance. It is a practical quality gate, not a numerical score or ranking system.

## Builder interface — System A

### Identity and hierarchy
- [ ] Professional, distinctive, creatively purposeful identity.
- [ ] Avoids generic GPT/AI-dashboard styling.
- [ ] Website canvas and sample previews remain the visual focus.
- [ ] Typography, spacing, alignment, density, and contrast are deliberate.
- [ ] Decoration, borders, shadows, and gradients have a clear purpose.

### Interaction and usability
- [ ] Navigation and workspace regions are understandable.
- [ ] Sample preview, selection, and insertion are distinct.
- [ ] Selected, hover, focus, disabled, loading, success, and error states are clear.
- [ ] Shared and breakpoint-specific edits are distinguishable.
- [ ] Destructive actions have suitable confirmation/recovery.
- [ ] Keyboard alternatives exist for drag/drop and all essential actions.

### Themes and accessibility
- [ ] Light and dark themes reviewed.
- [ ] Text and controls have sufficient contrast.
- [ ] Focus indicators are visible; state is not communicated by color alone.
- [ ] Labels and accessible names are present.
- [ ] Reduced-motion preferences are respected.

## Website component portfolio — System B

### Design intent
- [ ] Clear purpose, audience, and use context.
- [ ] Intentional visual identity, meaningfully distinct where appropriate.
- [ ] Typography, color, hierarchy, spacing, and composition support content.
- [ ] Works with realistic and incomplete content.
- [ ] Does not depend on final photography or a particular user asset.

### Sample contract
- [ ] Stable ID, component type, and catalogue metadata.
- [ ] Supported content slots and finite options documented.
- [ ] Required, optional, and repeatable fields clear.
- [ ] Image/file placeholders have meaningful purpose.
- [ ] Isolated and contextual previews available.
- [ ] Compatible content behavior on sample replacement defined.

### Responsive and accessible behavior
- [ ] Intentional desktop, tablet, and mobile presentations.
- [ ] Content hierarchy/actions remain usable at each size.
- [ ] No clipping, overlap, or unintended overflow.
- [ ] Interactive elements have semantic roles, labels, and keyboard behavior.
- [ ] Contrast and focus remain usable.

## Product boundary
- [ ] Users edit only supported content and finite sample options.
- [ ] No arbitrary CSS or pixel-level editing exposed.
- [ ] Sample follows shared structure and breakpoint-specific order/visibility rules.
- [ ] No automatic sample selection or recommendation.

## Review evidence

For a release candidate, record sample/version, reviewed viewports, theme states, keyboard/accessibility findings, known limitations, and issue disposition. A checked specification is not proof of implementation verification.
