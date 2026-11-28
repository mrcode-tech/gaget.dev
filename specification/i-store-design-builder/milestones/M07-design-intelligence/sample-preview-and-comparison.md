# Sample Preview and Comparison

## Purpose

Define how users inspect and compare candidate samples before making their own selection.

## Preview principles

- A preview is informative and non-mutating.
- Preview content is synthetic and representative, not a claim about final production content.
- Preview should reveal the sample's composition, content hierarchy, and responsive behavior.
- The preview must not imply that a sample is automatically preferred.
- Sample preview and project insertion are separate actions.

## Gallery card

Each card should show:
- A representative visual preview.
- Sample name and concise description.
- Component type context.
- Optional visual-style and website-purpose labels.
- A clear action to inspect the sample.

Avoid overloading cards with technical metadata. The visual design is the primary discovery signal.

## Enlarged sample preview

The inspection experience should provide:
- An enlarged isolated rendering.
- Sample name, description, and component type.
- Design rationale and intended use.
- Representative synthetic content.
- Supported content slots and finite options.
- Placeholder purposes and optional asset behavior.
- Desktop, tablet, and mobile presentations.
- Known constraints or important selection considerations.

Where helpful, also show a contextual page preview demonstrating how the component relates to surrounding page content. Contextual preview is illustrative and must not mutate the user's page.

## Responsive preview

Users should be able to inspect intentional desktop, tablet, and mobile sample presentations. The preview should make responsive differences understandable, including changes to hierarchy, alignment, density, navigation, image behavior, and action placement.

This preview requirement does not change M06's three-canvas composition model or allow independent responsive component membership.

## Comparison

Users may compare multiple candidates for the same component type. Comparison should focus on useful distinctions:

- Layout and composition.
- Visual hierarchy.
- Content presentation.
- Responsive behavior.
- Supported fields and finite options.
- Intended use and design rationale.

Comparison is descriptive. Do not introduce numerical quality scores, popularity rankings, automated winner selection, or personalized recommendations.

## Synthetic preview content

Use realistic but fictional names, text, product/service entries, logos/brand marks, and image placeholders. Do not embed real customer data or imply that synthetic examples are actual businesses. Missing optional fields should be represented gracefully.

## Non-mutation and transition to insertion

Opening, changing, or comparing previews does not alter project state. If the user chooses a sample, continue through the M06 flow: explicit confirmation, insertion-position selection, then creation of an independent instance. Cancellation leaves the page unchanged.

## Acceptance criteria

- [ ] Gallery cards prioritize clear visual previews.
- [ ] Enlarged preview explains design purpose and supported capabilities.
- [ ] Isolated and contextual previews are distinguished.
- [ ] Desktop, tablet, and mobile presentations can be inspected.
- [ ] Candidate comparison exposes meaningful differences.
- [ ] Preview content is synthetic and representative.
- [ ] Preview and comparison never mutate composition.
- [ ] Selection proceeds through M06 confirmation and insertion behavior.
