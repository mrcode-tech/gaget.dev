# Architecture and Integration

## Baseline
lib/tools/registry.ts defines stable IDs, kind, workspace ID, display metadata, canonical href, category, keywords and available/planned status. developerTools derives from standalone tools plus JSON; developerToolCategories derives from that set. Existing primitives include Button, Card, Input, Select, native-select, Textarea and ScrollArea under components/ui/. ToolLayout, ToolCard and ToolCatalog are existing patterns.

Registry metadata and route strings do not prove that a route or operation works. Verify runtime behavior and tests before launch.

## Vocabulary
- **Category:** discovery taxonomy; no runtime state.
- **Workspace:** cohesive experience sharing state and input/output model.
- **Tool:** registered destination with stable identity.
- **Operation:** action within a workspace or standalone tool.
- **Status:** evidence of actual capability, not promotional wording.

Do not create a separate route for every operation. Group related operations when input/output and user intent fit. Preserve canonical routes and add explicit tested aliases rather than breaking bookmarks.

## Operation contract
Every operation specifies stable ID, localized title/description, input/output types, parameter schema/defaults, validation, execution mode, errors, resource limits, cleanup/cancellation, privacy behavior and tests. Reuse current architecture unless source audit proves a gap.

## Processing and safety
1. Prefer browser-local processing where technically appropriate; do not upload content without approval.
2. Distinguish text from bytes and define UTF-8/malformed-input behavior.
3. Use workers for expensive work when justified; document cancellation and cleanup.
4. Never execute user-supplied code, SQL, markup, shell commands or cURL commands during parsing/formatting.
5. Regex work needs bounded behavior and safeguards against pathological patterns.
6. Compression/archive work needs input/output limits, expansion ratio, entry count, nesting, cancellation and path-traversal protection.
7. Cryptography requires explicit algorithms, key/IV/nonce rules, authentication handling and known-answer vectors.
8. Network utilities distinguish offline parsing from actual requests; none occur implicitly.
9. Certificate parsing is not trust-chain, hostname or revocation validation unless implemented.
10. File signatures, entropy and printable strings are indicators, not a safety verdict.

## Routes, catalog and state
Keep lib/tools/registry.ts canonical unless approved architecture changes. Preserve /encoding/url, /encoding/base64, /security/jwt-decoder and /generators/uuid. Planned entries remain non-launchable until verified. Photo, Audio, Video, Date & Time and JSON Workspace are out of implementation scope. Do not persist tokens, keys, cookies, request bodies or file content in URLs, local storage, analytics or logs by default. Copy/download must use actual output and safe filename/MIME where known.

## Error taxonomy
Differentiate missing input, malformed syntax, unsupported format/algorithm, invalid byte sequence, resource limit, unavailable browser API, cancellation, unexpected error and network failure. Do not expose stack traces or secrets in user-facing messages.

## Acceptance
Unique registry IDs/routes; correct status and category metadata; planned entries non-launchable; existing routes preserved; shared UI and RTL reused; accessible input/output/errors; tests cover valid, empty, malformed, boundary and security-sensitive cases; no regressions in catalog, JSON, media or date/time.
