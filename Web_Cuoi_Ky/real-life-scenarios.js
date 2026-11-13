const CARS=[
  {
    id:'corvette',brand:'Chevrolet',model:'Corvette C7',
    images:{
      urban:'assets/real-life-scenarios/corvette-urban-v2.png',
      roadtrip:'assets/real-life-scenarios/corvette-roadtrip-v2.png',
      rain:'assets/real-life-scenarios/corvette-rain-v2.png',
      night:'assets/real-life-scenarios/corvette-night-v2.png',
      family:'assets/real-life-scenarios/corvette-family-v2.png'
    }
  },
  {
    id:'bmw',brand:'BMW',model:'M4 G82 Coupé',
    images:{
      urban:'assets/real-life-scenarios/bmw-urban-v1.webp',
      roadtrip:'assets/real-life-scenarios/bmw-roadtrip-v1.webp',
      rain:'assets/real-life-scenarios/bmw-rain-v1.webp',
      night:'assets/real-life-scenarios/bmw-night-v1.webp',
      family:'assets/real-life-scenarios/bmw-family-v1.webp'
    }
  },
  {
    id:'porsche',brand:'Porsche',model:'911 GT3 (992)',
    images:{
      urban:'assets/real-life-scenarios/porsche-urban-v2.png',
      roadtrip:'assets/real-life-scenarios/porsche-roadtrip-v2.png',
      rain:'assets/real-life-scenarios/porsche-rain-v2.png',
      night:'assets/real-life-scenarios/porsche-night-v2.png',
      family:'assets/real-life-scenarios/porsche-family-v2.png'
    }
  },
  {
    id:'mercedes',brand:'Mercedes-AMG',model:'SL 63',
    images:{
      urban:'assets/real-life-scenarios/mercedes-urban-v2.png',
      roadtrip:'assets/real-life-scenarios/mercedes-roadtrip-v2.png',
      rain:'assets/real-life-scenarios/mercedes-rain-v2.png',
      night:'assets/real-life-scenarios/mercedes-night-v2.png',
      family:'assets/real-life-scenarios/mercedes-family-v2.png'
    }
  },
  {
    id:'lamborghini',brand:'Lamborghini',model:'Revuelto',
    images:{
      urban:'assets/real-life-scenarios/lamborghini-urban-v2.png',
      roadtrip:'assets/real-life-scenarios/lamborghini-roadtrip-v2.png',
      rain:'assets/real-life-scenarios/lamborghini-rain-v2.png',
      night:'assets/real-life-scenarios/lamborghini-night-v2.png',
      family:'assets/real-life-scenarios/lamborghini-family-v2.png'
    }
  }
];

const SCENARIOS=[
  {
    id:'urban',label:'Đi khu phố',sceneAlt:'di chuyển trọn xe trên đại lộ đô thị vào ban ngày',
    meta:'Đô thị · 08:10',weather:'Nắng nhẹ · 28°C',mode:'Êm ái',
    title:'Nhanh gọn trong nhịp phố.',
    summary:'Mô phỏng giờ đi làm với đường đông, giao lộ liên tục và chỗ đỗ hẹp. Xe ưu tiên tầm nhìn, phản hồi nhẹ nhàng và khả năng quan sát xung quanh.',
    stats:[['Tốc độ','35 km/h'],['Mật độ xe','Cao'],['Chế độ','Êm ái']],
    benefits:[
      ['Quan sát dễ hơn','Camera và cảm biến mô phỏng giúp nhận biết xe máy, lề đường và khoảng trống khi đỗ.'],
      ['Phản hồi vừa đủ','Chân ga và vô-lăng được minh họa ở mức êm để di chuyển đều trong dòng xe.'],
      ['Ít mệt khi dừng–đi','Giao diện ưu tiên thông tin cần thiết, giảm thao tác trong những đoạn đường đông.']
    ]
  },
  {
    id:'roadtrip',label:'Du lịch · Đi xa',sceneAlt:'di chuyển trọn xe trên cao tốc qua vùng núi trong chuyến đi xa',
    meta:'Đường dài · 15:40',weather:'Khô ráo · 23°C',mode:'Đường dài',
    title:'Đi xa nhưng vẫn thư thái.',
    summary:'Một chặng cao tốc dài được mô phỏng để người xem hình dung độ ổn định, tư thế ngồi và cách xe hỗ trợ duy trì nhịp lái đều.',
    stats:[['Quãng đường','320 km'],['Thời gian','4 giờ 15'],['Điểm nghỉ','1 điểm']],
    benefits:[
      ['Giữ nhịp ổn định','Hỗ trợ hành trình được minh họa giúp duy trì tốc độ đều và khoảng cách an toàn.'],
      ['Tư thế đỡ mỏi','Ghế ôm thân và vùng tựa lưng được nhấn mạnh cho những chặng lái liên tục.'],
      ['Thông tin tập trung','Dẫn đường, mức nhiên liệu và điểm nghỉ được gom vào một vùng quan sát.']
    ]
  },
  {
    id:'rain',label:'Trời mưa',sceneAlt:'di chuyển trọn xe trên đường ướt dưới trời mưa',
    meta:'Mưa lớn · 17:25',weather:'Mưa · 19°C',mode:'Đường ướt / DSC',
    title:'Tự tin hơn khi mặt đường ướt.',
    summary:'Mặt đường trơn, tầm nhìn giảm và quãng phanh dài hơn được mô phỏng cùng các hỗ trợ kiểm soát thân xe.',
    stats:[['Tốc độ','42 km/h'],['Độ bám','Đang theo dõi'],['Hỗ trợ','DSC bật']],
    benefits:[
      ['Duy trì độ bám','Hệ thống cân bằng được minh họa can thiệp sớm khi bánh xe bắt đầu mất độ bám.'],
      ['Thấy rõ hơn','Đèn, gạt mưa và cảnh báo khoảng cách được đặt ở trạng thái thời tiết xấu.'],
      ['Phanh có kiểm soát','Mô phỏng nhắc người lái tăng khoảng cách và giảm thao tác đột ngột.']
    ]
  },
  {
    id:'night',label:'Ban đêm',sceneAlt:'di chuyển trọn xe trên đại lộ thành phố vào ban đêm',
    meta:'Thành phố · 22:15',weather:'Trời quang · 21°C',mode:'Hỗ trợ ban đêm',
    title:'Nhìn xa hơn trong bóng tối.',
    summary:'Mô phỏng đường phố ít sáng để thể hiện vùng chiếu đèn, độ tương phản bảng điều khiển và các cảnh báo cần thiết.',
    stats:[['Tầm chiếu','Thích ứng'],['Độ sáng cabin','Tự động'],['Cảnh báo','Đang bật']],
    benefits:[
      ['Vùng sáng linh hoạt','Đèn LED thích ứng được minh họa mở rộng vùng quan sát theo hướng đánh lái.'],
      ['Cabin bớt chói','Màn hình giảm độ sáng để thông tin vẫn rõ mà không gây mỏi mắt.'],
      ['Nhận biết sớm','Cảnh báo mô phỏng ưu tiên người đi bộ và vật cản ở vùng thiếu sáng.']
    ]
  },
  {
    id:'family',label:'Chuyến đi gia đình',sceneAlt:'hiển thị trọn xe với cốp mở, gia đình và hành lý trong chuyến đi cuối tuần',
    meta:'Cuối tuần · 07:30',weather:'Nắng dịu · 24°C',mode:'Gia đình',
    title:'Đủ gọn cho một cuối tuần.',
    summary:'Tình huống mô phỏng hai người lớn, một trẻ nhỏ và hành lý ngắn ngày để người mua nhìn thấy cả ưu điểm lẫn giới hạn của kiểu xe coupé.',
    stats:[['Hành khách','3 người'],['Khoang hành lý','440 lít'],['Ghế trẻ em','ISOFIX']],
    benefits:[
      ['Sắp xếp hành lý rõ ràng','Hình ảnh cho thấy lượng vali phù hợp trước khi bắt đầu chuyến đi.'],
      ['An tâm cho trẻ nhỏ','Điểm gắn ghế trẻ em và vị trí ghế sau được giải thích ngay trong tình huống.'],
      ['Biết trước giới hạn','Cửa dài và hàng ghế sau thấp phù hợp chuyến ngắn hơn là gia đình đông người.']
    ]
  }
];

const escape=value=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

async function loadGsap(){
  if(globalThis.gsap)return globalThis.gsap;
  try{await import('./assets/vendor/gsap/gsap.min.js');return globalThis.gsap||null;}catch{return null;}
}

export async function mountRealLifeScenarios(host){
  if(!host||host.dataset.mounted==='true')return;
  host.dataset.mounted='true';
  const firstCar=CARS[0],firstScenario=SCENARIOS[0];
  host.innerHTML=`<div class="z-rs-shell">
    <header class="z-rs-head">
      <div><p>Tình huống sử dụng thực tế</p><h2>Đặt chiếc xe vào<br>một ngày thật.</h2></div>
      <p>Năm mẫu xe, mỗi mẫu đều có năm hoàn cảnh thật. Chọn xe trước, sau đó chọn tình huống để so sánh trải nghiệm.</p>
    </header>
    <div class="z-rs-car-tabs" role="tablist" aria-label="Chọn xe cho tình huống thực tế">${CARS.map((car,index)=>`<button type="button" role="tab" data-rs-car-tab="${car.id}" aria-selected="${index===0}" tabindex="${index===0?'0':'-1'}"><strong>${escape(car.brand)}</strong><span>${escape(car.model)}</span></button>`).join('')}</div>
    <div class="z-rs-experience" data-rs-experience="${firstScenario.id}" data-rs-car="${firstCar.id}">
      <div class="z-rs-visual">
        <img class="z-rs-image is-active" data-rs-image="0" src="${firstCar.images[firstScenario.id]}" alt="${firstCar.brand} ${firstCar.model} ${firstScenario.sceneAlt}">
        <img class="z-rs-image" data-rs-image="1" alt="">
        <div class="z-rs-atmosphere" aria-hidden="true"></div>
        <div class="z-rs-readout"><span class="z-rs-car" data-rs-car-label>${firstCar.brand} / ${firstCar.model}</span><span data-rs-meta>${firstScenario.meta}</span><span data-rs-weather>${firstScenario.weather}</span><span data-rs-mode>${firstScenario.mode}</span></div>
        <div class="z-rs-copy" data-rs-copy><h3>${firstScenario.title}</h3><p>${firstScenario.summary}</p></div>
      </div>
      <aside class="z-rs-panel" aria-live="polite">
        <p class="z-rs-panel-title">Người lái nhận được gì?</p>
        <div class="z-rs-stats" data-rs-stats>${firstScenario.stats.map(([label,value])=>`<div><span>${escape(label)}</span><strong>${escape(value)}</strong></div>`).join('')}</div>
        <div class="z-rs-benefits" data-rs-benefits>${firstScenario.benefits.map(([title,text],index)=>`<article><b>${String(index+1).padStart(2,'0')}</b><div><h4>${escape(title)}</h4><p>${escape(text)}</p></div></article>`).join('')}</div>
        <p class="z-rs-note">Trải nghiệm minh họa. Trang bị thực tế có thể thay đổi theo phiên bản và thị trường.</p>
      </aside>
    </div>
    <div class="z-rs-tabs" role="tablist" aria-label="Chọn một trong năm tình huống">${SCENARIOS.map((scenario,index)=>`<button type="button" role="tab" data-rs-tab="${scenario.id}" aria-selected="${index===0}" tabindex="${index===0?'0':'-1'}"><span>${escape(scenario.label)}</span><small>${escape(scenario.meta.split(' · ')[0])}</small></button>`).join('')}</div>
  </div>`;

  const preload=(source)=>{const image=new Image();image.src=source;};
  SCENARIOS.slice(1).forEach(scenario=>preload(firstCar.images[scenario.id]));
  CARS.slice(1).forEach(carItem=>preload(carItem.images[firstScenario.id]));
  const experience=host.querySelector('[data-rs-experience]');
  const layers=[...host.querySelectorAll('[data-rs-image]')];
  const copy=host.querySelector('[data-rs-copy]');
  const car=host.querySelector('[data-rs-car-label]');
  const meta=host.querySelector('[data-rs-meta]');
  const weather=host.querySelector('[data-rs-weather]');
  const mode=host.querySelector('[data-rs-mode]');
  const stats=host.querySelector('[data-rs-stats]');
  const benefits=host.querySelector('[data-rs-benefits]');
  const scenarioButtons=[...host.querySelectorAll('[data-rs-tab]')];
  const carButtons=[...host.querySelectorAll('[data-rs-car-tab]')];
  const gsap=await loadGsap();
  let activeLayer=0,activeScenarioIndex=0,activeCarIndex=0,request=0,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mediaContext=null;
  if(gsap){
    mediaContext=gsap.matchMedia();
    mediaContext.add({reduceMotion:'(prefers-reduced-motion: reduce)'},context=>{reduced=context.conditions.reduceMotion;});
  }

  const fill=(carItem,scenario)=>{
    experience.dataset.rsExperience=scenario.id;
    experience.dataset.rsCar=carItem.id;
    copy.innerHTML=`<h3>${escape(scenario.title)}</h3><p>${escape(scenario.summary)}</p>`;
    car.textContent=`${carItem.brand} / ${carItem.model}`;
    meta.textContent=scenario.meta;weather.textContent=scenario.weather;mode.textContent=scenario.mode;
    stats.innerHTML=scenario.stats.map(([label,value])=>`<div><span>${escape(label)}</span><strong>${escape(value)}</strong></div>`).join('');
    benefits.innerHTML=scenario.benefits.map(([title,text],index)=>`<article><b>${String(index+1).padStart(2,'0')}</b><div><h4>${escape(title)}</h4><p>${escape(text)}</p></div></article>`).join('');
  };

  const select=async({carIndex=activeCarIndex,scenarioIndex=activeScenarioIndex,focusCar=false,focusScenario=false}={})=>{
    if(carIndex===activeCarIndex&&scenarioIndex===activeScenarioIndex){
      if(focusCar)carButtons[carIndex].focus();
      if(focusScenario)scenarioButtons[scenarioIndex].focus();
      return;
    }
    const carItem=CARS[carIndex],scenario=SCENARIOS[scenarioIndex],token=++request,nextLayer=activeLayer===0?1:0,next=layers[nextLayer],previous=layers[activeLayer];
    carButtons.forEach((button,buttonIndex)=>{const selected=buttonIndex===carIndex;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;});
    scenarioButtons.forEach((button,buttonIndex)=>{const selected=buttonIndex===scenarioIndex;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;});
    if(focusCar)carButtons[carIndex].focus();
    if(focusScenario)scenarioButtons[scenarioIndex].focus();
    activeCarIndex=carIndex;activeScenarioIndex=scenarioIndex;
    next.src=carItem.images[scenario.id];next.alt=`${carItem.brand} ${carItem.model} ${scenario.sceneAlt}`;
    try{await next.decode();}catch{}
    if(token!==request)return;
    fill(carItem,scenario);
    if(gsap&&!reduced){
      gsap.killTweensOf([next,previous,copy,stats,benefits.children]);
      gsap.set(next,{autoAlpha:0,scale:1.035});
      gsap.to(next,{autoAlpha:1,scale:1,duration:.72,ease:'power3.out',overwrite:'auto'});
      gsap.to(previous,{autoAlpha:0,scale:.985,duration:.55,ease:'power1.out',overwrite:'auto'});
      gsap.fromTo([copy,stats],{autoAlpha:0,y:18},{autoAlpha:1,y:0,duration:.48,ease:'power2.out',stagger:.05,overwrite:'auto'});
      gsap.fromTo(benefits.children,{autoAlpha:0,x:18},{autoAlpha:1,x:0,duration:.42,ease:'power2.out',stagger:.07,overwrite:'auto'});
    }else{
      next.style.opacity='1';next.style.visibility='visible';next.style.transform='none';
      previous.style.opacity='0';previous.style.visibility='hidden';previous.style.transform='none';
    }
    activeLayer=nextLayer;
  };

  const bindTabs=(buttons,kind)=>buttons.forEach((button,index)=>{
    button.addEventListener('click',()=>select(kind==='car'?{carIndex:index}:{scenarioIndex:index}));
    button.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const nextIndex=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;
      select(kind==='car'?{carIndex:nextIndex,focusCar:true}:{scenarioIndex:nextIndex,focusScenario:true});
    });
  });
  bindTabs(carButtons,'car');
  bindTabs(scenarioButtons,'scenario');

  if(location.hash==='#real-life-scenarios')requestAnimationFrame(()=>host.scrollIntoView({block:'start'}));

  return()=>mediaContext?.revert();
}
