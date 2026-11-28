# M02 — UX Architecture and Interaction Design

## Status

**Approved — M02 UX architecture baseline complete.**

This approval records the workspace architecture, screen/navigation model, component sampling and composition model, responsive interaction rules, persistence expectations, review experience, and editing boundaries. It is a product/UX planning approval; it does not claim application implementation or testing is complete.

## Strategic purpose

Translate the approved M00 product strategy and M01 11-level journey into an understandable workspace for people who are not professional designers. The product helps users build a website by selecting from a curated and progressively expanding portfolio of predefined high-level component designs, arranging those components, and supplying their own content.

**This is a high-level website composition builder, not a detailed visual design editor like Figma.** Users choose and assemble predefined component designs. They may edit supported content fields such as titles, text, labels, and images, but they do not freely redesign the internal visual structure, styling, or detailed geometry of a selected pattern.

## Product interaction principles

1. **Sample, select, compose:** users browse multiple predefined design samples for a component type, select one, and add it to their website.
2. **High-level composition:** the main creative activity is selecting, ordering, showing, and hiding top-level page sections.
3. **Content customization, not visual authoring:** users can edit supported text and image content, but cannot freely alter the detailed design of a sample.
4. **User agency:** the product never silently chooses, inserts, ranks, recommends, or arranges components.
5. **Progressive component portfolio:** the product team can add more samples and component types over time without changing the core composition model.
6. **Guidance without restriction:** levels and missions explain choices but do not lock the component library or ordinary editing.
7. **Responsive consistency:** one shared website structure is presented in three simultaneously visible responsive canvases.
8. **Reversible work:** autosave, undo/redo, and version history protect user decisions.
9. **Bounded website preview:** the canvas represents a website page, not an infinite artboard or unrestricted pixel editor.
10. **No low-level design tooling:** no arbitrary CSS, freeform geometry, layer-level visual editing, or detailed Figma-like design controls in the initial product.

## Workspace architecture

### Overall experience

A hybrid workspace combines a persistent visual website composition area with guided missions and contextual instructions.

### Main regions

- **Left panel:** visual component library, page manager, contextual level/mission navigation, and component/layer list where appropriate.
- **Center workspace:** three simultaneous website canvases—desktop, tablet, and mobile—plus page selection and preview controls.
- **Right panel:** contextual properties for the selected high-level component or editable content field.
- **Contextual guide:** collapsible mission objective, explanation, examples, and relevant actions.
- **Progress overview:** compact level and mission progress with access to a full overview.

Panels can collapse and resize. The workspace should preserve useful canvas space and provide clear panel restoration controls.

### Navigation and onboarding

1. Show a short introduction explaining that the user builds a website from predefined component designs.
2. Collect essential project information: project name, purpose, audience, offering/subject, and intended visitor outcome.
3. Open the workspace with the bounded website canvas visible.
4. Keep all 11 M01 levels accessible from the beginning.
5. Allow users to navigate freely, revisit decisions, and leave missions unfinished.

Navigation is contextual rather than a permanently dominant level list. Page management and component browsing remain easy to discover.

## Component portfolio and sampling model

### Component taxonomy

The left-side component library is a visual catalogue organized by high-level component type. Initial categories may include:

- Navigation: navbar, sidebar, menu.
- Introduction: hero and page introduction.
- Store: product list/grid, category list, featured products.
- Content: text, image, feature, story/about, process.
- Social proof: testimonials and reviews.
- Conversion: promotional section and call to action.
- Information: FAQ, contact, location, service details.
- Closing: footer and related closing sections.

The catalogue is generic and extensible. Store-focused samples provide the first complete example, but the product is not hardcoded to stores.

### Samples and patterns

- Each component type may have multiple predefined design samples.
- A sample is a curated, internally consistent design for that high-level component.
- The user can inspect and compare available samples before choosing one.
- The sample catalogue grows progressively as new component types and designs are authored.
- The product does not automatically select a sample or label one as objectively best.
- The chosen sample defines the component's internal visual structure and supported content slots.

### Add and compose

- Users may select a sample or drag it from the library to the desktop canvas.
- Before insertion, show a clear preview and the content fields the sample supports.
- Users choose the insertion position or append it to the page.
- Adding a high-level component on desktop adds the shared component to tablet and mobile as well.
- Users can reorder, hide/show, remove, or replace components according to the responsive rules below.
- Replacing a sample changes the component's predefined design; preserve compatible content fields where possible and clearly identify content that cannot be carried over.
- No component is inserted without a user action.

### Editing boundary

Supported customization is limited to defined content fields and sample options, such as:
- Title, heading, subtitle, and body text.
- Button labels and supported link destinations.
- Image/photo selection or replacement in defined image slots.
- Supported item data, such as product names, descriptions, and images.
- A finite set of options explicitly exposed by that sample.

Users cannot:
- Change arbitrary typography, colors, spacing, borders, shadows, or detailed styling.
- Move or resize internal elements freely.
- Add arbitrary nested elements or redraw a sample.
- Edit CSS, grids, breakpoints, or pixel geometry.
- Turn the builder into a Figma-like freeform editor.

The properties panel exposes only supported content fields and explicit sample options. It is not a general-purpose visual inspector.

## Three-canvas responsive workspace

### Presentation

- Desktop, tablet, and mobile canvases are visible simultaneously, side by side.
- They show responsive presentations of the same page and shared component collection.
- Desktop is the primary structural composition surface.
- Tablet and mobile are responsive customization surfaces.
- If the workspace is too narrow, keep the canvases side by side and allow horizontal scrolling or workspace zoom. Do not silently replace the arrangement with a single-device tab.
- Workspace zoom changes how the preview is displayed; it does not change the website's simulated viewport.

### Shared website structure

The shared component collection is authored from desktop. Adding, removing, or replacing a high-level component on desktop updates the shared collection and therefore all three canvases.

A component has a stable identity across breakpoints. Shared content and sample configuration are synchronized across all three views.

### Breakpoint-specific presentation

Tablet and mobile cannot independently add, remove, or replace high-level components. They can:
- Reorder existing high-level components independently.
- Hide or show existing components independently.
- Adjust supported responsive presentation options for existing components.

A hide operation affects only the selected breakpoint. It never deletes the component, content, or configuration. A component hidden on one breakpoint remains available in the shared component list and other canvases.

Desktop reordering does not overwrite tablet/mobile ordering. Tablet/mobile reordering does not change desktop or each other.

### Scope of changes

The interface must distinguish:
- **Shared changes:** content and sample configuration, reflected across all three canvases.
- **Breakpoint-specific changes:** order, visibility, and supported responsive presentation, affecting only the selected breakpoint.

Selecting a component in any canvas identifies the same shared component instance and makes the editing scope clear before a change is applied.

## Pages and navigation

- Provide a page manager and a canvas page selector.
- Users can add, rename, reorder, and remove pages.
- Each page has its own shared high-level component collection and three responsive layouts.
- Navigation relationships are user-defined.
- The initial example may be a store, but page types and component categories remain generic.

## Mission guidance and progress

- Use a collapsible contextual guide for mission objective, explanation, examples, and relevant actions.
- Show compact level and mission progress, with a separate detailed overview.
- Preserve M01 semantics: mission completion is objective; level completion is user-declared; overall design completion requires all applicable required missions and final user confirmation.
- No points, badges, prizes, scores, timers, or competitive mechanics.
- Mission guidance never gates normal composition or library access.

## Content and placeholders

- Users can provide content during onboarding or progressively while composing.
- A selected sample exposes only its defined content fields.
- Text may be real, draft, or placeholder.
- Defined image slots use generic placeholders until the user optionally supplies an image/photo.
- Users may specify placeholder purpose and provide their own image or file.
- No stock-image picker or image generation is required for the initial release.

## Saving, history, and recovery

- Save changes automatically.
- Show saving, saved, and save-error states.
- Provide undo and redo for user actions, including component composition, content edits, ordering, visibility, and responsive presentation.
- Maintain version history and allow inspection/restoration of earlier saved project states.
- Restoring a version restores the full website state: pages, component identities, selected samples, content, shared configuration, responsive ordering, visibility, and supported responsive options.
- A restore creates a recoverable history entry; it must not silently destroy the state that existed immediately before restoration.

## Review and handoff

Provide a dedicated review experience with links back to relevant pages and workspace locations. Review includes:
- Project purpose and audience.
- Page list and navigation.
- Selected high-level components and their chosen samples.
- Component order and visibility for desktop, tablet, and mobile.
- Supported content fields and remaining placeholders.
- Incomplete or Needs review missions.

The handoff is available at any time and clearly identifies Complete or Incomplete status. Overall completion follows M01 rules.

## Small-screen builder experience

The builder is desktop-first. On small screens, provide a simplified experience for reviewing responsive previews and making essential content or composition changes. The builder's mobile layout is distinct from the mobile website canvas being designed.

## Accessibility and interaction feedback

- All primary actions must be keyboard accessible.
- Provide visible focus, labels, and understandable control names.
- Drag-and-drop must have an equivalent select-and-place or move controls.
- Confirm destructive shared structural actions when needed and provide undo.
- Provide clear insertion indicators, selection states, hidden states, and save feedback.
- Do not rely on color alone to communicate state.
- Use plain language rather than design-tool or CSS jargon.

## Scope exclusions

- Detailed Figma-like visual editing.
- Arbitrary styling, CSS, freeform positioning, layer editing, or pixel-level controls.
- User-authored component templates in the initial release.
- AI design generation or recommendations.
- Automatic component selection, insertion, or arrangement.
- Stock-image selection or generated imagery.
- Production code generation, hosting, or publishing.

## Dependencies and downstream ownership

- **M00:** product guardrails and user-directed strategy.
- **M01:** approved journey, mission semantics, and initial shared-component/independent-layout model; refined here with desktop-originated structure.
- **M03:** visual design system for the builder interface and sample presentation conventions.
- **M04:** project, page, component identity, sample, content-slot, breakpoint layout, history, and mission data contracts.
- **M05:** isolated application workspace and panel architecture.
- **M06:** sample-driven high-level composition engine and bounded rendering.
- **M07:** authored sample portfolio, taxonomy, examples, and guidance.
- **M08:** mission and progress runtime.
- **M10–M12:** page/component composition and responsive behavior.
- **M13–M14:** content readiness, review, and handoff.

## Deliverables

- Approved workspace and navigation architecture.
- Component sampling and high-level composition interaction model.
- Three-canvas responsive behavior and editing permissions.
- Content customization boundary.
- Page management, mission guidance, and progress behavior.
- Autosave, undo/redo, version history, and recovery expectations.
- Review, handoff, accessibility, and small-screen behavior.
- Testable acceptance criteria and downstream ownership.

## Definition of done

- [x] The hybrid workspace and three-region layout are defined.
- [x] Onboarding, navigation, page management, and progress presentation are defined.
- [x] The component portfolio and sample-selection model are defined.
- [x] The product is explicitly not a detailed visual editor like Figma.
- [x] Supported content customization and prohibited low-level editing are explicit.
- [x] Desktop-originated shared structure and responsive editing permissions are explicit.
- [x] Three canvases remain simultaneously visible, including in narrow workspace conditions through scrolling/zoom.
- [x] Autosave, undo/redo, version history, and recovery expectations are defined.
- [x] Review, handoff, accessibility, and small-screen behavior are defined.
- [x] Downstream milestone ownership is identified.

**Planning status:** Approved. Application implementation and verification remain in their respective milestones.
