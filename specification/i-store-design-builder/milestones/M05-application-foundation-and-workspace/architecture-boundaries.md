# Architecture Boundaries and Portability

## Purpose

Define the isolation boundary for the Website Design Builder while it is hosted temporarily inside GaGet. The first MVP is implemented in the existing GaGet repository, but the builder is intended to become a standalone product in a later phase.

## Temporary host and future product

GaGet provides a temporary development host for:
1. Product and technical specification authoring.
2. The first MVP implementation and verification.

After the agreed specification milestones and first MVP are complete, a new codebase will be created. The approved specifications and appropriate implementation will be extracted into that codebase.

This future extraction is a strategic direction, not an M05 implementation task.

## Isolation requirements

The builder must have:
- A clearly bounded module/folder structure.
- Its own internal application composition and workspace shell.
- Its own styling boundary and design tokens.
- Explicit domain types and state-update contracts.
- Its own catalogue definitions and renderer registry.
- A clearly defined route entry boundary.
- Tests that can exercise the module without depending on unrelated GaGet features.

Avoid importing GaGet-specific business logic or coupling domain logic to host navigation, shell state, global styles, or host-only data structures.

## Selective reuse

Existing infrastructure or UI primitives may be reused when:
- The dependency is stable and generic.
- It does not change global behavior.
- It does not force builder domain concepts into GaGet.
- It can be replaced or adapted during extraction without redesigning the product.

Prefer adapters or narrow interfaces where host integration is needed. Do not duplicate infrastructure without reason, but do not optimize for reuse at the expense of portability.

## Host integration

GaGet integration is limited to:
- A navigation/entry point.
- Hosting the dedicated builder routes.
- Necessary framework-level integration.
- Explicitly selected generic infrastructure.

The builder owns its workspace behavior after entry. Existing GaGet routes, shell, visual identity and unrelated features remain unchanged.

## Routing boundary

Provide:
- A direct route to start or enter the builder.
- A dedicated workspace route.
- A GaGet navigation entry that leads to the same builder experience.

Pages within a project are represented as project state in M05; they do not require separate route-based editing.

Exact route strings should follow the repository's existing route conventions while preserving a distinct builder route namespace. Do not invent a nested application or a second Next.js configuration.

## Portability principles

- Keep domain models framework-agnostic where practical.
- Keep catalogue/sample data separate from presentation components.
- Keep sample renderers behind explicit contracts.
- Avoid relying on host-global CSS selectors or undocumented theme behavior.
- Keep application logic and UI composition separable.
- Keep synthetic fixtures and tests independent of real GaGet content.
- Document any unavoidable host integration seam.

## Non-goals

M05 does not include:
- Creating the standalone repository or codebase.
- Moving or duplicating the application into another repository.
- Building extraction/migration scripts.
- Introducing a package-publishing pipeline.
- Replacing GaGet's application architecture.
- Changing main/stage branches, deployment or unrelated product behavior.

## Acceptance checks

The module boundary is acceptable when the builder can be reasoned about and tested as a distinct product module, host integration is narrow and explicit, and no avoidable GaGet-specific dependency blocks later extraction.
