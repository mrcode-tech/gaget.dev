# M09 — Data Contracts

## Contract principles

These are technology-neutral typed domain contracts that refine M04. They do not prescribe a serialization format, database schema, API, or implementation language.

Catalogue definitions, project identity values, and component instance data remain separate.

## Project website identity

A project has zero or one active website identity in the initial MVP.

Conceptual fields:

| Field | Meaning |
|---|---|
| id | Stable identity record identifier within the project |
| schemaVersion | Version of the identity contract |
| selectedDirectionId | Curated visual direction used as the starting reference |
| directionSelections | Explicitly selected direction aspects and their source references |
| paletteId | Selected curated palette reference, if any |
| colorRoles | Supported semantic role values |
| typographyPairingId | Selected curated typography pairing reference |
| typographySettings | Supported font-role and type-scale selections |
| imageDirectionId | Selected image-direction reference, if any |
| imageDirectionSettings | Supported image mood/composition/treatment selections |
| sharedStyleSelections | Supported button/form style preset references and finite options |
| spacingPresetId | Selected curated spacing/layout preset reference |
| confirmationState | Draft or active within the transient identity workflow |
| compatibilitySummary | Derived compatibility/review information; not authoritative project content |

The initial project model stores one active identity. A draft may exist transiently in workspace state while the user previews changes. Multiple saved alternatives and historical identity versions are out of scope.

## Semantic color roles

The initial semantic role vocabulary includes:
- primary
- secondary
- accent
- background
- surface
- text
- mutedText
- border
- feedback.success
- feedback.warning
- feedback.error
- feedback.information

Each color value must be represented in a validated, implementation-supported color format. The exact encoding is an implementation decision. The role identifiers remain stable semantic keys.

A palette definition includes stable ID/version, name, description, role values, preview metadata, and authored notes about known contrast behavior. User adjustments are project values, not mutations to the shared catalogue definition.

## Typography contract

A typography pairing definition includes stable ID/version, human-readable name/description, font-role mappings, available weights, fallback behavior, predefined scale/hierarchy choices, preview content, and licensing/availability metadata where required.

Project selections reference a pairing and store only supported adjustments. Arbitrary per-element values are not part of the contract.

## Image direction contract

An image direction definition describes medium/style, mood, composition guidance, subject treatment, and supported presentation hints. It does not contain generated image data or imply that an asset is supplied.

Actual user asset references continue to use the M04/M06 placeholder/asset-reference model.

## Shared style and spacing contracts

A shared style preset has a stable ID/version, supported semantic role, finite variants/options, defaults, and preview metadata.

A spacing/layout preset has a stable ID/version, semantic spacing tokens/relationships, supported layout conventions, and preview metadata. It must not encode arbitrary pixel geometry or freeform positioning.

## Component sample identity compatibility

Each M07 sample version may declare a compatibility contract:

| Contract field | Meaning |
|---|---|
| sampleId/version | Exact sample definition this contract belongs to |
| supportedSlots | Semantic identity roles consumed by the sample |
| mappings | Deterministic mapping from identity role to sample presentation role |
| supportLevel | Required, optional, or unsupported for each role |
| boundedOverrides | Sample-authored finite alternatives that remain valid |
| responsiveNotes | Responsive behavior of mapped roles |
| compatibilityNotes | Limitations and migration/review considerations |

The compatibility contract belongs to the catalogue sample definition/version, not to the project identity or component instance.

## Instance invariants

Applying identity must preserve:
- Component instance IDs.
- Sample IDs and versions.
- Instance content and configuration values.
- Placeholder values and asset references.
- Page membership and composition.
- Desktop/tablet/mobile ordering and visibility.
- Existing responsive overrides.

Identity tokens are shared project data; they are not copied into every component instance as independently editable values.

## Validation rules

- All referenced catalogue IDs and versions must resolve.
- Color role keys must belong to the supported vocabulary.
- Values must use supported types and finite options.
- Sample mappings must reference declared roles and valid sample presentation slots.
- Missing optional roles remain unsupported/defaulted according to the sample contract; do not infer a mapping.
- A failed identity application must leave the active identity and composition unchanged.
- Contrast findings are review metadata and do not make a structurally valid identity record invalid.

## Runtime

The model exists only in the M04/M05 in-memory browser session. No persistent API, database, browser storage, or import/export contract is introduced.
