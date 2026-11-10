import {cars,getCar,palettes,colorOf,cleanConfig,readStore,writeStore,configurationPrice,money} from './studio-data.js';
import {ADDONS} from './smart-ownership.js';
import {VERSION_DATA} from './version-comparison.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const objectStore=key=>{const value=readStore(key,{});return value&&typeof value==='object'&&!Array.isArray(value)?{...value}:{}};
const validAccessories=items=>Array.isArray(items)?items.filter(id=>ADDONS.some(item=>item.id===id)):[];
const dreamImage=carId=>`assets/article-real-v1/${carId}-front-real-v1.webp`;

export function mountDreamCar(host,studio){
  if(!host||host.dataset.mounted)return;
  host.dataset.mounted='true';
  let config=cleanConfig({});
  try{config=cleanConfig(JSON.parse(studio?.dataset.config||'{}'));}catch{}
  const query=new URLSearchParams(location.search);
  let accessoryMap=objectStore('accessorySelections'),variantMap=objectStore('dreamVariants');
  const sharedAccessories=query.has('dreamAccessories')?validAccessories((query.get('dreamAccessories')||'').split(',').filter(Boolean)):null;
  const sharedVariant=Number(query.get('dreamVersion'));
  if(query.has('dreamVersion')&&Number.isInteger(sharedVariant)&&sharedVariant>=0&&sharedVariant<VERSION_DATA[config.car].variants.length)variantMap[config.car]=sharedVariant;
  let versionIndex=Number.isInteger(Number(variantMap[config.car]))?Number(variantMap[config.car]):VERSION_DATA[config.car].variants.findIndex(item=>item.tag==='Mẫu đang xem');
  if(versionIndex<0)versionIndex=0;
  function addonsFor(car){return sharedAccessories&&car===config.car?sharedAccessories:validAccessories(accessoryMap[car]);}
  function savedCars(){const value=readStore('dreamCars',[]);return Array.isArray(value)?value:[];}
  function versionFor(car,index){return VERSION_DATA[car].variants[index]||VERSION_DATA[car].variants[0];}
  function shareUrl(item){
    const clean=cleanConfig(item.config||item),url=new URL('products.html',location.href);
    url.search=new URLSearchParams({car:clean.car,body:clean.body,calipers:clean.calipers,rims:clean.rims,dreamVersion:String(item.versionIndex??0),dreamAccessories:validAccessories(item.accessories).join(',')}).toString();
    url.hash='products-studio';return url.href;
  }
  function savedCard(item){
    const savedConfig=cleanConfig(item.config||item),car=getCar(savedConfig.car),paint=colorOf(savedConfig,'body'),version=versionFor(car.id,Number(item.versionIndex)||0),addons=validAccessories(item.accessories).map(id=>ADDONS.find(addon=>addon.id===id));
    return `<article class="z-dream-saved"><img src="${dreamImage(car.id)}" alt="Ảnh chụp thật tham khảo ${esc(car.brand+' '+car.name)}" loading="lazy"><div class="z-dream-saved-body"><small>${esc(car.brand)} / XE YÊU THÍCH</small><h3>${esc(car.name)}</h3><p>${esc(version.name)} · ${esc(paint.name)}</p><p>${addons.length?esc(addons.map(addon=>addon.name).join(' · ')):'Chưa chọn phụ kiện'}</p><div class="z-dream-saved-actions"><button type="button" data-dream-open="${esc(item.id)}">Mở Studio ↗</button><button type="button" data-dream-share="${esc(item.id)}">Chia sẻ</button><button type="button" data-dream-remove="${esc(item.id)}">Bỏ yêu thích</button></div></div></article>`;
  }
  function render(){
    const car=getCar(config.car),versions=VERSION_DATA[car.id].variants,version=versions[versionIndex]||versions[0],addons=addonsFor(car.id).map(id=>ADDONS.find(item=>item.id===id)).filter(Boolean),paint=colorOf(config,'body'),brake=colorOf(config,'calipers'),rims=colorOf(config,'rims'),saved=savedCars();
    host.innerHTML=`<div class="z-dream-shell"><header class="z-dream-heading"><div><p class="z-experience-kicker">MY DREAM CAR</p><h2>Giữ lại chiếc xe<br><em>đúng gu của bạn.</em></h2></div><p>Lưu màu xe đang phối, phụ kiện đã chọn và phiên bản yêu thích. Cấu hình được lưu trên trình duyệt này.</p></header><div class="z-dream-car-tabs" role="group" aria-label="Chọn một trong năm mẫu xe">${cars.map(item=>`<button type="button" data-dream-car="${item.id}" aria-pressed="${item.id===car.id}"><span>${esc(item.brand)}</span><small>${esc(item.name)}</small></button>`).join('')}</div><div class="z-dream-current"><div class="z-dream-visual"><img src="${dreamImage(car.id)}" alt="Ảnh chụp thật tham khảo ${esc(car.brand+' '+car.name)}; phối màu và phiên bản hiện tại nằm trong thông tin cấu hình" loading="lazy"><span>${esc(car.brand)} / ${esc(car.name)}</span></div><div class="z-dream-controls"><label>Phiên bản tham khảo<select data-dream-version>${versions.map((item,index)=>`<option value="${index}" ${index===versionIndex?'selected':''}>${esc(item.name)}</option>`).join('')}</select></label><p class="z-dream-source"><a href="${esc(version.source)}" target="_blank" rel="noopener noreferrer">${esc(version.sourceLabel)} ↗</a></p><div class="z-dream-choice"><span>Màu sơn</span><strong><i style="--dream-color:${paint.hex}" aria-hidden="true"></i>${esc(paint.name)}</strong></div><div class="z-dream-choice"><span>Heo phanh</span><strong><i style="--dream-color:${brake.hex}" aria-hidden="true"></i>${esc(brake.name)}</strong></div><div class="z-dream-choice"><span>Mâm xe</span><strong><i style="--dream-color:${rims.hex}" aria-hidden="true"></i>${esc(rims.name)}</strong></div><div class="z-dream-choice z-dream-accessories"><span>Phụ kiện đã chọn</span><strong>${addons.length?esc(addons.map(item=>item.name).join(' · ')):'Chưa chọn phụ kiện'}</strong><a href="#smart-ownership">Chọn phụ kiện trong Accessories Studio ↗</a></div><div class="z-dream-price"><span>Giá xe cấu hình hiện tại · minh họa</span><strong>${money(configurationPrice(config))}</strong></div><div class="z-dream-actions"><button type="button" data-dream-save>Lưu xe mơ ước</button><button type="button" data-dream-share-current>Chia sẻ cấu hình</button></div><p class="z-dream-status" data-dream-status role="status" aria-live="polite">Ảnh chụp thật tham khảo; phối màu và phụ kiện được ghi rõ theo cấu hình.</p></div></div><div class="z-dream-collection"><div><p>THƯ VIỆN CỦA BẠN</p><h3>Xe đã lưu <span data-dream-count>${saved.length}</span></h3></div><div class="z-dream-saved-grid" data-dream-saved>${saved.length?saved.map(savedCard).join(''):'<p class="z-dream-empty">Chưa có xe yêu thích. Chọn phiên bản, phụ kiện rồi lưu cấu hình này.</p>'}</div></div></div>`;
  }
  async function copy(url){const status=host.querySelector('[data-dream-status]');try{await navigator.clipboard.writeText(url);status.textContent='Đã sao chép liên kết cấu hình.';}catch{status.textContent=`Hãy sao chép liên kết này: ${url}`;}}
  host.addEventListener('change',event=>{
    if(!event.target.matches('[data-dream-version]'))return;
    versionIndex=Number(event.target.value);variantMap[config.car]=versionIndex;writeStore('dreamVariants',variantMap);
    const version=versionFor(config.car,versionIndex);
    window.dispatchEvent(new CustomEvent('zuzong-dream-variant-change',{detail:{car:config.car,index:versionIndex,version:version.name}}));
    render();
  });
  host.addEventListener('click',async event=>{
    const carChoice=event.target.closest('[data-dream-car]');
    if(carChoice){
      const nextCar=cars.find(item=>item.id===carChoice.dataset.dreamCar);
      if(!nextCar||nextCar.id===config.car)return;
      const studioChoice=[...(studio?.querySelectorAll('[data-brand]')||[])].find(button=>button.dataset.brand===nextCar.id);
      if(studioChoice){studioChoice.click();return;}
      const savedConfigs=objectStore('carConfigs');
      config=cleanConfig({...savedConfigs[nextCar.id],car:nextCar.id});
      versionIndex=Number.isInteger(Number(variantMap[config.car]))?Number(variantMap[config.car]):VERSION_DATA[config.car].variants.findIndex(item=>item.tag==='Mẫu đang xem');
      if(versionIndex<0)versionIndex=0;
      render();return;
    }
    const save=event.target.closest('[data-dream-save]');
    if(save){
      const addons=addonsFor(config.car),version=versionFor(config.car,versionIndex),items=savedCars();
      const already=items.some(item=>JSON.stringify(cleanConfig(item.config||item))===JSON.stringify(config)&&Number(item.versionIndex)===versionIndex&&JSON.stringify(validAccessories(item.accessories))===JSON.stringify(addons));
      if(already){host.querySelector('[data-dream-status]').textContent='Cấu hình này đã có trong thư viện yêu thích.';return;}
      const item={...config,id:`dream-${Date.now().toString(36)}`,versionIndex,versionName:version.name,versionSource:version.source,accessories:addons,created:new Date().toISOString()};
      if(!writeStore('dreamCars',[item,...items])){host.querySelector('[data-dream-status]').textContent='Không lưu được. Hãy kiểm tra dung lượng lưu trữ trình duyệt.';return;}
      render();host.querySelector('[data-dream-status]').textContent='Đã lưu màu xe, phiên bản và phụ kiện vào thư viện yêu thích.';return;
    }
    if(event.target.closest('[data-dream-share-current]')){await copy(shareUrl({config,versionIndex,accessories:addonsFor(config.car)}));return;}
    const share=event.target.closest('[data-dream-share]');
    if(share){const item=savedCars().find(saved=>saved.id===share.dataset.dreamShare);if(item)await copy(shareUrl(item));return;}
    const open=event.target.closest('[data-dream-open]');
    if(open){const item=savedCars().find(saved=>saved.id===open.dataset.dreamOpen);if(item)location.href=shareUrl(item);return;}
    const remove=event.target.closest('[data-dream-remove]');
    if(remove){const next=savedCars().filter(item=>item.id!==remove.dataset.dreamRemove);writeStore('dreamCars',next);render();}
  });
  studio?.addEventListener('studio-change',event=>{
    if(!event.detail?.car||!cars.some(car=>car.id===event.detail.car))return;
    const changedCar=config.car!==event.detail.car;config=cleanConfig(event.detail);
    if(changedCar){sharedAccessories&&sharedAccessories.splice(0,sharedAccessories.length);versionIndex=Number.isInteger(Number(variantMap[config.car]))?Number(variantMap[config.car]):VERSION_DATA[config.car].variants.findIndex(item=>item.tag==='Mẫu đang xem');if(versionIndex<0)versionIndex=0;}
    render();
  });
  window.addEventListener('zuzong-accessories-change',event=>{if(event.detail?.car===config.car){accessoryMap[config.car]=validAccessories(event.detail.accessories);sharedAccessories&&sharedAccessories.splice(0,sharedAccessories.length);render();}});
  render();
}
