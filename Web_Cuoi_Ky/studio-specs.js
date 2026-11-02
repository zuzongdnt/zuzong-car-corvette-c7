import {getCar} from './studio-data.js';

// Match the stated reference variant rather than inferring a trim from its model.
export const vehicleSpecs={
 corvette:{variant:'Corvette C7 Stingray tiêu chuẩn / 2019',engine:'V8 LT1 hút khí tự nhiên',litres:6.2,kw:339,hp:455,hpUnit:'hp',torque:624,torqueLabel:'Mô-men xoắn',source:'https://www.corvsport.com/wp-content/uploads/2019/09/2019-Corvette-Sales-Brochure_compressed.pdf',note:'Công suất và mô-men xoắn quy đổi làm tròn từ 455 hp, 460 lb-ft; không dùng bản Z51.'},
 bmw:{variant:'BMW M4 Coupé G82 tiêu chuẩn / 2021',engine:'I6 S58 tăng áp kép',litres:3.0,kw:353,hp:480,hpUnit:'PS',torque:550,torqueLabel:'Mô-men xoắn',source:'https://www.press.bmwgroup.com/global/article/detail/T0326324EN/specifications-of-the-bmw-m4-coupe-and-the-bmw-m4-competition-coupe-valid-from-03/2021',note:'Bản 480 PS; không dùng thông số M4 Competition.'},
 porsche:{variant:'Porsche 911 GT3 / 992.1, 2021',engine:'Boxer 6 hút khí tự nhiên',litres:4.0,kw:375,hp:510,hpUnit:'PS',torque:470,torqueLabel:'Mô-men xoắn',source:'https://newsroom.porsche.com/dam/jcr%3Afb50dab0-0b3d-4b2d-b4d7-70e42fc381cf/PAG_992_GT3_EN.pdf',note:'Thế hệ 992.1; không dùng thông số GT3 RS hoặc 992.2.'},
 mercedes:{variant:'Mercedes-AMG SL 63 4MATIC+ / R232',engine:'V8 4.0L tăng áp kép',litres:4.0,kw:430,hp:577,hpUnit:'hp',torque:800,torqueLabel:'Mô-men xoắn',source:'https://media.mbusa.com/news/the-new-mercedes-amg-sl-the-new-edition-of-an-icon',note:'Thông số SL 63 V8; kW và Nm quy đổi làm tròn từ 577 hp, 590 lb-ft.'},
 lamborghini:{variant:'Lamborghini Revuelto / 2023',engine:'V12 hút khí tự nhiên + 3 mô-tơ điện',litres:6.5,kw:747,hp:1015,hpUnit:'CV',torque:725,torqueLabel:'Mô-men V12',source:'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_detail/revuelto/brochure/LB744_REVUELTO_DIGITAL_BROCHURE_ITA.pdf',note:'747 kW / 1.015 CV là toàn hệ hybrid. 725 Nm chỉ riêng V12, không phải mô-men toàn hệ.'}
};

export function mountStudioSpecs(host){
 const section=document.createElement('section');section.className='z-live-specs';
 section.setAttribute('aria-label','Thông số xe đang chọn');
 section.innerHTML='<div class="z-live-specs-heading"><div><p class="z-live-specs-kicker">Bên trong từng chuyển động</p><h3 data-spec-car></h3><p data-spec-engine></p></div><a data-spec-source target="_blank" rel="noopener">Nguồn thông số <span aria-hidden="true">↗</span></a></div><dl class="z-live-specs-grid">'+['Dung tích','Công suất','Mã lực','Mô-men xoắn'].map((label,i)=>`<div><dt data-spec-label="${i}">${label}</dt><dd><span data-spec-value="${i}" aria-hidden="true">0</span><small data-spec-unit="${i}"></small></dd></div>`).join('')+'</dl><p class="z-live-specs-note" data-spec-note></p><p class="sr-only" data-spec-status role="status" aria-live="polite"></p>';
 host.after(section);
 const values=[...section.querySelectorAll('[data-spec-value]')],units=[...section.querySelectorAll('[data-spec-unit]')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let current='',spec,targets=[],visible=false,frame=0,pending=false;
 const format=(value,index)=>index===0?value.toFixed(1).replace('.',','):Math.round(value).toLocaleString('vi-VN');
 function paint(progress){values.forEach((element,i)=>element.textContent=format(targets[i]*progress,i));}
 function finish(){cancelAnimationFrame(frame);frame=0;pending=false;if(!spec)return;paint(1);section.dataset.animating='false';}
 function animate(){
  cancelAnimationFrame(frame);pending=false;
  if(reduced.matches){finish();return;}
  section.dataset.animating='true';paint(0);const start=performance.now();
  function tick(now){
   const t=Math.min(1,(now-start)/1100),eased=1-(1-t)**3;
   paint(eased);
   if(t<1)frame=requestAnimationFrame(tick);else{frame=0;section.dataset.animating='false';}
  }
  frame=requestAnimationFrame(tick);
 }
 const observer=new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;
  if(visible&&pending)animate();else if(!visible&&frame)finish();
 },{threshold:.18});observer.observe(section);
 reduced.addEventListener('change',()=>{if(reduced.matches)finish();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
 function update(id){
  if(id===current)return;
  cancelAnimationFrame(frame);frame=0;current=id;spec=vehicleSpecs[id];if(!spec)return;
  section.dataset.car=id;targets=[spec.litres,spec.kw,spec.hp,spec.torque];
  section.querySelector('[data-spec-car]').textContent=getCar(id).name;
  section.querySelector('[data-spec-engine]').textContent=spec.engine;
  section.querySelector('[data-spec-source]').href=spec.source;
  section.querySelector('[data-spec-note]').textContent=spec.variant+'. '+spec.note;
  section.querySelector('[data-spec-label="3"]').textContent=spec.torqueLabel;
  ['L','kW',spec.hpUnit,'Nm'].forEach((unit,i)=>{units[i].textContent=unit;values[i].parentElement.setAttribute('aria-label',format(targets[i],i)+' '+unit);});
  section.querySelector('[data-spec-status]').textContent=spec.variant+': '+spec.engine+', '+spec.kw+' kW, '+spec.hp+' '+spec.hpUnit+', '+spec.torque+' Nm.';
  pending=true;
  if(visible)animate();else if(reduced.matches)finish();else{paint(0);section.dataset.animating='pending';}
 }
 return {update};
}
