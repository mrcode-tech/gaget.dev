# M11 — Data Contracts

## Breakpoint identifiers

Use stable semantic identifiers:
- desktop
- tablet
- mobile

Representative preview widths are 1440, 768, and 390 CSS pixels respectively. Widths are test/display presets, not CSS breakpoint thresholds.

## Responsive state

Per page and component instance:
- shared component collection and instance identity.
- per-breakpoint ordered instance IDs.
- per-breakpoint visibility state.
- per-breakpoint supported override map.

Shared content and sample configuration are stored once, not duplicated per breakpoint.

## Sample capability definition

A sample version declares:
- capabilityId
- supported breakpoint(s)
- defaultValue
- allowedValues
- renderer mapping
- reset behavior
- explanatory label/help
- compatibility/version notes

Only finite enumerated values are allowed in the initial release. No arbitrary numeric or CSS string values.

## Validation finding

Fields: findingId, ruleId, severity, pageId, componentInstanceId, breakpointId, optional field/capability ID, explanation, correction action.

## Invariants

- Same instance ID across all breakpoints.
- Shared membership changes originate from desktop.
- Tablet/mobile cannot independently mutate shared membership.
- Responsive ordering is independent by breakpoint.
- Visibility is independent by breakpoint and never deletes.
- Shared content/configuration remains synchronized.
- Unsupported overrides are rejected.
