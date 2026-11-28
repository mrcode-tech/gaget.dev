# M11 — Interaction Specification

## Canvas controls

Each canvas has a persistent label, device class, simulated width, and selected breakpoint state. Selecting a component highlights the same stable instance across views.

## Editing scope

Before an action, identify whether it affects:
- All canvases (shared content/configuration).
- One breakpoint (order, visibility, supported responsive override).

Never infer scope from the canvas alone when a control is ambiguous. Label the control's effect.

## Inheritance controls

Show inherited values distinctly from local overrides. Offer an explicit reset-to-default action. A reset affects only the selected breakpoint and capability.

## Responsive pattern selection

Display only sample-declared options. Explain the visual effect with a preview. Selecting an option updates the draft/project state according to the normal command boundary; no automatic option selection.

## Reordering and visibility

Provide drag-and-drop where supported and keyboard-accessible move-up/move-down controls. Visibility toggles affect only the active breakpoint and preserve the component in the shared collection.

## Validation panel

Group findings by severity and viewport. Selecting a finding navigates to the affected component and relevant control. Do not use color as the only severity signal.

## Narrow workspace

Preserve all three canvases side by side with horizontal scrolling or zoom. Zoom changes workspace presentation only, not simulated viewport dimensions.
