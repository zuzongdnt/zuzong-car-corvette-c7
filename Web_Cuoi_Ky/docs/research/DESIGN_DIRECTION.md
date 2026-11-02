# Zuzong Car / Corvette C7

Reference: https://www.draftly.space/preset-sites/vanta
User requests a frontend only, HTML/CSS/JavaScript adaptation with Corvette C7 imagery and a scroll-operated car cover reveal. This is a new branded interpretation, not a pixel-identical clone.

## Foundation
- Background #08090b; raised surface #111316; foreground #f2f0ec; muted #989a9e; accent #f03a3e.
- Fonts: Barlow Condensed 700/800 display, Manrope or Inter body with Vietnamese glyphs. Local fallback Impact and Arial.
- Desktop gutter 56px at 1440px; mobile gutter 22px at 390px; square edges and fine border lines.
- Large editorial headings, photographic car cutouts, asymmetric layouts, very few containers.
- Actual source photos: output/xe_4k/xe_01_4K.png through xe_18_4K.png. AI restored in the prior authorized task. Web copies preserve alpha.
- Frontend only; no backend or invented sales inventory. Actions expose car details and an image gallery.

## Interaction
- Hero: 280svh scroll area, 100svh sticky stage, normalized scroll progress drives a cover lift, reveal opacity, car transform and progress.
- Subsequent sections: intersection-based text reveals, count-up technical numbers, scroll progress through a horizontal detail rail on desktop, normal stacked detail cards on mobile.
- Gallery: keyboard-operable view selector and modal with all 18 source views, previous/next controls, focus containment and close.
- Reduced motion: complete car revealed, no pinned multi-viewport choreography, visible content, static detail grid.
- Mobile navigation: disclosure menu with real in-page anchor targets.

## Copy
Vietnamese narrative with concise English model labels. Car engine figures are base Corvette C7 Stingray references, not claims of measured output of this modified photographed vehicle.
