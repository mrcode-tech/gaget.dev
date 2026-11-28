# Website Design Game — Lighting Store Journey (Initial Skeleton)

## Product concept
A guided, game-like website composition experience for non-designers. Users assemble a storefront from high-level sections on a constrained canvas; they do not manipulate low-level UI components, CSS, arbitrary sizing, or an infinite artboard.

**First scenario:** a lighting store (fixtures, lamps, chandeliers, and related products).
**Primary outcome:** a completed, structured website blueprint that can later be handed to a developer or AI implementation workflow.

## Core editor shell
- **Canvas:** one page at a time, constrained to a preview frame; section-based composition and reorder/insert/remove.
- **Library sidebar:** contextual section and variation choices, revealed progressively by journey level.
- **Canvas header:** page name, undo/redo, save state, and three device preview modes.
- **Device views:** Desktop (primary), Tablet, Mobile. Shared configuration cascades to all views; optional responsive overrides are available per view.
- **Selection:** selecting a section opens a small, contextual configuration surface rather than a professional inspector panel.
- **Progression:** gentle guided levels. Unlocks teach and recommend, but do not permanently prevent experimentation or revisiting completed levels.

## Journey / levels

### Level 0 — Store identity and design foundations
**Goal:** establish the visual language before arranging page sections.
- Business/store name and short description
- Mood / visual direction (e.g. modern, industrial, warm, Scandinavian, luxury)
- Primary, secondary, accent, background and text colors; suggested palette proportions
- Typography pairing and preview of heading/body hierarchy
- Image style guidance
**Canvas outcome:** a simple identity preview, not a page layout.

### Level 1 — Site shell and navigation
**Goal:** choose the shared frame for the store.
- Header/navbar variations (logo placement, navigation arrangement, search/account/cart affordances)
- Navigation labels and primary links
- Optional announcement strip
- Footer pattern and basic links (can be introduced here or deferred)
- Shared shell preview across Desktop, Tablet and Mobile
**Canvas outcome:** header and navigation selected, with responsive behavior.

### Level 2 — Home page hero
**Goal:** make the first impression.
- Hero variations: image-led, split image/text, centered, editorial, promotion
- Image or media placeholder
- Headline, supporting text and primary action
- Compact/comfortable/spacious choices and a few layout options
**Canvas outcome:** first home-page section.

### Level 3 — Product discovery on the home page
**Goal:** help customers discover lighting products.
- Featured product grid / collection
- Category tiles (e.g. pendant lights, floor lamps, wall lights, table lamps)
- Featured collection carousel or horizontal collection
- Promotional banner
- Product-card style choice (image, name, price, optional badges)
**Canvas outcome:** a coherent home-page product-discovery sequence.

### Level 4 — Complete the home page story
**Goal:** add trust, inspiration and useful information.
Suggested section library, selected as needed:
- Image + story / brand introduction
- Inspiration gallery / room scenes
- Benefits or service highlights (delivery, warranty, support)
- Editorial banner or seasonal campaign
- Testimonials / reviews (optional)
- FAQ / accordion (optional)
- Newsletter signup (optional)
- Contact teaser / showroom or location (optional)
**Canvas outcome:** users assemble and order their preferred sections; avoid forcing every optional section.

### Level 5 — Home page closing and completion
**Goal:** finish the page.
- Contact or store-location section
- Footer (if not already selected)
- Social links, policies and secondary navigation
- Review the page in all three device views
- Lightweight completeness checks (missing image/content, overflow, sections without mobile behavior)
**Canvas outcome:** completed first page blueprint.

### Level 6 — Product listing / category page
**Goal:** design how customers browse a category.
- Category introduction/banner
- Product listing layout and grid density presets
- Filters and sort (high-level patterns, not implementation details)
- Pagination or load-more pattern
- Optional category subtiles
- Product-card variation
**Canvas outcome:** one reusable category/listing-page blueprint.

### Level 7 — Product detail page
**Goal:** design the product purchase experience.
- Product gallery/media pattern
- Product name, price and description
- Variants / specifications (e.g. finish, dimensions, bulb compatibility)
- Availability, delivery and warranty information
- Add-to-cart action and quantity
- Related products / accessories
- Mobile-specific gallery and purchase-action behavior
**Canvas outcome:** reusable product-detail blueprint.

### Level 8 — Additional store pages
Treat pages as guided templates assembled from section patterns:
- About / brand story
- Contact / showroom / map and form
- FAQ / help
- Campaign / landing page
- Cart (initially a pattern preview, not full commerce functionality)
- Optional custom page assembled from unlocked sections
**Canvas outcome:** page collection and navigation relationships.

### Final stage — Website blueprint review and handoff
- Site-wide identity tokens and typography
- Shared header/footer
- Home page and selected page templates
- Section order, variants, content placeholders and assets
- Desktop/tablet/mobile settings and overrides
- Validation/review checklist
- Export or generate a structured specification for an implementation request

## MVP boundary
Prototype the editor shell and drag/drop first using a single home page and synthetic lighting-store content:
1. Constrained canvas and section insertion/reordering.
2. Library sidebar with a small set of high-level blocks.
3. Section selection and contextual settings.
4. Desktop / Tablet / Mobile switch.
5. Shared defaults and simple responsive rules.
6. Undo/redo and persistence can follow once interaction is validated.

Do not begin with arbitrary positioning, a full professional layer tree, custom component authoring, unrestricted CSS controls, infinite canvas, or complete ecommerce functionality.

## Design principle
The experience should feel like assembling a visual puzzle and making guided choices—not operating a simplified professional design tool. Progression should teach; it should not frustrate or unnecessarily lock users out.
