# M07 — Design Guidance and Component Library

## Strategic purpose

Make design choices understandable without making choices on the user's behalf.

## Objective

Provide a well-organized library of high-level website components and patterns, with plain-language explanations and visual examples that support independent user decisions.

## Scope

- Component taxonomy and categories.
- Component and pattern descriptions.
- Visual examples and comparisons.
- Available options for each pattern.
- Plain-language explanation of each component's purpose.
- Search, browse, and discoverability within the library.
- Clear distinction between required and optional mission decisions.
- Curated responsive pattern documentation where relevant.

## Explicit product constraints

- No AI recommendations or AI-generated patterns in the initial release.
- No automatic component selection, ranking, insertion, or ordering.
- The library is user-directed; levels introduce concepts but do not permanently gate access.
- Context may organize examples or explain relevance, but must not silently decide what the user should choose.

## Out of scope

Autonomous design generation, personalized AI coaching, competitor analysis, and automatic layout decisions.

## Dependencies

M00, M04, M06.

## Acceptance criteria

Users can browse and understand available component families and patterns, compare their presentation, choose independently, and configure the options exposed by a selected pattern. No system-generated recommendation is presented as a decision.

## Deliverables

Component taxonomy, pattern catalogue, explanations, and library interaction specification.

## Required supporting specifications

Create detailed objectives, feature specifications, user stories, interaction rules, technical design, data contracts, acceptance criteria, testing strategy, and implementation tasks when M07 is refined for implementation. Do not create empty documents merely to satisfy a template.

## Definition of done

- [ ] Component families and patterns are catalogued.
- [ ] Each pattern has an understandable purpose and example.
- [ ] User selection and configuration are explicit.
- [ ] No AI recommendation or automatic selection is required.
- [ ] Library access is not artificially gated by level progression.
- [ ] Acceptance criteria and test evidence are recorded.

## Open decisions

Exact component families, pattern counts, and discovery interactions are refined in M07.

## Status

**Planning.** This document defines intended scope; it does not claim implementation is complete.
