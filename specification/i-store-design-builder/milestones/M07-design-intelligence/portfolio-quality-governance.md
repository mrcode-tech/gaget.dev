# Portfolio Quality Governance

## Purpose

Define how official component samples are authored, reviewed, approved, published, maintained, and retired.

## Ownership

The product/design team authors and maintains the official catalogue. User projects may reference official samples but do not modify catalogue definitions. User-authored arbitrary component templates are outside the MVP.

## Sample lifecycle

1. **Draft** — being designed; not available for user selection.
2. **Review** — submitted for design, responsive, accessibility, content-contract, and renderer review.
3. **Published** — approved and available for new selections.
4. **Deprecated** — no longer preferred for new work; existing instances remain supported.
5. **Retired** — unavailable for new insertion; existing references remain resolvable according to version-retention policy.

Lifecycle state changes must not silently modify project instances.

## Quality checklist

### Purpose and design intent
- [ ] Clear functional purpose and component type.
- [ ] Intended audience/context and design rationale documented.
- [ ] Meaningful visual distinction from other samples of the same type.
- [ ] Typography, color, hierarchy, spacing, alignment, and composition are deliberate.
- [ ] Design works with realistic and incomplete content.

### Content and configuration contract
- [ ] Stable ID and version assigned.
- [ ] Supported fields, defaults, constraints, required/optional/repeatable semantics documented.
- [ ] Finite options are understandable and valid.
- [ ] Placeholder purpose and missing-content behavior defined.
- [ ] Replacement compatibility behavior documented.

### Responsive quality
- [ ] Desktop, tablet, and mobile presentations are intentional.
- [ ] Content hierarchy and primary actions remain usable.
- [ ] Long text and missing optional content are handled.
- [ ] No unresolved clipping, overlap, or unintended overflow.

### Accessibility and interaction
- [ ] Semantic structure and appropriate roles.
- [ ] Accessible names and labels for interactive elements.
- [ ] Keyboard operation and visible focus.
- [ ] Contrast and non-color state communication.
- [ ] Touch targets and reduced-motion considerations where relevant.

### Technical and preview integrity
- [ ] Renderer contract and sample metadata are valid.
- [ ] Isolated and contextual previews render representative synthetic content.
- [ ] Sample does not mutate catalogue or project state during preview.
- [ ] Version and lifecycle metadata are consistent.
- [ ] Known limitations are documented.

## Review process

A release candidate must be reviewed against the checklist. Findings are resolved or explicitly documented before publication. Record sample ID/version, reviewers or responsible team role, viewport coverage, accessibility findings, known limitations, and approval disposition.

The checklist is a publication quality gate, not a numerical score. Do not expose a user-facing aesthetic score, ranking, badge, or reward.

## Portfolio-level governance

Review the catalogue periodically for:
- Missing major component types.
- Insufficient meaningful alternatives within priority types.
- Overlapping or confusing taxonomy.
- Gaps in visual-style and website-purpose coverage.
- Inconsistent content-slot conventions.
- Samples that no longer meet responsive/accessibility expectations.

Use identified gaps to prioritize future sample authoring. Do not optimize for sample quantity alone.

## Acceptance criteria

- [ ] Official authorship and lifecycle roles are defined.
- [ ] Every published sample passes the quality checklist.
- [ ] Review evidence is recorded by sample version.
- [ ] Publication and retirement do not mutate existing instances.
- [ ] Catalogue review supports deliberate progressive expansion.
- [ ] No subjective user scoring or reward mechanics are introduced.
