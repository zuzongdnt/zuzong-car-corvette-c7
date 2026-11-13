import {cars,getCar,money,configurationPrice,cleanConfig,poster,brandLogo,readStore,writeStore} from './studio-data.js';

export const ADDONS=[
  {id:'protect',kind:'Gói nâng cấp',name:'Bảo vệ ngoại thất',text:'Phim bảo vệ sơn và phủ chăm sóc bề mặt.',price:52000000},
  {id:'touring',kind:'Gói nâng cấp',name:'Gói hành trình',text:'Combo camera hành trình và sắp xếp khoang hành lý.',price:14500000},
  {id:'dashcam',kind:'Phụ kiện',name:'Camera hành trình',text:'Ghi hình hành trình phía trước.',price:12000000},
  {id:'mats',kind:'Phụ kiện',name:'Thảm sàn cabin',text:'Bộ thảm bảo vệ khu vực để chân.',price:4800000},
  {id:'cargo',kind:'Phụ kiện',name:'Bộ sắp xếp khoang hành lý',text:'Giữ vật dụng gọn khi di chuyển.',price:3500000}
];
// These are editable demo assumptions, not manufacturer consumption/service data.
const ESTIMATES={
  corvette:{litres:12.5,service:38000000},
  bmw:{litres:10.8,service:26000000},
  porsche:{litres:13.2,service:46000000},
  mercedes:{litres:11.8,service:34000000},
  lamborghini:{litres:17.5,service:85000000}
};
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function mountSmartOwnership(host,studio){
  if(!host||host.dataset.mounted)return;
  host.dataset.mounted='true';
  let config;
  try{config=cleanConfig(JSON.parse(studio?.dataset.config||'{}'));}catch{config=cleanConfig({});}
  const storedAccessories=readStore('accessorySelections',{});
  const accessorySelections=storedAccessories&&typeof storedAccessories==='object'&&!Array.isArray(storedAccessories)?{...storedAccessories}:{};
  const allowedAddons=new Set(ADDONS.map(item=>item.id));
  const accessoriesFor=car=>(Array.isArray(accessorySelections[car])?accessorySelections[car]:[]).filter(id=>allowedAddons.has(id));
  const state={car:config.car,config,tab:'finance',down:30,months:60,rate:8.5,distance:12000,fuelPrice:25000,addons:new Set(accessoriesFor(config.car))};
  let carManuallySelected=false;
  function publishAccessories(){
    accessorySelections[state.car]=[...state.addons];
    writeStore('accessorySelections',accessorySelections);
    window.dispatchEvent(new CustomEvent('zuzong-accessories-change',{detail:{car:state.car,accessories:[...state.addons]}}));
  }
  function profile(){return ESTIMATES[state.car]||ESTIMATES.corvette;}
  function totalAddons(){return ADDONS.filter(item=>state.addons.has(item.id)).reduce((sum,item)=>sum+item.price,0);}
  function tabs(){return `<div class="z-own-tabs" role="tablist" aria-label="Chọn công cụ tính toán">
    <button type="button" role="tab" data-own-tab="finance" aria-selected="${state.tab==='finance'}">Trả góp</button>
    <button type="button" role="tab" data-own-tab="cost" aria-selected="${state.tab==='cost'}">Chi phí sử dụng</button>
    <button type="button" role="tab" data-own-tab="accessories" aria-selected="${state.tab==='accessories'}">Phụ kiện</button>
  </div>`;}
  function carTabs(){return `<div class="z-own-car-tabs" role="tablist" aria-label="Chọn một trong năm xe để tính toán">${cars.map(car=>`<button type="button" role="tab" data-own-car="${car.id}" aria-selected="${state.car===car.id}" tabindex="${state.car===car.id?0:-1}"><img src="${brandLogo(car.id)}" alt="" width="25" height="25"><span><small>${esc(car.brand)}</small><strong>${esc(car.name)}</strong></span></button>`).join('')}</div>`;}
  function finance(){return `<div class="z-own-finance-grid">
    <div class="z-own-controls">
      <div class="z-own-field"><span data-own-price-label>Tổng xe + phụ kiện đã chọn</span><strong data-own-price></strong></div>
      <label class="z-own-field"><span>Trả trước <b data-own-down-label></b></span><input type="range" min="10" max="80" step="5" value="${state.down}" data-own-field="down"></label>
      <label class="z-own-field"><span>Thời hạn vay</span><select data-own-field="months"><option value="36">36 tháng</option><option value="48">48 tháng</option><option value="60" selected>60 tháng</option><option value="72">72 tháng</option><option value="84">84 tháng</option></select></label>
      <label class="z-own-field"><span>Lãi suất năm giả định</span><span class="z-own-rate"><input type="number" min="0" max="25" step="0.1" value="${state.rate}" data-own-field="rate"><b>% / năm</b></span></label>
      <small>Đổi các giả định để xem khoản trả hằng tháng thay đổi.</small>
    </div>
    <aside class="z-own-result"><span>Khoản trả ước tính mỗi tháng</span><strong data-own-monthly></strong><div class="z-own-split"><i data-own-split-down></i><i data-own-split-loan></i></div><div class="z-own-result-pair"><span>Trả trước<strong data-own-down></strong></span><span>Khoản vay<strong data-own-loan></strong></span></div><div class="z-own-result-total">Tổng lãi ước tính <b data-own-interest></b></div><small>Ước tính với khoản thanh toán hằng tháng cố định. Ngân hàng có thể áp dụng cách tính và phí khác.</small></aside>
  </div>`;}
  function ownership(){return `<div class="z-own-cost-grid">
    <div class="z-own-controls">
      <label class="z-own-field"><span>Quãng đường mỗi năm <b data-own-distance-label></b></span><input type="range" min="5000" max="40000" step="1000" value="${state.distance}" data-own-field="distance"></label>
      <label class="z-own-field"><span>Mức tiêu thụ giả định <b data-own-consumption-label></b></span><input type="range" min="6" max="25" step="0.5" value="${profile().litres}" data-own-field="consumption"></label>
      <label class="z-own-field"><span>Giá nhiên liệu tham khảo</span><span class="z-own-rate"><input type="number" min="10000" max="50000" step="500" value="${state.fuelPrice}" data-own-field="fuelPrice"><b>đ / lít</b></span></label>
      <label class="z-own-field"><span>Bảo dưỡng mỗi năm, giả định <b data-own-service-label></b></span><input type="range" min="0" max="150000000" step="5000000" value="${profile().service}" data-own-field="service"></label>
    </div>
    <aside class="z-own-cost-result"><div><span>Chi phí vận hành ước tính / 5 năm</span><strong data-own-five-year></strong></div><div class="z-own-cost-lines"><p><span>Nhiên liệu / năm</span><b data-own-fuel></b></p><p><span>Bảo dưỡng / năm</span><b data-own-service></b></p><p><span>Bình quân / tháng</span><b data-own-month-cost></b></p></div><small>Ước tính minh họa. Mức tiêu thụ và bảo dưỡng chưa xác minh theo từng đời xe; bảo hiểm, thuế, điện sạc và khấu hao chưa tính.</small></aside>
  </div>`;}
  function accessories(){return `<div class="z-own-accessory-layout"><div class="z-own-accessory-list">${ADDONS.map(item=>`<label class="z-own-addon"><input type="checkbox" data-own-addon="${item.id}" ${state.addons.has(item.id)?'checked':''}><span class="z-own-addon-copy"><small>${item.kind}</small><strong>${item.name}</strong><span>${item.text}</span></span><b>${money(item.price)}</b></label>`).join('')}</div>
    <aside class="z-own-accessory-summary"><img src="${poster(state.car)}" alt="${esc(getCar(state.car).brand+' '+getCar(state.car).name)}" loading="lazy"><div><span>Xe đang chọn</span><strong data-own-car></strong></div><p><span>Phụ kiện đã chọn</span><b data-own-addon-count></b></p><p><span>Tổng phụ kiện ước tính</span><b data-own-addon-total></b></p><div class="z-own-accessory-total"><span>Giá xe + tùy chọn</span><strong data-own-combined></strong></div><a href="#products-studio">Quay lại xem xe trong studio ↗</a></aside>
  </div><p class="z-own-disclaimer">Giá phụ kiện là mức minh họa cho đồ án, không phải báo giá hoặc danh mục tùy chọn chính hãng.</p>`;}
  function render(){
    const car=getCar(state.car);
    host.innerHTML=`<div class="z-own-shell"><header class="z-own-heading"><div><p>SMART PRICE / OWNERSHIP</p><h2>Tính trước chi phí. Chọn đúng gói.</h2></div><div><strong data-own-heading-car>${esc(car.brand+' '+car.name)}</strong><span>Giá xe hiện tại <b data-own-heading-price></b></span></div></header>${carTabs()}${tabs()}<div class="z-own-panel" role="tabpanel" data-own-panel>${state.tab==='finance'?finance():state.tab==='cost'?ownership():accessories()}</div></div>`;
    updateMetrics();
  }
  function updateMetrics(){
    const basePrice=configurationPrice(state.config),extras=totalAddons(),price=basePrice+extras;
    host.querySelectorAll('[data-own-heading-car]').forEach(el=>el.textContent=getCar(state.car).brand+' '+getCar(state.car).name);
    host.querySelector('[data-own-heading-price]').textContent=money(basePrice);
    const totalLabel=host.querySelector('[data-own-price-label]');if(totalLabel)totalLabel.textContent=extras?'Tổng xe + phụ kiện đã chọn':'Giá xe cấu hình hiện tại';
    const totalValue=host.querySelector('[data-own-price]');if(totalValue)totalValue.textContent=money(price);
    if(state.tab==='finance'){
      const principal=price*(1-state.down/100),monthlyRate=state.rate/1200,n=state.months;
      const monthly=monthlyRate?principal*monthlyRate/(1-Math.pow(1+monthlyRate,-n)):principal/n;
      const interest=Math.max(0,monthly*n-principal);
      host.querySelector('[data-own-down-label]').textContent=`${state.down}% · ${money(price*state.down/100)}`;
      host.querySelector('[data-own-monthly]').textContent=money(Math.round(monthly));
      host.querySelector('[data-own-down]').textContent=money(price*state.down/100);
      host.querySelector('[data-own-loan]').textContent=money(principal);
      host.querySelector('[data-own-interest]').textContent=money(interest);
      host.querySelector('[data-own-split-down]').style.width=state.down+'%';
      host.querySelector('[data-own-split-loan]').style.width=(100-state.down)+'%';
    }
    if(state.tab==='cost'){
      const consumption=Number(host.querySelector('[data-own-field="consumption"]').value),service=Number(host.querySelector('[data-own-field="service"]').value),litres=state.distance*consumption/100;
      const fuel=litres*state.fuelPrice,annual=fuel+service;
      host.querySelector('[data-own-distance-label]').textContent=state.distance.toLocaleString('vi-VN')+' km';
      host.querySelector('[data-own-consumption-label]').textContent=consumption.toLocaleString('vi-VN')+' l/100 km';
      host.querySelector('[data-own-service-label]').textContent=money(service);
      host.querySelector('[data-own-five-year]').textContent=money(annual*5);
      host.querySelector('[data-own-fuel]').textContent=money(fuel);
      host.querySelector('[data-own-service]').textContent=money(service);
      host.querySelector('[data-own-month-cost]').textContent=money(annual/12);
    }
    if(state.tab==='accessories'){
      host.querySelector('[data-own-car]').textContent=getCar(state.car).brand+' '+getCar(state.car).name;
      host.querySelector('[data-own-addon-count]').textContent=state.addons.size+' món';
      host.querySelector('[data-own-addon-total]').textContent=money(extras);
      host.querySelector('[data-own-combined]').textContent=money(price);
    }
  }
  host.addEventListener('click',event=>{
    const carButton=event.target.closest('[data-own-car]');
    if(carButton&&carButton.dataset.ownCar!==state.car){
      carManuallySelected=true;state.car=carButton.dataset.ownCar;state.config=cleanConfig({...state.config,car:state.car});state.addons=new Set(accessoriesFor(state.car));render();publishAccessories();return;
    }
    const tab=event.target.closest('[data-own-tab]');
    if(tab&&tab.dataset.ownTab!==state.tab){state.tab=tab.dataset.ownTab;render();}
  });
  host.addEventListener('keydown',event=>{
    const button=event.target.closest('[data-own-car]');if(!button||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const current=cars.findIndex(car=>car.id===button.dataset.ownCar),next=event.key==='Home'?0:event.key==='End'?cars.length-1:(current+(event.key==='ArrowRight'?1:-1)+cars.length)%cars.length;
    carManuallySelected=true;state.car=cars[next].id;state.config=cleanConfig({...state.config,car:state.car});state.addons=new Set(accessoriesFor(state.car));render();publishAccessories();host.querySelector(`[data-own-car="${state.car}"]`).focus();
  });
  host.addEventListener('input',event=>{
    const field=event.target.dataset.ownField;if(!field)return;
    const value=Number(event.target.value);if(!Number.isFinite(value))return;
    if(field==='down')state.down=value;
    if(field==='months')state.months=value;
    if(field==='rate')state.rate=value;
    if(field==='distance')state.distance=value;
    if(field==='fuelPrice')state.fuelPrice=value;
    updateMetrics();
  });
  host.addEventListener('change',event=>{
    const addon=event.target.dataset.ownAddon;
    if(addon){
      if(event.target.checked){
        state.addons.add(addon);
        if(addon==='touring'){state.addons.delete('dashcam');state.addons.delete('cargo');}
        if(addon==='dashcam'||addon==='cargo')state.addons.delete('touring');
      }else state.addons.delete(addon);
      host.querySelectorAll('[data-own-addon]').forEach(input=>input.checked=state.addons.has(input.dataset.ownAddon));
      updateMetrics();publishAccessories();return;
    }
    const field=event.target.dataset.ownField;if(field==='months')state.months=Number(event.target.value);
    if(field==='consumption'||field==='service')updateMetrics();
  });
  studio?.addEventListener('studio-change',event=>{
    const next=event.detail;if(!next?.car||!cars.some(car=>car.id===next.car))return;
    if(carManuallySelected&&next.car!==state.car)return;
    const changedCar=state.car!==next.car;
    state.car=next.car;state.config=cleanConfig(next);
    if(changedCar){state.addons=new Set(accessoriesFor(state.car));render();publishAccessories();}else updateMetrics();
  });
  render();
  publishAccessories();
}
