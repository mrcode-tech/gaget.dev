# Product Requirements

## Product scope

The product helps a non-designer create a wireframe-oriented visual design for a website through a guided sequence of levels. The user makes the design decisions. The product provides explanations, examples, a curated library of high-level components and patterns, a bounded canvas, and progress tracking.

## Primary user outcomes

- Explain the website's purpose, audience, and intended visitor outcome.
- Choose the pages and high-level components the website needs.
- Select component patterns and configure their available options.
- Arrange and reorder components into a deliberate page structure.
- Supply content upfront or progressively, while retaining placeholders for unfinished content.
- Define where images belong without needing final image assets.
- Preview the design as a wireframe across desktop, tablet, and mobile.
- Produce a complete design or a useful partial design that communicates the user's intent to a developer.

## Functional requirements

### Project definition
- Capture project name, purpose, audience, offering/subject, and intended visitor outcome.
- Accept free-text descriptions and optional structured choices.
- Allow users to edit the project definition at any time.
- Do not impose a fixed industry, business category, or universal page list.

### Guided levels
- Present levels as an understandable sequence of design tasks.
- Explain the goal and relevance of each task in plain language.
- Show examples and available choices without choosing on the user's behalf.
- Track whether each required mission is complete.
- Allow users to move forward and backward freely, including revisiting completed levels.
- Do not use points, prizes, badges, leaderboards, timers, or competitive scores.
- Do not lock ordinary design capabilities behind level completion.

### User-directed composition
- Provide a categorized library of high-level website components and patterns.
- Let users choose which components to include, which pattern/variant to use, and the order.
- Support add, remove, replace, reorder, and available pattern-specific configuration.
- Make all relevant component families discoverable; levels introduce and explain them but do not permanently gate access.
- Do not automatically insert, select, rank, or recommend components as the preferred design.
- Do not expose arbitrary CSS or low-level technical layout controls as core interactions.

### Wireframe canvas
- Keep a bounded website canvas visible from the first workspace visit.
- Update the canvas immediately when the user applies a choice.
- Render page hierarchy, section shapes, text hierarchy, content slots, and image placeholders.
- Use neutral wireframe treatments by default; visual styling may be represented as a light design direction where needed, but final asset production is not required.
- Allow optional user-provided reference images or logos without making them mandatory.
- Do not require a stock image library or actual images to complete the design.

### Content
- Let users enter available content during project setup or when a relevant level is reached.
- Allow text to be real, draft, or explicitly marked as placeholder/to-be-written.
- Let users describe image intent and placement through labeled image placeholders.
- Preserve optional user-supplied photos or references as assets associated with the relevant placeholder.
- Clearly distinguish supplied content, placeholder content, and missing content.

### Responsive design
- Provide desktop, tablet, and mobile previews.
- Present curated responsive patterns and understandable choices.
- Let the user decide how selected components adapt at each viewport.
- Avoid requiring CSS media queries, breakpoint values, or technical measurements.

### Progress and persistence
- Preserve project state and mission completion.
- Completion is a progress indicator, not a reward or permission gate.
- Support revision of previous choices without losing unrelated work.
- Provide reliable save and recovery appropriate to the MVP architecture.

### Review and handoff
- Show the current design even when some levels are incomplete.
- Summarize the user's purpose, selected pages/components, patterns, order, content, and placeholders.
- Identify unfinished decisions and remaining work without scoring subjective design quality.
- Produce a complete visual design when all required levels are complete.
- Preserve a useful partial design/handoff at any earlier point.

## Non-functional requirements

- Implement as an isolated module inside the existing Next.js application.
- Keep the existing GaGet shell and unrelated routes unchanged.
- Use a typed, structured project representation so the wireframe can be rendered deterministically.
- Keep editing interactions understandable, accessible, and keyboard-operable.
- Support representative desktop, tablet, and mobile viewport sizes.
- Use stable identifiers for pages and sections so reordering preserves references.
- Test mission completion as objective required-field/required-choice checks, not subjective aesthetic scoring.
- Avoid AI services or external AI dependencies in the initial release.

## Requirement traceability

Every implemented requirement maps to a milestone and feature ID, a user/system story, acceptance criteria, and automated or documented verification evidence. Detailed interactions and technical contracts belong in their relevant milestones.

## Approved M01 journey and progression requirements

The 11-level journey is: Define the website; Explore visual direction; Build shared website frame; Design homepage introduction; Build homepage content; Complete homepage; Design responsive behavior; Plan additional pages; Design additional pages; Review website; Complete design and handoff. The first complete example is store-focused, but the builder remains generic for other website purposes.

### Mission and level progress
- All levels are accessible from the beginning; users can navigate freely and leave unfinished missions without interruption.
- Each level defines its own required and optional missions.
- Users can explicitly select Not needed where applicable.
- Missions complete automatically when objective requirements are satisfied.
- Mission statuses are Not started, In progress, Complete, and Needs review.
- Users may explicitly mark a level complete while missions remain unfinished; this does not waive or change mission statuses.
- Overall design completion requires all applicable required missions and explicit final-review confirmation.
- Show both level status and mission completion percentage; do not add rewards, scores, or competitive mechanics.
- When earlier decisions change, preserve existing work, mark affected missions Needs review, and show the dependencies.

### Component insertion and responsive workspace
- Insert a component after the user confirms its pattern and options; allow a chosen insertion position or append-to-bottom.
- Support free drag-and-drop and reordering without progression restrictions.
- Provide desktop, tablet, and mobile canvases for the same website.
- Share component identity, content, and shared configuration across breakpoints while keeping layout state independent.
- Let users independently reorder and hide/show components in tablet and mobile without deleting the shared component or changing other breakpoints.
- Let users customize supported layout and presentation options independently per breakpoint, using high-level controls rather than CSS terminology.

### Placeholder configuration
- Components may contain generic image or file placeholders.
- After adding a component, users can configure each placeholder's purpose and optionally provide their own image or file content.
- Unfilled placeholders remain valid unless a relevant level explicitly requires the content.

### Review and handoff
- Users may export at any time; the output must clearly identify Complete or Incomplete status.
- Overall completion requires all applicable required missions and final user confirmation.
- Incomplete output preserves purpose, decisions, page/component structure, placeholders, unfinished missions, and decisions needing attention.
