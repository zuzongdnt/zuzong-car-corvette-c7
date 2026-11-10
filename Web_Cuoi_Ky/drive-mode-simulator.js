const DRIVE_CARS={
  corvette:{
    brand:'Chevrolet',model:'Corvette C7',image:'assets/unveil-five/corvette-poster.webp',defaultMode:'sport',
    source:'https://www.chevrolet.com/ownercenter/content/dam/gmownercenter/gmna/dynamic/manuals/2017/Chevrolet/Corvette/Owner%27s%20Manual.pdf',
    sourceLabel:'Corvette Owner’s Manual 2017',
    modes:[
      {id:'weather',name:'Weather',accent:'#9ddcff',rgb:'157 220 255',level:.22,use:'Mưa và tuyết',title:'Ưu tiên kiểm soát trên mặt đường trơn.',summary:'Tài liệu Chevrolet mô tả Weather dành cho mưa và tuyết; phản hồi được điều chỉnh để hạn chế trượt bánh.',plain:'Dễ kiểm soát lực kéo hơn khi độ bám thấp.',traits:[['Chân ga','Tiến triển nhẹ',.24],['Hộp số','Ưu tiên độ bám',.28],['Vô-lăng','Ổn định',.38],['Hỗ trợ','Can thiệp sớm',.86]]},
      {id:'eco',name:'Eco',accent:'#8fd5ac',rgb:'143 213 172',level:.32,use:'Di chuyển tiết kiệm',title:'Giảm tiêu hao trong hành trình thường ngày.',summary:'Eco được Chevrolet xác định là chế độ hướng đến cải thiện mức tiêu thụ nhiên liệu.',plain:'Phù hợp khi ưu tiên quãng đường và nhịp lái êm.',traits:[['Chân ga','Tiết chế',.34],['Hộp số','Ưu tiên số cao',.3],['Vô-lăng','Tự nhiên',.46],['Hỗ trợ','Tiêu chuẩn',.7]]},
      {id:'tour',name:'Tour',accent:'#d7e5ef',rgb:'215 229 239',level:.43,use:'Đi phố và đường dài',title:'Thiết lập cân bằng cho sử dụng hằng ngày.',summary:'Tour là cấu hình lái bình thường, hướng đến sự thoải mái theo mô tả trong tài liệu Corvette.',plain:'Nhịp phản hồi dễ làm quen và ít mệt khi đi xa.',traits:[['Chân ga','Cân bằng',.48],['Hộp số','Êm',.42],['Vô-lăng','Nhẹ vừa',.44],['Hỗ trợ','Tiêu chuẩn',.7]]},
      {id:'sport',name:'Sport',accent:'#ff6b42',rgb:'255 107 66',level:.72,use:'Đường khô, lái hứng khởi',title:'Phản hồi rõ hơn cho đường công cộng.',summary:'Chevrolet mô tả Sport dành cho phong cách lái hứng khởi trên đường; các thuộc tính thay đổi tùy trang bị của xe.',plain:'Xe cho cảm giác trực tiếp hơn nhưng vẫn là chế độ dùng trên đường.',traits:[['Chân ga','Nhanh',.76],['Hộp số','Giữ số lâu hơn',.72],['Vô-lăng','Nặng và rõ',.72],['Hỗ trợ','Thể thao',.58]]},
      {id:'track',name:'Track',accent:'#ffb33f',rgb:'255 179 63',level:.95,use:'Đường đua khép kín',title:'Thiết lập dành cho hoạt động trên đường đua.',summary:'Track được tài liệu Corvette chỉ định cho track use; mức can thiệp còn phụ thuộc PTM, tùy chọn và cấu hình cụ thể.',plain:'Không phải chế độ dành cho giao thông công cộng.',traits:[['Chân ga','Trực tiếp',.94],['Hộp số','Hiệu năng',.92],['Vô-lăng','Chính xác',.9],['Hỗ trợ','Theo cấu hình PTM',.34]]}
    ]
  },
  bmw:{
    brand:'BMW',model:'M4 G82 Coupé',image:'assets/unveil-five/bmw-poster.webp',defaultMode:'sport',
    source:'https://www.press.bmwgroup.com/usa/article/detail/T0317577EN_US/the-new-2021-bmw-m3-sedan-and-m4-coupe?language=en_US',
    sourceLabel:'BMW Group PressClub — M3/M4 2021',
    modes:[
      {id:'road',name:'Road',accent:'#a8d9ff',rgb:'168 217 255',level:.38,use:'Đường công cộng',title:'Đầy đủ hiển thị và hệ thống hỗ trợ.',summary:'Ở Road, các hệ thống hỗ trợ lái tiêu chuẩn và tùy chọn tiếp tục hoạt động theo cấu hình xe.',plain:'Đây là trạng thái phù hợp nhất cho việc sử dụng hằng ngày.',traits:[['Hiển thị','Thông tin đầy đủ',.44],['Hỗ trợ lái','Hoạt động',.9],['M Setup','Cấu hình riêng',.5],['Mức tập trung','Hằng ngày',.4]]},
      {id:'sport',name:'Sport',accent:'#5ba9ff',rgb:'91 169 255',level:.7,use:'Lái thể thao trên đường',title:'M View tập trung vào thông tin vận hành.',summary:'BMW cho biết Sport chuyển cụm đồng hồ và HUD sang M View; nhiều can thiệp hỗ trợ bị rút gọn trong khi các cảnh báo quan trọng vẫn còn.',plain:'Người lái thấy vòng tua, đèn báo sang số và dữ liệu động lực học rõ hơn.',traits:[['Hiển thị','M View',.86],['Hỗ trợ lái','Giảm can thiệp',.48],['M Setup','Cấu hình riêng',.72],['Mức tập trung','Cao',.78]]},
      {id:'track',name:'Track',accent:'#ff7657',rgb:'255 118 87',level:.96,use:'Đường đua khép kín',title:'Giảm tối đa yếu tố gây xao nhãng.',summary:'Track thuộc M Drive Professional và được BMW phát triển riêng cho đường đua; màn hình trung tâm cùng các chức năng tiện nghi, hỗ trợ bị tắt theo tài liệu hãng.',plain:'Chỉ nên dùng trong môi trường đường đua có kiểm soát.',traits:[['Hiển thị','Tối giản đường đua',.95],['Hỗ trợ lái','Tắt theo thiết kế',.12],['M Setup','Hiệu năng',.94],['Mức tập trung','Tối đa',1]]}
    ]
  },
  porsche:{
    brand:'Porsche',model:'911 GT3 (992)',image:'assets/unveil-five/porsche-poster.webp',defaultMode:'sport',
    source:'https://newsroom.porsche.com/dam/jcr%3Af67ebd45-3aa7-4bf9-9c6a-78d336603b7e/2022%20Porsche%20911%20GT3%20Press%20Kit.pdf',
    sourceLabel:'Porsche 911 GT3 Press Kit',
    modes:[
      {id:'normal',name:'Normal',accent:'#d9e0e5',rgb:'217 224 229',level:.4,use:'Đường công cộng',title:'Cấu hình nền cho hành trình thường ngày.',summary:'Núm Mode trên vô-lăng GT3 cho phép chuyển nhanh giữa Normal, Sport và Track.',plain:'Normal giữ giao diện vận hành quen thuộc trước khi chuyển sang các thiết lập thể thao có thể tùy chỉnh.',traits:[['Phản hồi','Cân bằng',.44],['Thiết lập','Nền',.4],['Hiển thị','Đường thường',.42],['Mục đích','Hằng ngày',.4]]},
      {id:'sport',name:'Sport',accent:'#ffd34f',rgb:'255 211 79',level:.72,use:'Lái thể thao trên đường',title:'Một cấu hình thể thao có thể cá nhân hóa.',summary:'Porsche xác nhận Sport là một trong hai chế độ có thể cấu hình riêng trên 911 GT3, chọn trực tiếp bằng núm Mode.',plain:'Người lái có thể lưu cách chiếc xe phản hồi theo sở thích thay vì nhận một bộ giá trị cố định.',traits:[['Phản hồi','Theo cấu hình',.74],['Thiết lập','Có thể lưu',.82],['Hiển thị','Tập trung',.72],['Mục đích','Đường khô',.7]]},
      {id:'track',name:'Track',accent:'#ff664f',rgb:'255 102 79',level:.96,use:'Đường đua khép kín',title:'Chế độ cấu hình riêng cho đường đua.',summary:'Track cũng có thể được cấu hình; tài liệu hãng nêu rõ đây là một trong ba chế độ trên GT3 và đi cùng các hiển thị hướng đến đường đua.',plain:'Nguồn dùng ở đây không công bố một bảng giá trị cố định cho mọi tham số.',traits:[['Phản hồi','Theo cấu hình',.94],['Thiết lập','Track preset',.96],['Hiển thị','Đường đua',.96],['Mục đích','Track only',1]]}
    ]
  },
  mercedes:{
    brand:'Mercedes-AMG',model:'SL 63 4MATIC+',image:'assets/unveil-five/mercedes-poster.webp',defaultMode:'sport',
    source:'https://media.mercedes-benz.com/en/article/2a148583-5f05-4ac3-9a9d-69cd885fd4ec',
    sourceLabel:'Mercedes-Benz Media — AMG SL',
    modes:[
      {id:'slippery',name:'Slippery',accent:'#93ddff',rgb:'147 221 255',level:.2,use:'Mặt đường trơn',title:'Làm dịu sức kéo để tăng khả năng kiểm soát.',summary:'AMG mô tả Slippery với công suất giảm và đường mô-men phẳng hơn cho điều kiện độ bám thấp.',plain:'Phản hồi êm hơn giúp tránh thay đổi lực kéo đột ngột.',traits:[['Chân ga','Dịu',.2],['Chuyển số','Mượt',.3],['Khung gầm','Ổn định',.4],['AMG Dynamics','Basic',.8]]},
      {id:'comfort',name:'Comfort',accent:'#c8d7e3',rgb:'200 215 227',level:.38,use:'Đi phố và đường dài',title:'Thiết lập hài hòa và thoải mái.',summary:'Comfort ưu tiên vận hành êm, chuyển số hài hòa cùng thiết lập vô-lăng và hệ thống treo hướng đến hành trình dài.',plain:'Phù hợp khi người ngồi ưu tiên độ êm và sự thư giãn.',traits:[['Chân ga','Cân bằng',.42],['Chuyển số','Sớm và êm',.36],['Khung gầm','Thoải mái',.34],['AMG Dynamics','Basic',.72]]},
      {id:'sport',name:'Sport',accent:'#ff6f46',rgb:'255 111 70',level:.7,use:'Đường khô, lái năng động',title:'Phản hồi nhanh hơn theo chất AMG.',summary:'Sport tăng độ nhạy chân ga, rút ngắn thời gian chuyển số và dùng thiết lập khung gầm, vô-lăng năng động hơn.',plain:'Mức thể thao rõ nhưng vẫn nằm dưới Sport+ và Race.',traits:[['Chân ga','Nhanh',.74],['Chuyển số','Ngắn hơn',.72],['Khung gầm','Chắc hơn',.7],['AMG Dynamics','Advanced',.62]]},
      {id:'sport-plus',name:'Sport+',accent:'#ff483b',rgb:'255 72 59',level:.86,use:'Lái hiệu năng cao',title:'Tăng thêm độ trực tiếp và cảm xúc.',summary:'Sport+ tiếp tục tăng độ nhạy, rút ngắn thời gian chuyển số và làm thiết lập truyền động, khung gầm, vô-lăng năng động hơn.',plain:'Phản hồi mạnh hơn Sport; cần điều kiện phù hợp và người lái chủ động.',traits:[['Chân ga','Rất nhanh',.9],['Chuyển số','Rất ngắn',.88],['Khung gầm','Hiệu năng',.86],['AMG Dynamics','Pro',.48]]},
      {id:'race',name:'Race',accent:'#ffb53d',rgb:'255 181 61',level:.98,use:'Đường đua khép kín',title:'Cấu hình hiệu năng cao nhất khi được trang bị.',summary:'AMG dành Race cho vận hành năng động trên đường đua; khả năng cung cấp chế độ này phụ thuộc phiên bản và gói trang bị.',plain:'Không phải chế độ sử dụng trong giao thông công cộng.',traits:[['Chân ga','Tối đa',1],['Chuyển số','Track',1],['Khung gầm','Track',.98],['AMG Dynamics','Master tùy bản',.3]]},
      {id:'individual',name:'Individual',accent:'#bb9cff',rgb:'187 156 255',level:.58,use:'Thiết lập cá nhân',title:'Phối hợp từng tham số theo sở thích.',summary:'Individual cho phép cá nhân hóa truyền động, hộp số, AMG DYNAMICS, khung gầm, vô-lăng và âm thanh tùy trang bị.',plain:'Đặc tính cuối cùng phụ thuộc các mục người dùng đã lưu.',traits:[['Chân ga','Tùy chọn',.58],['Chuyển số','Tùy chọn',.58],['Khung gầm','Tùy chọn',.58],['AMG Dynamics','Tùy chọn',.58]]}
    ]
  },
  lamborghini:{
    brand:'Lamborghini',model:'Revuelto',image:'assets/unveil-five/lamborghini-poster.webp',defaultMode:'sport',
    source:'https://www.lamborghini.com/sites/it-en/files/DAM/lamborghini/facelift_2019/model_detail/revuelto/2024/brochure/REVUELTO_DIGITAL_BROCHURE_EN_2024.pdf',
    sourceLabel:'Lamborghini Revuelto Digital Brochure',
    modes:[
      {id:'citta',name:'Città',accent:'#8bd7ff',rgb:'139 215 255',level:.18,use:'Trung tâm đô thị',title:'Di chuyển hằng ngày với khả năng chạy điện.',summary:'Città được thiết kế cho đô thị, có thể vận hành không phát thải và dùng dẫn động bốn bánh điện khi cần; công suất tối đa được giới hạn 180 CV.',plain:'Êm, dễ kiểm soát và ưu tiên hiệu quả năng lượng.',traits:[['Hệ truyền động','Điện ưu tiên',.2],['Hộp số','Êm',.24],['Khung gầm','Thoải mái',.3],['Khí động học','Giảm lực cản',.28]]},
      {id:'strada',name:'Strada',accent:'#d7e4ee',rgb:'215 228 238',level:.48,use:'Đường thường và cao tốc',title:'Cân bằng tiện dụng và chất thể thao.',summary:'Strada dành cho sử dụng hằng ngày và hành trình cao tốc, hướng đến độ êm, ổn định cùng khả năng vận hành linh hoạt.',plain:'Đây là dải cân bằng cho những chuyến đi dài.',traits:[['Hệ truyền động','V12 + hybrid',.52],['Hộp số','Mượt',.46],['Khung gầm','Cân bằng',.5],['Khí động học','Ổn định',.56]]},
      {id:'sport',name:'Sport',accent:'#ff6b3d',rgb:'255 107 61',level:.78,use:'Đường đèo và lái hứng khởi',title:'Phản ứng nhanh, ưu tiên cảm giác lái.',summary:'Lamborghini mô tả Sport là chế độ phản ứng nhanh và vui lái; hộp số, hệ thống treo và khí động học được định hướng tăng độ linh hoạt.',plain:'Sport kết hợp được với Recharge, Hybrid hoặc Performance trong hệ 13 cấu hình của Revuelto.',traits:[['Hệ truyền động','Phản ứng nhanh',.82],['Hộp số','Nhanh nhất',.86],['Khung gầm','Linh hoạt',.8],['Khí động học','Ưu tiên vào cua',.8]]},
      {id:'corsa',name:'Corsa',accent:'#ffbd3f',rgb:'255 189 63',level:1,use:'Đường đua khép kín',title:'Khai thác hiệu năng cao nhất trên đường đua.',summary:'Corsa là chế độ Lamborghini dành cho track; khi ghép Performance, hệ truyền động có thể đạt mức công suất hệ thống tối đa 1.015 CV.',plain:'Chỉ dùng trong môi trường đường đua phù hợp và có kiểm soát.',traits:[['Hệ truyền động','Tối đa',1],['Hộp số','Track',1],['Khung gầm','Track',.98],['Khí động học','Lực ép cao',1]]}
    ]
  }
};

Object.entries(DRIVE_CARS).forEach(([carId,data])=>{
  data.image=`assets/studio/${carId}-hero.webp`;
});

const CAR_ORDER=['corvette','bmw','porsche','mercedes','lamborghini'];
const escapeHtml=value=>String(value).replace(/[&<>'"]/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));

export function mountDriveModeSimulator(host,studio){
  if(!host||host.dataset.mounted)return;
  host.dataset.mounted='true';
  let carId=CAR_ORDER.includes(studio?.dataset.car)?studio.dataset.car:'lamborghini';
  let modeId=DRIVE_CARS[carId].defaultMode;
  host.innerHTML=`<div class="z-dm-shell">
    <header class="z-dm-head">
      <div><p>Drive Mode Simulator</p><h2>Một núm xoay.<br>Nhiều tính cách.</h2></div>
      <div class="z-dm-intro"><p>Chọn một chế độ để xem các hệ thống thay đổi theo mô tả của nhà sản xuất.</p><span><b aria-hidden="true">●</b> Chỉ mô phỏng thông tin · Không điều khiển xe</span></div>
    </header>
    <div class="z-dm-car-tabs" role="tablist" aria-label="Chọn mẫu xe">${CAR_ORDER.map(id=>{const car=DRIVE_CARS[id];return `<button type="button" role="tab" data-dm-car="${id}"><strong>${escapeHtml(car.brand)}</strong><span>${escapeHtml(car.model)}</span></button>`;}).join('')}</div>
    <div class="z-dm-console" data-dm-console>
      <nav class="z-dm-mode-rail" data-dm-modes aria-label="Chọn chế độ lái"></nav>
      <div class="z-dm-stage">
        <img data-dm-image alt="">
        <div class="z-dm-stage-shade" aria-hidden="true"></div>
        <div class="z-dm-live"><span>Đang xem</span><strong data-dm-live>SPORT</strong><small>Mô tả đặc tính</small></div>
        <div class="z-dm-dial" aria-hidden="true"><div class="z-dm-orbit"></div><div class="z-dm-needle"></div><i></i></div>
        <div class="z-dm-stage-copy"><span data-dm-use></span><h3 data-dm-stage-title></h3></div>
      </div>
      <aside class="z-dm-info" aria-live="polite">
        <p class="z-dm-info-kicker" data-dm-kicker></p>
        <h3 data-dm-title></h3>
        <p class="z-dm-summary" data-dm-summary></p>
        <div class="z-dm-plain"><span>Hiểu nhanh</span><p data-dm-plain></p></div>
        <div class="z-dm-traits" data-dm-traits></div>
        <a class="z-dm-source" data-dm-source target="_blank" rel="noopener">Đọc nguồn chính hãng <b aria-hidden="true">↗</b></a>
        <p class="z-dm-disclaimer">Mức thanh và chuyển động chỉ giúp so sánh trực quan, không phải dữ liệu đo, hướng dẫn vận hành hay kết nối với chiếc xe.</p>
      </aside>
    </div>
  </div>`;

  const consoleEl=host.querySelector('[data-dm-console]');
  const modeRail=host.querySelector('[data-dm-modes]');
  const image=host.querySelector('[data-dm-image]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');

  function activeCar(){return DRIVE_CARS[carId];}
  function activeMode(){const car=activeCar();return car.modes.find(mode=>mode.id===modeId)||car.modes[0];}
  function renderMode(){
    const car=activeCar(),mode=activeMode();
    host.dataset.car=carId;consoleEl.dataset.mode=mode.id;
    consoleEl.style.setProperty('--dm-accent',mode.accent);
    consoleEl.style.setProperty('--dm-rgb',mode.rgb);
    consoleEl.style.setProperty('--dm-needle',`${-118+mode.level*236}deg`);
    host.querySelectorAll('[data-dm-mode]').forEach(button=>{const active=button.dataset.dmMode===mode.id;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active));});
    host.querySelector('[data-dm-live]').textContent=mode.name;
    host.querySelector('[data-dm-use]').textContent=mode.use;
    host.querySelector('[data-dm-stage-title]').textContent=mode.title;
    host.querySelector('[data-dm-kicker]').textContent=`${car.brand} / ${car.model} / ${mode.name}`;
    host.querySelector('[data-dm-title]').textContent=mode.title;
    host.querySelector('[data-dm-summary]').textContent=mode.summary;
    host.querySelector('[data-dm-plain]').textContent=mode.plain;
    host.querySelector('[data-dm-traits]').innerHTML=mode.traits.map(([label,value,level])=>`<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><i aria-hidden="true"><b style="--dm-trait:${Math.round(level*100)}%"></b></i></div>`).join('');
    const source=host.querySelector('[data-dm-source]');source.href=car.source;source.setAttribute('aria-label',`Mở nguồn chính hãng: ${car.sourceLabel}`);
    if(!reduced.matches){consoleEl.classList.remove('is-changing');requestAnimationFrame(()=>consoleEl.classList.add('is-changing'));}
  }
  function renderCar(){
    const car=activeCar();
    host.querySelectorAll('[data-dm-car]').forEach(button=>{const active=button.dataset.dmCar===carId;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});
    modeRail.innerHTML=car.modes.map(mode=>`<button type="button" data-dm-mode="${mode.id}" aria-pressed="${mode.id===modeId}"><span>${escapeHtml(mode.name)}</span><small>${escapeHtml(mode.use)}</small></button>`).join('');
    image.src=car.image;image.alt=`${car.brand} ${car.model} minh họa cho chế độ lái ${activeMode().name}`;
    renderMode();
  }
  host.addEventListener('click',event=>{
    const carButton=event.target.closest('[data-dm-car]');
    if(carButton&&carButton.dataset.dmCar!==carId){carId=carButton.dataset.dmCar;modeId=activeCar().defaultMode;renderCar();return;}
    const modeButton=event.target.closest('[data-dm-mode]');
    if(modeButton&&modeButton.dataset.dmMode!==modeId){modeId=modeButton.dataset.dmMode;image.alt=`${activeCar().brand} ${activeCar().model} minh họa cho chế độ lái ${activeMode().name}`;renderMode();}
  });
  host.addEventListener('keydown',event=>{
    const button=event.target.closest('[data-dm-car]');if(!button||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const index=CAR_ORDER.indexOf(carId),next=event.key==='Home'?0:event.key==='End'?CAR_ORDER.length-1:(index+(event.key==='ArrowRight'?1:-1)+CAR_ORDER.length)%CAR_ORDER.length;
    carId=CAR_ORDER[next];modeId=activeCar().defaultMode;renderCar();host.querySelector(`[data-dm-car="${carId}"]`).focus();
  });
  consoleEl.addEventListener('animationend',()=>consoleEl.classList.remove('is-changing'));
  const syncStudio=event=>{const next=event.detail?.car;if(DRIVE_CARS[next]&&next!==carId){carId=next;modeId=activeCar().defaultMode;renderCar();}};
  studio?.addEventListener('studio-change',syncStudio);
  renderCar();
  if(location.hash==='#drive-mode-simulator')requestAnimationFrame(()=>host.scrollIntoView({block:'start'}));
}
