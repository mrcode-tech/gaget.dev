# Website Design Builder — User Journey

## Product concept

A generic, user-directed, game-like website design experience for people who do not have professional design skills. Users create their own visual website wireframe by choosing high-level components and patterns, configuring available options, and freely arranging the components.

The product supports stores, independent professionals, creators, organizations, non-profits, and other website projects. The first complete example and initial journey content should be store-focused, but the product model remains industry-neutral.

Levels, missions, explanations, and examples guide the user; they do not make design decisions. There are no points, prizes, badges, achievements, leaderboards, timers, streaks, reward economies, or subjective design-quality scores. The initial product has no AI generation or design recommendations.

## Project setup — define the website

Users describe:
- Project/website name.
- What the website is about and what it offers or communicates.
- Intended audience.
- Main website purpose and desired visitor outcome.
- Optional notes, inspiration, existing brand context, or available content.

Users may provide content upfront or progressively. Final copy and production imagery are not required to begin.

## Core workspace

- **Canvas:** a bounded visual preview of the website, visible from the first workspace visit.
- **Component library:** a browsable catalogue of high-level website components and patterns. Users decide what to add.
- **Configuration:** selecting a component exposes the options supported by its chosen pattern.
- **Insertion:** after confirming a component pattern and its options, the user can choose a position or append it to the bottom.
- **Composition:** users can drag and drop, reposition, reorder, replace, remove, and configure components freely.
- **Levels:** missions explain design concepts and guide decisions; they do not gate component-library access or ordinary editing.
- **Navigation:** all levels are accessible from the beginning. Users may move forward or backward, skip, pause, and revisit at any time.
- **Progress:** level status and mission completion percentage are visible. Progress is not a reward and does not unlock editing capabilities.
- **Responsive workspace:** desktop, tablet, and mobile are three canvases/views of the same website, with shared components and independently editable breakpoint layouts.
- **Content:** text may be supplied, drafted, or explicitly left as a placeholder.
- **Assets:** image/file regions are generic placeholders initially. Users can specify their purpose and optionally supply their own content after inserting a component.
- **Handoff:** the project preserves intent and current design whether complete or incomplete.

## Approved 11-level journey

### Level 0 — Define the website
Describe the website, project purpose, audience, offering/subject, and desired visitor outcome. The user can revise this brief later.

### Level 1 — Explore visual direction
Explore visual examples and choose a direction if desired. Examples teach vocabulary; the user makes the selection. The canvas remains visible.

### Level 2 — Build shared website frame
Browse header, navigation, and footer components. Choose patterns, configure their options, and decide their content and links. Users can revisit these choices later.

### Level 3 — Design homepage introduction
Browse hero/introduction patterns. Choose one, configure its options, enter a headline or placeholder, define the intended visual region, and place it in the page.

### Level 4 — Build homepage content
Browse relevant component families such as products, categories, services, featured items, benefits, story, process, gallery, testimonials, FAQ, or other sections. Choose which components to use, configure them, and arrange them in the desired order. No component is mandatory merely because it exists.

### Level 5 — Complete homepage
Decide whether the homepage needs closing information and actions such as contact details, a call to action, location, booking information, social links, or other relevant content. Configure and arrange selected components, then review the homepage structure.

### Level 6 — Design responsive behavior
Work with desktop, tablet, and mobile canvases. Desktop may be composed first, but tablet and mobile remain independently editable. Users can customize component order, supported layout options, and visibility in each breakpoint.

### Level 7 — Plan additional pages
Decide whether the website needs other pages. Choose page types, names, and navigation relationships. Users can add, remove, rename, and reorder pages.

### Level 8 — Design additional pages
Build each selected page by choosing components and patterns from the library. Configure and arrange components independently per page. Reuse shared elements where the user chooses.

### Level 9 — Review website
Review pages, navigation, component order, responsive layouts, content, and image/file placeholders. Checks report missing required mission decisions and structural omissions only; the product does not judge subjective design quality.

### Level 10 — Complete design and handoff
If all applicable required missions are complete and the user confirms the final review, present the complete visual website wireframe/design. Otherwise preserve and export a useful incomplete design with the project goal, decisions, current structure, placeholders, and remaining work.

## Level, mission, and progress behavior

- Each level defines its own required and optional missions.
- Users explicitly select **Not needed** when a mission/component is irrelevant and that option is supported.
- A mission automatically becomes Complete when its required decisions are satisfied.
- Mission statuses are Not started, In progress, Complete, and Needs review.
- Users can explicitly mark a level complete even if some missions remain unfinished.
- Level completion does not waive or change unfinished mission statuses.
- Overall design completion requires all applicable required missions to be complete (or explicitly Not needed where supported) and user confirmation of the final review.
- Users can leave unfinished missions and continue elsewhere without interruption.
- When an earlier decision changes, existing work is preserved and affected missions are marked Needs review. Dependencies are shown at that time; the product does not silently rewrite later decisions.
- Progress shows level status and mission completion percentage, without reward framing.

## Responsive design — shared components, independent layouts

Desktop, tablet, and mobile are responsive presentations of the same website, not independent websites.

### Shared behavior
- A component added to the website is available across all breakpoints by default.
- Component identity, content, and shared configuration stay synchronized.
- Shared content changes are reflected across the three views.

### Breakpoint-specific behavior
Each breakpoint has its own editable layout state. Users can independently:
- Reorder components.
- Change supported layout and arrangement options.
- Hide or show a component in that breakpoint.
- Customize the component's presentation using understandable high-level controls.

Hiding a component in tablet or mobile does not delete it, its content, or its configuration. It does not hide the component in other breakpoints. Reordering or hiding a component in one view does not silently change another view.

Users may complete desktop first and then customize tablet and mobile. Desktop completion does not mean the other views have been reviewed or completed. The user can always open and edit each canvas.

Use guided patterns and plain-language controls. Do not require CSS, media queries, grid terminology, or numeric breakpoint controls. The canvas remains bounded to the website page, not an infinite artboard.

## Content and asset behavior

- Users may enter text/content upfront or when a level asks for it.
- Real text, draft text, and explicit placeholders are supported.
- Components may contain image or file placeholders appropriate to their purpose.
- Placeholders begin as generic wireframe regions.
- After adding a component, users can configure each placeholder, specify its intended purpose, and optionally provide their own image or file content.
- Placeholder purpose and supplied content are associated with the relevant component instance.
- An unfilled placeholder is allowed unless the relevant level explicitly requires that content.
- The initial product is not an image-generation or stock-image selection tool.
- Replacing placeholders with production assets can happen later in the implementation workflow.

## Product rules

1. The canvas is visible from the beginning.
2. The user makes all creative decisions.
3. The component library is browsable; levels teach but do not lock capabilities.
4. Users can move between levels and revise choices freely.
5. Mission completion is objective and does not assess aesthetic quality.
6. Level completion is separate from mission completion.
7. There are no reward or competitive game mechanics.
8. The initial experience has no AI generation or recommendation.
9. Desktop, tablet, and mobile share component identity/content but have independent layouts.
10. A partial design is preserved and useful to a developer.

## Design principle

The experience should feel like a guided visual construction journey—not a conventional game economy, an AI designer, or a simplified professional design editor. The user is assembling their own website from understandable high-level choices.


## M02 refinement — sample-based composition and three-canvas workspace

The detailed UX model approved in [M02](milestones/M02-ux-architecture/README.md) refines the general composition behavior described above.

### Build from predefined samples
Users build the website by browsing multiple predefined design samples within each high-level component type, selecting a sample, and adding it to the page. The component portfolio grows progressively as the product adds more component types and samples.

Users may edit the content fields supported by a selected sample—such as titles, text, button labels, links, product data, and images. They do not redesign the sample's internal visual structure, freely move nested elements, or edit arbitrary styling. This is a high-level website composition builder, not a Figma-like detailed visual editor.

### Desktop-originated shared structure
Desktop is the primary structural composition surface. Adding, removing, or replacing a high-level component on desktop updates the shared component collection in desktop, tablet, and mobile. Tablet and mobile cannot independently add, remove, or replace high-level components.

Tablet and mobile can independently reorder existing components, hide/show them, and adjust supported responsive presentation. Shared content and sample configuration remain synchronized across all three views.

### Simultaneous responsive canvases
Desktop, tablet, and mobile are displayed simultaneously side by side. If the workspace is too narrow, users scroll horizontally or zoom the workspace presentation; the interface does not switch to a single-device tab as its default arrangement.
