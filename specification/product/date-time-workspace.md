# Date & Time Workspace and Controls

**Status:** Proposal — durable expected behavior, not an approved pixel-perfect design.
**Canonical route:** `/datetime/editor` (legacy tool routes may select a feature through a query parameter).
**Related contracts:** [Shared Editor Shell](../components/shared-editor-shell.md), [Design System & Token Contract](../foundations/design-system-token-contract.md), [Quality, Accessibility & Verification](../foundations/quality-accessibility-verification.md), [Feature Contract Reconciliation](./feature-contract-reconciliation.md).
**Target design:** [Date & Time workspace and controls proposal](../assets/target/date-time-workspace-controls-proposal.svg). This editable schematic is a proposal and must not be treated as an approved pixel-perfect reference.
**Sources/tests:** `components/datetime-editor.tsx`, `components/datetime-workbench.tsx`, `components/date-time-fields.tsx`, `components/ui/input.tsx`, `components/ui/native-select.tsx`, `components/ui/select.tsx`, `tests/datetime-editor.test.tsx`, `tests/date-time-fields.test.tsx`, `tests/e2e/shared-editor-shell.spec.ts`.

## 1. User intent and scope

Provide a single responsive workspace for exploring the current date/time, configuring locale/calendar/numbering/time-zone presentation, and selecting one of the date/time utilities. The workspace should feel like part of the same GaGet.dev editor family while preserving Date & Time's distinct live-clock centerpiece and non-file-based workflow.

This contract covers workspace introduction spacing and typography, main workspace controls, feature-panel controls, select affordance alignment, responsive/directional behavior, and calendar-system correctness. ISO/Gregorian dates remain the stable internal representation; selected calendar systems must determine visible month boundaries, day/year/month labels, month navigation, calendar-generator grids, and month/year arithmetic.

## 2. Current implementation audit

| Area | Source-derived observation | User impact | Expected change |
|---|---|---|---|
| Introduction spacing | Workspace section used `px-3 pt-2 sm:px-6`; breadcrumb used `mb-2 text-xs`; title used only `text-2xl font-semibold`; description used `mt-1 leading-relaxed`. | Vertical rhythm and heading hierarchy differed from Photo, Audio and Video. | Use shared content gutters, breadcrumb rhythm, heading scale and description rhythm. |
| Mobile alignment | Compact command bar uses `px-3 sm:px-6`, while the workspace intro had a smaller top inset and no LG content inset. | The introduction looked less aligned and more compressed below the navbar. | Align logical content edges at mobile/tablet sizes and use a consistent top gutter. |
| Main-page selects | The previous implementation had inconsistent select border/radius/padding and a duplicate in-tool Display language control. | Controls looked inconsistent, and the duplicate language control competed with the global locale. | Standardize the closed select trigger and use the global application locale; retain only the independent calendar, time-zone, and numeral preferences. |
| Feature selects | Four native selects in the Date & Time feature workbench repeated ad hoc styles and browser-default chevron placement. | Arrow inset and control shape could differ between the main workspace and feature panel. | Reuse the same styled native select wrapper for all Date & Time select triggers. |
| Text fields | Existing `Input` primitive supplies a shared bordered text-input style. | Selects did not visually align with those fields. | Retain the shared `Input`; align selects to the same semantic border, surface, radius and focus language. |

These observations are source inspections. They do not claim browser screenshot verification or target-design approval.

## 3. Workspace hierarchy and geometry

### Default workspace

1. A single editor command bar remains the mobile navigation row. The workspace content begins below it and must not introduce a second navbar.
2. The breadcrumb, title and supporting description form one compact introduction group. Their logical start edge is shared with the centerpiece and other workspace content.
3. Use responsive content padding: `p-3` below 640px, `p-6` from 640px, and `p-8` from 1024px when the content region has sufficient room.
4. Breadcrumb: muted `text-sm`, `mb-5` below the title.
5. Heading: `text-2xl font-bold tracking-tight`, scaling to `sm:text-3xl`.
6. Description: `mt-2 max-w-2xl text-sm leading-6`, scaling to `sm:text-base`.
7. The live date/time centerpiece follows the introduction with a deliberate short gap, remains bounded, and keeps the locale, calendar, time-zone and numeral settings grouped below it.
8. Keep the Gregorian reference and copy/apply actions separate from the labeled settings grid; preserve wrap behavior on narrow screens.

### Active feature

- Keep the command bar and workspace's primary date/time context in place while feature controls are open.
- Hide only the introductory description when needed by the existing active-feature layout; do not move the breadcrumb/title to a different inset.
- Desktop uses a bounded side panel when space permits. Compact widths use the existing viewport-bounded, resizable sheet and safe-area inset behavior.
- Panel controls use the same field and select family as the main workspace. Do not create a second select style just for the feature panel.
- Preserve single-owner scrolling and ensure focused controls are not hidden behind the on-screen keyboard or sheet edge.

## 4. Control anatomy and visual rules

### Text input

Use the shared `Input` primitive for searchable text and other plain text/numeric entry where suitable. Keep a visible semantic border, background, readable placeholder, consistent radius, and focus-visible ring. Labels are external and must remain programmatically associated.

### Select trigger

Use `components/ui/native-select.tsx` for Date & Time select controls. It deliberately retains the native `<select>` for browser-supported keyboard and option behavior while standardizing the closed trigger:

- 40px height, full available width, `rounded-md`, one `border-input` border and `bg-background` surface.
- Logical inline padding: `ps-3 pe-9`; the selected value must not run underneath the chevron.
- A decorative, non-interactive `ChevronDown` positioned at `end-3`, vertically centered, with `pointer-events-none` and muted foreground.
- Semantic text color and `focus-visible:ring-2 focus-visible:ring-ring` behavior; disabled state remains discernible.
- The logical inset must place the arrow on the visual right in LTR and visual left in RTL, with equivalent breathing room from the edge.
- Avoid per-field overrides for border, radius, height or horizontal padding. Do not add a border to the label row.

### Calendar/date/time inputs

Keep the custom calendar and time input components rather than native date/time inputs. A shared calendar engine must derive year, month, day, month boundaries, month length and month navigation from `Intl.DateTimeFormat.formatToParts` using the selected calendar and locale. Calendar-year lookup must not depend on fixed Gregorian offsets; locate the target year through calendar-derived date corrections and enumerate month starts from day-one boundaries. Month identities must be stable numeric/ordinal identifiers, never localized labels. Every visible day cell must be formatted directly by `Intl.DateTimeFormat` with the selected calendar, not by `Date.getDate()` or Gregorian day extraction. The locale controls language and default numerals; the calendar-system control independently controls calendar arithmetic and month/day/year identity. If a Gregorian reference is shown alongside a selected-calendar month, label it explicitly as the Gregorian equivalent. Clicking a cell emits its corresponding stable Gregorian ISO date. Month navigation must cross actual calendar-month boundaries and clamp the selected day when the destination month is shorter. Calendar-generator year/month inputs and grids use the selected calendar. Date calculator month/year units, age year/month/day components, and leap-year detection use selected-calendar arithmetic. Day/week and elapsed-day operations remain elapsed days; the week-number utility is explicitly Gregorian ISO week numbering. Time-zone conversion resolves local wall times against IANA zone rules, rejects nonexistent times in forward daylight-saving gaps, and deterministically chooses the earlier instant for ambiguous repeated times. ICS events interpret the entered date/time in the selected workspace time zone and export UTC instants. Date-only values remain canonical Gregorian ISO strings in `YYYY-MM-DD` form and are never round-tripped through UTC as if they were instants. The date-format utility reports that canonical ISO date unchanged. When a date-only value must become an instant for timestamp/JSON operations, it is resolved at noon in the selected workspace time zone and reported separately (`isoDate` versus `instantAtNoon`, Unix seconds/milliseconds, UTC). Absolute timestamps remain instants and are formatted using the selected time zone and calendar. Countdown and ICS inputs interpret wall times in the selected workspace time zone. Fixed-date sample holidays are displayed in the selected calendar. Calendars whose Intl implementation exposes named rather than numeric months (such as Hebrew) must receive stable chronological month ordinals, including leap months, for month selection and year arithmetic. Canonical ISO date parsing and day arithmetic must preserve four-digit years below 0100. Islamic calendar variants follow the browser Intl data and may differ by convention; unsupported calendar/locale combinations must be surfaced honestly.

## 5. Responsive and accessibility requirements

- Verify widths 390px, 640px, 768px, 1024px and 1440px, plus a short-height mobile viewport.
- No horizontal page overflow, clipped labels, overlapping select text/chevron, or inconsistent main/feature-panel gutters.
- Support English LTR and Persian/Arabic RTL. Use logical CSS properties; do not reverse technical values such as ISO dates, Unix timestamps or IANA time-zone identifiers unnecessarily.
- Preserve visible focus, associated labels, native select keyboard navigation, 40px select height and the existing custom date/time keyboard behavior.
- Verify light and dark themes, long translated labels, reduced motion, zoom, and narrow/landscape viewport behavior where supported by the test harness.
- Calendar/locale availability is browser-dependent; report unsupported combinations honestly.

## 6. Acceptance criteria

- [ ] Breadcrumb, title and description follow the shared editor introduction spacing/typography contract.
- [ ] Mobile content start edge aligns with the compact command bar inset at XS/SM sizes.
- [ ] Main workspace and feature-panel selects share one border/radius/height/focus treatment.
- [ ] Select chevron has logical `end-3` positioning and sufficient `pe-9` text clearance in LTR and RTL.
- [ ] Text fields continue using the shared Input primitive; no duplicate in-tool display-language selector remains.
- [ ] Date & Time-specific centerpiece and calendar/time semantics remain intact.
- [ ] Persian, Islamic, Islamic Umm al-Qura, Gregorian, Hebrew, Buddhist, and Indian calendar selections format visible day numbers directly with the selected calendar and use calendar-specific month boundaries wherever the browser Intl implementation supports them.
- [ ] The global application locale controls interface language and month/weekday labels; no duplicate language selector exists. Changing the global locale preserves the chosen calendar and canonical date. Changing calendar system updates date parts/navigation/arithmetic while preserving locale and canonical date.
- [ ] Gregorian-equivalent month references are explicitly labeled and cannot be mistaken for the selected calendar's visible day numbers.
- [ ] Leap-year results use the selected calendar's year length, including lunar and lunisolar year lengths; time-zone, timestamp, JSON and holiday outputs honor selected-calendar display where applicable while preserving stable ISO/Unix data.
- [ ] ISO week-number results explicitly identify their Gregorian ISO semantics.
- [ ] Date picker and printable calendar grid show the selected calendar’s year/month/day values, while selections and timestamps retain canonical Gregorian ISO values.
- [ ] Month navigation, month/year date calculations, age calculations, leap/month-length boundaries, RTL locale, and numbering-system combinations have focused regression coverage.
- [ ] Focused component tests, lint, typecheck, build, E2E and matching CI visual evidence pass before the contract can be marked verified.

## 7. Verification status

**Implementation status is determined by the current source. Verification remains pending until the updated source passes the applicable CI suite and the exact-run artifact is inspected.** The target SVG remains a Proposal until explicitly approved; passing tests do not approve a design.
