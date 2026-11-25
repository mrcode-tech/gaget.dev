# Design Playground

**Status:** Initial implementation in progress
**Route:** `/design`
**Architecture:** Feature module inside the existing GaGet.dev Next.js application
**Scope:** A self-contained design-learning and visual-comparison experience.

## 1. Product intent

Design Playground teaches visual design systems through complete, comparable portfolio examples. A learner can open a visual style, inspect the same sample portfolio rendered in that style, and read a structured explanation of the style's history, principles, palette, typography, layout, iconography, and implementation guidance.

The same fictional portfolio content must be used for every style. Only the visual system and its explanatory material change. This makes differences attributable to design decisions rather than different content.

## 2. Decisions made in the November 25, 2026 planning conversation

1. GaGet.dev remains on **one domain, one repository, and one Next.js application**. Do not create a second Next.js application, a monorepo, or a separate deployment for this feature.
2. Design is a **self-contained feature module** hosted at `/design`, not a new top-level GaGet tool and not a separate application process.
3. The existing GaGet interface remains unchanged except for one Design entry in its existing sidebar.
4. Entering `/design` switches to a Design-owned shell. It has its own navigation, page layout, visual language, typography choices, styles, components, and content.
5. Design-specific implementation belongs under the repository-root `design/` directory. Next.js App Router files under `app/design/` should be thin route adapters that import from the module. This keeps extraction practical.
6. Design code must not import GaGet presentation components. GaGet must not depend on Design implementation. The sidebar may link to the public Design route.
7. The project has one Tailwind build configuration. Tailwind configuration cannot be independently scoped to a source folder in the same application. Therefore Design-specific styling must use namespaced CSS/custom properties or CSS Modules and its own token layer; do not modify GaGet's global visual tokens to style Design.
8. The module should avoid global element selectors and global CSS variables that can leak into GaGet. Scope all Design styles beneath a Design root class or use CSS Modules.
9. Use the existing repository framework, package manager, dependencies, linting, tests, and deployment. Do not add a second framework or package manager.
10. Build incrementally. Start with the Design shell, learning landing page, shared sample portfolio, and initial style experiences. Add further learning modules without moving the module's ownership boundaries.

## 3. Current technical baseline

Source inspected on the `main` branch before implementation:

- Next.js App Router, Next.js `^15.4.10`, React `19.1.0`, TypeScript `^5.7.3`.
- Tailwind CSS `^3.4.17`; the repository has one root `tailwind.config.ts` and one global `app/globals.css`.
- Existing app shell is composed by `components/app-shell.tsx`, with navigation in `components/app-sidebar.tsx`.
- Root providers include locale/i18n and next-themes. The module can use the existing provider context but must own its visible shell and presentation.
- The root compatibility instruction file is `agent.md`; canonical repository instructions are `AGENTS.md` and `specification/AI_INSTRUCTIONS.md`. There is no root `robot.md` in the inspected repository.

These are source observations, not runtime verification.

## 4. Route and module ownership

Public routes:

- `/design` — Design Playground landing page and learning index.
- `/design/[style]` — complete sample portfolio in a selected visual style, paired with learning documentation.
- Future routes may include `/design/typography`, `/design/colors`, `/design/icons`, `/design/layouts`, `/design/components`, and `/design/ux`.

Ownership:

```text
app/
  design/
    layout.tsx             # Route-level adapter and Design shell mount
    page.tsx               # Landing route adapter
    [style]/
      page.tsx             # Style route adapter
design/
  components/              # Design-owned shell, preview and learning UI
  data/                    # Shared fictional portfolio and style metadata
  modules/                 # Future learning modules
  styles/                  # Design-only tokens and scoped styles
  lib/                     # Design-specific helpers
  types/                   # Design domain types
```

The precise files may evolve to match the existing repository conventions, but ownership must remain inside `design/` except for thin App Router adapters and the single GaGet sidebar entry.

## 5. Initial style experiences

The initial catalogue should include Bauhaus, Swiss/International Typographic Style, Minimalism, Art Deco, and De Stijl. Each style page must include:

- A complete responsive sample portfolio/homepage using the canonical fictional content.
- A concise style overview and historical context.
- Core principles and recognizable visual characteristics.
- Color palette with named swatches and color values.
- Typography recommendations and hierarchy.
- Layout/grid and spacing approach.
- Iconography/shape language.
- Recommended component treatments and interaction details.
- Practical CSS/Tailwind implementation notes.
- References or further-learning pointers where available and appropriate.

Do not claim historical facts or design attribution without reliable sources when writing detailed educational content.

## 6. Shared sample content contract

The sample portfolio content is a single canonical data source. It should contain fictional identity, biography, project descriptions, project titles, and contact details. Style pages consume this data and must not fork or rewrite it. No real GaGet user/customer content is required.

Visual changes may alter hierarchy, layout, typography, color, imagery treatment, borders, shapes, and component presentation, but the underlying sample text and project ordering should remain the same across style pages.

## 7. Isolation and integration contract

- GaGet shell must not wrap the Design experience. Route detection in the existing shell should allow `/design/*` to render the Design-owned shell instead.
- The Design shell must provide a clear route back to GaGet.
- The GaGet sidebar gets exactly one Design entry, without rearranging the existing workspace, Dev Tools, Batch Workbench, or MCP navigation order.
- Do not import GaGet's Button, Card, navigation, ToolLayout, or other presentation components into the Design module.
- Reuse only framework-level capabilities and deliberately neutral utilities when they do not create a visual or architectural dependency.
- Keep CSS selectors and custom properties namespaced. Do not redefine `body`, bare headings, or global theme tokens from the Design module.
- Keep module data independent of GaGet's tool registry.
- Do not add a separate Tailwind config: Tailwind scans and compiles the application as one build. Isolate the Design visual system through CSS Modules and/or scoped Design tokens.
- Keep locale-aware route behavior compatible with the existing middleware. Design content may begin in English, but navigation labels should respect the active site locale where translations are already supported.

## 8. Non-goals

- No separate domain, subdomain, Next.js runtime, deployment, or package manager.
- No changes to the appearance or behavior of existing GaGet tools, workspaces, header, or sidebar beyond the Design link.
- No general-purpose visual editor or arbitrary CSS playground in the first phase.
- No dependency on external design APIs.
- No user-upload requirement or server-side image processing.
- No claim that a style page is historically comprehensive; educational content should grow iteratively.

## 9. Delivery phases

### Phase 1 — Foundation and first usable experience
- [ ] Add the isolated Design route and shell.
- [ ] Add the GaGet sidebar entry.
- [ ] Add the Design landing page and style catalogue.
- [ ] Define one shared fictional portfolio data source.
- [ ] Implement initial complete style previews and learning sections.
- [ ] Add responsive, accessibility, and route tests.

### Phase 2 — Learning depth
- [ ] Improve historical context and source-backed educational content.
- [ ] Add detailed palette, typography, layout, icon, and component references.
- [ ] Add style comparison navigation while preserving the same sample content.

### Phase 3 — Additional playgrounds
- [ ] Typography playground.
- [ ] Color theory and palette playground.
- [ ] Iconography and illustration playground.
- [ ] Layout/grid playground.
- [ ] Component and interaction-pattern playground.
- [ ] UX and accessibility learning module.

## 10. Acceptance criteria

- [ ] `/design` loads inside the existing Next.js application.
- [ ] Design routes do not render the GaGet sidebar or header; they render the Design-owned shell.
- [ ] GaGet routes remain visually and functionally unchanged.
- [ ] The existing GaGet sidebar contains one Design entry and existing navigation order is preserved.
- [ ] Design components and styles are owned by `design/`, with thin route adapters in `app/design/`.
- [ ] Design UI does not import GaGet presentation components.
- [ ] Design CSS/tokens do not leak into GaGet pages.
- [ ] Every style uses the same canonical sample content.
- [ ] Style pages explain their visual decisions, not just show a themed screenshot.
- [ ] Responsive behavior, keyboard navigation, focus, reduced motion, and supported locale direction are checked.
- [ ] Lint, typecheck, tests, and production build pass for the exact revision.
- [ ] Browser screenshots are inspected before claiming visual verification.

## 11. Verification record

Implementation and verification results must be added after they are run. Do not mark a phase Verified based on documentation or code creation alone.

| Check | Result | Evidence |
|---|---|---|
| Branch creation from main | Completed | GitHub branch ref |
| Lint | Not run | — |
| Typecheck | Not run | — |
| Unit/component tests | Not run | — |
| Production build | Not run | — |
| Browser visual QA | Not run | — |
