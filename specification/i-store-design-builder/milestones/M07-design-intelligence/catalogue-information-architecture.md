# Catalogue Information Architecture

## Purpose

Specify how users browse, discover, filter, and understand official component samples while retaining full control over selection.

## Entry and availability

- The component library is accessible throughout all journey levels and missions.
- Level guidance may link to relevant categories or explain relevance, but must not gate access.
- Users can open the library independently of the current mission.
- Browsing and previewing never modify the active page composition.
- No sample is inserted until the user follows M06's explicit selection, preview, confirmation, and position flow.

## Primary navigation

The primary browse hierarchy is:

1. Category
2. Component type
3. Available samples

Users may navigate between levels without losing their project composition or current page state. The UI should communicate the current category/type context and provide a clear route back to broader browsing.

## Secondary discovery

Support these optional discovery dimensions:

- Controlled visual-style filters.
- Website-purpose filters.
- Keyword search.
- Availability/sample-count metadata.

Filters should be combinable where useful, removable independently, and understandable in plain language. An empty result should explain which filters/search terms are active and allow the user to clear or revise them.

Do not imply that a purpose or style filter is a requirement. A sample remains selectable outside its suggested context.

## Category and type presentation

A category view should communicate its purpose and list its component types. A component-type view should communicate:

- What the component does.
- Common placement or usage context.
- Available sample count.
- Available style/purpose classifications where useful.
- A concise explanation of what to consider when choosing a design.

Availability metadata must be factual. Do not show misleading counts, empty placeholders as available samples, or quality/popularity rankings.

## Sample gallery

Present samples as visual gallery cards with:

- Representative preview image/render.
- Sample name.
- Short description.
- Component type.
- Optional visual-style and purpose labels.
- Clear inspect/preview action.

Gallery density may adapt to workspace space, consistent with M03. Metadata should remain concise and subordinate to the visual sample.

## Search behavior

Search should match component types, sample names, descriptions, documented synonyms, and keywords. Search results must retain their category/type context. Search does not choose or recommend a sample.

No AI semantic recommendation or personalized ranking is part of this milestone. Any ordering should be predictable and documented, such as category order or stable catalogue order.

## Empty, unavailable, and error states

- Empty category: explain that no samples are currently published and preserve the category's place in the taxonomy.
- No filter/search matches: identify active filters or query and offer a clear way to revise them.
- Unavailable/retired sample: do not offer it for new insertion; existing project instances remain valid under lifecycle rules.
- Preview failure: preserve browsing context and provide a recoverable explanation; do not mutate the project.
- Loading state: distinguish loading from an empty catalogue.

## Selection boundary

Catalogue browsing, filtering, opening previews, and comparison are non-mutating. The user explicitly selects a candidate and then follows M06's confirmation and insertion-position flow. Catalogue UI must not silently insert, replace, reorder, or configure a project instance.

## Acceptance criteria

- [ ] Library access is available throughout the journey.
- [ ] Users can browse category → component type → sample.
- [ ] Visual-style and purpose filters are optional and combinable.
- [ ] Keyword search covers documented catalogue metadata.
- [ ] Category/type views communicate purpose and availability.
- [ ] Sample cards provide visual previews and concise metadata.
- [ ] Empty, no-match, unavailable, loading, and preview-error states are defined.
- [ ] Browsing and previewing do not mutate composition.
- [ ] No automatic selection, recommendation, ranking, or insertion is introduced.
