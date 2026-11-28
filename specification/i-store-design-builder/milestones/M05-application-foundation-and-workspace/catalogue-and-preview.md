# Component Catalogue and Sample Preview

## Purpose

Define the initial functional catalogue and preview experience. M05 provides sample discovery and preview, not full website composition.

## Catalogue source

Use a static, data-driven catalogue of typed sample definitions. Keep sample data separate from catalogue UI and renderer implementations.

The initial data is synthetic and generic. It must not depend on real customer content or actual business identities.

Each sample definition should provide the information required by the agreed M04 sample model and M03 portfolio guidelines, such as:
- Stable sample identifier and version.
- High-level component type.
- Sample name and concise description.
- Optional visual-style/category metadata.
- Optional website-purpose tags or filter metadata.
- Thumbnail/preview reference when available.
- Supported content-slot schema and bounded options.
- Renderer registration key.

Only include fields needed for the initial catalogue contract. Do not create a second incompatible schema in the UI.

## Browsing experience

The catalogue framework supports:
- Browsing by high-level component category.
- Viewing synthetic sample cards.
- Selecting a sample for preview.
- Showing useful sample identity and metadata.
- Empty catalogue and no-results states.

The catalogue should be curated and manageable. It can grow progressively according to M03 portfolio priorities; M05 does not require a complete portfolio or all component types to be populated.

## Preview behavior

A selected sample opens an independent, enlarged preview experience. Where useful, the preview may also be shown in a contextual page preview using synthetic placeholder content.

Preview must:
- Render the selected sample through its registered renderer.
- Use safe synthetic/default content for missing fields.
- Respect the sample's supported presentation contract.
- Clearly identify that the user is previewing a sample.
- Leave project composition unchanged.

Previewing is exploration, not insertion. No sample is automatically added to a page.

## Explicit separation from insertion

M05 does not implement insertion into the project, placement, ordering or replacement. A future milestone will define the explicit user-confirmed insertion flow in accordance with M01/M02.

Do not use the project canvas as a temporary destructive preview surface. Do not mutate or replace the current project page when the user browses or previews a catalogue item.

## Portfolio design alignment

Preserve M03's two-system distinction:
- Builder interface controls and catalogue navigation belong to System A.
- Each website sample's own visual presentation belongs to System B.

Samples may be visually diverse while following shared technical rendering and content-slot conventions. Avoid making every sample look like the same generic card layout.

## Acceptance checks

- Catalogue definitions load from separate static typed data.
- Synthetic sample cards can be browsed and selected.
- A sample can be opened in an enlarged preview.
- Preview uses the appropriate registered renderer.
- Preview does not change project composition or canvas contents.
- Empty and no-results states are understandable.
- Catalogue architecture permits adding samples without rewriting the catalogue shell.
