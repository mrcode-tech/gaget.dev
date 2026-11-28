# M15 — Objectives and Scope

## Goals

- Convert the validated isolated module into a maintainable standalone product.
- Introduce durable user accounts and projects only after MVP validation.
- Provide reliable save, recovery, version history, and asset lifecycle.
- Establish privacy, security, accessibility, reliability, and operational controls.
- Enable sharing and collaboration only with explicit permission design.
- Support measured product growth without compromising user agency or privacy.

## Non-goals

- Expanding MVP C with account/cloud dependencies.
- Unvalidated subscriptions, payments, marketplace, or advertising.
- AI design generation or automatic composition without a separate product decision.
- Real-time collaboration before permission, conflict, and audit semantics are designed.
- Collecting user website content or uploaded media for analytics/training by default.

## Staged release scope

### Stage A — Standalone readiness
Codebase extraction, dependency review, environment configuration, secure deployment architecture, automated release, error monitoring, privacy/security review, backup strategy for any future data, accessibility/performance baselines, and operational runbooks.

### Stage B — Accounts and durable projects
Authentication, account lifecycle, project dashboard, cloud project storage, explicit save-state feedback, recovery, user export, and account/project deletion.

### Stage C — Project lifecycle
Version history, restore, duplication, archive, asset storage/lifecycle, quotas, and retention.

### Stage D — Sharing/collaboration
Permissioned read-only sharing first; editing collaboration only after conflict resolution, audit, and ownership rules are approved.

### Stage E — Growth
Curated starter projects, opt-in feedback, privacy-minimizing product analytics, feature flags, controlled experiments, and support/admin tools.

### Stage F — Monetization
Subscription/payment only after product-market and willingness-to-pay validation, legal review, pricing decision, and separate approval.

## Release gates

Each stage requires a scoped decision, threat/privacy review, data lifecycle design, acceptance criteria, operational readiness, and rollback plan. A later stage is not automatically authorized by this specification.
