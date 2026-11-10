import {cars,getCar,palettes,colorOf,cleanConfig,readStore} from './studio-data.js';
import {ADDONS} from './smart-ownership.js';
import {VERSION_DATA} from './version-comparison.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const savedObject=key=>{const value=readStore(key,{});return value&&typeof value==='object'&&!Array.isArray(value)?{...value}:{};};
const validAccessories=items=>Array.isArray(items)?items.filter(id=>ADDONS.some(item=>item.id===id)):[];
const accessoryColorNames={black:'Đen',red:'Đỏ Racing',tan:'Nâu da',beige:'Kem',silver:'Bạc',navy:'Xanh Navy'};
const comparisonImage={
  corvette:'assets/editorial/products-cinema-pinterest-v1/corvette-c7-full-car.webp',
  bmw:'assets/editorial/products-cinema-pinterest-v1/bmw-m4-g82-full-car.webp',
  porsche:'assets/editorial/products-cinema-pinterest-v1/porsche-911-gt3-full-car.webp',
  mercedes:'assets/editorial/products-cinema-pinterest-v1/mercedes-sl63-full-car.webp',
  lamborghini:'assets/editorial/products-cinema-pinterest-v1/lamborghini-revuelto-full-car.webp'
};

export function mountBeforeAfter(host,studio){
  if(!host||host.dataset.mounted)return;
  host.dataset.mounted='true';
  let config=cleanConfig({});
  try{config=cleanConfig(JSON.parse(studio?.dataset.config||'{}'));}catch{}
  let carConfigs=savedObject('carConfigs');
  let accessories=savedObject('accessorySelections')[config.car]||[];
  let accessoryColors=savedObject('dreamAccessoryColors')[config.car]||{};
  let variantIndexes=savedObject('dreamVariants');
  function colorSummary(part,id){
    const item=palettes[part].find(color=>color.id===id)||palettes[part][0];
    return '<span class="z-ba-value"><i style="--ba-color:'+item.hex+'" aria-hidden="true"></i>'+esc(item.name)+'</span>';
  }
  function versionFor(carId){
    const variants=VERSION_DATA[carId].variants,index=Number(variantIndexes[carId]);
    return variants[index]||variants.find(item=>item.tag==='Mẫu đang xem')||variants[0];
  }
  function render(){
    const car=getCar(config.car),base=cleanConfig({car:car.id});
    const upgrades=validAccessories(accessories).map(id=>ADDONS.find(item=>item.id===id));
    const baseVersion=VERSION_DATA[car.id].variants.find(item=>item.tag==='Mẫu đang xem')||VERSION_DATA[car.id].variants[0];
    const upgradedVersion=versionFor(car.id);
    const changed=base.body!==config.body||base.calipers!==config.calipers||base.rims!==config.rims||upgrades.length>0||baseVersion.name!==upgradedVersion.name;
    const tabs=cars.map(item=>'<button type="button" data-ba-car="'+item.id+'" aria-pressed="'+(item.id===car.id)+'"><span>'+esc(item.brand)+'</span><strong>'+esc(item.name)+'</strong></button>').join('');
    const baseRows=[['Màu sơn',colorSummary('body',base.body)],['Heo phanh',colorSummary('calipers',base.calipers)],['Mâm xe',colorSummary('rims',base.rims)]];
    const currentRows=[['Màu sơn',colorSummary('body',config.body)],['Heo phanh',colorSummary('calipers',config.calipers)],['Mâm xe',colorSummary('rims',config.rims)]];
    const upgradeMarkup=upgrades.length?'<span class="z-ba-chips">'+upgrades.map(item=>{
      const color=accessoryColors[item.id]||'';
      return '<span>'+esc(item.name)+(color?' · '+esc(accessoryColorNames[color]||color):'')+'</span>';
    }).join('')+'</span>':'Chưa chọn';
    host.innerHTML='<div class="z-ba-shell"><header class="z-ba-heading"><div><p class="z-experience-kicker">BEFORE / AFTER</p><h2>Cùng một mẫu xe.<br><em>Hai cách hoàn thiện.</em></h2></div><p>Chọn một trong năm xe rồi so sánh cấu hình mặc định với lựa chọn hiện tại.</p></header><div class="z-ba-car-tabs" role="group" aria-label="Chọn một trong năm xe">'+tabs+'</div><p class="z-ba-car-label">'+esc(car.brand)+' / '+esc(car.name)+'</p><figure class="z-ba-hero"><img src="'+comparisonImage[car.id]+'" alt="Ảnh tham khảo '+esc(car.brand+' '+car.name)+'" loading="lazy"><figcaption>Ảnh tham khảo của mẫu xe · màu và phụ kiện được liệt kê bên dưới</figcaption></figure><div class="z-ba-compare"><article class="z-ba-card"><div class="z-ba-paint-block" style="--ba-color:'+colorOf(base,'body').hex+'"></div><div class="z-ba-card-title"><div><small>Cấu hình mặc định trong Studio</small><h3>'+esc(baseVersion.name)+'</h3></div><b>01</b></div><dl>'+baseRows.map(row=>'<div><dt>'+row[0]+'</dt><dd>'+row[1]+'</dd></div>').join('')+'<div><dt>Phụ kiện</dt><dd>Chưa chọn</dd></div></dl></article><div class="z-ba-divider" aria-hidden="true"><span>SO SÁNH</span><i>↔</i></div><article class="z-ba-card is-upgraded"><div class="z-ba-paint-block" style="--ba-color:'+colorOf(config,'body').hex+'"></div><div class="z-ba-card-title"><div><small>'+(changed?'Lựa chọn hiện tại':'Bạn chưa thay đổi cấu hình')+'</small><h3>'+esc(upgradedVersion.name)+'</h3></div><b>02</b></div><dl>'+currentRows.map(row=>'<div><dt>'+row[0]+'</dt><dd>'+row[1]+'</dd></div>').join('')+'<div><dt>Phụ kiện</dt><dd>'+upgradeMarkup+'</dd></div></dl></article></div><footer class="z-ba-footer"><p>'+(changed?'Đang so sánh các lựa chọn bạn đã thay đổi.':'Chọn màu trong Studio hoặc thêm phụ kiện để thấy điểm khác biệt.')+' <small>Ảnh xe chỉ để nhận diện mẫu; phối màu và phụ kiện được ghi theo cấu hình, không chỉnh sửa trên ảnh.</small></p><div><a href="#products-studio">Đổi màu xe ↗</a><a href="#my-dream-car">Phối xe và phụ kiện ↗</a><a href="#version-comparison">Xem các phiên bản ↗</a></div></footer><p class="z-ba-note">“Nguyên bản” là cấu hình mặc định của đồ án, không phải cấu hình đặt hàng chính hãng.</p></div>';
    host.querySelector('.z-ba-hero').style.setProperty('--ba-image',`url("${comparisonImage[car.id]}")`);
  }
  host.addEventListener('click',event=>{
    const button=event.target.closest('[data-ba-car]');
    if(!button||button.dataset.baCar===config.car)return;
    const carId=button.dataset.baCar;
    carConfigs= savedObject('carConfigs');
    config=cleanConfig({...carConfigs[carId],car:carId});
    accessories=savedObject('accessorySelections')[carId]||[];
    accessoryColors=savedObject('dreamAccessoryColors')[carId]||{};
    render();
    window.dispatchEvent(new CustomEvent('zuzong-config-preview',{detail:{...config}}));
  });
  studio?.addEventListener('studio-change',event=>{
    if(!event.detail?.car||!cars.some(car=>car.id===event.detail.car))return;
    const changedCar=config.car!==event.detail.car;
    config=cleanConfig(event.detail);
    if(changedCar){
      accessories=savedObject('accessorySelections')[config.car]||[];
      accessoryColors=savedObject('dreamAccessoryColors')[config.car]||{};
    }
    render();
  });
  window.addEventListener('zuzong-accessories-change',event=>{
    if(event.detail?.car===config.car){
      accessories=event.detail.accessories||[];
      accessoryColors=event.detail.accessoryColors||savedObject('dreamAccessoryColors')[config.car]||{};
      render();
    }
  });
  window.addEventListener('zuzong-dream-variant-change',event=>{
    if(event.detail?.car===config.car){variantIndexes[config.car]=event.detail.index;render();}
  });
  render();
}
