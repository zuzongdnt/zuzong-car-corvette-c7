const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const out=path.resolve(__dirname,'../output/playwright/liquid-specs');fs.mkdirSync(out,{recursive:true});
let browser;
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 const results=[];
 for(const [width,height] of [[1575,884],[761,884],[390,844],[320,640]]){
  const page=await browser.newPage({viewport:{width,height}});const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:4173/',{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);
  const intro=await page.evaluate(()=>{
   const h=document.querySelector('.site-header'),c=getComputedStyle(h),r=document.querySelector('.campaign-card').getBoundingClientRect();
   return {visible:c.visibility==='visible'&&+c.opacity===1,inert:h.inert,bg:c.backgroundColor,blur:c.backdropFilter,layer:getComputedStyle(h,'::before').content,copyWidth:r.width,copyHeight:r.height,copyTop:r.top,copyBottom:r.bottom,titleSize:parseFloat(getComputedStyle(document.querySelector('.campaign-card h2')).fontSize),overflow:document.documentElement.scrollWidth>innerWidth};
  });
  assert.equal(intro.visible,true);assert.equal(intro.inert,false);assert.equal(intro.bg,'rgba(0, 0, 0, 0)');assert.equal(intro.blur,'none');assert.equal(intro.layer,'none');assert.equal(intro.overflow,false);
  assert.ok(intro.copyTop>0&&intro.copyBottom<=height);if(width===1575){assert.ok(intro.copyWidth<=560);assert.ok(intro.titleSize<=60);}
  await page.screenshot({path:path.join(out,'intro-'+width+'.png')});
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo({top:document.querySelector('#unveil').offsetTop,behavior:'instant'});});
  await page.waitForFunction(()=>document.querySelector('.site-header').classList.contains('is-scrolled'));await page.waitForTimeout(400);
  const glass=await page.locator('.site-header').evaluate(h=>({filter:getComputedStyle(h,'::before').backdropFilter,displacement:document.querySelector('#zephyron-liquid-refraction feDisplacementMap')?.getAttribute('scale')}));
  assert.match(glass.filter,/zephyron-liquid-refraction/);assert.equal(glass.displacement,'18');
  await page.screenshot({path:path.join(out,'header-'+width+'.png')});
  const section=page.locator('#collection .z-live-specs');await section.scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('#collection .z-live-specs').dataset.animating==='false');
  for(const [car,expected] of [['corvette',['6,2','339','455','624']],['bmw',['3,0','353','480','550']],['porsche',['4,0','375','510','470']],['mercedes',['4,0','430','577','800']],['lamborghini',['6,5','747','1.015','725']]]){
   await page.locator(`#collection [data-brand="${car}"]`).click();
   await section.scrollIntoViewIfNeeded();
   await page.waitForFunction(car=>{const s=document.querySelector('#collection .z-live-specs');return s.dataset.car===car&&s.dataset.animating==='false';},car,{timeout:30000});
   assert.deepEqual(await section.locator('[data-spec-value]').allTextContents(),expected,car+' final numbers '+width);
   assert.match(await section.locator('[data-spec-source]').getAttribute('href'),/^https:\/\//);
  }
  await page.screenshot({path:path.join(out,'specs-'+width+'.png')});
  // Observe a mid-animation value and rapid selection cancellation.
  await page.evaluate(()=>{document.querySelector('#collection [data-brand=bmw]').click();});
  await page.waitForTimeout(160);
  const middle=await section.locator('[data-spec-value="2"]').innerText();assert.ok(+middle.replace('.','')>0&&+middle.replace('.','')<480,'count-up has intermediate values');
  await page.evaluate(()=>{for(const id of ['porsche','mercedes','lamborghini'])document.querySelector('#collection [data-brand='+id+']').click();});
  await page.waitForFunction(()=>{const s=document.querySelector('#collection .z-live-specs');return s.dataset.car==='lamborghini'&&s.dataset.animating==='false';});
  assert.equal(await section.locator('[data-spec-value="2"]').innerText(),'1.015');
  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>document.querySelector('#collection [data-brand=bmw]').click());
  assert.equal(await section.getAttribute('data-animating'),'false');assert.equal(await section.locator('[data-spec-value="2"]').innerText(),'480');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
  results.push({width,height,intro,glass,midCount:middle,allFiveSpecs:true,rapidSelection:true,reducedMotion:true});
  if(width===1575){
   await page.evaluate(()=>{document.querySelectorAll('video').forEach(v=>v.pause());const el=document.createElement('div');el.id='qa-refraction-pattern';el.style.cssText='position:fixed;inset:0 0 auto;height:100px;background:repeating-linear-gradient(90deg,#111 0 8px,#fff 8px 16px);z-index:29';document.body.append(el);});
   await page.screenshot({path:path.join(out,'refraction-enabled.png'),clip:{x:0,y:0,width,height:86}});
   await page.addStyleTag({content:'.site-header.is-scrolled:before{backdrop-filter:blur(10px)!important;-webkit-backdrop-filter:blur(10px)!important}'});
   await page.screenshot({path:path.join(out,'refraction-disabled.png'),clip:{x:0,y:0,width,height:86}});
  }
  await page.close();console.log('PASS intro, liquid layer and animated specs '+width);
 }
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({pass:true,results},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>browser?.close());
