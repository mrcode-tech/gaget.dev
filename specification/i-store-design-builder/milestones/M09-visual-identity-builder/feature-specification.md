# M09 — Feature Specification

## 1. Visual direction discovery

The identity workspace presents a curated gallery of visual directions. Each direction has a stable identifier, name, concise explanation, representative visual preview, controlled descriptors, and supported identity aspects.

Users can inspect and compare directions, select one as a starting point, and explicitly choose compatible aspects from other directions. A direction is a starting reference, not an indivisible theme package.

The initial catalogue is curated and progressively expandable. It must cover meaningfully different visual personalities and remain generic across website purposes.

No automatic direction ranking, personalization, or selection is permitted.

## 2. Color palette

A palette supplies semantic values for:
- Primary.
- Secondary.
- Accent.
- Background.
- Surface.
- Text.
- Muted text.
- Border.
- Feedback roles: success, warning, error, and information.

A palette definition includes stable identity, name, description, semantic color values, preview metadata, and any documented compatibility notes. Users can select a curated palette and preview it against representative content and components.

Supported color customization may change palette values without removing semantic roles. The interface must show the effect on relevant combinations and provide WCAG 2.2 AA contrast feedback. It must not silently change user-selected values.

The exact color values and palette catalogue are design-authoring decisions, not fixed by this specification.

## 3. Typography system

A typography pairing defines supported font roles and hierarchy for:
- Display/primary headings.
- Section headings.
- Body text.
- Labels and controls.
- Supporting text and captions.

The user selects from curated pairings and supported type-scale presets. Supported configuration may include font family, approved weights, and predefined scale/hierarchy variants. Font availability, fallback behavior, licensing, and rendering must be documented by the authored pairing.

Do not expose arbitrary per-element typography controls or unrestricted numeric editing in the initial scope.

## 4. Image direction

Image direction records the intended visual treatment, such as photography or illustration, mood, composition, subject treatment, and supported presentation guidance.

It does not create or source images. Users may reference their own supplied assets through the existing optional asset-reference concept. Generic purpose-aware placeholders remain valid when assets are absent.

No stock-image picker, image generation, or asset-management infrastructure is introduced.

## 5. Shared component styles

The identity may define curated shared styles for common controls such as buttons and form controls. Each style choice exposes only documented finite options, for example a supported shape, size, or emphasis variant.

The identity style is a shared project-level default. A sample consumes it only if its compatibility contract declares the relevant slot. A sample may retain its own supported distinctive presentation where its contract requires it.

M06 remains authoritative: no arbitrary CSS, unrestricted typography/color/spacing/border/shadow/geometry controls are exposed through component properties.

## 6. Spacing and layout presets

The identity may include a curated spacing scale and supported layout conventions/presets. These are semantic shared values and relationships, not a freeform layout editor.

A sample declares which spacing/layout tokens it consumes and how they map to its own structure. M06/M07 remain authoritative for component structure, sample layout, high-level ordering, and breakpoint behavior. The identity cannot move nested elements or change component geometry arbitrarily.

## 7. Identity preview

Changes to the draft identity are reflected immediately in the identity preview. Preview surfaces include representative component samples and the existing desktop, tablet, and mobile canvases.

Preview is non-mutating with respect to the project identity and composition until the user confirms application. It must not insert samples or modify project component membership.

## 8. Confirmation and application

The user reviews the assembled identity and explicitly confirms it as the active project identity.

Applying a confirmed identity:
- Updates the project-level active identity.
- Makes compatible identity tokens available to compatible sample renderers/instances.
- Preserves component instance identity, sample reference/version, structure, content, placeholders, and page membership.
- Preserves desktop/tablet/mobile ordering and visibility.
- Does not select, insert, replace, remove, duplicate, or arrange components.
- Identifies unsupported or potentially affected presentation where review is needed.

An application operation must be validated as a complete domain update; partial token application is not allowed.

## 9. Revising an active identity

The project has one active identity. Users may revisit the identity stages, create a draft revision from the active values, preview it, and explicitly confirm the revision. This is not a saved-alternatives library or historical version system.

A draft that is abandoned must not partially mutate the active identity. The runtime does not promise recovery after refresh/close.

## 10. Consistency review

The review evaluates:
- Semantic color role usage.
- Typography hierarchy.
- Applicable text and non-text contrast.
- Shared button/form style consistency where tokens are supported.
- Responsive presentation of representative components and canvases.

It reports findings and affected roles/components. It does not calculate an aesthetic score, automatically fix findings, or claim universal conformance for arbitrary page content and user media.

## 11. Guidance

Guidance is concise, contextual, and optional. It explains what a choice affects and provides visual examples. It does not make a choice on the user's behalf. M08's practice-first and no-automatic-recommendation rules remain in force.

## 12. Completion

The user confirms the identity after review. Identity completion is distinct from M01 level and mission completion. M09 must not redefine the 11-level journey, mission statuses, or overall website completion rules.
