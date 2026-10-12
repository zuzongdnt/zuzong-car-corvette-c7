(() => {
 'use strict';
 const root=document.querySelector('.campaign');if(!root)return;
 const video=root.querySelector('video'),poster=root.querySelector('.campaign-poster'),toggle=root.querySelector('.campaign-video-toggle');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let userPaused=false,userStarted=false,visible=true,failed=false,source='';
 const safeURL=value=>{if(!String(value??'').trim())return '';try{const url=new URL(value,location.href);return ['http:','https:','file:'].includes(url.protocol)?value:'';}catch{return '';}};
 function buttonState(){
  const paused=video.paused||failed;
  toggle.disabled=failed;
  toggle.setAttribute('aria-label',failed?'Video không khả dụng':paused?'Phát video nền':'Tạm dừng video nền');
  root.querySelector('.campaign-video-icon').textContent=paused?'▶':'Ⅱ';
  root.querySelector('.campaign-video-label').textContent=failed?'Video không khả dụng':paused?'Phát video':'Tạm dừng';
 }
 function syncPlayback(){
  if(failed||userPaused||!visible||document.hidden||(reduced.matches&&!userStarted)){video.pause();buttonState();return;}
  video.play().then(buttonState).catch(()=>{buttonState();});
 }
 function render(config){
  root.querySelectorAll('[data-campaign]').forEach(el=>{const value=config[el.dataset.campaign];el.textContent=value??'';el.hidden=!String(value??'').trim();});
  root.querySelectorAll('[data-campaign-logo]').forEach(el=>{const logo=safeURL(config.logoSrc||'');el.hidden=!logo;el.alt=config.logoAlt||'';if(logo)el.src=logo;else el.removeAttribute('src');});
  const color=CSS.supports('color',config.accentColor)?config.accentColor:'#f03a3e';root.style.setProperty('--campaign-accent',color);
  const position=typeof config.videoPosition==='object'?config.videoPosition:{desktop:config.videoPosition,mobile:config.videoPosition};
  root.style.setProperty('--video-position',position?.desktop||'50% 50%');root.style.setProperty('--video-position-mobile',position?.mobile||position?.desktop||'50% 50%');
  // Media uses the same focal point configuration at each responsive breakpoint.
  root.querySelector('.campaign-media').style.setProperty('--video-position',innerWidth<=760?(position?.mobile||position?.desktop||'50% 50%'):(position?.desktop||'50% 50%'));
  poster.src=safeURL(config.posterSrc||'');poster.hidden=!config.posterSrc;video.poster=safeURL(config.posterSrc||'');
  const href=config.ctaHref?safeURL(config.ctaHref):'',cta=root.querySelector('[data-campaign-cta]');cta.hidden=!href;if(href)cta.setAttribute('href',href);else cta.removeAttribute('href');root.querySelector('.campaign-missing-link').hidden=!!href;
  const stats=Array.isArray(config.stats)?config.stats.filter(s=>s&&s.value!==undefined&&s.value!==null&&String(s.value).trim()&&s.label).slice(0,2):[];
  root.querySelectorAll('.campaign-stat').forEach((el,i)=>{el.replaceChildren();el.hidden=!stats[i];if(!stats[i])return;const value=document.createElement('strong'),label=document.createElement('span');value.textContent=stats[i].value;label.textContent=stats[i].label;el.append(value,label);});
  const next=safeURL(config.videoSrc||'');
  if(next!==source){source=next;failed=!next;userPaused=false;userStarted=false;root.classList.remove('has-video');video.muted=true;video.autoplay=!reduced.matches;video.src=next;video.load();syncPlayback();}
  buttonState();
 }
 window.renderCampaignBanner=render;
 render(window.CAMPAIGN_CONFIG||{});
 toggle.addEventListener('click',()=>{if(video.paused){userPaused=false;userStarted=true;syncPlayback();}else{userPaused=true;video.pause();}});
 video.addEventListener('loadeddata',()=>{if(!reduced.matches||userStarted)root.classList.add('has-video');buttonState();});
 video.addEventListener('playing',()=>{root.classList.add('has-video');buttonState();});video.addEventListener('pause',buttonState);
 video.addEventListener('error',()=>{failed=true;root.classList.remove('has-video');root.querySelector('.campaign-video-status').textContent='Không thể phát video. Đang hiển thị ảnh nền dự phòng.';buttonState();});
 poster.addEventListener('error',()=>{poster.hidden=true;});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;syncPlayback();},{threshold:.05}).observe(root);
 document.addEventListener('visibilitychange',syncPlayback);reduced.addEventListener('change',()=>{userStarted=false;if(reduced.matches)root.classList.remove('has-video');syncPlayback();});
 const compact=matchMedia('(max-width:760px)');compact.addEventListener('change',()=>render(window.CAMPAIGN_CONFIG||{}));
})();
