# Component Sample Specification

## Purpose

Define the product-level contract for an official, reusable catalogue sample. This document complements M04's conceptual sample/instance model and M05's typed static catalogue and renderer registry; it does not replace their runtime contracts.

## Core distinction

- A **component type** describes a reusable functional role.
- A **catalogue sample** is a product-authored design definition for one component type.
- A **component instance** is a project-owned use of a sample, referencing a specific version and holding independent values.

A catalogue sample must never store project-specific user content. Multiple instances of the same sample must remain independent.

## Required sample definition

Each published sample should define:

| Field | Purpose |
|---|---|
| Stable sample ID | Permanent identity across catalogue revisions |
| Version | Identifies the exact definition used |
| Component type ID | Connects sample to one taxonomy type |
| Name and description | Helps users understand the design |
| Primary visual style | Controlled style classification |
| Secondary style descriptors | Optional controlled descriptors |
| Website-purpose labels | Optional contexts where it may be useful |
| Keywords | Search terms and synonyms |
| Design rationale | Explains hierarchy, composition, and intended use |
| Content schema | Supported typed content slots and constraints |
| Finite options | Supported sample-specific configuration choices |
| Placeholder definitions | Purpose and expected content for asset slots |
| Responsive contract | Desktop/tablet/mobile presentation behavior |
| Renderer reference | Stable renderer key/contract for M05 architecture |
| Preview metadata | Isolated and contextual preview requirements |
| Lifecycle status | Draft, review, published, deprecated, or retired |
| Compatibility notes | Version and content compatibility information |

The implementation may use an appropriately typed representation. M07 does not prescribe a specific serialization layout beyond compatibility with M04/M05/M06.

## Content-slot conventions

Content fields are declared by the sample and use the shared typed conventions from M04. A field definition should communicate:

- Stable field ID and user-facing label.
- Value type.
- Default value.
- Required/optional status.
- Constraints and allowed values.
- Repeatable/list behavior where applicable.
- Placeholder purpose where the field references an image or file.
- Compatibility behavior when the sample is replaced.

Samples of the same component type should use consistent concepts and naming for equivalent content slots where practical. Their visual presentation can differ substantially.

Example hero content contract (illustrative only):
- Heading.
- Description.
- Primary action label and link.
- Optional secondary action label and link.
- Optional image/illustration placeholder with documented purpose.

The sample determines how those values are arranged and presented.

## Finite configuration

Expose only finite, documented options authored for the sample, such as a supported alignment, variant, item count, or display choice. Options must be understandable to non-designers and have valid defaults.

Do not expose arbitrary CSS, numeric geometry, unrestricted typography/color/spacing controls, nested-element manipulation, or freeform layout editing.

## Responsive contract

Each sample defines intentional desktop, tablet, and mobile presentations and identifies which presentation choices are fixed by the sample and which bounded options are user-configurable. Any responsive override must be explicitly supported and must remain consistent with M06 shared content/configuration and breakpoint-specific layout rules.

## Preview contract

Provide representative synthetic content, isolated sample preview, and contextual page preview where useful. Missing optional content must render gracefully using purpose-aware placeholders or documented fallback behavior.

## Sample authoring quality

Official samples are authored by the product/design team and reviewed against M03 and M07 quality criteria before publication. Sample definitions should be deterministic, accessible, responsive, and independent of user-specific content.

## Acceptance criteria

- [ ] Every sample has stable identity, version, and one component type.
- [ ] Metadata supports browsing, filtering, search, and explanation.
- [ ] Content slots are typed, documented, and bounded.
- [ ] Configuration consists only of finite sample-defined options.
- [ ] Placeholder purpose is explicit.
- [ ] Desktop/tablet/mobile behavior is defined.
- [ ] Preview requirements and renderer reference are specified.
- [ ] Lifecycle and compatibility information is available.
- [ ] Catalogue definitions remain separate from project instances.
