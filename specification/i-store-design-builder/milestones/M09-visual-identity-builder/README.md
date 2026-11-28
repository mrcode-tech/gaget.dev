# M09 — Visual Identity Builder

**Status: Approved — specification baseline complete.** The product and specification baseline is approved. This does not claim that the identity builder, token runtime, previews, accessibility checks, or application behavior have been implemented or verified.

## Strategic purpose

Help users establish a coherent, reusable visual identity for their website through guided, practice-first choices and visual examples. The identity is a project-level foundation that compatible website component samples can consume while retaining their own distinct design character.

The product remains generic. The first complete journey is store-focused, but identity concepts and examples must support other website purposes.

## Objective

Specify the user experience, identity vocabulary, token model, component compatibility contract, preview/application behavior, accessibility checks, runtime boundaries, and verification requirements for a user-directed website visual identity builder.

## Approved decisions

| ID | Area | Approved decision |
|---|---|---|
| M09-01 | Creation experience | Guided, example-led identity journey with free revisiting |
| M09-02 | Canvas relationship | Keep the website canvas visible and preview identity changes during the journey |
| M09-03 | User control | Curated alternatives and bounded supported configuration; no arbitrary design editor |
| M09-04 | Organization | Focused stages for visual direction, colors, typography, imagery, shared styles, spacing, and review |
| M09-05 | Visual personality | Browse, compare, and choose curated visual directions |
| M09-06 | Initial directions | Curated, meaningfully distinct collection expanded progressively |
| M09-07 | Combining directions | Explicitly combine selected aspects, such as palette and typography |
| M09-08 | Color selection | Curated palettes with canvas previews |
| M09-09 | Color roles | Semantic roles for primary, secondary, accent, background, surface, text, muted text, border, and feedback |
| M09-10 | Color customization | Supported color adjustments preserve semantic roles and expose contrast feedback |
| M09-11 | Typography | Curated font pairings previewed across representative text roles |
| M09-12 | Typography controls | Supported font families, weights, and predefined type scales/hierarchy |
| M09-13 | Image direction | Define photography/illustration style, composition, mood, and treatment |
| M09-14 | Image assets | User-supplied assets and generic placeholders; no built-in stock library or image generation |
| M09-15 | Shared styles | Curated button/form style samples and finite supported options |
| M09-16 | Spacing/layout | Curated shared spacing scales and layout presets |
| M09-17 | Sample compatibility | Preserve sample-specific layout/character while applying compatible identity tokens |
| M09-18 | Preview | Representative components and the existing desktop/tablet/mobile canvases |
| M09-19 | Application | Preview changes immediately; apply the reviewed, confirmed identity |
| M09-20 | Existing instances | Update compatible shared styles, preserve structure/content, and flag affected work for review where needed |
| M09-21 | Consistency review | Check semantic colors, typography hierarchy, contrast, shared styles, and responsive presentation |
| M09-22 | Completion | User reviews and confirms the identity |
| M09-23 | Initial scope | Mood, palettes, typography, image direction, shared styles, spacing, responsive preview, tokens, application, and consistency review |
| M09-24 | Identity alternatives | One active identity per project; users may revise it through the identity experience |
| M09-25 | Runtime | Typed in-memory project data only; no persistence or database |
| M09-26 | Separation | Identity tokens and component sample definitions remain separate |
| M09-C1 | Accessibility | WCAG 2.2 Level AA contrast baseline |

## Core product principles

1. **User is the designer.** The product explains and previews choices; the user selects and confirms them.
2. **Website identity is not builder identity.** M03 System A remains the Builder Interface. M09 defines the identity of the website composed in System B.
3. **Guided, not locked.** The experience offers a suggested sequence, but users can revisit stages and continue other work.
4. **Curated, not unrestricted.** Users choose from authored directions, palettes, pairings, and finite options; no arbitrary CSS, pixel geometry, or freeform visual editing.
5. **Compatible, not homogenized.** Component samples consume only supported identity slots and retain their own layouts and visual character.
6. **No automatic design decisions.** No AI generation, automatic identity selection, automatic component/sample selection, ranking, insertion, replacement, or arrangement.
7. **Preview before application.** Exploratory changes are previewed; the user confirms the identity before it becomes the active project identity.
8. **Preserve existing work.** Identity application must not erase component structure, content, instance identity, or responsive composition.
9. **Accessible by design.** Palette and style review uses WCAG 2.2 AA contrast criteria and communicates failures without silently overriding user choices.
10. **MVP runtime remains temporary.** The identity is part of the browser-only in-memory project model.

## Identity workflow

The guided experience covers:
1. Visual personality and direction.
2. Color palette and semantic roles.
3. Typography pairing and hierarchy.
4. Image direction and asset expectations.
5. Shared button/form styles.
6. Shared spacing and layout presets.
7. Review, responsive preview, and explicit confirmation.

This is a suggested path, not a progression gate. Users may revisit any stage.

## Identity model at a glance

The project has one active website identity containing:
- Selected visual direction and explicit combinations.
- Semantic color palette.
- Typography system.
- Image direction.
- Shared component style choices.
- Spacing/layout presets.
- Identity token revision and confirmation state.

Catalogue samples remain separately authored and versioned. Each sample declares the identity slots it supports, the mapping from semantic tokens to its presentation, and any bounded sample-specific overrides. Project component instances do not own copies of the global identity.

## Accessibility baseline

Use WCAG 2.2 Level AA contrast criteria:
- Normal text: at least 4.5:1.
- Large text: at least 3:1.
- Meaningful non-text UI components and graphical information: at least 3:1 against adjacent colors where the WCAG criterion applies.

Contrast feedback is explanatory and user-directed. The builder previews and reports failing combinations and may offer curated alternatives; it does not silently rewrite the palette or block exploration/confirmation solely because a combination fails. This baseline does not certify arbitrary user-supplied imagery or all eventual page content as WCAG conformant.

## Dependencies and ownership

- **M00:** generic product, user agency, no AI design decisions or automatic composition.
- **M01:** 11-level journey, mission semantics, review behavior, and responsive composition invariants.
- **M02:** guided workspace, contextual interaction, and persistent three-canvas model.
- **M03:** distinct Builder Interface/System A and website portfolio/System B; builder tokens do not become website tokens.
- **M04:** project-level conceptual model, sample/instance separation, and temporary in-memory runtime.
- **M05:** isolated module, typed runtime, renderer boundaries, and accessibility foundations.
- **M06:** sample-defined bounded options, commands, responsive layout behavior, and instance preservation.
- **M07:** authored sample contracts, versioning, visual diversity, responsive behavior, and quality governance.
- **M08:** practice-first learning, optional guidance, user agency, and no automatic recommendations.
- **M10/M11/M13:** later ownership of homepage/section composition, responsive detail, and content/review experiences.

M09 owns the project-level website identity and its application contract. It does not replace component sample authoring, composition behavior, responsive composition, or the Builder Interface design system.

## Documents

- [Objectives and scope](objectives-and-scope.md)
- [Feature specification](feature-specification.md)
- [User stories](user-stories.md)
- [Interaction specification](interaction-specification.md)
- [Technical design](technical-design.md)
- [Data contracts](data-contracts.md)
- [Accessibility and consistency review](accessibility-and-consistency.md)
- [Acceptance criteria](acceptance-criteria.md)
- [Testing strategy](testing-strategy.md)
- [Implementation tasks](implementation-tasks.md)

## Completion criteria

- [x] M09 questionnaire and C1 clarification reviewed and approved.
- [x] Scope and exclusions documented.
- [x] Identity stages and user interactions specified.
- [x] Website identity token vocabulary and data boundaries specified.
- [x] Component compatibility and application behavior specified.
- [x] Accessibility and consistency review criteria specified.
- [x] Runtime and dependency boundaries reconciled with M00–M08.
- [x] Acceptance and testing strategy documented.
- [x] Implementation work decomposed for future planning.
- [ ] Application implementation — future work.
- [ ] Automated and manual implementation verification — future work.

## Governance

Use synthetic projects, identities, palettes, text, and sample content in specifications and tests. Preserve M00–M08 approved decisions. Keep website identity separate from the Builder Interface identity and from catalogue sample definitions. Specification approval is not evidence of implementation, testing, deployment, or extraction into a standalone codebase.
