# M15 — Technical Design

## Standalone extraction

Preserve M05 module boundaries. Extract the builder as a standalone application with explicit configuration, independent design tokens, typed domain contracts, catalogue/renderer registry, and tests. Do not retain accidental GaGet runtime dependencies.

## Platform architecture

Later hosted architecture may include:
- Authentication/identity provider.
- Project API and durable database.
- Asset service/object storage.
- Version snapshot service.
- Authorization/policy layer.
- Observability and audit infrastructure.
- Feature-flag/experimentation service.

Technology selection is deferred until deployment, scale, security, cost, and operational constraints are evaluated.

## Data and ownership

Project ownership, access grants, account deletion, retention, and backup/restore semantics must be explicit. Enforce authorization server-side for every read/write. Never rely on client-supplied project IDs as authorization.

## Versioning

Persisted project schema versions require documented migrations, compatibility testing, rollback strategy, and immutable backup snapshots. Restore creates a new version record.

## Asset service

If introduced, assets require authenticated upload, MIME/content validation, malware/security controls appropriate to supported types, quotas, signed access where appropriate, retention, deletion, and orphan cleanup.

## Collaboration

Real-time multi-editor support requires concurrency strategy, conflict resolution, presence/privacy model, audit history, and recoverable transactions. Do not infer that sharing links imply editing rights.

## Security and operations

Threat modeling, least privilege, secrets management, secure headers, dependency scanning, logging redaction, backup encryption, restore drills, incident response, availability objectives, and rollback are release gates.

## Analytics

Collect only approved event metadata. Do not collect project text, asset bytes, private URLs, or personal data in product analytics by default. Define retention and access limits.

## Future AI

Any AI service would require a separate architecture and data-governance decision. It is not a dependency of M15 baseline.
