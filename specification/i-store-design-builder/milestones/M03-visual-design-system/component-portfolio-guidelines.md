# M03 — Website Component Portfolio Guidelines

## Purpose

System B is the collection of predefined website component designs users browse, select, customize within defined limits, and assemble into pages. It is a product asset that grows progressively.

## Taxonomy

Define the full high-level taxonomy early. Initial families may include:
- Navigation: navbar, sidebar, menus.
- Introduction: hero and page introduction.
- Store: product grids/lists, categories, featured products.
- Content: text, image, features, story/about, process.
- Social proof: testimonials, reviews, trust indicators.
- Conversion: promotion and calls to action.
- Information: FAQ, contact, location, service details.
- Closing: footer and related closing sections.

The taxonomy is generic. The first complete example is store-focused, but foundations must support portfolios, services, creators, organizations, non-profits, and other purposes.

## Catalogue and discovery

Start with a curated manageable set for prioritized component types; expand by product priority rather than waiting for every category. Organize by component type with optional visual-style and website-purpose filters. Provide adjustable gallery density, multiple previews, enlarged previews, and contextual page previews. Before insertion, disclose supported content slots and finite options. Never auto-select, rank, recommend, or insert samples.

## Visual diversity

Samples must demonstrate meaningful design differences, not superficial color swaps of the same layout. The portfolio may include editorial, minimalist, contemporary, expressive, luxury, and other suitable directions. Each sample has a clear rationale, intended use, hierarchy, content assumptions, and responsive behavior. Do not force one universal visual style on every sample.

## Shared technical conventions

Samples follow shared contracts for stable IDs; component type/taxonomy metadata; supported content fields/data shapes; required, optional, and repeatable slots; image/file placeholder purpose; finite options; responsive behavior; accessibility semantics; preview metadata; and version/compatibility behavior.

Reuse foundations where they improve consistency or maintainability. Do not force a common visual template where it compromises the sample's intended design.

## User customization boundary

Users edit only fields and finite options explicitly provided by a sample: headings, body text, labels, links, item/product data, and defined image slots. They cannot freely change internal layout, nested positions, arbitrary typography/color/spacing, CSS, or pixel geometry. This is sample-based composition, not Figma-like authoring.

When replacing a sample, preserve compatible content where possible and identify fields that cannot be carried over.

## Responsive requirements

Every sample defines intentional desktop, tablet, and mobile presentations. Shared sample identity/content synchronize across canvases. Desktop is the source for adding/removing/replacing high-level components; tablet/mobile support independent top-level order, visibility, and supported responsive presentation. Hiding is breakpoint-specific and never deletes the component. Users do not edit arbitrary internal layout.

## Sample release readiness

A sample is ready only when it has a documented purpose/rationale; supported content slots/options; isolated and contextual previews; desktop/tablet/mobile behavior; accessibility semantics and keyboard behavior for interactive elements; visual QA at representative viewports; usable placeholders; and a stable identifier. Grow by deliberate curation, not quantity targets alone.
