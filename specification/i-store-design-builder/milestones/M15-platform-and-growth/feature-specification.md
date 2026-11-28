# M15 — Feature Specification

## Stage A: standalone readiness

- Extract the isolated builder from the temporary GaGet host into its own repository/codebase after MVP implementation and validation.
- Preserve approved route, module, design-system, data, and test boundaries.
- Remove accidental dependencies on GaGet shell/global styles/business logic.
- Establish reproducible build, environment configuration, dependency/security scanning, release automation, error reporting, monitoring, and rollback.
- Document support, incident, backup, restore, and data-retention procedures before any user data is hosted.

## Stage B: accounts and durable projects

- Account registration, sign-in/out, verification, recovery, and account deletion.
- Project dashboard with create/open/rename/duplicate/archive/delete.
- Durable project persistence with explicit save status and recoverable failures.
- User-controlled export and deletion.
- Ownership and authorization checks for every project operation.

## Stage C: project lifecycle

- Version history with timestamp, author, summary, and immutable snapshot identity.
- Preview and restore with explicit confirmation.
- Restore creates a new version; it does not erase intervening work.
- Asset upload/storage, deduplication, quotas, validation, deletion, and retention.
- Project archive and recovery policies.

## Stage D: sharing and collaboration

- Permissioned read-only share links with revocation and optional expiry.
- Later collaborative editing requires roles, ownership, conflict resolution, audit events, and clear presence/state behavior.
- No public indexing of private projects by default.

## Stage E: growth and operations

- Curated starter projects and sample collections, always explicitly selected by users.
- Optional feedback and privacy-minimizing analytics.
- Feature flags and staged experiments with rollback.
- Support/admin tools with least privilege and auditable access.

## Stage F: monetization

Only after separate approval: plan entitlements, billing, invoices, cancellation, refunds/support, tax/legal requirements, and subscription lifecycle.

## AI boundary

No AI capability is included by implication. Any future AI-assisted explanation, content generation, recommendation, or design action requires a separate product decision specifying consent, data handling, user control, review, and failure behavior.
