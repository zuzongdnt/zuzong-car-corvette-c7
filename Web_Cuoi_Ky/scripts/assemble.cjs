const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');
const hero=fs.readFileSync(path.join(root,'hero.html'),'utf8'),showcase=fs.readFileSync(path.join(root,'sections.html'),'utf8');
const campaign=fs.readFileSync(path.join(root,'campaign.html'),'utf8');
const html=`<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#08090b">
<meta name="description" content="ZEPHYRON — Studio 3D tương tác 5 hãng xe. Đổi màu sơn, heo phanh và mâm, lưu cấu hình và đặt trước.">
<title>ZEPHYRON — Studio 5 hãng xe</title>
<link rel="icon" href="assets/brand-monochrome/zephyron-symbol.svg" type="image/svg+xml">
<link rel="preload" href="assets/unveil-five-full/frame-000.webp" as="image" media="(min-width: 761px)">
<link rel="preload" href="assets/unveil-five-full/mobile/frame-000.webp" as="image" media="(max-width: 760px)">
<link rel="stylesheet" href="assets/fonts/fonts.css">
<link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="hero.css"><link rel="stylesheet" href="sections.css"><link rel="stylesheet" href="journal.css"><link rel="stylesheet" href="campaign.css">
<link rel="stylesheet" href="bottom-nav.css"><script src="bottom-nav.js" defer></script>
<link rel="stylesheet" href="drive-scroll.css"><script src="drive-scroll.js" defer></script>
<link rel="stylesheet" href="car-viewer.css"><link rel="stylesheet" href="studio.css"><link rel="stylesheet" href="site.css"><script type="module" src="studio.js"></script><script type="module" src="site.js"></script>
<link rel="stylesheet" href="unveil-five.css">
<link rel="stylesheet" href="monochrome.css">
<link rel="stylesheet" href="studio-scroll.css"><script type="module" src="studio-scroll.js"></script>
</head><body>
${hero.replace('<!--CAMPAIGN-->',campaign).replace('<!--SHOWCASE-->',showcase)}
<script src="campaign-config.js"></script><script src="campaign.js"></script><script src="sections.js"></script><script src="reveal-sequence.js"></script><script src="app.js"></script><script type="module" src="unveil-five.js"></script>
</body></html>`;
fs.writeFileSync(path.join(root,'index.html'),html);
console.log('Assembled index.html');
