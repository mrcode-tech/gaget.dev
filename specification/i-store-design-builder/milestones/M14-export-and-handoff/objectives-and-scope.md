# M14 — Objectives and Scope

## Goals
- Produce a complete machine-readable representation of the current design.
- Produce a human-readable handoff a developer can understand without opening the builder.
- Preserve incomplete work and distinguish confirmed decisions from draft/placeholders/missing data.
- Represent pages, navigation, sections, sample versions, identity, responsive behavior, content, media references, and quality findings.
- Let users export at any point.
- Offer optional packaging of available user-provided media without a backend asset service.
- Keep export local, explicit, deterministic, and non-mutating.

## Non-goals
- Importing a project back into the builder.
- Cloud save, automatic backup, or project recovery.
- Production HTML/CSS/JS or application code generation.
- Figma synchronization or design-tool file generation.
- Publishing, hosting, domains, deployment, CMS integration, or live website creation.
- Exporting screenshots as the canonical representation.
- Automatic cleanup, completion, or rewriting of project data.

## Export options
- JSON blueprint download.
- Markdown handoff download.
- Optional ZIP package containing both outputs, a manifest, and user-selected session media.

## Completeness
M01 determines overall completion. Export status is Complete only when all applicable required missions are complete (or Not needed where supported) and the user has confirmed final review. Otherwise status is Incomplete. Exporting does not alter mission/level statuses.

## Data integrity
All outputs faithfully represent current project state. Warnings and unresolved items remain present. Missing media is represented explicitly; no fake asset is substituted.
