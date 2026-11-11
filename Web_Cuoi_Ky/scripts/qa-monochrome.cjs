const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/playwright/monochrome');fs.mkdirSync(out,{recursive:true});
const pages=['index.html','about.html','products.html','product.html?car=bmw','explore.html','gallery.html','news.html','article.html','contact.html','cart.html','account.html','sources.html','policies.html','experience.html','films.html'];
let browser;
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 const rows=[];
 for(const width of [1440,390,320,768]){
  const context=await browser.newContext({viewport:{width,height:width===1440?1000:900},reducedMotion:'reduce'});
  const page=await context.newPage();
  for(const url of pages){
   const errors=[],missing=[];const handle=e=>errors.push(e.message),response=r=>{if(r.status()>=400)missing.push([r.status(),r.url()]);};
   page.on('pageerror',handle);page.on('response',response);
   await page.goto('http://127.0.0.1:4173/'+url,{waitUntil:'domcontentloaded'});
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>{const img=document.querySelector('.z-brand img,.brand-logo');return img?.complete&&img.naturalWidth>0;});
   await page.waitForTimeout(250);
   const state=await page.evaluate(()=>{
    const header=document.querySelector('.site-header,.z-header');
    const logo=header?.querySelector('img');
    const headings=[...document.querySelectorAll('h1,h2,h3')].filter(e=>e.getBoundingClientRect().top<innerHeight);
    return {overflow:document.documentElement.scrollWidth>innerWidth,theme:!!document.querySelector('link[href="monochrome.css"]'),
     body:getComputedStyle(document.body).backgroundColor,header:header?getComputedStyle(header).backgroundColor:'',headerHidden:header?getComputedStyle(header).visibility==='hidden':false,headerBlur:header?getComputedStyle(header,'::before').backdropFilter:'',logo:logo?.getAttribute('src'),
     headings:headings.map(e=>({text:e.textContent,clipped:e.scrollWidth>e.clientWidth+2})),h1:document.querySelectorAll('h1').length,
     mediaFilters:[...document.querySelectorAll('.campaign-video,.campaign-poster,.z-feature-image,.z-card img,.reveal-canvas,.drive-canvas')].map(e=>getComputedStyle(e).filter)};
   });
   assert.equal(state.theme,true,url);assert.equal(state.overflow,false,url+' overflow '+width);assert.equal(state.h1,1,url+' h1');
   if(url==='index.html'){assert.equal(state.headerHidden,false,'intro nav must stay visible');assert.equal(state.header,'rgba(0, 0, 0, 0)');}else assert.match(state.headerBlur,/blur\(/,url+' glass header');
   assert.match(state.logo,/zephyron-horizontal-black/);
   assert.deepEqual(state.headings.filter(h=>h.clipped),[],url+' clipped heading '+width);
   assert.ok(state.mediaFilters.every(filter=>!filter.includes('grayscale')),url+' must preserve media colors');
   if(width===1440||width===390)await page.screenshot({path:path.join(out,url.split('.')[0]+(url.includes('?')?'-detail':'')+'-'+width+'.png')});
   assert.deepEqual(errors,[],url);assert.deepEqual(missing,[],url);rows.push({url,width,...state});
   page.off('pageerror',handle);page.off('response',response);
  }
  await context.close();console.log('PASS shared monochrome pages at '+width);
 }
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({pass:true,pages:pages.length,viewports:4,rows},null,2));
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(()=>browser?.close());
