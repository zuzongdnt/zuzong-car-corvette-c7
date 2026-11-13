const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),external=[];
  page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://localhost:4173/'))external.push(r.url())});
  let failOnce=true;
  await page.route('**/corvette-c7.glb*',route=>{if(failOnce){failOnce=false;return route.abort()}return route.continue()});
  await page.goto('http://localhost:4173/index.html#collection');
  await page.getByRole('button',{name:'Thử tải lại',exact:true}).waitFor({state:'visible',timeout:60000});
  const disabled=await page.locator('.car-paints').evaluate(f=>f.disabled&&f.querySelector('button').matches(':disabled'));
  await page.getByRole('button',{name:'Thử tải lại',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#corvette-viewer').dataset.ready==='true',null,{timeout:60000});
  const colors=[];
  for(const name of ['đen Obsidian','trắng Pearl','đỏ Racing','xanh Velocity','bạc Satin']){
   const button=page.getByRole('button',{name:`Sơn màu ${name}`,exact:true});await button.click();await page.waitForTimeout(200);
   colors.push(await page.evaluate(()=>({paint:document.querySelector('#corvette-viewer').dataset.paint,selected:document.querySelectorAll('[data-car-color][aria-pressed=true]').length,factor:document.querySelector('#corvette-viewer').model.materials.find(m=>m.name==='Car Paint').pbrMetallicRoughness.baseColorFactor})));
   if(name==='trắng Pearl'){await page.locator('.car-stage').scrollIntoViewIfNeeded();await page.screenshot({path:'output/playwright/model-white-1440.png'})}
  }
  await page.getByRole('button',{name:'Sơn màu đen Obsidian',exact:true}).click();
  await page.getByRole('button',{name:'Tự xoay',exact:false}).click();
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(600);
  const offscreen=await page.evaluate(()=>!document.querySelector('#corvette-viewer').autoRotate);
  const header=await page.evaluate(()=>getComputedStyle(document.querySelector('.site-header')).backgroundColor==='rgba(0, 0, 0, 0)');
  await page.locator('#collection [data-gallery-open]').first().click();
  const gallery=await page.locator('#gallery-dialog').evaluate(d=>d.open);
  const pass=disabled&&colors.every(c=>c.selected===1)&&new Set(colors.map(c=>JSON.stringify(c.factor))).size===5&&offscreen&&header&&gallery&&!external.length;
  const report={pass,disabled,recovered:true,colors,offscreen,header,gallery,external};fs.writeFileSync('output/playwright/model-recovery-qa.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(!pass)process.exitCode=1;
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
