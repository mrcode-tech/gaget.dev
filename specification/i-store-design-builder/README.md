# Website Design Game — Specification Hub

This directory contains the product strategy, player journey, milestone specifications, and supporting architecture for the generic Website Design Game (working name: Store Design Builder).

> **Product principle:** The player defines their own business, organization, profession, or project. The product must not assume a particular industry or website type.

## Start here

1. [Product strategy](00-product-strategy/README.md)
2. [Strategic roadmap](00-product-strategy/strategic-roadmap.md)
3. [Feature inventory](00-product-strategy/feature-inventory.md)
4. [MVP definition](00-product-strategy/mvp-definition.md)
5. [Player journey](website-design-playground-journey.md)
6. [Game implementation plan](website-design-game-implementation-plan.md)

## Milestones

| ID | Strategic outcome | Specification |
|---|---|---|
| M00 | Product strategy and requirements | [M00](milestones/M00-product-strategy/README.md) |
| M01 | Game and progression architecture | [M01](milestones/M01-game-architecture/README.md) |
| M02 | UX architecture and interactions | [M02](milestones/M02-ux-architecture/README.md) |
| M03 | Product visual design system | [M03](milestones/M03-visual-design-system/README.md) |
| M04 | Domain model and persistence | [M04](milestones/M04-domain-model/README.md) |
| M05 | Application foundation and workspace | [M05](milestones/M05-application-foundation/README.md) |
| M06 | Website composition engine | [M06](milestones/M06-composition-engine/README.md) |
| M07 | Design intelligence and recommendations | [M07](milestones/M07-design-intelligence/README.md) |
| M08 | Game progression and guided learning | [M08](milestones/M08-game-progression/README.md) |
| M09 | Visual identity builder | [M09](milestones/M09-visual-identity-builder/README.md) |
| M10 | Homepage and section library | [M10](milestones/M10-homepage-builder/README.md) |
| M11 | Responsive design | [M11](milestones/M11-responsive-design/README.md) |
| M12 | Multi-page website builder | [M12](milestones/M12-multi-page-builder/README.md) |
| M13 | Content, media, and quality | [M13](milestones/M13-content-and-quality/README.md) |
| M14 | Export and implementation handoff | [M14](milestones/M14-export-and-handoff/README.md) |
| M15 | Platform readiness and growth | [M15](milestones/M15-platform-and-growth/README.md) |

## Supporting areas

- `architecture/` — cross-cutting application and system architecture
- `data-model/` — canonical domain entities and contracts
- `ux/` — shared journeys, interaction patterns, and screen definitions
- `design-system/` — product UI and website-design-system documentation
- `testing/` — quality strategy and test standards
- `decisions/` — architecture/product decision records

## Document governance

- Milestones are independently scoped, but dependencies are authoritative.
- A milestone is not complete until its acceptance criteria are verified and evidence is recorded.
- Keep product requirements separate from implementation details.
- Use synthetic sample businesses and content in specifications, fixtures, and tests.
- Do not make unrestricted pixel placement or arbitrary CSS editing part of the core player experience.
- The website canvas is visible from the beginning and progressively takes shape as the player advances.
- Players may revisit and revise completed decisions; progression guides discovery rather than permanently locking choices.
- Keep this feature isolated from the existing GaGet application shell and visual system.

## Status

These are planning specifications, not a claim that the listed functionality has been implemented. Each milestone must be refined and approved before implementation begins.
