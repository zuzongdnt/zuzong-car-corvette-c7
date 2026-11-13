(() => {
 'use strict';
 document.documentElement.classList.add('js');
 const hero=document.querySelector('.unveil');
 const header=document.querySelector('.site-header');
 const reading=document.querySelector('.reading-progress');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
 let target=0,current=0,frame=0,travel=1,heroTop=0,lastPaint=0,measured=false;
 const scrollCue=document.querySelector('.scroll-cue');
 const revealComplete=.74;
 function measure(){heroTop=hero.getBoundingClientRect().top+scrollY;travel=Math.max(1,hero.offsetHeight-document.querySelector('.hero-stage').offsetHeight);requestUpdate();if(!measured){current=target;measured=true;}}
 function paint(now){
  frame=0;const elapsed=lastPaint?Math.min(64,now-lastPaint):16.67;lastPaint=now;
  current=reduced.matches?0:current+(target-current)*(1-Math.exp(-elapsed/82));
  if(Math.abs(target-current)<.0001)current=target;
  const sequenceProgress=reduced.matches?1:clamp((current-.05)/.8);
  window.revealSequence?.update(sequenceProgress);
  hero.dataset.revealProgress=sequenceProgress.toFixed(5);
  hero.updateUnveilCopy?.(sequenceProgress);
  const selected=!!hero.dataset.selectedCar;
  scrollCue.querySelector('.scroll-cue-label').textContent=selected?'VÀO STUDIO':sequenceProgress>=revealComplete?'TIẾP TỤC':'MỞ BẠT 5 XE';
  scrollCue.setAttribute('aria-label',selected?'Đến studio 3D':sequenceProgress>=revealComplete?'Đến phần tiếp theo':'Cuộn để mở bạt năm xe');
  hero.classList.toggle('is-open',sequenceProgress>.94);
  reading.style.transform=`scaleX(${clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))})`;
  const campaign=document.querySelector('#intro');
  const introEnd=campaign?campaign.offsetTop+campaign.offsetHeight:heroTop;
  const inIntro=scrollY<introEnd-header.offsetHeight;
  header.classList.toggle('is-intro',inIntro);
  header.classList.toggle('is-scrolled',!inIntro&&scrollY>20);
  header.inert=false;
  header.removeAttribute('aria-hidden');
  if(!reduced.matches&&Math.abs(target-current)>.0001)frame=requestAnimationFrame(paint);else lastPaint=0;
 }
 function requestUpdate(){target=reduced.matches?0:clamp((scrollY-heroTop)/travel,-1,1);if(!frame)frame=requestAnimationFrame(paint);}
 addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',measure);reduced.addEventListener('change',measure);
 scrollCue.addEventListener('click',()=>{scrollTo({top:hero.dataset.selectedCar?document.querySelector('#collection').offsetTop:reduced.matches||current>=.05+.8*revealComplete?document.querySelector('#performance').offsetTop:heroTop+travel*.9,behavior:reduced.matches?'instant':'smooth'});});
 hero.addEventListener('unveil-selection',requestUpdate);
 const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px -35px 0px'});
 document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
 window.initShowcase?.();measure();
 document.fonts.ready.then(measure);addEventListener('load',measure,{once:true});
})();
