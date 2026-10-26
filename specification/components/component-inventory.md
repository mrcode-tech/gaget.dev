# Shared Component Inventory

**Status:** Initial source inventory; visual anatomy and state contracts remain to be verified against browser captures.

| Area | Source | Responsibility | Audit notes |
|---|---|---|---|
| Application shell | `components/app-shell.tsx` | Coordinates sidebar, header and page/editor shell sizing | Route-aware behavior; different scroll and header handling for editors. |
| Header | `components/app-header.tsx` | Brand/search, theme, locale and navigation controls | Search suggestions and editor-specific visibility require browser verification. |
| Sidebar | `components/app-sidebar.tsx` | Main navigation, workspace order, Dev Tools entry, collapse state and mobile drawer | Widths currently 248px expanded and 64px collapsed; RTL-aware placement. Photo, Audio, Video and Date & Time are followed immediately by Dev Tools. |
| Tool layout | `components/tool-layout.tsx` | Shared breadcrumb, title, description and privacy disclosure | Standalone page content is bounded to 1600px and uses 12px/24px/32px responsive horizontal gutters; workspace command bars opt out of outer ToolLayout gutters. |
| Tool card | `components/tool-card.tsx` | Reusable tool discovery card | Inventory current variants before adding more. |
| Catalog | `components/tool-catalog.tsx` | Registry-backed, category-grouped Dev Tools catalog and search | Uses `developerTools` and non-empty `developerToolCategories`; excludes Photo, Audio, Video and Date & Time workspaces. Planned vs available state must reflect route/capability evidence. |
| Button | `components/ui/button.tsx` | Shared action control variants | Use existing variants before adding one-off styles. |
| Card | `components/ui/card.tsx` | Shared surface/content primitives | Avoid redundant nested card surfaces. |
| Input | `components/ui/input.tsx` | Shared text input | Check labels, focus, invalid and disabled states. |
| Select | `components/ui/select.tsx` | Shared select control | Verify keyboard and popover viewport behavior. |
| Textarea | `components/ui/textarea.tsx` | Shared multiline input with native textarea attributes | JSON line-numbered editing reuses this primitive; its prop contract uses `TextareaHTMLAttributes`. Current CSS also defines `.tool-textarea`. |
| Scroll area | `components/ui/scroll-area.tsx` | Scrollbar/scroll-area primitive | Do not use it without clear scroll ownership. |
| Shared editor shell contract | `specification/components/shared-editor-shell.md`; consumers in Photo/Audio/Video/Date & Time workbenches | Cross-workspace command bar, panel, responsive, scroll, theme/direction and accessibility rules | Proposal contract; CI checks Date & Time single-row mobile navigation, functional drawer open/close, menu bounds and responsive menu/panel states. The CI artifact manifest records the full evaluated commit SHA and links screenshot paths; proposal approval and broader loaded/error/drag-over, scrolling/resizing, keyboard/zoom/orientation coverage remain outstanding. |
| Resizable feature sheet | `components/use-resizable-feature-sheet.ts` | Shared sizing behavior for feature panels/sheets | Pointer and keyboard resize exist; browser-level viewport, cancellation and consumer parity checks remain. |
| Image workbench | `components/image-workbench.tsx`, `components/photo-editor.tsx` | Image feature routing and photo editing | Large specialized surface; split only after behavior boundaries and consumers are documented. |
| Audio workbench | `components/audio-workbench.tsx` | Audio editor features and command/panel behavior | Specialized browser audio/export behavior. |
| Video workbench | `components/video-workbench.tsx` | Video editor features and command/panel behavior | Browser codec and recording limits must remain visible. |
| Date/time workbench | `components/datetime-editor.tsx`, `components/datetime-workbench.tsx` | Date/time feature selection and tools | Locale, calendar and timezone edge cases require feature-specific contracts. |
| JSON workspace | `components/json-workbench.tsx`, `lib/tools/json-workspace.ts` | Line-numbered source, strict diagnostics, File/Features menus, format/minify/validate/compare, sorting, tree, find and string transforms | Uses a full-width compact command bar and a body that follows shared responsive gutters without a second centered page wrapper; File actions aggregate into Features below 768 CSS px and remain in a standalone File menu at tablet/desktop widths. Verify diagnostics, menu focus, RTL source direction and responsive states against its JSON feature contract. |
| Date/time fields | `components/date-time-fields.tsx`, `lib/date-time/calendar.ts` | Shared date/time inputs and calendar-native formatting | Day cells are formatted directly with the selected Intl calendar; ISO/Gregorian values remain stable internal identifiers. Verify all supported calendar systems, keyboard operation and unsupported combinations. |
| Theme/locale | `components/theme-provider.tsx`, `components/theme-toggle.tsx`, `components/i18n-provider.tsx`, `components/language-switcher.tsx` | Theme and locale state | Check contrast, RTL and long translated labels. |

## Enhanced mobile Features-menu search

The reusable behavior contract lives in [Shared Editor Shell Contract](./shared-editor-shell.md#31-mobile-features-menu-search-contract). The authored design reference is [enhanced-mobile-feature-menu-proposal.svg](../assets/target/enhanced-mobile-feature-menu-proposal.svg), currently a Proposal. Search is specified for mobile widths below 768px when the current editor menu contains more than eight selectable feature entries. Check the latest matching CI artifact for runtime evidence.

## Component contract policy

Before adding a shared variant or extracting a new primitive, inspect all consumers and tests. Document anatomy, variants, state behavior, responsive constraints, accessibility semantics, and token dependencies in a dedicated component specification under this directory only when the contract is reused or non-trivial. Feature pages should link to shared contracts rather than duplicate them.

A component's existence does not imply that all its states or consumers have been visually verified. Update this inventory when responsibilities or ownership change.

| Date & Time select field | `components/ui/native-select.tsx` | Consistent native select trigger surface and logical chevron inset | Shared by workspace settings and feature controls; verify LTR/RTL, themes, focus and long values. |


## Developer-tools expansion
- `components/developer-tool-workbench.tsx` composes existing Button, Input, Textarea and Card primitives for the seven standalone developer-tool routes. Its operation contract and current layout are documented in `specification/new-feature/shared-components/developer-tool-workbench.md` and `specification/new-feature/wireframes/developer-tool-workbench.md`.
