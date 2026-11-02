const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'output/playwright/unveil-five');fs.mkdirSync(out,{recursive:true});
const base=process.env.QA_BASE_URL||'http://127.0.0.1:4173';
let browser;
async function scrub(page,p){
 await page.evaluate(p=>{
  const hero=document.querySelector('.unveil'),stage=document.querySelector('.hero-stage');
  scrollTo({top:hero.offsetTop+(hero.offsetHeight-stage.offsetHeight)*p,behavior:'instant'});
 },p);
 const wanted=Math.max(0,Math.min(1,(p-.05)/.8))*143;
 await page.waitForFunction(wanted=>window.revealSequence.ready&&Math.abs(window.revealSequence.drawnFrame-wanted)<.5,wanted,{timeout:30000});
}
async function layout(page){
 return page.evaluate(()=>{
  const stage=document.querySelector('.hero-stage').getBoundingClientRect();
  const boxes=['.unveil-heading','.unveil-media-controls','.unveil-choices','.hero-footer'].map(s=>({s,r:document.querySelector('.unveil-five '+s).getBoundingClientRect()}));
  const media=document.querySelector('.hero-vehicle').getBoundingClientRect();
  return {overflow:document.documentElement.scrollWidth>innerWidth,clipped:boxes.filter(b=>b.r.left<stage.left-1||b.r.right>stage.right+1||b.r.bottom>stage.bottom+1).map(b=>b.s),overlap:boxes.slice(1).filter((b,i)=>b.r.top<boxes[i].r.bottom-1).map(b=>b.s),fullscreen:Math.abs(media.width-innerWidth)<1&&Math.abs(media.height-innerHeight)<1};
 });
}
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 const results=[];
 for(const [name,width,height] of [['desktop',1440,900],['tablet',768,1024],['mobile',390,844],['small',320,640],['landscape',844,390]]){
  const page=await browser.newPage({viewport:{width,height}});const errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push([r.status(),r.url()]);});
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
  await scrub(page,.8);
  assert.equal(await page.evaluate(()=>window.revealSequence.frameCount),144);
  assert.ok(await page.evaluate(()=>window.revealSequence.drawnFrame>130));
  await page.screenshot({path:path.join(out,name+'-collection.png')});
  const expected={overflow:false,clipped:[],overlap:[],fullscreen:true};
  const boxes=await layout(page);assert.deepEqual(boxes,expected,name);
  assert.match(await page.locator('.studio-caption-title').innerText(),/Năm biểu tượng/);
  assert.equal(await page.locator('.unveil-choices img').count(),5);
  assert.equal(await page.locator('.unveil-choices img').evaluateAll(images=>images.every(i=>i.complete&&i.naturalWidth>0)),true);
  if(name==='desktop'||name==='mobile'||name==='small'){
   await scrub(page,.10);assert.ok(await page.evaluate(()=>window.revealSequence.drawnFrame<30));
   assert.match(await page.locator('.studio-caption-title').innerText(),/Dưới lớp bạt/);
   await page.screenshot({path:path.join(out,name+'-covered.png')});
   await scrub(page,.34);assert.match(await page.locator('.studio-caption-title').innerText(),/Từng đường nét/);
   await page.screenshot({path:path.join(out,name+'-peel.png')});
   await scrub(page,.10);assert.match(await page.locator('.studio-caption-title').innerText(),/Dưới lớp bạt/);
   await scrub(page,.8);
   for(const [car,label] of [['corvette','Corvette C7'],['bmw','M4 G82'],['porsche','911 GT3'],['mercedes','AMG SL63'],['lamborghini','Revuelto']]){
    await page.locator(`[data-unveil-car="${car}"]`).click();
    await page.waitForFunction(car=>document.querySelector('.unveil-film.is-visible')?.currentSrc.endsWith('/'+car+'.mp4'),car);
    await page.waitForFunction(()=>document.querySelector('.unveil-film.is-visible').currentTime>.1);
    assert.match(await page.locator('.studio-caption-title').innerText(),new RegExp(label));
    assert.equal(await page.locator('.unveil-detail').getAttribute('href'),'products.html?car='+car);
    assert.equal(await page.locator('[data-unveil-car][aria-pressed=true]').count(),1);
    assert.deepEqual(await layout(page),expected);
    assert.equal(await page.locator('.unveil-brand-logo').evaluate(img=>!img.hidden&&img.complete&&img.naturalWidth>0),true);
   }
   await page.waitForTimeout(600);await page.screenshot({path:path.join(out,name+'-selected.png')});
   await page.locator('.unveil-play').click();assert.equal(await page.locator('.unveil-film.is-visible').evaluate(v=>v.paused),true);
   await page.locator('.unveil-play').click();await page.waitForFunction(()=>!document.querySelector('.unveil-film.is-visible').paused);
   await page.evaluate(()=>['bmw','porsche','mercedes'].forEach(id=>document.querySelector(`[data-unveil-car="${id}"]`).click()));
   await page.waitForFunction(()=>document.querySelector('.unveil-film.is-visible')?.currentSrc.endsWith('/mercedes.mp4'));
   assert.match(await page.locator('.studio-caption-title').innerText(),/AMG SL63/);
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.locator('[data-unveil-car=bmw]').click();
   await page.waitForFunction(()=>document.querySelector('.unveil-film.is-visible')?.currentSrc.endsWith('/bmw.mp4'));
   assert.equal(await page.locator('.unveil-film.is-visible').evaluate(v=>v.paused),true);
   await page.locator('.unveil-overview').click();await page.waitForFunction(()=>!document.querySelector('.unveil-five').classList.contains('is-film'));
   assert.equal(await page.locator('.reveal-canvas').evaluate(e=>getComputedStyle(e).display),'none');
   assert.equal(await page.locator('.hero-car').evaluate(e=>getComputedStyle(e).display),'block');
   await page.screenshot({path:path.join(out,name+'-reduced.png')});
  }
  assert.deepEqual(errors,[],name+' browser errors');assert.deepEqual(missing,[],name+' missing assets');
  results.push({name,width,height,layout:boxes,errors,missing});await page.close();
 }
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({pass:true,results},null,2));
 console.log('PASS: full-viewport media, three scroll captions with rewind, five logos, five films and matching copy/links, rapid selection, pause/resume, reduced motion, five viewport sizes.');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>browser?.close());
