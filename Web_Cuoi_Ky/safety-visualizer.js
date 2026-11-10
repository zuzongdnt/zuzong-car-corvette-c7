const SAFETY_CARS={
  corvette:{
    brand:'Chevrolet',model:'Corvette C7',exterior:'assets/gallery-real-v1/corvette-hero-real-v1.webp',interior:'assets/interior-photo-v1/corvette-c7-cabin-alt-web.webp',
    source:'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/2017/Chevrolet/Corvette/Owner%27s%20Manual.pdf',sourceLabel:'Corvette Owner’s Manual 2017',
    layers:{
      camera:{title:'Nhìn rõ vùng sau khi lùi.',summary:'Rear Vision Camera đưa hình ảnh phía sau lên màn hình khi vào số lùi, hỗ trợ đỗ xe và thao tác ở tốc độ thấp.',items:['Camera lùi hiển thị vùng phía sau','Đường dẫn hướng phụ thuộc cấu hình','Không thay thế việc quan sát gương và quay đầu'],availability:'Camera và chức năng hiển thị thay đổi theo phiên bản, thị trường.'},
      sensors:{title:'Cảnh báo khoảng cách phía sau.',summary:'Rear Parking Assist, nếu được trang bị, dùng cảm biến trên cản sau và tiếng bíp để báo vật cản khi lùi chậm.',items:['Cảm biến siêu âm ở cản sau','Tần suất âm báo tăng khi đến gần','Vật thể thấp hoặc ngoài vùng quét có thể không được nhận biết'],availability:'Rear Parking Assist là trang bị tùy cấu hình.'},
      airbags:{title:'Bảo vệ người ngồi trong va chạm.',summary:'Hệ thống túi khí phối hợp cùng dây đai và cảm biến va chạm; túi khí trước và túi khí bên ghế hỗ trợ bảo vệ các vùng chính.',items:['Túi khí trước cho người lái và hành khách','Túi khí bên tích hợp ghế','Cảm biến ghế hành khách kiểm soát trạng thái túi khí'],availability:'Số lượng và trạng thái hoạt động phải kiểm tra theo xe thực tế.'},
      assist:{title:'Giữ xe ổn định và cảnh báo vùng khuất.',summary:'StabiliTrak và kiểm soát lực kéo hỗ trợ ổn định; một số xe có cảnh báo điểm mù hoặc phương tiện cắt ngang phía sau.',items:['Kiểm soát ổn định và lực kéo','Side Blind Zone Alert nếu được trang bị','Rear Cross Traffic Alert nếu được trang bị'],availability:'Các cảnh báo điểm mù và cắt ngang là trang bị tùy chọn.'}
    }
  },
  bmw:{
    brand:'BMW',model:'M4 G82 Coupé',exterior:'assets/gallery-real-v1/bmw-hero-real-v1.webp',interior:'assets/interior-photo-v1/bmw-m4-g82-cabin-web.webp',
    source:'https://www.press.bmwgroup.com/global/article/detail/T0439308EN/the-new-bmw-m4-coup%C3%A9-the-new-bmw-m4-convertible?language=en',sourceLabel:'BMW Group PressClub — BMW M4 Coupé',
    layers:{
      camera:{title:'Hỗ trợ quan sát và lùi theo quỹ đạo.',summary:'Camera lùi phối hợp Parking Assistant để hiển thị vùng sau; Reversing Assistant có thể hỗ trợ lặp lại quãng lùi đã ghi nhận.',items:['Camera lùi trên màn hình trung tâm','Parking Assistant hỗ trợ vào và ra chỗ đỗ','Surround View thuộc gói mở rộng tùy cấu hình'],availability:'Camera toàn cảnh và một số chức năng phụ thuộc gói trang bị.'},
      sensors:{title:'Đo khoảng trống quanh đầu và đuôi xe.',summary:'Park Distance Control dùng cảm biến trước và sau để cảnh báo khoảng cách khi đỗ hoặc di chuyển chậm.',items:['Cảm biến ở cản trước và sau','Cảnh báo hình ảnh và âm thanh','Bề mặt mỏng hoặc rất thấp có thể khó nhận biết'],availability:'Cấu hình cảm biến khác nhau theo năm xe và thị trường.'},
      airbags:{title:'Nhiều lớp bảo vệ quanh khoang lái.',summary:'Túi khí trước, túi khí bên và hệ thống bảo vệ vùng đầu phối hợp dây đai để giảm nguy cơ chấn thương.',items:['Túi khí trước','Túi khí bên và bảo vệ vùng đầu','Dây đai có bộ căng và giới hạn lực'],availability:'Vị trí chính xác cần đối chiếu nhãn AIRBAG và sổ tay của xe.'},
      assist:{title:'Cảnh báo sớm trước tình huống nguy hiểm.',summary:'M4 có cảnh báo va chạm trước kèm can thiệp phanh, cảnh báo lệch làn và nhận biết biển báo; các gói nâng cao bổ sung hỗ trợ làn và ga tự động.',items:['Front Collision Warning với hỗ trợ phanh','Lane Departure Warning và hỗ trợ đưa xe về làn','Driving Assistant Professional tùy chọn'],availability:'Phạm vi hoạt động và gói hỗ trợ thay đổi theo cấu hình.'}
    }
  },
  porsche:{
    brand:'Porsche',model:'911 GT3 (992)',exterior:'assets/gallery-real-v1/porsche-hero-real-v1.webp',interior:'assets/interior-photo-v1/porsche-911-gt3-992-cabin-web.webp',
    source:'https://newsroom.porsche.com/en/press-kits/911-GT3.html',sourceLabel:'Porsche Newsroom — 911 GT3 Press Kit',
    layers:{
      camera:{title:'Camera lùi tập trung vào thao tác phía sau.',summary:'911 GT3 có camera lùi kết hợp ParkAssist phía sau theo cấu hình và thị trường, giúp nhìn rõ khu vực sát đuôi xe.',items:['Hình ảnh trực tiếp phía sau','Đường dẫn hướng hỗ trợ căn xe','Không phải mọi thị trường có cùng trang bị'],availability:'Camera lùi và ParkAssist được xác nhận trên các cấu hình GT3 được Porsche công bố.'},
      sensors:{title:'ParkAssist ưu tiên vùng phía sau.',summary:'Cảm biến phía sau phát hiện vật cản khi lùi; một số đời hoặc thị trường có cấu hình hỗ trợ khác.',items:['Cảm biến khoảng cách phía sau','Cảnh báo tăng dần theo khoảng cách','Không minh họa phạm vi đo chính xác'],availability:'GT3 thiên về hệ hỗ trợ gọn; trang bị thay đổi theo thị trường.'},
      airbags:{title:'Bảo vệ trước và vùng ngực bên hông.',summary:'Hệ thống túi khí phối hợp dây đai; ghế GT3 có túi khí vùng ngực tích hợp theo thông tin Porsche công bố.',items:['Túi khí trước','Túi khí ngực tích hợp ghế','Dây đai ba điểm và cảnh báo thắt dây'],availability:'Loại ghế và số túi khí có thể khác theo đời xe.'},
      assist:{title:'Hỗ trợ vừa đủ, giữ trọng tâm vào người lái.',summary:'Các cấu hình mới có Warn and Brake Assist, nhận biết biển báo và theo dõi sự chú ý; hỗ trợ làn tùy năm xe và thị trường.',items:['Warn and Brake Assist','Driver Awareness Detection','Lane Keeping Assist tùy cấu hình'],availability:'Không giả định GT3 có toàn bộ hệ thống của dòng 911 thông thường.'}
    }
  },
  mercedes:{
    brand:'Mercedes-AMG',model:'SL 63 4MATIC+',exterior:'assets/gallery-real-v1/mercedes-hero-real-v1.webp',interior:'assets/interior-photo-v1/mercedes-amg-sl63-cabin-alt-web.webp',
    source:'https://media.mercedes-benz.com/en/article/2a148583-5f05-4ac3-9a9d-69cd885fd4ec',sourceLabel:'Mercedes-Benz Media — AMG SL',
    layers:{
      camera:{title:'Camera hỗ trợ đỗ và quan sát phía sau.',summary:'Dòng AMG SL dùng camera, cảm biến và radar để theo dõi môi trường; Active Park Assist có thể phối hợp camera lùi theo phiên bản.',items:['Camera lùi cho thao tác đỗ','Góc nhìn toàn cảnh tùy gói','Hình ảnh hỗ trợ không thay thế quan sát trực tiếp'],availability:'Camera 360° và gói đỗ xe phụ thuộc cấu hình.'},
      sensors:{title:'Theo dõi môi trường bằng nhiều loại cảm biến.',summary:'Các hệ thống hỗ trợ AMG SL sử dụng cảm biến, camera và radar để nhận biết giao thông và vật cản xung quanh.',items:['Cảm biến khoảng cách khi đỗ','Radar theo dõi phương tiện','Camera nhận biết làn và tình huống phía trước'],availability:'Số lượng, vị trí và phạm vi cảm biến tùy phiên bản.'},
      airbags:{title:'Bảo vệ đầu, ngực và vùng phía trước.',summary:'Túi khí và dây đai hoạt động cùng cấu trúc thân xe; hệ thống PRE-SAFE có thể chuẩn bị khoang hành khách trước một số tình huống va chạm.',items:['Túi khí trước và bên','Bảo vệ vùng đầu tùy cấu hình','PRE-SAFE phối hợp hệ thống giữ người'],availability:'Cấu hình túi khí và PRE-SAFE thay đổi theo thị trường.'},
      assist:{title:'Cảnh báo, giữ làn và hỗ trợ phanh.',summary:'Các gói hỗ trợ có thể gồm Active Brake Assist, hỗ trợ làn, điểm mù và ga tự động thích ứng, tùy phiên bản.',items:['Cảnh báo va chạm và hỗ trợ phanh','Hỗ trợ làn và điểm mù','Ga tự động thích ứng tùy gói'],availability:'Tên và phạm vi tính năng cần kiểm tra theo cấu hình SL cụ thể.'}
    }
  },
  lamborghini:{
    brand:'Lamborghini',model:'Revuelto',exterior:'assets/gallery-real-v1/lamborghini-hero-real-v1.webp',interior:'assets/interior-photo-v1/lamborghini-revuelto-cabin-web.webp',
    source:'https://www.lamborghini.com/original/DAM/lamborghini/0_facelift_2025/model_details/revuelto/2026/brochure/03_05/Lamborghini_REVUELTO_DIGITAL_BROCHURE_EN_2026_WCAG.pdf',sourceLabel:'Lamborghini Revuelto Digital Brochure 2026',
    layers:{
      camera:{title:'Camera lùi hoặc TopView theo gói.',summary:'Gói tiêu chuẩn có camera lùi; Parking Pack mở rộng lên TopView để ghép góc nhìn quanh xe.',items:['Rear View Camera trong gói tiêu chuẩn','TopView trong Parking Pack','Surround View phụ thuộc gói và thị trường'],availability:'Gói và dịch vụ có thể khác theo yêu cầu từng thị trường.'},
      sensors:{title:'23 cảm biến làm nền cho hệ ADAS.',summary:'Lamborghini công bố Revuelto có 23 cảm biến; hệ thống đỗ quang học dùng 8 kênh tiêu chuẩn hoặc 12 kênh trong gói mở rộng.',items:['23 cảm biến trên toàn hệ thống','Optical Parking System 8 kênh tiêu chuẩn','12 kênh với Parking hoặc Surround Pack'],availability:'Con số 23 là công bố của hãng; vị trí trên hình chỉ minh họa.'},
      airbags:{title:'Hệ thống giữ người bảo vệ khoang lái.',summary:'Túi khí phối hợp dây đai và cấu trúc carbon của khoang hành khách để giảm tải chấn thương khi xảy ra va chạm.',items:['Túi khí phía trước','Bảo vệ bên hông theo cấu hình','Dây đai và cấu trúc khoang lái cùng làm việc'],availability:'Hãy kiểm tra nhãn AIRBAG và sổ tay đúng thị trường của xe.'},
      assist:{title:'ADAS mở rộng từ giữ làn đến tránh va chạm.',summary:'Revuelto có cảnh báo lệch làn, hỗ trợ đỗ và theo dõi chú ý; các gói mở rộng thêm ACC, hỗ trợ giao cắt, điểm mù và phanh khẩn cấp.',items:['Active Lane Departure Warning','Side Assist và Rear Cross Traffic tùy gói','Adaptive Cruise và phanh khẩn cấp trong gói đầy đủ'],availability:'Lamborghini lưu ý tính năng phụ thuộc yêu cầu thị trường.'}
    }
  }
};

Object.entries(SAFETY_CARS).forEach(([carId,data])=>{
  data.exterior=`assets/studio/${carId}-side.webp`;
});

const SAFETY_LAYERS=[
  {id:'camera',name:'Camera',hint:'Nhìn vùng khuất'},
  {id:'sensors',name:'Cảm biến',hint:'Đo khoảng cách'},
  {id:'airbags',name:'Túi khí',hint:'Bảo vệ người ngồi'},
  {id:'assist',name:'Trợ lái',hint:'Cảnh báo và hỗ trợ'}
];
const CAR_ORDER=['corvette','bmw','porsche','mercedes','lamborghini'];
const esc=value=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

function visualMarkup(layer){
  if(layer==='camera')return `<div class="z-sv-cone z-sv-cone-front"></div><div class="z-sv-cone z-sv-cone-rear"></div><i class="z-sv-node z-sv-node-front"></i><i class="z-sv-node z-sv-node-rear"></i><span class="z-sv-visual-label z-sv-label-front">Vùng nhìn trước</span><span class="z-sv-visual-label z-sv-label-rear">Camera lùi</span>`;
  if(layer==='sensors')return `<div class="z-sv-pings" aria-hidden="true">${['16% 60%','24% 52%','38% 70%','58% 68%','75% 54%','84% 62%'].map((position,index)=>{const [left,top]=position.split(' ');return `<i style="left:${left};top:${top};--delay:${index*.16}s"></i>`;}).join('')}</div><span class="z-sv-visual-label z-sv-label-sensor">Vị trí cảm biến minh họa</span>`;
  if(layer==='airbags')return `<div class="z-sv-airbags"><i style="left:25%;top:43%;--delay:0s"></i><i style="left:42%;top:37%;--delay:.16s"></i><i style="left:66%;top:42%;--delay:.32s"></i><i style="left:76%;top:51%;--delay:.48s"></i></div><span class="z-sv-visual-label z-sv-label-airbag">Vùng bảo vệ minh họa</span>`;
  return `<div class="z-sv-lanes" aria-hidden="true"><i></i><i></i></div><div class="z-sv-target z-sv-target-one"><span>Phương tiện</span></div><div class="z-sv-target z-sv-target-two"><span>Vùng làn</span></div><div class="z-sv-radar"></div>`;
}

export function mountSafetyVisualizer(host,studio){
  if(!host||host.dataset.mounted)return;
  host.dataset.mounted='true';
  let carId=CAR_ORDER.includes(studio?.dataset.car)?studio.dataset.car:'lamborghini';
  let layerId='camera';
  host.innerHTML=`<div class="z-sv-shell">
    <header class="z-sv-head">
      <div><p>Safety Visualizer</p><h2>Chiếc xe nhận biết<br>điều gì quanh bạn?</h2></div>
      <div><p>Chọn từng lớp để xem camera, cảm biến, túi khí và các hệ thống hỗ trợ hoạt động ở đâu.</p><span>Minh họa vị trí · Không thay thế sổ tay xe</span></div>
    </header>
    <div class="z-sv-car-tabs" role="tablist" aria-label="Chọn xe để xem hệ thống an toàn">${CAR_ORDER.map(id=>{const car=SAFETY_CARS[id];return `<button type="button" role="tab" data-sv-car="${id}"><strong>${esc(car.brand)}</strong><span>${esc(car.model)}</span></button>`;}).join('')}</div>
    <div class="z-sv-workbench" data-sv-workbench>
      <nav class="z-sv-layer-tabs" role="tablist" aria-label="Chọn lớp an toàn">${SAFETY_LAYERS.map(layer=>`<button type="button" role="tab" data-sv-layer="${layer.id}"><span>${esc(layer.name)}</span><small>${esc(layer.hint)}</small></button>`).join('')}</nav>
      <div class="z-sv-stage" data-sv-stage>
        <img data-sv-image alt="">
        <div class="z-sv-shade"></div>
        <div class="z-sv-visual" data-sv-visual></div>
        <div class="z-sv-stage-status"><span>Đang minh họa</span><strong data-sv-status></strong><small data-sv-car-label></small></div>
        <p class="z-sv-stage-note">Vùng quét và vị trí điểm sáng không phải bản vẽ hiệu chuẩn kỹ thuật.</p>
      </div>
      <aside class="z-sv-info" aria-live="polite">
        <p class="z-sv-kicker" data-sv-kicker></p>
        <h3 data-sv-title></h3>
        <p class="z-sv-summary" data-sv-summary></p>
        <div class="z-sv-reality"><span>Trên xe thực tế</span><ul data-sv-items></ul></div>
        <div class="z-sv-driver"><span>Người lái vẫn phải</span><p>Quan sát đường, giữ khoảng cách và sẵn sàng phanh hoặc đánh lái. Hệ thống chỉ hỗ trợ trong giới hạn cảm biến.</p></div>
        <p class="z-sv-availability" data-sv-availability></p>
        <a class="z-sv-source" data-sv-source target="_blank" rel="noopener">Xem nguồn nhà sản xuất <b aria-hidden="true">↗</b></a>
      </aside>
    </div>
  </div>`;

  const stage=host.querySelector('[data-sv-stage]');
  const image=host.querySelector('[data-sv-image]');
  const workbench=host.querySelector('[data-sv-workbench]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function activeCar(){return SAFETY_CARS[carId];}
  function activeLayer(){return activeCar().layers[layerId];}
  function renderLayer(){
    const car=activeCar(),layer=activeLayer(),layerMeta=SAFETY_LAYERS.find(item=>item.id===layerId);
    workbench.dataset.layer=layerId;stage.dataset.layer=layerId;
    host.querySelectorAll('[data-sv-layer]').forEach(button=>{const active=button.dataset.svLayer===layerId;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
    image.src=layerId==='airbags'?car.interior:car.exterior;
    image.alt=`${car.brand} ${car.model} — minh họa ${layerMeta.name.toLowerCase()}`;
    host.querySelector('[data-sv-visual]').innerHTML=visualMarkup(layerId);
    host.querySelector('[data-sv-status]').textContent=layerMeta.name;
    host.querySelector('[data-sv-car-label]').textContent=`${car.brand} / ${car.model}`;
    host.querySelector('[data-sv-kicker]').textContent=`${car.brand} / ${car.model} / ${layerMeta.name}`;
    host.querySelector('[data-sv-title]').textContent=layer.title;
    host.querySelector('[data-sv-summary]').textContent=layer.summary;
    host.querySelector('[data-sv-items]').innerHTML=layer.items.map(item=>`<li>${esc(item)}</li>`).join('');
    host.querySelector('[data-sv-availability]').textContent=layer.availability;
    const source=host.querySelector('[data-sv-source]');source.href=car.source;source.setAttribute('aria-label',`Mở nguồn chính hãng: ${car.sourceLabel}`);
    if(!reduced.matches){workbench.classList.remove('is-changing');requestAnimationFrame(()=>workbench.classList.add('is-changing'));}
  }
  function renderCar(){
    host.querySelectorAll('[data-sv-car]').forEach(button=>{const active=button.dataset.svCar===carId;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
    renderLayer();
  }
  function bindRoving(selector,dataKey,order,onSelect){
    host.addEventListener('keydown',event=>{
      const button=event.target.closest(selector);if(!button||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();const current=order.indexOf(button.dataset[dataKey]);const next=event.key==='Home'?0:event.key==='End'?order.length-1:(current+(event.key==='ArrowRight'?1:-1)+order.length)%order.length;
      onSelect(order[next]);host.querySelector(`${selector}[data-${dataKey.replace(/[A-Z]/g,letter=>`-${letter.toLowerCase()}`)}="${order[next]}"]`).focus();
    });
  }
  host.addEventListener('click',event=>{
    const carButton=event.target.closest('[data-sv-car]');if(carButton&&carButton.dataset.svCar!==carId){carId=carButton.dataset.svCar;renderCar();return;}
    const layerButton=event.target.closest('[data-sv-layer]');if(layerButton&&layerButton.dataset.svLayer!==layerId){layerId=layerButton.dataset.svLayer;renderLayer();}
  });
  bindRoving('[data-sv-car]','svCar',CAR_ORDER,id=>{carId=id;renderCar();});
  bindRoving('[data-sv-layer]','svLayer',SAFETY_LAYERS.map(layer=>layer.id),id=>{layerId=id;renderLayer();});
  workbench.addEventListener('animationend',()=>workbench.classList.remove('is-changing'));
  const syncStudio=event=>{const next=event.detail?.car;if(SAFETY_CARS[next]&&next!==carId){carId=next;renderCar();}};
  studio?.addEventListener('studio-change',syncStudio);
  renderCar();
  if(location.hash==='#safety-visualizer')requestAnimationFrame(()=>host.scrollIntoView({block:'start'}));
}
