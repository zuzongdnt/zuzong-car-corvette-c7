const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');fs.mkdirSync(path.join(root,'output/playwright'),{recursive:true});fs.mkdirSync(path.join(root,'assets/studio'),{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1600,height:1100}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:4173/products.html',{waitUntil:'domcontentloaded'});
 for(const car of (process.argv[2]?process.argv[2].split(','):['corvette','bmw','porsche','mercedes','lamborghini'])){
  if(car!=='corvette')await page.locator(`[data-brand="${car}"]`).click();
  await page.waitForFunction(car=>{const host=document.querySelector('[data-studio-mount]');return host?.dataset.ready==='true'&&JSON.parse(host.dataset.config).car===car;},car,{timeout:120000});
  const materials=await page.evaluate(()=>document.querySelector('model-viewer').model.materials.map(m=>({name:m.name,color:[...m.pbrMetallicRoughness.baseColorFactor]})));
  assert.ok(['body','rims','calipers'].every(part=>materials.some(m=>m.name.startsWith('ZUZONG_'+part+' |'))));
  await page.locator('[data-camera=hero]').click();await page.waitForTimeout(600);
  await page.locator('[data-studio-mount]').screenshot({path:path.join(root,`output/playwright/studio-${car}.png`)});
  for(const [part,color] of [['body','racing'],['calipers','yellow'],['rims','bronze']]){
   const before=await page.evaluate(()=>document.querySelector('model-viewer').model.materials.map(m=>({name:m.name,color:[...m.pbrMetallicRoughness.baseColorFactor]})));
   await page.locator(`[data-part="${part}"]`).click();await page.locator(`[data-color="${color}"]`).click();
   const after=await page.evaluate(()=>document.querySelector('model-viewer').model.materials.map(m=>({name:m.name,color:[...m.pbrMetallicRoughness.baseColorFactor]})));
   let changed=0;
   for(let i=0;i<before.length;i++){if(JSON.stringify(before[i].color)!==JSON.stringify(after[i].color)){assert.ok(after[i].name.startsWith(`ZUZONG_${part} |`),`Unexpected material change ${car} ${part} ${after[i].name}`);changed++;}}
   assert.ok(changed>0,`${car} ${part} did not change`);
  }
  await page.waitForTimeout(300);await page.locator('[data-studio-mount]').screenshot({path:path.join(root,`output/playwright/studio-${car}-custom.png`)});
  // Export consistent gallery stills directly from the live 3D model.
  await page.locator('[data-part=body]').click();await page.locator('[data-color=obsidian]').click();await page.locator('[data-part=calipers]').click();await page.locator('[data-color=red]').click();await page.locator('[data-part=rims]').click();await page.locator('[data-color=silver]').click();await page.locator('[data-part=body]').click();
  for(const angle of ['hero','side','rear']){
   await page.locator(`[data-camera="${angle}"]`).click();await page.waitForTimeout(350);
   const hide=await page.addStyleTag({content:'.z-viewer-caption,.z-viewer-bottom{visibility:hidden!important}'});
   await page.locator('.z-viewer-stage').screenshot({path:path.join(root,`assets/studio/${car}-${angle}.webp`),type:'png'});
   await hide.evaluate(el=>el.remove());
  }
  console.log('PASS model + 3 independent color groups:',car);
 }
 assert.deepEqual(errors,[]);
 await browser.close();
 fs.writeFileSync(path.join(root,'output/studio-model-qa.json'),JSON.stringify({pass:true,cars:5,independentGroups:3,errors},null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
