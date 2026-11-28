# M08 — Journey Progress and Guided Learning

**Status: Approved baseline — specification complete.** This approval covers the product and experience specifications only. It does not claim that progress UI, guidance, learning features, persistence, or application behavior have been implemented or verified.

## Strategic purpose

Help users understand their progress through the Website Design Builder journey and learn website design through practical work. The product is a practice-first builder, not a conventional course or competitive game.

Users learn by exploring predefined component samples, selecting and inserting them, configuring supported content, comparing previews, and replacing samples when they prefer another design. The product may explain overall website structure and provide illustrative design direction, while users retain all creative decisions.

## Approved decisions

| ID | Area | Approved decision |
|---|---|---|
| M08-01 | Journey overview | Compact progress indicator with a separate level overview |
| M08-02 | Next activity | Show the next incomplete mission; do not force a linear journey |
| M08-03 | Level introduction | Short purpose and expected-outcome explanation |
| M08-04 | Dependencies | Explain dependency effects only when attention is needed; preserve M01's affected-mission semantics |
| M08-05 | Mission introduction | Objective, explanation, expected outcome, examples, and available actions |
| M08-06 | Learning approach | Practical examples and visual comparisons; learning occurs through actual design activities |
| M08-07 | Terminology | Explain unfamiliar terminology when requested |
| M08-08 | Examples | Inspectable visual examples that do not mutate the project |
| M08-09 | Contextual guidance | Guidance is available on request, not permanently displayed |
| M08-10 | Decision consequences | Explain consequences when dependencies exist |
| M08-11 | Sample comparison | Sample names and visual previews are the primary comparison aid |
| M08-12 | Overall design direction | Provide general, explanatory website-structure/design-direction guidance; users decide and configure the actual structure and components |
| M08-13 | Missing content | Users may continue with missing content and placeholders; no additional explanation is required to proceed |
| M08-14 | Learning reference | Keep learning material contextual to the active mission; no separate learning library in the initial scope |
| M08-15 | Progress display | Compact overall percentage plus level statuses and mission completion percentages in the overview |
| M08-16 | Mission statuses | Preserve all four M01 statuses with a compact visual presentation |
| M08-17 | Earlier decisions | Mark affected missions Needs review; preserve existing work |
| M08-18 | Level completion | User may explicitly complete a level while unfinished missions remain visible |
| M08-19 | Learning modes | Beginner and advanced explanation modes |
| M08-20 | Initial implementation | Progress overview and mission-status experience only; broader learning/guidance capabilities remain product direction and later implementation scope |

## Core product principles

1. **Practice-first:** users learn by performing real, user-directed website-design activities, not by completing mandatory lessons.
2. **User agency:** guidance informs decisions; it does not make creative decisions for the user.
3. **Overall direction, not automatic composition:** general website-structure guidance may illustrate a suitable starting direction. It must not automatically select, rank, insert, replace, or arrange individual component samples.
4. **No AI recommendations in the initial product:** M00/M01/M03/M07 guardrails remain authoritative. M08's general design-direction guidance is explanatory and curated, not AI-generated or a personalized automated recommendation engine.
5. **Non-blocking learning:** tutorials, terminology explanations, and optional examples do not gate the library, canvas, or composition.
6. **Simple progress:** keep progress compact in the workspace and expose detail in a separate overview.
7. **No reward mechanics:** no points, badges, prizes, achievements, leaderboards, timers, streaks, or subjective design-quality scores.

## Progress and mission semantics

M01 is authoritative for the 11 levels, mission completion, level completion, overall design completion, free navigation, and dependency review.

- Keep all 11 levels accessible from the beginning.
- The next incomplete mission may be highlighted as a convenience, not enforced as the only available action.
- Preserve mission statuses: Not started, In progress, Complete, and Needs review.
- Level completion is a separate user-declared state. It never completes, waives, or rewrites unfinished missions.
- Overall website-design completion still requires all applicable required missions complete (or Not needed where supported) and user confirmation of final review.
- Earlier changes preserve work and mark potentially affected missions Needs review.

## Learning and recommendation boundaries

- Users learn through sample browsing, preview, explicit insertion, supported content/configuration, comparison, and sample replacement as defined by M06/M07.
- Mission guidance and examples are available when requested.
- Beginner/advanced modes alter explanation depth only; they do not change editing permissions or domain behavior.
- General website-structure guidance may describe an illustrative section sequence or design direction, especially for the first store-focused journey.
- Such guidance is optional and non-binding. Users decide which high-level components and samples to use and their order.
- No automatic individual sample/component recommendation, ranking, selection, insertion, replacement, or arrangement.
- No AI-generated guidance or recommendation engine in the initial product.
- The product remains generic; store-oriented examples do not hardcode commerce assumptions into the product model.

## Runtime and implementation boundary

The M08 initial implementation scope is limited to:
- Compact overall progress indicator.
- Separate journey/level overview.
- Level statuses and mission completion percentages.
- Four mission statuses in a compact presentation.
- Visibility of unfinished work and navigation to resume missions.

Practice-first learning, examples, beginner/advanced explanations, contextual guidance, and overall design-direction material are product requirements for progressive delivery, not an expansion of this initial implementation scope.

M04/M05/M06 govern the MVP runtime: browser-only temporary in-memory JSON. M08 does not introduce persistence, authentication, backend storage, autosave, undo/redo, history, or recovery. Earlier provisional M02/M08 expectations for save/recovery are superseded by the later-approved M04/M05/M06 runtime boundary.

## Documents

- [Journey overview and navigation](journey-overview-and-navigation.md)
- [Practice-first learning](practice-first-learning.md)
- [Mission guidance and examples](mission-guidance-and-examples.md)
- [Website design recommendations](website-design-recommendations.md)
- [Learning modes and content](learning-modes-and-content.md)
- [Progress visibility and status](progress-visibility-and-status.md)
- [Dependency and review communication](dependency-and-review-communication.md)
- [Initial implementation scope](initial-implementation-scope.md)
- [Verification and acceptance](verification-and-acceptance.md)

## Dependencies and ownership

- **M00:** generic, user-directed product strategy; no AI design choices or automatic composition.
- **M01:** authoritative 11-level journey, mission/level/overall completion distinctions, four mission statuses, free navigation, and Needs review behavior.
- **M02:** workspace, contextual guidance, and sample-based interaction model.
- **M03:** builder interface identity, accessibility, and professional design principles.
- **M04:** mission/progression domain model and temporary in-memory runtime.
- **M05:** isolated workspace and typed runtime foundation; no persistence.
- **M06:** actual component selection, insertion, configuration, replacement, and responsive composition behavior.
- **M07:** taxonomy, sample metadata, previews, and portfolio guidance.
- **M13/M14:** later content readiness, review, and handoff ownership.

## Completion criteria

- [x] M08 decisions reviewed and approved.
- [x] Journey overview and next-mission navigation specified.
- [x] Practice-first learning and guidance boundaries specified.
- [x] Overall website-structure guidance bounded by user agency and no-automatic-sample-selection rules.
- [x] Beginner/advanced explanation modes specified.
- [x] Overall progress, level status, and all four mission statuses specified.
- [x] M01 level and overall completion invariants preserved.
- [x] Dependency review and unfinished-work behavior specified.
- [x] Initial implementation scope separated from future learning capabilities.
- [x] M04/M05/M06 in-memory runtime boundary preserved.
- [x] Verification and acceptance criteria documented.
- [ ] Progress UI implementation — future work.
- [ ] Automated and manual implementation verification — future work.

## Governance

Use synthetic projects and content in specifications and tests. Preserve M00–M07 approved decisions. Specification approval is not evidence of implementation, testing, deployment, persistence, or extraction into a standalone codebase.
