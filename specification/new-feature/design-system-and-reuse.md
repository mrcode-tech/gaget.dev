# Design System and Reuse

## Current component baseline
The project uses Tailwind CSS, CSS custom properties in app/globals.css and shadcn/ui-style primitives. Semantic tokens include background, foreground, card, popover, primary, secondary, muted, accent, destructive, border, input, ring and radius. Tokenization is partial.

Confirmed shared sources: components/ui/button.tsx, card.tsx, input.tsx, select.tsx, native-select.tsx, textarea.tsx and scroll-area.tsx. Application patterns include components/tool-layout.tsx, tool-card.tsx, tool-catalog.tsx, app-shell.tsx, app-header.tsx, app-sidebar.tsx and localization/theme providers.

The initial component inventory does not confirm a generic file dropzone or operation-parameter panel. Inspect all source before concluding either is missing.

## Decision order
1. Search existing components and consumers.
2. Check whether a project primitive can be configured/composed.
3. Reuse a feature component only if it is not tightly coupled to unrelated media state.
4. Propose a new shared component only after demonstrating a gap.
5. For each new reusable component, document API, states, accessibility, responsive behavior, wireframe and tests before implementation.

## Input and file selection
- Single-line parameters use shared Input with visible label, help and error feedback.
- Multiline text uses shared Textarea or an existing editor.
- Use Select/native-select according to repository convention and mobile/keyboard behavior.
- File-only workflow: reuse the existing file-input zone if suitable. If none exists after source audit, propose a styled reusable dropzone rather than a bare-input-only UI.
- Mixed text/file workflow: retain the styled text editor as a first-class input and add styled file selection; define replacement behavior.
- Text-only workflow: do not add a file picker.
- Native input type=file may be used internally; do not expose an unstyled native control as primary UI where a project wrapper is available.

## Reuse register

| Need | Existing source | Decision |
|---|---|---|
| Text and multiline input | components/ui/input.tsx, textarea.tsx | Reuse |
| Actions and surfaces | components/ui/button.tsx, card.tsx | Reuse; avoid nested-card clutter |
| Select controls | components/ui/select.tsx, native-select.tsx | Reuse after consumer audit |
| Scroll region | components/ui/scroll-area.tsx | Only with explicit scroll ownership |
| Tool card/page frame | components/tool-card.tsx, tool-layout.tsx | Reuse |
| File dropzone | Not confirmed in initial inventory | Audit source; see proposed file-input contract |
| Settings panel | No dedicated contract confirmed | Compose primitives first |

## Visual contract
Use semantic theme tokens, existing variants, logical CSS properties and established spacing. Avoid competing shells, unnecessary gradients, nested cards, one-off colors and icon-only controls without accessible names. Match breakpoints: XS <640px, SM 640–767px, MD 768–1023px, LG 1024–1279px, XL 1280–1535px, 2XL ≥1536px. Verify short height, zoom, RTL, dark theme and long translations. Target designs remain Proposal until approved.
