# MVP Definition

## MVP goal

Prove that a non-designer can independently create a coherent website wireframe/design by choosing high-level components and patterns, configuring their available options, and arranging them through a guided but freely navigable design journey.

The user—not AI or the application—makes every creative decision.

## MVP user journey

1. Create a project and describe its purpose, audience, offering/subject, and intended outcome.
2. Enter the workspace and see the bounded website canvas immediately.
3. Explore the levels and understand the decisions involved.
4. Choose the website components and patterns they want to use.
5. Configure available options and arrange/reorder components freely.
6. Provide content upfront or progressively; use draft text or placeholders where content is not ready.
7. Place image placeholders and optionally attach reference photos, a logo, or other user-provided imagery.
8. Preview the wireframe at desktop, tablet, and mobile sizes using guided responsive patterns.
9. Move between levels freely, complete required missions, and revise earlier choices.
10. Review the current design and its completion state.
11. Preserve a complete design only when all applicable required missions are complete and the user confirms the final review; otherwise preserve a useful partial design and handoff summary.

## MVP capabilities

- Generic project profile and intended outcome.
- Guided levels with plain-language explanations, examples, and objective completion criteria.
- Free forward/backward navigation and unrestricted revision.
- No points, badges, prizes, leaderboards, timers, or competitive scoring.
- No AI generation, recommendations, or automatic design choices.
- Bounded canvas visible from the beginning.
- Categorized high-level component and pattern library.
- User-selected components, variants, options, and ordering.
- Add, remove, replace, reorder, and configure operations.
- Wireframe rendering with content slots and image placeholders.
- User content can be entered upfront or progressively.
- Optional user-provided reference imagery; no required final assets or stock-image library.
- Desktop/tablet/mobile preview with curated responsive choices.
- Project save/recovery appropriate to MVP architecture.
- Mission completion tracking based on required decisions, not subjective design quality.
- Complete and partial design summary that communicates user intent and remaining work.

## Explicitly deferred

- AI-generated designs, copy, images, or AI recommendations.
- Automatic component selection, ranking, or page ordering.
- Production code generation, hosting, publishing, and domain management.
- Required final photography or a stock-image library.
- Full CMS, ecommerce checkout, payments, booking, and membership backends.
- Arbitrary CSS, unrestricted pixel placement, and infinite canvas.
- Advanced animation and interaction authoring.
- Real-time collaboration, subscriptions, and marketplace.

## MVP success measures

- A new user can understand the level-based process without design terminology.
- Users understand that they—not the product—choose components and their order.
- Users can add, configure, remove, replace, and reorder patterns without technical knowledge.
- The canvas visibly reflects every committed choice.
- Users can revisit levels and revise choices without losing unrelated work.
- Users can create a meaningful wireframe without supplying final images.
- A developer can understand the purpose and current state of both complete and incomplete projects.
- Mission completion is clear and objective; users are not judged on subjective aesthetics.

Quantitative targets should be established after baseline usability testing rather than invented in advance.

## MVP release gate

Do not call the MVP complete until the core journey, component operations, responsive wireframe previews, persistence/recovery, accessibility fundamentals, complete/partial handoff, and milestone acceptance criteria pass.

## Approved M01 journey and responsive behavior

The MVP journey uses 11 levels: Define the website; Explore visual direction; Build shared website frame; Design homepage introduction; Build homepage content; Complete homepage; Design responsive behavior; Plan additional pages; Design additional pages; Review website; Complete design and handoff.

The first complete example should be an online store, while the builder supports other website purposes generically.

Progression rules:
- All levels are accessible from the beginning. Users may move freely and leave unfinished missions.
- Each level defines required and optional missions; users may explicitly select Not needed where applicable.
- Missions complete automatically when objective requirements are satisfied and use Not started, In progress, Complete, and Needs review statuses.
- Users may mark a level complete with unfinished missions; this does not waive or change mission statuses.
- Overall design completion requires all applicable required missions and explicit final-review confirmation.
- Earlier decision changes preserve work and mark affected missions Needs review.
- Show level status and mission completion percentage, without rewards or scores.

Responsive MVP behavior:
- Provide desktop, tablet, and mobile canvases for one shared website.
- Share component identity/content/configuration while maintaining independent layout state per breakpoint.
- Support independent tablet/mobile reordering and component visibility; hiding never deletes a component or affects other breakpoints.
- Let users review and customize tablet/mobile after composing desktop.

After component insertion, users can configure generic image/file placeholders, specify their purpose, and optionally supply their own content. Export remains available at any time and clearly identifies complete or incomplete status.


## Approved M02 UX and editing boundary

The MVP uses a sample-based composition model. Users browse multiple predefined designs for each high-level component type, select the sample they want, and arrange the resulting sections into a website. The component portfolio grows over time.

Users can customize only the content fields and finite options supported by the selected sample, such as titles, text, button labels, links, item data, and image slots. They cannot freely redesign internal visual structure, move nested elements, edit arbitrary styling, use CSS controls, or perform pixel-level editing. The product is not a Figma-like detailed design editor.

Responsive workspace rules:
- Desktop, tablet, and mobile canvases are visible simultaneously side by side.
- Desktop is the structural source. Add/remove/replace of high-level components updates the shared collection across all three views.
- Tablet/mobile cannot independently add, remove, or replace high-level components.
- Tablet/mobile can independently reorder existing components, hide/show them, and adjust supported responsive presentation.
- Shared content and sample configuration synchronize across all canvases.
- Narrow workspaces use horizontal scrolling or workspace zoom to preserve the three-canvas arrangement.

The MVP workspace also includes a visual component portfolio, contextual content properties, collapsible mission guidance, autosave feedback, undo/redo, and a dedicated review experience. Version history with safe full-project restoration is part of the approved MVP UX.
