# Dependency and Review Communication

## Purpose

Define how the product communicates affected work when users revise earlier decisions.

## Authoritative rules

M01 defines dependency semantics:
- Preserve existing work when earlier decisions change.
- Mark potentially affected missions Needs review.
- Show dependency information when an earlier decision changes.
- Let the user decide how to resolve affected work.
- Do not silently rewrite or discard later decisions.

M08 defines how these facts are represented in progress and navigation.

## M08 presentation

- Show Needs review in the journey overview and relevant mission list.
- Allow users to navigate directly to affected missions.
- Keep the explanation concise and tied to the change that caused review.
- Do not require a permanent dependency map.
- Do not explain every dependency pre-emptively; surface it when an earlier change creates a review need.
- Do not automatically complete or reset affected missions.

The user's Q17 preference for a simple status-first presentation is honored: the status is primary. M01's requirement to identify affected decisions and communicate dependency information remains in force; M08 must not suppress the explanation entirely.

## Completion and review

- Affected missions remain Needs review until their own applicable completion rules are satisfied.
- Marking a level complete does not remove Needs review or unfinished mission states.
- Overall website-design completion continues to follow M01.
- Review status is informational and does not lock ordinary composition.

## Runtime boundary

Progress and dependency state is held in the temporary in-memory project model for the MVP. No persistence or recovery mechanism is introduced by this milestone.

## Acceptance criteria

- [ ] Earlier decisions preserve existing work.
- [ ] Affected missions are marked Needs review.
- [ ] Overview identifies missions needing attention.
- [ ] Users can navigate to affected missions.
- [ ] Dependency information is communicated when changes cause review.
- [ ] No automatic rewriting, completion, or editing lock occurs.
