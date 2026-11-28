# Website Design Playground — Guided Website Builder Game

## Product concept
A guided, game-like website composition experience for people with limited design knowledge. Users assemble a website from high-level visual sections on a constrained canvas; they do not manipulate low-level UI components, CSS, arbitrary sizing, or an infinite artboard.

The experience is generic: users define their own website, business, audience and goals. Scenarios such as an artist portfolio, jewelry business, restaurant, pizza shop, lighting store, boutique or other small business are examples—not baked-in assumptions.

**Primary outcome:** a completed, structured website blueprint that can later be handed to a developer or AI implementation workflow.

## Start a project — Level 0: Define the website
Before the canvas journey, users create their project:
- Website/project name
- Business or organization type (free text plus suggestions)
- What the business offers
- Target audience and primary purpose
- Desired website outcome (sell products, showcase work, bookings, inquiries, information, etc.)
- Optional inspiration or style words

Keep this onboarding approachable and conversational. Avoid technical vocabulary.

## Core editor shell
- **Canvas:** one page at a time, constrained to a preview frame; section-based composition and reorder/insert/remove.
- **Canvas visibility:** show the website canvas from the beginning of the journey, including during the early identity levels. As the player completes levels, the canvas progressively gains its visual identity, shared frame, and page sections. Do not hide the canvas until a later level.
- **Library sidebar:** contextual section and variation choices, revealed progressively by journey level.
- **Canvas header:** project/page name, undo/redo, save state, and three device preview modes.
- **Device views:** Desktop (primary), Tablet, Mobile. Shared configuration cascades to all views; optional responsive overrides are available per view.
- **Selection:** selecting a section opens a small, contextual configuration surface rather than a professional inspector panel.
- **Progression:** gentle guided levels. Unlocks teach and recommend, but do not permanently prevent experimentation or revisiting completed levels.

## Journey / levels

### Level 1 — Visual identity and design foundations
**Goal:** establish a visual direction.
- Mood/style choices guided by business type and audience
- Primary, secondary, accent, background and text colors; suggested palette proportions
- Typography pairing and preview of heading/body hierarchy
- Image style guidance (photography, illustration, product imagery, editorial, etc.)
- Optional logo upload or placeholder
**Outcome:** a visual identity starter kit.

### Level 2 — Shared website frame and navigation
**Goal:** choose the site-wide frame.
- Header/navbar variations (logo placement, navigation arrangement, menu behavior)
- Navigation labels and primary links
- Optional announcement strip
- Footer pattern and basic links (may be refined later)
- Shared shell preview across Desktop, Tablet and Mobile
**Outcome:** shared navigation and framing.

### Level 3 — Home page hero
**Goal:** make the first impression.
- Hero variations: image-led, split image/text, centered, editorial, promotion
- Image or media placeholder
- Headline, supporting text and primary action
- Compact/comfortable/spacious choices and a few layout options
**Outcome:** first home-page section.

### Level 4 — Home page content and discovery
**Goal:** introduce the business and help visitors explore.
A contextual section library, with choices appropriate to the project:
- Featured products, services, work or collections
- Category/service tiles
- Gallery, portfolio or product grid
- Featured collection carousel or horizontal gallery
- Promotional or editorial banner
- Story/about section
- Benefits, trust or service highlights
- Testimonials/reviews (optional)
- FAQ/accordion (optional)
- Newsletter signup (optional)
Users choose and arrange sections; not every section is required.
**Outcome:** a coherent home-page sequence.

### Level 5 — Home page closing and completion
**Goal:** finish the page.
- Contact, inquiry, booking or location section appropriate to the business
- Footer
- Social links and secondary navigation
- Review the page in all three device views
- Lightweight completeness checks (missing content/images, overflow, sections without mobile behavior)
**Outcome:** completed first page blueprint.

### Level 6 — Additional page types
Introduce page templates based on the project's goals, not a universal mandatory list:
- Product or service listing/category
- Product/service detail
- Portfolio/gallery detail
- About / brand story
- Contact / location / form
- FAQ / help
- Campaign / landing page
- Booking, cart or other specialized pages where relevant
- Optional custom page assembled from unlocked sections
**Outcome:** a connected collection of page blueprints.

## Final stage — Website blueprint review and handoff
- Site-wide identity tokens and typography
- Shared header/footer
- Page list and navigation relationships
- Section order, variants, content placeholders and assets
- Desktop/tablet/mobile settings and overrides
- Lightweight validation/review checklist
- Export or generate a structured specification for an implementation request

## MVP boundary
Prototype the editor shell and drag/drop first with synthetic content for a generic sample business:
1. Project setup with website name and business type.
2. Constrained canvas and section insertion/reordering.
3. Library sidebar with a small set of high-level blocks.
4. Section selection and contextual settings.
5. Desktop / Tablet / Mobile switch.
6. Shared defaults and simple responsive rules.
7. Undo/redo and persistence can follow once interaction is validated.

Do not begin with arbitrary positioning, a full professional layer tree, custom component authoring, unrestricted CSS controls, infinite canvas, or complete ecommerce functionality.

## Design principle
The experience should feel like assembling a visual puzzle and making guided choices—not operating a simplified professional design tool. Progression should teach; it should not frustrate or unnecessarily lock users out. The scenario and content should adapt to the project the user defines.
