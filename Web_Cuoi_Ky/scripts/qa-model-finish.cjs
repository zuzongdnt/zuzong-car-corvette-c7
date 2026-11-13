const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const label=process.argv[2]||'after',out=path.resolve(__dirname,'../output/playwright/finish-'+label);fs.mkdirSync(out,{recursive:true});
let browser;
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1600,height:1100},deviceScaleFactor:1}),errors=[];page.on('pageerror',e=>errors.push(e.message));const reports=[];
 await page.goto('http://localhost:4173/products.html?car=lamborghini&body=obsidian&rims=silver&calipers=red',{waitUntil:'domcontentloaded'});
 for(const car of ['lamborghini','bmw','corvette','porsche','mercedes']){
  await page.locator(`[data-brand=${car}]`).click();
  await page.waitForFunction(car=>document.querySelector('[data-studio-mount]')?.dataset.ready==='true'&&JSON.parse(document.querySelector('[data-studio-mount]').dataset.config).car===car,car,{timeout:120000});
  await page.locator('[data-part=body]').click();await page.locator('[data-color=obsidian]').click();
  for(const [view,orbit] of [['front','-42deg 74deg 90%'],['rear','42deg 74deg 90%']]){
   await page.locator('model-viewer').evaluate((v,orbit)=>{v.cameraOrbit=orbit;v.jumpCameraToGoal();},orbit);await page.waitForTimeout(600);
   await page.locator('.z-viewer-stage').screenshot({path:path.join(out,`${car}-${view}.png`)});
  }
  reports.push(await page.locator('model-viewer').evaluate((v,car)=>({car,loaded:v.loaded,materials:v.model.materials.map(m=>({name:m.name,metal:m.pbrMetallicRoughness.metallicFactor,rough:m.pbrMetallicRoughness.roughnessFactor})),dimensions:v.getDimensions(),environment:v.environmentImage}),car));
  if(label!=='before'){
   assert.match(reports.at(-1).environment,/studio-automotive\.hdr/);
   for(const material of reports.at(-1).materials.filter(m=>m.name.startsWith('ZUZONG_body |'))){assert.ok(Math.abs(material.metal-.38)<.001);assert.ok(Math.abs(material.rough-.23)<.001);}
   await page.locator('[data-color=pearl]').click();await page.waitForTimeout(400);
   await page.locator('.z-viewer-stage').screenshot({path:path.join(out,`${car}-pearl.png`)});
   await page.locator('[data-color=obsidian]').click();
  }
  console.log(label,car);
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({label,errors,reports},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>browser?.close());
