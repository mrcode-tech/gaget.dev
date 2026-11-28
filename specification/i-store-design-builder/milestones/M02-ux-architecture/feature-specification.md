# M02 — Feature Specification

## FS-01 — Project onboarding
- Present a short explanation of the sample-based website builder.
- Capture project name, purpose, audience, offering/subject, and intended visitor outcome.
- Allow users to enter content later; onboarding does not require final copy or images.
- Open the workspace with the website canvas visible.

## FS-02 — Workspace shell
- Provide a flexible workspace with left library/navigation, center canvases, and right contextual properties.
- Panels can collapse and resize.
- Provide a collapsible mission guide and compact progress access.
- Keep the builder module isolated from the existing GaGet shell.

## FS-03 — Component portfolio
- Organize high-level components by component type.
- Each type can contain multiple predefined samples.
- Each sample has a preview, description, supported content fields, and supported options.
- The portfolio can grow by adding component types and samples without changing the user's composition model.
- Samples are authored by the product; user-created design templates are not part of the initial release.

## FS-04 — Sample selection and insertion
- Users select or drag a sample from the library.
- Show the sample preview and editable content slots before insertion.
- Users choose an insertion position or append to the page.
- Insertion is always an explicit user action.
- A desktop insertion creates a shared high-level component visible in all three breakpoint canvases.

## FS-05 — High-level composition
- Support user-directed add, remove, replace, and reorder of top-level page sections.
- Support independent ordering and visibility on each breakpoint, subject to desktop-originated structure.
- Keep stable component identity across breakpoints.
- Preserve compatible content when replacing a sample; disclose incompatible fields that cannot be retained.
- Provide undo for structural changes.

## FS-06 — Bounded content customization
- Expose only fields defined by the selected sample: for example titles, text, labels, links, image slots, and item data.
- Shared content changes appear in desktop, tablet, and mobile.
- Users may supply their own images/files for defined slots.
- Users cannot arbitrarily change internal layout, typography, colors, spacing, element geometry, or nested structure.
- The properties panel is a content/sample-options editor, not a general visual design inspector.

## FS-07 — Three responsive canvases
- Display desktop, tablet, and mobile simultaneously side by side.
- Desktop is the structural source.
- Tablet/mobile inherit shared components and shared content.
- Tablet/mobile users may reorder, hide/show, and adjust supported responsive presentation.
- Tablet/mobile users cannot independently add, remove, or replace high-level components.
- Narrow workspaces retain the side-by-side arrangement using horizontal scrolling or workspace zoom.

## FS-08 — Page management
- Users can add, rename, reorder, and remove pages.
- Each page owns one shared component collection and three responsive layouts.
- Provide both a page manager and a current-page canvas selector.

## FS-09 — Mission guidance and progress
- Present mission objective, explanation, examples, and relevant actions in a collapsible contextual guide.
- Provide compact progress and a detailed overview.
- Preserve M01 mission, level, and overall completion semantics.
- Guidance never blocks ordinary editing.

## FS-10 — Persistence and recovery
- Automatically save edits and expose saving/saved/error states.
- Provide undo/redo for supported user actions.
- Provide version history and safe restoration.
- Restore the full project state and preserve the pre-restore state as a recoverable history entry.

## FS-11 — Review and handoff
- Provide a dedicated review screen with links to the relevant workspace page/component.
- Summarize purpose, pages, samples, ordering, responsive visibility, content, placeholders, and unfinished missions.
- Make complete/incomplete status explicit according to M01.

## FS-12 — Small-screen builder
- Provide a simplified small-screen review and essential-editing experience.
- Do not require the full desktop three-panel editing workspace on a phone.
- Keep the builder's responsive behavior distinct from the mobile website preview.

## Explicitly excluded
- Figma-like detailed design editing.
- Arbitrary CSS or pixel-level controls.
- Freeform internal element movement/resizing.
- AI generation or recommendations.
- Automatic sample selection or composition.
- Stock-image library or image generation.
- Production website publishing or code generation.
