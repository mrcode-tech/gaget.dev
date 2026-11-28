# M09 — Acceptance Criteria

## Identity creation

- [ ] A user can browse a curated collection of meaningfully distinct visual directions.
- [ ] Each direction has a clear name, explanation, and representative preview.
- [ ] Users can compare directions and choose a starting direction.
- [ ] Users can explicitly combine supported aspects from different directions.
- [ ] Users can revisit stages without being progression-gated.
- [ ] The website canvas remains visible throughout the identity experience.

## Color

- [ ] Curated palettes expose the approved semantic roles.
- [ ] A selected palette updates draft previews.
- [ ] Supported color adjustments retain semantic role identity.
- [ ] Relevant text and non-text contrast combinations are evaluated against WCAG 2.2 AA thresholds.
- [ ] Failures identify affected roles, ratio, and applicable target.
- [ ] Contrast findings do not silently rewrite values or block exploration/confirmation.

## Typography

- [ ] Curated pairings preview headings, body text, labels, controls, and supporting text.
- [ ] Supported type scales and font weights are bounded and documented.
- [ ] Font fallback/availability behavior is represented accurately.
- [ ] Arbitrary per-element typography editing is not exposed.

## Imagery

- [ ] Users can select a supported image direction.
- [ ] The experience does not imply that image direction creates or supplies an image.
- [ ] User asset references and purpose-aware placeholders remain compatible with M04/M06.
- [ ] No stock-image picker or image-generation capability is introduced.

## Shared styles and spacing

- [ ] Curated button/form styles expose only documented finite options.
- [ ] Curated spacing/layout presets expose semantic supported values, not arbitrary geometry.
- [ ] Each sample declares which identity roles it supports.
- [ ] Unsupported identity roles do not cause implicit styling changes.

## Preview and application

- [ ] Draft identity changes preview immediately on representative components.
- [ ] Desktop, tablet, and mobile canvases remain available simultaneously.
- [ ] Preview does not mutate active identity or project composition.
- [ ] The user explicitly confirms application.
- [ ] Application is atomic.
- [ ] Compatible tokens are applied deterministically.
- [ ] Component instance IDs, sample references/versions, content, configuration, placeholders, membership, ordering, visibility, and responsive overrides are preserved.
- [ ] No component is selected, inserted, replaced, removed, duplicated, or reordered by identity application.
- [ ] Affected/unsupported components are communicated for review where relevant.

## Consistency review

- [ ] Review covers semantic color use, typography hierarchy, contrast, shared styles, and responsive presentation.
- [ ] Findings are understandable and identify affected roles/components/views.
- [ ] Review does not generate a subjective aesthetic score or automatically correct user choices.
- [ ] Identity-level checks do not claim universal accessibility certification.

## Domain and runtime

- [ ] One active identity per project is supported.
- [ ] Draft exploration does not partially mutate the active identity.
- [ ] Identity catalogue definitions remain separate from project values.
- [ ] Identity data remains separate from M03 Builder Interface tokens and M07 sample definitions.
- [ ] Sample compatibility is explicit and versioned.
- [ ] Data remains typed and in-memory only.
- [ ] No persistence, database, browser storage, authentication, autosave, history, undo/redo, or recovery is introduced.

## Product guardrails

- [ ] The product remains generic; store examples do not hardcode commerce assumptions.
- [ ] Users retain all identity and composition decisions.
- [ ] No AI-generated identity/assets or automatic recommendations are introduced.
- [ ] No arbitrary CSS, pixel geometry, or detailed editor behavior is introduced.
- [ ] M01 mission/level semantics and M06 responsive composition invariants remain unchanged.
