# Lower showcase sections

Target files: sections.html (HTML fragment for main to assemble), sections.css, sections.js.
Reference screenshot: docs/design-references/vanta-desktop.png (research agent producing).
Interaction model: reveal on scroll, click for gallery and viewing angle. New custom design using Vanta inspiration; values below are project choices.

## Shared foundation
Body #08090b foreground #f2f0ec, muted #989a9e, red #f03a3e. Display var(--font-display) Barlow Condensed/Impact, body var(--font-body) Manrope/Arial. Desktop gutter var(--gutter) 56px; mobile22px. No rounded dashboard cards. Fine borders rgba(255,255,255,.14), editorial headers and big automotive typography. Mobile breakpoint 760px.

## Sections
1. #performance section: heading “MỘT BIỂU TƯỢNG. / KHÔNG THỎA HIỆP.” intro. Three/four open stat rows 6.2 L / V8 LT1, 455 HP (base Stingray), 7 cấp / số sàn and RWD. Small note “Thông số tham khảo Corvette C7 Stingray tiêu chuẩn.” Base brochure: https://cdn.dealereprocess.org/cdn/brochures/chevrolet/2019-corvette.pdf. Full-width cinematic display using assets/rear.webp with giant translucent C7 background typography, studio gradients and wheel-contact ellipse shadow via CSS. Narrative about American icon. Do not invent measured performance for modified pictured car.
2. #details section: strong heading “ÁM ẢNH / TỪNG CHI TIẾT.” Three wide image panels, using assets/detail-wheel.webp, detail-tail.webp, front.webp, with headings Mâm đen. Phanh đỏ.; Dấu ấn đèn hậu.; Sắc cạnh C7. Can implement horizontal overflow scroll rail with accessible previous/next buttons or CSS grid; main may add scroll-driven rail. Crop appropriately so car closeups fill panels, but no white background. Black, red highlights.
3. #collection section: car viewing angle selector front/threequarter/rear with large image on subtle stage, selected nav state and title. assets/hero.webp front3quarter, front.webp directfront, rear.webp rear. Add button “Xem bộ ảnh” opens #gallery-dialog containing all18 thumbnails from assets/view-01.webp ... view-18.webp, and a large selected image plus previous/next, image counter, close. Native dialog, accessible labels, keyboard arrows, lazy thumbnails. Captions honest “Góc nhìn 01” etc.
4. #contact final CTA: oversize statement “DÀNH CHO / NGƯỜI KHÁC BIỆT.” Main action “Khám phá bộ ảnh” opens samegallery; secondary anchor #unveil reruns reveal when scrolltop. Footer ZUZONG CAR / CORVETTE C7 / © 2026 with inline text “Một góc nhìn về biểu tượng Mỹ.” No fake email/booking/backend and no developer messages in UI.

## DOM/JS contract
Keep all CSS names under .performance, .detail*, .collection*, .contact*, .site-footer, .gallery* to avoid hero conflicts. Common .section-title/.eyebrow/.reveal/.button supported by foundation. Export window.initShowcase = function() from sections.js; main calls once after DOM assembled. Stateless buttons and modal robust. Each primary section has aria-labelledby. No duplicate h1. CSS vars useful. Inline SVG only for simple UI arrows. Transitions≤350ms except subtle entry. Provide reduced-motion behavior.

## Verification
Static HTML CSS JS; no TypeScript or npm build required by user. Check node --check sections.js, no missing DOM references on init; main runs browser QA after assembly. Do not edit index.html/styles.css/app.js. Filesystem shared, no git repo therefore worktrees inapplicable.
