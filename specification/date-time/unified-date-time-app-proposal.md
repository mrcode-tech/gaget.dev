# Unified Date & Time App — Design Proposal

**Status:** Proposal; no application behavior changed  
**Repository:** `mrcode-tech/gaget.dev`  
**Base reviewed:** `stage`  
**Specification branch:** `feature/date-time-multicalendar-design-spec`  
**Design reference:** `specification/tempalet_wirefram/README.md` and `specification/tempalet_wirefram/template_single_app.md`  
**Reference implementation:** Photo Editor on `stage`  
**Goal:** Consolidate the existing Date & Time tools into one comprehensive, local-first workspace with a multilingual, multi-calendar date/time centerpiece.

## 1. Product decision

Replace the separate Date & Time landing/tool pages with one primary application route, recommended as `/datetime/editor`. The Date & Time category, home page, favorites, search, and existing deep links should open this application and select the relevant feature where possible.

The main workspace is **not a drag-and-drop/file-upload experience**. Its empty/default state is a live date-and-time explorer: a large, readable date/time component centered in the working area. Users can change its calendar, display language, numeral system, time format, and time zone. The selected feature then operates on this shared date/time context.

This follows the Photo Editor single-app shell and interaction model, while replacing image-specific canvas/upload behavior with date/time-specific content. Do not copy image-only actions such as crop, zoom, image history, or file upload.

## 2. Why consolidate

The current registry advertises a broad collection of separate Date & Time tools (world clock, calendar, date arithmetic, timestamp conversion, countdown, calendar conversion, date difference, business days, week number, leap years, age, duration, meeting planner, formatting, calendar generation, ICS tools, holidays, JSON conversion, and cron helper). These are rendered through the shared `DateTimeWorkbench` component with a route slug, but each page still presents a tool-specific card and title. The component also has shared state and feature-specific branches mixed together.

A unified workspace should:
- Make the current date/time and calendar systems visible immediately, without navigating into a tool first.
- Let users move between related calculations without re-entering the same dates.
- Share calendar, locale, time zone, and number-format preferences consistently.
- Provide a predictable feature menu and a larger work area for two-date comparisons and detailed results.
- Keep existing capabilities discoverable while avoiding twenty visually separate mini-apps.

## 3. Experience architecture

### Shared shell

Use the current Photo Editor on `stage` as the structural and responsive authority. Read every wireframe in `specification/tempalet_wirefram/` before implementation.

- Preserve global navigation and the editor command bar geometry, breakpoints, menu behavior, spacing, focus states, and RTL-aware layout.
- Compact XS/SM/MD command bar: **File** and **Features** menus.
- Desktop LG/XL/2XL: use the same top-level menu treatment and grouping pattern as the Photo Editor. Suggested groups are **Date**, **Time**, **Calculate**, **Calendar**, and **Utilities**; preserve the shared command-bar geometry rather than forcing image menu labels.
- One active feature panel at a time.
- Desktop: a bounded, resizable/trailing feature inspector where supported by the existing shared pattern, with the central workspace retaining priority.
- Mobile/tablet: the same accessible, vertically resizable bottom sheet used by the Photo Editor, including its drag handle, snap states, viewport bounds, internal scrolling, close behavior, and keyboard/touch accessibility.
- Preserve all documented template breakpoint behavior, including compact navigation through 1023px, no horizontal overflow, short-landscape support, and bounded content at 2XL.
- No drag/drop card, file picker, or upload-centric empty state in this app.

### Default workspace: multilingual date and time centerpiece

The center of the page should show a prominent date/time panel rather than an upload target.

Primary content:
1. Live current time, including seconds when enabled.
2. Full date in the selected calendar and display language.
3. Calendar-system name and a clearly labeled Gregorian/ISO reference value for unambiguous interchange.
4. Optional secondary date representations (for example Persian Solar Hijri and Islamic Hijri) in a compact, expandable list.
5. Time zone label and UTC offset, with an action to change zone.
6. Quick controls for calendar, language/locale, digit system, 12/24-hour clock, and seconds visibility.
7. A clear **Use this date/time** action to seed the selected feature with the displayed value.
8. A live-update indicator and an accessible pause/freeze action for calculations that need a stable “now” reference.

Keep the panel bounded and readable on desktop; do not stretch its controls across the full viewport. At narrow widths, stack controls and let the entire workspace scroll as one region when height is insufficient.

### Calendar and locale are separate settings

Do not conflate calendar system, language, numeral system, and time zone.

- **Calendar system:** Gregorian, Persian Solar Hijri, Islamic Hijri (browser-supported variants must be named explicitly), Hebrew, and any additional systems verified in the supported runtime.
- **Display language/locale:** English, Persian (Farsi), Arabic, Georgian, and other app-supported locales.
- **Digits:** locale default, Latin digits, Persian digits, and Arabic-Indic digits where formatting APIs support them.
- **Time zone:** IANA time-zone identifiers such as `Asia/Tehran`, `Asia/Baku`, `Asia/Dubai`, `Europe/Tbilisi`, and `UTC`; show the identifier and offset rather than relying on a city label alone.
- **Clock format:** 12-hour or 24-hour, with optional seconds.
- **Direction:** apply RTL to Arabic and Persian presentation regions where appropriate, while keeping timestamps, ISO strings, Unix values, and technical identifiers legible and directionally isolated.

Use `Intl.DateTimeFormat` with explicit `locale`, `calendar`, `numberingSystem`, and `timeZone` options where available. Feature-detect support and handle unsupported combinations gracefully. Do not promise identical calendar algorithms across browsers without testing them.

## 3A. Shared date/time input system — required design contract

The date/time input is a reusable product component, not a collection of native browser inputs or plain list boxes. The same component family must be used by the default centerpiece and every feature that accepts a date, time, date range, or date-time value.

### Component family and names

- `CalendarDateInput`: a labeled, styled date field with a calendar popover.
- `CalendarSystemSelect`: a searchable/styled selection control for the calendar system; never a raw unstyled `<select>`.
- `DatePicker`: calendar popover with month/year navigation, localized weekday labels, keyboard selection, and an explicit selected-date state.
- `TimePicker`: styled time input with a compact popover or wheel-like hour/minute selection; supports 12/24-hour mode and optional seconds.
- `DateTimePicker`: combined date/time field with tabs or clearly separated date and time sections.
- `DateRangePicker`: two linked date endpoints, with range highlighting and independent start/end labels.
- `TimeZoneSelect`: searchable IANA time-zone picker with city/region, UTC offset, and query filtering.
- `CalendarLocaleControls`: separate controls for calendar, language/locale, numeral system, and time zone.
- `CompactDateInput` and `CompactTimeInput`: density variants of the same components for inline tables and narrow feature panels, not separate implementations.

### Visual design and implementation rules

- Use the project's shadcn/ui-style primitives and existing design tokens: labeled `FormField`/label, styled `Input`, `Button`, `Popover`, `PopoverTrigger`, `PopoverContent`, `Calendar`, `Select`/combobox, `Tabs`, and accessible dialog patterns already present in the repository.
- Never use a bare browser `input[type=date]`, `input[type=time]`, or native `select` as the primary visual component. Do not build a plain, unstyled list box as the calendar selector.
- Use consistent heights, typography, border, radius, shadow, focus ring, disabled state, error state, icon size, spacing, and popover layering across all date/time tools. Reuse existing shadcn primitives rather than inventing a parallel design system.
- The closed field shows a clear value and calendar/clock icon; the popover is aligned to the field, has a bounded width and max height, and scrolls internally when content exceeds available space.
- The calendar-system selector must be a styled searchable list/combobox with a visible selected state, optional short calendar examples, and a clear label. It must not expand into an unbounded page-length list. On small screens, use a bounded popover or a mobile sheet using the project's existing responsive pattern.
- Provide explicit Apply/Cancel only where the interaction edits a draft. For simple single-date selection, selection may commit immediately if that behavior is consistent and documented. Escape closes and restores focus; clicking outside follows the existing popover contract.
- Inputs must support controlled values, empty values, min/max bounds, required/optional states, read-only/disabled states, validation errors, helper text, and form submission without silently coercing invalid input.
- Maintain consistent dimensions and behavior when used in Date Difference, Age Calculator, Date Calculator, Business Days, Countdown, Meeting Planner, Timestamp Converter, Calendar Generator, and all other applicable features.

### Calendar system, locale, digits, and timezone must remain independent

The UI must not treat “Persian”, “Arabic”, or “English” as a calendar selection. Expose separate, labeled settings:

1. **Calendar system:** Gregorian, Persian Solar Hijri, and each specifically supported Islamic variant (for example Umm al-Qura or civil/tabular), plus other calendars only after runtime capability and correctness tests.
2. **Language/locale:** English, Persian (Farsi), Arabic, Georgian, and any additional app-supported locales.
3. **Numeral system:** locale default, Latin digits, Persian digits, and Arabic-Indic digits where supported.
4. **Time zone:** searchable IANA zones; changing the zone changes instant-to-local-time presentation, not a date-only value.
5. **Clock format:** 12-hour or 24-hour; seconds are optional.

Show the selected calendar and locale clearly in the field/popover. Calendar month/year headings, weekday names, month navigation, selected day, today marker, and accessible labels must follow the selected calendar and locale. When a browser cannot format a requested calendar/locale combination, show an explicit supported-combination message rather than silently displaying a different calendar.

### Date picker interaction details

- Calendar header has previous/next period controls, a month/year heading, and an optional month/year selection affordance if supported by the calendar adapter.
- Weekday labels and week-start convention follow locale or an explicitly selected convention. The convention must be documented; do not silently force Sunday for every locale.
- Provide clear states for today, selected date, dates in a selected range, dates outside the current month, disabled dates, and keyboard focus. Color is not the only state indicator.
- Keyboard: arrow keys move by day/week, PageUp/PageDown move by month, Shift+PageUp/PageDown move by year where appropriate, Home/End follow the documented week convention, Enter/Space selects, Escape closes.
- Localized numerals are visual presentation only; parsed and emitted machine values remain stable.
- A date-only field stores a date-only value (calendar date/year/month/day) and must not shift when the browser time zone changes. An instant-based date-time field stores an instant plus its display zone. A wall-time field must identify the zone or explicitly state that it is zone-free.

### Time picker interaction details

- Offer a polished time popover with hour and minute columns; seconds appear only when enabled. It must not be an infinitely tall, unbounded list.
- Keyboard navigation and direct text entry must be supported; validate hour/minute/second ranges and AM/PM conversion.
- In 12-hour mode, show an explicit AM/PM control. In 24-hour mode, omit AM/PM. Respect localized digits and locale labels without changing the underlying numeric value.
- For a date-time value in an IANA zone, handle DST gaps and overlaps. If a chosen local wall time is nonexistent or ambiguous, explain the condition and let the user choose a valid interpretation; do not silently move the time.
- Time zone and UTC offset should be visible when they materially affect interpretation. Keep technical output such as ISO 8601 in a directionally isolated LTR region inside RTL interfaces.

### Combined and range pickers

- Combined DateTimePicker uses one styled trigger field and a bounded popover containing Date and Time tabs/sections. Show the final selected value in the trigger. On narrow screens, stack sections and make the popover/sheet content internally scrollable.
- DateRangePicker labels Start date and End date separately, uses a two-month view on wide screens where space permits, and a single-month stacked view on compact screens. Highlight the inclusive range and make endpoint semantics explicit.
- Date-range feature inputs must not require users to open two unrelated full-page calendars. Both endpoints use the same reusable picker and selected calendar/locale settings.
- For meeting planning, each local wall-time endpoint is paired with a time-zone field. For date difference, users can choose date-only or elapsed date-time difference; the UI must explain which calculation is active.

### Component states and responsive rules

Document and test: default, hover, focus-visible, open, selected, today, range-start, range-end, in-range, outside-month, disabled, read-only, loading (when applicable), invalid/error, and empty states. At 320–390px, popovers must fit the viewport or use the established mobile sheet; no horizontal overflow. At tablet and desktop sizes, align popovers to their field and keep widths bounded. The whole working area must scroll when vertical space is insufficient; avoid competing nested scroll regions except inside intentionally bounded picker lists/popovers.

### Required component acceptance criteria

- No date/time feature contains its own visually divergent calendar or raw select control.
- Every applicable feature imports the shared input component(s), with feature-specific labels, validation, and value semantics passed through props.
- Calendar selector is styled, searchable, bounded, keyboard accessible, and scrollable when its option list exceeds the max height.
- Gregorian, Persian Solar Hijri, and the explicitly supported Islamic variants are verified against test vectors, not merely formatted by a demo screenshot.
- English LTR, Persian RTL, and Arabic RTL screenshots show mirrored layout correctly; Georgian locale uses localized language without being mislabeled as a distinct calendar.
- Component tests cover controlled/uncontrolled state where supported, validation, focus restoration, keyboard operation, date-only stability, DST ambiguity, and responsive popover bounds.

## 3B. Date/time input wireframes

The wireframe asset in this directory is the visual companion to this specification. It defines the reusable component family and representative use in feature panels. Treat it as structural guidance; the repository's shadcn tokens and actual component primitives remain the visual source of truth.

- `date-time-input-components.svg` — component gallery for date, calendar selector, Persian-calendar picker, time picker, combined date/time picker, date range, timezone selector, input states, and compact variants.
- The reference image should be reviewed at desktop, tablet, and mobile widths and in both LTR and RTL. If a raster JPG is needed for review/issue attachment, export the SVG or approved rendered wireframe to JPG as a build/review artifact; keep SVG as the editable repository source.

## 4. Feature inventory and menu grouping

All currently registered Date & Time capabilities must remain available unless a separate product decision approves removal. Consolidate them into one feature menu and map old routes to the new feature state.

| Group | Feature | Required behavior in unified app |
|---|---|---|
| Date | Calendar | Browse a month/year using the selected calendar; navigate periods; select a date; clearly label week-start convention. |
| Date | Date Calculator | Add/subtract days, weeks, months, or years; choose calendar-aware arithmetic rules; show original and result dates in selected and Gregorian representations. |
| Date | Date Converter | Convert one instant/date among supported calendar systems and display locales; distinguish date-only conversion from instant/time-zone conversion. |
| Date | Date Difference | Compare two dates; show signed and absolute difference, calendar years/months/days when requested, total days, weeks, and elapsed duration when time-of-day is included. |
| Date | Age Calculator | Calculate age as of a selected date; validate future birth dates and leap-day birthdays; show years/months/days and next birthday. |
| Date | Business Days | Count working days between dates; configure weekend days and optional custom holidays; make inclusive/exclusive endpoints explicit. |
| Date | Week Number | Show ISO week/year and, separately, calendar-local week numbering where supported. |
| Date | Leap Year | Explain leap-year status and year length for the selected calendar; do not apply Gregorian leap rules to other calendars. |
| Date | Date Format | Preview full, long, medium, short, and ISO/technical forms across selected locales. |
| Time | World Clock & Time Zone Converter | Compare live city/time-zone clocks; convert a selected local wall time between IANA zones. |
| Time | Time Zone Meeting Planner | Compare configurable working-hour windows across zones; handle daylight-saving transitions and ambiguous/nonexistent local times explicitly. |
| Time | Countdown & Event Timer | Count down to a target instant or count up from a past instant; show units and pause/freeze a reference when appropriate. |
| Time | Time Duration | Add/subtract durations and convert units; distinguish elapsed seconds from calendar-relative durations. |
| Time | Timestamp Converter | Convert Unix seconds/milliseconds and ISO strings; show UTC, selected zone, locale, and calendar representation. |
| Calendar | Calendar Generator | Generate a printable month/year using selected calendar and locale; retain accessible print layout. |
| Calendar | Holiday Calendar | Browse the existing bundled sample and clearly identify its coverage; do not imply comprehensive national/religious coverage unless data is supplied. |
| Calendar | ICS Viewer | Import and inspect local `.ics` files; parse dates and time zones accurately; report unsupported recurrence/time-zone cases. |
| Calendar | ICS Event Generator | Create downloadable events with correct time-zone semantics, escaping, duration, and validation. |
| Utilities | Date/Time JSON Converter | Emit structured ISO, UTC, Unix seconds/milliseconds, zone, and selected calendar/locale metadata. |
| Utilities | Cron Schedule Helper | Explain cron fields and preview supported patterns; clearly label the dialect and limitations. |

Feature menu rows should follow the Photo Editor's established icon/title/description behavior. Use accurate short descriptions and existing icon imports; do not use emoji as replacement icons. Features should share the same panel container, resize behavior, close behavior, and accessibility contract.

## 5. Shared state and calculation model

Create one canonical state model shared by the centerpiece and feature panels:
- selected date/time or instant;
- selected calendar identifier;
- display locale and numbering system;
- IANA time zone;
- clock format and seconds visibility;
- frozen/reference “now” value where required;
- feature-specific inputs/results (such as second date, duration, event title, weekend set, cron expression).

Separate **instant**, **local wall-clock date/time**, and **date-only calendar value** in the domain model. A date-only value must not silently shift because of time-zone conversion. Do not use the browser's implicit local time zone for calculations when a selected zone is active.

Recommended interaction:
- Selecting a date/time in the centerpiece updates the shared reference.
- Opening a feature pre-fills its first input from that reference.
- Changing calendar/locale changes presentation without changing the underlying instant/date value.
- Calendar arithmetic uses explicit, documented overflow rules (e.g., adding one month to a date near month-end).
- Switching features preserves the selected date/time and common preferences; feature-local draft state may reset only where documented.
- Provide Reset for feature inputs separately from Reset to current time; never combine them into an ambiguous action.
- Copy/export controls should copy the exact displayed or machine-readable value and expose accessible confirmation.

## 6. Internationalization and calendar correctness

### Initial locale/calendar matrix

| Locale | Language/script | Initial calendars to test | Direction |
|---|---|---|---|
| `en-US` | English | Gregorian, Persian, Islamic, Hebrew where supported | LTR |
| `fa-IR` | Persian | Persian Solar Hijri, Gregorian, Islamic where supported | RTL |
| `ar` / `ar-SA` | Arabic | Islamic calendar variants supported by runtime, Gregorian, Persian where supported | RTL |
| `ka-GE` | Georgian | Gregorian, Persian, Islamic where supported | LTR |

The exact supported calendar identifiers must be capability-tested in the target browsers. In particular, “Islamic” is not one universally identical calendar: distinguish supported variants such as civil/tabular versus observational/Umm al-Qura when the runtime exposes them. Do not label a Georgian language setting as a separate Georgian calendar unless a genuine calendar system is implemented and verified; Georgian should initially mean locale/language formatting.

### Correctness requirements

- Use a documented date/time library or carefully tested adapters for calendar arithmetic beyond what native `Intl` can safely provide.
- Preserve DST rules using IANA zones; never hard-code offsets for named cities.
- Handle invalid dates, leap days, month boundaries, years outside supported ranges, negative/large timestamps, seconds vs milliseconds, and invalid time zones.
- Distinguish conversion of a calendar date from conversion of a time-zone instant.
- Provide an explicit error for unsupported locale/calendar combinations instead of silently falling back to Gregorian or English.
- Keep ISO 8601 and Unix timestamp outputs machine-stable regardless of display language.
- Add tests for Persian new year/year boundary, Islamic month/year boundaries, RTL layout, Arabic/Persian digits, DST gaps/overlaps, and calendar-specific month lengths.

## 7. File menu and commands

Use the shared File menu pattern but make actions appropriate for a date/time utility:
- Copy current display.
- Copy ISO 8601.
- Copy Unix timestamp (seconds/milliseconds).
- Export current result as JSON or text when meaningful.
- Print calendar when the active feature supports it.
- Import `.ics` only while ICS Viewer is selected.
- Download `.ics` only while ICS Event Generator is selected.
- Reset feature inputs.
- Reset reference to current date/time.

Disable or hide feature-dependent commands when irrelevant, and communicate disabled states accessibly. Do not create a file-oriented workflow that suggests every date tool needs an uploaded file.

## 8. Responsive layout

### Desktop (LG and wider)
- Reuse the Photo Editor command bar and bounded trailing inspector pattern.
- Centerpiece remains the visual focus and uses a readable max-width.
- For Date Difference, Meeting Planner, and other comparison features, allow a wider working area and two clearly labeled columns/rows without compressing the main date/time display.
- Inspector width stays bounded; content does not stretch to the entire display at 2XL.
- If resizable split panels are used for comparisons, provide a keyboard-operable separator and sensible min/max bounds. Do not invent an inaccessible drag-only splitter.

### Mobile and tablet (below 1024px)
- Keep compact File/Features command bar and global hamburger navigation.
- The centerpiece uses a compact stacked layout with wrapping controls.
- Feature controls open in the shared resizable bottom sheet; content scrolls inside the sheet, not through competing nested page scrolls.
- Comparison features should stack the two endpoints and keep results visible and readable.
- RTL must work for menus, panel placement, arrows, form labels, and mixed LTR technical values.
- Test short landscape and dynamic viewport height; no control may be clipped behind the browser chrome or sheet.

## 9. Accessibility

- Use semantic labels and fieldsets; all date/time controls have accessible names.
- Keyboard-operable feature menu, calendar navigation, panel close/resize, copy/export, and all calculations.
- Visible focus indicators and focus restoration after menus/panels close.
- Announce calculation errors and result updates appropriately without excessively announcing each live-clock second.
- Do not rely on color alone to distinguish dates or results.
- Support reduced motion and touch targets appropriate for resizing.
- Validate screen-reader output in LTR and RTL locales, including numbers, time-zone IDs, ISO values, and Unix timestamps.

## 10. Migration and URL compatibility

- Add `/datetime/editor` as the canonical unified route.
- The Date & Time category, Home, Favorites, and search should point to the unified app while retaining feature-level discoverability.
- Existing URLs such as `/datetime/date-difference` should continue to work and open the unified app with the corresponding feature selected, either through redirects with a feature query parameter or route aliases. Preserve useful canonical metadata and avoid breaking existing bookmarks.
- Update the tool registry and category/search metadata so individual features are discoverable but do not create separate app shells.
- Remove duplicate per-feature shell/title cards only after each feature is reachable inside the unified workspace.
- Do not delete old route support until migration tests demonstrate compatibility.

## 11. Suggested implementation structure

Refactor the current `components/datetime-workbench.tsx` incrementally instead of rewriting every calculation at once.

Potential component boundaries:
- `DateTimeEditor`: shared editor shell and active feature selection.
- `DateTimeCenterpiece`: live/selected date, time, calendar, locale, zone and numeral controls.
- `DateTimeFeatureMenu`: feature catalog and grouping.
- `DateTimeFeaturePanel`: shared desktop inspector/mobile sheet.
- `CalendarDateInput`: calendar-aware input and validation.
- `LocaleCalendarFormatter`: explicit locale/calendar/numbering-system formatting adapter.
- `DateTimeValue`: typed date-only, local wall time, and instant model.
- `date-time-features/*`: focused feature components/calculations, migrated from the existing slug switch.
- `date-time-calculations/*`: pure tested functions for date arithmetic, differences, business days, time zones, timestamps, ICS and cron.

Use current design tokens, components, icon package, and styling utilities. Avoid introducing a second design system or adding a large dependency without evaluating bundle size, calendar correctness, licensing, and browser compatibility.

## 12. Audit findings from current stage implementation

The current registry exposes 20 Date & Time tools and the dynamic route renders a shared `DateTimeWorkbench` based on a slug. The component already includes locale/calendar state and uses `Intl.DateTimeFormat` for date-converter output, but this is not yet a consistent global experience.

Items to verify and resolve during implementation:
- Locale and calendar controls are not surfaced as a shared centerpiece; the calendar/locale state is mostly used in selected feature branches.
- The available time-zone list is a small hard-coded set rather than a searchable IANA zone selector.
- Calendar display is based on native Gregorian `Date` month calculations in the visible implementation; Persian/Islamic calendar navigation and calendar-aware arithmetic require explicit support.
- The displayed world clocks use the browser default locale instead of the selected shared locale.
- Date-only parsing and local date arithmetic rely on JavaScript `Date`; confirm DST-safe, date-only semantics before reusing these helpers for calendar conversions.
- The visible time-zone conversion helper requires robust tests for DST gaps/overlaps and wall-time interpretation.
- The current ICS generator builds local date values and emits UTC-style `Z` values; verify that conversion is correct for the intended local zone before preserving or extending it.
- Several feature calculations are embedded in one large slug switch. Split pure calculations from UI before adding more calendar systems.
- The holiday list is described as a small bundled sample; preserve that limitation in the UI.
- Feature inventory and route registry must be kept in sync. Preserve existing deep links and check which registered tools are genuinely functional before declaring parity complete.

These are audit observations from the current source, not a claim that every listed issue has been reproduced by tests. Establish a baseline with existing tests before changing behavior.

## 13. Verification plan and acceptance criteria

### Functional tests
- All 20 current Date & Time features are selectable and functional within one shell.
- Legacy URLs open the correct feature state.
- Shared locale/calendar/time-zone changes update the centerpiece and relevant feature labels/results consistently.
- Persian, Arabic, Georgian and English locales render correct localized names and direction.
- Persian Solar Hijri and supported Islamic calendar dates can be displayed and converted correctly; unsupported combinations produce explicit feedback.
- Calendar selection and date-only calculations do not shift by time zone.
- Time-zone conversion covers standard time, DST changes, ambiguous wall times, and nonexistent wall times.
- Timestamp seconds/milliseconds and ISO parsing are unambiguous.
- ICS import/export, JSON export, copy, and print actions have unit/integration coverage.
- Feature switching preserves shared context; reset actions are distinct and correct.

### Responsive and accessibility tests
- Compare screenshots against Photo Editor shell at identical XS/SM/MD/LG/XL/2XL widths.
- Verify the full workspace scrolls when needed, with no horizontal overflow.
- Verify desktop inspector bounds and any resizable comparison panel.
- Verify mobile sheet drag/resize, snap states, internal scrolling, close/Escape, focus restoration, and short-landscape bounds.
- Verify RTL and mixed-direction technical fields.
- Run lint, typecheck, production build, unit/component tests, Playwright responsive tests, and accessibility checks. Report actual run results and commit SHA; do not mark checks passed without observed results.

### Release gates
1. Calculation correctness and legacy route compatibility.
2. Verified calendar/locale support matrix in supported browsers.
3. Responsive parity with the Photo Editor shell.
4. Accessible RTL/LTR interaction and resizable panel behavior.
5. Full test suite and production build pass.

## 14. Out of scope for the first migration

- Accounts, server-side date storage, or syncing personal events.
- Claiming authoritative religious holiday calculations without a trusted data source and an explicit calculation convention.
- Building a new Georgian calendar system; Georgian locale support is language formatting, not a calendar-system claim.
- Replacing browser time-zone data with hand-maintained offsets.
- Removing any existing Date & Time feature before its replacement and deep-link compatibility are verified.

## 15. Implementation sequence

1. Record baseline test/build results and audit every branch of the current workbench.
2. Extract pure date/time calculations and define typed date-only/local-time/instant values with tests.
3. Build the shared editor shell using the Photo Editor template and the date/time centerpiece as the default workspace.
4. Implement explicit locale, numbering system, calendar, time-zone and clock-format controls.
5. Migrate features into grouped panels in small batches, preserving outputs and fixing verified calculation defects.
6. Add route aliases/feature selection and update registry/category/home/favorites/search links.
7. Complete RTL/responsive/accessibility testing and screenshot comparison.
8. Run all repository checks, report real results, and only then propose merging into `stage`.

---

**Decision requested:** approve the unified Date & Time workspace direction and this feature scope before implementation. This branch contains the proposal only; no application code has been changed.
