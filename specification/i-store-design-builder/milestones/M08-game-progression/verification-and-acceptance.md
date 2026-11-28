# M08 Verification and Acceptance

## Purpose

Define specification-level acceptance and the future verification expectations for M08's initial progress experience.

## Product acceptance

### Journey overview
- All 11 M01 levels are represented.
- Each level exposes its name, completion state, and mission completion percentage.
- Users can open any level regardless of progression state.
- The next incomplete mission may be suggested but is never enforced.

### Progress and mission state
- The workspace exposes a compact overall progress percentage.
- The overview exposes per-level mission completion percentages.
- Mission statuses remain Not started, In progress, Complete, and Needs review.
- Level completion is separate from mission completion.
- A user can mark a level complete with unfinished missions still visible.
- Overall design completion follows M01 and requires all applicable required missions plus final review confirmation.
- Needs review is never silently treated as Complete.

### Navigation and user agency
- Users can resume unfinished missions.
- Users can revisit completed levels and revise earlier decisions.
- Progress never gates library access or composition.
- No automatic component/sample choice or insertion occurs.

### Runtime and scope
- Initial implementation remains limited to progress overview and status presentation.
- The MVP remains temporary, in-memory JSON.
- No persistence, autosave, undo/redo, history, or recovery is implied.
- No reward mechanics, AI recommendations, or subjective design-quality scores are introduced.

## Future implementation verification

When implemented, verify:
- Unit tests for progress calculations and status transitions.
- Tests that level completion does not alter mission statuses.
- Tests that Needs review is not counted as Complete.
- Component tests for compact progress indicator and level overview.
- Keyboard navigation, focus visibility, semantic labels, and screen-reader status communication.
- Responsive behavior of the overview and progress entry.
- Isolated end-to-end coverage for opening the overview, navigating to any level, and resuming unfinished work.
- Synthetic project fixtures only.

The exact overall percentage calculation must be specified and tested consistently before implementation. It must not contradict M01's completion invariants.

## Specification completion

- [x] M08 baseline approved.
- [x] Product decisions and scope documented.
- [x] M01/M04/M05/M06 boundaries preserved.
- [x] Initial implementation and future learning scope separated.
- [x] Acceptance and future verification requirements documented.

## Implementation status

This document records specification acceptance only. It does not claim that the UI, tests, or application behavior have been implemented or verified.
