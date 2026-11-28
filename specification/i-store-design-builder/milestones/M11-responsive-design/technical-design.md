# M11 — Technical Design

## Architecture

M11 is a presentation/configuration layer over M04/M06 responsive data and M05 canvas rendering. It does not create a new layout engine or breakpoint system.

## Capability-driven rendering

Each M07 sample version declares responsive capabilities, defaults, allowed override values, and renderer behavior. Renderer receives:
- Shared page/component data.
- Active M09 identity.
- Breakpoint identifier and preview dimensions.
- Resolved responsive order, visibility, and supported overrides.

The renderer must be deterministic for identical inputs.

## State resolution

Resolve a responsive value as: explicit breakpoint override → sample-authored default. Unsupported capability has no override slot and uses sample behavior. Do not infer fallback behavior.

## Commands

Use explicit commands for changing breakpoint order, visibility, and supported presentation overrides. Shared content changes use existing M06 content/configuration commands. Validate before applying updates.

## Validation

Run deterministic checks against the rendered model/measurement evidence where available. Findings are derived, stable-target records. Validation must not mutate composition.

## Runtime

In-memory only. No storage, persistence, device analytics, or server-side rendering service is introduced by M11.
