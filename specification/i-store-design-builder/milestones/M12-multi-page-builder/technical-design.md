# M12 — Technical Design

## Architecture

M12 extends M04's project/page model and uses M06 composition, M09 identity, M11 responsive behavior, and M08/M01 progression. It must not create a parallel page or navigation store.

## Page commands

Typed commands: create page, update page metadata, duplicate page, reorder page list, delete page after link resolution, update navigation item, and update shared element reference. All commands validate project invariants.

## Identity and duplication

Page and component IDs are generated independently for duplicates. Sample IDs/versions remain exact references. Content and finite configuration are copied as values. Shared site elements and website identity are referenced, not duplicated.

## Navigation resolver

Resolve internal destinations by stable page ID. Route strings are derived/validated metadata and can change without breaking references. External URLs are validated as supported URL values. Unresolved references are represented as findings and block deletion completion until resolved.

## Shared elements

Store shared site elements at project level with stable IDs and typed roles. Page-level references identify usage. Updating a shared element affects all references through normal rendering. Do not duplicate it into every page's component list.

## Responsive state

Each page owns its responsive layout state and uses M11 capability resolution. The three canvases always preview the currently selected page.

## Runtime

In-memory only. No router deployment, CMS, backend, persistence, collaboration, or authentication.
