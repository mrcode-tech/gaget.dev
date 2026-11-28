# M10 — Testing Strategy

## Unit tests

- Homepage uniqueness and designation invariants.
- Primary visitor action validation and applicability.
- Shared frame reference resolution and duplicate prevention.
- Section library filtering and category metadata.
- M06 command payload construction.
- Validation finding target resolution.
- Identity compatibility lookup.

## Component tests

- Section-family browsing, search/filter, empty states.
- Sample preview and comparison are read-only.
- Explicit insert confirmation and position selection.
- Supported content fields and placeholder states.
- Visitor-action editor and not-applicable state.
- Shared frame labels and duplicate prevention.
- Validation findings and navigation to correction target.

## Integration tests

- Insert/reorder/replace/remove/duplicate use M06 commands.
- Catalogue sample versions remain unchanged.
- M09 tokens apply only to declared slots.
- Shared content/configuration remains synchronized across canvases.
- Tablet/mobile order and visibility remain independent.
- Homepage state remains generic and does not require commerce entities.

## Responsive and accessibility tests

Test desktop/tablet/mobile canvases simultaneously, narrow workspace scrolling, keyboard insertion/movement, focus visibility, semantic labels, screen-reader feedback, and non-color status communication.

## Negative tests

- No automatic insertion or recommended section selection.
- No arbitrary CSS or nested element editing.
- No accidental duplicate shared header/footer.
- No change to other breakpoint ordering during a reorder.
- No persistence/browser-storage dependency.

Use synthetic projects and sample definitions only. Record test evidence when implementation occurs; this specification does not claim tests have run.
