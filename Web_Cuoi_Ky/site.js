import './editorial-data.js';
import {cars,palettes,labels,money,getCar,cleanConfig,colorOf,configurationPrice,readStore,writeStore,configText,poster} from './studio-data.js';
const filename=location.pathname.split('/').pop()||'index.html';
const params=new URLSearchParams(location.search);
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list=key=>{const value=readStore(key,[]);return Array.isArray(value)?value:[];};
const navItems=[['index.html','Trang chủ'],['about.html','Giới thiệu'],['products.html','Sản phẩm'],['explore.html','Khám phá'],['gallery.html','Bộ sưu tập']];
const navHTML=()=>navItems.map(([href,label])=>`<a href="${href}"${filename===href?' aria-current="page"':''}>${label}</a>`).join('');
const brandRightsHTML=()=>`<section class="brand-rights" aria-labelledby="brand-rights-title">
  <h2 id="brand-rights-title">Bản quyền thương hiệu</h2>
  <p>Tên thương hiệu, biểu trưng và tên các dòng xe xuất hiện trên website thuộc quyền của các chủ sở hữu tương ứng.</p>
  <dl class="brand-rights-list">
    <div><dt><a href="https://www.gm.com/copyright-trademark.html"><img class="brand-rights-logo brand-rights-logo--chevrolet" src="assets/brands/chevrolet.svg" width="88" height="58" alt="" loading="lazy" decoding="async"><span>Chevrolet / Corvette</span></a></dt><dd>General Motors</dd></div>
    <div><dt><a href="https://www.bmw.ie/en/footer/footer-section/legal-notice.html"><img class="brand-rights-logo" src="assets/brands/bmw.svg" width="58" height="58" alt="" loading="lazy" decoding="async"><span>BMW</span></a></dt><dd>BMW AG và các đơn vị liên quan</dd></div>
    <div><dt><a href="https://newsroom.porsche.com/en_US/legal-notice.html"><img class="brand-rights-logo" src="assets/brands/porsche.svg" width="58" height="58" alt="" loading="lazy" decoding="async"><span>Porsche</span></a></dt><dd>Dr. Ing. h.c. F. Porsche AG</dd></div>
    <div><dt><a href="https://group.mercedes-benz.com/provider/"><img class="brand-rights-logo" src="assets/brands/mercedes.svg" width="58" height="58" alt="" loading="lazy" decoding="async"><span>Mercedes-Benz / AMG</span></a></dt><dd>Mercedes-Benz Group AG</dd></div>
    <div><dt><a href="https://www.lamborghini.com/en-en/privacy-legal"><img class="brand-rights-logo" src="assets/brands/lamborghini-shield.png" width="58" height="58" alt="" loading="lazy" decoding="async"><span>Lamborghini</span></a></dt><dd>Automobili Lamborghini S.p.A.</dd></div>
  </dl>
  <p>ZEPHYRON là đồ án thiết kế độc lập, không phải website chính thức và không thể hiện quan hệ đại diện, tài trợ hoặc hợp tác với các hãng xe. <a href="sources.html">Xem nguồn hình ảnh, model 3D và giấy phép sử dụng.</a></p>
</section>`;
function navigation(){
  const target=document.querySelector('[data-site-header]');
  if(target)target.innerHTML=`<header class="z-header"><a class="z-brand" href="index.html"><img src="assets/brand-monochrome/zephyron-horizontal-black.svg" alt="ZEPHYRON" width="1634" height="804"></a><nav class="z-main-nav" id="z-main-nav" aria-label="Điều hướng chính">${navHTML()}<a class="z-mobile-account" href="account.html"${filename==='account.html'?' aria-current="page"':''}>Tài khoản</a></nav><div class="z-header-tools"><a href="account.html"${filename==='account.html'?' aria-current="page"':''}>Tài khoản</a><a href="cart.html" aria-label="Giỏ đặt trước">Giỏ <span class="z-cart-count" data-cart-count>0</span></a></div><button type="button" class="z-menu" aria-expanded="false" aria-controls="z-main-nav" aria-label="Mở menu">☰</button></header>`;
  const old=document.querySelector('.site-header');
  if(old){
    const desktop=old.querySelector('.desktop-nav');if(desktop)desktop.innerHTML=navHTML();
    const mobile=old.querySelector('.mobile-nav');if(mobile)mobile.innerHTML=navHTML()+'<a href="account.html">Tài khoản</a><a href="cart.html">Giỏ đặt trước</a>';
    const cta=old.querySelector('.header-cta');if(cta){cta.href='cart.html';cta.innerHTML='GIỎ ĐẶT TRƯỚC <span data-cart-count>0</span>';}
    if(!old.querySelector('.z-legacy-account')){const account=document.createElement('a');account.className='z-legacy-account';account.href='account.html';account.textContent='Tài khoản';old.insertBefore(account,old.querySelector('.menu-toggle'));}
  }
  const oldFooter=document.querySelector('.site-footer .footer-navigation');
  if(oldFooter&&!oldFooter.querySelector('[href="contact.html"]'))oldFooter.insertAdjacentHTML('beforeend','<a href="contact.html">Liên hệ / Showroom ↗</a><a href="policies.html">Bảo mật & điều kiện ↗</a><a href="sources.html">Nguồn hình & model ↗</a>');
  const footer=document.querySelector('[data-site-footer]');
  if(footer)footer.innerHTML=`<footer class="z-footer"><div class="z-container"><div class="z-footer-top"><div><a class="z-footer-word" href="index.html"><img src="assets/brand-monochrome/zephyron-black.svg" alt="ZEPHYRON" width="1634" height="804" loading="lazy"></a><p>Năm cá tính. Một dấu ấn riêng.</p></div><div class="z-footer-links"><div><a href="products.html">Studio xe</a><a href="about.html">Thương hiệu ZEPHYRON</a><a href="contact.html">Liên hệ / Showroom</a></div><div><a href="news.html">Tin tức / Bài viết</a><a href="sources.html">Nguồn hình & model</a><a href="policies.html">Bảo mật & điều kiện đặt trước</a></div></div></div><div class="z-footer-bottom"><span>© 2026 ZEPHYRON / ĐỒ ÁN THIẾT KẾ ĐỒ HỌA</span><span>Giá giả lập. Yêu cầu và tài khoản được mô phỏng trên trình duyệt.</span></div></div></footer>`;
  const toggle=document.querySelector('.z-menu');
  document.querySelectorAll('.site-footer,.ed-footer,.z-footer').forEach(element=>{
    const bottom=element.querySelector('.footer-bottom,.ed-footer-bottom,.z-footer-bottom');
    if(bottom&&!element.querySelector('.brand-rights'))bottom.insertAdjacentHTML('beforebegin',brandRightsHTML());
  });
  const close=()=>{toggle?.setAttribute('aria-expanded','false');toggle?.setAttribute('aria-label','Mở menu');document.querySelector('.z-main-nav')?.classList.remove('is-open');};
  toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Đóng menu':'Mở menu');document.querySelector('.z-main-nav').classList.toggle('is-open',open);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')close();});
  document.addEventListener('click',event=>{if(!event.target.closest('.z-header'))close();});
  addEventListener('resize',()=>{if(innerWidth>760)close();});
  updateCount();
}
function updateCount(){document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=list('cart').length);}
addEventListener('zuzong-cart',updateCount);addEventListener('storage',updateCount);
navigation();
// Displace the backdrop only; navigation text stays sharp above the glass.
if(!document.getElementById('zephyron-liquid-filter')){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.id='zephyron-liquid-filter';svg.setAttribute('aria-hidden','true');svg.setAttribute('width','0');svg.setAttribute('height','0');svg.style.position='absolute';svg.style.pointerEvents='none';
 svg.innerHTML='<defs><filter id="zephyron-liquid-refraction" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.045" numOctaves="1" seed="8" result="waves"/><feGaussianBlur in="waves" stdDeviation="2" result="smoothWaves"/><feDisplacementMap in="SourceGraphic" in2="smoothWaves" scale="18" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
 document.body.append(svg);
}
const main=document.querySelector('[data-page]');
const heading=(title,text='',kicker='ZEPHYRON')=>`<div class="z-page-heading"><p class="z-kicker">${kicker}</p><h1>${title}</h1>${text?`<p>${text}</p>`:''}</div>`;
const button=(href,label,red=false)=>`<a class="z-button ${red?'z-button-red':''}" href="${href}">${label} <span aria-hidden="true">↗</span></a>`;
const modelCards=()=>cars.map(car=>`<article class="z-card"><a href="product.html?car=${car.id}"><img src="${poster(car.id)}" alt="${car.brand} ${car.name} trong studio" loading="lazy"><div class="z-card-body"><small>${car.brand}</small><h2>${car.name}</h2><p>${car.text}</p><span class="z-card-link">Khám phá mẫu xe ↗</span></div></a></article>`).join('');
const catalogImage=car=>({
  corvette:'assets/gallery-real-v1/corvette-hero-real-v1.webp',
  bmw:'assets/gallery-real-v1/bmw-hero-real-v1.webp',
  porsche:'assets/gallery-real-v1/porsche-hero-real-v1.webp',
  mercedes:'assets/gallery-real-v1/mercedes-hero-real-v1.webp',
  lamborghini:'assets/gallery-real-v1/lamborghini-hero-real-v1.webp'
}[car.id]||poster(car.id));
const productCatalogCards=()=>cars.map((car,index)=>`<article class="z-product-tile"><a href="product.html?car=${car.id}"><div class="z-product-tile-visual"><span class="z-product-tag">${index===4?'Mới':index===2?'Nổi bật':'Có sẵn'}</span><img src="${catalogImage(car)}" alt="Ảnh chụp thật ${car.brand} ${car.name}" loading="lazy"></div><div class="z-product-tile-body"><small>${car.brand}</small><h3>${car.name}</h3><p>${car.series} · ${car.layout}</p><strong>Từ ${money(car.price)}</strong><span>Giá minh họa ↗</span></div></a></article>`).join('');
const articles=globalThis.zephyronArticles;
const journalCovers = {
  'porsche-gt3-9000': {src: 'assets/details-five/porsche.webp', alt: 'Porsche 911 GT3 chạy trên đường đua ban đêm'},
  'bmw-m4-doi-dau-amg-sl63': {src: 'assets/comparison-real-v27/bmw-photo.webp', alt: 'BMW M4 G82 màu xanh nhìn từ góc trước'},
  'corvette-c7-c8-doi-vi-tri-dong-co': {src: 'assets/feature-real-v30/corvette-3.webp', alt: 'Corvette C7 Stingray màu đỏ nhìn từ góc sau bên hông'},
  'revuelto-phoi-mau-studio': {src: 'assets/feature-real-v30/lamborghini-3.webp', alt: 'Lamborghini Revuelto màu vàng nhìn từ góc sau bên hông'},
  'track-day-m4-vong-lam-quen': {src: 'assets/article-real-v1/bmw-m4-track.webp', alt: 'BMW M4 Competition chạy trên đường đua'},
  'dau-an-mau-sac': {src: 'assets/details-five/bmw.webp', alt: 'Cận cảnh màu sơn vàng xanh và cụm đèn trước của BMW M4'},
  'nam-ngon-ngu-thiet-ke': {src: 'assets/article-real-v1/mercedes-front-real-v1.webp', alt: 'Mercedes-AMG SL 63 màu xám nhìn từ góc trước'},
  'trai-nghiem-studio-3d': {src: 'assets/gallery-real-v1/porsche-rear-real-v1.webp', alt: 'Góc đuôi Porsche 911 GT3 với cánh gió sau'}
};
function articleCards(exclude = '', covers = {}) {
  return articles.filter(article => article.id !== exclude).map(article => {
    const cover = covers[article.id];
    const src = cover?.src ?? poster(article.car);
    const alt = cover?.alt ?? getCar(article.car).name;
    return `<article class="z-card"><a href="article.html?id=${article.id}"><img src="${src}" alt="${alt}" loading="lazy"><div class="z-card-body"><small>${article.category}</small><h2>${article.title}</h2><p>${article.intro}</p><span class="z-card-link">Đọc bài viết ↗</span></div></a></article>`;
  }).join('');
}
if(main){
  const page=main.dataset.page;
  if(page==='products'){
    main.innerHTML=`<section class="z-products-campaign" aria-label="Không chỉ chọn xe. Chọn cách bạn xuất hiện.">
      <video class="z-products-campaign-image" src="assets/editorial/products-hero-clean-v25.mp4" poster="assets/editorial/products-hero-clean-v25-poster.webp" autoplay muted loop playsinline preload="auto" aria-label="Thước phim hình thành chiếc xe từ logo đến mẫu xe hoàn chỉnh">Trình duyệt của bạn không hỗ trợ phát video.</video>
      <div class="z-products-caption"><span>ZEPHYRON / STUDIO 360°</span><h1>Không chỉ chọn xe.<br>Chọn cách bạn xuất hiện.</h1><p>Tốc độ dẫn lối. Công nghệ định hình. Bứt phá mọi giới hạn.</p></div>
      <span class="z-products-edge-cleaner" aria-hidden="true"></span>
      <div class="z-products-arrival" aria-label="Mercedes-AMG G 63 sắp về showroom"><span>Sắp về showroom</span><strong>Mercedes-AMG G 63</strong></div>
    </section>
    <section class="z-digital-showroom" id="products-experience" aria-labelledby="products-experience-title">
      <div class="z-digital-shell">
        <header class="z-digital-head">
          <h2 id="products-experience-title">Trải nghiệm mua xe,<br>được thiết kế lại.</h2>
          <p class="z-digital-lead">Quan sát chiếc xe trước khi quyết định. Mỗi lựa chọn đều hiển thị rõ ràng, từ màu sơn đến mức giá minh họa.</p>
        </header>
        <div class="z-digital-grid">
          <a class="z-digital-stage" href="#products-studio" aria-label="Mở Studio 360 độ">
            <img src="assets/unveil-five/lamborghini-still.webp" alt="Lamborghini màu trắng trong showroom kỹ thuật số" loading="lazy">
            <div class="z-digital-stage-copy"><h3>Không bỏ sót một đường nét.</h3><span>Kéo, xoay và thu phóng <b aria-hidden="true">↗</b></span></div>
          </a>
          <aside class="z-build-sheet" aria-label="Cấu hình xe đang xem">
            <header><div><span>Xe đang xem</span><h3>Lamborghini Revuelto</h3><p>V12 hybrid · Siêu xe coupé</p></div><img src="assets/brands/lamborghini-shield.png" alt="" aria-hidden="true"></header>
            <div class="z-build-options">
              <div><span>Ngoại thất</span><strong><i class="z-build-paint" aria-hidden="true"></i>Nero Noctis</strong></div>
              <div><span>Chi tiết</span><strong>Heo phanh đỏ · Mâm bạc</strong></div>
              <div class="z-build-price"><span>Giá khởi điểm minh họa</span><strong>${money(getCar('lamborghini').price)}</strong><small>Giá thay đổi khi chọn màu giới hạn.</small></div>
            </div>
            <div class="z-build-actions"><a href="#products-studio">Tự cấu hình xe <b aria-hidden="true">↗</b></a><a href="#products-catalog">Xem tất cả mẫu xe</a></div>
          </aside>
        </div>
      </div>
    </section>
    <section class="z-products-catalog" id="products-catalog" aria-labelledby="products-catalog-title"><div class="z-products-section-head"><div><p class="z-kicker">DANH MỤC XE</p><h2 id="products-catalog-title">Năm cá tính. Một bộ sưu tập.</h2></div><a href="gallery.html">Xem bộ sưu tập <span aria-hidden="true">↗</span></a></div><div class="z-products-catalog-grid">${productCatalogCards()}</div></section>
    <section class="z-car-anatomy" id="car-anatomy" data-car-anatomy aria-label="Sơ đồ khái niệm các lớp cấu tạo xe"></section>
    <section class="z-products-promo" aria-labelledby="products-promo-title"><video class="z-products-promo-media" src="assets/editorial/products-bmw-m4-g82.mp4" poster="assets/editorial/products-bmw-m4-g82-poster.jpg" autoplay muted loop playsinline preload="metadata" aria-label="Thước phim BMW M4 G82 hiển thị trọn khung xe">Trình duyệt của bạn không hỗ trợ phát video.</video><div><p class="z-kicker">CẤU HÌNH THEO CÁCH RIÊNG</p><h2 id="products-promo-title">Một màu sơn có thể thay đổi toàn bộ cảm giác.</h2><p>Thử bảng màu tiêu chuẩn và màu giới hạn trước khi lưu lựa chọn của bạn.</p><a href="#products-studio">Bắt đầu phối màu <span aria-hidden="true">↗</span></a></div></section>
    <div id="products-studio" data-studio-mount></div>
    <section class="z-ar-experience" id="ar-experience" data-ar-experience aria-label="Xem mô hình xe trong không gian thật"></section>
    <section class="z-sound-experience" id="sound-experience" data-sound-experience aria-label="Trải nghiệm video và âm thanh theo mẫu xe"></section>
    <section class="z-smart-ownership" id="smart-ownership" data-smart-ownership aria-label="Tính khoản vay, chi phí sử dụng và chọn phụ kiện"></section>
    <section class="z-before-after" id="before-after" data-before-after aria-label="So sánh cấu hình mặc định và cấu hình đã nâng cấp"></section>
    <section class="z-dream-car" id="my-dream-car" data-dream-car aria-label="Lưu và chia sẻ xe mơ ước"></section>
    <section class="z-feature-explorer" id="feature-explorer" data-feature-explorer aria-label="Khám phá công nghệ trên từng mẫu xe"></section>
    <section class="z-drive-mode" id="drive-mode-simulator" data-drive-mode-simulator aria-label="Mô phỏng và giải thích các chế độ lái"></section>
    <section class="z-safety-visualizer" id="safety-visualizer" data-safety-visualizer aria-label="Minh họa túi khí"></section>
    <section class="z-technical-specs" id="technical-specs" data-technical-specs aria-label="Thông số kỹ thuật và biểu đồ so sánh trực quan"></section>
    <section class="z-version-comparison" id="version-comparison" data-version-comparison aria-label="So sánh các phiên bản bằng dữ liệu chính hãng"></section>
    <section class="z-car-advisor" id="car-advisor" data-car-advisor aria-label="Hỏi đáp về xe dựa trên dữ liệu có nguồn"></section>
    <section class="z-smart-test-drive" id="smart-test-drive" data-smart-test-drive aria-label="Xem trước giao diện đặt lịch lái thử"></section>
    <section class="z-car-quiz" id="car-quiz" data-car-quiz aria-label="Trắc nghiệm kiến thức về năm mẫu xe"></section>
    <section class="z-products-journal" aria-labelledby="products-journal-title"><div class="z-products-section-head"><div><p class="z-kicker">GÓC NHÌN THIẾT KẾ</p><h2 id="products-journal-title">Khám phá nhiều hơn.</h2></div><a href="news.html">Xem tất cả bài viết <span aria-hidden="true">↗</span></a></div><div class="z-grid">${articleCards('', journalCovers)}</div></section>
    <section class="z-scroll-story" id="scroll-storytelling" data-scroll-story aria-label="Câu chuyện thương hiệu và lời mời khám phá xe"></section>`;
    const productVideos=[...main.querySelectorAll('video.z-products-campaign-image, video.z-products-promo-media')];
    const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
    const syncProductMotion=()=>productVideos.forEach(video=>{if(reducedMotion.matches)video.pause();else video.play().catch(()=>{});});
    syncProductMotion();reducedMotion.addEventListener('change',syncProductMotion);
    await import('./studio-page.js?v=20261111-feature-panel-v26');
    const {mountCarAnatomy}=await import('./car-anatomy.js');
    mountCarAnatomy(main.querySelector('[data-car-anatomy]'),main.querySelector('[data-studio-mount]'));
    const {mountScrollStorytelling}=await import('./scroll-storytelling.js');
    mountScrollStorytelling(main.querySelector('[data-scroll-story]'));
    const {mountARExperience}=await import('./ar-experience.js');
    await mountARExperience(main.querySelector('[data-ar-experience]'),main.querySelector('[data-studio-mount]'));
    try{
      const {mountSoundExperience}=await import('./sound-experience.js?v=20261111-auto-sound-v22');
      mountSoundExperience(main.querySelector('[data-sound-experience]'),main.querySelector('[data-studio-mount]'));
    }catch(error){
      console.error('Không tải được Sound Experience; các phần còn lại vẫn tiếp tục khởi tạo.',error);
    }
    const {mountFeatureExplorer}=await import('./feature-explorer.js?v=products-motion-v1');
    mountFeatureExplorer(main.querySelector('[data-feature-explorer]'),main.querySelector('[data-studio-mount]'));
    const {mountDriveModeSimulator}=await import('./drive-mode-simulator.js?v=products-motion-v1');
    mountDriveModeSimulator(main.querySelector('[data-drive-mode-simulator]'),main.querySelector('[data-studio-mount]'));
    const {mountSafetyVisualizer}=await import('./safety-visualizer.js?v=20261112-corvette-cabin-v50');
    mountSafetyVisualizer(main.querySelector('[data-safety-visualizer]'),main.querySelector('[data-studio-mount]'));
    const {mountTechnicalSpecs}=await import('./technical-specs.js');
    mountTechnicalSpecs(main.querySelector('[data-technical-specs]'),main.querySelector('[data-studio-mount]'));
    const {mountVersionComparison}=await import('./version-comparison.js');
    mountVersionComparison(main.querySelector('[data-version-comparison]'),main.querySelector('[data-studio-mount]'));
    const {mountCarAdvisor}=await import('./car-advisor.js?v=20261112-advisor-sync-v52');
    mountCarAdvisor(main.querySelector('[data-car-advisor]'),main.querySelector('[data-studio-mount]'));
    const {mountSmartOwnership}=await import('./smart-ownership.js');
    mountSmartOwnership(main.querySelector('[data-smart-ownership]'),main.querySelector('[data-studio-mount]'));
    const {mountBeforeAfter}=await import('./before-after.js?v=20261111-real-photos-v27');
    mountBeforeAfter(main.querySelector('[data-before-after]'),main.querySelector('[data-studio-mount]'));
    const {mountDreamCar}=await import('./dream-car.js?v=20261111-dream-actions-v29');
    mountDreamCar(main.querySelector('[data-dream-car]'),main.querySelector('[data-studio-mount]'));
    const {mountCarQuiz}=await import('./car-quiz.js');
    mountCarQuiz(main.querySelector('[data-car-quiz]'));
    const {mountSmartTestDrive}=await import('./smart-test-drive.js');
    mountSmartTestDrive(main.querySelector('[data-smart-test-drive]'),main.querySelector('[data-studio-mount]'));
    const {observeProductReveals}=await import('./products-motion.js');
    observeProductReveals(main);
    if(location.hash==='#products-studio'){
      const revealStudio=()=>main.querySelector('#products-studio')?.scrollIntoView({block:'start',behavior:'instant'});
      requestAnimationFrame(revealStudio);setTimeout(revealStudio,450);setTimeout(revealStudio,1100);
    }
  }
  if(page==='product'){
    const car=getCar(params.get('car'));
    document.title=car.name+' — ZEPHYRON';
    main.innerHTML=heading(car.name,car.text,`<a href="products.html">Sản phẩm</a> / ${car.brand}`)+`<div data-studio-mount data-car="${car.id}"></div><dl class="z-specs"><div><dt>Động cơ / Phiên bản tham khảo</dt><dd>${car.engine}</dd></div><div><dt>Kiểu dáng</dt><dd>${car.layout}</dd></div><div><dt>Tinh thần thiết kế</dt><dd>${car.character}</dd></div></dl><p class="z-form-note">Thông số mô tả dòng xe, có thể khác phiên bản cụ thể. Model phục vụ trải nghiệm thị giác của đồ án.</p><div class="z-page-heading"><h2 class="z-display">Nhìn gần <em>hơn.</em></h2></div><div class="z-grid">${['hero','side','rear'].map((angle,i)=>`<a href="gallery.html?car=${car.id}"><img class="z-feature-image" src="${poster(car.id,angle)}" alt="${car.name}, ${['góc nghiêng','ngang thân xe','phía sau'][i]}" loading="lazy"></a>`).join('')}</div>`;
    await import('./studio.js');
  }
  if(page==='contact'){
    main.innerHTML=heading('Bắt đầu <em>cuộc trò chuyện.</em>','Lưu lại yêu cầu tư vấn hoặc chọn thời gian bạn muốn trải nghiệm xe.')+`<div class="z-split"><div><div class="z-info-block"><h2>ZEPHYRON / Showroom số</h2><p>Địa điểm: Không gian trưng bày trực tuyến của đồ án.</p><p>Giờ tư vấn minh họa: 08:00 – 18:00, thứ Hai đến thứ Bảy.</p><p>Chưa thiết lập địa chỉ, số điện thoại và bản đồ showroom thực tế.</p></div><p class="z-form-note">Biểu mẫu tạo yêu cầu mẫu trong trình duyệt của bạn. Chưa gửi email hoặc liên hệ đến showroom.</p></div><form class="z-form" data-contact><div class="z-two-cols"><label>Họ và tên *<input name="name" autocomplete="name" required minlength="2" maxlength="80"></label><label>Số điện thoại *<input name="phone" type="tel" autocomplete="tel" required pattern="[+0-9 ()-]{9,18}" title="Nhập số điện thoại từ 9 đến 18 ký tự."></label></div><label>Email *<input name="email" type="email" autocomplete="email" maxlength="120" required></label><label>Mẫu xe quan tâm<select name="car">${cars.map(car=>`<option value="${car.id}">${car.brand} ${car.name}</option>`).join('')}</select></label><label>Nội dung tư vấn<textarea name="note" maxlength="1000"></textarea></label><button class="z-button z-button-red" type="submit">Lưu yêu cầu mẫu <span aria-hidden="true">↗</span></button><p class="z-status" role="status"></p></form></div><h2>Câu hỏi thường gặp</h2>${[['Tôi có thể đổi những màu nào?','Bạn có thể đổi riêng màu sơn thân xe, heo phanh và mâm. Màu kính, lốp và đĩa phanh giữ theo model.'],['Tôi có cần đăng nhập để đặt trước?','Không. Bạn có thể đi từ studio đến giỏ và nhập thông tin dưới dạng khách.'],['Giá hiển thị có phải báo giá thật không?','Không. Tất cả giá là số liệu giả lập dùng cho đồ án; mỗi màu sơn có mức giá riêng và màu giới hạn có phụ phí cao hơn.'],['Cấu hình đã lưu nằm ở đâu?','Trong mục Tài khoản trên chính trình duyệt này. Dữ liệu chưa được đồng bộ giữa các thiết bị.']].map(([q,a])=>`<details class="z-faq"><summary>${q}</summary><p>${a}</p></details>`).join('')}`;
    main.querySelector('[data-contact]').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;const data=Object.fromEntries(new FormData(form));if(!data.name.trim()){form.elements.name.setCustomValidity('Vui lòng nhập họ tên.');form.elements.name.reportValidity();return;}const ok=writeStore('consultations',[{...data,id:'ZZ-T-'+Date.now().toString(36).toUpperCase(),created:new Date().toISOString(),status:'Chờ tư vấn'},...list('consultations')]);form.querySelector('.z-status').textContent=ok?'Đã lưu yêu cầu mẫu trên trình duyệt. Chưa gửi đến showroom.':'Không lưu được. Hãy kiểm tra quyền lưu trữ.';if(ok)form.reset();});
    main.querySelector('[name=name]').addEventListener('input',event=>event.target.setCustomValidity(''));
  }
  if(page==='explore')main.innerHTML=heading('Khám phá <em>thế giới ZEPHYRON.</em>','Từ studio tương tác đến những câu chuyện về màu sắc và đường nét.')+`<div class="z-grid">${modelCards()}</div><div class="z-link-tiles"><a href="films.html">Thước phim ↗<small>Hai thước phim về Mercedes-AMG SL 63 và Porsche 911 GT3 RS</small></a><a href="experience.html">Hành trình ↗<small>Khám phá không gian và cảm xúc sau tay lái</small></a><a href="news.html">Tin tức / Bài viết ↗<small>Góc nhìn thiết kế và trải nghiệm studio</small></a><a href="article.html?id=${articles[0].id}">Chi tiết bài viết ↗<small>${articles[0].title}</small></a><a href="account.html#saved">Cấu hình đã lưu ↗<small>Mở lại những cấu hình bạn đã lưu trong Studio 3D</small></a><a href="requests.html">Danh sách yêu cầu đặt trước ↗<small>Xem các yêu cầu tư vấn và lái thử đã tạo</small></a></div>`;
  if(page==='gallery'){
    let filter=cars.some(car=>car.id===params.get('car'))?params.get('car'):'all';let current=0;
    const items=cars.flatMap(car=>['hero','side','rear'].map((angle,i)=>({car:car.id,name:car.name,src:poster(car.id,angle),label:['Góc nghiêng','Ngang thân xe','Phía sau'][i]})));
    main.innerHTML=heading('Mọi góc nhìn. <em>Mọi cá tính.</em>','Bộ sưu tập năm dòng xe. Chọn hãng và mở ảnh để nhìn gần hơn.')+`<div class="z-filter" role="group" aria-label="Lọc bộ sưu tập"><button data-filter="all">Tất cả</button>${cars.map(car=>`<button data-filter="${car.id}">${car.brand}</button>`).join('')}</div><div class="z-grid" data-gallery-grid></div><dialog class="z-gallery-modal" aria-label="Xem ảnh xe toàn màn hình">
      <div class="z-lightbox-header"><button type="button" data-close autofocus>Đóng ảnh <span aria-hidden="true">×</span></button></div>
      <div class="z-lightbox-stage"><img alt=""></div>
      <div class="z-lightbox-toolbar">
        <button type="button" data-prev aria-label="Ảnh trước">←</button>
        <span data-caption aria-live="polite" aria-atomic="true"></span>
        <button type="button" data-next aria-label="Ảnh tiếp theo">→</button>
      </div>
    </dialog>`;
    const dialog=main.querySelector('dialog');const visible=()=>items.filter(item=>filter==='all'||item.car===filter);
    const grid = main.querySelector('[data-gallery-grid]');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const revealCards = 'IntersectionObserver' in window ? new IntersectionObserver((entries, observer) => {
      const arriving = entries.filter(entry => entry.isIntersecting && entry.target.isConnected);
      arriving.forEach(({target}, index) => {
        target.style.setProperty('--gallery-reveal-delay', `${Math.min(index, 3) * 140}ms`);
        target.classList.add('z-gallery-card-reveal');
        observer.unobserve(target);
      });
    }) : null;

    function render() {
      revealCards?.disconnect();
      main.querySelectorAll('[data-filter]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
      });
      grid.innerHTML = visible().map((item,i)=>`<article class="z-card"><button type="button" data-image="${i}" aria-label="Xem ${item.name}, ${item.label}" style="display:block;width:100%;padding:0;border:0;text-align:left;background:none;color:inherit"><span class="z-gallery-photo"><img src="${item.src}" alt="${item.name}, ${item.label}" loading="lazy" decoding="async"><span class="z-gallery-hover-caption" aria-hidden="true"><strong>${item.name}</strong><small>${item.label}</small></span></span><div class="z-card-body"><small>${getCar(item.car).brand}</small><h2>${item.name}</h2><p>${item.label} ↗</p></div></button></article>`).join('');
      if (revealCards && !reducedMotion.matches) {
        for (const card of grid.children) revealCards.observe(card);
      }
    }
    function show(){const all=visible();current=(current+all.length)%all.length;const item=all[current];dialog.querySelector('img').src=item.src;dialog.querySelector('img').alt=item.name+', '+item.label;dialog.querySelector('[data-caption]').textContent=`${item.name} / ${item.label} · ${current+1}/${all.length}`;}
    main.addEventListener('click',event=>{const el=event.target.closest('button');if(!el)return;if(el.dataset.filter){filter=el.dataset.filter;render();}if(el.dataset.image!==undefined){current=Number(el.dataset.image);show();dialog.showModal();}if(el.hasAttribute('data-close'))dialog.close();if(el.hasAttribute('data-prev')){current--;show();}if(el.hasAttribute('data-next')){current++;show();}});
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      current += event.key === 'ArrowLeft' ? -1 : 1;
      show();
    });
    render();
  }
  if(page==='news')main.innerHTML=heading('Góc nhìn <em>sau tay lái.</em>','Những câu chuyện về thiết kế, màu sắc và trải nghiệm trong studio Zuzong.')+'<div class="z-grid">'+articleCards()+'</div>';
  if(page==='article'){
    const article=articles.find(a=>a.id===params.get('id'))||articles[0];document.title=article.title+' — ZEPHYRON';
    main.innerHTML=`<article class="z-article">${heading(article.title,article.intro,`<a href="news.html">Bài viết</a> / ${article.category}`)}<img src="${poster(article.car)}" alt="${getCar(article.car).name} trong studio">${article.body.map(([h,p])=>`<h2>${h}</h2><p>${p}</p>`).join('')}<p class="z-form-note">${article.author ? `${article.author} · ${article.minutes} phút đọc · Nội dung mẫu ZEPHYRON` : 'Ban biên tập ZEPHYRON / Nội dung phục vụ đồ án'}</p>${article.sources?.length ? `<h2>Nguồn tham khảo</h2><ul>${article.sources.map(([name,url])=>`<li><a href="${escape(url)}">${escape(name)}</a></li>`).join('')}</ul>` : ''}<div class="z-cart-actions">${button('products.html?car='+article.car,'Thử trong studio',true)}<button class="z-inline-button" type="button" data-share>Chia sẻ bài viết</button></div><p class="z-status" data-share-status role="status"></p><h2>Bình luận mẫu</h2><p>Khách tham quan: “Mình thích phối màu thân tối cùng mâm bạc.”</p><form class="z-form" data-comment><label>Bình luận mô phỏng<textarea name="comment" required maxlength="500"></textarea></label><button class="z-button" type="submit">Thêm bình luận mẫu</button><p class="z-status" role="status"></p></form></article><div class="z-page-heading"><h2 class="z-display">Đọc <em>tiếp.</em></h2></div><div class="z-grid">${articleCards(article.id)}</div>`;
    main.querySelector('[data-share]').addEventListener('click',async()=>{const status=main.querySelector('[data-share-status]');try{await navigator.clipboard.writeText(location.href);status.textContent='Đã sao chép liên kết bài viết.';}catch{status.textContent='Liên kết bài viết: '+location.href;}});
    main.querySelector('[data-comment]').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;const text=form.elements.comment.value.trim();if(!text)return;form.querySelector('.z-status').textContent='Bạn (mô phỏng): '+text;form.reset();});
  }
  if(page==='cart')renderCart();
  if(page==='sources')main.innerHTML=heading('Nguồn hình <em>& model.</em>','Ghi công các tác giả và tài nguyên được sử dụng trong đồ án.')+`<div class="z-source-list"><div><h2>Chevrolet Corvette C7</h2><p>Martin Trafas · CC BY 4.0. Chuyển FBX sang GLB, chỉnh vật liệu, tối ưu hình học, thêm biển và tách màu.</p><a href="https://sketchfab.com/3d-models/chevrolet-corvette-c7-2b509d1bce104224b147c81757f6f43a" target="_blank" rel="noopener">Trang model gốc</a></div><div><h2>BMW M4 G82 Coupé</h2><p>Sloftm_Carz / SLBofficial · CC BY 4.0 theo hồ sơ nguồn dự án. Chỉnh vật liệu, logo, biển và tối ưu cho web.</p><a href="https://sketchfab.com/3d-models/bmw-m4-g82-coupe-free-high-detail-8704e302e4214c849bc607edb294be8a" target="_blank" rel="noopener">Trang model gốc</a></div><div><h2>Porsche 911 GT3 (992)</h2><p>Ddiaz Design · nguồn ghi CSR2 / GM25. CC BY-NC-SA 4.0 theo hồ sơ nguồn: ghi công, phi thương mại, chia sẻ tương tự. Bản model chỉnh sửa trong đồ án giữ cùng giấy phép.</p><a href="https://sketchfab.com/3d-models/2022-porsche-911-gt3-992-ba01afbaf32846e598db315be3507db3" target="_blank" rel="noopener">Trang model gốc</a></div><div><h2>Mercedes-Benz SL63 AMG</h2><p>Black Snow / BlackSnow02 · CC BY 4.0 theo hồ sơ. Giữ nội thất kem, chỉnh biển và vật liệu web.</p><a href="https://sketchfab.com/3d-models/mersedes-benz-sl63-amg-free-f7a625e6f5de425e89e84ae2e92cad65" target="_blank" rel="noopener">Trang model gốc</a></div><div><h2>Lamborghini Revuelto</h2><p>AmJViZ / BlenderKit · Royalty Free theo metadata nguồn. Chỉnh vật liệu, biển và ánh sáng đèn sau.</p><a href="https://www.blenderkit.com/asset-gallery-detail/4146135b-e6e7-45f5-b81b-372d4bbb74e8/" target="_blank" rel="noopener">Trang model gốc</a></div><div><h2>Hình ảnh studio & thư viện</h2><p>Ảnh trong bộ sưu tập 5 xe được xuất từ model 3D của dự án. Ảnh, video Corvette và tài nguyên bối cảnh cũ được giữ theo hồ sơ <a href="docs/research/ASSETS.md">ASSETS.md</a>. Logo hãng dùng để nhận diện mẫu xe trong đồ án, không thể hiện quan hệ đại diện chính thức.</p></div><div><h2>Công cụ & phông chữ</h2><p>&lt;model-viewer&gt; / Google · Apache 2.0. Manrope và Barlow Condensed · SIL Open Font License. Nguồn Blender đầy đủ: <a href="docs/STUDIO_MODEL_SOURCES.md">hồ sơ tài nguyên</a>.</p></div></div>`;
  if(page==='policies')main.innerHTML=heading('Rõ ràng từ <em>trải nghiệm đầu tiên.</em>','Bảo mật và điều kiện của bản demo đồ án ZEPHYRON.')+`<div class="z-copy"><h2>Giá và cấu hình</h2><p>Mọi giá hiển thị là số liệu giả lập. Giá thay đổi theo màu sơn; heo phanh và mâm không làm thay đổi giá. Không có thanh toán, đặt cọc hoặc giao dịch mua xe.</p><h2>Yêu cầu đặt trước</h2><p>Thao tác xác nhận chỉ tạo yêu cầu mẫu trên trình duyệt. Trạng thái “Chờ tư vấn” là mô phỏng, chưa được chuyển tới showroom hay bên thứ ba.</p><h2>Dữ liệu trên thiết bị</h2><p>Cấu hình, giỏ, thông tin liên hệ và hồ sơ mẫu được lưu trong localStorage của trình duyệt đang sử dụng. Dữ liệu không đồng bộ sang thiết bị khác. Chỉ nên dùng thông tin mẫu khi trình bày đồ án.</p><h2>Tài khoản mẫu</h2><p>Đăng nhập, đăng ký và quên mật khẩu là các trạng thái giao diện mô phỏng, chưa có xác thực máy chủ. Mật khẩu nhập vào không được lưu. Không dùng tài khoản này để lưu thông tin cần bảo mật.</p><h2>Tài nguyên thiết kế</h2><p>Model và hình ảnh được ghi công tại <a href="sources.html">Nguồn hình & model</a>. Một số tài nguyên có giới hạn phi thương mại và điều kiện chia sẻ tương tự.</p></div>`;
}

if(main?.dataset.page==='sources')main.insertAdjacentHTML('beforeend',`<section class="z-source-list detail-photo-sources" aria-labelledby="journey-source-title"><div><h2 id="journey-source-title">Ảnh hành trình trên trang chủ</h2><p>Porsche 911 Carrera trên đường, hậu cảnh núi. Ảnh wallpaper chính thức của Porsche, giữ màu gốc và chuyển WebP để tải nhanh. Dùng trong đồ án cá nhân.</p><a href="https://www.porsche.com/stories/design/download-porsche-911-wallpapers/" target="_blank" rel="noopener">Nguồn ảnh Porsche</a></div></section>`);
if(main?.dataset.page==='sources')main.insertAdjacentHTML('beforeend',`<section class="z-source-list detail-photo-sources" id="detail-photo-sources" aria-labelledby="detail-photo-sources-title">
  <div><h2 id="detail-photo-sources-title">Ảnh chi tiết của 5 mẫu xe</h2><p>Ảnh tham khảo được cắt khung, thu nhỏ và nén WebP; không đổi màu hoặc tạo chi tiết bằng AI. Quyền ảnh thuộc chủ sở hữu nguồn. Ảnh các phiên bản tham khảo có thể khác cấu hình trong studio.</p>
  <ul class="detail-photo-credits">
    <li><a href="https://coolclassicclub.com/es/collectibles/chevrolet-corvette-c7-stingray">Chevrolet Corvette C7 — Cool Classic Club</a></li>
    <li><a href="https://www.press.bmwgroup.com/ireland/article/detail/T0317552EN/the-new-bmw-m3-sedan-and-bmw-m3-competition-sedan-the-new-bmw-m4-coup%C3%A9-and-bmw-m4-competition-coup%C3%A9?language=en">BMW M4 G82 — BMW Group PressClub</a></li>
    <li><a href="https://newsroom.porsche.com/de/2021/produkte/porsche-911-gt3-weltpremiere-livestream-23623.html">Porsche 911 GT3 — Porsche AG / Porsche Newsroom</a></li>
    <li><a href="https://www.mbusa.com/en/vehicles/class/sl/roadster">Mercedes-AMG SL Roadster — Mercedes-Benz USA</a></li>
    <li><a href="https://www.lamborghini.com/en-en/models/revuelto-models/revuelto">Lamborghini Revuelto — Automobili Lamborghini S.p.A.</a></li>
  </ul><p><a href="assets/details-five/sources.json">Hồ sơ nguồn và xử lý ảnh</a>. Chưa xác minh giấy phép mở cho các ảnh này; không tuyên bố quyền sử dụng thương mại.</p></div>
  <div><h2>Logo các hãng tại footer</h2><p>Logo BMW và Porsche lấy từ bộ sưu tập <a href="https://github.com/vehiclespecs/brand-logos">VehicleSpecs / brand-logos</a>; logo Chevrolet, Mercedes-Benz và Lamborghini lấy từ website chính thức của hãng. Logo được giữ nguyên màu, dùng để nhận diện các thương hiệu. <a href="assets/brands/sources.json">Xem URL nguồn từng logo</a>.</p></div>
</section>`);

function configItem(item){
  const config=cleanConfig(item),car=getCar(config.car);const query=new URLSearchParams(config);
  query.set('edit',String(item.id));
  return `<article class="z-cart-item"><img src="${poster(car.id)}" alt="${car.name}, ảnh tham khảo màu mặc định"><div><h2>${car.name}</h2><p>${escape(configText(config))}</p><p>${money(configurationPrice(config))} · Giá cấu hình minh họa</p><div class="z-cart-actions"><a href="products.html?${query}">Mở cấu hình 3D ↗</a><button class="z-inline-button" type="button" data-remove="${escape(item.id)}">Bỏ xe</button></div><p class="z-form-note">Ảnh tham khảo; mở 3D để xem màu đã chọn.</p></div></article>`;
}
function renderCart(step=1,request=null){
  const cart=list('cart').map(item=>({...cleanConfig(item),id:String(item.id)}));
  main.innerHTML=heading('Cấu hình <em>của bạn.</em>','Từ lựa chọn trong studio đến yêu cầu tư vấn. Bạn có thể tiếp tục dưới dạng khách.')+`<ol class="z-stepper"><li ${step===1?'aria-current="step"':''}>1. Cấu hình đã chọn</li><li ${step===2?'aria-current="step"':''}>2. Thông tin đặt trước</li><li ${step===3?'aria-current="step"':''}>3. Xác nhận yêu cầu</li></ol><div data-cart-body></div>`;
  const target=main.querySelector('[data-cart-body]');
  if(step===3&&request){target.innerHTML=`<div class="z-empty"><div class="z-success-mark">✓</div><h2>Đã tạo yêu cầu mẫu.</h2><p>Mã yêu cầu: <strong>${escape(request.id)}</strong><br>Trạng thái: Chờ tư vấn</p><p>${escape(request.name)}, cấu hình của bạn đã được lưu trên trình duyệt. Chưa gửi đến showroom.</p>${request.configs.map(c=>`<p><strong>${getCar(c.car).name}</strong><br>${escape(configText(c))}</p>`).join('')}${button('requests.html','Xem yêu cầu đã tạo',true)}${button('products.html','Tiếp tục khám phá')}</div>`;return;}
  if(!cart.length){target.innerHTML=`<div class="z-empty"><h2>Giỏ đang chờ dấu ấn của bạn.</h2><p>Chọn một chiếc xe, thử bảng màu và bấm Đặt trước để bắt đầu.</p>${button('products.html','Chọn xe trong studio',true)}</div>`;return;}
  const total=cart.reduce((sum,item)=>sum+configurationPrice(item),0);
  const summaryCars=cart.map(item=>{const car=getCar(item.car),paint=colorOf(item,'body');return `<figure class="z-cart-preview"><img src="${poster(car.id)}" alt="${car.name}, xe đang đặt trước"><figcaption><strong>${car.name}</strong><span><i style="--paint:${paint.hex}" aria-hidden="true"></i>${paint.name}${paint.limited?' · Màu giới hạn':''}</span></figcaption></figure>`;}).join('');
  const summary=`<aside class="z-info-block z-cart-summary"><div class="z-cart-summary-head"><h2>Xe đặt trước</h2><p>${cart.length} xe đã chọn</p></div><div class="z-cart-preview-list">${summaryCars}</div><div class="z-cart-summary-total"><p>Tổng giá minh họa</p><h2>${money(total)}</h2><p>Mọi giá là dữ liệu giả lập. Không thu tiền hoặc đặt cọc.</p><p>Giá thay đổi theo màu sơn và trang bị đã chọn.</p></div></aside>`;
  if(step===1){
    target.innerHTML=`<div class="z-cart-layout"><div>${cart.map(item=>configItem(item)).join('')}<div class="z-cart-actions">${button('products.html','Chọn thêm xe')}<button class="z-button z-button-red" type="button" data-next-step>Thông tin đặt trước <span aria-hidden="true">↗</span></button></div></div>${summary}</div>`;
    target.querySelector('[data-next-step]').addEventListener('click',()=>renderCart(2));
    target.querySelectorAll('[data-remove]').forEach(button=>button.addEventListener('click',()=>{writeStore('cart',cart.filter(item=>item.id!==button.dataset.remove));updateCount();renderCart();}));
  }else{
    const draft=readStore('checkoutDraft',{});const user=readStore('user',{});
    target.innerHTML=`<div class="z-cart-layout"><form class="z-form" data-checkout><div class="z-two-cols"><label>Họ và tên *<input name="name" autocomplete="name" required minlength="2" maxlength="80" value="${escape(draft.name||user.name||'')}"></label><label>Số điện thoại *<input name="phone" autocomplete="tel" type="tel" required pattern="[+0-9 ()-]{9,18}" title="Nhập số điện thoại từ 9 đến 18 ký tự." value="${escape(draft.phone||'')}"></label></div><label>Email *<input name="email" type="email" autocomplete="email" required maxlength="120" value="${escape(draft.email||user.email||'')}"></label><label>Bạn muốn<select name="intent"><option value="consult">Nhận tư vấn</option><option value="testdrive">Hẹn lái thử (mô phỏng)</option></select></label><label>Ngày mong muốn<input name="date" type="date" min="${new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Ho_Chi_Minh'}).format(new Date())}" value="${escape(draft.date||'')}"></label><label>Ghi chú<textarea name="note" maxlength="1000">${escape(draft.note||'')}</textarea></label><label class="z-check"><input type="checkbox" required name="consent">Tôi hiểu đây là yêu cầu mẫu của đồ án, lưu trên trình duyệt và không tạo giao dịch thực tế.</label><div class="z-cart-actions"><button class="z-button" type="button" data-back-step>Quay lại cấu hình</button><button class="z-button z-button-red" type="submit">Xác nhận yêu cầu mẫu <span aria-hidden="true">↗</span></button></div><p class="z-status" role="status"></p></form>${summary}</div>`;
    const form=target.querySelector('form');form.elements.intent.value=draft.intent==='testdrive'?'testdrive':'consult';
    form.addEventListener('input',()=>{form.elements.name.setCustomValidity('');form.elements.date.required=form.elements.intent.value==='testdrive';writeStore('checkoutDraft',Object.fromEntries(new FormData(form)));});
    form.elements.date.required=form.elements.intent.value==='testdrive';
    target.querySelector('[data-back-step]').addEventListener('click',()=>renderCart());
    form.addEventListener('submit',event=>{event.preventDefault();const data=Object.fromEntries(new FormData(form));if(data.name.trim().length<2){form.elements.name.setCustomValidity('Nhập họ tên ít nhất 2 ký tự.');form.elements.name.reportValidity();return;}
      const request={...data,name:data.name.trim(),id:'ZZ-'+Date.now().toString(36).toUpperCase(),configs:cart,created:new Date().toISOString(),status:'Chờ tư vấn'};
      if(!writeStore('requests',[request,...list('requests')])){form.querySelector('.z-status').textContent='Không lưu được yêu cầu. Thông tin vẫn được giữ trong biểu mẫu.';return;}
      writeStore('cart',[]);writeStore('checkoutDraft',{});updateCount();renderCart(3,request);
    });
  }
}
