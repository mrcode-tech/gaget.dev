# Design Engineering & AI Design Workflow

**Status:** Canonical process specification
**Influences:** Design Engineering craft principles associated with Emil Kowalski; Impeccable's structured design guidance for AI-assisted coding. This document is an adaptation for GaGet.dev, not a claim of endorsement or an exact copy of either project.

## 1. Purpose

Connect product intent, design decisions, implementation craft, and verification in one repeatable workflow. Design quality is not satisfied by a polished static mockup or a passing functional test alone. The browser-rendered product must preserve task clarity, responsive behavior, accessibility, performance, and precise interaction feedback.

## 2. Principles

1. **Code and tests are evidence.** Read the current route, component, style, registry and tests before editing. Treat old docs and menu labels as hypotheses, not proof.
2. **Intent before appearance.** State user, task, context, success, constraints, and capability limits before prescribing visual changes.
3. **Reuse intentionally.** Use shared primitives and the existing design tokens. Avoid new design systems, arbitrary one-off values, duplicate navigation, and unnecessary component variants.
4. **Craft the small details.** Alignments, rhythm, focus, hover/active/disabled/loading/error feedback, menu anchoring, scroll ownership, transitions and hit targets all affect perceived quality.
5. **Motion has a job.** Animation should explain a state or spatial transition, never delay frequent work. Respect reduced-motion preferences.
6. **Truthful affordances.** A control must perform its named action or be explicitly unavailable/experimental. Preview and export behavior must not be conflated.
7. **Responsive adaptation, not shrink-to-fit.** Design for viewport width and height, touch, keyboard, zoom, safe areas, RTL, and overflow.
8. **Local-first privacy claims are precise.** Explain browser processing and required permissions; never imply all data stays local without auditing the specific code path.
9. **Evidence closes the loop.** Verify real browser behavior and inspect visual regressions at representative viewports. Do not declare success solely because code was written.

## 3. Required context files and responsibilities

Keep these responsibilities in canonical documentation, not duplicated in per-feature prompt files:

- `README.md` at repository root: setup, architecture and commands (repository-level, not part of the specification consolidation).
- `specification/AI_INSTRUCTIONS.md`: required AI task entry point, baseline discovery, pre-implementation documentation gates, and post-verification closeout.
- `specification/README.md`: canonical index, authority rules and status vocabulary.
- `specification/product/current-state.md`: code-derived baseline and visual-audit status.
- `specification/components/component-inventory.md`: shared component ownership and known audit needs.
- `specification/product/product-and-feature-inventory.md`: routes, current capabilities and known limits.
- `specification/foundations/design-engineering-ai-workflow.md`: design process, AI instructions and interaction quality rules.
- `specification/foundations/design-system-token-contract.md`: tokens, semantic mapping, component variants and governance.
- `specification/templates/design-specification-template.md`: reusable feature specification template.
- `specification/foundations/quality-accessibility-verification.md`: acceptance and release gates.

An AI coding agent must start with `specification/AI_INSTRUCTIONS.md`, then read the index, current-state baseline, relevant product specification, shared contracts, source and tests. Follow the pre-implementation and post-verification gates there. Do not create a new specification file for a trivial change unless it introduces a lasting product contract.

## 4. Workflow gates

### Gate A — Discover and audit

- Identify the branch and working tree. Do not create a branch unless explicitly requested.
- Inspect relevant routes, registry entries, components, CSS variables, primitives, tests and prior changes.
- Enumerate the existing behavior and regressions. Separate facts from assumptions.
- Mark every capability `Implemented`, `Partial`, `Planned`, or `Unsupported` with evidence.
- Preserve unrelated changes and avoid broad rewrites.

**Deliverable:** short audit table: observed behavior, evidence, user impact, target behavior, and verification.

### Gate B — Define experience

Write down:
- User goal and primary task.
- Entry point, information hierarchy and default/empty/loaded states.
- Content, labels, actions and action hierarchy.
- Main interaction sequence and state transitions.
- Responsive behavior by project breakpoint.
- Accessibility, privacy, error, loading, cancellation and recovery expectations.
- Non-goals and explicitly unsupported capabilities.
- Success measures and acceptance criteria.

Do not invent product decisions when the source is ambiguous or requirements conflict. Ask a concise question if the decision materially changes user experience, architecture, privacy, or scope.

### Gate C — Design contract

- Reference the current tokens and shared components by name.
- Define component anatomy and behavior, not just color/size.
- Explain deliberate exceptions and why shared patterns do not fit.
- Specify empty, loading, success, error, disabled, focus, hover, active and selected states where relevant.
- Describe keyboard, pointer, touch and reduced-motion behavior.
- For existing experiences, preserve verified behavior unless the task explicitly authorizes a change.

### Gate D — Implement with craft

- Prefer the smallest coherent change and existing primitives.
- Avoid hard-coded visual values where a semantic token exists.
- Keep state ownership and scroll containers intentional.
- Ensure menus are anchored to their triggers; panel geometry must not create unexplained gaps or overlap.
- Use concise, purposeful transitions. No motion should be required to understand a state.
- Clean up object URLs, media streams, event listeners, timers, and browser resources.
- Keep copy accurate about actual processing, export formats, permissions and limitations.

### Gate E — Verify in browser and tests

- Run the narrowest relevant tests first, then the project's broader checks.
- Inspect actual rendered layouts at representative breakpoints and short viewport heights.
- Compare with the written contract, not an unreviewed generated mockup.
- Verify all affected states, keyboard and touch operation, light/dark themes, RTL, reduced motion, overflow and browser-dependent media behavior.
- Use screenshot comparison only as a verification tool when available; the canonical `specification/` folder stores authored Markdown specifications and approved SVG/PNG target assets; generated current-state screenshots remain CI artifacts.
- Report what ran, what passed, what failed, and what could not be verified.

### Gate F — Close the loop

- Fix regressions or explicitly report blockers; never hide failures.
- Update the feature inventory and relevant contract when behavior changes.
- Remove obsolete/contradictory docs rather than appending another competing proposal.
- Confirm the diff contains only intended changes. Do not merge unless requested.

## 5. Design Engineering checklist

### Layout and visual hierarchy
- Establish a clear primary task and bounded reading/work area.
- Check spacing rhythm, alignment, text measure, control height and density.
- Prevent unexplained empty gaps, overlapping panels, clipped controls and competing borders.
- Keep empty and loaded states coherent without making upload targets dominate loaded workspaces.
- Avoid nested cards and decorative elements that reduce information clarity.

### Interaction quality
- Every control has an observable result and appropriate disabled state.
- Menus/popovers open near their trigger, remain within the viewport, support Escape and preserve focus sensibly.
- Long panels scroll internally; the page/workspace scrolls when its full content needs it. Avoid scroll traps and double-scroll ambiguity.
- Async or expensive actions report progress/result/error and prevent accidental duplicate actions when necessary.
- Undo/reset/retry controls appear only when behavior actually exists.

### Motion and performance
- Motion is short, consistent and purposeful; respect `prefers-reduced-motion`.
- Avoid layout animation that causes reflow or delays high-frequency actions.
- Avoid full-resolution image/audio/video processing on every slider tick if it harms responsiveness.
- Release browser resources when replacing files or unmounting.

## 6. AI Design Fluency checklist

The full task protocol is defined in `specification/AI_INSTRUCTIONS.md`; this section summarizes the craft mindset. Before coding, the agent must:
1. Restate the task and the intended user outcome.
2. Identify the relevant existing pattern and source files.
3. List constraints and what must not change.
4. Distinguish known implementation from planned behavior.
5. Describe the smallest design change and the states it affects.
6. Surface any ambiguity before making consequential assumptions.

After coding, the agent must:
1. Review the diff against the intended task.
2. Check token reuse and shared component parity.
3. Inspect visual and responsive outcomes.
4. Run relevant automated checks and report their exact status.
5. Update canonical docs only where the product contract changed.

Use design-review prompts as focused actions: **Critique** hierarchy and friction; **Audit** consistency/accessibility; **Polish** implementation details without changing intent; **Extract** a reusable pattern only after confirming it is repeated; **Shape** the solution before implementation. These are workflow verbs, not mandatory external commands or a dependency on the Impeccable tool.

## 7. Output format for AI-assisted changes

For a non-trivial UI task, provide:
- Findings and source evidence.
- Proposed behavior and deliberate non-goals.
- Files/areas to change.
- Acceptance checklist.
- Implementation summary.
- Tests run and results.
- Remaining limitations or questions.

Never claim visual QA was completed without a rendered-browser inspection. Never claim a feature is implemented merely because a route or button exists.
