# M06 — Website Composition Engine

## Strategic purpose

Make structured design choices render as a real website preview.

## Objective

Build the schema-driven page renderer and editing operations that transform project data into a website.

## Scope

- Page renderer
- section registry
- component contracts
- variants
- insertion/removal/reordering
- contextual configuration
- shared components
- token application
- live preview
- selection state
- renderer validation.

## Out of scope

Full mission progression, content AI, publishing, and unrestricted freeform editing.

## Dependencies

M03–M05.

## Acceptance criteria

A deterministic project model renders correctly; players can add, configure, reorder, and remove supported sections and see immediate canvas updates.

## Deliverables

Functional composition engine and component contracts.

## Required supporting specifications

Create or expand the following documents when the milestone is prepared for implementation. Do not create empty documents merely to satisfy a template.

- `objectives-and-scope.md` — measurable goals, boundaries, assumptions, and exclusions.
- `feature-specification.md` — feature behavior, requirements, and edge cases.
- `user-stories.md` — user/system stories with traceable identifiers.
- `interaction-specification.md` — screens, states, flows, and interaction rules where applicable.
- `technical-design.md` — architecture, module boundaries, and implementation approach.
- `data-contracts.md` — entities, schemas, events, and API contracts where applicable.
- `acceptance-criteria.md` — testable milestone completion criteria.
- `testing-strategy.md` — unit, integration, component, accessibility, and end-to-end verification.
- `implementation-tasks.md` — dependency-ordered, reviewable engineering tasks.

## Definition of done

- [ ] Scope, assumptions, and exclusions are agreed.
- [ ] Dependencies are satisfied or explicitly resolved.
- [ ] Feature requirements and user stories are traceable.
- [ ] UX and technical decisions are documented where relevant.
- [ ] Implementation tasks are small enough to review and verify.
- [ ] Acceptance criteria pass.
- [ ] Relevant automated and manual verification evidence is recorded.
- [ ] Known limitations and follow-up work are documented.
- [ ] The roadmap and feature inventory reflect any approved scope changes.

## Open decisions

Record unresolved product or technical questions here. Each decision should eventually be resolved or moved to the shared `decisions/` area with rationale and consequences.

## Status

**Planning.** This document defines intended scope; it does not claim implementation is complete.
