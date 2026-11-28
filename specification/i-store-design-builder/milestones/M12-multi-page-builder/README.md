# M12 — Multi-page Website Builder

**Status: Prepared baseline — ready for consolidated user review.** Specification only; implementation and verification remain future work.

## Purpose

Expand the composed homepage into a connected, navigable website with user-controlled pages, page-specific sections, and shared site-wide elements.

## Approved decisions

| ID | Decision |
|---|---|
| M12-01 | Each project has exactly one homepage and zero or more additional pages. |
| M12-02 | Users explicitly create, name, configure, duplicate, reorder, and delete pages. |
| M12-03 | A page planner presents the website's page list and hierarchy. |
| M12-04 | Curated page starters are optional starting structures, never auto-applied. |
| M12-05 | Page types are generic functional descriptions, not rigid industry templates. |
| M12-06 | Each page owns its sections and responsive layout state. |
| M12-07 | Header, navigation, footer, and M09 identity may be shared site-wide through explicit references. |
| M12-08 | Internal navigation destinations reference stable page IDs, not mutable route strings alone. |
| M12-09 | Users explicitly configure navigation labels, order, and destinations. |
| M12-10 | Page deletion identifies affected links and requires explicit resolution. |
| M12-11 | All pages use the same three-canvas and M11 responsive model. |
| M12-12 | No CMS, backend transactions, checkout, booking, membership, or arbitrary integrations. |
| M12-13 | Runtime remains temporary in-memory; no persistence. |

## Page families

Initial generic page purposes include About, Contact, Listing/Collection, Detail, FAQ/Help, Service/Offering, Campaign/Landing, and other user-defined pages. This list is illustrative and extensible, not mandatory.

## Scope

Page planning and lifecycle, optional page starters, page-specific composition, shared site elements, navigation links, route metadata, multi-page preview, and cross-page validation.

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

M04 owns page/project entities; M06 composition; M08 progression; M09 identity; M10 homepage and shared-frame concepts; M11 responsive state; M13 content/quality; M14 handoff.

## Completion criteria

- [x] Page lifecycle and planner behavior specified.
- [x] Shared/site-wide and page-specific data boundaries specified.
- [x] Navigation and deletion impact rules specified.
- [x] Responsive, validation, and handoff boundaries documented.
- [ ] Implementation and verification — future work.
