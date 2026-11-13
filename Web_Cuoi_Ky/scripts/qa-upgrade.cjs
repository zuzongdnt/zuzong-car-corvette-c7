const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path');
const out=path.resolve(__dirname,'../output/playwright');
const base=process.env.QA_BASE||'http://127.0.0.1:4174';
async function main(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const results=[];
 try{
 for(const [label,width,height] of [['desktop',1440,900],['tablet',768,1024],['mobile',390,844],['small',360,780],['landscape',844,390]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[],failed=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push([r.status(),r.url()])});
  await page.goto(base+'/index.html',{waitUntil:'networkidle'});await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
  await page.screenshot({path:path.join(out,'upgrade-'+label+'-covered.png')});
  await page.evaluate(()=>scrollTo({top:(document.querySelector('.unveil').offsetHeight-document.querySelector('.hero-stage').offsetHeight)*.98,behavior:'instant'}));
  await page.waitForTimeout(700);await page.screenshot({path:path.join(out,'upgrade-'+label+'-revealed.png')});
  const frame=await page.evaluate(()=>window.revealSequence?.drawnFrame);
  for(const [selector,name] of [['.performance-studio','performance'],['.worlds','worlds'],['.worlds-pair','films']]){
   await page.locator(selector).evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-95,behavior:'instant'}));
   await page.waitForTimeout(450);if(label==='desktop'||label==='mobile')await page.screenshot({path:path.join(out,'upgrade-'+label+'-'+name+'.png')});
  }
  const before=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}));
  await page.locator('[data-gallery-open]').first().click();const modal=await page.locator('#gallery-dialog').evaluate(d=>d.open);await page.keyboard.press('ArrowRight');await page.waitForTimeout(180);const galleryCounter=await page.locator('[data-gallery-counter]').innerText();await page.keyboard.press('Escape');
  let menu=true;if(width<=760){await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.locator('.menu-toggle').click();menu=await page.locator('#mobile-nav').isVisible();await page.keyboard.press('Escape');menu=menu&&await page.locator('#mobile-nav').isHidden();}
  const nav=await page.locator('.desktop-nav a').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')));
  results.push({label,width,height,errors,failed,...before,frame,modal,galleryCounter,menu,nav});await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await page.goto(base+'/index.html',{waitUntil:'networkidle'});
 const reduced=await page.evaluate(()=>({height:document.querySelector('.unveil').offsetHeight,viewport:innerHeight,frames:window.revealSequence?.decodedFrames,car:getComputedStyle(document.querySelector('.hero-car')).display,overflow:document.documentElement.scrollWidth>innerWidth}));await page.screenshot({path:path.join(out,'upgrade-reduced.png')});
 const report={results,reduced,pass:results.every(r=>!r.errors.length&&!r.failed.length&&!r.overflow&&!r.broken.length&&r.frame>=142&&r.modal&&r.menu&&r.nav.length===4)&&reduced.frames===0&&!reduced.overflow};
 fs.writeFileSync(path.join(out,'upgrade-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
 }finally{await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1});
