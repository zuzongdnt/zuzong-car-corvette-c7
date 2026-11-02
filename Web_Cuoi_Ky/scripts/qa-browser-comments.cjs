const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const out=path.resolve(__dirname,'../output/playwright/browser-comments');fs.mkdirSync(out,{recursive:true});
let browser;
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 const results=[];
 for(const [width,height] of [[1575,884],[761,884],[390,844],[320,640]]){
  const page=await browser.newPage({viewport:{width,height}});const errors=[],missing=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)missing.push(r.url());});
  await page.goto('http://localhost:4173/',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(150);
  const intro=await page.evaluate(()=>{const h=document.querySelector('.site-header'),card=document.querySelector('.campaign-card'),r=card.getBoundingClientRect(),logo=document.querySelector('.brand-logo'),brand=document.querySelector('.campaign-brand').getBoundingClientRect();return {hidden:getComputedStyle(h).visibility==='hidden',inert:h.inert,blur:getComputedStyle(card).backdropFilter,card:{top:r.top,bottom:r.bottom,left:r.left,right:r.right},brandBottom:brand.bottom,logo:logo.getAttribute('src'),overflow:document.documentElement.scrollWidth>innerWidth};});
  assert.equal(intro.hidden,false);assert.equal(intro.inert,false);assert.match(intro.blur,/blur\(14px\)/);assert.match(intro.logo,/horizontal-black/);assert.equal(intro.overflow,false);
  assert.ok(intro.card.top>=0&&intro.card.bottom<=height&&intro.card.left>=0&&intro.card.right<=width,'intro copy must fit '+width);
  assert.ok(intro.brandBottom+8<intro.card.top,'intro copy must not cover the logo '+width);
  await page.screenshot({path:path.join(out,'intro-'+width+'.png')});
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo({top:document.querySelector('#unveil').offsetTop,behavior:'instant'});});
  await page.waitForFunction(()=>document.querySelector('.site-header').classList.contains('is-scrolled'));
  await page.waitForTimeout(400);
  const header=await page.locator('.site-header').evaluate(h=>({blur:getComputedStyle(h,'::before').backdropFilter,inert:h.inert,visibility:getComputedStyle(h).visibility,alpha:getComputedStyle(h).backgroundColor}));
  assert.match(header.blur,/zephyron-liquid-refraction/);assert.equal(header.inert,false);assert.equal(header.visibility,'visible');
  await page.screenshot({path:path.join(out,'glass-header-'+width+'.png')});
  const config=await page.locator('#collection .z-config').evaluate(e=>({blur:getComputedStyle(e).backdropFilter,background:getComputedStyle(e).backgroundColor}));assert.match(config.blur,/blur\(22px\)/);
  await page.locator('.world-feature').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>{const i=document.querySelector('.world-feature-image img');return i.complete&&i.naturalWidth>0;});
  const photo=await page.locator('.world-feature-image img').evaluate(i=>({src:i.currentSrc,filter:getComputedStyle(i).filter,natural:[i.naturalWidth,i.naturalHeight]}));
  assert.match(photo.src,/journey-porsche-road/);assert.equal(photo.filter,'none');
  await page.screenshot({path:path.join(out,'journey-'+width+'.png')});
  if(width===1575){await page.locator('#collection .z-config').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'config-glass-'+width+'.png')});}
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForFunction(()=>document.querySelector('.site-header').classList.contains('is-intro')&&!document.querySelector('.site-header').inert);
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);results.push({width,height,intro,header,config,photo});await page.close();
 }
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({pass:true,results},null,2));console.log('PASS: transparent intro navigation, liquid header on scroll, reversible header state, glass intro/config, horizontal original logo, web photo and four viewports.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>browser?.close());
