# M15 — Data Contracts

These are conceptual future contracts, not MVP C implementation requirements.

## Account
Stable account ID, verified contact method(s), authentication-provider reference, account status, preferences, created/updated metadata, deletion state. Credentials are never stored in project records.

## Project ownership
Project ID, owner account ID, access policy, lifecycle state, schema version, created/updated metadata, retention state. Every access is authorized server-side.

## Save/version record
Version ID, project ID, schema version, snapshot reference, author, created timestamp, summary, integrity checksum, and restore ancestry.

## Share grant
Grant ID, project ID, permission (initially read-only), token hash/reference, expiry, revocation state, optional access constraints, audit metadata. Do not store raw share secrets in logs.

## Asset record
Asset ID, project ID, owner, storage key, media type, size, dimensions, checksum, validation status, retention/deletion state, and references. Access is authorized; storage keys are not public identifiers.

## Audit event
Event ID, actor, action, target, timestamp, result, and minimal contextual metadata. Exclude content payloads unless separately justified and consented.

## Analytics event
Allowlisted event name and minimal properties such as feature area, success/failure category, and coarse client version. Exclude project content, media, private URLs, and sensitive personal data by default.

## Invariants
- Every project read/write is authorized server-side.
- Account deletion and project retention follow published policy and applicable law.
- Restore never destroys the current version.
- Revoked/expired share grants stop granting access.
- Asset deletion handles references and retention explicitly.
- Analytics cannot be used to reconstruct user project content.
