# M15 — Platform Readiness and Growth

**Status: Prepared future-platform baseline — not part of MVP C.** This specification defines staged post-MVP capabilities and release gates. It does not authorize implementation now.

## Purpose

Prepare the Website Design Builder to evolve from a validated, session-based MVP into a reliable standalone product, introducing accounts, durable projects, recovery, sharing, and growth capabilities only when justified.

## Approved decisions

| ID | Decision |
|---|---|
| M15-01 | M15 is post-MVP; no M15 platform capability is required to ship MVP C. |
| M15-02 | Preserve module portability and extract the builder into a standalone codebase after first MVP implementation/validation. |
| M15-03 | Introduce authentication only when durable user-owned projects are approved for a later release. |
| M15-04 | Add cloud persistence with explicit save/recovery and data lifecycle guarantees in a staged release. |
| M15-05 | Add project dashboard, duplication, archive/delete, and version history after persistence. |
| M15-06 | Collaboration and sharing are separate later capabilities requiring permission and privacy design. |
| M15-07 | Starter projects/templates are curated and user-selected; no automatic design choices. |
| M15-08 | Product analytics are privacy-minimizing and never collect project content by default. |
| M15-09 | Feature flags, staged rollout, monitoring, support, backup, restore, and incident processes are required for hosted operation. |
| M15-10 | Monetization/subscriptions are conditional on validated business demand and separate approval. |
| M15-11 | AI assistance is not implied; any AI capability requires a separate explicit product decision. |
| M15-12 | Security, privacy, accessibility, performance, and portability remain release gates. |

## Staged platform evolution

- **Stage A — Standalone readiness:** isolate and extract the validated builder module; establish build/release, security, accessibility, observability, and operational foundations.
- **Stage B — Personal accounts and projects:** authentication, project dashboard, cloud persistence, recovery, and user-controlled deletion/export.
- **Stage C — Project lifecycle:** version history, restore, duplicate, archive, and asset lifecycle.
- **Stage D — Sharing and collaboration:** explicit sharing permissions and, only if validated, collaborative workflows.
- **Stage E — Growth:** curated starter projects, privacy-respecting analytics, experiments/feature flags, support tooling.
- **Stage F — Business model:** subscriptions/payments only after validation and separate approval.

Stages may be reprioritized, but dependencies and security gates remain mandatory.

## Explicit MVP C exclusions

No authentication, cloud storage, database, autosave, durable recovery, server-side asset library, collaboration, analytics instrumentation, subscriptions, payment processing, or AI capability is required for the first MVP.

## Documents

- [Objectives and scope](objectives-and-scope.md)
- [Feature specification](feature-specification.md)
- [User stories](user-stories.md)
- [Interaction specification](interaction-specification.md)
- [Technical design](technical-design.md)
- [Data contracts](data-contracts.md)
- [Acceptance criteria](acceptance-criteria.md)
- [Testing strategy](testing-strategy.md)
- [Implementation tasks](implementation-tasks.md)

## Dependencies

M05 portability; M04 domain contracts; M06 composition; M09 identity; M10–M14 validated end-to-end design/handoff experience.

## Completion criteria

- [x] Post-MVP stages and exclusions defined.
- [x] Standalone extraction and operational gates specified.
- [x] Account, persistence, recovery, collaboration, growth, and monetization boundaries documented.
- [x] Privacy/security and rollout requirements documented.
- [ ] Platform implementation — future work after explicit release authorization.
