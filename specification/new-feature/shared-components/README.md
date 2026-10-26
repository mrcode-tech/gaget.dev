# Shared Component Specifications

This directory contains proposed reusable contracts, not claims that components already exist. Inspect components/ui/, application components and workbenches before adding anything; prefer composing existing shadcn/ui-style primitives.

| Component | Status | Rationale | Wireframe |
|---|---|---|---|
| [Developer Tool Workbench](./developer-tool-workbench.md) | Implemented; contract synchronized | Shared text-first input/output shell for the seven standalone workbenches; composes existing primitives | [Developer Tool Workbench wireframe](../wireframes/developer-tool-workbench.md) |
| [File input / dropzone](./file-input.md) | Proposal pending source audit | Accessible file selection for binary workflows; current component inventory does not identify a shared dropzone | [File input wireframes](../wireframes/file-input.md) |

Add other component contracts only after proving a reuse gap. Keep one canonical contract and link consumers.
