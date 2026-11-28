# Website Design Builder — Product and Development Plan

## 1. Product vision

Build a user-directed, game-like web application in which a person without professional design skills creates a website wireframe/design by choosing high-level components, patterns, options, and order.

The product guides the process through levels, missions, explanations, and examples. It does not design the website for the user. The user is responsible for every creative choice.

The initial product is not AI-powered. It does not generate content, recommend preferred designs, automatically choose components, or arrange pages. Optional AI capabilities may be considered in the future through a separate product decision.

The result is a complete visual website wireframe/design only when all applicable required missions are complete and the user confirms the final review. If the user stops earlier, the saved partial design must still communicate the project goal, selected components, page structure, content placeholders, image intent, and remaining work to a developer or later implementation workflow.

## 2. Product principles

1. **User agency:** the user makes all design decisions.
2. **Guidance, not automation:** levels explain decisions and show examples; they do not choose for the user.
3. **Generic by design:** support different businesses, professions, organizations, and projects without hardcoded industry assumptions.
4. **Wireframe first:** represent hierarchy, components, content slots, and image placement without requiring production assets.
5. **High-level composition:** use curated components and patterns rather than technical CSS or arbitrary pixel editing.
6. **Free navigation:** users can move forward/backward and revise any previous decision.
7. **No reward mechanics:** level completion records progress; no points, badges, prizes, achievements, leaderboards, timers, or scores.
8. **Visible canvas:** the bounded website canvas is present from the beginning and updates as the user makes choices.
9. **User-owned content:** users provide content upfront or progressively; placeholders remain valid.
10. **Responsive choices:** users select from curated responsive patterns and guided options.
11. **Useful partial work:** incomplete projects remain understandable and handoff-ready as a record of intent and progress.

## 3. Two distinct journeys

- **Product-development journey:** the milestones the product team follows to define, design, build, and verify the application.
- **User design journey:** the levels through which the user defines and composes their website.

Do not confuse product-development milestones with user-facing levels.

## 4. Product-development plan

### Phase 0 — Product strategy and requirements

**Tasks**
- Confirm broad target audience, initially optimized for small businesses and independent professionals.
- Define generic website purposes and project contexts.
- Define user agency: the user selects components, patterns, options, and order.
- Define the initial product as non-AI and wireframe-first.
- Define upfront/progressive content entry and image-placeholder behavior.
- Define free level navigation, objective completion, and no reward mechanics.
- Define complete and partial design outcomes.

**Deliverables**
- Product vision, requirements, feature inventory, roadmap, MVP, and glossary.

**Exit criteria**
- The team can explain the product and its boundaries consistently.
- The user is clearly the designer; the product provides guidance only.

### Phase 1 — Journey and level architecture

**Tasks**
- Define levels, missions, their purpose, and objective completion criteria.
- Define free navigation, revisiting, and revision.
- Define how levels teach component families without restricting library access.
- Define how project progress is represented without scores or rewards.
- Define how incomplete work is preserved.

**Deliverables**
- Level map, mission definitions, completion model, and progress rules.

**Exit criteria**
- Users always understand the current task and can move to any other level.
- Completion records progress but never controls ordinary design freedom.

### Phase 2 — UX flows and interaction prototypes

**Tasks**
- Prototype project setup and workspace entry.
- Keep the canvas visible from the first workspace view.
- Prototype browsing the component library and comparing patterns.
- Prototype selecting, configuring, inserting, replacing, removing, and reordering components.
- Prototype content entry and placeholder handling.
- Prototype responsive pattern selection and device preview.
- Prototype complete and partial design review/handoff.
- Test with people who have no design-tool experience.

**Deliverables**
- Low-fidelity flows, clickable prototype, interaction rules, and usability findings.

**Exit criteria**
- Users understand that they choose the components and their order.
- Users can compose a meaningful wireframe without technical terminology.

### Phase 3 — Product visual design system

**Tasks**
- Design the product shell, levels/progress, bounded canvas, and contextual component library.
- Keep the product UI distinct from the wireframe being designed.
- Define accessible typography, color, spacing, controls, focus, and responsive behavior.
- Avoid reward/score presentation patterns.

**Deliverables**
- Product UI system and core screen designs.

**Exit criteria**
- Users can distinguish the design workspace from the website wireframe.
- The workspace remains usable at supported screen sizes.

### Phase 4 — Domain model and persistence

**Tasks**
- Model project purpose, audience, intended outcome, pages, components, patterns, options, content slots, image placeholders, responsive choices, and mission progress.
- Give pages and components stable identifiers so reordering does not corrupt references.
- Distinguish user-supplied content, draft content, placeholders, and optional reference assets.
- Define schema versioning, save/recovery, and migration behavior.
- Keep mission progress separate from the website design data.

**Suggested entities**
- Project
- ProjectBrief
- Page
- NavigationItem
- ComponentInstance
- ComponentPattern
- ComponentOption
- ContentSlot
- ImagePlaceholder
- ReferenceAsset
- ResponsiveChoice
- LevelDefinition
- MissionDefinition
- MissionProgress
- DesignSnapshot
- HandoffSummary

**Deliverables**
- Domain schemas, validation rules, persistence strategy, and synthetic fixtures.

**Exit criteria**
- A project can be saved, reloaded, revised, and rendered deterministically.

### Phase 5 — Isolated application foundation

**Tasks**
- Implement the feature as an isolated module within the existing Next.js application.
- Do not create a second nested Next.js application.
- Do not change the existing GaGet shell or unrelated routes.
- Implement project routing, workspace layout, bounded canvas, level navigation, and component library.
- Implement save state and essential editing history as agreed.

**Deliverables**
- Isolated feature route, workspace shell, and project loading/saving.

**Exit criteria**
- The workspace renders a synthetic project without affecting existing GaGet functionality.

### Phase 6 — Wireframe composition engine

**Tasks**
- Create a schema-driven renderer for pages and high-level components.
- Build a curated library of component types and patterns.
- Support user-driven add, remove, replace, reorder, and pattern-specific configuration.
- Render text hierarchy, content placeholders, and image placeholders.
- Keep component data separate from rendering components.
- Do not automatically insert or choose components.

**Initial component families**
- Header and navigation.
- Hero/introduction.
- Offering, products, or services.
- Featured work/items.
- Categories or collections.
- Gallery or portfolio.
- Benefits/features.
- Story/about.
- Process/steps.
- Testimonials/reviews.
- Statistics/trust information.
- Call to action.
- FAQ.
- Contact/location/booking information.
- Footer.
- Additional generic/custom section patterns.

**Deliverables**
- Component schema, pattern catalogue, renderer, and composition operations.

**Exit criteria**
- Users can assemble and reorder a meaningful page without writing code.

### Phase 7 — Responsive wireframe behavior

**Tasks**
- Provide desktop, tablet, and mobile previews.
- Offer curated responsive patterns and simple user choices.
- Support shared defaults and understandable per-device choices.
- Avoid technical breakpoint or CSS controls.
- Keep wireframe structure coherent across viewports.

**Deliverables**
- Device preview controls and responsive pattern definitions.

**Exit criteria**
- Users can decide how components adapt without understanding media queries.

### Phase 8 — Mission and progress runtime

**Tasks**
- Store level and mission definitions as data.
- Track objective completion and progress.
- Allow unrestricted forward/backward navigation and revision.
- Preserve partial work and resume state.
- Provide explanations and examples.
- Do not add rewards, scores, capability gates, or AI decisions.

**Deliverables**
- Mission runtime, progress model, and completion feedback.

**Exit criteria**
- Progress is informative, reversible, and never restricts normal editing.

### Phase 9 — Multi-page design

**Tasks**
- Let users decide whether additional pages are needed.
- Let users add, remove, rename, and reorder pages.
- Provide page patterns as choices, not automatic recommendations.
- Let users compose each page from the component library.
- Support user-defined navigation and shared elements.

**Potential page patterns**
- Home, about/story, contact, service overview/detail, product listing/detail, portfolio/work, pricing, FAQ, blog/article, booking information, location, landing page, or custom page.

**Deliverables**
- Page map, page patterns, and navigation editing.

**Exit criteria**
- Users can create a connected multi-page wireframe of their own design.

### Phase 10 — Review and developer handoff

**Tasks**
- Present the current design whether complete or incomplete.
- Preserve project purpose, audience, and intended outcome.
- Show selected pages, component patterns, options, and exact order.
- Show user-provided text, content placeholders, image placeholders, and optional reference assets.
- Identify incomplete missions and decisions still outstanding.
- Distinguish missing required decisions from optional content.
- Produce a human-readable and structured design summary suitable for a developer.
- Mark the visual website design complete only when all applicable required missions are complete and the user confirms the final review; do not imply it is a production website.

**Deliverables**
- Complete/partial design review.
- Handoff summary and structured project representation.

**Exit criteria**
- A developer can understand what the user wants, what has been decided, and what remains to be done.

### Phase 11 — Quality, release, and iteration

**Tasks**
- Unit-test domain rules, mission completion, component operations, and responsive choices.
- Component-test canvas, library, configuration, and previews.
- End-to-end test project setup through complete and partial handoff.
- Test save/recovery and revision.
- Test accessibility and representative viewports.
- Verify the feature remains isolated from existing GaGet routes and styles.
- Collect usability feedback without evaluating subjective aesthetic quality as a score.

**Deliverables**
- Test plan/evidence, release checklist, known limitations, and follow-up backlog.

**Exit criteria**
- The experience is reliable, user-directed, and useful at both complete and incomplete states.

## 5. User design journey

### Level 0 — Define the website
The user describes the website, its purpose, audience, offering/subject, and desired visitor outcome. The brief remains editable.

### Level 1 — Explore visual direction
The user explores examples and chooses a visual direction if desired. Examples explain choices; they do not recommend or select a preferred option.

### Level 2 — Build shared website frame
The user browses header, navigation, and footer patterns, chooses what to include, configures options, and sets the order/content.

### Level 3 — Design homepage introduction
The user browses hero/introduction patterns, chooses one, configures it, and enters real or placeholder text. Image regions remain placeholders unless the user attaches a reference.

### Level 4 — Build homepage content
The user browses the component library, selects the sections they want, chooses patterns, configures options, and arranges the order.

### Level 5 — Complete homepage
The user decides whether to include contact, call to action, location, booking information, social links, or other relevant elements.

### Level 6 — Design responsive behavior
The user works with desktop, tablet, and mobile canvases. Desktop may be composed first, but tablet and mobile have independent layouts. The user can independently reorder components, hide/show them, and customize supported presentation options in each breakpoint.

### Level 7 — Plan additional pages
The user decides which additional pages are needed and creates/organizes them.

### Level 8 — Design additional pages
The user chooses components and patterns for each page and arranges them independently.

### Level 9 — Review website
The user reviews pages, navigation, component order, responsive choices, and placeholders. The product checks mission completion, not aesthetic quality.

### Level 10 — Complete design and handoff
If all applicable required missions are complete and the user confirms the final review, present the complete visual website wireframe/design. Otherwise preserve a useful incomplete design and handoff summary of intent, choices, placeholders, unfinished missions, and remaining work.

## 6. Repeatable level interaction

1. **Objective:** state what the user is deciding.
2. **Explanation:** explain why the decision matters.
3. **Examples:** show available component/pattern examples.
4. **Browse:** let the user explore all relevant choices.
5. **Choose:** user selects the component and pattern.
6. **Configure:** user changes the options available for that pattern.
7. **Arrange:** user places/reorders the component.
8. **Preview:** apply the decision to the canvas immediately.
9. **Complete:** check required mission decisions.
10. **Continue or revisit:** user may go to another level or return later.

## 7. Workspace layout

- **Top bar:** project name, save state, undo/redo, preview, and project overview.
- **Level navigation:** all levels, current location, and completion state. Navigation remains free.
- **Website canvas:** bounded wireframe preview visible from the first workspace visit.
- **Component library:** browsable catalogue of high-level components and patterns.
- **Configuration panel:** contextual options for the selected component/pattern.
- **Device preview:** desktop, tablet, and mobile with guided responsive choices.

The canvas is not an infinite artboard. It represents the actual website structure. It progressively reflects user choices, but is never hidden while the user is completing earlier levels.

## 8. Progress model

Progress exists to orient the user, not reward or control them.

**Include**
- Current level and mission.
- Complete/incomplete state for required mission decisions.
- Ability to jump to any level.
- Ability to revisit and revise completed decisions.
- Save/recovery state.
- A summary of remaining decisions.

**Do not include**
- Points, badges, prizes, achievements, leaderboards, timers, streaks, or scores.
- Locking component types until a level is completed.
- Judging subjective aesthetic choices as right or wrong.

## 9. MVP scope

**Include**
- Project setup and editable project brief.
- Guided levels with explanations and visual examples.
- User-directed component/pattern library.
- Bounded wireframe canvas visible from the beginning.
- Add, remove, replace, configure, and reorder components.
- Real/draft/placeholder text support.
- Image placeholders and optional user reference assets.
- Desktop/tablet/mobile preview with guided responsive patterns.
- Free level navigation, objective completion, and revision.
- Save/recovery appropriate to the MVP.
- Complete and partial design review/handoff summary.

**Defer**
- AI design recommendations or generation.
- AI copy/image generation.
- Automatic component selection or arrangement.
- Production code generation, hosting, and publishing.
- Required final photography or stock imagery.
- Full CMS, ecommerce checkout, payments, and booking backend.
- Arbitrary CSS, pixel-level editing, and infinite canvas.
- Real-time collaboration and marketplace.

## 10. Product acceptance criteria

1. Users can define any reasonable website purpose without being forced into one industry.
2. Users choose components, patterns, options, and order themselves.
3. The product explains and demonstrates choices but does not decide for the user.
4. The canvas is visible from the beginning and reflects every user decision.
5. Users can navigate between levels freely and revise previous work.
6. Completion checks required mission decisions only.
7. There are no rewards, scores, or competitive mechanics.
8. Users can create a useful wireframe without final images.
9. Responsive patterns are understandable without CSS knowledge.
10. A complete project is presented as a complete visual design, not a live website.
11. An incomplete project preserves user intent and communicates decisions and remaining work.
12. The feature remains isolated from the existing GaGet application.

## 11. Future decisions

The following details are refined in later milestones:
- Exact product name and tone.
- Exact level sequence and mission wording.
- Component taxonomy and number of patterns.
- Which pattern options are available.
- Wireframe visual language and optional styling.
- Text field types and placeholder conventions.
- Optional reference-asset handling.
- Responsive pattern catalogue.
- Persistence and project ownership.
- Handoff file formats.
- Any future optional AI capabilities (requires a separate decision).

## 12. Recommended implementation order

1. Approve product strategy and requirements.
2. Define level map and mission completion rules.
3. Prototype project setup, library, canvas, and component operations.
4. Define project/page/component data model.
5. Build isolated workspace and wireframe renderer.
6. Build component and pattern library.
7. Add responsive patterns and device previews.
8. Add progress, free navigation, and save/recovery.
9. Add multi-page composition.
10. Add complete/partial design review and handoff.
11. Verify accessibility, usability, persistence, and regression isolation.

## M01 approved journey and progression baseline

The detailed user-facing journey and completion semantics are approved in [M01 — Journey and Progression Architecture](milestones/M01-game-architecture/README.md). Implementation planning must preserve these rules:

- The 11 levels are: Define the website; Explore visual direction; Build shared website frame; Design homepage introduction; Build homepage content; Complete homepage; Design responsive behavior; Plan additional pages; Design additional pages; Review website; Complete design and handoff.
- All levels are accessible immediately. Users can navigate freely, skip, pause, revisit, and leave unfinished missions without interruption.
- Each level defines its own required and optional missions. Users may explicitly select Not needed where applicable.
- Missions complete automatically when objective requirements are satisfied. Mission statuses are Not started, In progress, Complete, and Needs review.
- Users may mark a level complete even with unfinished missions. This does not change or waive those mission statuses.
- Overall design completion requires all applicable required missions and the user's final-review confirmation.
- Earlier decision changes preserve existing work, mark affected missions Needs review, and reveal the relevant dependencies.
- Progress shows both level status and mission completion percentage, without rewards or scores.
- The responsive workspace uses shared component identity/content and independent desktop, tablet, and mobile layouts. Tablet/mobile support independent reordering and visibility.
- Image/file placeholders are generic initially and configurable with purpose and optional user-supplied content after component insertion.
- Export is available at any time and identifies the design as complete or incomplete.

The first complete journey example should demonstrate an online store, while all project definitions and reusable product capabilities remain generic.


## M02-approved interaction model and implementation guardrails

The implementation must follow the approved [M02 UX architecture](milestones/M02-ux-architecture/README.md).

### Sample-driven composition
- Implement a growing, categorized portfolio of predefined high-level component samples.
- Each sample declares its supported content slots and finite options.
- Users browse, preview, select, and explicitly insert a sample; never auto-select or auto-insert.
- Users compose pages by ordering high-level sections.
- Content editing is limited to supported sample fields such as titles, text, labels, links, item data, and image slots.
- Do not implement Figma-like internal visual editing, arbitrary styling, freeform nested-element movement, CSS controls, or pixel-level geometry.

### Responsive composition
- Render desktop, tablet, and mobile canvases simultaneously side by side.
- Desktop is the structural source for high-level add/remove/replace operations.
- Structural changes update the shared component collection in all three canvases.
- Tablet/mobile permit independent reorder, visibility, and supported responsive presentation; they cannot independently add/remove/replace high-level components.
- Shared content and sample configuration synchronize across breakpoints.
- Preserve the side-by-side canvas arrangement in narrow workspaces with horizontal scrolling or workspace zoom.

### Workspace and persistence
- Use the flexible left library/navigation, center canvases, and right contextual properties layout.
- Provide contextual mission guidance, compact progress, and page management.
- Autosave with clear state feedback; implement undo/redo for supported user operations.
- Version history and safe restoration follow the M02 specification and should be represented in the persistence design before implementation.
