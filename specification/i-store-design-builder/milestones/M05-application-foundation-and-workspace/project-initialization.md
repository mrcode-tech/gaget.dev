# Project Creation and Initialization

## Purpose

Specify the minimal project creation flow and the initial in-memory project structure.

## Creation flow

The user starts through either the GaGet entry point or the direct builder route. If no active in-memory project is available, present a short project-creation step.

Required creation fields:
- **Project name**
- **Website purpose**

The purpose can be a concise description or a selected broad purpose with optional supporting text, provided the experience remains generic. Do not restrict the product to stores.

Do not require the user to complete all project context before entering the workspace.

## Progressive project context

The project model may represent:
- Audience.
- Offering.
- Language.
- Visual direction.
- General project settings.

These fields can be completed progressively through the journey or contextual project configuration. Their presence in the model does not make them mandatory at creation.

## Initialization result

On successful creation, initialize:
- One project.
- One default page.
- Page identity, title/name, route/slug, purpose and lifecycle status as appropriate to M04.
- Empty page composition.
- Desktop, tablet and mobile responsive layout structures.
- Initial mission/progression state, kept separate from composition.
- Default project settings and theme-independent design context.

Use stable identifiers for project, page and layout entities within the active session. Do not derive identity from display names or user-editable titles.

## In-memory lifecycle

The project is temporary and held in browser runtime memory. Refreshing or closing the application may discard it.

The UI must not imply that the project has been permanently saved, synchronized, backed up or can be recovered after reload. Do not introduce localStorage, IndexedDB, cookies, server persistence or a database as a hidden persistence layer.

If navigation between builder routes occurs during the active runtime, preserve the in-memory project state as appropriate to the application architecture. This is runtime continuity, not persistence.

## Validation

Validate required creation fields and domain invariants:
- Project name is present and within documented limits.
- Website purpose is present in an accepted form.
- Project and default page identifiers are unique within the active model.
- Default page route/slug is valid and unique within the project.
- Required responsive layout structures exist.
- Initial page composition is empty.
- Mission state is initialized separately from page composition.

Exact field constraints should be defined in the domain contract and kept consistent with M04; do not invent incompatible duplicate schemas in UI components.

## Failure and empty states

Show actionable validation feedback without losing the user's current form input. If initialization fails, show a recoverable message and allow retry. Do not claim a project was created until initialization succeeds.

## Out of scope

- Authentication and account ownership.
- Backend/database persistence.
- Autosave and recovery.
- Import/export.
- Multi-user collaboration.
- Project duplication or templates.
- Full project settings and all journey missions.
