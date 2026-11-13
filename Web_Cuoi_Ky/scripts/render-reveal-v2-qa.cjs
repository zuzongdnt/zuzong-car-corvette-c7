const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/playwright');
async function main(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const results=[];
 for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844],['small-mobile',320,640],['tablet',768,1024]]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
  const frames=[];
  for(const [label,progress] of [['covered',0],['peel',.38],['open',.92],['rewind',.22]]){
   await page.evaluate(p=>{const h=document.querySelector('.unveil'),s=document.querySelector('.hero-stage');scrollTo({top:(h.offsetHeight-s.offsetHeight)*p,behavior:'instant'});},progress);
   await page.waitForTimeout(750);
   await page.screenshot({path:path.join(out,`reveal-v2-${name}-${label}.png`)});
   frames.push(await page.evaluate(label=>({label,index:window.revealSequence.frameIndex,drawn:window.revealSequence.drawnFrame,quality:window.revealSequence.drawnQuality,decoded:window.revealSequence.decodedFrames,resolution:window.revealSequence.resolution,ready:window.revealSequence.ready,overflow:document.documentElement.scrollWidth>innerWidth}),label));
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(200);
  await page.screenshot({path:path.join(out,`reveal-v2-${name}-reduced.png`)});
  const reduced=await page.evaluate(()=>({canvas:getComputedStyle(document.querySelector('.reveal-canvas')).display,car:getComputedStyle(document.querySelector('.hero-car')).display,decoded:window.revealSequence.decodedFrames,source:document.querySelector('.hero-car img').currentSrc}));
  await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(600);
  const restored=await page.evaluate(()=>window.revealSequence.ready);
  results.push({name,errors,frames,reduced,restored});await page.close();
 }
 await browser.close();
 const pass=results.every(r=>!r.errors.length&&r.frames.every(f=>f.ready&&!f.overflow&&Math.abs(f.index-f.drawn)<1&&f.decoded<=24)&&r.reduced.canvas==='none'&&r.reduced.car!=='none'&&r.reduced.decoded===0&&r.restored);
 fs.writeFileSync(path.join(out,'reveal-v2-runtime-results.json'),JSON.stringify({pass,results},null,2));
 console.log(JSON.stringify({pass,results},null,2));if(!pass)process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1});
