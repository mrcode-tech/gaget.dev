# M02 — Interaction Specification

## 1. Workspace entry flow

1. User opens the builder.
2. A short onboarding explains the sample-based composition model and editing boundaries.
3. User enters essential project information.
4. User enters the workspace.
5. The initial page canvas, component library, contextual properties area, and mission guidance are available.

The onboarding is short and does not attempt to teach all design concepts before the user can start composing.

## 2. Workspace regions

### Left region
- Component library grouped by high-level component type.
- Sample previews within each category.
- Page manager.
- Contextual navigation to levels and missions.
- Component list/layer outline for the current page, including hidden components.

### Center region
- Desktop, tablet, and mobile canvases simultaneously.
- Current page selector.
- Canvas zoom and horizontal workspace scrolling.
- Clear breakpoint labels.
- Component selection and insertion affordances.

### Right region
- Selected sample's supported content fields.
- Supported sample options.
- Shared-versus-breakpoint-specific scope indicators.
- Placeholder purpose and user-supplied asset controls.

### Contextual guide
- Collapsible mission objective, explanation, examples, and next relevant action.
- Closing the guide does not change mission state or lose work.

## 3. Browse and add a component

1. User opens a component category.
2. User browses multiple samples for that type.
3. User previews a sample and sees its supported content fields.
4. User selects the sample or drags it to the desktop canvas.
5. The interface shows valid insertion positions.
6. User chooses a position or appends it to the page.
7. The component is added to the shared page structure and appears in all three canvases.
8. The right panel exposes the sample's supported content fields.

No sample is inserted by merely opening a category or viewing a preview.

## 4. Edit content

1. User selects a component on any canvas.
2. The same shared component instance is selected across all canvases and in the component list.
3. The properties panel identifies shared fields.
4. User edits an exposed title, text, label, link, item data, or image slot.
5. The shared content change appears in all three canvases.
6. The user receives normal save feedback.

The user cannot edit arbitrary visual properties or freely restructure the sample internals.

## 5. Replace a sample

1. User selects a high-level component.
2. User chooses Replace.
3. The library shows compatible samples for the component type.
4. User previews and confirms the replacement.
5. Compatible content fields are retained.
6. Incompatible fields are identified before confirmation and are not silently discarded.
7. The replacement is reflected in all three canvases.
8. Undo restores the previous sample and content.

## 6. Remove a component

1. User selects a component on desktop.
2. User chooses Remove.
3. The interface explains that this removes the shared component from all breakpoints.
4. User confirms or cancels.
5. On confirmation, the component is removed from the shared page structure.
6. Undo restores it, including content and breakpoint-specific layout state.

## 7. Responsive ordering and visibility

- Desktop ordering is the initial shared order.
- Tablet and mobile initially inherit the shared order.
- Reordering in one canvas changes only that breakpoint's order.
- Hiding/showing a component changes only that breakpoint's visibility.
- Hidden components remain in the component list and can be restored.
- Adding/removing/replacing a high-level component is only available on desktop and updates the shared collection.
- Shared content edits made from any canvas update all views.
- Responsive presentation settings affect only the selected breakpoint.

## 8. Three-canvas viewport behavior

- All three canvases remain arranged side by side.
- If the available workspace width is insufficient, users can scroll horizontally or zoom the workspace presentation.
- Workspace zoom does not alter the simulated viewport size or website layout state.
- Each canvas remains clearly labeled Desktop, Tablet, or Mobile.

## 9. Page management

- Add, rename, reorder, and remove pages through the page manager.
- Selecting a page updates all three canvases to that page.
- Each page has its own shared component collection and independent breakpoint layout states.
- Removing a page requires confirmation and is recoverable through undo/history.

## 10. Undo, redo, autosave, and history

- Every committed user action enters the undo history.
- Undo/redo covers component insertion, removal, replacement, content changes, ordering, visibility, and supported responsive settings.
- Autosave reports saving, saved, and error states.
- Version history offers inspect and restore.
- Restoring a version creates a new recoverable state and does not erase the state immediately before restoration.

## 11. Mission guidance and progress

- The contextual guide can be opened or collapsed at any time.
- Users can navigate to any M01 level and mission without losing the current composition.
- Mission completion remains objective.
- Marking a level complete does not alter unfinished mission statuses.
- The component library remains available regardless of mission progress.

## 12. Review and handoff

- Review lists pages and links to each page's workspace.
- Each page can be inspected across all three breakpoints.
- Review reports structural and mission completeness, not subjective design quality.
- Handoff clearly labels Complete or Incomplete.
- Unfinished missions and unresolved placeholders link back to relevant workspace areas.

## 13. Error, empty, and feedback states

- Empty page: explain how to browse and add a sample; do not auto-insert one.
- Empty category/search: explain that no matching samples are available.
- No selection: show neutral guidance to select a component.
- Save pending: show saving state without blocking normal navigation.
- Save failure: show a clear error and retry path; preserve local pending edits where technically possible.
- Destructive action: explain its scope and offer cancel/undo.
- Drag/drop invalid target: show a non-destructive invalid-drop cue and leave the page unchanged.

## 14. Accessibility

- All actions have keyboard-operable alternatives.
- Drag/drop has select-and-place and move controls.
- Controls have accessible names and visible focus.
- State is not conveyed by color alone.
- Canvas component selection and properties remain reachable without a pointer.
