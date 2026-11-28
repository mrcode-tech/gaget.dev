# Composition Domain Model

## Purpose

Define the page-composition model implemented by M06, extending the conceptual entities and invariants established in M04 and the typed runtime foundation established in M05.

## Core model

A project contains pages. Each page owns one composition consisting of a shared collection of component instances and three responsive layouts: desktop, tablet, and mobile.

A component instance:
- Has a stable, unique identity within the project.
- Belongs to one page and one high-level component type.
- References one catalogue sample and the sample version used.
- Owns independent content values, bounded configuration, and placeholder metadata.
- Is shared by all responsive layouts; layouts reference the instance rather than copying it.

Catalogue sample definitions remain product-authored reusable definitions. They are not project instances and must never hold user-specific instance content.

## Ownership and separation

Keep these concerns distinct:
- **Catalogue definition:** sample identity, version, component type, content schema, finite options, renderer key, and responsive capabilities.
- **Component instance:** selected sample reference/version, independent content, configuration, placeholders, and stable identity.
- **Page composition:** shared instance membership.
- **Responsive layout:** ordered instance references, visibility, and supported presentation overrides for one breakpoint.
- **Workspace UI state:** current selection, open panels, insertion dialog, drag state, and preview state. This is transient UI state, not project composition.

Mission/progression state remains separate from composition.

## Instance lifecycle

M06 supports explicit creation through insertion or duplication, updates to supported fields/options, sample replacement, responsive presentation changes, and removal. All mutations pass through domain command boundaries and validation. UI components must not mutate nested domain objects directly.

## Invariants

1. Instance identities are unique.
2. Every instance belongs to exactly one existing page.
3. Every instance references an existing sample and supported version.
4. The referenced sample's component type matches the instance's component type.
5. Every responsive layout reference resolves to an instance in the page's shared collection.
6. Each breakpoint order contains every shared instance exactly once, including hidden instances.
7. Visibility does not alter shared membership or erase content.
8. Instance content and configuration are independent from catalogue definitions and other instances.
9. Content fields and configuration values conform to the selected sample's schema.
10. Replacement preserves instance identity and must not silently discard compatible content.
11. A failed command leaves the previous valid state intact.
12. Composition remains independent of mission progression and transient workspace state.

## Technology and persistence constraints

The MVP remains browser-only, temporary, and in-memory using a structured typed JSON representation. No backend, database, authentication, browser-storage persistence, autosave, recovery, or history infrastructure is introduced by M06.

The model remains portable and technology-neutral at the specification level. It must not depend on GaGet-specific domain behavior.

## Out of scope

- Arbitrary nested element trees authored by users.
- Freeform geometry, pixel positioning, CSS editing, or unrestricted styling.
- Shared/linked instances or cross-page component references.
- Collaboration, persistence, import/export, or asset-service infrastructure.
- Undo/redo and historical snapshots.
