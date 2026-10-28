# Developer Tools Expansion — Implementation Roadmap

**Status:** Phases 0–5 are complete for their approved, bounded subsets. Phase 6 has a tested text/encoding pipeline plus byte-preserving raw-hex workflows and local file input up to 100 KB; broader binary operations and persistence remain incomplete. Broader parser/crypto/archive capabilities remain conditional. Wireframe approval remains a separate design sign-off. Phase 7 is evidence-gated and must be updated only from the latest exact-revision CI manifest.

## 1. Scope and baseline
Primary source: [developer-tools capability proposal](../product/developer-tools-capability-proposal.md). Inspected sources include lib/tools/registry.ts, product inventory, tool catalog/workspace architecture, component inventory, design-token contract, quality/accessibility contract, AI instructions and command.md.

The registry has 14 relevant standalone entries. Encoding & Decoding consolidates URL and Base64 operations while preserving `/encoding/base64` as a compatibility redirect; JWT and UUID remain standalone. Hash, Regex, XML, SQL, CSV ↔ JSON, HTML and cURL now have implemented subsets. Do not expand their claims beyond the acceptance limits documented in the feature inventory. JSON Workspace is excluded from this initiative's implementation scope. Photo/Image, Audio, Video and Date & Time remain independent and excluded.

The initial planning pass did not run the app or CI. A later implementation run now verifies the seven new routes and operation helpers; re-check exact-revision CI artifacts for each subsequent change.

## 2. Priorities
- **P0 — prerequisite/safety:** source and route truth, operation contracts, reusable UI, privacy/security and tests.
- **P1 — high value:** URL/Base64 compatibility, seven planned tools, common text/data/binary transformations.
- **P2 — extended:** compression, network parsing, certificate/file inspection, extra generators and formats.
- **P3 — conditional/deferred:** ASN.1/TLV, archive extraction, advanced cryptography, JWT signature verification, broader binary workflow operations and recipe persistence.

Prioritize user value, correctness, reuse, feasibility, maintenance and risk, not raw operation count.

## 3. Phases

### Phase 0 — Baseline audit and reconciliation (P0)
**Scope:** Verify every registry entry, route, operation, test, localization key and component; reconcile proposal with source.  
**Read:** feature inventory, architecture, proposal, product inventory, tool catalog architecture, component inventory and AI instructions.  
**Areas:** lib/tools/registry.ts, app/(tools)/, relevant components, tests and translations. Inspect each before editing.  
**Tests:** registry uniqueness/status, direct route smoke tests, planned-state and catalog tests.  
**Exit:** every proposal capability and planned tool has a stable ID, spec, phase and criteria; status is evidence-based; overlaps/blockers are recorded. Do not implement while baseline contradictions remain unresolved.

### Phase 1 — Operation contracts and shared design (P0)
**Scope:** Define input/output/error/resource contracts; audit existing components; decide whether new reusable patterns are necessary.  
**Read:** design-system-and-reuse.md, shared-components/, wireframes/, design-token and quality/accessibility foundations.  
**Tests:** labels, focus, disabled/error states, keyboard behavior, file lifecycle and accessibility where relevant.  
**Exit:** reusable patterns have documented APIs/states; no duplicate primitives; responsive/theme/RTL behavior specified. Source audit found no generic reusable file-input/dropzone component; optional file selection uses the existing shadcn-style Input, while file-only media workspaces retain their workspace-specific dropzones.

### Phase 2 — Registry, routes and encoding compatibility (P1)
**Scope:** Improve encoding operation model while preserving URL/Base64 canonical routes and prepare registry integration.  
**Tests:** known-answer, round-trip, malformed, Unicode/bytes, direct routes, aliases, catalog and planned-state regressions.  
**Exit:** stable IDs/routes, explicit text/byte semantics, tested errors and no broken bookmarks.

### Phase 3 — Planned foundational tools and common transformations (P1)
**Scope:** Regex, Hash, XML, SQL, CSV ↔ JSON, HTML and cURL; common text transforms, data parsing, numeric conversion and core compression only after contracts are approved. Regex execution is isolated in a worker with a bounded timeout.  
**Read:** planned-tools.md and relevant category specs.  
**Tests:** fixtures, malformed/boundary input, security/resource limits, copy/download, responsive/accessibility and route status.  
**Exit:** each accepted tool works beyond a shell; supported syntax is explicit; unsupported cases visible; tests pass; registry status changes only after verification.

### Phase 4 — Security, token, network, certificate and file inspection (P1/P2)
**Scope:** Digests/HMAC/checksums and approved crypto; JWT inspection and optional signature verification; offline network parsing; certificate/key parsing; file analysis.  
**Tests:** crypto vectors, invalid keys/tags, adversarial parser fixtures, resource limits, secret non-persistence and distinction between decode/verify/trust.  
**Exit:** security review complete, unsupported algorithms absent, claims match behavior. Unresolved primitive/trust/dependency questions block only dependent operations.

### Phase 5 — Extended formats, generators and conditional operations (P2/P3)
**Scope:** Bitcoin Base58 and a synthetic sample-data generator for strings, bounded integers, timestamps, UUID batches and JSON records are implemented. YAML, ASN.1/TLV, archives and other parser/crypto extensions remain conditional on dependency, license, maintenance and safety review.  
**Tests:** format vectors, malformed data, dependency license/maintenance review, resource limits and regression.  
**Exit:** implemented generator and Base58 operations have unit tests and explicit limits. Conditional formats stay non-launchable until a maintained parser/primitive and adversarial test plan are approved.

### Phase 6 — Workflow and batch engine (P3)
**Prerequisite:** stable typed operation contracts, errors and resource limits across multiple real tools. A constrained MVP is implemented for pure text/encoding/JSON/query operations, now including typed Base64url, Base32, Bitcoin Base58, Adobe ASCII85, ZeroMQ Z85 and HTML-entity encode/decode and explicit UTF-16LE/BE and Windows-1252 charset conversions round-trips.  
**Scope:** typed chains, reorder/configure, bounded intermediate previews, sequential line batch processing and versioned recipe import/export are implemented for a fixed allowlist. Selected raw-byte conversions use a raw-hex transport and support a local file up to 100 KB; invalid UTF-8 remains byte-preserving until explicit text decoding. Workflow runs execute in a dedicated worker with a 15-second deadline; cancellation terminates the worker and discards partial results. Broader binary-file steps, persistence, parallel batches and arbitrary custom code remain deferred.  
**Tests:** type compatibility, cancellation, bounded concurrency/memory, recipe validation, malicious input and secret redaction.  
**Exit:** MVP enforces an operation allowlist, blocks incompatible steps, caps recipes/steps/input/output/batch size, and exports recipes without source data or secrets. The byte-oriented subset and local-file path now have unit/component coverage; full phase remains partial until broader typed file operations, additional timeout/cancellation UI regressions, and broader adversarial recipe tests are complete.

### Phase 7 — Cross-tool quality and release gates (P0, continuous)
Run throughout every phase. Applicable package scripts include npm run test:unit, npm run test:component, npm run test:e2e, npm run lint, npm run typecheck and npm run build. Inspect CI workflow and required jobs before claiming verification. Never claim unrun checks passed.

**Exit:** exact-revision tests/build pass; desktop/tablet/mobile/short-height/RTL/theme states inspected; screenshot manifests match tested commit; existing JSON/media/date-time workspaces show no regression.

## 4. Dependencies

    Phase 0 audit → Phase 1 contracts and component audit
    Phase 1 → Phase 2 encoding and registry compatibility
    Phase 2 → Phase 3 planned tools/common transformations
    Phase 1 + Phase 3 → Phase 4 security/inspection
    Phase 3 → Phase 5 conditional formats/generators
    Stable contracts across Phases 3 and 4 → Phase 6 workflow engine
    Phase 7 quality gates apply continuously to all phases

## 5. Repeated execution protocol
At each future invocation:
1. Read this roadmap, package README, inventory and current Git status/diff.
2. Classify phases as Not started, In progress, Blocked or Complete from code/test evidence.
3. Choose the earliest eligible incomplete phase respecting dependencies.
4. Read every linked spec/wireframe/component contract for that phase.
5. Implement only that phase or a small cohesive milestone.
6. Run applicable tests and report exact results.
7. Update this roadmap with evidence, remaining gaps and next eligible phase.
8. Stop for consequential security/product decisions; continue independent safe work.

| Phase | Baseline status | Evidence required |
|---|---|---|
| 0 — Audit | Complete for the current registry and all 13 mapped proposal workspace families; deferred gaps are tracked in the inventory | Reopen only when scope changes or a new proposal family is added |
| 1 — Contracts/shared design | Shared implementation contracts and component reuse are applied; wireframe artifacts remain proposals pending explicit design sign-off | Future visual/interaction changes require the continuous Phase 7 evidence gate; do not infer wireframe approval from implementation authorization |
| 2 — Registry/encoding | Complete for the approved encoding subset; the unified text workbench implements URL/Base64/Base64url/Base32/hex/binary/basic HTML entities/Unicode escapes/quoted-printable, charset conversion, Base58, ASCII85 and Z85; Base64 route redirects compatibly; bounded file-byte encode/decode/download is supported for the listed byte modes | Charset conversion (UTF-8, UTF-16LE/BE, Windows-1252 via hex bytes and local file decoding) and Bitcoin Base58 and ZeroMQ Z85 are implemented; file-byte encoding/download is implemented for Base64/Base64url/Base32/hex/binary/Base58/ASCII85/Z85/quoted-printable with a 2 MB input and 1,000,000-character output limit; URL, HTML entity and Unicode-escape modes accept selected files as strict UTF-8 text; raw-byte processing remains limited to byte-oriented modes |
| 3 — Planned tools | Complete for the approved subsets: standalone text/regex, XML/SQL/HTML/CSV/cURL, sample generator, data/binary/math and network/file workbenches; query/key-value conversion, BigInt math, numeric views, byte-range inspection, file comparison, bitwise operations, character frequency and gzip/zlib are available | Full XML grammar/schema validation, full HTML/SQL parsers, YAML parsing and archive support are explicitly deferred pending parser/dependency review and adversarial fixtures; supported subsets remain clearly labeled |
| 4 — Security/inspection | Complete for the approved subset: SHA-2/HMAC/checksums over text and local file bytes; JWT exp/iat/nbf NumericDate interpretation; offline network parsers; redacted HTTP message inspection; selected file metadata; PEM/DER fingerprints; OpenSSH RSA/Ed25519/ECDSA public-key metadata/fingerprints | Full X.509 fields, SSH certificates, signature/trust validation, SHA-3/legacy digests and additional metadata formats remain explicitly deferred; decoding and fingerprinting are not verification |
| 5 — Extended/conditional | Complete for the approved formats: gzip/zlib wrappers, Base58/ASCII85/Z85, charset conversion, selected metadata parsers and bounded synthetic sample-data generation | YAML, ASN.1/TLV, archive extraction and advanced crypto are explicitly deferred pending dependency/license and safety review; no archive extraction or unsupported crypto is exposed |
| 6 — Workflow/batch | In progress: typed allowlisted text/encoding/JSON/query chains plus byte-preserving raw-hex conversions and local files up to 100 KB; reorderable steps, bounded previews, sequential line batches, versioned recipes, 15-second worker deadline and termination cancellation | Broader binary/file operations, persistence, parallel batches and arbitrary custom code remain deferred; exact-revision worker, file-input, timeout/cancellation and adversarial-recipe tests gate further expansion |
| 7 — Quality | Continuous | Exact-revision test and visual evidence |

## 6. Conditional scope decisions

The following proposal items are deliberately **not exposed as available tools** until their prerequisites are approved. These are explicit safety/maintenance deferrals, not claims that the proposed capability is implemented.

- **YAML parsing/formatting:** defer until a maintained parser is selected and its license, security history, scalar typing, aliases/anchors, depth limits and multi-document policy are reviewed. Do not implement a home-grown partial parser and label it YAML-compatible.
- **ASN.1/TLV and full X.509 fields/public-key parsing:** defer until a maintained parser and bounded-depth/length policy are approved. The existing PEM/DER container inspection and SHA-256 fingerprint do not establish certificate validity or trust.
- **Archive listing/extraction:** defer until path traversal, symlink, entry-count, nesting, decompressed-size and archive-bomb defenses are specified and adversarial fixtures exist. No archive extraction operation is exposed.
- **Encryption/decryption, JWT signature verification, certificate chain/hostname/revocation trust, and advanced cryptography:** defer until supported algorithms, key formats, nonce/tag handling, trust inputs and independent security review are explicit. Decoding/fingerprinting must not be presented as verification.
- **Raw DEFLATE and broader binary/file workflow steps:** remain deferred until cross-browser compression support, expanded byte-oriented contracts and bounded-memory limits are tested. The current raw-hex path is a constrained byte-preserving subset, not a general binary workflow engine.
- **Full XML grammar/schema validation, full HTML parsing, dialect-complete SQL parsing and broad cURL flag/language coverage:** remain partial/deferred. Do not label heuristic formatters or the supported cURL subset as complete language parsers; expand only after syntax contracts, maintained parser/dependency review, license review and adversarial fixtures are approved.
- **Full HTML5 named-entity catalog and additional statistical modes:** remain deferred until a maintained data source and exact semantics/fixtures are selected; the current basic entity and statistics subsets are explicit.
- **SHA-3 and legacy digest families:** remain deferred until a maintained implementation is approved and known-answer vectors/security messaging are reviewed.
- **Additional file metadata formats:** implement only with format fixtures, strict input/output limits and clear distinction between metadata hints and safety verdicts.

A deferred item may be unblocked only by updating its operation contract, dependency/license review, adversarial tests, route/registry status and the matching feature inventory. Deferred items remain excluded from the available-tool count.

## 7. Definition of done
All scoped capabilities are implemented or explicitly deferred by documented decision; every available operation has working behavior and tests; registry/routes/localization agree; planned entries remain non-launchable until verified; shared components/tokens are reused; responsive, short-height, RTL, theme, keyboard and accessibility states are checked; privacy/security/resource limits match behavior; applicable tests, lint, typecheck, build and E2E pass on the exact revision; CI artifacts are inspected where required; existing workspaces do not regress; documentation is synchronized.

See [feature inventory](./feature-inventory.md) for operation-level traceability.
