const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
let browser;
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const results=[];
 for(const [width,height] of [[517,884],[1395,884],[390,844],[320,568],[967,900]]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:4173/index.html',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('.campaign-video').currentTime>.1);
  await page.locator('.campaign-video-toggle').click();await page.evaluate(()=>document.querySelector('.campaign-video').currentTime=28.78);await page.waitForTimeout(200);
  const intro=await page.evaluate(()=>{
   const card=document.querySelector('.campaign-card'),brand=document.querySelector('.campaign-brand');
   return {cardHeight:card.offsetHeight,cardBackground:getComputedStyle(card).backgroundColor,logos:[...document.querySelectorAll('[data-campaign-logo]')].map(el=>el.naturalWidth>0&&!el.hidden),brandClipped:brand.scrollWidth>brand.clientWidth+1,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  await page.screenshot({path:`output/playwright/comments-intro-${width}.png`});
  const phases=[];
  for(const [name,progress] of [['covered',0],['peel',.52],['open',.92]]){
   await page.evaluate(p=>{const h=document.querySelector('.unveil'),s=document.querySelector('.hero-stage');scrollTo({top:h.offsetTop+(h.offsetHeight-s.offsetHeight)*p,behavior:'instant'});},progress);await page.waitForTimeout(850);
   phases.push(await page.evaluate(()=>{
    const title=document.querySelector('#studio-title'),footer=document.querySelector('.hero-footer').getBoundingClientRect(),caption=document.querySelector('.studio-caption').getBoundingClientRect(),nav=document.querySelector('.bottom-nav').getBoundingClientRect();
    return {title:title.textContent,fontSize:parseFloat(getComputedStyle(title).fontSize),clipped:title.scrollWidth>title.clientWidth+1,captionFits:caption.bottom<=footer.top+1,footerFits:innerWidth>760||footer.bottom<=nav.top+1,frame:window.revealSequence.drawnFrame,overflow:document.documentElement.scrollWidth>innerWidth};
   }));
   if(name==='covered'||name==='peel')await page.screenshot({path:`output/playwright/comments-studio-${name}-${width}.png`});
  }
  const noSound=await page.locator('.sound-toggle').count()===0;
  const video=page.locator('[data-world-video]');await video.scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{const v=document.querySelector('[data-world-video]');return !v.paused&&v.currentTime>.2;});
  const auto=await page.evaluate(()=>{const v=document.querySelector('[data-world-video]');return v.muted&&v.loop&&v.playsInline&&!v.paused;});
  await page.locator('.world-video-toggle').click();const pause=await page.evaluate(()=>document.querySelector('[data-world-video]').paused);
  if(width===517){await page.screenshot({path:'output/playwright/comments-preview-video-517.png'});await page.locator('.world-tile:nth-child(2)').scrollIntoViewIfNeeded();await page.screenshot({path:'output/playwright/comments-photo-crop-517.png'});}
  await page.locator('.world-video-toggle').scrollIntoViewIfNeeded();await page.locator('.world-video-toggle').click();await page.waitForTimeout(250);
  const resume=await page.evaluate(()=>!document.querySelector('[data-world-video]').paused);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(250);
  const offscreen=await page.evaluate(()=>document.querySelector('[data-world-video]').paused);
  await page.emulateMedia({reducedMotion:'reduce'});await video.scrollIntoViewIfNeeded();await page.waitForTimeout(250);
  const reduced=await page.evaluate(()=>document.querySelector('[data-world-video]').paused);
  results.push({width,errors,intro,phases,noSound,auto,pause,resume,offscreen,reduced});await page.close();
 }
 await browser.close();
 const pass=results.every(r=>!r.errors.length&&r.intro.logos.every(Boolean)&&!r.intro.overflow&&!r.intro.brandClipped&&(r.width>760||r.intro.cardHeight<255)&&r.phases.every(p=>!p.clipped&&!p.overflow&&p.captionFits&&p.footerFits)&&(r.width<=760?r.phases[0].fontSize<=30:r.phases[0].fontSize>=75)&&r.noSound&&r.auto&&r.pause&&r.resume&&r.offscreen&&r.reduced);
 fs.writeFileSync('output/playwright/comments-review-qa.json',JSON.stringify({pass,results},null,2));console.log(JSON.stringify({pass,results},null,2));if(!pass)process.exitCode=1;
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1});
