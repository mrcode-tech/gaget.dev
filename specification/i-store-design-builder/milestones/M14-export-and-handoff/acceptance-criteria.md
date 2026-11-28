# M14 — Acceptance Criteria

- [ ] Export is available for complete and incomplete projects.
- [ ] JSON is versioned and contains the full approved design blueprint.
- [ ] Markdown provides a readable handoff with pages, sections, identity, responsive behavior, content, media, findings, and limitations.
- [ ] Complete/Incomplete status follows M01 exactly.
- [ ] Export does not alter mission, level, project, page, or composition state.
- [ ] ZIP package contains JSON, Markdown, manifest, and only explicitly selected available media.
- [ ] JSON/Markdown disclose that binary media is not embedded.
- [ ] Missing/unavailable assets are explicitly listed.
- [ ] ZIP paths and filenames are sanitized; path traversal is impossible.
- [ ] Export is deterministic for identical data/options, apart from documented volatile metadata.
- [ ] All processing occurs locally; no server upload or remote media fetch.
- [ ] Export failure never yields a silently truncated/corrupt file.
- [ ] No import, cloud save, code generation, Figma sync, hosting, or publishing is introduced.
