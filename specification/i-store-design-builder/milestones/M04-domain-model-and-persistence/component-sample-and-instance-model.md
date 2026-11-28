# Component Sample and Instance Model

## Catalogue sample
A reusable, product-authored sample definition with stable id and version, component type, design/render reference, content fields, finite options, responsive behavior and compatibility information as useful.

## Instance
Insertion creates a unique instance referencing sample and version. It holds independent content, bounded configuration and placeholder metadata. Multiple insertions of the same sample are independent instances.

## Content schema
Sample-defined descriptors may specify field id, label, type, default, constraints/options, required and repeatable semantics. Supported types include text, constrained text, image reference, link, list, structured item, boolean, enum and bounded numeric value.

## Configuration
Finite sample-defined choices such as variants, alignment, item count or display options. No arbitrary CSS, pixel positioning or unrestricted nested design editing.

## Version compatibility
Conceptually retain the sample version used. Future changes should explicitly consider compatibility/migration and must not silently discard content. Migration tooling is not MVP.
