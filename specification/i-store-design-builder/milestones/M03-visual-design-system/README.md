# M03 — Product Visual Design System

## Status

**Approved — M03 visual design system baseline complete.**

This is approval of the product/design baseline and documentation, not a claim that application styles, tokens, interactive showcase, or component samples have been implemented or visually verified.

## Objective

Define a distinctive professional visual language for the Website Design Builder and a quality framework for its progressively expanding portfolio of predefined website component samples.

## Approved decisions

| ID | Area | Decision |
|---|---|---|
| M03-01 | Builder personality | Professional with creative character |
| M03-02 | Inspiration | Independent product identity informed by professional tools, without copying them |
| M03-03 | Color | Neutral foundation, restrained semantic colors, distinctive brand accent |
| M03-04 | Theme | Light and dark from the beginning |
| M03-05 | Typography | Functional sans-serif with distinctive hierarchy and clear control typography |
| M03-06 | Density | Compact controls/navigation; generous canvas and previews |
| M03-07 | Catalogue | Flexible visual gallery with adjustable density and useful metadata |
| M03-08 | Comparison | Browse multiple samples and open enlarged previews |
| M03-09 | Organization | Component type, optional visual style, and website-purpose filters |
| M03-10 | Quantity | Curated manageable set, expanded progressively |
| M03-11 | Consistency | Independent sample visual identities, shared technical/content-slot conventions |
| M03-12 | Preview | Isolated component and contextual page preview |
| M03-13 | Canvas | Realistic sample rendering with placeholders for missing content |
| M03-14 | Architecture | Reuse foundations where practical; independent authoring when appropriate |
| M03-15 | Growth | Define full taxonomy early; deliver samples progressively by priority |
| M03-16 | First portfolio | Store-focused first complete journey, generic component foundations |
| M03-17 | Motion | Subtle, purposeful feedback and transitions |
| M03-18 | Responsive | Intentional desktop/tablet/mobile presentations |
| M03-19 | Documentation | Written specifications and interactive visual showcase |
| M03-20 | Source of truth | Existing application repository |

## Two distinct visual systems

### System A — Builder Interface

The application interface users operate: workspace, navigation, panels, controls, sample browser, canvases, responsive controls, progress, guidance, feedback, and review. It must be consistent, accessible, distinctive, and visually subordinate to the website being composed.

### System B — Website Component Design Portfolio

The predefined website designs users browse, select, customize within bounded content fields, and compose: navigation, hero, product grids, content, social proof, conversion, information, and footer components. Samples may have meaningfully different visual identities while sharing technical conventions and content-slot contracts.

## Product guardrails inherited from M00–M02

- The product remains generic and user-directed; the first complete example is store-focused.
- Users browse, compare, select, and arrange predefined high-level component samples.
- Users edit only supported content fields and finite sample options (e.g. text, titles, labels, links, item data, image slots).
- Users do not freely redesign internal structure, move nested elements, edit arbitrary styles/CSS, or manipulate pixel-level geometry.
- Desktop is the structural source. Desktop add/remove/replace updates the shared component collection; tablet/mobile independently control supported ordering, visibility, and responsive presentation.
- Desktop, tablet, and mobile canvases remain visible side by side.
- No AI-generated/selected designs, automatic recommendations, or automatic composition.
- No points, badges, rewards, leaderboards, timers, or subjective design-quality scores.
- The existing GaGet shell and unrelated routes remain unaffected.

## Professional design knowledge

The product must apply experienced professional design practice, not generic template conventions or arbitrary visual decisions. See [Professional Design Framework](professional-design-framework.md) and [Design Quality Checklist](design-quality-checklist.md). Areas include visual design, UX, website patterns, design systems, frontend engineering, responsive design, accessibility, research, and critique.

## Documents

- [Visual identity](visual-identity.md)
- [Design tokens](design-tokens.md)
- [Builder interface specification](builder-interface-specification.md)
- [Component portfolio guidelines](component-portfolio-guidelines.md)
- [Professional design framework](professional-design-framework.md)
- [Design quality checklist](design-quality-checklist.md)
- [Responsive design guidelines](responsive-design-guidelines.md)

## Completion criteria

- [x] Builder and component-portfolio systems are separated.
- [x] Builder direction and anti-patterns are documented.
- [x] Sample catalogue, preview, diversity, and growth conventions are documented.
- [x] M02 composition and content-only editing boundary is preserved.
- [x] Responsive conventions and professional quality framework are documented.
- [x] Repository is the source of truth.
- [ ] Application implementation and visual verification — later implementation milestones.

## Governance

The existing application repository is authoritative. Figma may be used as a complementary exploration/review workspace, but it does not replace repository documentation or implementation tokens. New visual decisions must be checked against M00–M02 and preserve the distinction between System A and System B.
