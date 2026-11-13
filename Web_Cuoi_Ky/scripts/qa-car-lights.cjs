const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const out=path.resolve(__dirname,'../output/playwright/car-lights');fs.mkdirSync(out,{recursive:true});let browser;
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1500,height:1100}}),errors=[],httpErrors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)httpErrors.push(r.url())});
 await page.goto('http://localhost:4173/products.html?car=corvette',{waitUntil:'domcontentloaded'});
 const results=[];
 for(const car of ['corvette','bmw','porsche','mercedes','lamborghini']){
  await page.locator(`[data-brand=${car}]`).click();
  await page.waitForFunction(car=>{const h=document.querySelector('[data-studio-mount]');return h.dataset.ready==='true'&&JSON.parse(h.dataset.config).car===car&&!document.querySelector('[data-car-lights]').disabled},car,{timeout:90000});
  if(await page.locator('[data-car-lights]').getAttribute('aria-pressed')==='true')await page.locator('[data-car-lights]').click();
  await page.waitForFunction(()=>document.querySelector('[data-studio-mount]').dataset.lightLevel==='0.000');
  const sample=()=>page.evaluate(()=>{const v=document.querySelector('model-viewer');return v.model.materials.map(m=>({name:m.name,color:[...m.pbrMetallicRoughness.baseColorFactor],emission:[...m.emissiveFactor],strength:m.emissiveStrength}))});
  const off=await sample();const entries=await page.locator('[data-studio-mount]').evaluate(h=>JSON.parse(h.dataset.lightMaterials));
  assert.ok(entries.some(e=>e.kind==='front')&&entries.some(e=>e.kind==='rear'));
  const names=new Set(entries.map(e=>e.name));for(const m of off.filter(m=>names.has(m.name)))assert.equal(m.strength,0);
  await page.locator('[data-camera=hero]').click();await page.waitForTimeout(150);
  await page.locator('.z-viewer-stage').screenshot({path:path.join(out,`${car}-front-off.png`)});
  await page.evaluate(()=>{window.lightLevels=[];new MutationObserver(()=>window.lightLevels.push(Number(document.querySelector('[data-studio-mount]').dataset.lightLevel))).observe(document.querySelector('[data-studio-mount]'),{attributes:true,attributeFilter:['data-light-level']});});
  await page.locator('[data-car-lights]').click();await page.waitForFunction(()=>document.querySelector('[data-studio-mount]').dataset.lightLevel==='1.000');
  assert.ok(await page.evaluate(()=>lightLevels.some(v=>v>0&&v<1)),'Smooth ramp');
  const on=await sample();for(let i=0;i<off.length;i++){assert.deepEqual(on[i].color,off[i].color,'Lights must not change paint, glass or trim color');if(names.has(on[i].name))assert.ok(on[i].strength>0);else{assert.equal(on[i].strength,off[i].strength,'Non-lamp emission unchanged');assert.deepEqual(on[i].emission,off[i].emission)}}
  const selection=await page.evaluate(()=>Array.from(document.querySelector('selective-bloom-effect').selection).map(m=>m.material.name));assert.ok(selection.length>0);assert.ok(selection.every(n=>names.has(n)),'Bloom only actual lamp meshes');
  await page.locator('.z-viewer-stage').screenshot({path:path.join(out,`${car}-front-on.png`)});
  await page.locator('[data-camera=rear]').click();await page.waitForTimeout(200);await page.locator('.z-viewer-stage').screenshot({path:path.join(out,`${car}-rear-on.png`)});
  await page.locator('[data-car-lights]').click();await page.waitForFunction(()=>document.querySelector('[data-studio-mount]').dataset.lightLevel==='0.000');await page.locator('.z-viewer-stage').screenshot({path:path.join(out,`${car}-rear-off.png`)});
  await page.locator('[data-car-lights]').click();await page.waitForFunction(()=>document.querySelector('[data-studio-mount]').dataset.lightLevel==='1.000');
  results.push({car,lampMaterials:entries,selectiveMeshes:selection.length,smoothRamp:true,unrelatedColorsPreserved:true});console.log('PASS lights:',car);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('[data-car-lights]').click();await page.waitForFunction(()=>document.querySelector('[data-studio-mount]').dataset.lightLevel==='0.000');
 await page.locator('[data-car-lights]').click();await page.waitForFunction(()=>document.querySelector('[data-studio-mount]').dataset.lightLevel==='1.000');
 await page.locator('[data-brand=bmw]').click();await page.locator('[data-brand=corvette]').click();await page.waitForFunction(()=>document.querySelector('[data-studio-mount]').dataset.ready==='true'&&!document.querySelector('[data-car-lights]').disabled);assert.equal(await page.locator('[data-car-lights]').getAttribute('aria-pressed'),'true');
 for(let i=0;i<6;i++)await page.locator('[data-car-lights]').click();await page.waitForFunction(()=>document.querySelector('[data-studio-mount]').dataset.lightLevel==='1.000');
 await page.setViewportSize({width:390,height:844});await page.locator('[data-camera=hero]').click();await page.locator('[data-studio-mount]').screenshot({path:path.join(out,'mobile-on.png')});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);assert.deepEqual(httpErrors,[]);
 fs.writeFileSync(path.resolve(__dirname,'../output/car-lights-qa.json'),JSON.stringify({pass:true,results,reducedMotion:true,rapidToggle:true,carSwitch:true,mobile:true,errors,httpErrors},null,2));
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>browser?.close());
