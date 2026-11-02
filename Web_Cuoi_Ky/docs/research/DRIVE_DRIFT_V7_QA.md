# Corvette drift V7 integration

- Replaced only the performance driving scene in sections.html, assembled into index.html.
- Extracted all 60 frames from the supplied 1920x1080, 24 FPS, 2.5-second V7 MP4.
- Desktop: 1600x900; mobile: 960x540; lightweight preview: 400x225. All 180 WebP files verified.
- Scroll controls forward/reverse playback, adjacent frames blend, and specifications reveal in sequence.
- Sharp frame cache capped at 12 desktop / 8 mobile; loads begin near the chapter.
- Preserved existing specification values and reference note.
- Browser QA passed at 1440x900, 1920x1080, 820x1024, 390x844, 320x568. No page errors, failed asset responses, or horizontal overflow. Forward/reverse endpoints: 0 and 59. Reduced motion passed.
- Continuous scroll checks passed: 58 distinct frames in each desktop/mobile sweep; monotonic progression. Breakpoint resizing and poster fallback on frame-fetch failures passed.
- Evidence: output/playwright/drift-v7-qa.json; output/playwright/drift-v7-motion-qa.json; drift-v7-*.png.
- Build: node scripts/build.cjs passed; dist contains the new sequence.
- Preview: http://127.0.0.1:4173/#performance
- Prior implementation copies: tmp/drive-before-v7/.
- Validation uses desktop Chrome with simulated viewport sizes. Physical phone testing and hosted deployment are not included.

## Text directly over the driving scene
- Removed specification panel backgrounds, borders, shadows and backdrop blur.
- Extended the scene to the full stage, with white specification text over the image and soft text shadows for readability.
- Compact screens retain the full car in a sharp image and extend the moving road underneath the specification text.
- Existing scroll playback and staggered specification reveal are retained.
- Rebuilt dist and repeated responsive, reverse-scroll, reduced-motion, resize, continuous-motion and fetch-fallback checks.
