# M09 — Technical Design

## Architectural placement

M09 extends the isolated Website Design Builder module. It does not create a nested application, alter the GaGet shell, or introduce a second source of truth.

The website identity is project-level data within the M04 conceptual project model. It is distinct from:
- M03 System A Builder Interface tokens.
- M07 catalogue sample definitions and versions.
- M06 project-owned component instances and composition.
- M08 progression state.

## Logical responsibilities

1. **Identity catalogue:** authored visual directions, palettes, typography pairings, image-direction choices, shared style presets, and spacing/layout presets.
2. **Identity draft state:** transient user selections and supported adjustments before confirmation.
3. **Identity domain model:** typed active identity and token values associated with the project.
4. **Compatibility resolver:** matches identity token roles to sample-declared slots and supported mappings.
5. **Preview composition:** renders draft identity against representative samples and the existing three canvases without mutating project composition.
6. **Consistency evaluator:** evaluates documented color, typography, contrast, shared-style, and responsive checks.
7. **Application command:** validates and atomically applies the confirmed identity while preserving composition invariants.
8. **Guidance presentation:** explains choices and findings without making decisions for the user.

## Separation of definitions and project values

Authored identity options are catalogue definitions. The project's identity stores selected references and supported project-level values. A component sample declares its compatibility; it does not own or duplicate the project identity.

An inserted component instance continues to reference its sample ID/version and independent content/configuration. The renderer receives the active identity through an explicit context/contract and applies only supported mappings.

## Sample compatibility contract

A sample definition should declare:
- Supported semantic identity slots.
- Mapping from each supported slot to its presentation role.
- Whether a slot is required, optional, or intentionally unsupported.
- Any bounded sample-specific override that remains authoritative.
- Responsive behavior of the mapped role where relevant.
- Compatibility notes for identity revisions.

The contract must be deterministic and versioned with the sample definition. Missing compatibility must mean no implicit mutation, not a guessed mapping.

## Application behavior

The identity application operation:
1. Validates the draft identity shape and referenced authored options.
2. Resolves compatibility against relevant sample definitions/versions.
3. Produces a complete application plan.
4. Applies the active project identity atomically.
5. Makes resolved tokens available to compatible rendering paths.
6. Preserves all component instances, content, sample versions, placeholders, membership, and responsive layouts.
7. Emits review findings for unsupported or potentially affected presentation.

The operation must not invoke composition commands such as insert, replace, remove, duplicate, or reorder.

## Runtime boundary

M04/M05 remain authoritative:
- Browser-only session runtime.
- Typed in-memory project data.
- No backend/database.
- No browser-storage requirement.
- No authentication.
- No autosave, persistence, history, recovery, undo/redo, import/export, collaboration, or cloud asset management.

A refresh or browser close may discard project and identity work. UI language must not imply durable saving.

## Validation and failure behavior

Draft validation and application must be atomic. Invalid identity references, unsupported values, malformed token roles, or incompatible required contracts prevent application and leave the active identity unchanged.

Contrast failures are quality findings, not malformed data. They are shown to the user and do not silently rewrite values.

## Performance and determinism

Preview and compatibility resolution should be deterministic for the same project, identity draft, sample versions, and viewport. Identity changes should update only relevant preview/rendering inputs; they must not recreate component identities or reset unrelated workspace state.

## Security and content

User-supplied asset references remain optional and are treated as data. M09 does not fetch arbitrary remote assets, add a stock provider, or introduce new server-side data flows. Synthetic data is used for tests and examples.

## Future evolution

Persistent identity history, multiple named identities, exportable token packages, custom font upload, external asset services, and published-site theme switching require separate approved scope and architecture decisions.
