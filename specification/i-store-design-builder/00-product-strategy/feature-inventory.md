# Feature Inventory

This inventory describes the approved product scope and future opportunities. Priority: P0 = initial release/core, P1 = later enhancement, P2 = optional future capability. AI is not a dependency of the initial release.

## 1. Project definition
- P0: create a project with name, purpose, audience, offering/subject, and intended outcome.
- P0: accept free text and optional structured answers.
- P0: allow project details to be revised at any time.
- P1: multiple saved projects and richer project profiles.

## 2. Guided design journey
- P0: levels and missions with plain-language objectives and completion criteria.
- P0: explanations and visual examples for design concepts.
- P0: forward/backward navigation and unrestricted revisiting.
- P0: visible progress state without reward mechanics or competitive scoring.
- P1: richer learning material and optional walkthroughs.

## 3. User-directed component library
- P0: categorized high-level website component library.
- P0: multiple curated patterns/variants for core component types.
- P0: user chooses which components to include and their order.
- P0: add, remove, replace, reorder, and configure available pattern options.
- P0: component library remains discoverable; levels introduce concepts but do not gate normal editing.
- P1: expanded pattern catalogue and additional component families.
- P2: user-created pattern presets, subject to product simplicity.

## 4. Wireframe composition
- P0: bounded website canvas visible from the beginning.
- P0: wireframe page and section rendering.
- P0: text hierarchy, content slots, image placeholders, and clear section boundaries.
- P0: immediate canvas update after user choices.
- P1: optional presentation styling and shareable preview modes.
- P2: advanced visual editing only if it preserves the high-level interaction model.

## 5. Website structure
- P0: homepage composition and shared header/footer patterns.
- P0: user-selected sections and custom section order.
- P1: additional page templates and connected navigation.
- P1: reusable shared elements across pages.
- P2: complex dynamic page types and specialized website functions.

## 6. Content and assets
- P0: content can be entered upfront or progressively.
- P0: real text, draft text, or explicit content placeholders.
- P0: image placeholders with user-defined purpose/description.
- P0: optional user-supplied reference image, logo, or photo.
- P1: asset library and richer asset management.
- P2: optional AI-assisted content/image capabilities may be evaluated separately in the future; never assume them.

## 7. Responsive design
- P0: desktop, tablet, and mobile preview.
- P0: curated responsive patterns and guided user choices.
- P1: additional responsive variants and more granular per-component options.

## 8. Progress, revision, and save
- P0: objective mission completion tracking.
- P0: free navigation between levels.
- P0: revise previous decisions without losing unrelated work.
- P0: persistence and recovery appropriate to MVP.
- P1: version history and project duplication.

## 9. Review and handoff
- P0: complete visual wireframe/design only after all applicable required missions are complete and the user confirms the final review.
- P0: useful partial project representation at any point.
- P0: project purpose and intended outcome preserved for developer understanding.
- P0: explicit list of selected elements, placeholders, and unfinished work.
- P1: downloadable structured handoff package and human-readable specification.
- P2: direct integrations with design/development tools.

## 10. Platform and operations
- P0: isolated module in the existing Next.js app.
- P1: accounts, cloud projects, recovery, sharing.
- P2: collaboration, templates marketplace, subscriptions, commercial capabilities.

## Explicit exclusions from initial release

- AI choosing, recommending, generating, or arranging design elements.
- AI-generated copy or images.
- Points, badges, prizes, leaderboards, timers, or design-quality scores.
- Automatic component selection or automatic page ordering.
- Required final images or stock-image selection.
- Arbitrary CSS, unrestricted pixel placement, or infinite canvas.
- Production code generation, hosting, and publishing.

## Cross-cutting constraints

The product remains industry-neutral, user-directed, wireframe-first, reversible, and useful even when incomplete. The existing GaGet shell must remain unaffected.

## Approved M01 additions

### Journey and progression
- P0: approved 11-level journey from website definition through complete design and handoff.
- P0: all levels accessible from the beginning, with unrestricted navigation and revision.
- P0: per-level required/optional missions, explicit Not needed choices where applicable, and automatic objective mission completion.
- P0: separate level-completion state, mission-completion state, and overall design-completion state.
- P0: mission statuses Not started, In progress, Complete, and Needs review.
- P0: preserve work and flag affected missions when earlier decisions change; reveal dependencies at that time.
- P0: show level status and mission completion percentage without reward mechanics.

### Responsive composition
- P0: desktop, tablet, and mobile canvases for the same website.
- P0: shared component identity, content, and shared configuration across breakpoints.
- P0: independent breakpoint layouts, including independent component ordering and visibility.
- P0: hide/show a component per breakpoint without deleting it or affecting other breakpoints.

### Content and handoff
- P0: generic image/file placeholders configurable after component insertion, with purpose descriptions and optional user-supplied content.
- P0: export at any time with explicit Complete or Incomplete status.
- P0: final design completion requires all applicable required missions and user confirmation of the final review.

The initial complete example is an online store; the reusable builder remains generic and industry-neutral.


## Approved M02 UX additions

### Sample-based website composition
- P0: visual portfolio of high-level component types, with multiple predefined design samples per type.
- P0: explicit user selection and insertion of samples; no automatic sample choice or insertion.
- P0: content-only customization through fields supported by each sample (for example titles, text, labels, links, item data, and image slots).
- P0: no Figma-like detailed visual editing, arbitrary styling, freeform nested-element movement, CSS, or pixel-level layout controls.
- P1: progressively expand the authored portfolio with additional component types and samples.

### Responsive workspace
- P0: desktop, tablet, and mobile canvases visible simultaneously side by side.
- P0: desktop-originated add/remove/replace operations update the shared high-level component collection across all canvases.
- P0: tablet/mobile independently support reordering, hide/show, and supported responsive presentation only.
- P0: shared content and sample configuration synchronize across all canvases.
- P0: narrow workspaces retain side-by-side canvases using horizontal scrolling or workspace zoom.

### Workspace and recovery
- P0: hybrid workspace with collapsible/resizable left library/navigation, center canvases, right contextual properties, and collapsible mission guidance.
- P0: autosave with saving/saved/error states and undo/redo for supported operations.
- P1: version history with safe restoration of the complete project state.
- P0: dedicated review with links back to workspace locations and complete/incomplete handoff status.
