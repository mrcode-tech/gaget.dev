# Responsive Composition

## Purpose

Define how one shared page composition is presented and adapted across desktop, tablet, and mobile.

## Three-canvas model

The workspace retains three simultaneously visible canvases, consistent with M01, M02, and M05. If space is limited, the workspace uses horizontal scrolling or zoom; it does not replace the three-canvas arrangement with a single-device tab.

All three canvases represent the same page and shared component instances.

## Shared state

The following data is shared:
- Component identity and page membership.
- Sample reference and version.
- Content values.
- General sample configuration unless explicitly declared breakpoint-specific.
- Placeholder purpose and optional asset reference.

Shared changes are reflected in all three previews immediately.

## Breakpoint-specific state

Each responsive layout owns:
- Ordered references to the shared instances.
- Visibility for each shared instance.
- Only those responsive presentation overrides explicitly supported by the sample.

Tablet and mobile cannot change shared membership through insertion, removal, replacement, or duplication. These operations are initiated from desktop and update the shared collection and all three layouts.

## Ordering rules

Desktop, tablet, and mobile ordering are independent. A move in one layout does not rewrite the other two. Every layout order must reference each shared instance exactly once, whether visible or hidden.

New shared instances are inserted into all three layouts at the selected structural position while preserving the relative order of existing instances.

## Visibility rules

Visibility is independently controlled per breakpoint. Hiding an instance:
- Does not remove shared membership.
- Does not erase content, configuration, or placeholder data.
- Does not affect visibility in another breakpoint.
- Does not remove the instance from the component list or other layouts.

Showing the instance restores it in that breakpoint without creating a new instance.

## Presentation options

Only sample-declared responsive presentation controls are available. The interface identifies the active breakpoint and distinguishes shared content/configuration from breakpoint-specific presentation.

No arbitrary CSS, numeric breakpoint authoring, freeform positioning, or independent content copies are supported.

## Selection and synchronization

Selecting the same instance in any canvas identifies the same shared instance. The UI makes the editing scope explicit. A shared content edit updates all canvases; a responsive order, visibility, or supported presentation edit updates only its target breakpoint.

## Acceptance checks

- Three canvases remain available simultaneously.
- Shared membership is identical across all breakpoints.
- Tablet/mobile cannot mutate shared membership.
- Ordering and visibility are independent per breakpoint.
- Hidden instances remain in shared membership and retain their data.
- Shared content changes update all canvases.
- Responsive-only changes do not leak to other breakpoints.
- All responsive references satisfy domain invariants.
