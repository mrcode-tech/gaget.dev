# Content and Configuration

## Purpose

Specify the bounded editing model exposed by component instances.

## Sample-defined content

Each catalogue sample declares a typed content schema. The properties panel renders controls from that schema rather than providing a generic unrestricted editor.

Supported field kinds follow the M04 model, including text, constrained text, image reference, link, list, structured item, boolean, enum, and bounded numeric values where the sample declares them.

A field descriptor should provide the stable field identifier, user-facing label, field type, default value, constraints/options, and required/repeatable semantics as applicable.

Examples of editable values include:
- Headings, titles, subtitles, and body text.
- Button labels and supported link destinations.
- Product names, descriptions, prices, and item images.
- Testimonial text, author names, and roles.
- Navigation labels and destinations.
- Footer text and contact details.

The examples are illustrative. The sample schema is authoritative for each instance.

## Editing behavior

- Users can edit only fields declared by the selected sample.
- Each instance owns its values independently.
- Defaults initialize new instances.
- Empty values and placeholders are valid unless the schema or an explicitly scoped requirement says otherwise.
- Field validation provides understandable, field-level feedback.
- Shared content edits are reflected in desktop, tablet, and mobile previews.
- Editing content never changes sample structure or other instances.

## Finite configuration

A sample may declare a finite set of supported configuration options, such as predefined variants, alignment, item count, or display mode.

Configuration controls must:
- Expose only declared options and valid values.
- Use understandable labels and previews where useful.
- Validate values against the sample schema.
- Update all relevant previews immediately.
- Avoid exposing arbitrary CSS, typography, color, spacing, border, shadow, geometry, or pixel-level controls.

A configuration choice is not a freeform visual editor.

## Responsive presentation options

A sample may declare specific options that are valid as breakpoint-specific presentation overrides. Only those explicitly declared options can vary by breakpoint. All other sample configuration remains shared.

Responsive presentation controls must clearly identify whether a change is shared or limited to the selected breakpoint.

## Atomic updates

Content and configuration updates pass through domain commands. Validate the complete proposed update before committing it. Invalid input must not leave partially updated nested state.

## Acceptance checks

- Property controls are generated from the selected sample's schema.
- Unsupported fields and values cannot be written.
- Instance edits do not affect other instances or catalogue definitions.
- Shared content changes are reflected in all canvases.
- Only explicitly supported responsive options can differ by breakpoint.
- No arbitrary styling or detailed geometry editing is exposed.
