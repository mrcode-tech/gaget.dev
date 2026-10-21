# Design Specification Template

> Copy this template into the relevant canonical document or use it as a working section in a feature PR. Do not create a new file for a trivial styling fix. All statements about current behavior must be checked against the active branch.

## 1. Metadata

- **Feature / route:**
- **Status:** Implemented / Partial / Planned / Unsupported / Proposal
- **Owner / reviewer:**
- **Branch and baseline commit:**
- **Date audited:**
- **Related canonical docs:**
- **Source files and tests inspected:**

## 2. Product intent

- **User problem:**
- **Primary user and context:**
- **Main job-to-be-done:**
- **Success outcome:**
- **Out of scope:**
- **Privacy/security considerations:**

## 3. Current-state audit

| Observation | Source/test evidence | User impact | Status | Follow-up |
|---|---|---|---|---|
| | | | | |

Separate observed behavior from desired behavior. A route, registry label, or button is not evidence that the underlying operation works.

## 4. Information architecture and entry points

- Canonical route(s):
- Navigation/category/search/favorites entry points:
- Breadcrumb and page title:
- Relationship to existing tools:
- Back/close/replace-file behavior:
- URL/query state and deep-link expectations:

## 5. Capability contract

| Capability/action | Input | Actual operation | Output/export | Limits/unsupported cases | Status |
|---|---|---|---|---|---|
| | | | | | |

Explicitly distinguish preview-only changes from exported output, embedded metadata from sidecars, and supported formats from aspirational formats.

## 6. Content and hierarchy

- Page heading and concise description:
- Primary action:
- Secondary actions:
- Help, privacy and capability disclosure:
- Empty state:
- Loaded/default state:
- Loading/progress state:
- Success state:
- Error/invalid state:
- Disabled/unavailable state:
- Confirmation/destructive state, if needed:

## 7. Layout contract

- Main regions and order:
- Content max width and gutters:
- Header/sidebar/command bar relationships:
- Canvas/workspace/inspector relationships:
- Panel anchoring and z-index:
- Scroll ownership (document, workspace, menu, panel):
- Fixed/sticky elements and short-viewport behavior:
- Empty vs loaded layout differences:
- RTL and text expansion:

## 8. Responsive behavior

Use the repository breakpoints unless an evidence-backed change is approved.

| Range | Expected layout | Navigation/menus | Workspace/panel | Scrolling and constraints |
|---|---|---|---|---|
| XS <640px | | | | |
| SM 640–767px | | | | |
| MD 768–1023px | | | | |
| LG 1024–1279px | | | | |
| XL 1280–1535px | | | | |
| 2XL ≥1536px | | | | |

Test width and height, including a short landscape viewport. Do not treat a breakpoint table as evidence of successful browser behavior.

## 9. Interaction and state model

| Trigger | Preconditions | State change | Feedback | Failure/recovery |
|---|---|---|---|---|
| | | | | |

Include pointer, touch and keyboard operation; focus entry/return; Escape and outside-click behavior; resize/drag constraints; file replacement and cleanup; cancel/retry; undo/reset only where implemented.

## 10. Visual and token contract

- Semantic tokens and existing component variants:
- Typography hierarchy and wrapping:
- Spacing/alignment/density:
- Border/radius/shadow:
- Icon and hit-target sizing:
- Light/dark theme:
- Motion and reduced-motion:
- Any deliberate one-off and why shared patterns do not fit:

Do not invent a token or brand color without approval. Refer to the canonical token contract.

## 11. Accessibility, privacy and resilience

- Accessible name, role, description and live announcements:
- Keyboard/focus order and visible focus:
- Contrast and non-color cues:
- Reduced motion and zoom:
- RTL and language fallback:
- Browser API permissions:
- Local/server processing and data retention:
- File size, pixel/duration, memory and codec limits:
- Unsupported-browser behavior:

## 12. Acceptance criteria

Write observable, testable criteria. Avoid subjective-only criteria such as “looks polished.”

- [ ] Main task completes correctly.
- [ ] Every displayed action works or clearly communicates its unavailable state.
- [ ] Empty, loaded, loading, success, error and disabled states are covered as applicable.
- [ ] Layout matches the contract at all required breakpoints.
- [ ] No unintended page overflow, clipping, overlap, or unexplained gaps.
- [ ] Menus and panels stay within viewport and have correct scroll ownership.
- [ ] Keyboard, focus, touch, RTL, dark mode and reduced motion are reviewed.
- [ ] Privacy and browser capability disclosures are accurate.
- [ ] Relevant unit/component/E2E checks pass.
- [ ] Browser visual QA was performed and findings recorded.
- [ ] Canonical inventory/docs were updated.

## 13. Verification record

| Check | Command / viewport / browser | Result | Evidence or failure |
|---|---|---|---|
| Unit/component | | | |
| Lint/typecheck/build | | | |
| E2E | | | |
| Visual/responsive | | | |
| Accessibility | | | |
| Browser/codec compatibility | | | |

## 14. Risks, unresolved questions and decisions

- **Known risks:**
- **Open questions requiring product input:**
- **Decisions and rationale:**
- **Follow-up work:**

## 15. AI implementation handoff

- Read the canonical index, inventory, workflow, token contract and relevant source/tests.
- Summarize current behavior and constraints before editing.
- State the smallest coherent implementation plan and acceptance checks.
- Ask before consequential ambiguous product decisions.
- Implement using existing primitives/tokens; explain justified exceptions.
- Run relevant tests and inspect the rendered result where possible.
- Report changed files, results, limitations and any unresolved issue.
