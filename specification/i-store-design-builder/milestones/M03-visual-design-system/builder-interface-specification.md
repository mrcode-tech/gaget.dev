# M03 — Builder Interface Specification

## Scope

System A defines the application interface used to compose a website. It implements M02's workspace architecture and remains isolated from the existing GaGet shell and unrelated routes.

## Workspace regions

- **Left:** visual component/sample library, page manager, contextual navigation, and relevant structure navigation.
- **Center:** website composition workspace with desktop, tablet, and mobile canvases visible side by side.
- **Right:** contextual properties for the selected high-level component, supported content fields, and finite sample options.
- **Contextual guide:** collapsible mission objective, explanation, examples, and relevant actions.
- **Progress:** compact level/mission status with a fuller overview on demand.

Panels collapse/resize while preserving discoverability and canvas focus. Narrow layouts preserve the three-canvas arrangement using horizontal scrolling or workspace zoom, consistent with M02.

## Core visual states

1. First entry and project onboarding.
2. Empty/initial workspace.
3. Component library by category.
4. Sample gallery with filters and adjustable density.
5. Sample comparison and enlarged preview.
6. Sample confirmation before insertion.
7. Selected component and content properties.
8. Three synchronized responsive canvases.
9. Breakpoint-specific ordering and visibility controls.
10. Contextual mission guide and progress overview.
11. Saving, saved, save-error, undo/redo, and version-history feedback.
12. Dedicated review and handoff.

## Interaction presentation

Make selection, insertion, replacement, reordering, visibility, and editing states unmistakable. Previewing a sample never inserts it. Insertion and destructive actions require clear user intent and feedback. Identify whether an edit is shared or breakpoint-specific. Preserve keyboard alternatives to drag/drop. Show focus, hover, selected, disabled, loading, error, and confirmation states.

The properties panel is bounded to supported content fields and finite sample options; it is not a general visual inspector.

## Sample gallery

Provide component-type navigation; optional visual-style and website-purpose filters; adjustable density; sample name and concise metadata; multiple visible previews where space permits; enlarged and contextual page previews; and an explicit user-controlled selection/confirmation action. Do not rank samples as objectively best or automatically recommend/choose one.

## Responsive and accessible behavior

System A supports the M02 desktop workspace and a simplified small-screen review/essential-editing experience. This is distinct from the mobile website canvas. Essential actions need keyboard access, visible focus, accessible names, understandable feedback, and suitable target sizes.

## Visual quality

Apply M03 identity and token rules. The builder should be calm and focused but not sterile or generic. Prioritize the website canvas and sample previews over decorative application chrome.
