const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..'),OUT=path.join(ROOT,'output/playwright/studio-scroll');
fs.mkdirSync(OUT,{recursive:true});
const keys=['corvette','bmw','porsche','mercedes','lamborghini'];
let browser;
async function go(page,p){
 await page.evaluate(p=>{const r=document.querySelector('#performance'),stage=r.querySelector('.studio-sequence-stage');scrollTo({top:scrollY+r.getBoundingClientRect().top+p*(r.offsetHeight-stage.offsetHeight),behavior:'instant'});},p);
 await page.waitForFunction(p=>{const r=document.querySelector('#performance');return r.classList.contains('is-ready')&&Math.abs(Number(r.dataset.sequenceProgress)-p)<.0008&&r.dataset.sequenceSettled==='true';},p,{timeout:25000});
}
async function state(page){return page.evaluate(()=>{
 const r=document.querySelector('#performance'),s=r.studioSequenceState,canvas=r.querySelector('canvas'),ctx=canvas.getContext('2d');
 const rgba=ctx.getImageData(Math.round(canvas.width*.2),Math.round(canvas.height*.4),Math.round(canvas.width*.6),Math.round(canvas.height*.3)).data;
 let min=255,max=0;for(let i=0;i<rgba.length;i+=16){min=Math.min(min,rgba[i]);max=Math.max(max,rgba[i]);}
 const b=r.querySelector('.studio-sequence-stage').getBoundingClientRect(),heading=r.querySelector('.studio-sequence-header').getBoundingClientRect(),footer=r.querySelector('.studio-sequence-footer').getBoundingClientRect();
 const callouts=[...r.querySelectorAll('.studio-sequence-callout')].map(el=>{const q=el.getBoundingClientRect();return {x:q.x,y:q.y,width:q.width,height:q.height,within:q.left>=-1&&q.right<=innerWidth+1&&q.top>=b.top&&q.bottom<=b.bottom,clearOfText:q.top>=heading.bottom+3&&q.bottom<=footer.top-3};});
 return {...s,progress:r.dataset.sequenceProgress,detail:r.querySelector('[data-sequence-detail]').getAttribute('href'),values:[...r.querySelectorAll('[data-value]')].map(x=>x.textContent),lines:[...r.querySelectorAll('.studio-sequence-lines path')].map(x=>x.getAttribute('d')),callouts,canvasRange:max-min,overflow:document.documentElement.scrollWidth>innerWidth};
});}
async function main(){
 const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'assets/studio-scroll-v2/manifest.json')));
 assert.equal(manifest.frameCount,320);assert.equal(JSON.parse(fs.readFileSync(path.join(ROOT,'assets/studio-scroll-v2/anchors.json'))).length,320);
 for(let i=0;i<320;i++)for(const tier of ['','mobile','preview'])assert.ok(fs.existsSync(path.join(ROOT,'assets/studio-scroll-v2',tier,`frame-${String(i).padStart(3,'0')}.webp`)));
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const results=[];
 for(const [width,height] of [[1440,900],[661,871],[390,844],[320,568],[900,540]]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&r.url().includes('studio-scroll'))failed.push(r.url());});
  await page.goto('http://localhost:4173/?studio-scroll=qa',{waitUntil:'domcontentloaded'});
  await go(page,0);
  await page.waitForFunction(()=>document.querySelector('#performance').studioSequenceState.previewDecoded===320,null,{timeout:40000});
  const states=[];
  for(const carIndex of [0,1,2,3,4,3,2,1,0]){
   await go(page,(carIndex*64+30)/319);
   const s=await state(page);assert.equal(s.car,keys[carIndex]);assert.ok(s.detail.endsWith(keys[carIndex]));assert.ok(s.canvasRange>30);assert.ok(!s.overflow);assert.ok(s.lines.every(Boolean));assert.ok(s.callouts.every(c=>c.within&&c.clearOfText),JSON.stringify({width,height,callouts:s.callouts}));
   states.push(s);
   if(states.length<=5)await page.screenshot({path:path.join(OUT,`${width}-${keys[carIndex]}.png`)});
  }
  // Rapid cuts in both directions must keep the drawn image and its specs synchronized.
  for(const p of [.99,.01,.6,.2,.8,0,1]){await go(page,p);const s=await state(page);assert.ok(s.canvasRange>30);assert.equal(s.car,keys[Math.floor(s.frame/64)]);}
  if(width===1440){
   await go(page,0);
   for(let frame=0;frame<320;frame++){
    await page.evaluate(frame=>{const r=document.querySelector('#performance');scrollTo({top:scrollY+r.getBoundingClientRect().top+frame/319*(r.offsetHeight-r.querySelector('.studio-sequence-stage').offsetHeight),behavior:'instant'});},frame);
    await page.waitForFunction(frame=>Math.round(document.querySelector('#performance').studioSequenceState.frame)===frame,frame,{timeout:6000});
   }
  }
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);results.push({width,height,states,errors,failed});await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await reduced.goto('http://localhost:4173/',{waitUntil:'domcontentloaded'});
 await reduced.locator('#performance').scrollIntoViewIfNeeded();
 await reduced.locator('[data-sequence-car="lamborghini"]').click();
 await reduced.waitForFunction(()=>document.querySelector('#performance').studioSequenceState.car==='lamborghini');
 assert.equal((await state(reduced)).car,'lamborghini');await reduced.screenshot({path:path.join(OUT,'reduced-motion.png')});await reduced.close();
 const cold=await browser.newPage({viewport:{width:661,height:871}});
 await cold.route('**/studio-scroll-v2/**/*.webp',async route=>{await new Promise(r=>setTimeout(r,65));await route.continue();});
 await cold.goto('http://localhost:4173/?cold=studio-scroll',{waitUntil:'domcontentloaded'});
 for(const p of [0,.98,.4,.02,.8,.2]){await go(cold,p);const s=await state(cold);assert.ok(s.canvasRange>30);assert.equal(s.car,keys[Math.floor(s.frame/64)]);}
 await cold.close();
 fs.writeFileSync(path.join(OUT,'qa.json'),JSON.stringify({assets:960,all320FramesPresent:true,all320FramesVisitedInBrowser:true,viewports:results,reducedMotionSelection:true,coldLoadingFastJumps:true},null,2));
 console.log(JSON.stringify({passed:true,assets:960,viewports:results.length,reverseScroll:true,fastJumps:true,reducedMotion:true}));
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>browser?.close());
