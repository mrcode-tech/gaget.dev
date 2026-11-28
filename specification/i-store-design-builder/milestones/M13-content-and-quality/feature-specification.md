# M13 — Feature Specification

## 1. Structured content editing

The editor renders fields from the selected M07 sample schema. Supported field types may include short text, long text, label, URL/link, email/contact, boolean, finite selection, ordered item collection, and image slot. Only types declared by a sample are available.

No arbitrary rich-text layout, HTML, CSS, nested content tree, or unrestricted field creation.

## 2. Content states

Each content field or supported content item may be:
- Final: user considers it ready.
- Draft: user supplied provisional content.
- Placeholder: intentionally deferred with a purpose or instruction.
- Missing: no value or placeholder has been supplied.

The product must not infer that text is final. Users explicitly mark readiness where required. Empty optional fields remain allowed.

## 3. Placeholders

Text and media placeholders include a purpose, such as "short product description", "team portrait", or "location photograph". Purpose is descriptive metadata. Placeholders remain valid unless a specific mission or sample requirement marks the field required.

## 4. Local image assets

Allow user selection of supported local raster images (JPEG, PNG, WebP; AVIF where browser preview support is reliable). Validate file type and size against a documented implementation limit. Do not trust file extensions alone.

The session asset registry retains selected File/Blob objects in memory and assigns stable session asset IDs. Project state stores metadata: filename, MIME type, byte size, dimensions when available, and session asset ID. Do not upload files to a server or persist them in browser storage.

Users explicitly attach an asset to a declared image slot. One asset may be referenced by multiple slots. Replacing/removing a slot reference does not delete the source file from the session registry until the user removes it or the session ends.

No SVG in the initial MVP unless a later security review approves safe sanitization/rendering.

## 5. Image slot settings

A slot may define:
- Purpose/description.
- Optional asset reference.
- Alt text.
- Decorative versus informative classification.
- Sample-supported crop/aspect/focal presets.

Do not expose freeform crop coordinates or arbitrary image transformations. Decorative images use empty alt text according to the applicable accessibility model; informative images require meaningful user-provided alternative text before being marked ready.

## 6. Links and metadata

Validate supported link types and basic URL syntax. Internal page links resolve by M12 stable page ID. External destinations use validated URLs. Contact destinations follow supported formats. Basic page title/description fields may be reviewed for completeness, but M13 is not an advanced SEO tool.

## 7. Quality review

Checks include:
- Required sample fields missing.
- Draft/placeholder/missing content.
- Empty required collections.
- Missing alt text for informative images.
- Broken internal links and invalid external URL syntax.
- Duplicate routes and navigation issues from M12.
- Missing page title or description where configured as required.
- Unsupported/missing asset references.
- Contrast findings from M09.
- Responsive overflow/clipping findings from M11.
- Structural and shared-element consistency findings from M10/M12.

## 8. Findings and readiness

Each finding identifies rule, severity, affected page/component/field, explanation, and correction target. Severity is limited to blocking structural/data errors, warnings, and informational notes.

Provide a readiness summary with counts and categories, not a numerical design-quality score. "Ready for handoff" means no unresolved blocking structural errors; warnings may remain and must be disclosed. Overall project Complete remains governed by M01 and requires user final review confirmation.

## 9. User agency

The system may explain and optionally suggest user-controlled correction actions, but never rewrites copy, selects assets, assigns media, changes alt text, repairs links, or restructures pages without explicit user action.
