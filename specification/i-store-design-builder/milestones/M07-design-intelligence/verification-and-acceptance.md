# Verification and Acceptance

## Purpose

Define evidence required to consider the M07 specification and future catalogue implementation complete.

## Specification acceptance

- [ ] Taxonomy categories and component types are documented.
- [ ] Component category, type, sample, and instance are clearly distinguished.
- [ ] Controlled visual-style and optional website-purpose classifications are defined.
- [ ] Catalogue browse, filter, search, and availability behavior is specified.
- [ ] Sample cards, enlarged previews, contextual previews, and comparison are specified.
- [ ] Sample metadata, content slots, finite options, and responsive contract are specified.
- [ ] Synthetic preview-content rules are specified.
- [ ] Guidance is plain-language, neutral, and non-prescriptive.
- [ ] Quality governance and publication lifecycle are defined.
- [ ] Version preservation and retirement behavior align with M04/M06.
- [ ] Initial portfolio priorities and progressive expansion are defined.
- [ ] No M00–M06 product guardrail is contradicted.

## Catalogue data verification

When implemented, use synthetic fixtures to verify:
- Every published sample has a stable ID, version, and valid component type.
- Taxonomy references resolve and classification dimensions remain distinct.
- Content schemas and finite options validate.
- Required/optional/repeatable slot definitions are coherent.
- Preview metadata and renderer references resolve.
- Lifecycle status and version references are valid.
- No project-specific content is stored in catalogue definitions.

## Discovery and preview verification

Verify:
- Category → type → sample navigation.
- Combinable style/purpose filters and keyword search.
- Accurate sample counts and availability states.
- Empty, no-match, loading, unavailable, and error states.
- Gallery card and enlarged preview clarity.
- Candidate comparison communicates meaningful distinctions.
- Preview uses synthetic content and does not mutate project composition.
- Choosing a sample continues through M06 confirmation and insertion-position behavior.

## Sample quality verification

For each published sample, verify:
- Meaningful design distinction.
- Content adaptability and graceful missing-content behavior.
- Desktop, tablet, and mobile presentations.
- Accessibility semantics, keyboard behavior, focus, and contrast.
- Placeholder purpose and optional asset behavior.
- Isolated/contextual rendering and documented limitations.
- Evidence is associated with the exact sample version reviewed.

## Version and lifecycle verification

Verify:
- Existing instances retain their referenced sample version after catalogue updates.
- New insertions use the current published version.
- Deprecated/retired samples remain resolvable for existing instances.
- Same-type replacement follows M06 preview, confirmation, compatibility, identity, and atomicity rules.
- No automatic migration or silent content loss occurs.

## Governance and product-boundary verification

Verify:
- Official samples are authored and approved by the product/design team.
- Publication requires the documented quality review.
- The library remains accessible at every journey level.
- No AI recommendation, automatic selection, ranking, insertion, or ordering appears.
- No arbitrary CSS, geometry, or detailed internal editing is exposed.
- No user-facing aesthetic score, reward, or leaderboard is introduced.

## Implementation verification ownership

M07 defines the catalogue behavior and quality requirements. Actual unit, component, integration, end-to-end, accessibility, responsive, lint, typecheck, and build verification belongs to the implementation milestone/work plan. Record actual evidence; do not mark implementation complete merely because the specification is approved.

## Definition of done

- [x] M07 product decisions approved.
- [x] M07 specification baseline documented.
- [ ] Catalogue and application implementation complete — future work.
- [ ] Required automated and manual verification passes with evidence — future work.
- [ ] Known limitations and follow-up work recorded after implementation.
