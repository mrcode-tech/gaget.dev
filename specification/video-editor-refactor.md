# Video Editor refactor and capability contract

## Shared UI stages
- Stage 1: the /video/editor route uses the same full-viewport shell, 68px editor header, fixed navigation behavior, Lucide hamburger, File menu and responsive Features menu as Photo and Audio Editors.
- Stage 2: all 23 feature actions remain grouped under Edit, Adjust, Analyze, Export & data, and Record. Feature labels describe actions; the tool remains named Video Editor and its catalog category is Video.
- Stage 3: the browser-native processing path uses canvas rendering plus source-media audio capture when supported. Exports remain local and browser/codec dependent. The UI must disclose real-time recording and capability limits.
- Stage 4: component tests cover empty state, File menu, all 23 grouped features, icon navigation and full-screen shell routing.

## Capability contract
The native browser implementation supports video preview, selected-range WebM recording, canvas transforms and filters, PNG frame capture, metadata display, subtitle sidecar export, Base64 encode/decode and audio-track recording when captureStream exposes audio. A split operation exports two separate WebM segments. The browser does not provide a native GIF encoder, motion-estimation stabilizer, reliable reverse-frame muxer, or general MP4/MOV transcoder; these must be explicitly reported as unavailable instead of presented as successful. Merge remains disabled until a multi-clip mux/sequence engine is integrated.

## Manual verification matrix
- Mobile: File and Features are visible; menus fit the viewport and scroll independently; selected feature settings follow the preview in the vertical workspace.
- Tablet: editor route suppresses the ordinary site header, preserves the 68px spacer, and uses a constrained settings column only when enough width is available.
- Desktop: editor route offsets for the sidebar, uses grouped desktop menus and keeps preview/timeline plus settings within the viewport.
- Media: verify actual browser codec support, seek completion, audio-track presence, output duration, dimensions and download.
