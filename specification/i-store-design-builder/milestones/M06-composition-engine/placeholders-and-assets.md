# Placeholders and User Assets

## Purpose

Define instance-level placeholder behavior during composition without introducing a full asset-management subsystem.

## Placeholder model

A sample declares zero or more content slots that may accept an image or file reference. Each placeholder is associated with a specific component instance and slot.

Placeholder metadata may include:
- Stable slot identifier.
- Purpose or expected use (for example, hero image, product image, author portrait, logo, or supporting illustration).
- Expected content/media type.
- Optional user-supplied asset reference.
- Optional descriptive text or status.

The sample's design and slot definition remain product-authored. Placeholder data does not alter the sample's internal visual structure.

## User interaction

Users can:
- Understand what each placeholder is intended to contain.
- Edit supported purpose/description metadata.
- Optionally provide their own image or file where the application foundation supports a reference.
- Replace or clear an optional reference.
- Leave a placeholder unfilled.

Unfilled placeholders remain valid unless a separately defined mission or field requirement makes a particular value mandatory. M06 does not introduce such mission rules.

## Instance independence

Placeholder metadata and references belong to the component instance. Duplicating an instance copies its placeholder values into independent instance data. Replacing a sample preserves a placeholder only when the target sample has a compatible slot; otherwise it is omitted from the replacement draft and the new slot receives its default empty state.

## Asset boundary

M06 defines only the composition-level reference contract. It does not implement:
- Asset storage or hosting infrastructure.
- Upload processing pipelines or media transformations.
- Stock-image browsing.
- Image generation.
- Advanced image editing, cropping, or focal-point tools.
- Durable asset lifecycle management.

The runtime remains temporary and browser-only. Any asset reference used by the MVP must fit the supported runtime and must not imply durable storage.

## Acceptance checks

- Placeholders are associated with instance and slot identity.
- Purpose and expected type are understandable.
- Empty placeholders are supported by default.
- Optional user assets are represented only through supported references.
- Replacement and duplication follow the instance lifecycle compatibility rules.
- No asset-management service or stock/generated imagery feature is implied.
