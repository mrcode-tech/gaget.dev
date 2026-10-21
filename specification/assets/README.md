# Design Asset Conventions

This directory stores authored, reviewable target design assets. Generated current-state screenshots belong to the GitHub Actions artifact for the exact commit, not in this directory by default.

## Target assets

- Keep editable wireframes in SVG; include PNG previews when they improve review in GitHub or documentation.
- Group by feature and state, for example `target/app-shell/`, `target/photo-editor/`, `target/audio-editor/`, `target/video-editor/`, and `target/date-time-editor/`.
- Use descriptive filenames that identify the viewport and state, such as `editor-empty-desktop.svg` and `editor-loaded-mobile.png`.
- Each feature specification must link to the approved asset and explain the behavior the asset represents.
- Add a small Markdown README or manifest alongside a substantial asset set. Record status (Proposal/Approved/Superseded), owner/reviewer, date, target route, viewport, theme, state, related spec and rationale.
- Never label a proposal as approved until the user or designated reviewer approves it.
- Do not embed source screenshots as if they were editable target designs. Screenshots document current implementation; SVG wireframes express intended design.

## Change lifecycle

1. Audit the current implementation and capture evidence.
2. Create the target SVG from the written layout and interaction contract.
3. Review the SVG/PNG alongside acceptance criteria.
4. Mark the target approved before implementation relies on it as an acceptance baseline.
5. Update the feature spec, implementation and verification record together.
6. Mark superseded assets clearly or remove them when no longer referenced.

See `../AI_INSTRUCTIONS.md` for the mandatory AI task workflow.
