export const TECH_SPECS={
  corvette:{
    brand:'Chevrolet',model:'Corvette C7',variant:'Stingray Z51 · 2019',engine:'V8 LT1 hút khí tự nhiên · 6,2 L',litres:6.2,kw:343,powerLabel:'343 kW / 466 PS',torque:630,torqueLabel:'630 Nm',accel:4.2,speed:290,speedLabel:'290 km/h',transmission:'Tự động 8 cấp',drive:'Cầu sau',
    source:'https://media.chevrolet.com/content/dam/Media/documents/INTL/chevrolet/2019/vehicles/corvette-stingray/Tech-Data-Chevrolet-Corvette-Stingray.pdf',sourceLabel:'Chevrolet Product Information — Corvette Stingray Z51'
  },
  bmw:{
    brand:'BMW',model:'M4 G82 Coupé',variant:'M4 Coupé tiêu chuẩn · 03/2021',engine:'I6 S58 tăng áp kép · 3,0 L',litres:3.0,kw:353,powerLabel:'353 kW / 480 PS',torque:550,torqueLabel:'550 Nm',accel:4.2,speed:250,speedLabel:'250 km/h',transmission:'Số sàn 6 cấp',drive:'Cầu sau',
    source:'https://www.press.bmwgroup.com/global/article/attachment/T0326324EN/472231',sourceLabel:'BMW Media Information — M4 Coupé 03/2021'
  },
  porsche:{
    brand:'Porsche',model:'911 GT3 (992)',variant:'911 GT3 992.1 · PDK',engine:'Boxer 6 hút khí tự nhiên · 4,0 L',litres:4.0,kw:375,powerLabel:'375 kW / 510 PS',torque:470,torqueLabel:'470 Nm',accel:3.4,speed:318,speedLabel:'318 km/h',transmission:'PDK 7 cấp',drive:'Cầu sau',
    source:'https://newsroom.porsche.com/dam/jcr%3Afb50dab0-0b3d-4b2d-b4d7-70e42fc381cf/PAG_992_GT3_EN.pdf',sourceLabel:'Porsche Newsroom — 911 GT3 992.1'
  },
  mercedes:{
    brand:'Mercedes-AMG',model:'SL 63 4MATIC+',variant:'SL 63 4MATIC+ · R232',engine:'V8 biturbo · 4,0 L',litres:4.0,kw:430,powerLabel:'430 kW / 585 PS',torque:800,torqueLabel:'800 Nm',accel:3.6,speed:315,speedLabel:'315 km/h',transmission:'AMG MCT 9G',drive:'4MATIC+ 4 bánh',
    source:'https://media.mercedes-benz.fr/lancement-commercial-du-mercedes-amg-sl/',sourceLabel:'Mercedes-Benz Media — AMG SL 63 4MATIC+'
  },
  lamborghini:{
    brand:'Lamborghini',model:'Revuelto',variant:'Revuelto · HPEV 2024',engine:'V12 6,5 L + 3 mô-tơ điện',litres:6.5,kw:747,powerLabel:'747 kW / 1.015 CV',torque:725,torqueLabel:'725 Nm · riêng V12',accel:2.5,speed:350,speedLabel:'>350 km/h',transmission:'Ly hợp kép 8 cấp',drive:'4 bánh điện hóa',
    source:'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_detail/revuelto/2024/brochure/REVUELTO_DIGITAL_BROCHURE_EN_2024.pdf',sourceLabel:'Lamborghini Revuelto Digital Brochure 2024'
  }
};

const ORDER=['corvette','bmw','porsche','mercedes','lamborghini'];
const METRICS={
  kw:{label:'Công suất',unit:'kW',decimals:0,note:'Cùng quy đổi sang kW để so sánh trực tiếp.'},
  torque:{label:'Mô-men xoắn',unit:'Nm',decimals:0,note:'Revuelto: 725 Nm là mô-men riêng của động cơ V12, không phải mô-men toàn hệ hybrid.'},
  accel:{label:'0–100 km/h',unit:'giây',decimals:1,note:'Số thấp hơn nghĩa là tăng tốc nhanh hơn.'},
  speed:{label:'Tốc độ tối đa',unit:'km/h',decimals:0,note:'BMW hiển thị mức giới hạn tiêu chuẩn 250 km/h; Lamborghini được hãng công bố trên 350 km/h.'}
};
const esc=value=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const format=(value,decimals=0)=>Number(value).toLocaleString('vi-VN',{minimumFractionDigits:decimals,maximumFractionDigits:decimals});
const formatChartValue=(car,id,metricId,decimals)=>metricId==='speed'&&id==='lamborghini'?'>350':format(car[metricId],decimals);

export function mountTechnicalSpecs(host,studio){
  if(!host||host.dataset.mounted)return;
  host.dataset.mounted='true';
  let studioCarId = studio?.dataset.car;
  try { studioCarId = JSON.parse(studio?.dataset.config || '{}').car || studioCarId; } catch {}
  let carId = ORDER.includes(studioCarId) ? studioCarId : 'lamborghini';
  let metricId='kw';
  host.innerHTML=`<div class="z-ts-shell">
    <header class="z-ts-head">
      <h2>Thông số kỹ thuật</h2>
      <p>Chọn mẫu xe để xem thông số theo phiên bản. Đổi chỉ số trên biểu đồ để so sánh cả 5 mẫu.</p>
    </header>
    <div class="z-ts-car-tabs" role="tablist" aria-label="Chọn xe để xem thông số">${ORDER.map(id=>{const car=TECH_SPECS[id];return `<button type="button" role="tab" id="z-ts-tab-${id}" aria-controls="z-ts-profile" data-ts-car="${id}"><strong>${esc(car.brand)}</strong><span>${esc(car.model)}</span></button>`;}).join('')}</div>
    <div class="z-ts-board">
      <section class="z-ts-profile" id="z-ts-profile" role="tabpanel" tabindex="0">
        <p class="z-ts-variant" data-ts-variant></p>
        <h3 data-ts-model></h3>
        <p class="z-ts-engine" data-ts-engine></p>
        <dl class="z-ts-primary">
          <div><dt>Dung tích</dt><dd><b data-ts-litres></b><small>L</small></dd></div>
          <div><dt>Công suất</dt><dd data-ts-power></dd></div>
          <div><dt>Mô-men xoắn</dt><dd data-ts-torque></dd></div>
          <div><dt>0–100 km/h</dt><dd><b data-ts-accel></b><small>giây</small></dd></div>
          <div><dt>Tốc độ tối đa</dt><dd data-ts-speed></dd></div>
        </dl>
        <div class="z-ts-drivetrain"><div><span>Hộp số</span><strong data-ts-transmission></strong></div><div><span>Dẫn động</span><strong data-ts-drive></strong></div></div>
        <a class="z-ts-source" data-ts-source target="_blank" rel="noopener noreferrer external">Mở tài liệu chính hãng <b aria-hidden="true">↗</b></a>
      </section>
      <section class="z-ts-chart" aria-labelledby="z-ts-chart-title">
        <header><div><p>So sánh 5 mẫu xe</p><h3 id="z-ts-chart-title" data-ts-chart-title></h3></div><div class="z-ts-metric-tabs" role="group" aria-label="Chọn chỉ số biểu đồ">${Object.entries(METRICS).map(([id,metric])=>`<button type="button" data-ts-metric="${id}">${esc(metric.label)}</button>`).join('')}</div></header>
        <div class="z-ts-axis" aria-hidden="true"><div><span>0</span><i></i><span data-ts-axis-max></span></div></div>
        <div class="z-ts-bars" data-ts-bars role="img"></div>
        <p class="z-ts-chart-note" data-ts-chart-note></p>
      </section>
    </div>
  </div>`;

  const bars=host.querySelector('[data-ts-bars]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function renderChart(){
    const metric=METRICS[metricId],values=ORDER.map(id=>TECH_SPECS[id][metricId]),max=Math.max(...values),axisMax=metricId==='accel'?5:Math.ceil(max/(metricId==='kw'?100:metricId==='torque'?100:50))*(metricId==='kw'?100:metricId==='torque'?100:50);
    host.querySelectorAll('[data-ts-metric]').forEach(button=>{const active=button.dataset.tsMetric===metricId;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
    host.querySelector('[data-ts-chart-title]').textContent=metric.label;
    host.querySelector('[data-ts-axis-max]').textContent=`${format(axisMax)} ${metric.unit}`;
    host.querySelector('[data-ts-chart-note]').textContent=metric.note;
    const summary=ORDER.map(id=>{const car=TECH_SPECS[id];return `${car.model}: ${formatChartValue(car,id,metricId,metric.decimals)} ${metric.unit}`;}).join('; ');
    bars.setAttribute('aria-label',`${metric.label}. ${summary}`);
    bars.innerHTML=ORDER.map(id=>{const car=TECH_SPECS[id],value=car[metricId],width=Math.max(4,Math.min(100,value/axisMax*100));return `<div class="z-ts-bar-row${id===carId?' is-selected':''}" data-ts-bar-car="${id}"><div class="z-ts-bar-label"><strong>${esc(car.brand)}</strong><span>${esc(car.model)}</span></div><div class="z-ts-bar-track"><i style="--ts-width:${width}%"></i></div><b>${formatChartValue(car,id,metricId,metric.decimals)} <small>${metric.unit}</small></b></div>`;}).join('');
    if(!reduced.matches){bars.classList.remove('is-changing');requestAnimationFrame(()=>bars.classList.add('is-changing'));}
  }
  function renderCar(){
    const car=TECH_SPECS[carId];
    host.querySelectorAll('[data-ts-car]').forEach(button=>{const active=button.dataset.tsCar===carId;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
    host.querySelector('#z-ts-profile').setAttribute('aria-labelledby',`z-ts-tab-${carId}`);
    host.querySelector('[data-ts-variant]').textContent=`${car.brand} / ${car.variant}`;
    host.querySelector('[data-ts-model]').textContent=car.model;
    host.querySelector('[data-ts-engine]').textContent=car.engine;
    host.querySelector('[data-ts-litres]').textContent=format(car.litres,1);
    host.querySelector('[data-ts-power]').textContent=car.powerLabel;
    host.querySelector('[data-ts-torque]').textContent=car.torqueLabel;
    host.querySelector('[data-ts-accel]').textContent=format(car.accel,1);
    host.querySelector('[data-ts-speed]').textContent=car.speedLabel;
    host.querySelector('[data-ts-transmission]').textContent=car.transmission;
    host.querySelector('[data-ts-drive]').textContent=car.drive;
    const source=host.querySelector('[data-ts-source]');source.href=car.source;source.setAttribute('aria-label',`Mở nguồn chính hãng: ${car.sourceLabel}`);
    renderChart();
  }
  host.addEventListener('click',event=>{
    const carButton=event.target.closest('[data-ts-car]');if(carButton&&carButton.dataset.tsCar!==carId){carId=carButton.dataset.tsCar;renderCar();return;}
    const metricButton=event.target.closest('[data-ts-metric]');if(metricButton&&metricButton.dataset.tsMetric!==metricId){metricId=metricButton.dataset.tsMetric;renderChart();}
  });
  host.addEventListener('keydown',event=>{
    const button=event.target.closest('[data-ts-car]');if(!button||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const current=ORDER.indexOf(button.dataset.tsCar);const next=event.key==='Home'?0:event.key==='End'?ORDER.length-1:(current+(event.key==='ArrowRight'?1:-1)+ORDER.length)%ORDER.length;carId=ORDER[next];renderCar();host.querySelector(`[data-ts-car="${carId}"]`).focus();
  });
  bars.addEventListener('animationend',()=>bars.classList.remove('is-changing'));
  studio?.addEventListener('studio-change', event => {
    const next = event.detail?.car;
    if (!ORDER.includes(next) || next === studioCarId) return;
    studioCarId = next;
    if (next === carId) return;
    carId = next;
    renderCar();
  });
  renderCar();
  if(location.hash==='#technical-specs'){
    const reveal=()=>host.scrollIntoView({block:'start'});
    if('scrollRestoration' in history)history.scrollRestoration='manual';
    requestAnimationFrame(reveal);
    setTimeout(reveal,400);
    setTimeout(reveal,1200);
    window.addEventListener('load',()=>setTimeout(reveal,80),{once:true});
    window.addEventListener('pageshow',()=>setTimeout(reveal,80),{once:true});
  }
}
