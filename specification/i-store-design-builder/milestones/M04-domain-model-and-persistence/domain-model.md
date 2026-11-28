# Domain Model

## Conceptual entities
- **Project:** root grouping project settings, visual direction, pages and progress.
- **ProjectSettings:** purpose, audience, language, website type/category as useful, visual direction and general bounded settings.
- **Page:** id, name, slug/route, purpose, metadata, settings, composition and review/lifecycle status.
- **ComponentSample:** catalogue definition with id, type, description, version, design reference, content schema, configuration schema and responsive rules.
- **ComponentInstance:** unique insertion referencing sample/version; instance-specific content, configuration and placeholders.
- **ContentSchema:** sample-defined typed fields, labels, defaults, constraints, required/repeatable semantics.
- **ComponentConfiguration:** finite sample-supported options; not unrestricted styling.
- **PageComposition:** shared instance collection plus responsive layouts.
- **ResponsiveLayout:** breakpoint, ordered references, visibility and supported overrides.
- **ContentPlaceholder:** purpose, expected content type, description, optional asset reference and status.
- **AssetReference:** conceptual optional user-supplied media reference; durable asset service not required.
- **ProjectProgress:** levels, missions, decisions, Not-needed choices, completion and review flags, separate from composition.

## Invariants
1. Project groups pages; each page owns a composition.
2. Catalogue samples are reusable definitions, not project instances.
3. Insertions create unique instances with independent content/configuration.
4. Instances reference sample and version.
5. Responsive layouts reference shared instances, not duplicated content.
6. Desktop controls membership; tablet/mobile control supported order, visibility and presentation only.
7. Placeholders do not alter sample design.
8. Progression is separate from composition; level completion does not waive unfinished missions.
9. Sample evolution must not silently destroy user content.
10. Model remains generic and technology-neutral.
11. MVP requires no persistence, auth, export/import or collaboration.

Users edit supported fields and options and arrange high-level components. Arbitrary CSS, pixel geometry and unrestricted internal structure editing are out of scope.
