# Mission and Progression Model

Progression is separate from page/component composition.

## Concepts
- Level and mission identities/statuses.
- User decisions and mission answers.
- Explicit Not-needed choices where allowed.
- Needs-review flags when prior decisions affect downstream work.
- User-marked level completion separate from mission completion.
- Final review confirmation and overall complete/incomplete state.

## M01 invariants
- Levels remain accessible; navigation is flexible.
- Marking a level complete does not waive unfinished missions or alter their status.
- Mission completion follows each mission's rules.
- Overall Complete requires applicable required missions complete (or Not needed where permitted) and final review confirmation.
- Earlier changes preserve work and flag affected missions for review.

MVP holds progress in memory; no persistence/recovery mechanism is required.
