# M10 — Interaction Specification

## Workspace context

The homepage canvas remains central. The section library is a contextual panel or workspace mode, not a separate application. The three responsive canvases remain visible according to M02/M06.

## Section browsing

- Present section families with plain-language labels and optional purpose descriptions.
- Show sample cards with thumbnail/preview, sample name, section role, and concise metadata.
- Provide empty-category and no-results states without inventing content.
- Keep filters optional and reversible.

## Sample inspection

Selecting a card opens a larger preview and supported-content summary. Comparison is non-mutating. Contextual preview may use synthetic page content but must not add the sample to the actual project.

## Insert flow

The insert action follows M06's select → preview → confirm → choose position → insert sequence. Provide clear insertion feedback and keyboard-accessible position selection. Drag-and-drop is optional convenience; an accessible move/placement alternative is required.

## Properties

After selection, show only fields declared by the sample. Group content by meaning, not implementation terms. Clearly distinguish:
- Shared content/configuration.
- Breakpoint-specific presentation controls.
- Sample defaults.
- Placeholder/missing content.

## Visitor action

Offer a user-editable field for the primary action label and supported destination/intent. Do not invent a destination. If a project does not need a primary action, allow it to be marked not applicable where the journey permits.

## Shared frame

Indicate whether the selected header/footer is shared site chrome or a homepage-local section. Avoid offering duplicate insertion of a shared element already present unless the product explicitly supports a second instance with a distinct purpose.

## Validation feedback

Show actionable findings near the relevant section and in the review surface. Explain why a field is required and provide a direct navigation path to edit it. No modal blocking for optional omissions.

## Destructive operations

Removal confirmation and sample replacement preserve M06 behavior. Duplicating creates a new instance identity. Reordering changes only the intended breakpoint order.
