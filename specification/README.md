# GaGet.dev Product & Design Specification

**Purpose:** A maintained, AI-readable contract connecting product intent, current implementation, approved target design, and verification evidence.

## Start here

**For every non-trivial product, UI, refactor, or feature task, follow [AI Instructions](./AI_INSTRUCTIONS.md) first.** For brief reusable task prompts, use the repository-root [command patterns](../command.md); those shortcuts do not replace the canonical workflow.

## Two authored levels plus generated evidence

### Level 1 — Foundations and reusable rules
- [Design Engineering & AI Workflow](./foundations/design-engineering-ai-workflow.md)
- [Design System & Token Contract](./foundations/design-system-token-contract.md)
- [Quality, Accessibility & Verification](./foundations/quality-accessibility-verification.md)
- [Reusable Design Specification Template](./templates/design-specification-template.md)

### Level 2 — GaGet.dev product design
- [Current-State Product Baseline](./product/current-state.md)
- [Product and Feature Inventory](./product/product-and-feature-inventory.md)
- [Feature Contract Reconciliation](./product/feature-contract-reconciliation.md) — preserves durable requirements from legacy proposals and records route-level verification gaps; requirements remain proposals until approved.
- [Component Inventory](./components/component-inventory.md)
- [Shared Editor Shell Contract](./components/shared-editor-shell.md) — proposed shared layout/interaction contract for Photo, Audio, Video, and Date & Time; not approved yet.
- [Enhanced mobile Features-menu proposal](./assets/target/enhanced-mobile-feature-menu-proposal.svg) — threshold, search results, no-results, RTL, tablet and desktop schematic; Proposal, not approved.
- [Enhanced mobile Features-menu evidence manifest](./assets/target/enhanced-mobile-feature-menu-proposal.md) — state/viewport inventory; distinguishes authored proposal from generated browser verification.
- Feature specifications belong under `product/`; shared reusable component contracts belong under `components/`.
- Approved editable target wireframes belong under `assets/target/` as SVG, with PNG renderings for review where useful.

### Generated implementation evidence
Current-state browser screenshots are generated from the build being evaluated and uploaded as a GitHub Actions artifact. Each capture must identify its build, route, viewport and theme. They are evidence of that snapshot, not target design authority. See [AI Instructions](./AI_INSTRUCTIONS.md) and [Quality & Verification](./foundations/quality-accessibility-verification.md).

## Source-of-truth rules

- **Current behavior:** source code, running application and tests for the build being evaluated.
- **Expected behavior:** approved target-state specification and its explicitly approved assets.
- **Shared rules:** Level 1 foundation documents and component contracts.
- **Evidence:** screenshots and test reports demonstrate one build; they do not independently define design intent.
- A route, registry label, visible button or mockup does not prove that a capability is fully implemented.
- Use status labels consistently: `Implemented`, `Verified`, `Partial`, `Planned`, `Unsupported`, and `Proposal`. Explain the evidence for important status claims.
- Update canonical docs before implementation when a new product/design contract is needed, and update them again after verification if the implementation changes the contract or its status.
- Do not keep competing copies of the same specification. Prefer extending the canonical page and removing obsolete references.

## Task tracking

Do not use a root-level `current_working.md` or another rolling project-wide task diary. Use GitHub issues and pull requests for task scope, progress, open questions and follow-up work; use commits and CI runs for implementation history and test evidence. Keep durable product requirements and verified current-state facts in the canonical specification pages. Before deleting a legacy task log, preserve any still-relevant durable decisions in the appropriate canonical page and remove references that instruct agents to maintain the log.

## Repository context

GaGet.dev is a Next.js App Router application using React, TypeScript, Tailwind CSS, Lucide icons, shared UI primitives and next-themes. The major workspaces are Photo/Image, Audio, Video, and Date & Time, alongside standalone developer tools. See the current-state baseline and inventory for audited details.

## Asset policy

- Authored target wireframes: editable SVG source, plus PNG previews when useful.
- Current-state screenshots: generated from the running application; never manually alter them or mistake them for target designs.
- Keep authored target assets grouped by product/feature and state. Generated screenshot manifests should record build identifier, route, viewport, theme, state and generation date.
- Do not commit generated screenshot churn by default. Use the baseline workflow artifacts for review unless a deliberate, reviewed decision makes a stable screenshot fixture valuable.
