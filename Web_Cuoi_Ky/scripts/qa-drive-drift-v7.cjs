const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const results=[]; fs.mkdirSync('output/playwright',{recursive:true});
 for(const [width,height] of [[1440,900],[1920,1080],[820,1024],[390,844],[320,568]]){
  const page=await browser.newPage({viewport:{width,height}}); const errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.fonts.ready);
  const phases=[];
  for(const p of [0,.25,.5,.75,1,.5,0]){
   await page.evaluate(p=>{const r=document.querySelector('.drive-scroll'),s=r.querySelector('.drive-stage');scrollTo({top:Math.round(scrollY+r.getBoundingClientRect().top+p*(r.offsetHeight-s.offsetHeight)),behavior:'instant'});},p);
   await page.waitForFunction(p=>{const r=document.querySelector('.drive-scroll');return r.classList.contains('is-ready')&&r.dataset.driveSettled==='true'&&Math.abs(Number(r.dataset.driveProgress)-p)<.003&&r.driveSequenceState.quality==='full';},p,{timeout:15000});
   phases.push(await page.evaluate(()=>{const r=document.querySelector('.drive-scroll');return {frame:Number(r.dataset.driveFrame),progress:r.dataset.driveProgress,state:{...r.driveSequenceState},overflow:document.documentElement.scrollWidth>innerWidth,cardOpacity:[...r.querySelectorAll('.drive-specs>div')].map(c=>Number(getComputedStyle(c).opacity)),cardsFit:[...r.querySelectorAll('.drive-specs>div')].every(c=>c.scrollWidth<=c.clientWidth+1),footerBottom:r.querySelector('.drive-footer').getBoundingClientRect().bottom,stageTop:r.querySelector('.drive-stage').getBoundingClientRect().top};}));
   if([0,.5,1].includes(p))await page.screenshot({path:`output/playwright/drift-v7-${width}-${p}.png`});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('#performance').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const reduced=await page.evaluate(()=>{const r=document.querySelector('.drive-scroll');return {allVisible:[...r.querySelectorAll('.drive-specs>div')].every(c=>Number(getComputedStyle(c).opacity)===1),overflow:document.documentElement.scrollWidth>innerWidth,static:r.offsetHeight===r.querySelector('.drive-stage').offsetHeight};});
  results.push({width,height,errors,failed,phases,reduced});
  await page.close();
 }
 await browser.close();
 const pass=results.every(r=>!r.errors.length&&!r.failed.length&&r.phases.every(p=>!p.overflow&&p.cardsFit&&p.state.decoded<=(r.width<=760?8:12)&&p.state.failed===0)&&r.phases[0].frame===0&&r.phases[4].frame===59&&r.phases[6].frame===0&&r.phases[4].cardOpacity.every(o=>o===1)&&r.reduced.allVisible&&!r.reduced.overflow&&r.reduced.static);
 fs.writeFileSync('output/playwright/drift-v7-qa.json',JSON.stringify({pass,results},null,2));
 console.log(JSON.stringify({pass,results:results.map(r=>({viewport:[r.width,r.height],errors:r.errors,failed:r.failed,frames:r.phases.map(p=>p.frame),fits:r.phases.every(p=>!p.overflow&&p.cardsFit),reduced:r.reduced}))},null,2));
 if(!pass)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
