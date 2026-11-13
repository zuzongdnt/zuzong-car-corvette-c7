import {cars,poster} from './studio-data.js';

const STORY=[
  ['Corvette C7','Đường nét mở đầu bằng một tư thế thấp và rộng.','Nắp capo dài và thân xe cơ bắp tạo cảm giác chuyển động ngay cả khi xe đứng yên.'],
  ['BMW M4 G82 Coupé','Những mảng hình học làm nên cá tính.','Tỉ lệ coupé và lưới tản nhiệt lớn giúp M4 dễ nhận ra từ phía trước lẫn góc ngang.'],
  ['Porsche 911 GT3 (992)','Di sản được giữ trong từng đường cong.','Đường mái liền mạch gặp cấu hình hướng đường đua, tạo nên vẻ gọn gàng và tập trung.'],
  ['Mercedes-AMG SL 63','Một thiết kế mở cho trải nghiệm roadster.','Mui mềm và khoang lái thấp đặt người lái gần hơn với hành trình.'],
  ['Lamborghini Revuelto','Tương lai hiện lên qua những đường cắt táo bạo.','Ngôn ngữ hình nêm đi cùng hệ truyền động hybrid HPEV được Lamborghini công bố.']
];
const storyImage=carId=>`assets/unveil-five/${carId}-still.webp`;

export function mountScrollStorytelling(host){
  if(!host||host.dataset.mounted)return;
  host.dataset.mounted='true';
  host.innerHTML=`<div class="z-story-shell"><header class="z-story-head"><div><p class="z-experience-kicker">DIGITAL PRODUCT STORY</p><h2>Năm hãng xe.<br><em>Năm dấu ấn riêng.</em></h2></div><p>Chương cuối đưa bạn qua ngôn ngữ thiết kế và điểm nổi bật của từng mẫu xe, rồi mở ra lựa chọn tiếp theo của bạn.</p></header><div class="z-story-layout"><div class="z-story-stage" aria-hidden="true">${cars.map((car,index)=>`<figure class="z-story-frame${index===0?' is-active':''}" data-story-frame="${car.id}"><img src="${poster(car.id,'hero')}" alt="" loading="lazy"><figcaption><span>${car.brand}</span><strong>${car.name}</strong></figcaption></figure>`).join('')}<div class="z-story-progress"><i data-story-progress></i></div></div><div class="z-story-chapters">${cars.map((car,index)=>{const [title,lead,body]=STORY[index];return `<article class="z-story-chapter${index===0?' is-active':''}" data-story-chapter="${car.id}"><p>${car.brand}</p><h3>${title}</h3><strong>${lead}</strong><span>${body}</span></article>`;}).join('')}</div></div><footer class="z-story-closing"><div><p class="z-experience-kicker">HÀNH TRÌNH TIẾP THEO</p><h3>Từ dấu ấn của hãng<br>đến lựa chọn của bạn.</h3><p>Khám phá từng mẫu xe trong bộ sưu tập hoặc xem trước lịch lái thử tại showroom.</p></div><nav aria-label="Khám phá tiếp"><a href="#products-catalog">Khám phá bộ sưu tập ↗</a><a href="#smart-test-drive">Xem lịch lái thử ↗</a></nav></footer></div>`;
  host.querySelectorAll('[data-story-frame]').forEach(frame=>{
    frame.querySelector('img').src=storyImage(frame.dataset.storyFrame);
  });
  const chapters=[...host.querySelectorAll('[data-story-chapter]')];
  const frames=[...host.querySelectorAll('[data-story-frame]')];
  function activate(id){
    chapters.forEach(chapter=>chapter.classList.toggle('is-active',chapter.dataset.storyChapter===id));
    frames.forEach(frame=>frame.classList.toggle('is-active',frame.dataset.storyFrame===id));
  }
  if('IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>{const current=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(current)activate(current.target.dataset.storyChapter);},{rootMargin:'-35% 0px -35% 0px',threshold:[0,.2,.45,.7]});
    chapters.forEach(chapter=>observer.observe(chapter));
    const section=host.querySelector('.z-story-layout');
    const progress=host.querySelector('[data-story-progress]');
    let ticking=false;
    const updateProgress=()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const rect=section.getBoundingClientRect(),travel=rect.height-innerHeight;const value=travel<=0?0:Math.max(0,Math.min(1,-rect.top/travel));progress.style.transform=`scaleX(${value})`;ticking=false;});};
    addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);updateProgress();
  }else{
    frames.forEach((frame,index)=>frame.classList.toggle('is-active',index===0));
    chapters.forEach(chapter=>chapter.classList.add('is-active'));
  }
}
