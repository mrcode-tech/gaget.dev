# GaGet.dev Product & Design Specification

**Status:** Canonical documentation set  
**Authority:** Current source code and tests define implementation; this folder defines product intent, design contracts, and acceptance criteria.  
**Last audited:** 2026-10-21  
**Scope:** Public routes, current tool inventory, global navigation, media and date/time workspaces, design tokens, AI-assisted design workflow, accessibility, and verification.

## Canonical documents

1. [Product and Feature Inventory](./product-and-feature-inventory.md) — implemented routes and tools, actual capability boundaries, planned registry entries, and known discrepancies.
2. [Design Engineering & AI Design Workflow](./design-engineering-ai-workflow.md) — unified workflow informed by Design Engineering and Impeccable-style design fluency for AI.
3. [Design System & Token Contract](./design-system-token-contract.md) — current CSS token source, semantic mapping, component contracts, token governance, and migration rules.
4. [Design Specification Template](./design-specification-template.md) — required template for documenting a new feature or revising an existing experience.
5. [Quality, Accessibility & Verification](./quality-accessibility-verification.md) — responsive, interaction, privacy, visual QA, and automated/manual release checks.

## Source-of-truth rules

- **Implementation truth:** inspect the target branch's routes, components, styles, registry, and tests. Do not treat a registry entry, metadata description, old proposal, or menu label alone as proof that a capability works.
- **Product intent:** this canonical folder defines shared experience rules. A feature may document a deliberate exception, but must explain why.
- **Status vocabulary:** `Implemented` means code paths exist; `Verified` means supported by relevant tests/manual checks; `Partial` means only a subset or preview is available; `Planned` means not implemented; `Unsupported` means the current browser-native engine cannot reliably provide it.
- **No implied parity:** a visible action does not prove that processing/export is supported. Explain preview-only behavior, codec limitations, and any sidecar-only outputs.
- **No visual assets in specification:** this folder intentionally contains Markdown documentation only. Use source code and browser-based verification as evidence; do not maintain screenshots, SVG wireframes, PNG exports, or JPGs here.
- **Change control:** update the relevant canonical document and the feature inventory whenever routes, capabilities, interaction patterns, breakpoints, tokens, or test expectations change.

## Audited application shape

GaGet.dev is a Next.js App Router application using React, TypeScript, Tailwind CSS, Lucide icons, shared UI primitives, and `next-themes`. Current primary workspaces include Photo Editor, Audio Editor, Video Editor, and Date & Time Editor. Other implemented standalone workbenches include JSON Formatter/Validator, URL Encoder/Decoder, Base64 Encoder/Decoder, JWT Decoder, and UUID v4 Generator.

The source registry also contains planned entries. See the inventory before describing a route as available.
