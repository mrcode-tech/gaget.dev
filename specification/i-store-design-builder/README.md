# Website Design Builder — Specification Hub

This directory defines the product strategy, player journey, milestones, and supporting architecture for the generic Website Design Builder (working name).

> **Product principle:** The user is the designer. They choose the website structure, high-level components, patterns, options, and order. The product guides the process through a structured, game-like design journey; it does not design the website for them.

## Start here

1. [Product strategy](00-product-strategy/README.md)
2. [Strategic roadmap](00-product-strategy/strategic-roadmap.md)
3. [Feature inventory](00-product-strategy/feature-inventory.md)
4. [MVP definition](00-product-strategy/mvp-definition.md)
5. [Player journey](website-design-playground-journey.md)
6. [Development plan](website-design-game-implementation-plan.md)

## Milestones

| ID | Strategic outcome | Specification |
|---|---|---|
| M00 | Product strategy and requirements | [M00](milestones/M00-product-strategy/README.md) |
| M01 | Journey and progression architecture | [M01](milestones/M01-game-architecture/README.md) |
| M02 | UX architecture and interactions | [M02](milestones/M02-ux-architecture/README.md) |
| M03 | Product visual design system | [M03](milestones/M03-visual-design-system/README.md) |
| M04 | Domain model and persistence | [M04](milestones/M04-domain-model/README.md) |
| M05 | Application foundation and workspace | [M05](milestones/M05-application-foundation/README.md) |
| M06 | Website composition engine | [M06](milestones/M06-composition-engine/README.md) |
| M07 | Design guidance and component library | [M07](milestones/M07-design-intelligence/README.md) |
| M08 | Journey progress and guided learning | [M08](milestones/M08-game-progression/README.md) |
| M09 | Visual identity builder | [M09](milestones/M09-visual-identity-builder/README.md) |
| M10 | Homepage and section library | [M10](milestones/M10-homepage-builder/README.md) |
| M11 | Responsive design | [M11](milestones/M11-responsive-design/README.md) |
| M12 | Multi-page builder | [M12](milestones/M12-multi-page-builder/README.md) |
| M13 | Content, placeholders, and design review | [M13](milestones/M13-content-and-quality/README.md) |
| M14 | Design documentation and handoff | [M14](milestones/M14-export-and-handoff/README.md) |
| M15 | Platform readiness and growth | [M15](milestones/M15-platform-and-growth/README.md) |

## Supporting areas

- `architecture/` — application boundaries and system architecture
- `data-model/` — project, page, section, and progress contracts
- `ux/` — journeys and reusable interaction patterns
- `design-system/` — product UI system, separate from the user's website design
- `testing/` — quality strategy and test standards
- `decisions/` — product and architecture decision records

## Product guardrails

- The product is generic; users define their own business, profession, organization, or project.
- The user independently chooses all website components, patterns, options, and their order.
- The product is a guided design experience, not an AI designer, professional editor, or conventional game with rewards.
- No AI generation, AI recommendations, or AI-selected design decisions are part of the initial release.
- The canvas is visible from the beginning and progressively reflects the user's decisions.
- Use wireframe-oriented structures, text/content placeholders, and image placeholders. Real images are optional references, not a requirement.
- Users can move between levels freely and revise earlier decisions at any time.
- Level completion records progress; it does not award points, badges, prizes, or competitive scores.
- An incomplete project remains useful: preserve the user's purpose, choices, current wireframe, and unfinished items for developer handoff.
- Keep the module isolated from the existing GaGet application shell and visual system.

## Document governance

Milestones are refined and approved before implementation. Product requirements remain separate from implementation details. Use synthetic sample projects and content in specifications and tests. Do not create empty supporting documents merely to satisfy a template.

M00 is the approved product-strategy baseline. Later milestones may refine details without silently changing these product guardrails.

## Status

These are planning specifications, not a claim that the listed functionality has been implemented.

## Milestone status

- **M00 — Product strategy:** Approved.
- **M01 — Journey and Progression Architecture:** Approved — journey baseline complete. See [M01 specification](milestones/M01-game-architecture/README.md).

M01 approval covers product decisions and planning specifications only. It does not claim application implementation or downstream testing is complete.


- **M02 — UX Architecture and Interaction Design:** Approved. See [M02 specification](milestones/M02-ux-architecture/README.md) and its feature, interaction, and acceptance specifications.

M02 clarifies that the product is a sample-based high-level website composition builder, not a Figma-like detailed visual editor. Users select predefined component samples, customize supported content, and arrange high-level sections. Desktop owns shared structure; tablet/mobile customize ordering, visibility, and supported responsive presentation. All three canvases are visible simultaneously.

M02 approval covers UX/product planning only. It does not claim application implementation or testing is complete.
