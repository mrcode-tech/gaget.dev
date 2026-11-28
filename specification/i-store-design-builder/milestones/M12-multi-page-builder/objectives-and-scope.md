# M12 — Objectives and Scope

## Goals

- Let users expand a homepage into a website that reflects their own information architecture.
- Support page creation, naming, route configuration, duplication, reordering, and deletion.
- Provide optional page starters to reduce blank-page uncertainty without taking decisions away.
- Support shared site-wide elements and page-specific sections.
- Define reliable internal navigation using stable page references.
- Preview the website as a connected set of pages.
- Preserve independent responsive state for every page.

## Non-goals

- Full CMS, dynamic data collections, user accounts, transactions, ecommerce checkout, payments, booking, membership, or third-party integrations.
- Automatically deciding which pages a project needs.
- A fixed mandatory set of pages or page count.
- Automatic page creation, section insertion, or navigation configuration.
- Arbitrary route/server behavior, query-driven application logic, or custom code.
- Multi-user collaboration and access permissions.
- Persistence, autosave, history, or cloud hosting.

## Page model principles

A page is a user-owned design document with stable identity, purpose, route metadata, page-specific sections, and responsive layouts. The homepage is unique and cannot be deleted as an ordinary page. Site-wide elements are shared references, not copies.

## Initial scope

- Page planner and overview.
- Create/rename/reorder/duplicate/delete page operations.
- Optional curated page starters.
- Page-specific composition using M06.
- Shared header/navigation/footer references.
- Internal/external navigation configuration.
- Route uniqueness and link validation.
- Per-page desktop/tablet/mobile preview.
- Cross-page map and completeness summary.

## Deferred

CMS content types, dynamic routing, data-driven detail page instances, production routing implementation, authentication, server rendering, publishing, and integrations.
