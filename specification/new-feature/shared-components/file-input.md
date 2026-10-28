# Reusable File Input / Dropzone Contract

**Status:** Source-audited contract. The repository has no generic reusable file-input/dropzone component; file-only media workspaces use workspace-specific dropzones. Mixed text/file developer tools use the existing shadcn-style `Input` control for optional local file selection.

## Selection rules
- **File-only:** prominent dropzone when suitable, browse button always available, accepted-type guidance and validation.
- **Mixed text/file:** keep text editor first-class and add compact styled file selection. Define whether switching preserves or replaces values.
- **Text-only:** no file picker.

## Proposed API, subject to audit
- accept: picker hints; validate actual content separately.
- multiple: false by default; enable only for batch workflows.
- maxBytes: per-tool limit, not universal constant.
- disabled, label, description and required.
- onFilesSelected(files): pass File objects to local workflow; no upload.
- onValidationError(error): actionable, non-sensitive message.
- onClear(): clear selection and allow owner cleanup.
- selected-file summary: name and readable size, never full local path.

Do not implement this API until existing project conventions and consumers are inspected.

## States
Empty, drag-over if supported, selected, invalid type, oversized, zero-byte where unsupported, processing, error/retry, disabled, replaced and cleared.

## Accessibility and privacy
Browse is keyboard accessible; drag/drop is never required. Use visible focus, programmatic labels, announced errors and sensible focus restoration. Respect touch, RTL, theme, zoom and long translations. Do not auto-open the picker. Files remain in browser memory unless a separately approved network action exists; do not log/persist content by default. Release object URLs/workers on replacement/unmount. Picker accept values are hints, not security validation.

## Acceptance
Reuse existing dropzone if found; otherwise document why new component is justified. Mixed-input tools retain styled text entry. Invalid/oversized files show actionable errors. Keyboard users can choose/replace/clear without drag/drop. Filename/size are accessible and full path hidden. Replacement releases resources. No upload occurs by default.
