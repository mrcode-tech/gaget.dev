# M13 — Content, Media, and Website Quality

**Status: Prepared baseline — ready for consolidated user review.** This is a specification baseline, not implementation or verification evidence.

## Purpose

Help users make their chosen website structure credible and understandable by managing supported content fields, temporary user-provided media, placeholders, and actionable quality findings.

## Approved decisions

| ID | Decision |
|---|---|
| M13-01 | Content is edited through sample-defined fields, not a freeform editor. |
| M13-02 | Content states distinguish real/final, draft, placeholder, and missing. |
| M13-03 | Users can enter and revise text, links, item data, and supported metadata. |
| M13-04 | Image slots have purpose, asset reference, alt text, and optional focal/crop settings only where supported. |
| M13-05 | Users may select local image files for the active session; no hosted asset library. |
| M13-06 | Local media references are temporary and may be lost when the session ends. |
| M13-07 | No stock-image provider, image generation, automatic image search, or AI content generation. |
| M13-08 | Validate required fields, links, route integrity, placeholders, media references, and accessibility basics. |
| M13-09 | Reuse assets through explicit user selection; no automatic assignment to slots. |
| M13-10 | Quality findings are actionable and user-controlled; no subjective score or silent correction. |
| M13-11 | M09 WCAG 2.2 AA contrast checks remain authoritative for identity-level contrast. |
| M13-12 | Readiness distinguishes complete, incomplete, and needs-review states using M01 semantics. |
| M13-13 | Runtime remains in-memory; media is not persisted or uploaded to a backend. |

## MVP media boundary

Users can choose supported local image files during the active browser session. The runtime keeps file objects in a temporary in-memory asset registry and stores typed metadata/references in the project model. No server upload, cloud asset library, cross-session persistence, stock search, or image generation is introduced.

M14 export must make media limitations explicit and provide a self-contained handoff package option for user-selected referenced assets. JSON/Markdown exports must include asset manifest metadata and clearly state when binary media is not embedded.

## Scope

Structured content editing, content state, temporary image references, placeholders, alt text, supported crop/focal settings, link validation, accessibility checks, consistency checks, readiness report, and correction navigation.

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

M04/M06 content and asset references; M09 identity and contrast; M10 homepage; M11 responsive previews; M12 pages/navigation; M14 export packaging.

## Completion criteria

- [x] Content states and bounded editing specified.
- [x] Session-only local media model specified.
- [x] Validation, accessibility, and readiness behavior specified.
- [x] Export/media boundary reconciled with MVP C.
- [ ] Implementation and verification — future work.
