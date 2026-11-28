# M02 — Acceptance Criteria

## Workspace and onboarding
- [ ] A first-time user can understand that the product builds websites from predefined component samples.
- [ ] Essential project information can be entered before workspace entry.
- [ ] The workspace opens with a bounded website canvas visible.
- [ ] Left library/navigation, center canvases, and right contextual properties are discoverable.
- [ ] Panels can collapse and resize without losing project state.
- [ ] Mission guidance can be collapsed and reopened.

## Component portfolio and composition
- [ ] The library is grouped by high-level component type.
- [ ] A component type can contain multiple predefined samples.
- [ ] A sample preview shows its design and supported content fields before insertion.
- [ ] Opening or previewing a sample never inserts it automatically.
- [ ] Users can add a sample to a chosen position or append it.
- [ ] Users can reorder, remove, and replace high-level components.
- [ ] The portfolio can grow without changing the core project composition model.
- [ ] The initial store-focused catalogue does not constrain other website purposes.

## Editing boundary
- [ ] Users can edit only content fields and sample options explicitly supported by the selected sample.
- [ ] Shared title, text, label, link, item, and image-slot edits are reflected across all three canvases.
- [ ] The product does not expose arbitrary typography, colors, spacing, CSS, geometry, or internal freeform layout editing.
- [ ] The experience is not presented or implemented as a Figma-like detailed visual editor.

## Responsive canvases
- [ ] Desktop, tablet, and mobile canvases are visible simultaneously and side by side.
- [ ] All canvases represent the same page and shared component collection.
- [ ] Adding, removing, or replacing a high-level component on desktop updates the shared structure in all three canvases.
- [ ] Tablet and mobile cannot independently add, remove, or replace high-level components.
- [ ] Tablet and mobile can independently reorder existing components.
- [ ] Tablet and mobile can independently hide/show existing components.
- [ ] Hiding a component never deletes it or affects another breakpoint.
- [ ] Desktop, tablet, and mobile ordering/visibility remain independent.
- [ ] Shared content edits propagate to all canvases.
- [ ] Narrow workspaces preserve the side-by-side canvas arrangement using horizontal scrolling or workspace zoom.

## Pages, progress, and persistence
- [ ] Users can add, rename, reorder, and remove pages.
- [ ] Each page has one shared component collection and three responsive layouts.
- [ ] M01 mission/level/overall completion semantics remain intact.
- [ ] Autosave exposes saving, saved, and error states.
- [ ] Undo/redo covers supported composition and content operations.
- [ ] Version restoration restores the full project and preserves a recoverable pre-restore state.

## Review, handoff, and accessibility
- [ ] Dedicated review links to the relevant workspace page/component.
- [ ] Review shows samples, order, responsive visibility, content, placeholders, and unfinished missions.
- [ ] Handoff status is Complete or Incomplete according to M01.
- [ ] Drag/drop has keyboard-operable alternatives.
- [ ] Focus, labels, state, destructive-action feedback, and save errors are accessible.
- [ ] Small-screen builder experience supports preview and essential changes without requiring the full desktop workspace.

## Scope guardrails
- [ ] No AI-selected or AI-generated designs.
- [ ] No automatic sample selection or component arrangement.
- [ ] No arbitrary CSS, pixel-level design editing, or freeform internal layout authoring.
- [ ] No points, badges, prizes, or subjective design-quality scoring.
- [ ] The existing GaGet shell and unrelated routes remain unaffected.
