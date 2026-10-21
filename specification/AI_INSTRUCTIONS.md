# AI Instructions for Product Design, Refactoring, and Feature Work

**Read this file before every non-trivial task** that changes product UI, interaction behavior, layout, design tokens, shared components, or feature capabilities. For concise reusable task prompts, see the repository-root [`command.md`](../command.md). This file remains the canonical workflow and takes precedence over shorthand commands.

## Non-negotiable rule

Treat design documentation as a maintained contract, not a one-time deliverable. Before implementation, discover and read the relevant baseline and target specifications. After implementation and verification, update every document whose facts or expectations changed. If a missing reusable rule is needed, extend the foundation first, then update the feature specification and implementation in the same task. Do not let code, design assets, or docs silently drift apart.

## 1. Resolve the task and baseline

1. Confirm the current branch and baseline commit. Do not create or switch branches unless the user asks.
2. Read `specification/README.md`, this file, and `specification/foundations/design-engineering-ai-workflow.md`.
3. Read `specification/foundations/design-system-token-contract.md` for visual/component changes and `specification/foundations/quality-accessibility-verification.md` for quality expectations.
4. Read `specification/product/current-state.md` and the relevant feature page(s) under `specification/product/`. Read `specification/components/component-inventory.md` and component specifications when shared UI is involved.
5. Inspect actual source code, route definitions, registry data, tests, and relevant Git history on the active branch. Search for existing patterns before creating new ones.
6. Inspect current-state screenshots and their manifest when available. Verify their branch/commit and route/state/viewport metadata. Never assume a screenshot is current merely because it exists.
7. Find the approved target-state specification and its SVG/PNG design assets. If none exists, determine whether the task is a small local fix or introduces a new lasting product/design contract.

**Evidence hierarchy**
- Current behavior: running app, source code and tests on the task's baseline branch/commit.
- Approved expected behavior: accepted target-state feature specification and explicitly approved design assets.
- Shared rules: foundation documents.
- Generated screenshots and test reports: evidence of a particular build, not design authority.
- Old proposals, registry descriptions, mock data and AI assumptions: clues only, never proof.

If current behavior conflicts with documentation, record the mismatch; do not silently rewrite history or claim the target is implemented. If expected behavior is unclear and the decision materially affects scope, usability, data/privacy, architecture, or compatibility, ask the user before choosing.

## 2. Decide which documents must change before coding

Use this decision table:

| Change type | Required design/document work before implementation |
|---|---|
| Local bug or visual defect with an existing approved contract | Read the feature spec and shared rules; add a current-state finding if useful. Do not invent a new pattern. |
| New feature or route | Create/update its product specification from the template, define states, capability boundaries, responsive behavior, accessibility and acceptance criteria. Add target SVG/PNG assets when layout or interaction needs visual communication. Update route/feature inventory. |
| Refactor affecting shared components or multiple workspaces | Audit all consumers; update shared component contract and any affected feature specs before changing the shared behavior. Document deliberate exceptions. |
| New reusable visual/interaction pattern | Extend the relevant foundation/component contract first, then reference it from each affected feature spec, then implement it. |
| New token, variant, breakpoint or layout primitive | Check existing tokens/primitives first. Propose the smallest coherent extension in the token/component contract; document migration and usage before adopting it broadly. |
| Capability, export, route, privacy or browser-support change | Update product capability contract and inventory. Clearly distinguish fully implemented, partial/preview-only, planned and unsupported behavior. |
| Pure internal change with no user-visible or product-contract impact | No new design document is required; still follow relevant quality and verification rules. |

Do not create a separate Markdown file for every tiny change. Extend a canonical document unless the change introduces a distinct feature or reusable contract.

### Task tracking and historical notes

- Do **not** create or maintain a root-level `current_working.md` or another rolling project-wide task diary. Such files become stale when branches and tasks change.
- Track in-progress scope, checklists, review discussion and follow-up items in the relevant GitHub issue or pull request; use commits and CI runs as implementation and verification history.
- Keep durable product behavior and approved expectations in canonical files under `specification/`. Update `specification/product/current-state.md` only when verified current-state facts change; it is not a task log.
- Keep exact test outcomes linked to the commit/CI run in the pull request or the relevant canonical feature specification when they are important long-term verification evidence.
- When removing a legacy working log, search the active branch for references and replace references that prescribe using it. Preserve durable decisions or still-relevant findings in the correct canonical document before deleting the log. Do not copy stale task checklists into the current-state baseline.

## 3. Specify the expected experience

Before writing UI code, the relevant specification must state:
- User problem, intended outcome, scope and non-goals.
- Entry points, route and navigation relationship.
- Current behavior and evidence; known defects or gaps.
- Target hierarchy, layout regions, alignment, spacing, panel/menu anchoring and scroll ownership.
- Component anatomy, tokens, variants and state transitions.
- Empty, default, loading, success, error, disabled, selected and destructive states as relevant.
- Responsive behavior for mobile, tablet, desktop, short viewports, zoom, long translations and RTL.
- Keyboard, focus, touch, reduced-motion, accessibility, privacy and resource-cleanup requirements.
- Capability contract: real operation, output, limits, failure modes and browser/codec dependencies.
- Acceptance criteria that can be verified.
- Links to target SVG/PNG assets and related shared component contracts.

A screenshot alone is not a specification. Pair visuals with written behavior and acceptance criteria. SVG is the editable source for authored wireframes; PNG is a convenient preview. Never edit a generated browser screenshot and present it as a target design.

## 4. Implement without design drift

- Prefer the existing design tokens and shared primitives. Do not add arbitrary colors, spacing values, or near-duplicate components without a documented reason.
- Make the smallest coherent change. Avoid unrelated rewrites.
- Keep the documented behavior and code aligned; if implementation reveals a better approach, update the proposed contract and explain the change before proceeding when it affects user experience.
- Shared shell patterns should be reused, but media/date-time workspaces may retain specialized behavior when justified.
- Do not treat a visible button, registry entry, preview, or menu item as proof of working capability.
- Preserve accurate privacy, export, permission, and browser-support claims.

## 5. Verify implementation and capture evidence

1. Run focused tests first, then applicable component/unit, lint, typecheck, build, smoke and Playwright tests.
2. Run the design-baseline screenshot capture when routes, shared layout, tokens, themes, navigation or feature states may change.
3. Inspect screenshots at relevant viewport sizes and themes. Check visual hierarchy, spacing, clipping, overlapping, menu anchoring, scroll ownership and empty-to-loaded layout transitions.
4. Check keyboard and touch interaction, focus visibility, light/dark themes, RTL, reduced motion, long content and errors where applicable.
5. Compare implementation with the approved target design and acceptance criteria, not with a stale current-state screenshot.
6. If a command or visual check could not run, report it as **not verified**. Never claim tests or visual QA passed without evidence.

Current-state screenshots should be generated from the exact build/commit being evaluated. The capture workflow stores screenshots as a commit-associated CI artifact; it must not silently overwrite target design assets.

## 6. Close the documentation loop after implementation

Before declaring the task complete:

- [ ] Update the feature specification if behavior, layout, state, capability, limits, or acceptance criteria changed.
- [ ] Update foundation/component contracts if a reusable rule, token, component API, breakpoint, or shared interaction pattern changed.
- [ ] Update the product/current-state inventory for routes, navigation, tool availability, capabilities or limitations.
- [ ] Add or revise approved target SVG/PNG assets if the intended design changed.
- [ ] Regenerate current-state screenshots for affected routes when appropriate; identify the exact branch/commit and state.
- [ ] Update tests and the verification record to reflect the final implementation.
- [ ] Remove obsolete/contradictory docs and assets, update all links, and search for stale paths.
- [ ] Report modified docs/assets alongside code changes; mention every test result and remaining limitation.

A failed test means the task is not verified. Do not update documentation to say a target is implemented just because code was attempted. Keep expected behavior, implementation status, and test evidence separate.

## 7. How to start a task

The user may simply say “implement X” and link this file. The agent should then:
1. Read this instruction and the canonical index.
2. Identify the applicable current-state baseline, target specification, shared contracts and evidence.
3. Summarize the findings and proposed scope.
4. Update or add missing specifications before implementation.
5. Implement, test, capture evidence, and update documentation/assets.
6. Provide a concise handoff with links, changed behavior, test outcomes and known gaps.

## 8. Required handoff format

- **Baseline:** branch and commit inspected.
- **Design contract:** current-state and target specification links.
- **Changes:** code, docs, SVG/PNG assets, and inventory changes.
- **Verification:** exact commands, results, browser/viewport/theme coverage, screenshot artifact link if available.
- **Remaining gaps:** failures, unsupported scenarios and anything not verified.
