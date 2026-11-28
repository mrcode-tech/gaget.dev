# Journey Overview and Navigation

## Purpose

Define how users discover the 11-level journey, understand current progress, and resume unfinished work without making the experience rigid or blocking.

## Workspace progress entry

- Show a compact overall progress percentage in the workspace.
- The indicator opens a separate journey overview.
- Do not use a permanently dominant level sidebar solely for progression.
- Progress is informational; it does not grant or restrict access to components, samples, missions, or editing actions.

## Journey overview

The overview presents all 11 M01 levels (0–10) with:
- Level number and name.
- Short purpose.
- Level status, including whether the user has explicitly marked it complete.
- Mission completion percentage.
- Clear indication of unfinished work and missions needing review.
- A direct action to open the level or resume a relevant mission.

The overview should be compact and scannable. It is not a tutorial or a second design workspace.

## Next incomplete mission

- Identify the next incomplete mission as the default suggested continuation.
- Do not force the user to follow it.
- Keep every level and mission reachable, consistent with M01.
- If the suggested mission is unavailable or not applicable, present the next relevant incomplete mission according to that level's rules.
- Users may choose another level, revisit completed work, or continue elsewhere.

## Level introduction

A level introduction briefly states:
1. What the level addresses.
2. Why it matters to the website.
3. The expected outcome.
4. The broad type of activity involved.

Do not require a long tutorial before entry.

## Navigation behavior

- Preserve M01 unrestricted forward/backward navigation, skipping, pausing, and revisiting.
- Opening the overview or navigating between levels must not mutate project composition.
- Navigating away from an unfinished mission must not mark it complete.
- The library and normal composition capabilities remain available regardless of progression state.
- Progress navigation must work with keyboard and assistive technology and provide visible focus.

## Boundaries

M01 defines the journey and progression semantics. M08 defines their presentation and navigation. M06 defines component composition; M08 must not duplicate or alter its operations.

## Acceptance criteria

- [ ] Compact progress indicator opens the overview.
- [ ] Overview represents all 11 levels and their status.
- [ ] Level mission percentages and unfinished work are visible.
- [ ] Next incomplete mission is suggested without enforcing a sequence.
- [ ] Users can open any level and revisit work.
- [ ] Navigation does not mutate project data or falsely complete missions.
- [ ] Library access and composition are not progression-gated.
- [ ] Keyboard and assistive-technology navigation are supported.
