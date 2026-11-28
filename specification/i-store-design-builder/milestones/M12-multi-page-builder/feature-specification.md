# M12 — Feature Specification

## 1. Page planner

Show all pages in a project with page label, purpose/type, route, completion summary, and navigation relationship indicators. The planner is an overview and navigation tool; it does not automatically determine page order or hierarchy.

Exactly one page is designated homepage. Additional pages are optional and user-created.

## 2. Page lifecycle

Users can:
- Create a blank page.
- Create from an explicitly selected curated starter.
- Rename a page.
- Change its purpose/type and route.
- Duplicate a page.
- Reorder pages in the planner.
- Delete a page after impact review.

Duplicate creates a new page ID and new component instance IDs. It may retain exact sample references/versions and copy supported content/configuration, while shared site elements remain references.

Deletion is blocked for the homepage. For other pages, show incoming internal links and navigation items. The user must explicitly choose to remove those references or retarget them before confirming deletion. No silent dangling links.

No automatic page suggestions or creation. Optional page-type descriptions explain common uses.

## 3. Page starters

Curated starters provide a user-selected initial section composition for common generic purposes: about, contact, listing/collection, detail, FAQ/help, service/offering, campaign/landing. A starter is a convenience, not a complete page template marketplace.

Preview before applying. The user confirms and may remove/replace/reorder all included sections. No starter is applied without an explicit action.

## 4. Page-specific composition

Each page owns its section instances and M11 responsive state. Composition follows M06: explicit sample selection, preview, confirm, placement, and insertion; bounded content/configuration; explicit replacement/removal/duplication.

## 5. Shared site elements

A project may define shared header/navigation/footer elements. Pages reference these shared elements. Shared element edits update all pages using the reference. Page-local content remains page-owned.

M09 website identity is project-level and shared. Shared elements are not copied as page-local components during page duplication.

## 6. Navigation

Navigation items have stable IDs, user-defined labels, order, and destinations. Supported destinations:
- Internal page reference by stable page ID.
- External URL.
- Supported contact destination (for example email).
- Non-link label/group only where the sample supports it.

Navigation visibility and presentation use sample-declared responsive behavior. Users choose which pages appear in navigation and their order. A page need not appear in primary navigation.

## 7. Routes

Each page has a user-editable route/slug for design and handoff. Route uniqueness is validated within the project. The homepage has the root route. This is design metadata, not a functioning deployed router.

## 8. Multi-page preview

Users can select a page for editing and preview it across the three simultaneous canvases. A site overview provides a way to inspect page-to-page navigation. Preview does not create pages or change navigation.

## 9. Cross-page validation

Validate duplicate routes, unresolved internal links, missing navigation labels, deleted-page references, duplicate shared elements, and pages without meaningful identifying metadata. Findings link to affected pages/items. Empty pages are allowed but reported as incomplete when relevant.

## 10. Progress

Page missions map to M01 levels. M12 does not invent new statuses or redefine overall completion. Users can revisit all pages regardless of level status.
