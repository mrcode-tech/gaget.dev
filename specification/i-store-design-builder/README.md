## MVP C decision and M10–M15 planning status

The accepted release boundary is recorded in [ADR-0001](decisions/ADR-0001-lightweight-session-mvp.md): temporary in-memory projects; explicit local JSON and Markdown export; optional ZIP handoff with selected available session media; no accounts, cloud persistence, autosave, browser-storage persistence, undo/redo, history, import, or backend asset library. This decision supersedes conflicting earlier save/recovery expectations for the first MVP.

- **M10 — Homepage and Section Library:** Prepared baseline — ready for consolidated review. Defines generic homepage section families, user-selected samples, visitor-action intent, shared-frame references, and homepage validation. [M10 specification](milestones/M10-homepage-builder/README.md)
- **M11 — Responsive Design:** Prepared baseline — ready for consolidated review. Defines three simultaneous device canvases, inherited defaults, bounded sample-declared overrides, independent tablet/mobile ordering and visibility, and responsive validation. [M11 specification](milestones/M11-responsive-design/README.md)
- **M12 — Multi-page Website Builder:** Prepared baseline — ready for consolidated review. Defines page planning/lifecycle, optional user-selected starters, shared site elements, stable internal navigation references, route validation, and connected-site preview. [M12 specification](milestones/M12-multi-page-builder/README.md)
- **M13 — Content, Media, and Website Quality:** Prepared baseline — ready for consolidated review. Defines sample-driven content states, placeholders, session-only user-selected local images, asset metadata, alt text, cross-milestone validation, and actionable readiness findings. [M13 specification](milestones/M13-content-and-quality/README.md)
- **M14 — Export and Implementation Handoff:** Prepared baseline — ready for consolidated review. Defines canonical versioned JSON, readable Markdown, optional ZIP packaging with selected available session media, explicit Complete/Incomplete status, deterministic output, and local-only processing. [M14 specification](milestones/M14-export-and-handoff/README.md)
- **M15 — Platform Readiness and Growth:** Prepared future-platform baseline — post-MVP. Defines standalone extraction, staged accounts/cloud persistence/recovery, asset hosting, sharing, operations, analytics, and conditional monetization. [M15 specification](milestones/M15-platform-and-growth/README.md)

M10–M15 specifications are planning artifacts, not implementation or verification evidence. Their status is prepared for consolidated user review, not individually approved implementation authorization.

## Governance boundary

Approval of a milestone means its product/specification baseline is approved. It does not mean the feature has been implemented, tested, deployed, merged, or extracted into a standalone codebase.
