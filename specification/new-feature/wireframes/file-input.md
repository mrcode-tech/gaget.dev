# File Input Wireframes

**Status:** Proposal pending source audit.

## File-only workflow
- File label and supported formats.
- Optional drop target.
- “or” plus a visible [Choose file] button.
- Size limit and local-processing note.
- After selection: filename, readable size, validation/error, [Replace] and [Clear].

Browse is always available; drag/drop is optional. Never show the full local path.

## Mixed text/file workflow
- Input method: Paste/type | Select file.
- Paste/type: existing styled Textarea/editor.
- Select file: [Choose file], filename and validation.
- Run operation, then output.

Do not hide manual entry behind file import. Define whether switching methods preserves or replaces each input.

## Responsive and states
Desktop/tablet may use a bounded drop target. Mobile uses a full-width browse action and wrapping helper text. Short-height layouts remain scrollable. States: empty, drag-over, selected, invalid, oversized, processing, error, disabled, replaced and cleared. Browse/clear are keyboard accessible, errors are announced, and RTL uses logical alignment.
