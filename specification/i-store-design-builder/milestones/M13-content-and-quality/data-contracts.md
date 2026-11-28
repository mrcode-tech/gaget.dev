# M13 — Data Contracts

## Content field value

Conceptual fields:
- fieldId (sample schema key)
- value (typed according to sample schema)
- contentStatus: final | draft | placeholder | missing
- placeholderPurpose (optional)
- updatedInSession (derived/runtime metadata only where useful)

## Image slot value

- slotId
- purpose
- assetId (optional session reference)
- altText
- imageMeaning: informative | decorative | notYetClassified
- presentationPreset (only if supported by sample)
- contentStatus

## Session asset registry entry

- assetId (stable within session)
- originalFileName
- mediaType
- byteSize
- width/height (when decoded)
- fileObjectReference (runtime-only, not serialized into project JSON)
- selectedAtSessionTime (optional diagnostic metadata)

The project document stores asset metadata/reference, never a raw File/Blob object.

## Quality finding

- findingId
- ruleId
- severity: blocking | warning | info
- pageId
- optional componentInstanceId/fieldId/assetId
- explanation
- correctionTarget
- relatedMilestone
- optional evidence values (for example contrast ratio or invalid route)

## Readiness summary

Derived counts by severity and category, missing/draft/placeholder content counts, unresolved asset reference count, and generated-at-session timestamp. It is not a subjective score and is not authoritative project data.

## Invariants

- Field values conform to their sample schema.
- Status is explicit; non-empty does not mean final.
- Asset IDs resolve only within the current session registry.
- An informative image marked ready has meaningful alt text.
- Decorative images use appropriate empty alternative text.
- Unsupported image presets are rejected.
- Missing session assets are surfaced; never silently substituted.
- Findings do not mutate project state.
