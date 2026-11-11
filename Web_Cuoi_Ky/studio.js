import {cars,palettes,labels,money,getCar,cleanConfig,colorOf,configurationPrice,readStore,writeStore,brandLogo} from './studio-data.js';
import {mountStudioSpecs} from './studio-specs.js';

export async function mountStudio(host,initial={}) {
  host.classList.add('z-studio');
  let config=cleanConfig({...readStore('current',{}),...initial});
  let part='body',ready=false,loadingTimer,lights,doors;
  host.innerHTML=`<div class="z-studio-head"><p>ZEPHYRON / AUTOMOTIVE STUDIO</p><h2>Một chiếc xe. Dấu ấn của bạn.</h2><div class="z-brands" role="group" aria-label="Chọn hãng xe">${cars.map(car=>`<button type="button" data-brand="${car.id}" aria-pressed="false"><img class="z-brand-emblem" src="${brandLogo(car.id)}" alt="" width="25" height="29"><span>${car.brand}</span></button>`).join('')}</div></div>
  <div class="z-studio-layout"><div class="z-viewer-stage" aria-busy="true"><div class="z-viewer-caption"><span data-car-caption></span><span data-paint-caption></span></div>
  <model-viewer class="z-viewer" alt="Mô hình xe 3D tương tác" camera-controls touch-action="pan-y" disable-pan camera-orbit="-42deg 76deg 110%" min-camera-orbit="auto 20deg 45%" max-camera-orbit="auto 88deg 220%" field-of-view="30deg" shadow-intensity="2.15" shadow-softness=".42" environment-image="assets/model/studio-automotive.hdr" tone-mapping="aces" exposure="1.1" interaction-prompt="none" loading="eager" reveal="auto"><div slot="poster" class="z-loader"><span class="z-loader-ring"></span><span data-load-text role="status">Đang chuẩn bị studio 3D…</span><button type="button" data-retry hidden>Thử lại</button></div></model-viewer>
  <div class="z-viewer-bottom"><p>Kéo để xoay <span>·</span> Cuộn / chụm để thu phóng</p><div class="z-camera-buttons"><button type="button" data-camera="front" aria-label="Xem đầu xe">Đầu</button><button type="button" data-camera="hero" aria-label="Xem góc nghiêng">3/4</button><button type="button" data-camera="side" aria-label="Xem ngang thân xe">Ngang</button><button type="button" data-camera="rear" aria-label="Xem đuôi xe">Đuôi</button><button type="button" data-spin aria-pressed="false" aria-label="Tự xoay xe">↻</button><button type="button" data-fullscreen aria-label="Xem toàn màn hình">⛶</button></div></div></div>
  <div class="z-config"><p class="z-series" data-series></p><h3 data-model-title></h3><fieldset class="z-options" disabled><legend class="sr-only">Tùy chỉnh màu xe</legend><div class="z-part-tabs" role="group" aria-label="Bộ phận đổi màu">${Object.entries(labels).map(([id,label])=>`<button type="button" data-part="${id}" aria-pressed="${id==='body'}">${label}</button>`).join('')}</div><div class="z-color-heading"><span data-part-label>Màu sơn</span><span data-color-name aria-live="polite"></span></div><div class="z-colors" data-swatches></div></fieldset>
  <button type="button" class="z-lights-toggle" data-car-lights disabled aria-pressed="false" aria-label="Bật đèn xe"><svg viewBox="0 0 28 22" fill="none" aria-hidden="true"><path d="M14 3c7 0 10 3 10 8s-3 8-10 8V3ZM3 4l7 2M2 9l8 1M2 14l8-1M3 19l7-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-lights-label>Bật đèn xe</span><i aria-hidden="true"></i></button><p class="sr-only" data-light-status role="status"></p>
  <button type="button" class="z-lights-toggle z-doors-toggle" data-car-doors hidden disabled aria-pressed="false" aria-label="Mở hai cửa xe"><svg viewBox="0 0 28 22" fill="none" aria-hidden="true"><path d="M5 18V7l5-4h11v15H5ZM8 8h10V5h-7L8 8ZM16 11h3M3 20h21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-doors-label>Mở cửa xe</span><i aria-hidden="true"></i></button><p class="sr-only" data-door-status role="status"></p>
  <div class="z-price"><div class="z-price-heading"><p>GIÁ MINH HỌA</p><span class="z-limited-badge" data-limited-badge hidden>Màu giới hạn</span></div><strong data-price aria-live="polite"></strong><span data-price-note></span></div><a class="z-button z-button-red" data-order href="cart.html">Đặt trước <span aria-hidden="true">↗</span></a><button class="z-button" data-save type="button">Lưu cấu hình <span aria-hidden="true">↗</span></button><a class="z-detail-link" data-detail href="product.html">Xem chi tiết xe <span aria-hidden="true">↗</span></a><p class="z-save-status" data-save-status role="status"></p></div></div>`;
  const viewer=host.querySelector('model-viewer');
  const stage=host.querySelector('.z-viewer-stage');
  const status=host.querySelector('[data-load-text]');
  const retry=host.querySelector('[data-retry]');
  const fieldset=host.querySelector('fieldset');
  const spin=host.querySelector('[data-spin]');
  const cameraButtons=[...host.querySelectorAll('[data-camera]')];
  const setCameraState=name=>cameraButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.camera===name)));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=matchMedia('(max-width:760px)');
  const radius=()=>mobile.matches?'120%':'90%';
  const editing=initial.edit;
  if(editing)host.querySelector('[data-order]').innerHTML='Cập nhật cấu hình <span aria-hidden="true">↗</span>';
  const notify=message=>host.querySelector('[data-save-status]').textContent=message;
  const specs=mountStudioSpecs(host);
  function saveCurrent(){writeStore('current',config);host.dataset.config=JSON.stringify(config);}
  function swatches(){
    host.querySelector('[data-part-label]').textContent=labels[part];
    host.querySelector('[data-color-name]').textContent=colorOf(config,part).name;
    host.querySelector('[data-swatches]').innerHTML=palettes[part].map(color=>{
      const paintDetail=part==='body'?`, ${money(configurationPrice({...config,body:color.id}))}${color.limited?', màu giới hạn':''}`:'';
      return `<button type="button" style="--swatch:${color.hex}" data-color="${color.id}" aria-label="${labels[part]}: ${color.name}${paintDetail}" aria-pressed="${config[part]===color.id}" title="${color.name}${color.limited?' · Màu giới hạn':''}"><span>${config[part]===color.id?'✓':''}</span></button>`;
    }).join('');
    host.querySelectorAll('[data-part]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.part===part)));
  }
  function applyPart(target){
    const choice=colorOf(config,target);
    viewer.model.materials.filter(material=>material.name.startsWith(`ZUZONG_${target} |`)).forEach(material=>{
      material.pbrMetallicRoughness.setBaseColorFactor(choice.hex);
      const satin=target==='body'&&choice.id==='satin';
      material.pbrMetallicRoughness.setMetallicFactor(target==='rims'?.95:target==='calipers'?.25:satin?.58:.72);
      material.pbrMetallicRoughness.setRoughnessFactor(target==='rims'?.2:target==='calipers'?.29:satin?.32:.14);
      material.setClearcoatFactor(target==='body'?(satin?.78:1):target==='rims'?.38:.7);
      material.setClearcoatRoughnessFactor(target==='body'?(satin?.16:.045):.13);
    });
  }
  function hidePlateText(){
    viewer.model.materials.filter(material=>material.name.toLowerCase().startsWith('plate | golden yellow')).forEach(material=>{
      material.setAlphaMode('BLEND');
      material.pbrMetallicRoughness.setBaseColorFactor([0,0,0,0]);
    });
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
  }
  function failed(message){clearTimeout(loadingTimer);doors?.beginLoad(config.car);ready=false;fieldset.disabled=true;stage.setAttribute('aria-busy','false');host.dataset.ready='false';viewer.showPoster();status.textContent=message;retry.hidden=false;}
  function load(reload=false){
    doors?.beginLoad(config.car);
    lights?.beginLoad();
    ready=false;host.dataset.ready='false';fieldset.disabled=true;stage.setAttribute('aria-busy','true');retry.hidden=true;notify('');
    viewer.showPoster();status.textContent=`Đang tải ${getCar(config.car).name}…`;
    viewer.removeAttribute('auto-rotate');spin.setAttribute('aria-pressed','false');
    viewer.cameraOrbit=`-42deg 76deg ${radius()}`;
    viewer.src=`assets/model/studio/${config.car}.glb`+(reload?`?retry=${Date.now()}`:'');
    clearTimeout(loadingTimer);loadingTimer=setTimeout(()=>failed('Tải model lâu hơn dự kiến. Kiểm tra kết nối rồi thử lại.'),120000);
    update();
  }
  viewer.addEventListener('progress',event=>{if(!ready) status.textContent=`Đang tải ${getCar(config.car).name} · ${Math.round(event.detail.totalProgress*100)}%`;});
  viewer.addEventListener('load',()=>{
    if(!viewer.loaded||!viewer.model||!viewer.src.includes(`/${config.car}.glb`))return;
    clearTimeout(loadingTimer);
    if(!Object.keys(labels).every(target=>viewer.model.materials.some(material=>material.name.startsWith(`ZUZONG_${target} |`)))){failed('Model thiếu vật liệu tùy chỉnh. Hãy thử tải lại.');return;}
    Object.keys(labels).forEach(applyPart);hidePlateText();ready=true;host.dataset.ready='true';fieldset.disabled=false;stage.setAttribute('aria-busy','false');status.textContent='Model 3D sẵn sàng.';viewer.dismissPoster();
    lights?.modelLoaded(config.car);
    doors?.modelLoaded(config.car);
    host.dispatchEvent(new CustomEvent('studio-ready',{detail:{...config}}));
  });
  viewer.addEventListener('error',()=>failed('Không tải được model 3D. Kiểm tra kết nối và thử lại.'));
  host.addEventListener('click',event=>{
    const button=event.target.closest('button,a');if(!button)return;
    if(button.dataset.brand){if(config.car!==button.dataset.brand){config=cleanConfig({...config,car:button.dataset.brand});load();}}
    if(button.dataset.part){part=button.dataset.part;swatches();}
    if(button.dataset.color&&ready){config[part]=button.dataset.color;applyPart(part);update();notify('');}
    if(button.dataset.camera&&ready){viewer.cameraOrbit=`${{front:-90,hero:-42,side:0,rear:90}[button.dataset.camera]}deg 76deg ${radius()}`;viewer.removeAttribute('auto-rotate');spin.setAttribute('aria-pressed','false');setCameraState(button.dataset.camera);viewer.jumpCameraToGoal();}
    if(button.hasAttribute('data-spin')&&ready){const active=spin.getAttribute('aria-pressed')!=='true';viewer.toggleAttribute('auto-rotate',active);spin.setAttribute('aria-pressed',String(active));if(active)setCameraState('');}
    if(button.hasAttribute('data-fullscreen')){if(document.fullscreenElement)document.exitFullscreen?.();else stage.requestFullscreen?.().catch(()=>notify('Trình duyệt chưa hỗ trợ toàn màn hình.'));}
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
  mobile.addEventListener('change',()=>{if(ready){const orbit=viewer.getCameraOrbit();viewer.cameraOrbit=`${orbit.theta}rad ${orbit.phi}rad ${radius()}`;}});
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting){viewer.removeAttribute('auto-rotate');spin.setAttribute('aria-pressed','false');}}).observe(host);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){viewer.removeAttribute('auto-rotate');spin.setAttribute('aria-pressed','false');}});
  update();
  try{
    await import('./assets/vendor/model-viewer/model-viewer.min.js');
    const ModelViewer=await customElements.whenDefined('model-viewer');
    ModelViewer.minimumRenderScale=mobile.matches?.78:1;
    const {createCarLights}=await import('./car-lights.js');
    lights=createCarLights(viewer,host.querySelector('[data-car-lights]'),host);
    const {createCarDoors}=await import('./car-doors.js');
    doors=createCarDoors(viewer,host.querySelector('[data-car-doors]'),host);
    setCameraState('hero');load();
  }catch{failed('Không khởi tạo được không gian 3D. Hãy tải lại trang.');}
  return {getConfig:()=>({...config}),viewer};
}

for(const host of document.querySelectorAll('[data-studio-mount]'))mountStudio(host,{...(host.dataset.car?{car:host.dataset.car}:{}),...Object.fromEntries(new URLSearchParams(location.search))});
