# M10 — Feature Specification

## 1. Homepage workspace

A project begins with one homepage page record created by M05/M04. M10 provides a homepage-focused context and section library. It does not require a template or preselect sections. The page may initially contain only the shared frame or be empty according to the project initialization contract.

## 2. Section discovery

Browse by functional family and component type using M07 taxonomy. Search and filters remain optional discovery aids. Cards show sample identity, concise purpose, supported content slots, visual-style descriptors, and preview availability.

Website-purpose tags may help users understand applicability but must not hide generic samples or automatically determine what belongs on a page.

## 3. Preview and insertion

Follow M06 exactly:
1. Select a section type.
2. Inspect and compare authored samples.
3. Preview a sample independently and in page context.
4. Review its supported content fields and finite options.
5. Explicitly confirm the sample.
6. Choose insertion position or append.
7. Insert through the composition command.

Previewing does not mutate the page. No section is inserted automatically.

## 4. Section families

The initial taxonomy covers:
- Header/navigation.
- Hero/introduction.
- Offering/featured content.
- Benefits/value proposition.
- Gallery/collection/listing.
- Process/how it works.
- Trust/testimonials/credentials.
- FAQ/supporting information.
- Contact/conversion/call to action.
- Footer/closing navigation.

These are taxonomy categories, not required sections. The catalogue may expand without changing the composition model.

## 5. Purpose and visitor intent

Project purpose, audience, offering, and intended outcome are contextual inputs. The user may revise them at any time. The product may explain what a section commonly communicates and show illustrative sequences. It must not infer or enforce a universal structure.

The user explicitly identifies a primary visitor action when relevant. The action may be a link, contact route, browse action, request, sign-up, purchase-intent CTA, or another supported destination. M10 models presentation and link intent only; it does not implement transactions or business workflows.

## 6. Content and options

A section exposes only its M07 sample-defined content schema and finite options. Supported content may include headings, body copy, labels, links, item collections, image slots, and accessibility text where defined.

Text may be real, draft, or placeholder. Empty optional content is permitted. Required content is determined by the sample schema and relevant mission criteria, not by a universal mandatory homepage checklist.

## 7. Shared site frame

Header, navigation, and footer must have explicit ownership. If the project model represents these as shared site elements, the homepage references them rather than creating independent duplicate instances. If M12 later introduces site-wide shared elements, migration must preserve identity and content.

A homepage-specific promotional or closing section is not automatically equivalent to the shared footer.

## 8. Identity integration

Render sections using the active M09 identity only for supported token slots. Preserve sample-specific layout and character. An unsupported identity slot remains sample-authored/default; no guessed mapping.

## 9. Responsive composition

M10 uses existing M01/M06 rules:
- Desktop controls shared section membership and structural add/remove/replace.
- Tablet/mobile cannot independently add, remove, or replace sections.
- Tablet/mobile may independently reorder, hide/show, and adjust supported presentation.
- Shared content and configuration synchronize.
- All three canvases remain visible simultaneously.

M11 adds detailed responsive patterns and validation.

## 10. Completeness and validation

Provide structural findings such as missing section content required by a selected sample, unresolved required link destination, empty required collection, or no user-designated primary visitor action where the project goal requires one.

Do not require every section family. Do not score aesthetics or silently modify structure. Findings link to the relevant section/property control.

## 11. Generic coverage

Use synthetic examples across multiple website purposes. Store-oriented examples may demonstrate the first complete journey, but product entities, checkout, payment, inventory, and store-specific page assumptions are not hardcoded into generic section contracts.
