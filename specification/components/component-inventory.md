# Shared Component Inventory

**Status:** Initial source inventory; visual anatomy and state contracts remain to be verified against browser captures.

| Area | Source | Responsibility | Audit notes |
|---|---|---|---|
| Application shell | `components/app-shell.tsx` | Coordinates sidebar, header and page/editor shell sizing | Route-aware behavior; different scroll and header handling for editors. |
| Header | `components/app-header.tsx` | Brand/search, theme, locale and navigation controls | Search suggestions and editor-specific visibility require browser verification. |
| Sidebar | `components/app-sidebar.tsx` | Main navigation, category links, collapse state and mobile drawer | Widths currently 248px expanded and 64px collapsed; RTL-aware placement. |
| Tool layout | `components/tool-layout.tsx` | Shared breadcrumb, title, description and privacy disclosure | Verify spacing and content width on standalone tools. |
| Tool card | `components/tool-card.tsx` | Reusable tool discovery card | Inventory current variants before adding more. |
| Catalog | `components/tool-catalog.tsx` | Registry-backed searchable tool list | Planned vs available state must reflect route/capability evidence. |
| Button | `components/ui/button.tsx` | Shared action control variants | Use existing variants before adding one-off styles. |
| Card | `components/ui/card.tsx` | Shared surface/content primitives | Avoid redundant nested card surfaces. |
| Input | `components/ui/input.tsx` | Shared text input | Check labels, focus, invalid and disabled states. |
| Select | `components/ui/select.tsx` | Shared select control | Verify keyboard and popover viewport behavior. |
| Textarea | `components/ui/textarea.tsx` | Shared multiline input | Current CSS also defines `.tool-textarea`. |
| Scroll area | `components/ui/scroll-area.tsx` | Scrollbar/scroll-area primitive | Do not use it without clear scroll ownership. |
| Shared editor shell contract | `specification/components/shared-editor-shell.md`; consumers in Photo/Audio/Video/Date & Time workbenches | Cross-workspace command bar, panel, responsive, scroll, theme/direction and accessibility rules | Proposal contract; CI checks Date & Time single-row mobile navigation, functional drawer open/close, menu bounds and responsive menu/panel states. The CI artifact manifest records the full evaluated commit SHA and links screenshot paths; proposal approval and broader loaded/error/drag-over, scrolling/resizing, keyboard/zoom/orientation coverage remain outstanding. |
| Resizable feature sheet | `components/use-resizable-feature-sheet.ts` | Shared sizing behavior for feature panels/sheets | Pointer and keyboard resize exist; browser-level viewport, cancellation and consumer parity checks remain. |
| Image workbench | `components/image-workbench.tsx`, `components/photo-editor.tsx` | Image feature routing and photo editing | Large specialized surface; split only after behavior boundaries and consumers are documented. |
| Audio workbench | `components/audio-workbench.tsx` | Audio editor features and command/panel behavior | Specialized browser audio/export behavior. |
| Video workbench | `components/video-workbench.tsx` | Video editor features and command/panel behavior | Browser codec and recording limits must remain visible. |
| Date/time workbench | `components/datetime-editor.tsx`, `components/datetime-workbench.tsx` | Date/time feature selection and tools | Locale, calendar and timezone edge cases require feature-specific contracts. |
| Date/time fields | `components/date-time-fields.tsx` | Shared date/time inputs | Verify calendar style, keyboard operation and invalid-value behavior. |
| Theme/locale | `components/theme-provider.tsx`, `components/theme-toggle.tsx`, `components/i18n-provider.tsx`, `components/language-switcher.tsx` | Theme and locale state | Check contrast, RTL and long translated labels. |

## Component contract policy

Before adding a shared variant or extracting a new primitive, inspect all consumers and tests. Document anatomy, variants, state behavior, responsive constraints, accessibility semantics, and token dependencies in a dedicated component specification under this directory only when the contract is reused or non-trivial. Feature pages should link to shared contracts rather than duplicate them.

A component's existence does not imply that all its states or consumers have been visually verified. Update this inventory when responsibilities or ownership change.
