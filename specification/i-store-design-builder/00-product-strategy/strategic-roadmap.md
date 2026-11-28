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


## M02 approval baseline

**M02 — UX Architecture and Interaction Design: Approved.** The approved workspace, sample-based composition model, editing boundary, three-canvas responsive behavior, persistence expectations, review experience, and accessibility requirements are documented in [M02](../milestones/M02-ux-architecture/README.md).

Key product boundary: users build websites by selecting and arranging predefined high-level component samples and editing supported content fields. This is not a Figma-like detailed visual editor. Desktop owns shared structural composition; tablet and mobile provide independent ordering, visibility, and supported responsive presentation. All three canvases remain visible side by side.

Downstream ownership:
- M03 defines the builder UI visual system and component-sample presentation conventions.
- M04 defines component/sample/content and per-breakpoint layout/history contracts.
- M05 implements the isolated workspace shell and panels.
- M06 implements sample-driven composition and bounded rendering.
- M07 authors and expands the component sample portfolio and learning examples.
- M10–M12 deliver homepage, responsive, and multi-page composition.
- M13–M14 deliver content review and handoff.

## M03 approval baseline

**M03 — Product Visual Design System: Approved.** M03 defines separate visual systems for the builder interface and the website component design portfolio, plus a professional design knowledge and quality framework. The builder's identity is distinctive, professional, and creative rather than a generic GPT/AI dashboard. The component portfolio is curated and progressively expanded, with independent sample visual identities and shared technical/content-slot conventions.

Downstream ownership:
- M04 defines stable design data contracts for samples, supported content slots/options, and responsive presentation metadata.
- M05 implements the isolated builder workspace using the approved System A visual foundations.
- M06 implements sample-driven composition and rendering boundaries.
- M07 authors, documents, and expands the System B component portfolio using the professional framework and quality checklist.
- M10–M12 apply responsive sample guidance to homepage and multi-page composition.

M03 approval is a planning/design baseline, not implementation or visual verification evidence.
