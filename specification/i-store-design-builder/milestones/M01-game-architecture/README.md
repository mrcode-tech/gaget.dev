# M01 — Journey and Progression Architecture

## Status

**Approved — M01 journey baseline complete.**

This approval records the agreed user journey, level structure, mission and level completion semantics, navigation rules, responsive workspace behavior, and complete/partial design outcomes. It does not claim that the application functionality has been implemented or tested.

## Strategic purpose

Translate the M00 user-directed product strategy into a clear, reversible, game-like journey that helps non-designers create their own website wireframe/design. The journey provides education and structure without taking design decisions away from the user or restricting access to the component library.

## Objectives

- Define the complete 11-level user journey.
- Define how levels, missions, requirements, and progress relate.
- Distinguish level completion from mission completion and overall design completion.
- Define free navigation, revision, and dependency review.
- Define a repeatable mission experience.
- Define user-directed component composition.
- Define desktop, tablet, and mobile canvas synchronization.
- Define content, image/file placeholder, review, and handoff behavior.

## Approved product scope

The builder is generic and supports different website purposes and project types, including stores, independent professionals, creators, organizations, non-profits, and other businesses. The first complete example and initial journey content should be store-focused, without hardcoding store assumptions into the product model or excluding other website types.

The experience is guided and game-like, but it has no points, badges, prizes, achievements, leaderboards, timers, streaks, reward economy, or subjective design-quality scores. Users make all creative decisions. AI generation, recommendations, and automatic design choices are excluded from the initial release.

## Approved 11-level journey

| Level | Name | Purpose |
|---|---|---|
| 0 | Define the website | Describe the project, purpose, audience, offering, and intended visitor outcome. |
| 1 | Explore visual direction | Learn visual vocabulary and choose a direction if desired. |
| 2 | Build shared website frame | Choose and configure shared header, navigation, and footer patterns. |
| 3 | Design homepage introduction | Choose and configure the homepage hero/introduction. |
| 4 | Build homepage content | Select, configure, and arrange the homepage's main sections. |
| 5 | Complete homepage | Add relevant closing information, actions, and supporting elements; review the homepage structure. |
| 6 | Design responsive behavior | Customize desktop, tablet, and mobile presentations. |
| 7 | Plan additional pages | Decide which additional pages are needed and define their relationships. |
| 8 | Design additional pages | Compose each selected page from user-chosen components and patterns. |
| 9 | Review website | Review the complete page set, navigation, responsive layouts, content, and placeholders. |
| 10 | Complete design and handoff | Confirm the final review and produce a complete or incomplete handoff. |

The level sequence provides guidance. All levels are accessible from the beginning; users can move forward, backward, skip, pause, and revisit without being blocked by earlier levels.

## Level, mission, and overall completion model

### Mission completion

- Each level defines its own required and optional missions according to that level's purpose.
- Required missions are checked using objective decisions or required information only.
- Optional missions do not block completion.
- A user may explicitly mark an irrelevant mission/component as **Not needed** where that choice is applicable.
- A mission is automatically marked **Complete** when its required decisions are satisfied, including an explicit Not needed choice when supported.
- Users may leave any mission unfinished and continue elsewhere without interruption.

### Level completion

- Users explicitly mark a level as complete.
- A user may mark a level complete even when some missions remain unfinished.
- Level completion is a separate user-declared progress state; it does not rewrite, waive, or auto-complete unfinished missions.
- Required and optional mission statuses remain visible after the level is marked complete.

### Overall website-design completion

The website design is officially **Complete** only when:
1. All applicable required missions across the project are complete (or explicitly marked Not needed where supported); and
2. The user confirms the final review.

If either condition is not met, the design remains **Incomplete**, but it is still saved, viewable, and exportable as a useful partial design.

### Mission statuses

- **Not started** — no meaningful work has begun.
- **In progress** — the user has started but has not satisfied the mission requirements.
- **Complete** — objective requirements are satisfied or the user has explicitly selected Not needed where applicable.
- **Needs review** — an earlier decision changed and may affect this mission.

Level completion is tracked separately from these mission statuses. Overall design completion is tracked separately from both.

## Navigation, revision, and dependencies

- Every level is accessible from the beginning.
- Users may move between levels at any time, including while a mission is unfinished.
- Users may revisit and revise any previous decision.
- Changing an earlier decision preserves existing work.
- Potentially affected missions are marked **Needs review** rather than silently rewritten or discarded.
- Dependency information is shown when an earlier decision changes and identifies the later decisions that may need attention.
- The user decides how to resolve affected work; the product must not make unapproved creative decisions automatically.
- Progression never locks normal component-library access or editing capabilities.

## Repeatable mission structure

Each mission should provide:

1. **Title and objective** — what the user is deciding or creating.
2. **Explanation** — why the decision matters, in plain language.
3. **Examples** — illustrative component or pattern examples.
4. **Selection** — the user chooses the relevant component, pattern, or option.
5. **Configuration** — the user configures the options supported by the selected pattern.
6. **Canvas preview** — the user sees the result in the relevant website canvas.
7. **Save and status** — the decision is preserved and mission status is shown.

The mission may adapt its controls to its purpose, but it should retain this understandable structure where applicable. Examples teach; they do not rank or select a preferred design.

## Component library and composition rules

- The component library remains available throughout the journey.
- Users choose which high-level components to add and which pattern/variant to use.
- A component is inserted after the user confirms its pattern and options.
- Users can add a component at a chosen position or append it to the bottom.
- Users can drag and drop, reposition, reorder, replace, remove, and configure components freely.
- Users may make these changes at any time, regardless of current level or mission status.
- The canvas is bounded to the website page; it is not an infinite artboard or unrestricted pixel editor.
- The product does not automatically select, insert, recommend, or arrange components.

## Responsive workspace: shared components, independent layouts

The website design workspace provides three canvases/views: **desktop, tablet, and mobile**. These are responsive presentations of the same website, not three unrelated websites.

### Shared component model

- A component added to the website is available across all breakpoints by default.
- Component identity, content, and shared configuration are synchronized across breakpoints.
- A shared content edit is reflected in all breakpoint views unless a later milestone defines a specific content override capability.

### Independent breakpoint layouts

Each breakpoint has its own editable layout state. Users may independently:
- Reorder components.
- Change supported component layout and arrangement options.
- Hide or show a component in that breakpoint.
- Customize the presentation using understandable high-level controls.

Hiding a component in tablet or mobile does not delete it, remove it from other breakpoints, or erase its content/configuration. Reordering or hiding in one breakpoint does not silently change the order or visibility in another breakpoint.

### Desktop-first progression

The user may complete the desktop composition first. Tablet and mobile views then provide responsive adaptations of the shared components. The user must still be able to open each view and customize it independently; desktop completion does not mean tablet/mobile are automatically considered reviewed or complete.

The product should use guided patterns and plain-language choices. Users should not need to understand CSS, media queries, grid systems, or numeric breakpoint definitions. The canvas remains bounded to the website page.

Detailed breakpoint dimensions, layout capabilities, component-specific responsive options, and responsive validation are refined in the responsive-design and domain-model milestones.

## Content and image/file placeholders

- Users may provide content upfront or progressively.
- Real content, draft content, and explicit placeholders are valid.
- A component may expose image or file placeholders according to its purpose.
- Placeholders begin with a generic wireframe representation.
- After inserting a component, users can configure each placeholder, describe its intended purpose, and optionally supply their own image or file content.
- Placeholder purpose and supplied content are associated with the relevant component instance.
- Leaving a placeholder unfilled does not automatically block a mission unless that level explicitly defines the content as required.
- No stock-image library or image-generation capability is required for this milestone or the initial product scope.

## Review and handoff

The final review covers:
- Project purpose, audience, and intended outcome.
- Pages and navigation relationships.
- Component choices, patterns, options, and order.
- Desktop, tablet, and mobile layouts, including breakpoint-specific visibility.
- Supplied content and remaining placeholders.
- Required missions still incomplete or marked Needs review.

Users may export/share the current design at any time. Every handoff clearly identifies whether the design is **Complete** or **Incomplete**.

The handoff includes the project purpose/audience, completed design decisions, current pages and component structure/order, unfinished missions, content/image/file placeholders, and decisions needing attention. An incomplete handoff remains useful to developers and later implementation workflows.

## Acceptance criteria

- [x] The 11-level sequence and each level's purpose are defined.
- [x] All levels are accessible from the beginning.
- [x] Users can navigate freely and leave unfinished missions without interruption.
- [x] Required and optional missions are determined by each level.
- [x] Not needed is an explicit user decision where applicable.
- [x] Mission completion, level completion, and overall design completion are distinct.
- [x] Users may mark a level complete while unfinished missions remain visible and incomplete.
- [x] Overall completion requires all applicable required missions and final user confirmation.
- [x] Mission statuses and objective completion behavior are defined.
- [x] Changes preserve existing work and mark affected missions Needs review.
- [x] Dependency information appears when earlier decisions change.
- [x] Component selection, insertion, configuration, and free arrangement are defined.
- [x] Desktop, tablet, and mobile share component identity/content but have independent layouts.
- [x] Breakpoint-specific reordering and visibility are supported without deleting shared components.
- [x] Upfront/progressive content and configurable image/file placeholders are defined.
- [x] Complete and incomplete review/handoff behavior is defined.
- [x] No reward mechanics, subjective scoring, AI design choices, or progression-based editing locks are introduced.

## Deliverables

- Approved 11-level journey and level purposes.
- Mission and level completion model.
- Mission status and dependency/revision rules.
- Repeatable mission structure.
- Component composition and free-navigation rules.
- Responsive shared-component/independent-layout behavior.
- Content and image/file placeholder behavior.
- Complete/incomplete final review and handoff rules.

## Dependencies and downstream ownership

- **M00:** approved product strategy and guardrails.
- **M02:** detailed workspace screens, user flows, and interaction design.
- **M04:** project, component, breakpoint-layout, mission, and progress data contracts.
- **M06:** component insertion, editing, ordering, and rendering behavior.
- **M08:** mission validation, level status, progress presentation, and dependency review.
- **M11:** detailed responsive patterns, breakpoint behavior, and responsive validation.
- **M13:** content readiness, placeholders, and final review.
- **M14:** complete/incomplete export and developer handoff.

This milestone defines product behavior. It does not replace the detailed technical contracts and acceptance tests owned by those downstream milestones.

## Definition of done

- [x] Product decisions for the journey and progression architecture are agreed.
- [x] The level map and mission/level/overall completion distinctions are explicit.
- [x] Free navigation, revision, and dependency review are explicit.
- [x] Component freedom and the responsive canvas model are explicit.
- [x] Content, placeholder, review, and handoff rules are explicit.
- [x] Downstream specifications and implementation ownership are identified.
- [x] M00 product guardrails remain intact.

**Planning status:** Approved. Application implementation and downstream verification remain in their respective milestones.
