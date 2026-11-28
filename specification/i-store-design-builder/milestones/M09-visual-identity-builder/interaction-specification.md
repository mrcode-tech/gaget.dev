# M09 — Interaction Specification

## Workspace relationship

The identity experience is part of the isolated Website Design Builder workspace. It must not modify the existing GaGet shell or M03 Builder Interface visual system.

Keep the website canvas visible while users work through identity stages. The identity controls and contextual explanations support the canvas rather than replacing it. Desktop, tablet, and mobile previews remain simultaneously available according to M01/M02/M05/M06.

## Suggested stage navigation

1. Visual direction.
2. Color palette.
3. Typography.
4. Image direction.
5. Shared component styles.
6. Spacing and layout.
7. Review and confirmation.

Stages are navigational aids, not gates. Users can move backward, revisit a stage, or continue elsewhere. The sequence does not create or alter M01 level/mission completion semantics.

## Direction gallery

Each direction entry presents:
- Name and short plain-language description.
- Representative preview.
- Controlled visual descriptors.
- Website-purpose applicability where useful.
- Supported aspects that can be selected or combined.

Actions:
- Open a larger preview.
- Compare selected candidates.
- Choose a starting direction.
- Explicitly choose supported aspects from another direction.

Comparison and inspection do not mutate the project identity.

## Palette selection and editing

Show palette alternatives with semantic role labels and a representative preview. Selecting a palette changes the draft identity and immediately updates preview surfaces.

Supported color adjustment controls are tied to semantic roles. Show the selected value, affected roles, and contrast results for relevant combinations. If a combination fails, explain the failing roles and show optional authored alternatives. Never silently replace the selected value.

## Typography selection

Show font pairings with representative headings, body paragraphs, labels, buttons, and captions. Explain the role of each font and the supported hierarchy preset. A selection updates the draft preview immediately.

Only authored font choices and supported weights/type scales are exposed. Unavailable font/fallback behavior must be represented accurately in preview.

## Image direction

Present visual examples and concise descriptors for image style, mood, composition, and treatment. Allow the user to specify the direction through supported selections. Do not imply that choosing a direction supplies or generates an image.

Existing asset references and generic placeholders remain governed by M04/M06. Asset upload/storage interaction is not expanded by M09.

## Shared style and spacing choices

Present curated examples for supported button/form styles and spacing/layout presets. Clearly distinguish:
- A project-level identity token.
- A sample-specific finite option.
- A sample feature that does not support the identity token.

Only compatible sample previews should be shown as consuming a token. An unsupported sample must not be visually altered through an undocumented fallback.

## Draft and active identity states

The interaction distinguishes:
- **Active identity:** currently confirmed project identity.
- **Draft identity:** temporary edits being previewed.
- **Review findings:** informational results for the current draft.
- **Confirmation:** explicit user action to make the draft active.

Draft changes do not partially mutate the active identity. Confirmation validates the complete draft and applies it atomically. If validation fails at the structural/schema level, show the reason and do not apply partial changes.

Contrast failures are review findings, not structural validation failures that block all exploration or confirmation. Communicate them clearly.

## Existing component effects

Before confirmation, summarize the categories of compatible styles that will change and any known compatibility/review findings. Do not imply that component membership or order will change.

After confirmation:
- Shared compatible identity styles update in relevant previews.
- Component structure and content remain unchanged.
- Sample version references remain unchanged.
- Responsive ordering and visibility remain unchanged.
- Components needing attention are surfaced for review using existing M01/M08 status semantics where the relevant mission is in scope.

M09 does not create a new mission status.

## Review and completion

The review surface summarizes the selected direction, palette, typography, image direction, shared styles, and spacing presets. It provides representative previews, responsive views, and consistency findings.

The user explicitly confirms the identity. Optional choices may remain at documented defaults; the product must not invent mandatory content requirements that contradict M01/M06 placeholder behavior.

## Error and empty states

- Empty catalogue category: explain that curated options are not yet available; do not fabricate an option.
- Unsupported token: explain that the selected sample does not consume that role.
- Contrast failure: identify the roles and ratio; offer optional alternatives without silent mutation.
- Invalid draft data: identify the invalid field and leave active identity unchanged.
- No active identity: use documented neutral/default preview tokens and allow the user to begin identity creation.
- Missing user assets: continue with purpose-aware placeholders.
- Incomplete optional choices: preserve defaults and allow review/confirmation unless a genuinely required model invariant is missing.

## Accessibility and keyboard behavior

All galleries, comparison controls, palette roles, typography choices, preview controls, and confirmation actions must be operable by keyboard, have clear labels, expose selection state, and provide visible focus. Do not communicate selection or failure by color alone. Respect reduced-motion preferences and text scaling.
