# Implementation Prompt — Generic Website Design Builder: First MVP

## 1. Mission

Implement the first complete, usable MVP of the Generic Website Design Builder in the existing \`mrcode-tech/gaget.dev\` repository.

The approved specifications in \`specification/i-store-design-builder/\` are the product and implementation contract. All milestones M00–M15 have been reviewed and approved. Do not create another planning phase, introduce another milestone, or reopen approved decisions. Begin implementation.

The MVP must let a non-professional user create a website through a guided, game-like journey: define the website, explore visual direction, establish visual identity, select and assemble predefined components, build a homepage, configure responsive behavior, create additional pages, edit content, review quality, and export a design handoff.

The product is generic and must support different business and website types. A store website is the first complete illustrative journey, not the product's only use case.

This is a functional implementation task, not a static prototype.

## 2. Repository and branch boundaries

- Repository: \`mrcode-tech/gaget.dev\`
- Working branch: \`feature-design\`
- Fetch and inspect the latest remote branch before changing files.
- Confirm the branch and inspect repository instructions, including \`AGENTS.md\`, \`agent.md\`, and \`robot.md\`, where present.
- Follow the existing framework, package manager, code conventions, and test commands.
- Work only on \`feature-design\`.
- Never modify \`main\` or \`stage\`.
- Never merge or deploy.
- Preserve unrelated changes and existing user work.
- Do not commit unless the repository workflow or user explicitly requires it; otherwise report the working-tree state.

## 3. Specification authority

Start with:

- \`specification/i-store-design-builder/README.md\`
- All approved M00–M15 milestone documents and their relevant supporting documents.
- \`specification/i-store-design-builder/decisions/ADR-0001-lightweight-session-mvp.md\)

Read the feature specifications, user stories, interaction specifications, technical designs, data contracts, acceptance criteria, testing strategies, and implementation tasks relevant to each phase.

ADR-0001 is authoritative where earlier documents conflict about persistence and the MVP runtime boundary.

Rules:

1. Approved specifications are the source of truth.
2. Do not silently change behavior to simplify implementation.
3. Do not omit required functionality because it is inconvenient.
4. Do not implement post-MVP functionality from M15 as part of the first MVP.
5. Do not rewrite approved specifications merely to match an implementation shortcut.
6. If a genuine contradiction or technically blocking ambiguity cannot be resolved from the approved documents or repository conventions, report the precise conflict and ask one focused question. Do not reopen unrelated decisions.
7. Keep documentation synchronized only when an actual specification correction or implementation deviation is required.

## 4. Product definition

The product is a visual website composition and design-building experience for non-professional users.

It is not a Figma clone, general-purpose graphics editor, free-form canvas editor, professional CSS/HTML editor, AI-generated website builder, or store-only builder.

Users build websites by selecting predefined, professionally designed, high-level component samples and arranging them into pages. They can edit supported content and finite configuration fields such as titles, text, descriptions, images, logos, button labels, links, product/service information, and sample-supported styles.

Users cannot arbitrarily modify a component's internal geometry, detailed layout, or implementation.

The catalogue provides design variety; the user controls composition. All choices must remain explicit and user-directed. Never automatically select, insert, rank, recommend, replace, or rearrange components or samples.

## 5. MVP scope and exclusions

### Included

- One website project with multiple pages.
- Project definition and configuration.
- The approved 11-level guided journey.
- Component catalogue, taxonomy, search, filters, previews, and comparison.
- Explicit component selection, insertion, positioning, and reordering.
- Supported property/content editing.
- Component duplication, removal, and compatible sample replacement.
- Shared visual identity.
- Curated color palettes, typography, and shared styles.
- Desktop, tablet, and mobile canvases.
- Independent responsive ordering and visibility.
- Homepage construction and additional page planning/construction.
- Shared website elements and stable internal navigation references.
- Structured content editing.
- Session-only local media selection and metadata.
- Quality review with actionable findings.
- Versioned JSON export.
- Markdown handoff.
- Optional ZIP export when supported by the approved technical specification.
- Responsive, accessible, functional UI and automated verification.

### Explicitly excluded

Do not implement accounts/authentication, cloud persistence, database-backed project storage, autosave, local-storage or IndexedDB project persistence, automatic recovery, undo/redo, version history, project import, hosted asset libraries, backend media storage, collaboration, sharing, publishing, production website generation/deployment, AI-generated content, AI design recommendations, AI image generation, stock-image browsing, automatic component recommendations, payments, or monetization.

Project state is temporary in-memory data. Refreshing or closing the browser may lose unexported work. Communicate this limitation clearly at appropriate points, especially before leaving the workspace. Explicit export is the user's way to retain work.

## 6. Architecture and isolation

The builder is initially hosted inside the existing GaGet Next.js application but must be designed as an isolated module that can later be extracted into a standalone application.

- Inspect the current application architecture and the approved route specification before choosing the integration point.
- Do not assume the existing GaGet Design Playground and this Website Design Builder are the same feature.
- Do not unnecessarily change the GaGet shell, navigation, styles, or existing user experience.
- Keep builder-specific styles, tokens, components, state, domain logic, and catalogue data isolated.
- Keep host integration thin and explicit.
- Do not create a second nested Next.js application.
- Avoid global CSS changes that leak into GaGet.
- Avoid dependencies on GaGet-specific UI components inside the builder domain.

Use clear boundaries for the application shell, domain model, catalogue, rendering registry, workspace, journey, visual identity, content/media, validation, and export. Follow the exact approved technical design where it differs from this suggested grouping. Keep the architecture modular and testable without overengineering.

## 7. Journey and progression

Implement all 11 approved levels:

| Level | Name | Purpose |
|---|---|---|
| 0 | Define website | Establish purpose and project information |
| 1 | Explore visual direction | Explore and choose a visual direction |
| 2 | Build shared website frame | Establish shared website structure and identity |
| 3 | Design homepage introduction | Design the introductory section |
| 4 | Build homepage content | Compose homepage content |
| 5 | Complete homepage | Review and complete homepage composition |
| 6 | Design responsive behavior | Configure desktop, tablet, and mobile |
| 7 | Plan additional pages | Identify and organize additional pages |
| 8 | Design additional pages | Compose and edit additional pages |
| 9 | Review website | Review completeness, content, and quality |
| 10 | Complete design and handoff | Complete final review and export |

All levels are accessible from the beginning. Users can navigate freely and revise earlier decisions.

Mission statuses are Not started, In progress, Complete, and Needs review. Support Not needed where permitted.

- Users explicitly mark a level complete.
- A level can be marked complete while missions remain unfinished.
- Level completion must not automatically change mission statuses.
- Mission completion follows its requirements or an explicit Not needed decision.
- Earlier changes preserve existing work and mark affected missions Needs review.
- Overall project completion follows the approved required-mission and final-review rules.
- Progress percentages must not imply unfinished required work is complete.

Provide compact progress, level navigation, mission lists, clear status indicators, contextual guidance, and navigation to unfinished or affected work. Use practice-first optional explanations and examples. Do not add points, badges, artificial rewards, forced sequencing, or AI recommendations.

## 8. Workspace and interaction

Implement the approved hybrid workspace:

**Left panel:** component library/categories, search and filters, page navigation, journey access, and relevant samples.

**Center:** active page canvas, desktop/tablet/mobile presentations, composition, and preview interactions.

**Right panel:** selected component properties, supported content fields, sample-specific settings, and responsive configuration.

Use contextual/collapsible panels to preserve canvas space. The experience should feel like a professional creative tool, not an administrative dashboard. Avoid excessive borders, separators, cards, charts, controls, and decorative gamification. Support the approved builder light/dark themes without leaking styles into GaGet.

## 9. Catalogue and composition engine

Implement a comprehensive hierarchical taxonomy and data-driven catalogue.

Users must be able to browse categories, search keywords, filter, inspect visual sample cards, open enlarged previews, compare samples, preview supported breakpoints, select a sample, confirm insertion, choose placement, reorder, duplicate, remove with confirmation, and replace a sample while preserving compatible content.

- Use static, version-controlled catalogue data.
- Keep definitions separate from renderers.
- Use the approved renderer registry keyed by component type/sample identity.
- Samples must be meaningfully and visibly distinct, not one generic template with superficial color changes.
- Use synthetic sample content.
- Keep catalogue definitions maintainable and editable.
- Do not spread catalogue content as hardcoded literals throughout the UI.

Insertion and placement must be explicit. Provide drag-and-drop where specified and accessible alternative reorder controls. Duplicating creates a new stable instance ID. Replacement preserves compatible content and handles incompatible properties transparently. Removal requires confirmation. Validate structural changes.

Never automatically arrange, select, recommend, or replace samples.

## 10. Visual identity builder

Implement the approved guided identity workflow:

1. Visual direction.
2. Color palette.
3. Typography.
4. Imagery direction.
5. Shared component styles.
6. Spacing/layout presets.
7. Review and explicit application.

Provide curated palettes with semantic roles, supported adjustments, contrast feedback, and explanations. Do not silently override user choices.

Use WCAG 2.2 AA contrast baselines: normal text 4.5:1, large text 3:1, and applicable non-text interface elements 3:1. Contrast failures are explanatory review findings according to the specification, not silent corrections.

Provide curated font pairings and type scales, plus curated button/form styles and spacing/layout presets. Support immediate previews and explicit confirmation before applying an identity. Preserve existing component structure, content, and responsive arrangements. Components consume shared identity tokens while retaining their individual sample character.

Maintain one active identity and support draft changes. Avoid duplicate sources of truth between \`ProjectSettings.visualDirection\` and the new identity model; follow the approved data contract.

Do not implement arbitrary CSS editing or free-form design controls.

## 11. Homepage builder

Implement the full homepage composition experience. Users browse supported section families, explore multiple designs per section type, preview, select, insert, position, reorder, edit supported content, replace, duplicate, remove, and preview at all breakpoints.

The homepage must be assembled from explicit user choices. Provide enough distinct sample designs to make the first store journey usable and demonstrate generic catalogue architecture. Do not deliver only one generic homepage template.

## 12. Responsive design

Implement three simultaneously visible canvases: desktop, tablet, and mobile, following the approved workspace layout.

- Desktop owns shared component membership.
- Tablet and mobile independently configure ordering.
- Tablet and mobile independently hide/show components.
- Shared content and shared component configuration synchronize across canvases.
- Responsive ordering and visibility remain breakpoint-specific.
- Hiding a component at a breakpoint must not delete it from the project.
- Clearly communicate which settings are shared and which are breakpoint-specific.
- Provide meaningful sample-specific responsive presentations, not merely scaled desktop screenshots.

Keep the responsive model consistent with approved data contracts.

## 13. Multi-page builder

Implement page planning and lifecycle, page creation, active-page selection, metadata editing, composition, renaming, reordering/removal where specified, shared website elements, navigation configuration, and internal-reference validation.

Use stable internal page references rather than display names or fragile URL dependencies. The MVP must demonstrate a coherent multi-page website, not just a homepage with nonfunctional links.

## 14. Content and local media

Implement the structured content types and fields defined in M13. Changes update previews immediately. Validate required fields and provide actionable feedback.

Support local image/file selection, assignment to supported fields, asset metadata, and editable alternative text. Media remains local to the active session. Do not upload assets, create hosted asset libraries, add stock browsing, or generate images. Clearly communicate the possibility of losing unexported project data and session media on refresh/close.

## 15. Quality review

Implement the M13/M15 quality review. Cover applicable findings such as missing required content, missing/unsuitable alt text, empty/invalid links, broken internal references, incomplete required sections, responsive visibility/composition issues, contrast findings, structural inconsistencies, and export readiness.

Every finding must identify the affected page/component, explain the issue and why it matters, provide a direct route to the relevant editor where possible, and update when corrected. Do not silently change user content to clear findings. Distinguish errors, warnings, and informational suggestions according to the specifications.

## 16. Export and handoff

Implement M14.

### JSON

Generate the approved versioned project blueprint. Include required project, page, composition, identity, responsive, content, and asset metadata. Follow the schema, include version information, validate before export, and produce deterministic output. Exclude transient UI state unless specified.

### Markdown

Generate a readable handoff document describing website structure, pages, identity, component composition, content, responsive behavior, and relevant implementation guidance as specified.

### Optional ZIP

Implement if supported by the approved technical specification and application environment. It may contain the JSON blueprint, Markdown handoff, selected available session media, and required metadata. Clearly indicate Complete or Incomplete status and never claim missing session media is included.

All export processing is local. Do not upload project data, create backend export services, implement import, or generate/publish a production website. Test actual exported contents, not just download success.

## 17. State management and data integrity

Follow the approved technical design and data contracts.

- Maintain one authoritative in-memory project model.
- Use stable IDs.
- Separate domain state from transient UI state.
- Avoid duplicate sources of truth.
- Validate structural changes.
- Preserve compatible content during replacement.
- Propagate relevant Needs review statuses.
- Separate shared configuration from breakpoint-specific configuration.
- Use stable page references.
- Keep catalogue definitions immutable at runtime unless explicitly allowed.
- Do not put transient UI state into the exported project model.

Use predictable state updates and avoid uncontrolled mutation. Test important domain operations and state transitions.

## 18. Implementation sequence

These are implementation phases, not new specification milestones. Do not create duplicate planning documents.

### Phase 1 — Foundation and project workspace
Isolated module, application shell, project domain model, in-memory state, project creation/definition, page model foundation, workspace layout, and journey navigation.

**Exit:** user creates a project and enters a functional workspace; state updates correctly in memory.

### Phase 2 — Catalogue and composition engine
Taxonomy, static catalogue data, sample definitions, renderer registry, previews, explicit selection/insertion, placement, reordering, duplication, removal, and replacement.

**Exit:** user builds and modifies a page using multiple genuinely distinct samples.

### Phase 3 — Journey and guided progression
All 11 levels, mission model/statuses, completion rules, Not needed, Needs review propagation, progress overview, and contextual guidance.

**Exit:** navigation and progression match the approved rules.

### Phase 4 — Visual identity
Visual direction, curated palettes, typography, shared styles, spacing presets, contrast checks, draft identity, preview, and explicit application.

**Exit:** user can create, preview, and apply an identity reflected in compatible components.

### Phase 5 — Homepage composition
Section library, distinct samples, content editing, and composition controls.

**Exit:** user completes a meaningful homepage through explicit choices.

### Phase 6 — Responsive design
Three canvases, independent breakpoint order/visibility, shared content synchronization, and responsive previews.

**Exit:** responsive behavior matches the approved model.

### Phase 7 — Multi-page builder
Page planning, creation, navigation, shared elements, composition, and reference validation.

**Exit:** user creates a coherent multi-page website.

### Phase 8 — Content, media, and quality
Structured content, session-only local media, metadata, alt text, quality checks, and actionable findings.

**Exit:** user can complete and review content without backend asset storage.

### Phase 9 — Export and handoff
Validated JSON, Markdown, and optional ZIP.

**Exit:** user can export a complete, validated design handoff locally.

### Phase 10 — MVP acceptance and hardening
Integration, accessibility, responsive, functional, regression, and automated testing.

**Exit:** MVP meets the full Definition of Done below.

Implement in dependency-aware order. Parallelize only independent work and integrate against shared contracts.

## 19. Design and UX quality

The MVP must be visually convincing as well as functional. Use a professional creative-tool experience, clear hierarchy, consistent spacing and typography, whitespace, high-quality sample previews, obvious selection/editing states, useful empty states, clear progress/navigation, helpful confirmation/error messages, keyboard accessibility, focus management, responsive layouts, and light/dark support.

Distinguish catalogue previews from the user's actual website. Avoid a generic administrative dashboard. Keep the builder's visual language isolated from GaGet. Use synthetic content and assets; never use real content or identity from unrelated projects.

## 20. Testing strategy

Use the existing project's testing framework and conventions. Do not introduce redundant tooling without a clear reason.

### Unit/domain tests

Cover project/page creation and lifecycle; component insertion/removal/duplication/reordering/replacement; compatible content preservation; responsive order/visibility; shared content synchronization; visual identity draft/application; mission transitions; level completion; Not needed; Needs review propagation; structural validation; page references; export serialization and validation.

### Component/integration tests

Cover workspace navigation, catalogue search/filter, sample preview, insertion/editing, property panels, page management, responsive canvas interactions, identity workflow, progress/mission interactions, content editing, local media selection, quality-review navigation, and export.

### End-to-end journeys

1. **Create website:** open builder, create project, define purpose, select visual direction, enter workspace.
2. **Build homepage:** browse and preview samples, insert and arrange, edit content, replace a sample, verify compatible content preservation.
3. **Visual identity:** select palette and typography, preview, apply, verify effect on existing components.
4. **Responsive:** inspect all canvases, change tablet order and mobile visibility, edit shared content, verify shared and breakpoint-specific behavior.
5. **Additional pages:** create pages, compose sections, configure navigation, verify internal references.
6. **Review/export:** create incomplete content, verify actionable findings, fix them, verify review updates, export JSON/Markdown, validate contents, and verify ZIP contents if implemented.

### Responsive verification

Test at least 375px, 390px, 430px, a tablet viewport, and desktop. Check overflow, clipping, usable panels, readable content, canvas behavior, navigation, and modal/popover positioning.

### Accessibility

Check semantic HTML, keyboard navigation, visible focus, accessible labels/names, contrast, dialogs/confirmations, screen-reader status feedback, accessible alternatives to drag-and-drop, and reduced-motion behavior where relevant.

### Project checks

Run applicable unit, component, integration, E2E, lint, typecheck, and production build commands. Never claim a check passed unless it actually ran successfully.

## 21. GitHub CI-driven verification

Use the remote \`feature-design\` branch as the source of truth.

Before implementation, fetch the branch, inspect repository instructions, and identify existing CI failures.

During implementation:

- Verify locally where useful.
- Push meaningful implementation increments to \`feature-design\` when appropriate for remote CI.
- Run GitHub CI after meaningful increments.
- Inspect actual CI results and complete failure logs.
- Fix implementation failures and rerun affected checks.
- Never weaken tests, remove validation, or suppress errors merely to get a green pipeline.
- If unrelated pre-existing failures block CI, document them precisely and continue independent verification where possible.

Do not merge or deploy.

## 22. Definition of Done

### Product functionality

- [ ] User can create and define a website project.
- [ ] All 11 levels are accessible.
- [ ] Mission and level completion rules work correctly.
- [ ] Catalogue browsing, search, filters, previews, and comparison work.
- [ ] User can explicitly insert and arrange components.
- [ ] Supported content/properties can be edited.
- [ ] Components can be duplicated, removed, and replaced.
- [ ] Visual identity can be created, previewed, and applied.
- [ ] A complete homepage can be composed.
- [ ] Desktop, tablet, and mobile presentations work.
- [ ] Shared and breakpoint-specific settings behave correctly.
- [ ] Additional pages can be created and designed.
- [ ] Internal navigation references are valid.
- [ ] Structured content editing works.
- [ ] Session-only media handling works.
- [ ] Quality review provides actionable findings.
- [ ] JSON export works and is validated.
- [ ] Markdown handoff works.
- [ ] Optional ZIP works if included.
- [ ] Session-only data-loss limitations are communicated.

### Architecture

- [ ] Builder is isolated from the GaGet shell.
- [ ] Builder styles do not leak into GaGet.
- [ ] Domain state is separate from UI state.
- [ ] Catalogue definitions/renderers are data-driven and maintainable.
- [ ] Module can be extracted later without redesigning its domain architecture.
- [ ] Excluded post-MVP functionality has not been introduced.

### Quality

- [ ] Critical domain operations have automated tests.
- [ ] Integration and E2E journeys pass.
- [ ] Responsive verification passes.
- [ ] Accessibility issues are addressed or explicitly documented.
- [ ] Lint passes.
- [ ] Type checking passes.
- [ ] Production build passes.
- [ ] Relevant GitHub CI checks pass, or unrelated pre-existing failures are documented with evidence.
- [ ] Completion claims are evidence-based.

### Git boundaries

- [ ] All changes remain on \`feature-design\`.
- [ ] \`main\` is unchanged.
- [ ] \`stage\` is unchanged.
- [ ] No merge occurred.
- [ ] No deployment occurred.

## 23. Execution and reporting

Work autonomously through the phases. Do not stop after producing a plan, architecture document, component inventory, or static prototype. Do not ask for approval between phases.

Ask only when a genuine unresolved decision blocks correct implementation and cannot be resolved from approved specifications or repository conventions.

For implementation difficulties: inspect the relevant code/specification, identify the root cause, choose the smallest robust solution consistent with the architecture, implement it, add/update tests, run relevant checks, and verify the result.

Do not use temporary hardcoded behavior as a substitute for approved functionality. Do not mark a feature complete merely because its UI exists.

At the end of each meaningful phase, report:
- What was implemented.
- Important files/modules changed.
- Acceptance criteria satisfied.
- Tests/checks actually executed.
- GitHub CI results and relevant failure details.
- Remaining work.
- Genuine blockers or specification conflicts.

Do not create another planning milestone or duplicate specification documents.

### Final delivery report

When the MVP is complete, report:
1. Delivered functionality.
2. Architecture and module boundaries.
3. Verified user journeys.
4. Export capabilities.
5. Automated tests and results.
6. GitHub CI results.
7. Known limitations and deferred post-MVP functionality.
8. Working branch and final commit reference, if applicable.
9. Confirmation that \`main\` and \`stage\` were not modified, no merge occurred, and no deployment occurred.

**Start now:** inspect the latest remote \`feature-design\` branch, repository instructions, and approved M00–M15 specifications. Implement Phase 1, then continue through the phases until the first MVP meets the Definition of Done.
