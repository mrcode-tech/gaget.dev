# M08 — Journey Progress and Guided Learning

## Strategic purpose

Represent the user's progress through the design journey without turning the product into a competitive game or restricting creative freedom.

## Objective

Implement level and mission state, objective completion, free navigation, guidance, and reliable preservation of the user's work.

## Scope

- Mission runtime.
- Level and mission state.
- Objective completion evaluation.
- Progress persistence.
- Hints, explanations, and tutorials.
- Free navigation between levels.
- Revisit and revision behavior.
- Save/recovery and undo/redo integration where applicable.
- Clear indication of complete, incomplete, and not-yet-reviewed missions.

## Explicit exclusions

- Points, badges, prizes, achievements, leaderboards, timers, streaks, or reward economies.
- Subjective design-quality scoring.
- Capability gating based on level completion.
- AI-generated guidance or automatic design decisions.

## Dependencies

M01, M04–M06.

## Acceptance criteria

A user can move freely through the levels, complete required missions, revisit and revise previous decisions, and resume without losing work. Completion is an informative progress state only.

## Deliverables

Progress and mission-state system, completion rules, and revision behavior.

## Required supporting specifications

Create detailed objectives, feature specifications, user stories, interaction rules, technical design, data contracts, acceptance criteria, testing strategy, and implementation tasks when M08 is refined for implementation. Do not create empty documents merely to satisfy a template.

## Definition of done

- [ ] Mission state and objective completion are implemented and testable.
- [ ] Forward/backward navigation is unrestricted.
- [ ] No rewards or competitive mechanics exist.
- [ ] Level completion does not gate component access.
- [ ] Revision and recovery preserve user work.
- [ ] Acceptance criteria and test evidence are recorded.

## Open decisions

Detailed progress-state representation and persistence behavior are refined in M08.

## Status

**Planning.** This document defines intended scope; it does not claim implementation is complete.
