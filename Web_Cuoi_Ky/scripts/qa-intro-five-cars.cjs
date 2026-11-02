const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
let browser;
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 const results=[];
 for(const [width,height] of [[1440,900],[967,900],[390,844],[360,780]]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:4173/index.html',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('.campaign-video')?.currentTime>.2,null,{timeout:30000});
  const media=await page.locator('.campaign-video').evaluate(v=>({src:v.currentSrc,width:v.videoWidth,height:v.videoHeight,duration:v.duration,paused:v.paused,muted:v.muted}));
  assert.match(media.src,/intro-5-cars-blender-1080p.mp4/);assert.equal(media.width,1920);assert.equal(media.height,1080);assert.ok(Math.abs(media.duration-48.667)<.1);assert.equal(media.paused,false);assert.equal(media.muted,true);
  assert.equal(await page.locator('[data-campaign=brandName]').innerText(),'ZUZONG CAR');assert.equal(await page.locator('.campaign-cta').getAttribute('href'),'#collection');assert.equal(await page.locator('.campaign-scroll').getAttribute('href'),'#collection');
  await page.locator('.campaign-video-toggle').click();assert.equal(await page.locator('.campaign-video').evaluate(v=>v.paused),true);
  await page.locator('.campaign-video').evaluate(async v=>{v.currentTime=4.5;await new Promise(resolve=>v.addEventListener('seeked',resolve,{once:true}));});
  await page.screenshot({path:`output/playwright/intro-five-cars-${width}.png`,fullPage:false});
  const layout=await page.evaluate(()=>{const root=document.querySelector('.campaign'),r=root.getBoundingClientRect();const selectors=['.campaign-brand','.campaign-intro','.campaign-card','.campaign-message','.campaign-bottom'];const boxes=selectors.map(s=>({s,r:document.querySelector(s).getBoundingClientRect()}));const overlaps=[];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];if(Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left)>1&&Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top)>1)overlaps.push([a.s,b.s]);}return {overflow:document.documentElement.scrollWidth>innerWidth,overlaps,clipped:boxes.filter(b=>b.r.left<r.left-1||b.r.right>r.right+1||b.r.bottom>r.bottom+1).map(b=>b.s)};});
  assert.equal(layout.overflow,false);assert.deepEqual(layout.overlaps,[]);assert.deepEqual(layout.clipped,[]);
  await page.locator('.campaign-video-toggle').click();await page.waitForFunction(()=>!document.querySelector('.campaign-video').paused);
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('.campaign-video').paused);
  await page.locator('.campaign-scroll').click();await page.waitForFunction(()=>document.querySelector('#collection').getBoundingClientRect().top<200);
  assert.deepEqual(errors,[]);results.push({width,media,layout,controls:true,skipIntro:true,reducedMotion:true,errors});await page.close();
 }
 fs.writeFileSync('output/intro-five-cars-qa.json',JSON.stringify({pass:true,results},null,2));console.log('PASS Full HD 5-car video, updated content, pause/resume, skip intro, reduced motion and 4 screen sizes.');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>browser?.close());
