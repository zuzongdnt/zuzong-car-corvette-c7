import {cars,palettes,labels,money,getCar,cleanConfig,colorOf,configurationPrice,readStore,writeStore,brandLogo} from './studio-data.js';
import {mountStudioSpecs} from './studio-specs.js';

function paintCarThumb(){
  return '<svg viewBox="0 0 160 64" aria-hidden="true"><ellipse cx="80" cy="53" rx="62" ry="4" fill="#000" opacity=".16"/><circle cx="41" cy="45" r="12" fill="#191a1b"/><circle cx="41" cy="45" r="8" fill="#c3c5c8"/><circle cx="41" cy="45" r="3" fill="#484b4f"/><circle cx="119" cy="45" r="12" fill="#191a1b"/><circle cx="119" cy="45" r="8" fill="#c3c5c8"/><circle cx="119" cy="45" r="3" fill="#484b4f"/><path d="M10 41c5-4 15-6 22-10 8-12 17-17 34-18h27c13 0 20 6 28 16l19 6c6 2 9 5 10 10v4h-19c0-9-5-14-12-14s-12 5-13 14H53c0-9-5-14-12-14s-12 5-12 14H11v-4z" fill="var(--paint)" stroke="#383a3d" stroke-width="1.5" stroke-linejoin="round"/><path d="M39 31c8-11 15-15 28-15h10v15zm42-15h12c10 0 16 6 22 15H81z" fill="#24282b" stroke="#777" stroke-width="1"/><path d="M43 18c8-2 15-2 22-2h9" fill="none" stroke="#fff" stroke-width="1.3" opacity=".55"/><path d="M130 35l8 3" fill="none" stroke="#f8f8f8" stroke-width="1.5"/><path d="M12 40l7-2" fill="none" stroke="#f8f8f8" stroke-width="2"/></svg>';
}

export async function mountStudio(host,initial={}) {
  host.classList.add('z-studio');
  const currentConfig=readStore('current',{});
  let config=cleanConfig({...currentConfig,...initial});
  const storedCarConfigs=readStore('carConfigs',{});
  const carConfigs=storedCarConfigs&&typeof storedCarConfigs==='object'&&!Array.isArray(storedCarConfigs)?{...storedCarConfigs}:{};
  const hasExplicitPaint=['body','calipers','rims'].some(key=>initial[key]!=null);
  if(!initial.edit&&!hasExplicitPaint){
    if(carConfigs[config.car])config=cleanConfig({...config,...carConfigs[config.car],car:config.car});
    else if(initial.car&&currentConfig.car&&currentConfig.car!==config.car)config=cleanConfig({car:config.car});
  }
  let part='body',ready=false,loadingTimer,lights,doors;
  host.innerHTML=`<div class="z-studio-head"><p>ZEPHYRON / AUTOMOTIVE STUDIO</p><h2>Một chiếc xe. Dấu ấn của bạn.</h2><div class="z-brands" role="group" aria-label="Chọn hãng xe">${cars.map(car=>`<button type="button" data-brand="${car.id}" aria-pressed="false"><img class="z-brand-emblem" src="${brandLogo(car.id)}" alt="" width="25" height="29"><span>${car.brand}</span></button>`).join('')}</div></div>
  <div class="z-studio-layout"><div class="z-viewer-stage" aria-busy="true"><div class="z-viewer-caption"><span data-car-caption></span><span data-paint-caption></span></div>
  <div class="z-detail-zoom" role="group" aria-label="Phóng to chi tiết xe"><span class="z-detail-zoom-label">Chi tiết</span><button type="button" data-zoom="light" aria-pressed="false">Đèn</button><button type="button" data-zoom="wheel" aria-pressed="false">Mâm</button><button type="button" data-zoom="logo" aria-pressed="false">Logo</button><button type="button" data-zoom="handle" aria-pressed="false">Tay nắm</button><button type="button" data-zoom="line" aria-pressed="false">Đường thân</button><button type="button" data-zoom-reset aria-pressed="true">Toàn xe</button></div>
  <model-viewer class="z-viewer" alt="Mô hình xe 3D tương tác" camera-controls touch-action="pan-y" disable-pan ar ar-modes="webxr scene-viewer quick-look" ar-scale="auto" ar-placement="floor" camera-orbit="-42deg 76deg 110%" min-camera-orbit="auto 20deg 18%" max-camera-orbit="auto 88deg 220%" field-of-view="30deg" interpolation-decay="80" shadow-intensity="2.15" shadow-softness=".42" environment-image="assets/model/studio-automotive.hdr" tone-mapping="aces" exposure="1.1" interaction-prompt="none" loading="eager" reveal="auto"><div slot="poster" class="z-loader"><span class="z-loader-ring"></span><span data-load-text role="status">Đang chuẩn bị studio 3D…</span><button type="button" data-retry hidden>Thử lại</button></div></model-viewer>
  <span class="z-hotspot-hint">Bấm dấu + trên xe để xem thông tin chi tiết</span><aside class="z-feature-card" data-feature-card hidden aria-live="polite"><button type="button" data-feature-close aria-label="Đóng thông tin chi tiết">×</button><span data-feature-kicker>Chi tiết xe</span><h3 data-feature-title></h3><p><strong>Mô tả</strong><span data-feature-function></span></p><p><strong>Lợi ích</strong><span data-feature-benefit></span></p><section class="z-feature-specs" aria-label="Thông số kỹ thuật liên quan"><strong>Thông số kỹ thuật liên quan</strong><dl data-feature-specs></dl></section><div class="z-feature-links"><a data-feature-spec-source target="_blank" rel="noopener noreferrer">Nguồn thông số ↗</a></div></aside>
  <div class="z-interior-focus" data-interior-focus hidden aria-live="polite"><span>ĐANG XEM NỘI THẤT</span><strong data-interior-title></strong><small data-interior-subtitle>Chi tiết cabin 3D</small><p data-interior-focus-copy></p><div class="z-interior-focus-nav" role="group" aria-label="Chuyển nhanh khu vực nội thất"><button type="button" data-interior-jump="dashboard" aria-pressed="false">Táp-lô</button><button type="button" data-interior-jump="seats" aria-pressed="false">Ghế</button><button type="button" data-interior-jump="screens" aria-pressed="false">Màn hình</button><button type="button" data-interior-jump="cargo" aria-pressed="false">Hành lý</button><button type="button" data-interior-jump="comfort" aria-pressed="false">Tiện nghi</button></div><button type="button" data-interior-exit hidden>Trở lại toàn xe <span aria-hidden="true">↗</span></button></div>
  <div class="z-interior-panel" id="studio-interior-panel" data-interior-panel hidden><div class="z-interior-panel-head"><div><span>INTERIOR EXPLORER</span><strong>Khám phá không gian bên trong</strong></div><button type="button" data-interior-close aria-label="Đóng khám phá nội thất">×</button></div><button type="button" class="z-interior-view-button" data-interior-view disabled aria-pressed="false"><span class="z-interior-view-icon" aria-hidden="true"><svg viewBox="0 0 28 28" fill="none"><path d="M4 17.5h20M6 17.5l2.3-5.7h11.4l2.3 5.7M8.3 11.8l2.4-3h6.6l2.4 3M8 20.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM20 20.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="z-interior-view-copy"><strong>Xem bảng điều khiển trên xe 3D</strong><small>Thân xe trong suốt · camera tiến vào cabin</small></span><span class="z-interior-view-arrow" aria-hidden="true">↗</span></button><p class="z-interior-subhead">Hoặc chọn khu vực cần xem</p><div class="z-interior-controls" role="group" aria-label="Chọn khu vực nội thất"><button type="button" data-interior="dashboard" disabled>Bảng điều khiển</button><button type="button" data-interior="seats" disabled>Ghế</button><button type="button" data-interior="screens" disabled>Màn hình</button><button type="button" data-interior="cargo" disabled>Khoang hành lý</button><button type="button" data-interior="comfort" disabled>Tiện nghi</button></div><p data-interior-copy role="status" aria-live="polite">Chọn một khu vực để xem chi tiết.</p><button type="button" class="z-interior-reset" data-interior-reset disabled>Trở lại toàn xe <span aria-hidden="true">↗</span></button></div>
  <div class="z-viewer-bottom"><div class="z-viewer-hints"><p>Kéo để xoay <span>·</span> Cuộn / chụm để thu phóng <span>·</span> Chọn dấu + để khám phá chi tiết</p><button type="button" class="z-interior-trigger" data-interior-toggle aria-expanded="false" aria-controls="studio-interior-panel">Khám phá nội thất <span aria-hidden="true">↗</span></button></div><div class="z-camera-buttons"><button type="button" data-camera="front" aria-label="Xem đầu xe">Đầu</button><button type="button" data-camera="hero" aria-label="Xem góc nghiêng">3/4</button><button type="button" data-camera="side" aria-label="Xem ngang thân xe">Ngang</button><button type="button" data-camera="rear" aria-label="Xem đuôi xe">Đuôi</button><button type="button" data-spin aria-pressed="false" aria-label="Tự xoay xe"><svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.5 8a6.8 6.8 0 1 0 .1 3.7M16.5 4v4h-4"/></svg></button><button type="button" data-fullscreen aria-label="Xem toàn màn hình"><svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="z-expand-icon" d="M7 3H3v4m10-4h4v4m0 6v4h-4M3 13v4h4"/><path class="z-collapse-icon" d="M3 7h4V3m10 4h-4V3m0 14v-4h4M7 17v-4H3" style="display:none"/></svg></button></div></div></div>
  <div class="z-config"><p class="z-series" data-series></p><h3 data-model-title></h3><fieldset class="z-options"><legend class="sr-only">Tùy chỉnh màu xe</legend><div class="z-part-tabs" role="group" aria-label="Bộ phận đổi màu">${Object.entries(labels).map(([id,label])=>`<button type="button" data-part="${id}" aria-pressed="${id==='body'}">${label}</button>`).join('')}</div><div class="z-color-heading"><span data-part-label>Màu sơn</span><span data-color-name aria-live="polite"></span></div><div class="z-colors" data-swatches></div></fieldset>
  <button type="button" class="z-lights-toggle" data-car-lights disabled aria-pressed="false" aria-label="Chuyển chế độ ánh sáng showroom"><svg viewBox="0 0 28 22" fill="none" aria-hidden="true"><path d="M14 3c7 0 10 3 10 8s-3 8-10 8V3ZM3 4l7 2M2 9l8 1M2 14l8-1M3 19l7-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-lights-label>Ánh sáng showroom</span><span class="z-light-mode-options" aria-hidden="true"><span data-mode-light>Sáng</span><span data-mode-dark>Tối</span></span></button><p class="sr-only" data-light-status role="status"></p>
  <button type="button" class="z-lights-toggle z-doors-toggle" data-car-doors hidden disabled aria-pressed="false" aria-label="Mở hai cửa xe"><svg viewBox="0 0 28 22" fill="none" aria-hidden="true"><path d="M5 18V7l5-4h11v15H5ZM8 8h10V5h-7L8 8ZM16 11h3M3 20h21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-doors-label>Mở cửa xe</span><i aria-hidden="true"></i></button><p class="sr-only" data-door-status role="status"></p>
  <div class="z-price"><div class="z-price-heading"><p>GIÁ MINH HỌA</p><span class="z-limited-badge" data-limited-badge hidden>Màu giới hạn</span></div><strong data-price aria-live="polite"></strong><span data-price-note></span></div><a class="z-button z-button-red" data-order href="cart.html">Đặt trước <span aria-hidden="true">↗</span></a><button class="z-button" data-save type="button">Lưu cấu hình <span aria-hidden="true">↗</span></button><a class="z-detail-link" data-detail href="product.html">Xem chi tiết xe <span aria-hidden="true">↗</span></a><p class="z-save-status" data-save-status role="status"></p></div></div>`;
  const viewer=host.querySelector('model-viewer');
  const stage=host.querySelector('.z-viewer-stage');
  const status=host.querySelector('[data-load-text]');
  const retry=host.querySelector('[data-retry]');
  const fieldset=host.querySelector('fieldset');
  const spin=host.querySelector('[data-spin]');
  const fullscreen = host.querySelector('[data-fullscreen]');
  const expandIcon = fullscreen.querySelector('.z-expand-icon');
  const collapseIcon = fullscreen.querySelector('.z-collapse-icon');
  stage.addEventListener('fullscreenchange', () => {
    const expanded = document.fullscreenElement === stage;
    const label = expanded ? 'Thoát toàn màn hình' : 'Xem toàn màn hình';
    fullscreen.setAttribute('aria-label', label);
    fullscreen.title = label;
    expandIcon.style.display = expanded ? 'none' : '';
    collapseIcon.style.display = expanded ? '' : 'none';
  });
  fullscreen.title = fullscreen.getAttribute('aria-label');
  spin.title = spin.getAttribute('aria-label');
  const cameraButtons=[...host.querySelectorAll('[data-camera]')];
  const zoomButtons=[...host.querySelectorAll('[data-zoom]')];
  const interiorToggle=host.querySelector('[data-interior-toggle]');
  const interiorPanel=host.querySelector('[data-interior-panel]');
  const interiorViewButton=host.querySelector('[data-interior-view]');
  const interiorExitButton=host.querySelector('[data-interior-exit]');
  const interiorButtons=[...host.querySelectorAll('[data-interior]')];
  const interiorJumpButtons=[...host.querySelectorAll('[data-interior-jump]')];
  const featureCard=host.querySelector('[data-feature-card]');
  host.querySelector('.z-config').prepend(featureCard);
  let activeZoom='',activeInterior='',interiorGhost=false;
  const setCameraState=name=>cameraButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.camera===name)));
  const setZoomState=name=>{activeZoom=name||'';zoomButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.zoom===activeZoom)));host.querySelectorAll('[data-feature-hotspot]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.featureHotspot===activeZoom)));host.querySelector('[data-zoom-reset]').setAttribute('aria-pressed',String(!activeZoom));};
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width:760px)');
  const radius=()=>mobile.matches?'120%':'90%';
  const zoomPoints={
    bmw:{light:[-1.92,.67,.76],wheel:[-1.45,.36,.82],logo:[-2.25,.7,0],handle:[.45,.78,.94],line:[.2,.72,.96]},
    corvette:{light:[-1.82,.64,.8],wheel:[-1.36,.36,.79],logo:[-2.02,.68,0],handle:[.18,.73,.94],line:[.22,.68,.98]},
    porsche:{light:[-1.76,.68,.72],wheel:[-1.27,.35,.75],logo:[-1.82,.72,0],handle:[.25,.76,.94],line:[.28,.69,.98]},
    mercedes:{light:[-1.92,.66,.77],wheel:[-1.35,.37,.8],logo:[-2.22,.74,0],handle:[.42,.74,.85],line:[.3,.69,.94]},
    lamborghini:{light:[-1.92,.63,.82],wheel:[-1.34,.37,.83],logo:[-2.22,.67,0],handle:[.34,.73,.95],line:[.3,.67,.99]}
  };
  const hotspotNormals={light:'-0.7m 0.15m 0.7m',wheel:'0m 0.1m 1m',logo:'-1m 0.12m 0.18m',handle:'0.08m 0.1m 1m',line:'0.12m 0.15m 1m'};
  const featureDetails={
    light:{label:'Đèn xe',function:'Cụm đèn chiếu sáng mặt đường và phát tín hiệu để xe khác nhận biết.',benefit:'Giúp người lái quan sát trong điều kiện thiếu sáng và làm chiếc xe dễ được nhận diện hơn.'},
    wheel:{label:'Mâm & phanh',function:'Bánh xe truyền lực xuống mặt đường; cụm phanh tạo lực hãm ở từng bánh.',benefit:'Thiết kế mâm làm lộ rõ cụm phanh và góp phần tạo cảm giác lái thể thao, chắc chắn.'},
    logo:{label:'Logo hãng',function:'Biểu trưng nhận diện thương hiệu được đặt trên phần đầu xe.',benefit:'Giúp nhận ra hãng xe và tạo dấu ấn riêng trong thiết kế.'},
    handle:{label:'Tay nắm cửa',function:'Điểm cầm để mở cửa và tiếp cận khoang lái.',benefit:'Giúp thao tác ra vào thuận tiện; kiểu dáng được hòa vào đường nét thân xe.'},
    line:{label:'Đường nét thân xe',function:'Các nếp gân và bề mặt thân tạo hình dáng đặc trưng cho mẫu xe.',benefit:'Tạo khối cơ bắp, dẫn hướng luồng khí quanh thân và giúp chiếc xe trông thấp, liền mạch hơn.'}
  };
  const carSpecs={
    corvette:{edition:'Corvette C7 Stingray · dữ liệu 2019',source:'https://media.chevrolet.com/content/dam/Media/documents/INTL/chevrolet/2019/vehicles/corvette-stingray/Tech-Data-Chevrolet-Corvette-Stingray.pdf',general:[['Động cơ','V8 · 6,2 L'],['Kích thước','4.492 × 1.872 × 1.239 mm']],features:{wheel:[['Lốp trước / sau','245/35 R19 · 285/30 R20'],['Đĩa phanh trước / sau','345 × 30 · 338 × 26 mm'],['Kẹp phanh','4 piston trước và sau']],handle:[['Chiều dài','4.492 mm'],['Chiều dài cơ sở','2.710 mm']],line:[['Dài × rộng','4.492 × 1.872 mm'],['Chiều dài cơ sở','2.710 mm']]}},
    bmw:{edition:'BMW M4 Competition xDrive · dữ liệu 2022',source:'https://www.press.bmwgroup.com/usa/article/detail/T0330025EN_US/the-new-2022-bmw-m3-competition-xdrive-sedan-and-m4-competition-xdrive-coupe?language=en_US',general:[['Động cơ','I6 3,0 L tăng áp kép'],['Công suất','503 hp (bản Competition xDrive)']],features:{wheel:[['Mâm hợp kim rèn','19″ trước · 20″ sau'],['Lốp trước / sau','275/35 ZR19 · 285/30 ZR20']],handle:[['Kiểu thân','Coupé · 2 cửa'],['Số chỗ','4']],line:[['Dẫn động','M xDrive 4 bánh'],['Lốp sau','285/30 ZR20']]}},
    porsche:{edition:'Porsche 911 GT3 (992.1) · dữ liệu 2022',source:'https://newsroom.porsche.com/dam/jcr%3Af67ebd45-3aa7-4bf9-9c6a-78d336603b7e/2022%20Porsche%20911%20GT3%20Press%20Kit.pdf',general:[['Động cơ','Boxer 6 · 4,0 L'],['Công suất','375 kW · 510 PS']],features:{wheel:[['Mâm trước / sau','9,5 × 20″ · 12 × 21″'],['Lốp trước / sau','255/35 ZR20 · 315/30 ZR21'],['Đĩa phanh trước / sau','408 · 380 mm']],handle:[['Hộp số','PDK 7 cấp hoặc số sàn 6 cấp'],['Dẫn động','Cầu sau']],line:[['Vòng tua tối đa','9.000 vòng/phút'],['Gầm thể thao PASM','Thấp hơn 20 mm']]}},
    mercedes:{edition:'Mercedes-AMG SL 63 (R232) · dữ liệu 2022',source:'https://media.mercedes-benz.com/en/article/29004d7c-53c6-4531-89b1-4bf163ec3b8e',general:[['Động cơ','V8 · 3.982 cm³'],['Công suất','430 kW · 585 hp']],features:{wheel:[['Phanh AMG gốm hiệu suất cao','Tùy chọn theo cấu hình'],['Tốc độ tối đa','315 km/h']],handle:[['Kiểu thân','Roadster · mui vải'],['Động cơ','V8 biturbo 3.982 cm³']],line:[['Chiều dài cơ sở','2.700 mm'],['Công suất','430 kW · 585 hp']]}},
    lamborghini:{edition:'Lamborghini Revuelto · dữ liệu 2024',source:'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_detail/revuelto/2024/brochure/07_23/REVUELTO_DIGITAL_BROCHURE_EN_2024.pdf',general:[['Hệ truyền động','V12 6,5 L · hybrid HPEV'],['Thân xe','Carbon fiber · cửa nhôm']],features:{wheel:[['Lốp trước / sau','265/35 ZR20 · 345/30 ZR21'],['Mâm trước / sau','9,5 × 20″ · 12 × 21″'],['Đĩa phanh trước / sau','410 × 38 · 390 × 32 mm']],handle:[['Vật liệu thân','Carbon fiber'],['Cửa xe','Nhôm']],line:[['Cánh gió sau chủ động','3 vị trí theo chế độ lái'],['Khung xe','Monocoque carbon đa vật liệu']]}}
  };
  const hotspotMarkup=[['light','Đèn'],['wheel','Mâm'],['logo','Logo'],['handle','Tay nắm'],['line','Đường thân']].map(([name,label])=>`<button class="z-car-hotspot" type="button" slot="hotspot-${name}" data-feature-hotspot="${name}" data-hotspot-label="${label}" aria-label="Xem chức năng và lợi ích: ${label}" aria-pressed="false"><span aria-hidden="true">+</span></button>`).join('');
  viewer.insertAdjacentHTML('beforeend',hotspotMarkup);
  const featureHotspotButtons=[...viewer.querySelectorAll('[data-feature-hotspot]')];
  const positionFeatureHotspots=()=>featureHotspotButtons.forEach(button=>{const point=zoomPoints[config.car]?.[button.dataset.featureHotspot];if(point){button.dataset.position=`${point[0]}m ${point[1]}m ${point[2]}m`;button.dataset.normal=hotspotNormals[button.dataset.featureHotspot];}});
  const zoomCamera={light:[-48,76,'32%'],wheel:[0,78,'28%'],logo:[-90,80,'22%'],handle:[0,80,'27%'],line:[0,78,'42%']};
  const interiorPoints={
    bmw:{dashboard:[-.53,.89,.19],seats:[.2,.59,.34],screens:[-.53,.89,.19],cargo:[1.72,.62,0],comfort:[.05,.68,.08]},
    corvette:{dashboard:[-.48,.78,0],seats:[.2,.57,.34],screens:[-.48,.78,0],cargo:[1.7,.61,0],comfort:[.04,.65,.08]},
    porsche:{dashboard:[-.48,.8,0],seats:[.14,.58,.32],screens:[-.48,.8,0],cargo:[-1.72,.58,0],comfort:[.05,.62,.06]},
    mercedes:{dashboard:[-.2,.8,0],seats:[.3,.67,.4],screens:[-.2,.8,0],cargo:[1.78,.68,0],comfort:[.08,.68,.12]},
    lamborghini:{dashboard:[-.65,.7,0],seats:[.2,.59,.34],screens:[-.65,.7,0],cargo:[-1.72,.57,0],comfort:[.04,.66,.08]}
  };
  const interiorCamera={
    corvette:{dashboard:[30,72,'28%'],seats:[0,76,'32%'],screens:[55,72,'24%'],cargo:[0,76,'30%'],comfort:[22,74,'27%']},
    bmw:{dashboard:[30,72,'28%'],seats:[0,76,'32%'],screens:[55,72,'24%'],cargo:[0,76,'30%'],comfort:[22,74,'27%']},
    porsche:{dashboard:[30,72,'28%'],seats:[0,76,'32%'],screens:[55,72,'24%'],cargo:[0,76,'30%'],comfort:[22,74,'27%']},
    mercedes:{dashboard:[30,72,'28%'],seats:[0,76,'34%'],screens:[55,72,'24%'],cargo:[0,76,'30%'],comfort:[22,74,'27%']},
    lamborghini:{dashboard:[30,72,'28%'],seats:[0,76,'32%'],screens:[55,72,'24%'],cargo:[0,76,'30%'],comfort:[22,74,'27%']}
  };
  const interiorText={dashboard:'Quan sát vô-lăng, cụm đồng hồ, táp-lô và khu vực điều khiển.',seats:'Xem dáng ghế, tựa đầu và khoảng ngồi trong cabin.',screens:'Phóng gần màn hình được tích hợp trực tiếp trong cabin 3D.',cargo:'Đi tới khoang chứa hành lý ở đầu hoặc đuôi xe.',comfort:'Khám phá bệ trung tâm, điều hòa, loa và các tiện nghi trong cabin.'};
  const nativeScreenMaterials={
    corvette:[/^ZEPHYRON Interior Screen \| Corvette C7$/i],
    bmw:[/^BMW \| Man hinh taplo$/i],
    porsche:[/^ZEPHYRON Interior Screen \| 911 GT3$/i],
    mercedes:[/gauges_screen/i,/GPS-Screen/i],
    lamborghini:[/^Right Screen$/i,/^Left Screen$/i,/^Center Screen$/i]
  };
  let interiorMaterialState=[];
  function saveInteriorMaterial(material){
    if(interiorMaterialState.some(state=>state.material===material))return;
    interiorMaterialState.push({material,alphaMode:material.getAlphaMode(),baseColor:[...material.pbrMetallicRoughness.baseColorFactor],emissive:[...material.emissiveFactor],emissiveStrength:material.emissiveStrength,emissiveTexture:material.emissiveTexture.texture});
  }
  async function illuminateInterior(){
    if(!viewer.model)return;
    await Promise.all(viewer.model.materials.map(async material=>{
      await material.ensureLoaded();
      const title=material.name.toLowerCase();
      const glass=/window|windshield|tinted-glass|(^|\s)kinh\b/i.test(material.name)&&!/(headlight|taillight|tail-light|lamp|red_glass)/i.test(material.name);
      const cabin=/interior|noi that|seat|ghe|leather|nappa|screen|man hinh|dashboard|dash|taplo|steer|gauge|gps|navi|carpet|velour|speaker|stitch|shiftlight/i.test(material.name);
      if(!glass&&!cabin)return;
      saveInteriorMaterial(material);
      if(glass){
        const factor=material.pbrMetallicRoughness.baseColorFactor;
        material.setAlphaMode('BLEND');
        material.pbrMetallicRoughness.setBaseColorFactor([...factor.slice(0,3),.06]);
      }
      if(cabin){
        const screen=(nativeScreenMaterials[config.car]||[]).some(pattern=>pattern.test(material.name));
        if(screen){
          if(config.car!=='lamborghini'){
            const nativeTexture=material.pbrMetallicRoughness.baseColorTexture.texture;
            if(nativeTexture)material.emissiveTexture.setTexture(nativeTexture);
          }
          material.setEmissiveFactor([1,1,1]);material.setEmissiveStrength(config.car==='lamborghini'?2.15:1.65);
        }
      }
    }));
  }
  function restoreInteriorMaterials(){
    interiorMaterialState.forEach(({material,alphaMode,baseColor,emissive,emissiveStrength,emissiveTexture})=>{
      material.setAlphaMode(alphaMode);
      material.pbrMetallicRoughness.setBaseColorFactor(baseColor);
      material.setEmissiveFactor(emissive);
      material.setEmissiveStrength(emissiveStrength);
      material.emissiveTexture.setTexture(emissiveTexture);
    });
    interiorMaterialState=[];
  }
  function interiorView(name){
    const point=interiorPoints[config.car]?.[name];
    const camera=[...(interiorCamera[config.car]?.[name]||[])];
    return point&&camera.length?{point,camera}:null;
  }
  function setInteriorPanel(open){
    interiorPanel.hidden=!open;
    interiorToggle.setAttribute('aria-expanded',String(open));
  }
  function exitInteriorMode(){
    const wasInside=Boolean(activeInterior);
    activeInterior='';interiorButtons.forEach(button=>button.setAttribute('aria-pressed','false'));
    interiorJumpButtons.forEach(button=>button.setAttribute('aria-pressed','false'));
    interiorViewButton.setAttribute('aria-pressed','false');host.dataset.interiorView='false';
    interiorExitButton.hidden=true;host.dataset.interior='false';host.querySelector('[data-interior-focus]').hidden=true;setInteriorPanel(false);
    featureCard.hidden=true;
    if(interiorGhost){restoreInteriorMaterials();interiorGhost=false;if(ready&&viewer.model)applyPart('body');}
    viewer.environmentImage='assets/model/studio-automotive.hdr';viewer.skyboxImage='';viewer.exposure='1.1';
    if(wasInside&&ready){viewer.fieldOfView='30deg';setZoomState('');setCameraState('hero');viewer.cameraTarget='auto auto auto';viewer.cameraOrbit=`-42deg 76deg ${radius()}`;if(reduced.matches)viewer.jumpCameraToGoal();}
  }
  function enterCockpitView(){
    if(!ready)return;
    focusInterior('dashboard');
  }
  function focusInterior(name){
    const view=interiorView(name);
    if(!ready||!view)return;
    viewer.removeAttribute('auto-rotate');spin.setAttribute('aria-pressed','false');setCameraState('');setZoomState('');
    host.querySelector('[data-zoom-reset]').setAttribute('aria-pressed','false');
    activeInterior=name;featureCard.hidden=true;interiorButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.interior===name)));
    interiorJumpButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.interiorJump===name)));
    host.dataset.interior='true';host.querySelector('[data-interior-copy]').textContent=interiorText[name];host.querySelector('[data-interior-title]').textContent=interiorButtons.find(button=>button.dataset.interior===name)?.textContent||'';host.querySelector('[data-interior-focus]').hidden=false;interiorExitButton.hidden=false;setInteriorPanel(false);
    host.querySelector('[data-interior-focus-copy]').textContent=interiorText[name];
    host.querySelector('[data-interior-subtitle]').textContent=(name==='dashboard'||name==='screens')?'Góc camera trực tiếp trên mô hình 3D':'Chi tiết cabin 3D';interiorViewButton.setAttribute('aria-pressed',String(name==='dashboard'));host.dataset.interiorView='false';
    if(!interiorGhost){interiorGhost=true;applyPart('body');}
    illuminateInterior().catch(error=>console.warn('Không thể bật texture màn hình cabin:',error));viewer.exposure=config.car==='corvette'?'1.55':'1.25';viewer.fieldOfView=name==='screens'?'30deg':name==='dashboard'?'34deg':'36deg';
    viewer.cameraTarget=`${view.point[0]}m ${view.point[1]}m ${view.point[2]}m`;
    viewer.cameraOrbit=`${view.camera[0]}deg ${view.camera[1]}deg ${view.camera[2]}`;
    if(reduced.matches)viewer.jumpCameraToGoal();
  }
  function setInteriorControls(enabled){
    interiorViewButton.disabled=!enabled;
    interiorButtons.forEach(button=>button.disabled=!enabled);
    host.querySelector('[data-interior-reset]').disabled=!enabled;
    interiorToggle.disabled=!enabled;
  }
  function focusDetail(name){
    const point=zoomPoints[config.car]?.[name];
    const camera=zoomCamera[name];
    if(!ready||!point||!camera)return;
    exitInteriorMode();
    viewer.removeAttribute('auto-rotate');spin.setAttribute('aria-pressed','false');setCameraState('');setZoomState(name);
    viewer.cameraTarget=`${point[0]}m ${point[1]}m ${point[2]}m`;
    viewer.cameraOrbit=`${camera[0]}deg ${camera[1]}deg ${camera[2]}`;
    viewer.jumpCameraToGoal();
  }
  function selectFeature(name){
    const detail=featureDetails[name];
    if(!detail||!ready)return;
    focusDetail(name);
    const car=getCar(config.car),spec=carSpecs[config.car];
    featureCard.querySelector('[data-feature-title]').textContent=detail.label;
    featureCard.querySelector('[data-feature-function]').textContent=detail.function;
    featureCard.querySelector('[data-feature-benefit]').textContent=detail.benefit;
    featureCard.querySelector('[data-feature-kicker]').textContent=`${car.brand} / ${car.name} · ${spec.edition.split('·').pop().trim()}`;
    featureCard.querySelector('[data-feature-spec-source]').href=spec.source;
    featureCard.querySelector('[data-feature-specs]').innerHTML=(spec.features[name]||spec.general).map(([label,value])=>`<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
    featureCard.hidden=false;
  }
  featureHotspotButtons.forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();selectFeature(button.dataset.featureHotspot);}));
  function resetDetailCamera(){
    if(!ready)return;
    exitInteriorMode();
    setZoomState('');viewer.cameraTarget='auto auto auto';viewer.cameraOrbit=`-42deg 76deg ${radius()}`;viewer.jumpCameraToGoal();
  }
  const editing=initial.edit;
  if(editing)host.querySelector('[data-order]').innerHTML='Cập nhật cấu hình <span aria-hidden="true">↗</span>';
  const notify=message=>host.querySelector('[data-save-status]').textContent=message;
  const specs=mountStudioSpecs(host);
  const colorStatus=document.createElement('p');
  colorStatus.className='z-color-status';
  colorStatus.setAttribute('role','status');
  colorStatus.textContent='Chọn màu để lưu cấu hình; xe 3D sẽ cập nhật ngay khi sẵn sàng.';
  host.querySelector('[data-swatches]').insertAdjacentElement('afterend',colorStatus);
  function saveCurrent(){
    writeStore('current',config);
    carConfigs[config.car]={body:config.body,calipers:config.calipers,rims:config.rims};
    writeStore('carConfigs',carConfigs);
    host.dataset.config=JSON.stringify(config);
  }
  function swatches(){
    host.querySelector('[data-part-label]').textContent=labels[part];
    host.querySelector('[data-color-name]').textContent=colorOf(config,part).name;
    host.querySelector('[data-swatches]').innerHTML=palettes[part].map(color=>{
      return `<button type="button" style="--swatch:${color.hex}" data-color="${color.id}" aria-label="${labels[part]}: ${color.name}" aria-pressed="${config[part]===color.id}" title="${color.name}"><span>${config[part]===color.id?'✓':''}</span></button>`;
    }).join('');
    host.querySelectorAll('[data-part]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.part===part)));
  }
  function applyPart(target){
    const choice=colorOf(config,target);
    viewer.model.materials.filter(material=>material.name.startsWith(`ZUZONG_${target} |`)).forEach(material=>{
      if(target==='body')material.setAlphaMode(interiorGhost?'BLEND':'OPAQUE');
      if(target==='body'&&interiorGhost){
        const hex=choice.hex.replace('#','');
        const channels=hex.length===3?hex.split('').map(value=>parseInt(value+value,16)):hex.match(/.{2}/g).map(value=>parseInt(value,16));
        material.pbrMetallicRoughness.setBaseColorFactor(channels.map(value=>{const srgb=value/255;return srgb<=.04045?srgb/12.92:((srgb+.055)/1.055)**2.4;}).concat(0));
      }else material.pbrMetallicRoughness.setBaseColorFactor(choice.hex);
      const satin=target==='body'&&choice.id==='satin';
      material.pbrMetallicRoughness.setMetallicFactor(target==='rims'?.95:target==='calipers'?.25:satin?.58:.72);
      material.pbrMetallicRoughness.setRoughnessFactor(target==='rims'?.2:target==='calipers'?.29:satin?.32:.14);
      material.setClearcoatFactor(target==='body'?(satin?.78:1):target==='rims'?.38:.7);
      material.setClearcoatRoughnessFactor(target==='body'?(satin?.16:.045):.13);
    });
  }
  async function hidePlateText(){
    const materials=viewer.model.materials.filter(material=>material.name.toLowerCase().startsWith('plate | golden yellow'));
    await Promise.all(materials.map(async material=>{
      await material.ensureLoaded();
      material.setAlphaMode('BLEND');
      material.pbrMetallicRoughness.setBaseColorFactor([0,0,0,0]);
    }));
  }
  function update(){
    const car=getCar(config.car);
    const paint=colorOf(config,'body');
    specs.update(car.id);
    host.querySelector('[data-car-caption]').textContent=car.brand+' / '+car.name;
    host.querySelector('[data-paint-caption]').textContent=paint.name;
    host.querySelector('[data-series]').textContent=car.series;
    host.querySelector('[data-model-title]').textContent=car.name;
    host.querySelector('[data-price]').textContent=money(configurationPrice(config));
    const badge=host.querySelector('[data-limited-badge]');
    badge.hidden=!paint.limited;
    host.querySelector('[data-price-note]').textContent=paint.surcharge?`${paint.name} · Phụ phí ${money(paint.surcharge)}.`:`${paint.name} · Giá tiêu chuẩn.`;
    host.querySelector('[data-detail]').href=`product.html?car=${car.id}`;
    viewer.alt=`${car.brand} ${car.name}, ${colorOf(config,'body').name}, heo phanh ${colorOf(config,'calipers').name}, mâm ${colorOf(config,'rims').name}. Kéo để xoay và dùng phím mũi tên để đổi góc nhìn.`;
    host.querySelectorAll('[data-brand]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.brand===car.id)));
    swatches();saveCurrent();
    host.dispatchEvent(new CustomEvent('studio-change',{detail:{...config}}));
  }
  function failed(message){clearTimeout(loadingTimer);exitInteriorMode();setInteriorControls(false);doors?.beginLoad(config.car);ready=false;fieldset.disabled=false;swatches();stage.setAttribute('aria-busy','false');host.dataset.ready='false';host.dataset.modelFailed='true';viewer.showPoster();status.textContent=message;retry.hidden=false;}
  function load(reload=false){
    exitInteriorMode();interiorGhost=false;
    positionFeatureHotspots();
    setInteriorControls(false);
    doors?.beginLoad(config.car);
    lights?.beginLoad();
    ready=false;host.dataset.ready='false';host.dataset.modelFailed='false';fieldset.disabled=false;stage.setAttribute('aria-busy','true');retry.hidden=true;notify('');
    viewer.showPoster();status.textContent=`Đang tải ${getCar(config.car).name}…`;
    viewer.removeAttribute('auto-rotate');spin.setAttribute('aria-pressed','false');setZoomState('');viewer.cameraTarget='auto auto auto';
    viewer.cameraOrbit=`-42deg 76deg ${radius()}`;
    const modelFolder=(config.car==='corvette'||config.car==='porsche')?'studio-interior':'studio-clean';
    viewer.src=`assets/model/${modelFolder}/${config.car}.glb`+(reload?`?retry=${Date.now()}`:'');
    clearTimeout(loadingTimer);loadingTimer=setTimeout(()=>failed('Tải model lâu hơn dự kiến. Kiểm tra kết nối rồi thử lại.'),120000);
    update();
  }
  viewer.addEventListener('progress',event=>{if(!ready) status.textContent=`Đang tải ${getCar(config.car).name} · ${Math.round(event.detail.totalProgress*100)}%`;});
  viewer.addEventListener('load',async()=>{
    if(!viewer.loaded||!viewer.model||!viewer.src.includes(`/${config.car}.glb`))return;
    clearTimeout(loadingTimer);
    if(!Object.keys(labels).every(target=>viewer.model.materials.some(material=>material.name.startsWith(`ZUZONG_${target} |`)))){failed('Model thiếu vật liệu tùy chỉnh. Hãy thử tải lại.');return;}
    Object.keys(labels).forEach(applyPart);
    try{await hidePlateText();}catch(error){console.warn('Không thể ẩn vật liệu biển số:',error);}
    ready=true;host.dataset.ready='true';fieldset.disabled=false;setInteriorControls(true);swatches();stage.setAttribute('aria-busy','false');status.textContent='Model 3D sẵn sàng.';viewer.dismissPoster();
    lights?.modelLoaded(config.car);
    doors?.modelLoaded(config.car);
    host.dispatchEvent(new CustomEvent('studio-ready',{detail:{...config}}));
  });
  viewer.addEventListener('error',()=>failed('Không tải được model 3D. Kiểm tra kết nối và thử lại.'));
  host.addEventListener('click',event=>{
    const button=event.target.closest('button,a');if(!button)return;
    if(button.dataset.brand&&config.car!==button.dataset.brand){
      carConfigs[config.car]={body:config.body,calipers:config.calipers,rims:config.rims};
      const nextCar=button.dataset.brand;
      config=cleanConfig({...carConfigs[nextCar],car:nextCar});
      part='body';
      load();
    }
    if(button.dataset.part){part=button.dataset.part;swatches();}
    if(button.dataset.color){config[part]=button.dataset.color;if(ready)applyPart(part);update();colorStatus.textContent=ready?'Đã cập nhật màu trên mô hình 3D.':host.dataset.modelFailed==='true'?'Đã lưu màu. Model chưa tải được; hãy bấm “Tải lại” để xem màu trên xe.':'Đã lưu màu; mô hình 3D sẽ cập nhật khi tải xong.';notify('');}
    if(button.dataset.camera&&ready){exitInteriorMode();setZoomState('');viewer.cameraTarget='auto auto auto';viewer.cameraOrbit=`${{front:-90,hero:-42,side:0,rear:90}[button.dataset.camera]}deg 76deg ${radius()}`;viewer.removeAttribute('auto-rotate');spin.setAttribute('aria-pressed','false');setCameraState(button.dataset.camera);viewer.jumpCameraToGoal();}
    if(button.dataset.zoom)selectFeature(button.dataset.zoom);
    if(button.dataset.featureHotspot)selectFeature(button.dataset.featureHotspot);
    if(button.hasAttribute('data-feature-close'))featureCard.hidden=true;
    if(button.hasAttribute('data-zoom-reset'))resetDetailCamera();
    if(button.hasAttribute('data-interior-toggle')){
      if(interiorToggle.getAttribute('aria-expanded')==='true')exitInteriorMode();
      else {featureCard.hidden=true;setInteriorPanel(true);}
    }
    if(button.hasAttribute('data-interior-close'))exitInteriorMode();
    if(button.hasAttribute('data-interior-view'))enterCockpitView();
    if(button.hasAttribute('data-interior-exit'))exitInteriorMode();
    if(button.dataset.interior)focusInterior(button.dataset.interior);
    if(button.dataset.interiorJump)focusInterior(button.dataset.interiorJump);
    if(button.hasAttribute('data-interior-reset'))resetDetailCamera();
    if(button.hasAttribute('data-spin')&&ready){const active=spin.getAttribute('aria-pressed')!=='true';viewer.toggleAttribute('auto-rotate',active);spin.setAttribute('aria-pressed',String(active));if(active)setCameraState('');}
    if(button.hasAttribute('data-fullscreen')){
      const action = document.fullscreenElement === stage
        ? document.exitFullscreen()
        : stage.requestFullscreen?.();
      if (action) action.catch(() => notify('Không thể mở chế độ toàn màn hình.'));
      else notify('Trình duyệt chưa hỗ trợ toàn màn hình.');
    }
    if(button.hasAttribute('data-retry'))load(true);
    if(button.hasAttribute('data-save')){
      const stored=readStore('saved',[]);const saved=Array.isArray(stored)?stored:[];
      const exists=saved.some(item=>JSON.stringify(cleanConfig(item))===JSON.stringify(config));
      if(exists){notify('Cấu hình này đã có trong tài khoản của bạn.');return;}
      if(writeStore('saved',[{...config,id:Date.now().toString(36)},...saved]))notify('Đã lưu. Xem lại trong mục Tài khoản.');else notify('Không lưu được. Kiểm tra quyền lưu trữ của trình duyệt.');
    }
    if(button.hasAttribute('data-order')){
      const stored=readStore('cart',[]);const cart=Array.isArray(stored)?stored:[];
      const existing=editing?cart.findIndex(item=>String(item.id)===editing):-1;
      if(existing>=0)cart[existing]={...config,id:editing};
      else if(!cart.some(item=>JSON.stringify(cleanConfig(item))===JSON.stringify(config)))cart.push({...config,id:Date.now().toString(36)});
      if(!writeStore('cart',cart)){event.preventDefault();notify('Không thể lưu giỏ. Kiểm tra quyền lưu trữ của trình duyệt.');}
      window.dispatchEvent(new Event('zuzong-cart'));
    }
  });
  viewer.addEventListener('camera-change',event=>{if(event.detail?.source==='user-interaction')setCameraState('');});
  reduced.addEventListener('change',()=>{if(reduced.matches){viewer.removeAttribute('auto-rotate');spin.setAttribute('aria-pressed','false');}});
  mobile.addEventListener('change',()=>{if(ready){if(activeInterior){const view=interiorView(activeInterior);viewer.cameraOrbit=`${view.camera[0]}deg ${view.camera[1]}deg ${view.camera[2]}`;}else if(activeZoom){const camera=zoomCamera[activeZoom];viewer.cameraOrbit=`${camera[0]}deg ${camera[1]}deg ${camera[2]}`;}else{const orbit=viewer.getCameraOrbit();viewer.cameraOrbit=`${orbit.theta}rad ${orbit.phi}rad ${radius()}`;}}});
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting){viewer.removeAttribute('auto-rotate');spin.setAttribute('aria-pressed','false');}}).observe(host);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){viewer.removeAttribute('auto-rotate');spin.setAttribute('aria-pressed','false');}});
  update();
  try{
    await import('./assets/vendor/model-viewer/model-viewer.min.js');
    const ModelViewer=await customElements.whenDefined('model-viewer');
    ModelViewer.minimumRenderScale=mobile.matches?.78:1;
    setInteriorControls(false);
    const {createCarLights}=await import('./car-lights-page.js');
    lights=createCarLights(viewer,host.querySelector('[data-car-lights]'),host);
    const {createCarDoors}=await import('./car-doors.js');
    doors=createCarDoors(viewer,host.querySelector('[data-car-doors]'),host);
    setCameraState('hero');load();
  }catch{failed('Không khởi tạo được không gian 3D. Hãy tải lại trang.');}
  return {getConfig:()=>({...config}),viewer};
}

for(const host of document.querySelectorAll('[data-studio-mount]'))mountStudio(host,{...(host.dataset.car?{car:host.dataset.car}:{}),...Object.fromEntries(new URLSearchParams(location.search))});
