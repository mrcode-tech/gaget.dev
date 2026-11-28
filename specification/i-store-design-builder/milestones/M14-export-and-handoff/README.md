# M14 — Export and Implementation Handoff

**Status: Prepared baseline — ready for consolidated user review.** Specification only; no export implementation or verification is claimed.

## Purpose
Turn the user's in-memory website design into a portable, understandable package that communicates complete and incomplete work to a developer or the user.

## Approved decisions
| ID | Decision |
|---|---|
| M14-01 | Explicit user-triggered JSON and Markdown exports. |
| M14-02 | Exports available at any time, including incomplete projects. |
| M14-03 | Every export clearly identifies Complete or Incomplete state using M01 rules. |
| M14-04 | JSON is the canonical machine-readable project blueprint. |
| M14-05 | Markdown is a readable project/design handoff summary. |
| M14-06 | Optional ZIP package contains JSON, Markdown, manifest, and explicitly selected available media. |
| M14-07 | Standalone JSON/Markdown include asset metadata and disclose that binary media is not embedded. |
| M14-08 | Export includes page structure, navigation, identity, samples/versions, content states, responsive behavior, placeholders, and findings. |
| M14-09 | Export is deterministic for identical project data and options, excluding documented volatile metadata. |
| M14-10 | Export is generated locally; no server upload. |
| M14-11 | No import/restore/round-trip project editing in the first MVP. |
| M14-12 | No production code generation, Figma sync, hosting, publishing, or deployment. |
| M14-13 | Export never changes project state or marks missions complete. |
| M14-14 | M15 owns future account/cloud persistence; it is not part of MVP C. |

## Export formats
1. JSON blueprint: versioned, typed, machine-readable project representation.
2. Markdown handoff: readable purpose, pages, sections, identity, responsive decisions, content/media status, findings, and next steps.
3. Optional ZIP package: JSON + Markdown + manifest + user-selected session media.

If media is not included, exports list references and explicitly mark media as external/not embedded. ZIP export must never silently omit unavailable files.

## MVP runtime decision
M14 is the approved exception to M04's original no-export deferral. Projects remain in-memory only. Export is an explicit download initiated by the user. It does not add persistent project storage, autosave, authentication, or import.

## Documents
- [Objectives and scope](objectives-and-scope.md)
- [Feature specification](feature-specification.md)
- [User stories](user-stories.md)
- [Interaction specification](interaction-specification.md)
- [Technical design](technical-design.md)
- [Data contracts](data-contracts.md)
- [Acceptance criteria](acceptance-criteria.md)
- [Testing strategy](testing-strategy.md)
- [Implementation tasks](implementation-tasks.md)

## Dependencies
M04 project model; M06 composition; M09 identity; M10 homepage; M11 responsive state; M12 pages/navigation; M13 content/media/quality.

## Completion criteria
- [x] JSON, Markdown, and optional ZIP output contracts defined.
- [x] Complete/incomplete export semantics defined.
- [x] Media manifest and session-only asset behavior defined.
- [x] Determinism, privacy, error handling, and exclusions documented.
- [ ] Implementation and verification — future work.
