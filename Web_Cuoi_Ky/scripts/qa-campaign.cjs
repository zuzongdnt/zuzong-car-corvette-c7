const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const output='output/playwright/';
let browser;
async function geometry(page){return page.evaluate(()=>{
 const blocks=['.campaign-brand','.campaign-intro','.campaign-card','.campaign-message','.campaign-bottom','.campaign-stat--top','.campaign-stat--bottom'].map(s=>document.querySelector(s)).filter(el=>!el.hidden);
 const rect=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom}};
 const overlaps=[];for(let i=0;i<blocks.length;i++)for(let j=i+1;j<blocks.length;j++){const a=rect(blocks[i]),b=rect(blocks[j]);if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)overlaps.push([blocks[i].className,blocks[j].className]);}
 return {overflow:document.documentElement.scrollWidth>innerWidth,overlaps,clipped:blocks.filter(el=>el.scrollWidth>el.clientWidth+2).map(el=>el.className),stats:[...document.querySelectorAll('.campaign-stat')].filter(el=>!el.hidden).length,height:document.querySelector('.campaign').offsetHeight,source:document.querySelector('.campaign-video').currentSrc};
 });}
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const results=[];
 for(const [width,height] of [[390,844],[967,900],[1440,900]]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('.campaign-video').currentTime>.2);
  const autoplay=await page.evaluate(()=>{const v=document.querySelector('.campaign-video');return !v.paused&&v.muted&&v.loop&&v.playsInline});
  await page.locator('.campaign-video-toggle').click();
  const paused=await page.evaluate(()=>document.querySelector('.campaign-video').paused);
  await page.evaluate(()=>document.querySelector('.campaign-video').currentTime=28.78);await page.waitForTimeout(300);
  await page.screenshot({path:output+`campaign-${width}.png`,fullPage:false});
  const layout=await geometry(page);
  await page.locator('.campaign-video-toggle').click();await page.waitForTimeout(250);
  const resumed=await page.evaluate(()=>!document.querySelector('.campaign-video').paused);
  await page.locator('.campaign-cta').click();await page.waitForTimeout(1500);
  const covered=await page.evaluate(()=>window.revealSequence.drawnFrame===0);
  await page.evaluate(()=>{const h=document.querySelector('.unveil'),s=document.querySelector('.hero-stage');scrollTo({top:h.offsetTop+(h.offsetHeight-s.offsetHeight)*.9,behavior:'instant'});});await page.waitForTimeout(900);
  const opened=await page.evaluate(()=>window.revealSequence.drawnFrame===9&&document.querySelector('.campaign-video').paused);
  await page.screenshot({path:output+`campaign-to-studio-${width}.png`});
  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(400);
  const reduced=await page.evaluate(()=>document.querySelector('.campaign-video').paused&&getComputedStyle(document.querySelector('.campaign-card')).animationName==='none');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.evaluate(()=>window.renderCampaignBanner({...window.CAMPAIGN_CONFIG,brandName:'CHUYẾN ĐI MỚI',intro:'Nội dung thử nghiệm dài để kiểm tra bố cục tự xuống dòng trên màn hình hẹp, không tràn ra ngoài hoặc đè lên thẻ giới thiệu.',description:'Mô tả thử nghiệm dài hơn bình thường. '.repeat(10),ctaHref:'',stats:[{value:'01',label:'Số liệu mẫu để kiểm tra bố cục'},{value:'02',label:'Dữ liệu thử nghiệm, không phải thông số xe'}]}));
  const longLayout=await geometry(page),missingLink=await page.locator('.campaign-missing-link').isVisible();
  await page.screenshot({path:output+`campaign-long-${width}.png`,fullPage:false});
  results.push({width,errors,autoplay,paused,resumed,layout,covered,opened,reduced,longLayout,missingLink});
  await page.close();
 }
 const fallbackPage=await browser.newPage({viewport:{width:390,height:844}});await fallbackPage.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await fallbackPage.evaluate(()=>window.renderCampaignBanner({...window.CAMPAIGN_CONFIG,videoSrc:'assets/campaign/missing.mp4'}));await fallbackPage.waitForFunction(()=>document.querySelector('.campaign-video-toggle').disabled);
 const fallback=await fallbackPage.evaluate(()=>!document.querySelector('.campaign').classList.contains('has-video')&&document.querySelector('.campaign-poster').naturalWidth>0);
 await fallbackPage.screenshot({path:output+'campaign-fallback.png'});await browser.close();
 const pass=fallback&&results.every(r=>!r.errors.length&&r.autoplay&&r.paused&&r.resumed&&r.covered&&r.opened&&r.reduced&&r.missingLink&&[r.layout,r.longLayout].every(l=>!l.overflow&&!l.overlaps.length&&!l.clipped.length)&&r.layout.stats===0&&r.longLayout.stats===2);
 fs.writeFileSync(output+'campaign-qa.json',JSON.stringify({pass,results,fallback},null,2));console.log(JSON.stringify({pass,results,fallback},null,2));if(!pass)process.exitCode=1;
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1});
