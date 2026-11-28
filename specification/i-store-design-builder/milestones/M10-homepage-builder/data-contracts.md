# M10 — Data Contracts

## Homepage metadata

A homepage is a normal M04 page with a stable page ID and a homepage designation. Conceptual fields:
- pageId
- pageKind = home
- title/label
- route or root designation
- purpose summary (optional reference to project profile)
- primaryVisitorAction (optional structured intent)
- sharedFrameReferences
- sectionInstanceIds (ordered through M06 responsive layout state)

## Primary visitor action

A structured value may contain:
- actionId
- label (content field)
- intent/category (controlled vocabulary, extensible)
- destinationKind (internal page, external URL, email/contact, or other supported destination)
- destinationValue (optional until configured)
- applicability (required, optional, or not applicable according to project/mission rules)

This is descriptive website design data, not a transaction/API integration.

## Section instance

Section instances continue to use M04/M06 component-instance contracts:
- stable instance ID
- component type
- exact sample ID/version
- sample-defined content
- finite configuration
- placeholder/asset references
- shared identity compatibility resolved from M09
- independent breakpoint layout state

No M10-specific arbitrary style properties are added.

## Shared frame references

Where shared header/navigation/footer are represented centrally, the homepage stores references rather than duplicate section instances. Each reference has a stable shared-element ID and role. Page-local sections remain ordinary component instances. M12 defines cross-page lifecycle and navigation.

## Validation finding

A finding contains:
- stable finding ID
- rule ID
- severity (blocking for structurally invalid required data, warning for incomplete optional content)
- target page/section/field ID
- concise explanation
- correction route/action identifier

Findings are derived and are not authoritative user content.

## Invariants

- Exactly one page is designated as homepage per project.
- Homepage sections use stable M06 instance identities.
- No sample version is silently upgraded.
- Primary visitor action is user-authored.
- Shared frame references do not create duplicate instances.
- M10 does not alter M01 mission status rules or M06 responsive layout invariants.
