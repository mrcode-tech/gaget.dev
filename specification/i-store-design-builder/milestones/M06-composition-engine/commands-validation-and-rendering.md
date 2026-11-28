# Commands, Validation, and Rendering

## Purpose

Define the boundaries between workspace interactions, domain mutations, structural validation, and responsive preview rendering.

## Command boundary

UI components request composition changes through explicit domain commands. They do not mutate project/page/instance objects directly.

The conceptual command set is:
- `insertComponent`
- `moveComponent`
- `replaceComponentSample`
- `removeComponent`
- `duplicateComponent`
- `updateComponentContent`
- `updateComponentConfiguration`
- `updateComponentVisibility`
- `updateResponsivePresentation`
- `updatePlaceholder`

These names describe responsibilities; implementation may choose equivalent names and signatures.

Commands receive the relevant project/page/instance context and proposed values, validate them, and return a controlled success or failure result. A failed command must leave the prior state unchanged.

## Validation boundaries

Validate at initialization and every domain mutation boundary.

### Identity and ownership
- Project, page, instance, and sample references exist.
- Instance IDs are unique.
- Instance belongs to the active page.
- Sample type matches instance type.

### Content and configuration
- Field identifiers exist in the selected sample schema.
- Values have valid field types and satisfy constraints.
- Configuration keys and values are declared by the sample.
- Responsive overrides are explicitly supported.

### Responsive composition
- Each layout references only shared page instances.
- Each layout order contains each shared instance exactly once.
- No duplicate or dangling references exist.
- Visibility and presentation entries refer to existing instances.

### Replacement and placeholders
- Replacement target has the same component type.
- Compatible content values satisfy the target schema.
- Placeholder references match compatible target slots.
- Unsupported values are rejected or reset according to the approved replacement rules.

## Rendering

Extend the M05 renderer registry. Each sample renderer receives:
- A validated sample definition/version.
- The validated instance content.
- The bounded shared configuration.
- The active breakpoint and supported responsive presentation.
- Placeholder/asset references in the defined contract.

Renderers remain isolated and deterministic for the same inputs. They render previews; they do not own or mutate project state.

Unknown sample renderer registrations, malformed sample data, or rendering failures produce a local understandable unavailable/error state rather than crashing the entire workspace.

The three canvases render from the same shared instance collection and their own responsive layout data.

## Immediate preview updates

After a valid command commits:
- Recompute or select the affected derived view state.
- Update all three canvases for shared content/configuration/membership changes.
- Update only the target canvas for breakpoint-specific order/visibility/presentation changes.
- Keep selection and focus stable where the affected instance still exists.

Preview rendering is derived from domain state. Previewing a catalogue sample remains independent and non-mutating.

## State ownership

Keep project domain state separate from transient workspace state such as selected sample, open preview, selected instance, open panels, active insertion target, and drag interaction.

Mission progression remains separate from composition.

## Runtime constraints

M04/M05 constraints remain in force:
- Browser-only, temporary in-memory structured JSON.
- No backend, database, authentication, or browser-storage persistence.
- No autosave, undo/redo, version history, or recovery guarantee.
- No collaboration, import/export, or asset service.

## Acceptance checks

- UI uses command boundaries for domain mutations.
- All operations validate before committing.
- Failed operations are atomic and preserve valid state.
- Renderer registry remains data-driven and isolated.
- All canvases render from the shared composition plus breakpoint-specific layout.
- Immediate previews reflect committed state correctly.
- No persistence/history behavior is introduced.
