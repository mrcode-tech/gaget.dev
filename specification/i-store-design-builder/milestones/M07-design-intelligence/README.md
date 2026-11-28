# M07 — Design Guidance and Component Library

**Status: Approved baseline — specification complete.** This approval covers the product and catalogue-governance specifications only. It does not claim that the catalogue, UI, sample renderers, or application behavior have been implemented or verified.

## Strategic purpose

Make design choices understandable without making choices on the user's behalf. Provide a comprehensive, generic, progressively populated portfolio of high-quality predefined website component designs that users can browse, compare, select, and compose.

## Objectives

- Establish a comprehensive hierarchical taxonomy of high-level website component categories and types.
- Define a controlled, extensible visual-style vocabulary and optional website-purpose classifications.
- Specify catalogue discovery through browsing, filters, and keyword search.
- Define the relationship between component types, reusable catalogue samples, and inserted instances.
- Standardize sample metadata, content slots, finite options, preview requirements, and responsive presentations.
- Provide meaningful sample diversity, comparison, and contextual selection guidance.
- Establish product-team authorship, quality review, publication, versioning, and retirement rules.
- Define an initial portfolio that supports the first complete store-focused journey while remaining generic.
- Expand the portfolio progressively without confusing taxonomy completeness with sample coverage.

## Approved decisions

| ID | Area | Approved decision |
|---|---|---|
| M07-01 | Organization | Organize primarily by high-level component type, with secondary filters |
| M07-02 | Taxonomy | Establish a comprehensive generic website-component taxonomy |
| M07-03 | Structure | Use hierarchical categories and subcategories |
| M07-04 | Visual styles | Provide optional filters from a controlled, documented, extensible vocabulary |
| M07-05 | Website purposes | Provide optional website-purpose filters |
| M07-06 | Discovery | Support category browsing, filters, and keyword search |
| M07-07 | Availability | Show available samples and useful category metadata |
| M07-08 | Type/sample relationship | Each component type contains multiple selectable design samples |
| M07-09 | Presentation | Use visual gallery cards with previews and concise metadata |
| M07-10 | Comparison | Support enlarged previews and comparison of candidate samples |
| M07-11 | Preview content | Use representative layouts and synthetic content |
| M07-12 | Content conventions | Share content-slot conventions while allowing sample-specific presentation |
| M07-13 | Diversity | Require meaningfully distinct layouts and design approaches |
| M07-14 | Responsive | Require intentional desktop, tablet, and mobile presentations |
| M07-15 | Quality | Apply a documented design-quality checklist and review process |
| M07-16 | Growth | Define the full taxonomy early and deliver curated samples progressively |
| M07-17 | Authorship | Product/design team authors official catalogue samples |
| M07-18 | Updates | Existing instances retain their referenced sample version |
| M07-19 | Guidance | Provide concise contextual explanations, examples, and selection considerations |
| M07-20 | Initial scope | Deliver a substantial usable first portfolio across all major categories, prioritizing the first store-focused journey and foundational generic components |

## Initial portfolio scope clarification

The initial release must establish the complete taxonomy and provide a substantial, usable set of samples across all major categories. It does not require every subcategory to have a sample or every component type to have a fully populated set.

Prioritize the first complete store-design journey, while including foundational generic components. Expand sample coverage progressively. Store-oriented priorities must not hardcode store assumptions into the product model or exclude other website purposes.

## Core catalogue concepts

- **Category:** a broad family of related component types.
- **Component type:** the functional role a high-level website component fulfils.
- **Catalogue sample:** a reusable, product-authored design definition for one component type, with a stable identity and version, content schema, finite options, responsive behavior, preview metadata, and renderer contract.
- **Component instance:** a project-owned insertion referencing a particular sample version and holding independent content, configuration, and placeholder values.

Catalogue definitions never contain project-specific user content. Instances never mutate the catalogue definition.

## Product constraints

- The product remains generic; the first complete journey is store-focused.
- Users make all creative decisions and explicitly select samples.
- The library remains accessible throughout the journey and is not progression-gated.
- No automatic sample selection, ranking, recommendation, insertion, or arrangement.
- Users edit only sample-defined content fields and finite options.
- No arbitrary CSS, pixel geometry, nested-element editing, or Figma-like freeform authoring.
- Use synthetic representative content and generic placeholders.
- No stock-image picker or image generation in the MVP.
- The builder interface and website component portfolio remain distinct visual systems.
- M04/M06 version and instance rules remain authoritative.
- No points, badges, rewards, leaderboards, timers, or subjective user design-quality scores.

## Documents

- [Component taxonomy](component-taxonomy.md)
- [Catalogue information architecture](catalogue-information-architecture.md)
- [Component sample specification](component-sample-specification.md)
- [Sample preview and comparison](sample-preview-and-comparison.md)
- [Responsive sample guidelines](responsive-sample-guidelines.md)
- [Design guidance framework](design-guidance-framework.md)
- [Portfolio quality governance](portfolio-quality-governance.md)
- [Catalogue versioning and lifecycle](catalogue-versioning-and-lifecycle.md)
- [Initial portfolio plan](initial-portfolio-plan.md)
- [Verification and acceptance](verification-and-acceptance.md)

## Dependencies and ownership

- **M00:** generic product strategy and user agency.
- **M01:** library availability throughout the journey and store-focused first complete example.
- **M02:** sample-based high-level composition UX and discovery/preview interaction foundations.
- **M03:** two visual systems, portfolio diversity, professional design framework, responsive and quality guidelines.
- **M04:** catalogue sample/instance separation and conceptual version compatibility.
- **M05:** static typed catalogue, synthetic samples, independent preview, and renderer registry.
- **M06:** insertion, instance lifecycle, sample replacement, content/configuration, responsive composition, validation, and runtime constraints.
- **M08:** mission and progress behavior; M07 does not gate the library by level.
- **M10/M11/M13:** later detailed ownership of homepage/section, responsive, and content/review experiences.

M07 defines catalogue product behavior and governance. It does not replace M04/M05/M06 data and runtime contracts or downstream implementation milestones.

## Completion criteria

- [x] M07 decisions reviewed and approved.
- [x] Generic taxonomy and controlled classifications specified.
- [x] Catalogue discovery and sample presentation specified.
- [x] Sample definition, content-slot, option, and preview conventions specified.
- [x] Diversity, responsive, and quality requirements specified.
- [x] Authorship, publication, versioning, and retirement rules specified.
- [x] Initial portfolio priorities and progressive expansion specified.
- [x] Verification and acceptance criteria documented.
- [ ] Catalogue/application implementation — future work.
- [ ] Automated and visual verification of implementation — future work.

## Governance

Use synthetic project and sample data in specifications and tests. Keep taxonomy completeness separate from sample coverage. Preserve existing approved milestone decisions. Specification approval is not evidence of implementation, testing, deployment, or extraction into a standalone codebase.
