# M15 — Testing Strategy

## Extraction
Test standalone build, routes, module boundaries, styling isolation, environment configuration, and regression against approved M00–M14 behavior.

## Security
Threat modeling, authentication/authorization tests, IDOR checks, session security, CSRF where applicable, input validation, upload security, secrets handling, dependency scanning, and penetration testing appropriate to release risk.

## Persistence/recovery
Test save failures, retries, concurrent updates, schema migrations, backup restore, version restore, account/project deletion, and retention behavior.

## Sharing/collaboration
Test token entropy/handling, expiry, revocation, permission boundaries, unauthorized access, conflict resolution, and audit integrity.

## Privacy/analytics
Verify allowlisted event schemas, no project content/media leakage, retention, consent controls, access restrictions, and deletion propagation.

## Operations
Load/performance tests, monitoring alerts, deployment rollback, incident drills, backup/restore drills, and runbook exercises.

## Growth/billing
Test feature-flag rollback, experiment isolation, starter selection, entitlement boundaries, billing lifecycle, cancellation, refunds, and tax/legal integration where separately approved.

No M15 platform tests are claimed to have run as part of this specification.
