# M15 — Interaction Specification

## Standalone transition

Users should not experience a change in the product's design vocabulary or lose exported MVP projects. Any future migration path must be explicit; MVP JSON/Markdown exports remain available independently.

## Account and project dashboard

Provide clear registration/sign-in/recovery states, project list, create/open/rename/duplicate/archive/delete actions, and account settings. Explain ownership and storage behavior.

## Save and recovery

Display saving, saved, offline/error, and recovery states. A user must be able to identify the latest durable version. Failed saves must not be represented as successful. Recovery choices explain what will be restored.

## Version history

List versions with timestamp, author, and summary. Preview before restore. Restore requires confirmation and creates a new recoverable version.

## Sharing

Read-only share creation explains scope, access, expiry, and revocation. Editing collaboration must not be enabled until its separate role/conflict model is approved.

## Privacy and analytics

Provide clear privacy settings and data export/deletion actions. Analytics consent and controls must be understandable. Do not expose private project content in analytics dashboards or support tools by default.

## Starter projects

Show curated starter previews and explain included pages/sections. The user explicitly selects one. Never create or apply a starter automatically.
