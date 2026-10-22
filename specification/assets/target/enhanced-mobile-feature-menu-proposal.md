# Enhanced Mobile Features Menu — Design Evidence Manifest

- **Asset:** enhanced-mobile-feature-menu-proposal.svg
- **Status:** Proposal; not approved and not pixel-perfect.
- **Purpose:** Show the mobile search threshold and representative interaction states before production implementation.
- **Shared contract:** ../../components/shared-editor-shell.md#31-mobile-features-menu-search-contract
- **Baseline evidence:** Source-derived inventory and behavior notes are in ../../product/current-state.md and ../../product/feature-contract-reconciliation.md.
- **SVG canvas:** 1600 × 1080; schematic device frames are labeled in the asset.

## Authored target states represented

| State | Representative viewport | Expected behavior |
|---|---|---|
| Exactly 8 features | Mobile, 390 × 640 | No search input; all eight entries remain visible |
| Exactly 9 features | Mobile, 390 × 640 | Search input appears before the first group |
| Matching results | Mobile, 390 × 640 | Matching features remain in source order and original groups |
| No matching results | Mobile, 390 × 640 | Search remains visible; localized empty-result message replaces the feature rows |
| RTL | Mobile, 390 × 640 | Logical start alignment and RTL text/input direction |
| Tablet | 768 × 1024 | No search input; existing menu behavior unchanged |
| Desktop | 1440 × 900 | No new search input; existing desktop grouped menus unchanged |

This is authored design evidence, not a browser screenshot. The CI-generated screenshot/verification manifest must be used for runtime claims and must identify the exact evaluated commit. The threshold examples are schematic and must not be reported as browser-verified 8/9 feature fixtures.

## Generated browser verification reference

The authored SVG above remains a **Proposal**. Separately, [CI run 39786715494](https://github.com/mrcode-tech/gaget.dev/actions/runs/39786715494) passed on implementation commit 38dccd3faa19bf7cea1278ad0df98c96e97f3fb8. Download artifact ci-evidence-38dccd3faa19bf7cea1278ad0df98c96e97f3fb8 from that run to inspect artifacts/ci-logs/verification-manifest.json and the generated browser screenshots. The manifest indexes 246 screenshots, including explicit 8-feature/no-search, 9-feature/search-visible, matching, no-match, and tablet/no-search states. Its metadata is commit-specific; consult the latest branch run for any later commit rather than reusing this artifact as current-head evidence.