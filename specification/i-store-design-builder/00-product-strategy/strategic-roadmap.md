# Strategic Roadmap and Milestone Plan

## Strategy

First define a user-directed, wireframe-first design experience. Then design its levels and workspace, establish the project model, build the composition engine and component library, and deliver responsive previews, multi-page design, and developer handoff.

The product does not depend on AI. Design guidance is authored into levels, explanations, examples, and curated component documentation. The user chooses the design.

## Strategic workstreams

1. Product strategy and requirements.
2. Player journey, level completion, and progress.
3. UX architecture and interaction design.
4. Product visual design system.
5. Project and website design data model.
6. Wireframe composition engine and component library.
7. Design education and component documentation.
8. Responsive and multi-page website design.
9. Content placeholders and design review.
10. Design summary and developer handoff.
11. Optional future platform capabilities, including separately evaluated AI assistance.

## Milestone sequence

| ID | Milestone | Strategic outcome | Depends on |
|---|---|---|---|
| M00 | Product strategy | Approved vision, requirements, scope | — |
| M01 | Journey architecture | Defined levels, missions, and completion rules | M00 |
| M02 | UX architecture | Defined screens and interactions | M00–M01 |
| M03 | Visual design system | Consistent product UI language | M02 |
| M04 | Domain model | Stable project and design data model | M00–M02 |
| M05 | Application foundation | Working isolated workspace | M02–M04 |
| M06 | Composition engine | Structured wireframe rendering and editing | M03–M05 |
| M07 | Design guidance and component library | Clear examples and documentation for user choices | M00, M04, M06 |
| M08 | Journey progress | Objective mission completion and free navigation | M01, M04–M06 |
| M09 | Visual identity builder | Optional visual direction and shared identity choices | M06–M08 |
| M10 | Homepage builder | Complete user-composed homepage | M06–M09 |
| M11 | Responsive design | User-directed responsive patterns and previews | M06, M09–M10 |
| M12 | Multi-page builder | Complete user-composed website | M06, M08–M11 |
| M13 | Content and design review | Content slots, placeholders, and completion review | M09–M12 |
| M14 | Design handoff | Useful complete or partial developer handoff | M04, M06, M09–M13 |
| M15 | Platform and growth | Reliable operations and validated future expansion | M05–M14 |

## Suggested release groupings

- **Release A — Foundations:** M00–M05. Product definition, experience design, data foundation, and isolated workspace shell.
- **Release B — First usable design journey:** M06, M07, M08, M09, and essential M10. A user can select and arrange wireframe components and see the homepage take shape.
- **Release C — Complete website design:** remaining M10, M11, M12, and M13.
- **Release D — Handoff:** M14, including complete and partial design summaries.
- **Release E — Platform growth:** M15 and future optional capabilities.

## Definition of milestone completion

A milestone is complete only when its scope and exclusions are explicit, dependencies are satisfied, specifications are approved, acceptance criteria pass, and evidence is recorded. Planning-document completion must not be confused with application implementation completion.

## Change control

New requests are classified P0/P1/P2, assigned to a milestone, checked against the product guardrails, and reflected in this roadmap and feature inventory. Any future AI feature requires a separate explicit product decision and must not silently change user-directed design.

## M01 approval baseline

**M01 — Journey and Progression Architecture: Approved.** The 11-level journey, mission/level/overall completion model, free navigation, dependency review, mission statuses, responsive canvas synchronization, placeholder behavior, and complete/incomplete handoff rules are documented in [M01](../milestones/M01-game-architecture/README.md).

Downstream ownership:
- M02 defines detailed screens and interactions for the approved journey.
- M04 defines shared component data and independent breakpoint layout state, plus distinct mission/level/design completion data.
- M06 implements user-directed component composition.
- M08 implements mission and level progress behavior.
- M11 specifies detailed responsive patterns and breakpoint behavior.
- M13 and M14 define final review and handoff details.

The first complete journey example is store-focused; the product itself remains generic.
