# M05 — Application Foundation and Workspace

**Status: Approved baseline — specification complete.** This milestone defines the application foundation and initial functional workspace. Approval authorizes these specifications only; it does not claim implementation or verification is complete.

## Objective

Establish a portable, isolated Website Design Builder module inside the existing GaGet application for the first MVP. Deliver project creation and initialization, the workspace shell, three empty responsive canvases, a data-driven synthetic sample catalogue, independent sample previews, typed runtime state, and the renderer foundation.

## Architectural context

GaGet is the temporary environment for developing the product specifications and implementing the first MVP. After the agreed specification milestones and first MVP implementation are complete, a new standalone codebase will be created and the approved specification and implementation will be extracted into it.

The builder must therefore be isolated and portable from its beginning. It must not become dependent on GaGet-specific business logic, shell behavior, global styling, or infrastructure in ways that prevent practical extraction. This does not require a nested Next.js application, extraction tooling, or a second codebase in M05.

## Approved decisions

| ID | Area | Decision |
|---|---|---|
| M05-01 | Module isolation | Fully isolated builder module with its own internal architecture, styling boundaries and workspace |
| M05-02 | Entry | Both a GaGet entry point and a direct builder route |
| M05-03 | Project creation | Short creation step collecting project name and website purpose; remaining context is progressive |
| M05-04 | Workspace | Flexible hybrid workspace with contextual panels |
| M05-05 | Canvas foundation | Three empty responsive canvases with page boundaries |
| M05-06 | Catalogue | Catalogue framework with synthetic sample cards, selection and preview |
| M05-07 | Initialization | Minimal default page and responsive layout structures |
| M05-08 | State | Lightweight domain-state architecture with action/command boundaries |
| M05-09 | Domain model | Typed model, validation and explicit domain invariants |
| M05-10 | Catalogue data | Typed sample definitions in a data-driven static catalogue |
| M05-11 | Rendering | Renderer registry keyed by component type/sample, with isolated sample renderers |
| M05-12 | Styling | Module isolation with selective reuse of existing primitives, without changing global behavior |
| M05-13 | Routing | Dedicated builder entry/workspace routes; project pages remain internal state |
| M05-14 | Theme | Light and dark themes, aligned with GaGet theme infrastructure where practical and without coupling |
| M05-15 | Accessibility | Keyboard navigation, focus management, semantic controls, accessible panel behavior, and integrated checks |
| M05-16 | Empty/error states | Empty catalogue/page, invalid selection and basic recoverable UI states |
| M05-17 | Verification | Unit/component tests, lint, typecheck, build, isolated workspace E2E, responsive and accessibility verification |
| M05-18 | Scope | Foundation plus functional catalogue browser and sample preview; no full composition engine |

## Project creation clarification

The initial creation step asks only for:
- Project name.
- Website purpose.

Audience, offering, language, visual direction and other project context remain available in the project model and can be completed progressively through the journey. They are not mandatory upfront fields.

## Sample preview clarification

Samples are previewed independently in an enlarged preview experience and, where useful, a contextual page preview. Previewing must not mutate project composition. Insertion is a separate explicit operation and is outside M05 scope.

## M05 scope

Included:
- Isolated module, direct route and GaGet entry point.
- Short project creation and minimal project initialization.
- Workspace shell and contextual panels.
- Three empty responsive canvases.
- Static typed catalogue containing synthetic samples.
- Catalogue browsing, selection and independent preview.
- Typed project/domain model and lightweight update actions.
- Renderer registry and isolated sample renderers.
- Light/dark theme foundation.
- Basic empty/error states.
- Accessibility and verification foundations.

Deferred or excluded:
- Actual component insertion and full composition.
- Full responsive editing and breakpoint-specific composition controls.
- Complete component portfolio and complete mission journey.
- Persistence, autosave, undo/redo infrastructure, history and recovery.
- Backend, database, authentication, collaboration and cloud assets.
- Import/export.
- AI capabilities.
- Standalone codebase creation or extraction tooling.

## Documents

- [Architecture boundaries and portability](architecture-boundaries.md)
- [Workspace and canvas foundation](workspace-and-canvas.md)
- [Project creation and initialization](project-initialization.md)
- [Catalogue and sample preview](catalogue-and-preview.md)
- [Runtime state and rendering](runtime-state-and-rendering.md)
- [Styling, themes and accessibility](styling-themes-accessibility.md)
- [Verification and acceptance criteria](verification-and-acceptance.md)

## Relationship to earlier milestones

- M00 remains the product strategy and generic, user-directed product baseline.
- M01 remains the 11-level journey and progression model; M05 does not implement the complete journey.
- M02 remains the workspace interaction and high-level sample-based composition UX baseline.
- M03 remains the source of truth for the two visual systems: builder interface and website component portfolio.
- M04 remains the domain and runtime model baseline: browser-only, temporary, in-memory JSON with no persistence.

M05 refines the application foundation only. It does not silently change earlier approved decisions.

## Completion criteria

- [x] M05 decisions reviewed and approved.
- [x] Architecture, workspace, project initialization, catalogue, runtime, styling/accessibility and verification specifications documented.
- [ ] Application implementation — future implementation work.
- [ ] Automated and visual verification of implementation — future implementation work.

## Governance

The repository remains the source of truth for specifications and the first MVP. Specifications must use synthetic projects and content. Keep this milestone separate from implementation claims: approval means the baseline is approved, not that its functionality exists.
