# Workspace and Canvas Foundation

## Purpose

Specify the initial workspace shell and responsive canvas foundation. This is the foundation for later composition work, not the complete editor.

## Workspace structure

Use a flexible hybrid workspace with contextual panels:
- **Left area:** contextual navigation, component library and catalogue.
- **Center area:** workspace and website canvas region.
- **Right area:** contextual properties/configuration panel.
- **Guide:** collapsible contextual mission instructions.
- **Progress:** compact journey and mission status.
- **Header:** project identity and workspace-level controls.

Panels may collapse, resize or adapt to context. The workspace should prioritize the website being composed rather than resemble a generic administration dashboard.

M05 establishes panel structure and basic behavior. It does not implement all later mission, properties, or composition interactions.

## Canvas foundation

Initialize and display three responsive canvases simultaneously:
1. Desktop.
2. Tablet.
3. Mobile.

Each canvas:
- Represents the same project page.
- Has a visible page boundary.
- Starts empty in M05.
- Is clearly labelled with its device/breakpoint role.
- Can be distinguished visually without relying on color alone.

When the available workspace width is insufficient, preserve the simultaneous three-canvas model using horizontal scrolling, workspace zoom, or an equivalent layout adaptation. Do not replace it with a single-device tab selector.

## M05 canvas behavior

M05 provides:
- Canvas region and page frame.
- Breakpoint labels and basic viewport presentation.
- Empty-page state.
- Responsive workspace layout.
- A stable rendering surface for later composition functionality.

M05 does not provide:
- Component insertion into the page.
- Drag-and-drop composition.
- Reordering or removal.
- Breakpoint-specific visibility controls.
- Full responsive presentation editing.
- A finished website preview/export engine.

These capabilities belong to later milestones and remain governed by M01/M02/M04.

## Responsive model alignment

The three canvas views represent the responsive structures defined by M04. Shared page and project identity remain common. The future composition engine will render shared component instances through breakpoint-specific layouts.

M05 must not invent an alternate responsive model or imply that tablet/mobile can independently change shared component membership. M01's desktop-owned membership rule remains authoritative.

## Workspace navigation

Provide clear access to:
- Project/workspace overview.
- Component catalogue.
- Contextual guidance/progress entry points.
- Page context, while the initial project contains one default page.

Do not implement the complete page manager or all 11 journey levels in this milestone.

## Empty states

The initial project should clearly explain that its page is empty and that the user can explore the component catalogue. The empty state must not automatically insert a sample or choose a design for the user.

## Acceptance checks

- All three canvases are visible simultaneously at supported desktop workspace sizes.
- Narrow workspace layouts preserve all three canvases through scrolling or zoom.
- Each canvas has a clear page boundary and device label.
- New projects show empty canvases rather than preselected or automatically inserted components.
- Workspace panels can present their initial content and basic empty states.
- Existing GaGet shell and unrelated routes are unaffected.
