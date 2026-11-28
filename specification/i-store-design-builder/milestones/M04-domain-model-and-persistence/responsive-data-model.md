# Responsive Data Model

Each page has desktop, tablet and mobile layout data referencing the shared component instances.

## Shared data
- Instance identity and component membership.
- Sample reference and version.
- Content values and content-slot references.
- Shared sample configuration unless a defined option is explicitly breakpoint-scoped.

## Breakpoint-specific data
- Ordered references to shared instances.
- Visibility.
- Supported responsive presentation overrides.

## Rules
- Desktop add/remove/replace updates shared membership.
- Tablet/mobile cannot add, remove or replace instances.
- Tablet/mobile may reorder, hide/show and adjust supported options for existing instances.
- Hiding does not delete the instance or content.
- Layout references must resolve to shared instances.
- Three canvases remain visible simultaneously; workspace can scroll or zoom.
- No independent content copies or arbitrary breakpoint overrides.
