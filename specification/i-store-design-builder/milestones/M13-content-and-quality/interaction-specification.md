# M13 — Interaction Specification

## Content properties

Show field labels, plain-language help, required/optional state, content status, and preview. Avoid exposing schema/technical identifiers to users. Preserve input during navigation within the active session.

## Content status

Provide explicit status selection for final, draft, placeholder, and missing. Placeholder status reveals a purpose/instruction field. Do not automatically mark content final based on non-empty input.

## Media selection

The image slot offers:
- Describe purpose.
- Choose local image.
- Replace asset.
- Remove slot reference.
- Edit alt text and decorative/informative classification.
- Select sample-supported image presentation preset.

Before file selection, explain session-only behavior. Show filename, preview, type, and size after selection. Invalid/unsupported files produce actionable feedback. Do not upload.

## Asset reuse

Provide an explicit session asset picker showing only files the user previously selected. The user chooses which asset to reuse; no automatic matching.

## Quality review

Group findings by severity and page. Each finding displays the issue, why it matters, affected target, and an action to open the relevant editor. Filters may narrow the list but do not hide blocking errors from the overall summary.

## Readiness summary

Show:
- Blocking errors.
- Warnings.
- Informational notes.
- Placeholder/missing-content counts.
- Media references and missing assets.
- Responsive/accessibility review state.

Avoid an overall quality score or progress reward. User can continue editing with warnings and placeholders.

## Session-loss notice

When local media is selected, clearly indicate that it is session-only and should be exported before leaving. Do not claim recovery or saving.
