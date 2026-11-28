# M08 Initial Implementation Scope

## Purpose

Separate the full approved product direction for progress and learning from the deliberately limited initial implementation selected for M08.

## Included in the initial implementation

1. Compact overall progress percentage in the workspace.
2. Separate journey overview covering all 11 levels.
3. Level completion state.
4. Mission completion percentages per level.
5. Four mission statuses: Not started, In progress, Complete, Needs review.
6. Visibility of unfinished missions.
7. Navigation to open a level and resume an incomplete or Needs review mission.
8. Next incomplete mission as a suggested continuation, without restricting navigation.

## Product direction, not initial implementation scope

The following are approved experience principles for progressive delivery, but are not part of the initial M08 implementation scope:
- Practice-first learning enhancements beyond existing M02/M06/M07 interactions.
- Additional mission tutorials and contextual guidance.
- Visual learning-example framework.
- On-demand terminology explanations.
- Beginner and advanced explanation modes.
- General website-structure and store-design direction content.
- Expanded dependency explanation experiences.

This distinction does not remove or revise the product requirements. It prevents M08's initial implementation from expanding beyond the user's Q20 decision.

## Existing capabilities and ownership

- M02 owns the workspace and contextual interaction architecture.
- M06 owns actual component selection, insertion, replacement, and composition.
- M07 owns catalogue taxonomy, sample metadata, previews, and sample-level guidance.
- M08 owns progress presentation and the progression/learning experience described in its approved product scope.

## Explicit exclusions

- Persistence, backend, database, authentication, browser storage, autosave, undo/redo, history, or recovery.
- AI-generated guidance or recommendations.
- Automatic component/sample selection, insertion, replacement, or arrangement.
- Reward mechanics or subjective quality scoring.
- Progression-based access restrictions.
- A separate learning portal or course platform.

## Runtime constraint

The MVP remains browser-only, temporary, in-memory JSON as established by M04/M05/M06. Do not infer persistence from earlier provisional M02 or legacy M08 wording.

## Acceptance criteria

- [ ] Initial implementation contains only the approved progress overview and mission-status capabilities.
- [ ] All four mission statuses are represented.
- [ ] The overview supports all 11 levels and direct mission navigation.
- [ ] Next incomplete mission is a suggestion, not a gate.
- [ ] Future learning capabilities are documented separately from initial implementation.
- [ ] No persistence or AI capabilities are introduced.
