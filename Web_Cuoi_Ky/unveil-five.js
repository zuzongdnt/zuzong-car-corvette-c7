import {cars} from './studio-data.js';

const hero=document.querySelector('.unveil-five');
if(hero){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const title=hero.querySelector('.studio-caption-title');
 const text=hero.querySelector('.studio-caption-text');
 const model=hero.querySelector('.unveil-model');
 const detail=hero.querySelector('.unveil-detail');
 const buttons=[...hero.querySelectorAll('[data-unveil-car]')];
 const overview=hero.querySelector('.unveil-overview');
 const still=hero.querySelector('.unveil-still');
 const videos=[...hero.querySelectorAll('.unveil-film')];
 const play=hero.querySelector('.unveil-play');
 const status=hero.querySelector('.unveil-status');
 const heading=hero.querySelector('.unveil-heading');
 const logo=hero.querySelector('.unveil-brand-logo');
 const brandLogos={corvette:'chevrolet.svg',bmw:'bmw.svg',porsche:'porsche.svg',mercedes:'mercedes.svg',lamborghini:'lamborghini-shield.png'};
 const chapters=[
  {lines:['Dưới lớp bạt.','Năm cá tính.'],text:'Năm ngôn ngữ thiết kế. Cùng chờ một khoảnh khắc lộ diện.',label:'Trước khoảnh khắc lộ diện'},
  {lines:['Từng đường nét.','Dần lộ diện.'],text:'Lớp bạt lướt qua. Ánh sáng chạm lên từng dáng xe, hé lộ năm cá tính riêng.',label:'Năm cá tính cùng hé lộ'},
  {lines:['Năm biểu tượng.','Một dấu ấn.'],text:'Chevrolet, BMW, Porsche, Mercedes-Benz và Lamborghini. Chọn một hãng để khám phá góc nhìn của bạn.',label:'Bộ sưu tập ZEPHYRON'}
 ];
 const chapterBoundaries=[39/143,105/143];
 let progress=0,chapter=-1;
 let selected='',revision=0,visible=-1,inView=false,userPaused=false,resumeAfterVisibility=false;
 function titleLines(lines){title.replaceChildren(...lines.map(line=>{const span=document.createElement('span');span.textContent=line;return span;}));}
 hero.updateUnveilCopy=p=>{
  progress=p;
  if(selected)return;
  const index=reduced.matches?2:p<chapterBoundaries[0]?0:p<chapterBoundaries[1]?1:2;
  if(index!==chapter){
   chapter=index;hero.dataset.copyChapter=String(index);
   titleLines(chapters[index].lines);text.textContent=chapters[index].text;
   hero.querySelector('.unveil-scene-label').textContent=chapters[index].label;
  }
  let opacity=1,y=0;
  if(!reduced.matches){
   for(const boundary of chapterBoundaries){
    const distance=p-boundary;
    if(Math.abs(distance)<.045){const t=Math.abs(distance)/.045;opacity=t*t*(3-2*t);y=(distance<0?-1:1)*(1-opacity)*14;break;}
   }
  }
  heading.style.setProperty('--unveil-copy-opacity',opacity.toFixed(4));
  heading.style.setProperty('--unveil-copy-y',y.toFixed(2)+'px');
 };
 function controls(){
  const video=videos[visible];
  play.hidden=!selected;
  const label=video?.ended?'Phát lại':video&&!video.paused?'Tạm dừng':'Phát thước phim';
  play.textContent=label;play.setAttribute('aria-label',label+(selected?' '+cars.find(c=>c.id===selected).name:''));
 }
 function pauseAll(){videos.forEach(v=>v.pause());}
 async function start(video){
  if(!video||!inView||document.hidden)return;
  try{await video.play();}catch{status.textContent='Video chưa phát được. Bạn có thể bấm Phát thước phim hoặc mở chi tiết xe.';}
  controls();
 }
 function copy(car){
  logo.hidden=!car;
  if(car){logo.src='assets/brands/'+brandLogos[car.id];titleLines([car.brand,car.name]);text.textContent=car.text;}
  model.textContent=car?`${car.series} · ${car.layout}`:'Bộ sưu tập ZEPHYRON';
  detail.href=car?`products.html?car=${car.id}`:'products.html';
  detail.replaceChildren(document.createTextNode(car?'Khám phá '+car.name+' ':'Khám phá bộ sưu tập '));
  const arrow=document.createElement('span');arrow.setAttribute('aria-hidden','true');arrow.textContent='↗';detail.append(arrow);
  hero.querySelector('.unveil-scene-label').textContent=car?car.brand+' / '+car.name:'Khoảnh khắc lộ diện';
  if(car){heading.style.setProperty('--unveil-copy-opacity',1);heading.style.setProperty('--unveil-copy-y','0px');}
  else {chapter=-1;hero.updateUnveilCopy(progress);}
 }
 async function select(id){
  const car=cars.find(c=>c.id===id);
  selected=car?.id||'';const version=++revision;
  userPaused=false;resumeAfterVisibility=false;
  pauseAll();hero.dataset.selectedCar=selected;
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.unveilCar===selected)));
  overview.setAttribute('aria-pressed',String(!car));
  hero.dispatchEvent(new Event('unveil-selection'));
  hero.classList.add('is-changing');
  await new Promise(resolve=>setTimeout(resolve,reduced.matches?0:140));
  if(version!==revision)return;
  copy(car);hero.classList.remove('is-changing');
  if(!car){
   hero.classList.remove('is-film');controls();status.textContent='Đang xem cảnh mở bạt cả năm xe. Cuộn để xem tiến hoặc lùi.';return;
  }
  // Keep the previous frame until the next car's poster is decoded.
  const poster=new Image();poster.src=`assets/unveil-five/${selected}-still.webp`;
  try{await poster.decode();}catch{}
  if(version!==revision)return;
  still.src=poster.src;
  if(reduced.matches||!hero.classList.contains('is-film'))videos.forEach(v=>v.classList.remove('is-visible'));
  hero.classList.add('is-film');
  const next=visible===0?1:0,video=videos[next];visible=next;
  video.onloadeddata=()=>{
   if(version!==revision)return;
   videos.forEach(v=>v.classList.toggle('is-visible',v===video));
   if(!reduced.matches&&!userPaused)start(video);
   controls();
  };
  video.onerror=()=>{if(version===revision){video.classList.remove('is-visible');status.textContent='Chưa tải được video. Ảnh xe và liên kết chi tiết vẫn có sẵn.';controls();}};
  video.poster=`assets/unveil-five/${selected}-poster.webp`;
  video.src=`assets/unveil-five/${selected}.mp4`;video.load();
  controls();status.textContent=`Đang xem ${car.brand} ${car.name}.`;
 }
 buttons.forEach(button=>button.addEventListener('click',()=>select(button.dataset.unveilCar)));
 overview.addEventListener('click',()=>select(''));
 play.addEventListener('click',()=>{
  const video=videos[visible];if(!video)return;
  if(video.paused||video.ended){userPaused=false;if(video.ended)video.currentTime=0;start(video);}else{userPaused=true;video.pause();}
 });
 videos.forEach(video=>['play','pause','ended'].forEach(event=>video.addEventListener(event,controls)));
 const observer=new IntersectionObserver(entries=>{
  inView=entries[0].isIntersecting;
  if(!inView){resumeAfterVisibility=!!selected&&!videos[visible]?.paused;pauseAll();}
  else if(resumeAfterVisibility&&!userPaused&&!reduced.matches){resumeAfterVisibility=false;start(videos[visible]);}
 },{threshold:.1});
 observer.observe(hero.querySelector('.hero-stage'));
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){resumeAfterVisibility=!!selected&&!videos[visible]?.paused;pauseAll();}
  else if(resumeAfterVisibility&&!userPaused&&!reduced.matches){resumeAfterVisibility=false;start(videos[visible]);}
 });
 reduced.addEventListener('change',()=>{pauseAll();controls();hero.updateUnveilCopy(progress);});
 hero.updateUnveilCopy(Number(hero.dataset.revealProgress||0));
 controls();
}
