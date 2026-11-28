# Insertion and Ordering

## Purpose

Specify explicit sample insertion and high-level component ordering within the active page.

## Sample-to-instance workflow

1. Browse the catalogue by high-level component type and available filters.
2. Select a sample.
3. Open its independent enlarged preview and, where useful, a contextual page preview.
4. Review the sample's supported content fields and finite options.
5. Confirm the selected sample.
6. Choose an insertion position in the active page.
7. Commit insertion and render the new instance in all three responsive canvases.

Selecting or previewing a sample never changes project composition. Insertion occurs only after explicit confirmation and position selection.

## Insertion positions

After sample confirmation, show positions relative to the active page's existing components:
- Before a selected component.
- After a selected component.
- Append at the bottom of the page.

The interface must make the target position clear before committing. If the page is empty, the only available position is the beginning/end of the empty composition.

Insertion creates a new instance identity, initializes content and configuration from the sample defaults, initializes placeholder metadata, adds the instance to shared page membership, and inserts its reference into all three breakpoint orders at the corresponding structural position.

The engine must not automatically select, recommend, rank, or arrange samples on the user's behalf.

## Ordering

Users can reorder high-level instances using:
- Drag and drop with a clear insertion indicator.
- Keyboard-accessible move controls, including move up and move down.
- An equivalent accessible interaction that does not require dragging.

Ordering is breakpoint-specific. Reordering desktop changes desktop order only. Tablet and mobile maintain their own independent order. A move must not change identity, sample, content, configuration, visibility, or placeholder data.

A reorder command validates that the target instance belongs to the page and that the resulting order contains every shared instance exactly once.

## Responsive collection rules

Desktop is the structural membership surface:
- Insert, remove, replace, and duplicate operations update the shared component collection.
- The resulting instance is represented in all three breakpoint layouts.

Tablet and mobile:
- Cannot independently insert, remove, replace, or duplicate shared instances.
- Can reorder existing instances.
- Can independently change visibility and supported responsive presentation.

When a shared instance is inserted or duplicated, add its reference to tablet and mobile orders using a deterministic default placement (the same relative position selected for the shared insertion), without overwriting the pre-existing relative order of other instances.

When an instance is removed, remove its references from all three orders and its visibility/presentation entries. This is a shared membership operation, not a breakpoint-only hide.

## Feedback and failure

Successful operations update the three canvases immediately. Invalid positions, stale references, duplicate order entries, or invalid membership changes return a controlled failure and leave the prior state unchanged.

## Acceptance checks

- Preview and selection do not mutate composition.
- Confirmed insertion creates one unique independent instance.
- Position is selected after sample confirmation.
- Inserted instances appear in all three canvases.
- Drag/drop and accessible move controls produce equivalent ordering results.
- Each breakpoint's order is independent.
- Shared membership operations preserve valid layout references.
