# M12 — Data Contracts

## Page

Conceptual fields:
- pageId (stable)
- pageKind (home or standard)
- title
- purpose/type (controlled extensible classification plus optional user text)
- route
- pageLocalSectionInstanceIds
- responsiveLayouts (desktop/tablet/mobile)
- sharedElementReferences
- pageStatus/progression references where applicable

Exactly one page per project has pageKind=home.

## Navigation item

- navigationItemId
- label
- order
- destinationKind: internalPage | externalUrl | contact | labelOnly
- destinationPageId (for internal)
- destinationValue (for supported external/contact)
- responsive presentation via sample capability contract
- optional applicability/visibility

Internal references use page IDs, never route strings as the sole identity.

## Shared site element

- sharedElementId
- role: header | navigation | footer | other approved shared role
- selected sample ID/version where applicable
- sample-defined content/configuration
- M09 compatibility mapping
- usage references from pages

## Page starter

Authored catalogue definition with stable ID/version, purpose description, initial section sample references, and compatibility metadata. Applying a starter creates project-owned page/section instances; it never mutates the catalogue.

## Deletion integrity

A page deletion command requires an explicit resolution plan for every internal reference. The plan must remove or retarget each reference. No dangling reference is silently retained.

## Invariants

- Exactly one homepage per project.
- Page IDs and component instance IDs are unique.
- Page duplication creates new identities.
- Shared elements are not duplicated during page copy.
- Internal links resolve to an existing page.
- Routes are unique after normalization.
- Page-specific sections and responsive layouts remain page-owned.
