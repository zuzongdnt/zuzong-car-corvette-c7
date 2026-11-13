const SAFETY_CARS={
  corvette:{
    brand:'Chevrolet',model:'Corvette C7',interior:'assets/interior-photo-v1/corvette-c7-cabin-front-web.webp',
    source:'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/2017/Chevrolet/Corvette/Owner%27s%20Manual.pdf',sourceLabel:'Corvette Owner’s Manual 2017',
    airbags:{title:'Bảo vệ người ngồi trong va chạm.',summary:'Hệ thống túi khí phối hợp cùng dây đai và cảm biến va chạm; túi khí trước và túi khí bên ghế hỗ trợ bảo vệ các vùng chính.',items:['Túi khí trước cho người lái và hành khách','Túi khí bên tích hợp ghế','Cảm biến ghế hành khách kiểm soát trạng thái túi khí'],availability:'Số lượng và trạng thái hoạt động phải kiểm tra theo xe thực tế.'}
  },
  bmw:{
    brand:'BMW',model:'M4 G82 Coupé',interior:'assets/interior-photo-v1/bmw-m4-g82-cabin-web.webp',
    source:'https://www.press.bmwgroup.com/global/article/detail/T0439308EN/the-new-bmw-m4-coup%C3%A9-the-new-bmw-m4-convertible?language=en',sourceLabel:'BMW Group PressClub — BMW M4 Coupé',
    airbags:{title:'Nhiều lớp bảo vệ quanh khoang lái.',summary:'Túi khí trước, túi khí bên và hệ thống bảo vệ vùng đầu phối hợp dây đai để giảm nguy cơ chấn thương.',items:['Túi khí trước','Túi khí bên và bảo vệ vùng đầu','Dây đai có bộ căng và giới hạn lực'],availability:'Vị trí chính xác cần đối chiếu nhãn AIRBAG và sổ tay của xe.'}
  },
  porsche:{
    brand:'Porsche',model:'911 GT3 (992)',interior:'assets/interior-photo-v1/porsche-911-gt3-992-cabin-web.webp',
    source:'https://newsroom.porsche.com/en/press-kits/911-GT3.html',sourceLabel:'Porsche Newsroom — 911 GT3 Press Kit',
    airbags:{title:'Bảo vệ trước và vùng ngực bên hông.',summary:'Hệ thống túi khí phối hợp dây đai; ghế GT3 có túi khí vùng ngực tích hợp theo thông tin Porsche công bố.',items:['Túi khí trước','Túi khí ngực tích hợp ghế','Dây đai ba điểm và cảnh báo thắt dây'],availability:'Loại ghế và số túi khí có thể khác theo đời xe.'}
  },
  mercedes:{
    brand:'Mercedes-AMG',model:'SL 63 4MATIC+',interior:'assets/interior-photo-v1/mercedes-amg-sl63-cabin-alt-web.webp',
    source:'https://media.mercedes-benz.com/en/article/2a148583-5f05-4ac3-9a9d-69cd885fd4ec',sourceLabel:'Mercedes-Benz Media — AMG SL',
    airbags:{title:'Bảo vệ đầu, ngực và vùng phía trước.',summary:'Túi khí và dây đai hoạt động cùng cấu trúc thân xe; hệ thống PRE-SAFE có thể chuẩn bị khoang hành khách trước một số tình huống va chạm.',items:['Túi khí trước và bên','Bảo vệ vùng đầu tùy cấu hình','PRE-SAFE phối hợp hệ thống giữ người'],availability:'Cấu hình túi khí và PRE-SAFE thay đổi theo thị trường.'}
  },
  lamborghini:{
    brand:'Lamborghini',model:'Revuelto',interior:'assets/interior-photo-v1/lamborghini-revuelto-cabin-web.webp',
    source:'https://www.lamborghini.com/original/DAM/lamborghini/0_facelift_2025/model_details/revuelto/2026/brochure/03_05/Lamborghini_REVUELTO_DIGITAL_BROCHURE_EN_2026_WCAG.pdf',sourceLabel:'Lamborghini Revuelto Digital Brochure 2026',
    airbags:{title:'Hệ thống giữ người bảo vệ khoang lái.',summary:'Túi khí phối hợp dây đai và cấu trúc carbon của khoang hành khách để giảm tải chấn thương khi xảy ra va chạm.',items:['Túi khí phía trước','Bảo vệ bên hông theo cấu hình','Dây đai và cấu trúc khoang lái cùng làm việc'],availability:'Hãy kiểm tra nhãn AIRBAG và sổ tay đúng thị trường của xe.'}
  }
};

const CAR_ORDER=['corvette','bmw','porsche','mercedes','lamborghini'];
const esc=value=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

export function mountSafetyVisualizer(host,studio){
  if(!host||host.dataset.mounted)return;
  host.dataset.mounted='true';
  let carId=CAR_ORDER.includes(studio?.dataset.car)?studio.dataset.car:'lamborghini';
  host.innerHTML=`<div class="z-sv-shell">
    <header class="z-sv-head">
      <h2>Túi khí trên xe</h2>
      <p>Chọn xe để xem túi khí bảo vệ người ngồi thế nào.</p>
    </header>
    <fieldset class="z-sv-selector">
      <legend>Chọn xe</legend>
      <div class="z-sv-options z-sv-vehicles">${CAR_ORDER.map(id=>{const car=SAFETY_CARS[id];return `<button type="button" data-sv-car="${id}"><strong>${esc(car.brand)}</strong><span>${esc(car.model)}</span></button>`;}).join('')}</div>
    </fieldset>
    <div class="z-sv-workbench">
      <figure class="z-sv-figure">
        <div class="z-sv-stage">
          <img data-sv-image alt="">
        </div>
        <figcaption data-sv-caption></figcaption>
      </figure>
      <div class="z-sv-info">
        <div aria-live="polite" aria-atomic="true">
          <p class="z-sv-kicker" data-sv-kicker></p>
          <h3 data-sv-title></h3>
          <p class="z-sv-summary">Túi khí phối hợp với dây đai để bảo vệ người ngồi khi va chạm.</p>
          <ol class="z-sv-flow" aria-label="Cách hoạt động"><li>Va chạm đủ mạnh</li><li>Túi khí bung</li><li>Đệm giảm lực va đập</li></ol>
          <ul class="z-sv-points" data-sv-items></ul>
        </div>
        <details class="z-sv-details" data-sv-details>
          <summary>Trang bị và nguồn</summary>
          <p data-sv-summary></p>
          <p data-sv-extra></p>
          <p data-sv-availability></p>
          <a data-sv-source target="_blank" rel="noopener">Xem nguồn nhà sản xuất <b aria-hidden="true">↗</b></a>
        </details>
      </div>
    </div>
  </div>`;

  const image=host.querySelector('[data-sv-image]');
  const details=host.querySelector('[data-sv-details]');
  function renderCar(){
    const car=SAFETY_CARS[carId],layer=car.airbags;
    const model=`${car.brand} ${car.model}`;
    details.open=false;
    host.querySelectorAll('[data-sv-car]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.svCar===carId)));
    image.src=car.interior;
    image.alt=`Khoang lái của ${model}`;
    host.querySelector('[data-sv-caption]').textContent=`Khoang lái · ${model}`;
    host.querySelector('[data-sv-kicker]').textContent=model;
    host.querySelector('[data-sv-title]').textContent=layer.title;
    host.querySelector('[data-sv-summary]').textContent=layer.summary;
    host.querySelector('[data-sv-items]').innerHTML=layer.items.slice(0,2).map(item=>`<li>${esc(item)}</li>`).join('');
    host.querySelector('[data-sv-extra]').textContent=layer.items[2];
    host.querySelector('[data-sv-availability]').textContent=layer.availability;
    const source=host.querySelector('[data-sv-source]');source.href=car.source;source.setAttribute('aria-label',`Mở nguồn chính hãng: ${car.sourceLabel}`);
  }
  host.addEventListener('click',event=>{
    const button=event.target.closest('[data-sv-car]');
    if(!button||button.dataset.svCar===carId)return;
    carId=button.dataset.svCar;
    renderCar();
  });
  host.addEventListener('keydown',event=>{
    const button=event.target.closest('[data-sv-car]');
    if(!button||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const current=CAR_ORDER.indexOf(button.dataset.svCar);
    const next=event.key==='Home'?0:event.key==='End'?CAR_ORDER.length-1:(current+(event.key==='ArrowRight'?1:-1)+CAR_ORDER.length)%CAR_ORDER.length;
    carId=CAR_ORDER[next];
    renderCar();
    host.querySelector(`[data-sv-car="${carId}"]`).focus();
  });
  const syncStudio=event=>{const next=event.detail?.car;if(SAFETY_CARS[next]&&next!==carId){carId=next;renderCar();}};
  studio?.addEventListener('studio-change',syncStudio);
  renderCar();
  if(location.hash==='#safety-visualizer')requestAnimationFrame(()=>host.scrollIntoView({block:'start'}));
}
