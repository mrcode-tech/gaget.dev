# Progress Visibility and Mission Status

## Purpose

Specify the presentation of overall progress, level progress, mission statuses, and unfinished work.

## Compact workspace indicator

- Display a compact overall progress percentage in the workspace.
- The indicator provides access to a separate journey overview.
- Do not make progress visualization dominate the design canvas.
- Progress is informational and never gates library access or editing.

## Journey overview

The overview presents:
- All 11 levels and their names.
- Each level's user-declared completion state.
- Mission completion percentage for each level.
- Current activity or next incomplete mission.
- Unfinished missions.
- Missions marked Needs review.

The overview must distinguish level completion from mission completion and overall website-design completion.

## Mission statuses

Preserve M01's four statuses exactly:

| Status | Meaning |
|---|---|
| Not started | No meaningful work has begun |
| In progress | Work has begun but mission requirements are not satisfied |
| Complete | Objective mission requirements are satisfied, including Not needed where explicitly supported |
| Needs review | An earlier decision changed and this mission may be affected |

The UI may use a compact visual treatment, but must not collapse the underlying domain statuses into only Complete/Incomplete.

## Level completion

- A user explicitly marks a level complete.
- A level may be marked complete while missions remain unfinished.
- Unfinished mission statuses remain visible and unchanged.
- Level completion does not waive required missions or automatically complete them.

## Overall website-design completion

M01 remains authoritative: the overall design is Complete only when all applicable required missions are complete (or explicitly Not needed where supported) and the user confirms final review. Otherwise it remains Incomplete, even if one or more levels have been marked complete.

## Progress calculation

- Show one overall percentage as a compact summary and per-level mission completion percentages in the overview.
- The precise formula for the overall percentage must be consistent and documented by the implementation specification before coding; it must not imply that user-declared level completion waives unfinished missions.
- Not started, In progress, Complete, and Needs review remain distinct statuses. Needs review must not be silently counted as Complete.
- Do not introduce points, rewards, quality scores, streaks, or competitive metrics.

## Acceptance criteria

- [ ] Workspace shows compact overall percentage.
- [ ] Overview shows all 11 levels, level completion state, and mission completion percentage.
- [ ] Four mission statuses are preserved and distinguishable.
- [ ] Level completion is separate from mission completion.
- [ ] Overall completion follows M01.
- [ ] Needs review is not treated as Complete.
- [ ] Progress never restricts component library or editing access.
