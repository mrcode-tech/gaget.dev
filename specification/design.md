# GaGet.dev Responsive UX & Wireframe Specification

**Status:** Design specification / implementation reference  
**Scope:** Default GaGet.dev homepage, shared application sidebar, unified Photo Editor, editor menus, feature panels, and responsive behavior.  
**Repository branch reviewed:** `feat/mobile-navigation-ux-fixes`  
**Last reviewed:** 2026-10-17

This document is the source of truth for the intended responsive layout and wireframes. It documents current product structure and the agreed UX direction; it does not claim that every item in the wireframes is already implemented pixel-for-pixel.

## 1. Product principles

1. **One unified Photo Editor.** Related photo-editing capabilities are features inside `/images/editor`, not a collection of competing top-level editor apps.
2. **Homepage remains the default route.** Visiting `/` shows the GaGet.dev tools discovery homepage. The shared site shell and navigation are available throughout the app; the Photo Editor is opened from its featured card or Images navigation.
3. **Canvas-first editing.** When an image is loaded, keep the image/canvas as the primary workspace. Parameters are contextual and must not permanently consume the canvas area on small screens.
4. **Responsive, not merely scaled.** Navigation and editing controls change presentation at breakpoints. Do not solve small-screen layouts by shrinking desktop columns or adding horizontal page scrolling.
5. **Local-first privacy.** Image processing remains in the browser. Clearly communicate that the source image is not uploaded.
6. **Consistent shared navigation.** Use the shared AppSidebar and site header/navigation. Do not introduce a second competing navigation rail inside PhotoEditor.
7. **Accessible behavior.** Keyboard focus must remain visible; menus and panels need names, Escape dismissal, and sensible focus restoration. Touch targets should generally be at least 40–44 CSS px.

## 2. Breakpoint system

Use the repository's Tailwind breakpoints as the responsive contract:

| Label | Width | Layout intent |
|---|---:|---|
| XS / small phone | below 640px | Compact header; navigation drawer; single-column homepage; editor feature dropdown; bottom-sheet/contextual feature panel |
| SM / large phone & compact landscape | 640–767px | Mobile navigation behavior; compact header; preserve one-column editor workspace; dropdown must stay compact |
| MD / tablet | 768–1023px | Tablet still uses mobile site-navigation drawer; editor workspace may gain room, but must not force the desktop sidebar into a cramped split |
| LG / small desktop | 1024–1279px | Persistent collapsible site sidebar; desktop editor menus; contextual right inspector when width permits |
| XL / desktop | 1280–1535px | Full desktop composition, expanded sidebar by default, comfortable inspector and canvas |
| 2XL / wide desktop | 1536px and above | Same desktop composition with a max-width content region; avoid stretching cards, controls, or text across the entire display |

**Breakpoint behavior is width-based, not device-name-based.** A landscape phone may be short in height; menus and sheets must use viewport-relative max heights and internal scrolling. Account for dynamic viewport units on mobile browsers.

## 3. Shared application shell and side menu

### 3.1 Desktop sidebar (LG and wider)

- Fixed to the leading edge (left for LTR; right for RTL locales).
- Expanded width: **248px**. Collapsed width: **64px**.
- Header row: GaGet.dev mark and wordmark, plus collapse/expand control.
- Scrollable navigation region with:
  - Home
  - Popular
  - All tools
  - Favorites
  - Categories
- Footer stays at the bottom of the sidebar.
- Expanded mode shows icon + text labels and a “Categories” section heading.
- Collapsed mode shows icons with accessible labels/tooltips; never rely on icon-only meaning without an accessible name.
- Main content occupies the remaining width and must not render beneath the sidebar. The content offset follows the expanded/collapsed sidebar width.
- Direction-aware borders, placement, and collapse icons must support RTL.

### 3.2 Mobile and tablet navigation drawer (below LG)

- Sidebar is **closed by default** and opened with the persistent hamburger button in the shared/site header.
- Drawer overlays the current page; a dimmed backdrop closes it. It must not push or resize the page.
- Drawer width should be comfortable on phones (target about 248px, capped to viewport width minus safe margins); height fills the dynamic viewport.
- Drawer content order:
  1. Brand row and close button
  2. Home, Popular, All tools, Favorites
  3. Categories
  4. Divider
  5. **Language** row
  6. **Appearance** row (theme toggle)
  7. Footer/copyright
- Language and Appearance must be two separate rows with visible captions, never combined into one horizontal row.
- Selecting a destination closes the drawer. Escape and backdrop close it. Keep the drawer content internally scrollable when height is limited.
- The editor's hamburger and the site's drawer trigger must open the same shared navigation drawer.

### 3.3 Side-menu category inventory

The current shared navigation category list is:

- Images
- Audio
- Date & Time
- Generators
- JSON
- Encoding
- Text
- Security
- Web & API
- Data Formats
- SQL

### 3.4 Side-menu wireframes

**Mobile drawer — portrait (XS/SM/MD):**
```text
┌──────────────────────────┐
│ GaGet.dev             [×]│
├──────────────────────────┤
│ ⌂  Home                  │
│ ✦  Popular               │
│ ▦  All tools             │
│ ♡  Favorites             │
│                          │
│ CATEGORIES               │
│ ▣  Images                │
│ ♪  Audio                 │
│ ◷  Date & Time           │
│ ◈  Generators            │
│ {} JSON                  │
│ ◇  Encoding              │
│ ≋  Text                  │
│ ⛨  Security              │
│ ‹› Web & API             │
│ ▤  Data Formats          │
│ ▦  SQL                   │
│                          │
├──────────────────────────┤
│ Language          [EN ▾] │
│ Appearance        [☼/☾]  │
├──────────────────────────┤
│ © GaGet.dev              │
└──────────────────────────┘
     dimmed page backdrop
```

**Desktop expanded sidebar (LG+):**
```text
┌──────────────────────┬────────────────────────────────────┐
│ [mark] GaGet.dev [◀] │ Shared page header / page content   │
├──────────────────────┤                                    │
│ ⌂  Home              │                                    │
│ ✦  Popular           │                                    │
│ ▦  All tools         │                                    │
│ ♡  Favorites         │                                    │
│                      │                                    │
│ CATEGORIES           │                                    │
│ ▣  Images            │                                    │
│ ♪  Audio             │                                    │
│ ◷  Date & Time       │                                    │
│ ◈  Generators        │                                    │
│ {} JSON              │                                    │
│ ◇  Encoding          │                                    │
│ ≋  Text              │                                    │
│ ⛨  Security          │                                    │
│ ‹› Web & API         │                                    │
│ ▤  Data Formats      │                                    │
│ ▦  SQL               │                                    │
│                      │                                    │
├──────────────────────┤                                    │
│ © GaGet.dev          │                                    │
└──────────────────────┴────────────────────────────────────┘
```

**Desktop collapsed sidebar:**
```text
┌──────┬────────────────────────────────────────────────────┐
│ [▣][▶]│ Shared page header / page content                  │
├──────┤                                                    │
│  ⌂   │                                                    │
│  ✦   │                                                    │
│  ▦   │                                                    │
│  ♡   │                                                    │
│  ─   │                                                    │
│  ▣   │                                                    │
│  ♪   │                                                    │
│  ◷   │                                                    │
│  ◈   │                                                    │
│  {}  │                                                    │
│  ◇   │                                                    │
│  ≋   │                                                    │
│  ⛨   │                                                    │
│  ‹›  │                                                    │
│  ▤   │                                                    │
│  ▦   │                                                    │
├──────┤                                                    │
│  ©   │                                                    │
└──────┴────────────────────────────────────────────────────┘
```

## 4. Default homepage (`/`)

### 4.1 Page structure

1. Shared navigation shell.
2. Main content area with a clear hero: what GaGet.dev offers, a concise value proposition, and tool search.
3. Featured/popular tools section; **Photo Editor** is a prominent entry.
4. Browse-by-category section using the category inventory in §3.3.
5. Tool discovery content remains readable and useful without requiring the sidebar to be open on mobile.
6. Preserve language, theme, focus, and RTL support.
7. Cards have consistent title, short description, icon, and clear clickable area. At 2XL, center/constrain the content rather than making cards excessively wide.

### 4.2 Homepage wireframes by breakpoint

**XS — 360 × 800 (phone portrait):**
```text
┌────────────────────────────┐
│ [☰] GaGet.dev       [☾]    │  Shared header
├────────────────────────────┤
│ Useful online tools        │
│ Simple tools for daily     │
│ work, right in your browser│
│ [ Search tools…          ] │
│                            │
│ POPULAR TOOLS              │
│ ┌────────────────────────┐ │
│ │ [photo] Photo Editor   │ │
│ │ Edit, crop, filter…    │ │
│ │ Open editor         →  │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ [icon] Tool card       │ │
│ │ Short description      │ │
│ └────────────────────────┘ │
│                            │
│ BROWSE CATEGORIES          │
│ [Images] [Audio]           │
│ [Date & Time]              │
│ [Generators] [JSON]        │
│ … vertical scroll …        │
└────────────────────────────┘
```

**SM — 640–767px (large phone / short landscape):**
```text
┌──────────────────────────────────────────────────────┐
│ [☰] GaGet.dev                       [Search] [☾]     │
├──────────────────────────────────────────────────────┤
│ Useful online tools                                  │
│ [ Search tools…                                  ]  │
│ POPULAR TOOLS                                        │
│ ┌───────────────────────┐ ┌────────────────────────┐│
│ │ Photo Editor          │ │ Other popular tool     ││
│ │ Crop, filter, export  │ │ Description            ││
│ └───────────────────────┘ └────────────────────────┘│
│ CATEGORIES                                           │
│ [Images] [Audio] [Date & Time] [Generators]          │
│ [JSON] [Encoding] [Text] …                           │
└──────────────────────────────────────────────────────┘
```
Use a two-column card layout only when the available content width supports comfortable cards; otherwise stay one column. In short landscape, prioritize the search and first tool row; avoid forcing a tall hero.

**MD — 768–1023px (tablet):**
```text
┌────────────────────────────────────────────────────────────────┐
│ [☰] GaGet.dev                         Search / theme / language │
├────────────────────────────────────────────────────────────────┤
│ Useful online tools                                             │
│ Find a quick tool for your next task.                           │
│ [ Search tools…                                             ]  │
│                                                                  │
│ POPULAR TOOLS                                                    │
│ ┌────────────────────────────┐ ┌──────────────────────────────┐ │
│ │ Photo Editor               │ │ Popular tool                 │ │
│ │ Edit images locally        │ │ Short description            │ │
│ └────────────────────────────┘ └──────────────────────────────┘ │
│ ┌────────────────────────────┐ ┌──────────────────────────────┐ │
│ │ Popular tool               │ │ Popular tool                 │ │
│ └────────────────────────────┘ └──────────────────────────────┘ │
│ BROWSE CATEGORIES                                                │
│ [Images] [Audio] [Date & Time] [Generators] [JSON] …             │
└────────────────────────────────────────────────────────────────┘
```

**LG — 1024–1279px (small desktop):**
```text
┌──────────────────────┬───────────────────────────────────────────┐
│ Fixed site sidebar   │ Shared top header / search / preferences  │
│ 248px expanded       ├───────────────────────────────────────────┤
│ Home                 │ Hero + search                             │
│ Popular              │                                           │
│ All tools            │ POPULAR TOOLS                             │
│ Favorites            │ ┌─────────────────┐ ┌───────────────────┐ │
│ Categories…          │ │ Photo Editor    │ │ Popular tool      │ │
│                      │ └─────────────────┘ └───────────────────┘ │
│                      │ Category grid / further tool discovery    │
└──────────────────────┴───────────────────────────────────────────┘
```

**XL — 1280–1535px (desktop):**
```text
┌──────────────────────┬──────────────────────────────────────────────────────┐
│ Sidebar (248px)      │ Header / search / language / appearance              │
│                      ├──────────────────────────────────────────────────────┤
│ Home                 │                Hero + search                         │
│ Popular              │                                                      │
│ All tools            │ POPULAR TOOLS                                        │
│ Favorites            │ ┌─────────────┐ ┌─────────────┐ ┌──────────────────┐ │
│ Categories           │ │Photo Editor │ │Popular tool │ │Popular tool      │ │
│                      │ └─────────────┘ └─────────────┘ └──────────────────┘ │
│                      │ Browse categories and tool groups                    │
└──────────────────────┴──────────────────────────────────────────────────────┘
```

**2XL — 1536px and wider:**
```text
┌──────────────────────┬────────────────────────────────────────────────────────────────┐
│ Sidebar              │ Header                                                         │
│ 248px or 64px        ├────────────────────────────────────────────────────────────────┤
│                      │       ┌──────────────── max-width content ───────────────┐     │
│ Navigation           │       │ Hero + search                                    │     │
│ remains fixed        │       │ Popular tools: 3–4 readable cards per row         │     │
│                      │       │ Category sections with consistent card widths    │     │
│                      │       └──────────────────────────────────────────────────┘     │
└──────────────────────┴────────────────────────────────────────────────────────────────┘
```

## 5. Unified Photo Editor

### 5.1 Core workspace regions

- **Shared site navigation:** hamburger on widths below 1024px; persistent sidebar at 1024px and above.
- **Editor command bar:** remains at the top of the editor viewport and stays visible while the workspace scrolls. It must not overlap the brand/header or the site sidebar.
- **File menu:** open photo, export image, and related file actions; compact dropdown aligned to its trigger.
- **Edit / Image / Create menus (desktop):** grouped commands for the same feature inventory as the mobile Features menu.
- **Features menu (below 1024px):** compact dropdown anchored to the Features trigger, right-aligned to that trigger, capped at 256px (and viewport width minus margins), with internal vertical scrolling. It must never become viewport-wide on a large phone or tablet.
- **History/utility controls:** Undo, Redo, Reset, zoom out/in, fit/zoom, and export where available. Disabled actions must communicate their disabled state.
- **Canvas stage:** primary region, centered with a neutral/checkerboard surface as appropriate; preserve image aspect ratio and allow two-axis scrolling for zoom above fit.
- **Feature inspector:** contains only the active feature's controls. Do not display multiple feature panels simultaneously.
- **Empty state:** clear Open photo action, supported formats, file size/pixel limits, and privacy message.
- **Loaded state:** filename/status, canvas, dimensions where relevant, undo/redo availability, and export.
- **Error/success state:** inline status near the triggering workflow, not a blocking browser alert.

### 5.2 Complete photo-editing feature inventory

The current Features menu groups 13 primary capabilities:

| Group | Feature | Key controls / behavior |
|---|---|---|
| Edit | Crop | Interactive crop box; Free, 1:1, 4:3, 3:2, 16:9 ratios; width/height where applicable; reset selection; save crop; undo can restore changes |
| Edit | Resize | Output width/height; lock aspect ratio; enforce safe pixel/dimension limits |
| Edit | Text & watermark | Add/edit text layers; position on canvas; font family, size, color, bold/italic, rotation, opacity |
| Image | Color & filters | Brightness, contrast, saturation, grayscale, sepia, blur; filter presets |
| Image | Color picker | Sample a color from the image; show usable color values |
| Image | Image details | Inspect image dimensions and relevant file/image information |
| Image | Export & convert | Export image and choose supported output format/quality where applicable |
| Image | Print size | Print dimensions and DPI-based sizing controls |
| Image | Image to Base64 | Encode image data into Base64/data URL for copy/download |
| Image | Base64 to image | Decode supported Base64/data URL input to an image/download workflow |
| Create | Favicon | Generate favicon output from the loaded image |
| Create | Collage | Add multiple local images and arrange a collage |
| Create | SVG optimize | Load SVG and remove comments/redundant whitespace; do not imply full SVGO-level semantic optimization |

**Related canvas actions:** rotate, flip horizontal/vertical, zoom, fit-to-view, undo, redo, reset edits, and export. These are editor actions or controls, not additional top-level tools. Where an operation is not currently available for a given source type, disable or hide it with a clear reason.

**Filter presets currently represented in code:** Original, Vivid, Warm, Vintage, Black & white, Dramatic. Presets are shortcuts over the adjustment controls; selecting a slider returns the preset state to Custom.

**Supported raster input currently described in code:** PNG, JPEG, WebP, GIF, and AVIF; maximum file size 25 MB and maximum 50 megapixels. SVG optimization is a separate SVG-specific workflow. Keep these limits consistent in UI copy and tests.

### 5.3 Feature inspector behavior by viewport

- **XS/SM/MD (<1024px):** selecting a feature opens a mobile contextual panel/bottom sheet over the editor workspace. Keep the canvas visible behind/above the panel where the viewport permits. The collapsed sheet should consume no more than roughly 24dvh; expanded panel has an internal scroll region and is capped around 70dvh. Provide a clear close X, accessible heading, and predictable focus restoration. The panel must not create simultaneous vertical and horizontal page scrolling.
- **LG/XL/2XL (1024px+):** active feature opens a right-side contextual inspector; the canvas remains the main workspace and is resized to fit the remaining width. Inspector width should be bounded (target roughly 300–360px, tuned to the actual controls); do not let the inspector dominate ultra-wide screens.
- **Tablet portrait (e.g. 768 × 1024):** keep the mobile navigation drawer pattern. Feature controls may use a compact bottom sheet; do not force a narrow two-column editor. If the desktop inspector is enabled at a later breakpoint, it must pass width-specific usability tests first.
- **Landscape phones:** use dynamic viewport height, cap panels by viewport height, and keep menu and panel contents scrollable. Never place a fixed-height control list below the fold without an internal scroll path.

### 5.4 Editor wireframes — XS, 360 × 800

**Empty state:**
```text
┌────────────────────────────┐
│ [☰] File             Features│  Sticky editor command bar
├────────────────────────────┤
│                            │
│       ┌────────────┐       │
│       │   [photo]  │       │
│       │ Open photo │       │
│       └────────────┘       │
│ Choose PNG/JPEG/WebP/GIF/  │
│ AVIF · local processing    │
│                            │
│ [Undo] [Redo] [−] [Fit] [+]│
├────────────────────────────┤
│ Canvas / editor workspace  │
└────────────────────────────┘
```

**Loaded image, no panel:**
```text
┌────────────────────────────┐
│ [☰] File             Features│
├────────────────────────────┤
│ photo.jpg · 2400 × 1600    │
│                            │
│ ┌────────────────────────┐ │
│ │                        │ │
│ │       IMAGE CANVAS     │ │
│ │                        │ │
│ └────────────────────────┘ │
│                            │
│ [Undo] [Redo] [−] [Fit] [+]│
└────────────────────────────┘
```

**Features dropdown open (must remain compact):**
```text
┌────────────────────────────┐
│ [☰] File             Features│
│                    ┌───────┐│
│                    │ EDIT  ││
│                    │ Crop  ││
│                    │ Resize││
│                    │ Text  ││
│                    │ IMAGE ││
│                    │ Color ││
│                    │ Picker││
│                    │ Details│
│                    │ Export││
│                    │ Print ││
│                    │ Base64││
│                    │ CREATE││
│                    │ Favicon│
│                    │Collage││
│                    │ SVG   ││
│                    └───────┘│
│       Canvas remains behind │
└────────────────────────────┘
```
The actual dropdown is a narrow panel (max 256px), anchored to the Features trigger. It scrolls internally when its list exceeds available height.

**Active feature panel open (e.g. Color & filters):**
```text
┌────────────────────────────┐
│ [☰] File             Features│
├────────────────────────────┤
│      Canvas preview         │
│   ┌────────────────────┐   │
│   │     photo.jpg      │   │
│   └────────────────────┘   │
├────────────────────────────┤
│ ─────── drag / resize ───── │
│ Color & filters          [×]│
│ Preset [Vivid          ▾]  │
│ Brightness        100%      │
│ [──────●──────────────]     │
│ Contrast          100%      │
│ [──────●──────────────]     │
│ Saturation        100%      │
│ [──────●──────────────]     │
│ … internal vertical scroll …│
└────────────────────────────┘
```

### 5.5 Editor wireframes — SM, 640–767px

```text
┌──────────────────────────────────────────────────────┐
│ [☰] File                               Features      │
├──────────────────────────────────────────────────────┤
│ filename.jpg · 2400 × 1600 · Local                   │
│                                                      │
│        ┌────────────────────────────────┐            │
│        │                                │            │
│        │          IMAGE CANVAS          │            │
│        │                                │            │
│        └────────────────────────────────┘            │
│                                                      │
│ [Undo] [Redo] [Reset] [−] [Fit] [+] [Export]         │
└──────────────────────────────────────────────────────┘
```
Feature panel appears as a bottom sheet when selected. Dropdown remains right-aligned to the Features trigger and must be less than the viewport width by a comfortable margin.

### 5.6 Editor wireframes — MD, 768–1023px (tablet)

**Portrait, 768 × 1024:**
```text
┌────────────────────────────────────────────────────────────────┐
│ [☰] File                                           Features    │
├────────────────────────────────────────────────────────────────┤
│ photo.jpg · dimensions / local status                           │
│                                                                │
│            ┌────────────────────────────────┐                  │
│            │                                │                  │
│            │          IMAGE CANVAS          │                  │
│            │                                │                  │
│            └────────────────────────────────┘                  │
│                                                                │
│ [Undo] [Redo] [Reset] [−] [Fit] [+] [Export]                   │
├────────────────────────────────────────────────────────────────┤
│ Collapsed feature sheet (≤ about 24dvh)                        │
│ Color & filters                                      [Expand]  │
└────────────────────────────────────────────────────────────────┘
```
Expanded sheet grows upward with internal scrolling, capped at about 70dvh. Do not squeeze the canvas into a narrow side-by-side split at tablet portrait widths.

**Landscape, 844 × 390:**
```text
┌────────────────────────────────────────────────────────────────────────┐
│ [☰] File                                                   Features    │
├─────────────────────────────────────────────┬──────────────────────────┤
│                                             │ Color & filters       [×]│
│               IMAGE CANVAS                 │ Preset [Vivid       ▾]  │
│                                             │ Brightness [────●───]   │
│                                             │ Contrast   [────●───]   │
│                                             │ … panel scroll …        │
├─────────────────────────────────────────────┴──────────────────────────┤
│ [Undo] [Redo] [−] [Fit] [+] [Export]                                   │
└────────────────────────────────────────────────────────────────────────┘
```
This is a short-height layout: cap the panel using dVH, ensure both canvas and controls remain reachable, and avoid fixed overlays that cover the entire canvas without an exit path.

### 5.7 Editor wireframes — LG, 1024–1279px

```text
┌──────────────────────┬────────────────────────────────────────────────────┐
│ Shared sidebar       │ Editor command bar: File | Edit | Image | Create    │
│ (248px or 64px)      ├──────────────────────────────────┬─────────────────┤
│                      │                                  │ Inspector       │
│                      │                                  │ (300–340px)     │
│                      │           IMAGE CANVAS           │ Color & filters │
│                      │                                  │ Preset          │
│                      │                                  │ Brightness      │
│                      │                                  │ Contrast        │
│                      │                                  │ Saturation      │
│                      │                                  │ Grayscale       │
│                      │                                  │ Sepia / Blur    │
│                      ├──────────────────────────────────┴─────────────────┤
│                      │ Zoom / history / export actions                     │
└──────────────────────┴────────────────────────────────────────────────────┘
```
If the sidebar is expanded and the inspector is open, preserve a usable minimum canvas width. At 1024px the sidebar can be collapsed or the inspector can use an overlay if the available content width is insufficient. Never overlap the sidebar or put the editor command bar under the shared site header.

### 5.8 Editor wireframes — XL, 1280–1535px

```text
┌──────────────────────┬────────────────────────────────────────────────────────────┐
│ Shared sidebar       │ File | Edit | Image | Create | Undo | Redo | Export         │
│ 248px                ├─────────────────────────────────────────────┬──────────────┤
│                      │                                             │ Inspector    │
│ Navigation           │                                             │ 320–360px    │
│ categories           │               IMAGE CANVAS                  │ active tool  │
│                      │                                             │ controls     │
│                      │                                             │              │
│                      ├─────────────────────────────────────────────┴──────────────┤
│                      │ Status / dimensions / zoom / fit controls                  │
└──────────────────────┴────────────────────────────────────────────────────────────┘
```

### 5.9 Editor wireframes — 2XL, 1536px and wider

```text
┌──────────────────────┬──────────────────────────────────────────────────────────────────────┐
│ Sidebar              │ Editor command bar                                                   │
│ expanded or collapsed├──────────────────────────────────────────────────────────────────────┤
│                      │    ┌──────────────────── workspace max-width / centered ─────────┐   │
│                      │    │ Canvas stage with image centered and zoom scroll as needed   │   │
│                      │    │                                            Inspector 320–360 │   │
│                      │    │                                            Active controls   │   │
│                      │    └──────────────────────────────────────────────────────────────┘   │
│                      │ Status / history / zoom controls                                     │
└──────────────────────┴──────────────────────────────────────────────────────────────────────┘
```
Do not scale the inspector with the viewport. Keep image canvas large enough for detail, but maintain a comfortable maximum width for control forms and metadata.

## 6. Menus and command grouping

### Mobile Features dropdown

- Trigger stays at the trailing edge of the editor command bar; File stays at the leading edge.
- Dropdown width: `min(16rem, calc(100vw - 1.5rem))`; align its trailing edge to the trigger wrapper.
- Maximum height: `min(70dvh, 420px)`; internal vertical scroll; no horizontal overflow.
- Sections:
  - **Edit:** Crop, Resize, Text & watermark
  - **Image:** Color & filters, Color picker, Image details, Export & convert, Print size, Image to Base64, Base64 to image
  - **Create:** Favicon, Collage, SVG optimize
- Menu opens above the canvas content layer and below the sticky command bar. It must not cover the GaGet brand/hamburger or escape the viewport.
- Selecting a feature closes the menu and opens exactly one corresponding inspector/panel.

### Desktop command menus

- Group features as **Edit**, **Image**, and **Create**; retain consistent feature names with the mobile list.
- Menu dropdowns anchor to their own triggers, fit the viewport, and use internal scrolling if necessary.
- Do not add duplicated features just to fill menu space.
- File menu should prioritize Open photo and Export image; actions that require a loaded image are disabled until an image is present.

## 7. Responsive acceptance criteria

### Layout and overflow
- [ ] No horizontal page overflow at 320, 360, 390, 640, 744, 768, 844, 1024, 1280, 1440, and 1536px widths.
- [ ] Homepage stays one column below comfortable card widths and uses progressive columns only when cards remain readable.
- [ ] At widths below 1024px, hamburger is visible without scrolling and remains associated with the shared header/navigation.
- [ ] At 1024px and above, sidebar is fixed and content offset accounts for 248px expanded / 64px collapsed widths.
- [ ] Mobile drawer overlays rather than pushes the page; Language and Appearance are separate captioned rows.
- [ ] Feature dropdown remains compact, trigger-aligned, and internally scrollable at 360, 390, 640, 744, 768, and 844px widths.
- [ ] At tablet portrait widths, the editor does not force cramped side-by-side canvas and inspector columns.
- [ ] Landscape layouts with low viewport height keep menu/panel controls reachable using internal scrolling.
- [ ] Inspector and page content remain bounded on 1536px+ displays.

### Photo editing
- [ ] All 13 primary features in §5.2 are discoverable through the Features menu and desktop command groups.
- [ ] Opening a feature closes the menu and shows only that feature's panel.
- [ ] Canvas remains visible/usable while a feature panel is open, according to the relevant viewport wireframe.
- [ ] Crop ratios, resize aspect lock, text layers, filter presets/sliders, color sampling, image details, export/convert, print size, Base64 workflows, favicon, collage, and SVG optimize have documented controls and accessible names.
- [ ] Undo/redo/reset states match the actual editing history; disabled states are visually and semantically disabled.
- [ ] Upload and export messages accurately describe supported formats and limits; local processing/privacy messaging remains visible.
- [ ] Zoom above fit stays reachable with two-axis scrolling; fit returns the image to the workspace without unwanted max-size clamping.

### Accessibility and localization
- [ ] Every icon-only control has an accessible name and tooltip where appropriate.
- [ ] Drawer, dropdown, and inspector can be operated by keyboard and dismissed with Escape.
- [ ] Focus returns to the invoking control when a menu/panel closes.
- [ ] Contrast, focus rings, and touch target sizes meet the project's accessibility baseline.
- [ ] RTL layout mirrors navigation placement and direction-sensitive spacing without changing the information hierarchy.
- [ ] Layout remains functional at 200% zoom and with long translated labels.

## 8. Recommended visual regression viewport matrix

Run Playwright screenshot/layout checks for at least these representative viewports:

| Purpose | Viewport |
|---|---|
| Minimum supported narrow phone | 320 × 720 |
| Phone portrait | 360 × 800 |
| Common phone portrait | 390 × 844 |
| Large phone landscape | 844 × 390 |
| Tablet portrait | 768 × 1024 |
| Tablet landscape | 1024 × 768 |
| Small desktop | 1280 × 800 |
| Desktop | 1440 × 900 |
| Wide desktop | 1536 × 960 |
| Ultra-wide desktop | 1920 × 1080 |

For each viewport, inspect homepage default, navigation closed/open, editor empty/loaded, Features dropdown open, and a representative feature panel open. Add RTL screenshots for a Persian or Arabic locale. Automated geometry assertions should check bounds and alignment rather than fragile exact pixels where browser font rendering can differ.

## 9. Implementation notes and change control

- Keep this file updated when a layout decision changes. Record the implementation branch and test evidence in `current_working.md`.
- Treat the ASCII diagrams as structural wireframes; spacing, colors, typography, icons, and exact copy can be refined during visual implementation as long as the acceptance criteria remain true.
- Do not use this specification as proof of test success. Record the exact CI run and commit SHA after testing.
- Do not add a second Photo Editor navigation system or create separate top-level apps for the 13 integrated editor features.
