# Photo Editor single-app template wireframes

Start with [`template_single_app.md`](./template_single_app.md). It records the current Photo Editor design contract and the source history behind it.

## Wireframes

- [Complete composition](./wireframe-complete.svg)
- [Mobile editor](./wireframe-mobile.svg)
- [Tablet editor](./wireframe-tablet.svg)
- [Desktop editor](./wireframe-desktop.svg)
- [Resizable mobile feature panel](./wireframe-mobile-sheet.svg)
- [File and Features menus](./wireframe-menus.svg)
- [Component and spacing details](./wireframe-components.svg)

These are schematic vector wireframes. The live Photo Editor component and tests on `stage` remain the authority for exact runtime styling and behavior. In particular, retain the mobile feature sheet's vertical resize gesture and internal control scrolling.

## Date & Time adaptation references

- [Unified Date & Time workspace wireframe](../date-time/date-time-workspace-wireframe.svg)
- [Reusable multi-calendar date/time input components](../date-time/date-time-input-components.svg)
- [Unified Date & Time design specification](../date-time/unified-date-time-app-proposal.md)

The Date & Time editor reuses the shared shell geometry but replaces image/file interactions with a live date/time centerpiece and grouped calculation features.

## Raster exports

JPG exports are not included in this revision; only editable SVG wireframes have been added. Raster JPG exports should be rendered from these SVGs and committed alongside them without changing their visual content.
