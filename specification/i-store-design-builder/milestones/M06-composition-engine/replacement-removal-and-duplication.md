# Replacement, Removal, and Duplication

## Purpose

Define safe lifecycle operations for existing component instances.

## Sample replacement

Replacement changes the selected sample of an existing instance to another sample of the same high-level component type.

### Workflow

1. Select an existing component instance.
2. Browse alternative samples for its component type.
3. Preview a candidate independently.
4. Compare the current instance content schema with the candidate schema.
5. Prepare a replacement draft without mutating the active instance.
6. Preserve compatible values; initialize incompatible or newly introduced fields from candidate defaults.
7. Show the resulting replacement preview and explain material content that will be reset where useful.
8. Ask the user to confirm.
9. Apply the replacement atomically.

Cancellation leaves the original instance unchanged.

### Compatibility rules

Compatibility is determined by stable field identity and compatible field type/constraints, not merely matching display labels. A value is retained only when it satisfies the candidate field's schema. Incompatible values are not coerced silently; the candidate default is used. Removed fields are omitted from the replacement content. New fields receive candidate defaults.

Replacement:
- Preserves the component instance identity and page ownership.
- Preserves its position and breakpoint-specific ordering.
- Preserves visibility and supported responsive presentation only where still valid for the new sample.
- Preserves compatible placeholder purpose/asset references only when the target slot is compatible.
- Updates the sample reference and version.
- Revalidates content, configuration, placeholders, and responsive presentation.

Invalid or unavailable candidates cannot be applied. The replacement command is atomic: no partial state is permitted.

## Removal

Removal is initiated from the desktop/shared component collection. Before removal, show a concise confirmation identifying the component. The user can cancel or confirm.

On confirmation:
- Remove the instance from shared page membership.
- Remove its reference from desktop, tablet, and mobile ordering.
- Remove its breakpoint visibility and presentation entries.
- Remove instance-owned content, configuration, and placeholder metadata from the active project state.

Removal is a shared structural operation. Hiding a component on one breakpoint is not removal.

No undo/redo or recovery guarantee is provided in this MVP. The confirmation must therefore be clear and deliberate.

## Duplication

Duplication creates a new independent instance based on the selected instance:
- Generate a new unique identity.
- Copy the sample reference and version.
- Copy valid content values and bounded configuration.
- Copy placeholder purpose and optional asset references as instance data.
- Insert adjacent to the original by default, with a clear position choice where the UI supports it.
- Add the new instance to shared membership and all three responsive orders.
- Preserve the relative ordering of all existing instances.

The original and duplicate are independent after creation. Editing either must not mutate the other or the catalogue definition.

## Acceptance checks

- Replacement is limited to the same component type.
- Compatible content is retained; incompatible fields use candidate defaults.
- Replacement preview and confirmation occur before mutation.
- Cancellation preserves the original instance exactly.
- Successful replacement preserves instance identity and valid responsive state.
- Removal requires confirmation and removes shared membership from all breakpoints.
- Hiding is not implemented as deletion.
- Duplication creates a new identity with independent values.
- Failed lifecycle commands leave state unchanged.
