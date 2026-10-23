# Design System & Token Contract

**Status:** Canonical design-system specification
**Implementation source:** `app/globals.css`, Tailwind configuration, `components/ui/*`, and component usage in the current source.
**Policy:** Document current reality separately from future recommendations. Token examples below name semantic roles; they do not authorize unreviewed brand changes.

## 1. Current implementation

GaGet.dev uses Tailwind CSS, CSS custom properties in HSL channel form, and shadcn/ui-style primitives. The current light-theme variables in `app/globals.css` include `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`, `--destructive`, `--destructive-foreground`, `--border`, `--input`, `--ring`, and `--radius`. The `.dark` class overrides the same theme roles.

Existing component classes include `.surface`, `.tool-textarea`, and `.eyebrow`. Buttons, cards, inputs, selects, textareas, and scroll areas are shared primitives under `components/ui/`. Current classes also use Tailwind utility values directly, so tokenization is **partial**, not complete. Do not claim that every spacing, typography, motion, sizing, or component-state value is tokenized.

## 2. Vocabulary and layers

Use four conceptual layers. Avoid treating `Root`, `Software Identity`, `PRSES`, `Anatomy`, `Typeface`, `TypeLineheight`, and `TypeWeight` as competing peer systems: some are semantic categories, some are token layers, and some are token families.

1. **Foundation / primitive:** context-free values such as neutral/blue ramps, spacing scale, radii, and durations. Components must not depend on a raw palette index.
2. **Semantic / product identity:** roles such as `background`, `foreground`, `surface`, `text-muted`, `action-primary`, `border`, `focus-ring`, `danger`, `success`. These describe intent and can be mapped differently by theme.
3. **Component token (optional layer):** a semantic role specialized only when a component genuinely needs a distinct value, e.g. `button.primary.background.hover`. Do not create aliases that add no meaning.
4. **Component implementation:** consume semantic variables or approved component tokens through shared primitives and documented variants.

The previous proposal used `PRSES` for Tone/Outline/Solid component presentation. The acronym is not established by the current code and should not be treated as an industry-standard term. Use **component variant tokens** instead unless the team explicitly defines and adopts the acronym.

## 3. Current-to-target mapping

| Current source | Role | Governance |
|---|---|---|
| `--background` / `--foreground` | Page surface and default text | Semantic; theme-aware |
| `--card` / `--card-foreground` | Raised content surfaces | Semantic; theme-aware |
| `--popover` / `--popover-foreground` | Menus, popovers, overlays | Semantic; theme-aware |
| `--primary` / `--primary-foreground` | Primary action emphasis | Semantic; theme-aware |
| `--secondary`, `--muted`, `--accent` families | Secondary surfaces, quiet content, interaction emphasis | Semantic; check each state in both themes |
| `--destructive` family | Error/destructive actions | Semantic; never communicate by color alone |
| `--border`, `--input`, `--ring` | Boundaries, form controls, focus | Semantic; test contrast and visible keyboard focus |
| `--radius` | Shared default corner radius | Foundation-like scale entry currently exposed as a single CSS variable; expand only with real use cases |
| Tailwind utilities | Spacing, type scale, layout, dimensions, transition | Mixed implementation; introduce tokens incrementally when a value is repeated or needs governance |

The CSS stores HSL channels, so use them consistently in Tailwind/CSS rather than mixing incompatible HEX and HSL syntax in one variable contract.

## 4. Token naming

- Name by **role**, not by appearance or raw value: `color.action.primary`, not `blue-button`.
- Foundation examples: `color.blue.600`, `space.4`, `radius.2`, `duration.fast`.
- Semantic examples: `color.surface.canvas`, `color.text.default`, `color.text.muted`, `color.border.default`, `color.action.primary`, `color.focus.ring`, `color.status.danger`.
- Component examples only where required: `component.button.solid.background.default`, `component.button.solid.background.hover`, `component.button.outline.border.default`.
- CSS variable names should remain idiomatic to this repository (e.g. `--background`, `--primary`) unless an explicit migration is approved. Documentation aliases do not imply that new variables already exist.
- Typography should distinguish font family, size, line height, and weight. Do not introduce a Typeface/TypeLineheight/TypeWeight taxonomy as parallel implementations; document them as typography token families.

## 5. Component contract

Shared primitives must define behavior and anatomy as well as appearance.

For each shared component document:
- Purpose and when not to use it.
- Supported variants and sizes as actually implemented.
- Anatomy and content hierarchy.
- Default, hover, active, focus-visible, disabled, loading, invalid, selected, and expanded states where applicable.
- Keyboard and touch behavior, accessible name/role, and focus management.
- Responsive constraints and overflow behavior.
- Token dependencies and theme behavior.
- Test evidence and known gaps.

Do not invent `tone`, `outline`, and `solid` variants for all components. Preserve the existing component API and `class-variance-authority` variants where present; map only actual variants to tokens.

## 6. Required design coverage

### Color and themes
- Page, surface, overlay, text, muted text, border, input, focus, primary, secondary, accent, destructive, success/status.
- Light and dark theme values with contrast review.
- State must not rely on color alone.

### Typography
- Family and script fallback coverage for Latin, Persian and Arabic; line height and wrapping must remain readable.
- Semantic roles: display, page heading, section heading, component title, body, supporting text, label, helper/error text, code/data.
- Prefer existing Tailwind scales until a repeated scale and migration are approved.

### Layout and anatomy
- Spacing, content max width, gutters, control heights, icon size, radius, border width, overlay, z-index, focus ring, and motion.
- Keep shell dimensions already relied upon by implementation (e.g. 68px header and 248px/64px desktop sidebar) documented as layout contracts, not universal tokens for every component.
- Viewport-relative panel bounds and internal scrolling are behavior contracts as well as sizing decisions.

### State and accessibility
- Focus-visible rings, disabled semantics, readable error/status text, minimum practical touch targets (generally 40–44 CSS px for primary touch controls), keyboard operation, reduced motion, and contrast.
- Verify in both themes, all supported directions, and representative zoom/viewport combinations.

## 7. Governance and migration

1. Audit current usage before adding a token.
2. Define the semantic purpose, theme mapping, and consumers.
3. Add or adjust the token at the lowest meaningful layer; do not duplicate values in unrelated components.
4. Migrate one coherent component family at a time.
5. Run tests, lint, typecheck, build, and visual verification appropriate to the change.
6. Search for raw values and duplicate aliases; exceptions must be justified.
7. Update this contract when implementation changes. Never document a future token as present until it exists in source.

## 8. Token acceptance checklist

- [ ] Each token has a stable semantic name and a single owner.
- [ ] Theme mappings exist for light and dark modes where relevant.
- [ ] Components consume semantic roles rather than primitive palette values.
- [ ] Variants/states match the actual component API.
- [ ] Contrast, visible focus and non-color status cues are reviewed.
- [ ] Typography and RTL script fallbacks are checked.
- [ ] No duplicate aliases or unexplained one-off values were introduced.
- [ ] Automated and browser verification is reported honestly.
