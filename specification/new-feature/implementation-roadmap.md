# Developer Tools Expansion — Implementation Roadmap

**Status:** Active implementation. Seven formerly planned standalone tools, consolidated data/inspection workbenches, a bounded sample-data generator and a constrained workflow pipeline have browser-local implementations with operation tests and direct-route coverage. Phases 0–7 remain in progress or partial until the latest exact-revision CI evidence and remaining scoped gaps are resolved; use the operation-level inventory as the remaining-work source of truth.

## 1. Scope and baseline
Primary source: [developer-tools capability proposal](../product/developer-tools-capability-proposal.md). Inspected sources include lib/tools/registry.ts, product inventory, tool catalog/workspace architecture, component inventory, design-token contract, quality/accessibility contract, AI instructions and command.md.

The registry has 14 relevant standalone entries. Encoding & Decoding consolidates URL and Base64 operations while preserving `/encoding/base64` as a compatibility redirect; JWT and UUID remain standalone. Hash, Regex, XML, SQL, CSV ↔ JSON, HTML and cURL now have implemented subsets. Do not expand their claims beyond the acceptance limits documented in the feature inventory. JSON Workspace is excluded from this initiative's implementation scope. Photo/Image, Audio, Video and Date & Time remain independent and excluded.

The initial planning pass did not run the app or CI. A later implementation run now verifies the seven new routes and operation helpers; re-check exact-revision CI artifacts for each subsequent change.

## 2. Priorities
- **P0 — prerequisite/safety:** source and route truth, operation contracts, reusable UI, privacy/security and tests.
- **P1 — high value:** URL/Base64 compatibility, seven planned tools, common text/data/binary transformations.
- **P2 — extended:** compression, network parsing, certificate/file inspection, extra generators and formats.
- **P3 — conditional/deferred:** ASN.1/TLV, archive extraction, advanced cryptography, JWT signature verification and workflow/batch engine.

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
**Exit:** reusable patterns have documented APIs/states; no duplicate primitives; responsive/theme/RTL behavior specified. File-input decision follows source audit.

### Phase 2 — Registry, routes and encoding compatibility (P1)
**Scope:** Improve encoding operation model while preserving URL/Base64 canonical routes and prepare registry integration.  
**Tests:** known-answer, round-trip, malformed, Unicode/bytes, direct routes, aliases, catalog and planned-state regressions.  
**Exit:** stable IDs/routes, explicit text/byte semantics, tested errors and no broken bookmarks.

### Phase 3 — Planned foundational tools and common transformations (P1)
**Scope:** Regex, Hash, XML, SQL, CSV ↔ JSON, HTML and cURL; common text transforms, data parsing, numeric conversion and core compression only after contracts are approved.  
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
**Prerequisite:** stable typed operation contracts, errors and resource limits across multiple real tools. A constrained MVP is implemented for pure text/encoding/JSON/query operations, now including typed Base64url, Base32, Bitcoin Base58 and HTML-entity encode/decode and explicit UTF-16LE/BE and Windows-1252 charset conversions round-trips.  
**Scope:** typed chains, reorder/configure, bounded intermediate previews, sequential line batch processing, cooperative cancellation between steps/records, and versioned recipe import/export are implemented for a fixed allowlist. Persistence, parallel batches, worker isolation for individual operations, binary-file steps and arbitrary custom code remain deferred.  
**Tests:** type compatibility, cancellation, bounded concurrency/memory, recipe validation, malicious input and secret redaction.  
**Exit:** MVP enforces an operation allowlist, blocks incompatible steps, caps recipes/steps/input/output/batch size, and exports recipes without source data or secrets. Full phase remains partial until worker isolation review, broader typed file operations, and additional adversarial UI tests are complete.

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
| 0 — Audit | In progress; route and operation subset reconciled | Remaining proposal families, localization and edge-case coverage |
| 1 — Contracts/shared design | In progress; shared text workbench contract synchronized | Responsive, RTL, keyboard and active error-state review |
| 2 — Registry/encoding | Partial; unified text workbench implements URL/Base64/Base64url/Base32/hex/binary/basic HTML entities/Unicode escapes/quoted-printable, charset conversion and Bitcoin Base58; Base64 route redirects compatibly; bounded file-byte encode/decode/download supported for Base64/Base64url/hex/binary/Base58/ASCII85 | Charset conversion (UTF-8, UTF-16LE/BE, Windows-1252 via hex bytes and local file decoding) and Bitcoin Base58 are implemented; file-byte encoding/download is implemented for Base64/Base64url/Base32/hex/binary/Base58/ASCII85/quoted-printable with a 2 MB input and 1,000,000-character output limit; URL, HTML entity and Unicode-escape modes remain text-only |
| 3 — Planned tools | Partial; standalone text/regex, XML/SQL/HTML/CSV/cURL, sample generator, data/binary/math and network/file workbenches are implemented with operation tests; URL component/query/key-value conversion, BigInt math, numeric views, byte-range inspection, file comparison, signed/unsigned bitwise AND/OR/XOR/NOT, character-frequency analysis and gzip/zlib support are available | Full XML grammar/schema validation, YAML/SQL parsers, archive support and expanded regression/visual evidence remain |
| 4 — Security/inspection | Partial; SHA-2/HMAC/CRC32/CRC-16/Adler-32 over text and local file bytes plus offline IP/CIDR/MAC, HTTP-header/cookie/DNS parsing, redacted HTTP message inspection and local byte-range/string/entropy plus selected image/audio/PDF/ZIP/ID3 metadata inspection implemented | Full X.509 field/key parsing, signature/trust validation, broader metadata formats and deeper security review remain; PEM/DER container/fingerprint subset implemented |
| 5 — Extended/conditional | Partial; gzip/zlib wrapper support, Bitcoin Base58 and Adobe ASCII85, charset conversion and bounded synthetic sample-data generators implemented; YAML, archive, ASN.1/TLV, certificate parsing and advanced crypto remain conditional | Decide additional encodings/formats only after dependency/license and safety review; no archive extraction or unsupported crypto is exposed |
| 6 — Workflow/batch | Partial; `/workflow/pipeline` supports typed allowlisted text/encoding/JSON/query chains, reordering, bounded previews, sequential line batches and versioned recipe import/export | Worker/cancellation review, binary/file steps, additional adversarial recipe tests and any persistence decision remain deferred |
| 7 — Quality | Continuous | Exact-revision test and visual evidence |

## 6. Definition of done
All scoped capabilities are implemented or explicitly deferred by documented decision; every available operation has working behavior and tests; registry/routes/localization agree; planned entries remain non-launchable until verified; shared components/tokens are reused; responsive, short-height, RTL, theme, keyboard and accessibility states are checked; privacy/security/resource limits match behavior; applicable tests, lint, typecheck, build and E2E pass on the exact revision; CI artifacts are inspected where required; existing workspaces do not regress; documentation is synchronized.

See [feature inventory](./feature-inventory.md) for operation-level traceability.
