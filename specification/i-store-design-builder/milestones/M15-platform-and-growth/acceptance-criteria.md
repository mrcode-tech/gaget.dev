# M15 — Acceptance Criteria

## Stage A — Standalone readiness
- [ ] Builder builds/runs independently of GaGet.
- [ ] No accidental GaGet shell/global styling/business dependency remains.
- [ ] Reproducible build, environment, release, monitoring, and rollback procedures exist.
- [ ] Security, privacy, accessibility, and performance reviews pass.
- [ ] Support and incident runbooks are available.

## Stage B — Accounts and persistence
- [ ] Authentication and recovery flows are secure and tested.
- [ ] Project authorization is enforced server-side.
- [ ] Save status and failures are truthful and recoverable.
- [ ] Users can export and delete their data.
- [ ] Account deletion follows documented retention policy.

## Stage C — Lifecycle
- [ ] Version history is immutable and inspectable.
- [ ] Restore creates a new version and preserves prior state.
- [ ] Asset upload, validation, access, quota, deletion, and orphan cleanup are tested.

## Stage D — Sharing/collaboration
- [ ] Read-only access can be created, expired, and revoked.
- [ ] Editing rights are impossible without explicit authorization.
- [ ] Collaboration conflict and audit semantics are tested before multi-editor release.

## Stage E — Growth
- [ ] Starter projects are user-selected and non-automatic.
- [ ] Analytics are allowlisted, privacy-reviewed, and content-minimizing.
- [ ] Feature flags support staged rollout and rollback.
- [ ] Support/admin access is least-privilege and auditable.

## Stage F — Monetization
- [ ] Separate product/business/legal approval exists before billing implementation.
- [ ] Billing lifecycle, cancellation, refund, and support behavior are specified and tested.

## Global gates
- [ ] Threat model and privacy/data lifecycle review completed.
- [ ] Backup and restore drills pass.
- [ ] Operational monitoring and incident response are proven.
- [ ] No stage is silently included in MVP C.
