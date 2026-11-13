const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=path.resolve(__dirname,'../output/playwright/bmw-roof');fs.mkdirSync(out,{recursive:true});let browser;
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1500,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:4173/products.html?car=bmw&body=pearl',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>document.querySelector('[data-studio-mount]')?.dataset.ready==='true',null,{timeout:120000});
 const materials=()=>page.locator('model-viewer').evaluate(v=>v.model.materials.map(m=>({name:m.name,color:[...m.pbrMetallicRoughness.baseColorFactor]})));
 const baseline=await materials(),roof=baseline.find(m=>m.name==='BMW | Mai carbon');
 const linear=v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4;
 [23,25,28].forEach((v,i)=>assert.ok(Math.abs(roof.color[i]-linear(v/255))<1e-6));assert.equal(roof.color[3],1);
 for(const color of ['obsidian','pearl','racing','velocity','satin']){
  await page.locator(`[data-color=${color}]`).click();
  const current=await materials();current.forEach((m,i)=>{if(!m.name.startsWith('ZUZONG_body |'))assert.deepEqual(m,baseline[i]);});
  for(const [angle,orbit] of [['hero','-42deg 76deg 90%'],['roof','-42deg 35deg 100%']]){
   await page.locator('model-viewer').evaluate((v,orbit)=>{v.cameraOrbit=orbit;v.jumpCameraToGoal();},orbit);
   await page.locator('.z-viewer-stage').scrollIntoViewIfNeeded();await page.waitForTimeout(250);
   await page.locator('.z-viewer-stage').screenshot({path:path.join(out,`${color}-${angle}.png`)});
  }
 }
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});await page.locator('model-viewer').evaluate(v=>{v.cameraOrbit='-42deg 55deg 120%';v.jumpCameraToGoal()});
  await page.locator('.z-viewer-stage').scrollIntoViewIfNeeded();await page.waitForTimeout(200);
  await page.locator('.z-viewer-stage').screenshot({path:path.join(out,`mobile-${width}.png`)});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({pass:true,roofColor:'#17191c',allFivePaints:true,roofAndOtherMaterialsStable:true,widths:[1500,390,320],errors},null,2));
 console.log('PASS BMW graphite roof / all five paints / other materials unchanged');
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>browser?.close());
