# M13 — Objectives and Scope

## Goals

- Make content fields understandable and editable within the selected sample's schema.
- Distinguish final content, draft content, placeholders, and missing content.
- Let users describe image intent and optionally select their own local image assets for the current session.
- Support meaningful alt text and only sample-supported image presentation controls.
- Detect missing required content, unresolved links, invalid routes, and accessibility issues.
- Provide actionable review findings connected to the relevant field/component/page.
- Preserve user choices and avoid automatic rewriting or media assignment.
- Produce reliable content/media metadata for M14 handoff.

## Non-goals

- Full CMS, content scheduling, localization management, editorial workflow, or dynamic data sources.
- Stock-image library, remote image search, image generation, or AI copywriting.
- Hosted asset library, server uploads, permanent asset storage, or cross-session media recovery.
- Advanced image editing, arbitrary cropping, Photoshop-like controls, or unrestricted focal coordinates.
- Advanced SEO suite, analytics, A/B testing, or automatic optimization.
- Automated content correction or subjective quality scores.

## MVP assumptions

- Supported local image files are attached only to the active session.
- Project JSON stores asset metadata and stable session references, not raw file bytes.
- M14 may package selected referenced local files in an optional ZIP handoff.
- JSON/Markdown alone contain an asset manifest and explicit missing-media notes.
- If the browser session ends, unexported local files may be lost.

## Initial scope

Typed content editor, content status, placeholder purpose, local image selection, asset metadata registry, alt text, supported image presentation options, link validation, structural/accessibility checks, issue list, and readiness summary.
