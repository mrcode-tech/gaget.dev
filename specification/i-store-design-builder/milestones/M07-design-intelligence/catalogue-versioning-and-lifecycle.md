# Catalogue Versioning and Lifecycle

## Purpose

Define how official sample definitions evolve without silently changing existing user work. M04's conceptual version compatibility model and M06's instance-preserving replacement rules remain authoritative.

## Identity and version

Each sample has:
- A stable sample ID representing its continuing identity.
- A version identifying the exact definition used by an instance.
- A component type ID.
- A lifecycle status.
- Compatibility notes for content/configuration changes.

A version is immutable once published. A meaningful definition change creates a new version rather than rewriting the definition referenced by existing instances.

## Existing instance behavior

An inserted instance retains its referenced sample ID and version. Catalogue updates must not silently change its appearance, content schema, configuration, or responsive behavior.

Existing instances continue to resolve their referenced version even if the sample is deprecated or retired for new insertion.

## New insertion behavior

New insertions use the currently published version available for selection. The catalogue should not offer draft, deprecated-for-new-work, or retired samples for ordinary new insertion unless an explicit product policy later permits a documented exception.

## Replacement behavior

M06 governs replacement:
- Replacement is limited to another sample of the same component type.
- The user previews and confirms the replacement.
- Compatible content is preserved.
- Incompatible or newly introduced fields receive documented defaults.
- Instance identity is preserved.
- Replacement is atomic; cancellation or validation failure leaves the original unchanged.

Version updates do not automatically trigger replacement. A user-initiated sample replacement is a distinct composition operation.

## Deprecation and retirement

- Deprecation communicates that a sample is no longer preferred for new work while preserving existing references.
- Retirement removes the sample from ordinary new selection but does not invalidate existing instances.
- A retired version remains resolvable for as long as project instances may reference it.
- Removal of version data must not occur while valid instances depend on it.

## Compatibility and migration

Compatibility metadata should identify relevant content and configuration changes. Automated migration tooling is not part of the MVP. Any future migration must be explicit, reviewable, compatibility-aware, and must preserve user content where possible.

No automatic background migration or silent content deletion is permitted.

## MVP boundary

The MVP uses a static, product-authored catalogue and in-memory project state as defined by M04/M05. This document specifies conceptual identity, version references, and lifecycle behavior; it does not add persistence, backend catalogue services, migration tooling, or asset infrastructure.

## Acceptance criteria

- [ ] Sample identity is stable and versions are distinguishable.
- [ ] Published versions are immutable.
- [ ] Instances retain their referenced sample version.
- [ ] New insertions use the currently published version.
- [ ] Deprecated/retired samples remain resolvable for existing instances.
- [ ] Replacement follows M06 same-type, preview, confirmation, compatibility, and atomicity rules.
- [ ] No silent migration or content loss is introduced.
