const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path');
const out=path.resolve(__dirname,'../output/playwright');
async function main(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const label=process.argv[2]||'after',results=[];
 for(const [name,width,height] of [['tablet',739,871],['desktop',1440,900],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';});
  for(const view of ['front','hero','rear']){
   await page.locator('[data-angle="'+view+'"]').click();
   await page.waitForTimeout(400);
   await page.locator('.collection-stage').evaluate(el=>scrollTo({top:el.getBoundingClientRect().top+scrollY-140,behavior:'instant'}));
   await page.waitForTimeout(350);
   await page.screenshot({path:path.join(out,'leveled-'+label+'-'+name+'-'+view+'.png')});
   results.push(await page.locator('.collection-car').evaluate((el,args)=>({label:args.label,viewport:args.name,view:args.view,src:el.getAttribute('src'),transform:getComputedStyle(el).transform,roll:el.style.getPropertyValue('--view-roll'),scale:el.style.getPropertyValue('--view-scale'),complete:el.complete&&el.naturalWidth>0,selected:document.querySelector('[data-angle="'+args.view+'"]').getAttribute('aria-selected'),overflow:document.documentElement.scrollWidth>innerWidth}),{label,name,view}));
  }
  await page.locator('[data-angle="front"]').focus();
  await page.keyboard.press('End');await page.waitForTimeout(400);
  results.push({viewport:name,keyboardEnd:await page.locator('[data-angle="rear"]').getAttribute('aria-selected'),focused:await page.evaluate(()=>document.activeElement.id),errors});
  await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await reduced.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await reduced.locator('[data-angle="rear"]').click();
 results.push({reduced:true,transform:await reduced.locator('.collection-car').evaluate(el=>getComputedStyle(el).transform)});
 await reduced.close();await browser.close();
 fs.writeFileSync(path.join(out,'leveled-'+label+'-metrics.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify(results,null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
