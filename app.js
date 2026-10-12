(() => {
 'use strict';
 document.documentElement.classList.add('js');
 const hero=document.querySelector('.unveil');
 const header=document.querySelector('.site-header');
 const reading=document.querySelector('.reading-progress');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
 const smooth=(start,end,value)=>{const t=clamp((value-start)/(end-start));return t*t*(3-2*t);};
 let target=0,current=0,frame=0,travel=1,heroTop=0,lastPaint=0,measured=false;
 const chapters=[...hero.querySelectorAll('.studio-chapters li')];
 const chapterTitle=hero.querySelector('.studio-caption-title'),chapterText=hero.querySelector('.studio-caption-text');
 const chapterCopy=[[['TRƯỚC KHI','BỪNG TỈNH.'],'Dưới lớp bạt tối màu, những đường nét đang chờ được khám phá.'],[['TỪNG ĐƯỜNG NÉT','LỘ DIỆN.'],'Lớp bạt lùi lại. Cụm đèn sắc nét và dáng xe thấp dần hiện ra.'],[['KHÔNG','THỎA HIỆP.'],'Thân xe graphite, mâm đen và sắc đỏ nơi cùm phanh. Cá tính hiện rõ ở từng chi tiết.']];
 let activeChapter=-1;
 const heroAction=hero.querySelector('.hero-revealed'),scrollCue=document.querySelector('.scroll-cue');
 function measure(){heroTop=hero.getBoundingClientRect().top+scrollY;travel=Math.max(1,hero.offsetHeight-document.querySelector('.hero-stage').offsetHeight);requestUpdate();if(!measured){current=target;measured=true;}}
 // Every visual state is derived from scroll, so scrubbing backwards restores it.
 function paintCaption(chapter,progress){
  chapterTitle.dataset.chapter=chapter;
  const start=[0,.42,.8][chapter],end=[.42,.8,Infinity][chapter];
  const motion=(index)=>{
   if(reduced.matches)return {opacity:1,y:0};
   const enter=chapter===0?smooth(-.30+index*.04,.035+index*.04,current):smooth(start+index*.012,start+.075+index*.012,progress);
   const leave=chapter===2?0:smooth(end-.075+index*.009,end,progress);
   return {opacity:enter*(1-leave),y:(1-enter)*.38-leave*.18};
  };
  [...chapterTitle.children,chapterText].forEach((element,index)=>{
   const state=motion(index);
   element.style.setProperty('--caption-opacity',state.opacity.toFixed(4));
   element.style.setProperty('--caption-y',`${state.y.toFixed(4)}em`);
  });
 }
 function paint(now){
  frame=0;const elapsed=lastPaint?Math.min(64,now-lastPaint):16.67;lastPaint=now;
  current=reduced.matches?0:current+(target-current)*(1-Math.exp(-elapsed/82));
  if(Math.abs(target-current)<.001)current=target;
  const sequenceProgress=reduced.matches?1:clamp((current-.05)/.8);
  window.revealSequence?.update(sequenceProgress);
  heroAction.inert=!reduced.matches&&sequenceProgress<.94;
  scrollCue.querySelector('.scroll-cue-label').textContent=reduced.matches||sequenceProgress>=.94?'TIẾP TỤC':'MỞ BẠT';
  scrollCue.setAttribute('aria-label',reduced.matches||sequenceProgress>=.94?'Đến phần hiệu năng':'Cuộn để mở bạt');
  const chapter=sequenceProgress<.42?0:sequenceProgress<.8?1:2;
  if(chapter!==activeChapter){activeChapter=chapter;chapters.forEach((item,i)=>{if(i===chapter)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');});if(chapterTitle)chapterTitle.replaceChildren(...chapterCopy[chapter][0].map((text,i)=>{const line=document.createElement('span');line.textContent=text+(i===0?' ':'');return line;}));if(chapterText)chapterText.textContent=chapterCopy[chapter][1];}
  paintCaption(chapter,sequenceProgress);
  hero.style.setProperty('--reveal-opacity',smooth(.8,.94,sequenceProgress).toFixed(4));
  hero.classList.toggle('is-open',sequenceProgress>.94);
  reading.style.transform=`scaleX(${clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))})`;
  const inIntro=scrollY<heroTop-header.offsetHeight;
  header.classList.toggle('is-intro',inIntro);
  header.classList.toggle('is-scrolled',!inIntro&&scrollY>20);
  if(!reduced.matches&&Math.abs(target-current)>.001)frame=requestAnimationFrame(paint);else lastPaint=0;
 }
 function requestUpdate(){target=reduced.matches?0:clamp((scrollY-heroTop)/travel,-1,1);if(!frame)frame=requestAnimationFrame(paint);}
 addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',measure);reduced.addEventListener('change',measure);
 scrollCue.addEventListener('click',()=>{scrollTo({top:reduced.matches||current>=.85?document.querySelector('#performance').offsetTop:heroTop+travel*.9,behavior:reduced.matches?'instant':'smooth'});});
 const menu=document.querySelector('.menu-toggle'),mobile=document.querySelector('.mobile-nav');
 function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Mở menu');mobile.hidden=true;}
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Đóng menu':'Mở menu');mobile.hidden=!open;});
 mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
 document.addEventListener('click',e=>{if(!header.contains(e.target))closeMenu();});
 addEventListener('resize',()=>{if(innerWidth>760)closeMenu();});
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px -35px 0px'});
 document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
 window.initShowcase?.();measure();
 document.fonts.ready.then(measure);addEventListener('load',measure,{once:true});
})();
