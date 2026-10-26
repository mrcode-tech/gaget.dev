# Encoding Workbench — Layout Record

**Status:** Proposal; current implementation is not an approved target design.

## Layout
- Operation selector above direction controls.
- Source and result panels sit side-by-side at XL widths and stack on narrower viewports.
- Source offers Encode/Decode and Clear; result is read-only with Copy and Download.
- Mode-specific help is visible below the panels; errors appear near the result and preserve source input.

## Operations
URL component, Base64, Base64url, Base32, Hexadecimal, Binary bytes, HTML entities, and Unicode escapes. Text is the only input type today; byte encodings operate on UTF-8 text.

## Compatibility
/encoding/base64 redirects to /encoding/url?mode=base64. The redirect is covered by route smoke tests and must remain stable.

This document is an editable layout record, not a screenshot or proof of visual conformance. CI captures the unified route in mobile, short-height mobile, tablet and desktop viewports.
