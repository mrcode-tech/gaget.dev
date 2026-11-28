# M10 — Homepage and Section Library

**Status: Prepared baseline — ready for consolidated user review.** This is a complete specification baseline, not implementation or test evidence.

## Purpose

Enable a user to compose a purposeful homepage from curated high-level section samples, with clear visitor intent and no forced or automatic design decisions.

## Outcomes

- A project starts with one editable homepage.
- Users discover, preview, select, configure, insert, replace, remove, duplicate, and reorder curated homepage sections.
- The user decides which sections are relevant and the order in which they appear.
- The homepage reflects the project purpose, audience, offering, and intended visitor action.
- The active M09 identity is applied only through sample-declared compatible tokens.
- All three M01/M06 responsive canvases remain available.

## Approved planning decisions

| ID | Decision |
|---|---|
| M10-01 | Homepage is the first fully composed page; it is not a fixed template. |
| M10-02 | The section catalogue is organized by functional role and component type. |
| M10-03 | Initial section families cover navigation/header, hero, offering, benefits, gallery/listing, process, trust, FAQ, conversion/contact, and footer. |
| M10-04 | Each section type can contain multiple meaningfully distinct curated samples. |
| M10-05 | Users explicitly inspect, compare, select, configure, and insert sections. |
| M10-06 | Sections can be reordered, duplicated, replaced, and removed under M06 rules. |
| M10-07 | Relevance guidance is explanatory and optional; irrelevant section types are never forced. |
| M10-08 | The primary visitor action is explicit and user-selected; no default action is silently imposed. |
| M10-09 | Content slots support real, draft, and placeholder content. |
| M10-10 | Shared header/navigation/footer behavior is modeled explicitly and is not duplicated accidentally. |
| M10-11 | The homepage uses the active M09 website identity through declared sample compatibility. |
| M10-12 | Homepage composition remains generic; the first complete example is store-focused. |
| M10-13 | Desktop controls shared section membership; tablet/mobile retain independent order and visibility. |
| M10-14 | No full-page template marketplace or complex business workflow is included. |
| M10-15 | Runtime remains temporary in-memory; no persistence, autosave, or history is added. |

## Section families

The initial catalogue taxonomy includes:
- Header and navigation.
- Hero / introduction.
- Primary offering / featured content.
- Benefits / value proposition.
- Gallery, collection, or listing.
- Process / how it works.
- Trust / testimonials / credentials.
- FAQ / supporting information.
- Contact / conversion / call to action.
- Footer / closing navigation.

These are discoverable categories, not mandatory page ingredients. A category may have no sample available initially; the UI must communicate that honestly.

## Core boundaries

M06 owns section instance operations and finite content/configuration options. M07 owns sample definitions, taxonomy, authoring, and quality governance. M09 owns project identity. M11 owns detailed responsive behavior. M12 owns additional pages and site-wide navigation. M13 owns content/media quality review. M14 owns export.

No automatic section selection, ranking, insertion, replacement, or arrangement. No arbitrary CSS, nested-element editing, pixel-level geometry, or Figma-like authoring.

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

M00–M09 remain authoritative for product guardrails, journey, UX, design systems, runtime, composition, catalogue, progression, and visual identity. M10 specifies homepage composition behavior only; it does not redefine those contracts.

## Completion criteria

- [x] Homepage purpose, section taxonomy, and user-directed composition defined.
- [x] Shared versus page-local section responsibilities defined.
- [x] Content, identity, and responsive boundaries documented.
- [x] Acceptance, testing, and implementation tasks documented.
- [ ] Application implementation — future work.
- [ ] Verification evidence — future work.
