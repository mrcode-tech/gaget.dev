# GaGet.dev visual wireframe library

These are rendered, scalable SVG wireframe images—not ASCII-only sketches. They are design references rather than screenshots of the running app.

## Homepage and shared navigation

![Homepage and shared navigation across six breakpoints](./homepage-navigation-breakpoints.svg)

[Open homepage and navigation wireframes](./homepage-navigation-breakpoints.svg)

## All 13 photo editing features

![All photo editing features across all breakpoints](./photo-editor-all-features-breakpoints.svg)

[Open the complete feature-by-breakpoint atlas](./photo-editor-all-features-breakpoints.svg)

The atlas includes all 13 tools: Crop, Resize, Text & watermark, Color & filters, Color picker, Image details, Export & convert, Print size, Image to Base64, Base64 to image, Favicon, Collage, and SVG optimize. Each feature has a layout for every breakpoint:

| Breakpoint | Width | Behavior |
|---|---:|---|
| XS | Below 640px | Compact header, navigation drawer, feature selector, bottom sheet |
| SM | 640–767px | Mobile navigation, compact menu, short-height awareness |
| MD | 768–1023px | Tablet workspace, drawer navigation |
| LG | 1024–1279px | Collapsible sidebar, right inspector where practical |
| XL | 1280–1535px | Full desktop canvas and inspector |
| 2XL | 1536px+ | Max-width content and balanced workspace |

See [the design specification](../design.md) for detailed behavior, interaction, accessibility and acceptance criteria. These schematics document intended hierarchy and responsive behavior, not pixel-perfect final styling.