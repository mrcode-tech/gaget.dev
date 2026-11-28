# Website Design Game — Complete Product and Development Plan

## 1. Product vision

Build a guided, game-like web application in which a person with no professional design skills can create the structure and visual direction of a complete website by completing a sequence of levels.

The result is a real, structured website design—not merely a mood board, wireframe, or collection of disconnected screens. The project should contain a visual identity, reusable site frame, pages, sections, content placeholders or supplied content, navigation relationships, and responsive behavior. It should be possible to hand the result to a developer or an AI implementation workflow.

This is not a Figma clone and not a professional free-form design editor. The experience should feel like solving a sequence of approachable design puzzles. The application offers curated choices, sensible defaults, and contextual guidance while keeping the user in control.

All business types and website purposes must remain generic. Examples such as a shop, studio, restaurant, service business, nonprofit, or portfolio are examples only; no one business should be built into the product requirements.

## 2. Product principles

1. **Outcome before tools:** users describe what they need before seeing design controls.
2. **Progressive disclosure:** introduce only the decisions and building blocks relevant to the current level.
3. **Visual choices over technical settings:** ask users to choose how something should look or behave; avoid requiring knowledge of CSS, spacing, breakpoints, grids, or typography terminology.
4. **Constrained composition:** use a bounded webpage canvas with curated section blocks, not an infinite artboard.
5. **Context-aware recommendations:** use the project's business type, audience, purpose, and content to recommend suitable page and section patterns.
6. **Real creative agency:** recommendations are optional; users can skip, replace, revisit, and customize decisions.
7. **Consistent design system:** shared colors, typography, buttons, and layout rules should carry across pages.
8. **Responsive by design:** desktop is the primary editing view, with tablet and mobile previews and simple overrides.
9. **Meaningful progress:** levels, goals, milestones, and completion feedback should help users understand what they have achieved, not pressure them with arbitrary scores.
10. **Portable result:** the final project must be structured, inspectable, editable, and exportable.

## 3. The two journeys

There are two separate but connected workstreams:

- **Product-development journey:** the steps the product team follows to design, build, test, and release the application. This is described in section 4.
- **Player journey:** the levels an end user completes to design their website. This is described in section 5.

Do not confuse game levels with software-development milestones. The application must be developed in a sensible technical sequence, while the user experiences the game as a guided creative journey.

## 4. Product-development plan

### Phase 0 — Product definition and scope

**Tasks**
- Confirm the target audience: business owners, independent professionals, creators, organizations, and people who need a website but are not designers.
- Define supported website purposes without restricting the user to a fixed industry.
- Define the final output: a structured website blueprint containing site identity, page map, navigation, sections, content, assets, visual tokens, and responsive rules.
- Define what the product is not: no arbitrary canvas, pixel-level editing, general-purpose vector editor, unrestricted CSS editor, or professional component inspector.
- Define MVP and later capabilities separately.
- Establish product vocabulary: project, level, challenge, choice, section, page, milestone, preview, and blueprint.

**Deliverables**
- Product brief and explicit non-goals.
- MVP feature list and deferred-feature list.
- Glossary and acceptance criteria.

**Exit criteria**
- The team can explain the product in one paragraph.
- Every proposed feature supports the guided website-design outcome.

### Phase 1 — Information architecture and game loop

**Tasks**
- Define the global application areas: welcome, project setup, game workspace, project overview, preview, and export.
- Define the repeatable level loop: introduce a goal → explain why it matters → show examples → offer a small set of choices → apply the choice to the canvas → let the user refine or undo → validate → celebrate completion → unlock the next challenge.
- Define optional, recommended, and required tasks.
- Define how users pause, leave, resume, replay, skip, and revisit levels.
- Define how level completion is calculated without making subjective aesthetic choices mandatory.
- Define the project map and visible progress.

**Deliverables**
- Application sitemap.
- Player journey map.
- Level-state model and completion rules.

**Exit criteria**
- Users can always tell where they are, what they are trying to achieve, and what happens next.
- Users can return to earlier decisions without losing later work.

### Phase 2 — UX flows and interaction prototypes

**Tasks**
- Prototype first visit and project setup.
- Prototype a level introduction and challenge.
- Prototype choosing a design option and seeing it applied immediately.
- Prototype adding, replacing, reordering, and removing sections.
- Prototype contextual editing of a selected section.
- Prototype desktop/tablet/mobile preview switching.
- Prototype page creation and navigation editing.
- Prototype final review and blueprint export.
- Test with people who have no design-tool experience; observe where terminology or decisions confuse them.

**Deliverables**
- Low-fidelity flows and clickable prototype.
- Interaction rules for each core action.
- Usability findings and revised flows.

**Exit criteria**
- A first-time user can complete an early level without instruction from the product team.
- The user understands that choices affect a real website composition.

### Phase 3 — Visual design system and game presentation

**Tasks**
- Design the game shell: top bar, level map/progress, bounded canvas, contextual choice panel, and feedback area.
- Establish typography, color, spacing, icon, button, card, and feedback patterns for the application itself.
- Define how game feedback appears: level completion, optional objectives, hints, milestones, and warnings.
- Keep the game interface visually distinct from the website being designed.
- Define accessible focus, contrast, motion, and touch behavior.
- Define the website preview's visual frame independently of the application's own shell.

**Deliverables**
- Application design system.
- Core screen designs for desktop and mobile.
- Interaction and accessibility specifications.

**Exit criteria**
- The editor interface and the user's website preview cannot be confused with each other.
- The interface remains usable on smaller screens.

### Phase 4 — Domain model and persistence

**Tasks**
- Model a project independently of the editor UI.
- Model business context, audience, purpose, identity, theme tokens, assets, pages, navigation, sections, section variants, content, and responsive overrides.
- Model levels, objectives, completion state, recommendations, and optional tasks separately from website content.
- Give pages and sections stable identifiers so reordering does not corrupt references.
- Define schema versioning and migrations.
- Define autosave, explicit save status, recovery after refresh, and conflict handling if multi-device editing is supported.
- Use synthetic sample projects for development and tests.

**Suggested conceptual entities**
- Project
- ProjectProfile
- Audience
- SiteIdentity
- DesignTheme
- ThemeToken
- Asset
- Page
- NavigationItem
- Section
- SectionVariant
- SectionContent
- ResponsiveConfiguration
- GameProgress
- LevelDefinition
- LevelObjective
- ProjectExport

**Deliverables**
- Domain schema and validation rules.
- Persistence strategy and migration policy.
- Sample project fixtures.

**Exit criteria**
- A project can be saved, reloaded, validated, and rendered without relying on transient UI state.

### Phase 5 — Application foundation and workspace shell

**Tasks**
- Add the feature as an isolated module within the existing application; do not create a second nested Next.js application.
- Keep the existing GaGet shell and unrelated routes unchanged.
- Give the design-game module its own internal layout, styles, tokens, and components where appropriate.
- Implement project routing and workspace navigation.
- Implement a bounded, scrollable webpage canvas.
- Implement the level panel and contextual library/sidebar.
- Implement selection state and clear empty states.
- Implement undo/redo and save feedback at the agreed MVP level.

**Deliverables**
- Isolated feature route and shell.
- Canvas and sidebar foundation.
- Project loading and saving path.

**Exit criteria**
- The workspace can load a sample project and render its page without affecting the rest of GaGet.

### Phase 6 — Reusable website composition engine

**Tasks**
- Create a curated section library with a small number of high-quality patterns.
- Support section insertion, removal, duplication, replacement, and reordering.
- Support a small set of variants per section type.
- Make each section configurable through simple, contextual choices.
- Use content slots and sensible placeholder content.
- Ensure section variants are responsive and accessible.
- Keep section data separate from rendering components.
- Provide clear empty states and insertion points.

**Initial section families**
- Header and navigation.
- Hero / introduction.
- Product, service, or offering discovery.
- Featured items or selected work.
- Image gallery.
- Benefits / features.
- Story / about.
- Process / steps.
- Testimonials / reviews.
- Statistics / trust indicators.
- Call to action.
- FAQ / accordion.
- Newsletter / subscription.
- Contact / location / booking.
- Footer.

Not every project needs every family. Recommendations should be based on the project purpose and user choices.

**Deliverables**
- Section schema and renderer.
- Section library and variant definitions.
- Composition operations and tests.

**Exit criteria**
- A user can assemble a coherent home page from reusable sections without editing code.

### Phase 7 — Responsive behavior

**Tasks**
- Make desktop the primary editing canvas.
- Add tablet and mobile preview modes.
- Define shared defaults that cascade across breakpoints.
- Add only a small set of understandable overrides, such as image placement, column stacking, visibility, and navigation presentation.
- Prevent users from accidentally creating inconsistent layouts.
- Provide warnings for overflow, unreadable text, awkward image crops, or unusable navigation.
- Test representative section combinations at supported viewport sizes.

**Deliverables**
- Responsive rules and preview controls.
- Per-section responsive settings where justified.
- Responsive validation checks.

**Exit criteria**
- A project remains coherent at desktop, tablet, and mobile sizes without requiring the user to understand CSS media queries.

### Phase 8 — Game progression and contextual guidance

**Tasks**
- Implement level definitions as data, not hard-coded page-by-page logic.
- Implement prerequisites, objectives, optional challenges, completion states, hints, and unlocks.
- Tailor recommendations to the user's project profile.
- Allow skipping or postponing optional decisions.
- Provide a project map showing completed, current, and upcoming levels.
- Add milestone feedback for meaningful achievements.
- Ensure subjective choices such as a color or style are not judged as objectively correct or incorrect.

**Deliverables**
- Level engine and progression state.
- Contextual recommendation rules.
- Guidance and feedback content.

**Exit criteria**
- The same game can guide different kinds of websites without business-specific hardcoding.

### Phase 9 — Multi-page website builder

**Tasks**
- Add a page map and page creation flow.
- Recommend page types based on project purpose.
- Support page templates and page-specific section composition.
- Connect pages through navigation and contextual links.
- Support shared header, footer, theme, and reusable elements.
- Add page naming, ordering, duplication, and deletion safeguards.
- Allow custom pages when recommendations do not fit.

**Potential page types**
- Home.
- About / story.
- Contact.
- Services overview and service detail.
- Product collection and product detail.
- Portfolio / work index and project detail.
- Pricing.
- FAQ.
- Blog / journal index and article.
- Booking / appointment.
- Campaign / landing page.
- Location / branches.
- Other custom page.

Page types are recommendations, not a fixed required sitemap.

**Deliverables**
- Page model and page map.
- Page templates and shared-site elements.
- Navigation relationship editor.

**Exit criteria**
- The user can build a connected multi-page website, not just a single landing page.

### Phase 10 — Review, validation, and blueprint export

**Tasks**
- Create a final project overview.
- Validate missing or broken navigation targets.
- Identify empty required content slots, missing images, inaccessible contrast, and responsive issues.
- Distinguish blocking issues from recommendations.
- Allow users to preview every page at all supported device sizes.
- Export a structured blueprint in a documented format such as JSON, with a human-readable summary.
- Include theme tokens, page hierarchy, navigation, section order, variants, content, assets, and responsive settings.
- Include stable IDs and schema version so an implementation tool can consume the export.
- Do not claim that the export is a production website unless a separate code-generation/deployment feature is implemented.

**Deliverables**
- Final review experience.
- Validation report.
- Versioned blueprint export and sample export.

**Exit criteria**
- Another person or an AI workflow can understand the intended website structure and design decisions from the export.

### Phase 11 — Quality, release, and iteration

**Tasks**
- Unit-test domain rules, level progression, validation, and responsive configuration.
- Component-test canvas, section operations, sidebar, and previews.
- End-to-end test the complete journey from project creation to export.
- Test refresh/recovery and save behavior.
- Test keyboard navigation, screen-reader labels, contrast, and reduced motion.
- Test representative desktop, tablet, and mobile viewports.
- Verify that existing GaGet routes and styles remain unaffected.
- Add product analytics only for useful, privacy-conscious events such as level abandonment and export completion.
- Release behind an appropriate feature boundary and collect usability feedback.

**Deliverables**
- Test plan and evidence.
- Release checklist.
- Known limitations and follow-up backlog.

**Exit criteria**
- A user can complete the end-to-end journey reliably, and the feature is isolated from the existing application.

## 5. Player journey — levels for designing a website

The following is the proposed complete journey. It is intentionally progressive: each level adds one meaningful layer to the website.

### Level 0 — Create your project

**Player goal:** Explain what kind of website they want to create.

**Player actions**
- Give the project a name.
- Describe the business, organization, personal brand, or idea in their own words.
- Choose or describe what they offer.
- Identify the intended audience.
- Choose the main website outcome: sell, present work, explain, attract inquiries, receive bookings, share information, build a community, or another goal.
- Optionally provide inspiration or describe the feeling they want the website to communicate.

**Game assistance**
- Use plain language and examples.
- Allow free text as well as suggested choices.
- Summarize the user's answers in a short project brief and let them correct it.

**Completion criteria**
- Project name, offer/subject, audience, and primary purpose are known well enough to guide recommendations.

**Unlock:** The visual identity challenge.

### Level 1 — Discover the website's personality

**Player goal:** Choose the overall visual direction.

**Player actions**
- Choose a mood or style direction using visual examples.
- Compare a small number of curated directions.
- Select a level of energy/formality, such as calm, expressive, elegant, playful, bold, traditional, or contemporary.
- Optionally select inspiration references.

**Game assistance**
- Translate the project profile into relevant style suggestions.
- Explain choices in everyday language.
- Allow a user to combine or adjust suggestions rather than forcing a single named design movement.

**Completion criteria**
- A visual direction is selected or intentionally left flexible.

**Unlock:** Color palette.

### Level 2 — Build the color palette

**Player goal:** Choose colors that work together.

**Player actions**
- Select a suggested palette or explore curated alternatives.
- Choose the main color, supporting color, accent, background, and text colors through visual swatches.
- Preview colors on sample buttons, cards, headings, and page sections.
- Adjust colors using simple controls if desired.

**Game assistance**
- Suggest palettes based on the chosen mood and project.
- Explain where each color will appear.
- Warn when text/background combinations may be difficult to read.

**Completion criteria**
- A usable palette exists with accessible text/background combinations or clearly flagged issues.

**Unlock:** Typography and imagery.

### Level 3 — Choose typography and image direction

**Player goal:** Establish how words and images should feel.

**Player actions**
- Compare curated font pairings using real sample headings and paragraphs.
- Choose a heading/body combination.
- Choose image treatment: photography, illustration, artwork, product imagery, abstract graphics, or mixed.
- Optionally upload a logo and initial images.

**Game assistance**
- Show typography in context, not as a list of technical font properties.
- Recommend image direction based on the project and chosen mood.
- Use sensible defaults for sizes and hierarchy.

**Completion criteria**
- Heading and body typography choices are set, and an image direction is selected.

**Unlock:** Shared website frame.

### Level 4 — Create the website frame

**Player goal:** Establish the elements that appear across the website.

**Player actions**
- Choose a header/navigation pattern.
- Add the site name or logo.
- Select navigation items based on likely pages.
- Choose whether an announcement or utility strip is needed.
- Choose a footer pattern and its content groups.

**Game assistance**
- Show header and footer patterns as previews.
- Recommend navigation based on the project purpose.
- Explain that these elements are shared across pages.

**Completion criteria**
- A coherent shared header and footer exist, with an initial navigation structure.

**Unlock:** Home page hero.

### Level 5 — Make the first impression (hero)

**Player goal:** Design the opening section of the home page.

**Player actions**
- Choose a hero pattern: centered, split image/text, full-image, editorial, product-focused, service-focused, or another curated variant.
- Add a headline and supporting text.
- Choose an image or visual asset.
- Choose the primary action, such as explore, contact, book, shop, or learn more.
- Optionally add a secondary action.

**Game assistance**
- Suggest headline prompts based on the project brief.
- Explain the purpose of the hero: visitors should quickly understand what the site offers and what to do next.
- Preview variants using the user's selected colors and typography.

**Completion criteria**
- The home page has a clear opening message, visual, and primary action.

**Unlock:** Main content and discovery.

### Level 6 — Help visitors discover the offer

**Player goal:** Choose the main content sections that explain or present the offer.

**Player actions**
- Select relevant section families, such as products, services, featured work, collections, categories, benefits, process, or gallery.
- Choose section layouts and variants.
- Add, replace, reorder, or remove sections.
- Add short titles, descriptions, images, and links.
- Mark optional sections to add later.

**Game assistance**
- Recommend sections according to the website's purpose.
- Explain what each section helps visitors understand.
- Show the effect of section order on the page.
- Avoid suggesting every possible section.

**Completion criteria**
- The home page communicates the main offer and gives visitors a useful next step.

**Unlock:** Trust and supporting content.

### Level 7 — Build trust and answer questions

**Player goal:** Add the supporting information visitors need.

**Player actions**
- Choose relevant options: story/about, benefits, process, testimonials, reviews, statistics, FAQs, editorial content, or other proof/support sections.
- Add available content or mark content as needed later.
- Reorder sections to create a clear narrative.

**Game assistance**
- Recommend only sections that make sense for the project.
- Explain that these sections are optional and should not be added just to fill space.
- Flag unsupported claims or empty testimonial placeholders for review rather than presenting them as real content.

**Completion criteria**
- The home page includes appropriate supporting information, or the player explicitly decides it is unnecessary.

**Unlock:** Conversion and contact.

### Level 8 — Give visitors a next step

**Player goal:** Complete the page with an appropriate action and closing information.

**Player actions**
- Choose a closing call-to-action.
- Add contact, booking, location, social, newsletter, or other relevant details.
- Review footer links and contact methods.
- Decide which details should appear on the home page versus a dedicated page.

**Game assistance**
- Tailor actions to the project goal.
- Avoid forcing a contact form, newsletter, or booking feature when it is not relevant.
- Check that important actions are clear and consistent.

**Completion criteria**
- The home page has an appropriate closing action and shared footer.

**Milestone:** Home page complete.

### Level 9 — Test the home page on every screen

**Player goal:** Make sure the design works beyond desktop.

**Player actions**
- Review desktop, tablet, and mobile views.
- Try simple responsive choices where needed.
- Adjust image placement, stacking, navigation style, and section visibility using guided options.
- Review text readability and action accessibility.

**Game assistance**
- Highlight specific issues rather than exposing technical CSS settings.
- Offer one-click recommended fixes where possible.
- Keep shared settings as defaults and make overrides explicit.

**Completion criteria**
- No blocking responsive issues remain, or remaining issues are explicitly acknowledged.

**Unlock:** Build the rest of the website.

### Level 10 — Plan the remaining pages

**Player goal:** Decide which pages the complete website needs.

**Player actions**
- Review suggested pages based on the project purpose.
- Add, remove, rename, and reorder pages.
- Choose page types and templates.
- Decide which pages belong in the main navigation, footer, or contextual links.

**Game assistance**
- Explain why a page might be useful.
- Suggest a minimal sitemap first.
- Allow custom pages and optional pages.
- Show the relationship between pages in a simple site map.

**Completion criteria**
- The player has a deliberate page map and navigation plan.

**Unlock:** Compose each page.

### Level 11 — Build the additional pages

**Player goal:** Complete the content and structure of each selected page.

**Player actions**
- Work through each page using relevant templates and section libraries.
- Reuse the shared design identity and site frame.
- Add page-specific content, images, actions, and related links.
- Reorder or replace sections as needed.
- Mark content that must be supplied later.

**Game assistance**
- Change the available blocks according to the page type.
- For example, a service detail page may offer process, benefits, pricing, and inquiry blocks; a portfolio detail page may offer project images, context, and credits.
- Keep shared elements consistent while allowing appropriate page-specific variation.

**Completion criteria**
- Every planned page has a coherent structure and a clear purpose.

**Unlock:** Whole-site review.

### Level 12 — Connect and polish the website

**Player goal:** Make the pages work together as one website.

**Player actions**
- Test navigation and important links.
- Review shared header, footer, colors, typography, buttons, and section consistency.
- Check page names and hierarchy.
- Review desktop, tablet, and mobile across all pages.
- Resolve missing content and asset decisions.

**Game assistance**
- Provide a checklist grouped by severity and topic.
- Distinguish required fixes from optional polish.
- Allow the player to jump directly to the page or section needing attention.

**Completion criteria**
- No broken internal navigation or critical structural issues remain.

**Milestone:** Complete website design.

### Level 13 — Final presentation and handoff

**Player goal:** Review and package the completed design.

**Player actions**
- View the full website page by page.
- Review the project brief and design identity.
- Confirm pages, navigation, content, assets, and responsive behavior.
- Export the website blueprint.
- Optionally create a shareable review presentation or implementation request.

**Game assistance**
- Present the final result as a clear achievement, not just a score.
- Summarize what has been designed and what content is still pending.
- Explain what the exported blueprint contains and what additional work is required to turn it into a live website.

**Completion criteria**
- A versioned, validated blueprint is generated and can be handed to a developer or AI implementation workflow.

**Final achievement:** Website design completed.

## 6. Repeatable level interaction pattern

Every level should use a consistent interaction structure:

1. **Mission:** State the goal in one or two plain-language sentences.
2. **Why it matters:** Explain the value of the decision for website visitors.
3. **Examples:** Show a small curated set of visual examples.
4. **Choose:** Let the player select a pattern, direction, or content option.
5. **Apply:** Update the bounded canvas immediately.
6. **Refine:** Offer a few contextual controls, not a professional inspector.
7. **Review:** Let the player compare alternatives and undo.
8. **Complete:** Check objective criteria and show progress.
9. **Next step:** Explain what the next level adds.

The player must be able to leave a level and return later. Optional objectives should never block the core journey.

## 7. Workspace layout

The game workspace should have four clear areas:

- **Top bar:** project name, save status, undo/redo, preview, and exit/project overview.
- **Progress/mission area:** current level, objective, progress, hints, and next action.
- **Website canvas:** bounded page preview, with desktop as the primary view and tablet/mobile switching.
- **Contextual library/settings panel:** choices relevant to the current mission or selected section.

The canvas is not an infinite artboard. It represents the actual page within a controlled viewport. It is visible from the beginning of the player journey, including the early identity levels; it progressively gains its visual identity, shared frame, and page sections as the player advances. Do not hide the canvas until a later level. Selecting a section should reveal only the settings relevant to that section.

## 8. Game mechanics

Use game mechanics to support learning and momentum, not to turn design into a competitive score.

**Recommended**
- Level progression and a visible journey map.
- Milestone achievements for completing meaningful parts of the website.
- Optional creative challenges.
- Hints and examples.
- Undo/redo and safe experimentation.
- Clear completion feedback.
- A project completion summary.

**Avoid**
- Punishing users for subjective design choices.
- Artificial timers or pressure.
- Public leaderboards for aesthetic quality.
- Locking basic editing after a level is complete.
- Requiring every possible section or page.
- Giving a numerical design-quality score that implies an objective judgment.

## 9. MVP scope

The MVP should prove the core experience with one complete path, not attempt every possible website feature.

**Include**
- Project setup and profile.
- Visual direction, palette, typography, and image direction.
- Shared header and footer.
- Home page hero and a focused selection of content sections.
- Bounded canvas and contextual sidebar.
- Add, remove, replace, and reorder sections.
- Desktop/tablet/mobile preview with a small set of responsive overrides.
- Level progression, completion, hints, and project persistence.
- A small set of additional page templates.
- Final validation and structured blueprint export.

**Defer**
- Arbitrary CSS editing and pixel-level controls.
- Infinite canvas and free-form drawing.
- Advanced animation and interaction authoring.
- Full ecommerce checkout, payment, inventory, and CMS functionality.
- Automatic production deployment and hosting.
- Real-time multi-user collaborative editing.
- Large unrestricted marketplace of third-party blocks.
- AI-generated copy or images as a required dependency; these can be optional integrations later.

## 10. Acceptance criteria for the complete product

The product is considered complete when:

1. A new user can create a project without design or development knowledge.
2. The project setup accepts any reasonable business, organization, creator, or website purpose.
3. The game adapts recommendations and section choices to that project context.
4. A user can complete the level journey in stages and resume later.
5. The canvas remains bounded and represents a real webpage.
6. Users can compose pages from high-level section patterns.
7. The user can change the design direction without losing the website structure.
8. Shared visual identity is applied consistently across pages.
9. Desktop, tablet, and mobile previews are available and meaningful.
10. The user can create multiple connected pages.
11. Navigation and critical structure can be validated.
12. The final blueprint contains sufficient structured information for implementation by a developer or AI workflow.
13. The feature remains isolated from the existing GaGet experience and does not unintentionally change unrelated routes or styles.

## 11. Open decisions for future discussion

These should be resolved progressively before implementation reaches the relevant phase:

- Product/feature name and game narrative.
- Whether the player sees a guide character or a simple mission system.
- Whether project setup is conversational, form-based, or hybrid.
- Exact MVP section variants.
- Whether users can start from a blank page or must choose a suggested starting pattern.
- How much content editing belongs in the MVP.
- Whether assets are uploaded by the user, selected from a curated library, or both.
- Whether blueprint export is JSON-only initially or includes a human-readable handoff document.
- Whether AI assistance is in MVP or a later optional capability.
- Authentication, project ownership, and collaboration scope.

## 12. Recommended implementation order

Build and validate in this order:

1. Product brief, player journey, and MVP boundary.
2. UX prototype of project setup and the first three levels.
3. Domain model and project persistence.
4. Isolated workspace shell and bounded canvas.
5. Theme identity and shared website frame.
6. Section composition engine and home page levels.
7. Responsive preview and guided adjustments.
8. Level engine and progress persistence.
9. Additional page templates and navigation.
10. Whole-site validation and blueprint export.
11. Accessibility, end-to-end testing, and regression verification.
12. Usability iteration and release.

This order reduces risk: first prove that the guided experience makes sense, then build the reusable website model and composition engine, and only then expand to the full multi-page journey.
