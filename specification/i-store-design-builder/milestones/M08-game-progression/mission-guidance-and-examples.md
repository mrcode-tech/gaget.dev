# Mission Guidance and Examples

## Purpose

Specify concise mission explanations and optional contextual help that support decisions without interrupting the workspace.

## Mission introduction

Where applicable, a mission introduction contains:
- Objective: what the user is deciding or creating.
- Explanation: why the decision matters, in plain language.
- Expected outcome: what will be true when the mission is complete.
- Examples: relevant visual references.
- Available actions: what the user can do in the builder.

The amount of detail adapts to the mission's purpose. A long tutorial is not mandatory.

## Guidance availability

- Guidance is available when the user requests it.
- Do not keep a permanent instructional panel open by default.
- Guidance should relate to the active mission and current task.
- It must not block the canvas, library, or ordinary composition.
- Dismissal or closing guidance does not change mission status.

## Visual examples

- Present relevant examples visually alongside concise explanations.
- Examples are read-only references and must not mutate the project.
- Use synthetic representative content and placeholders.
- Examples may show component patterns, page structures, or common design approaches.
- Do not rank examples or imply that one is universally best.
- Selecting a sample for actual use remains a separate explicit user action governed by M06/M07.

## Terminology help

- Explain unfamiliar terminology when the user requests it.
- Use plain language first, with concise definitions.
- No permanent glossary panel or separate searchable learning library is required in the initial scope.
- Terminology explanations are optional and do not gate mission progress.

## Consequences and dependencies

Explain decision consequences when an earlier decision affects later work or requires review. M01 governs when affected missions are marked Needs review and when dependency information is presented.

Do not add warnings for inconsequential choices or interrupt normal work with speculative consequences.

## Acceptance criteria

- [ ] Mission introductions communicate objective and expected outcome.
- [ ] Guidance is available on request and is contextual.
- [ ] Examples are visual, synthetic, inspectable, and non-mutating.
- [ ] Terminology explanations are user-requested.
- [ ] Help does not block normal composition or change mission status.
- [ ] Dependency explanations follow M01 rules.
