const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path');
const {pathToFileURL}=require('url');
const root=path.resolve(__dirname,'..'),out=path.join(root,'output/playwright');
async function main(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
 const samples=[];
 const record=async(label,progress)=>{
  await page.evaluate(progress=>{const h=document.querySelector('.unveil'),s=document.querySelector('.hero-stage');scrollTo({top:progress*(h.offsetHeight-s.offsetHeight),behavior:'instant'});},progress);
  await page.waitForTimeout(850);
  await page.screenshot({path:path.join(out,'sequence-'+label+'.png')});
  samples.push({label,...await page.evaluate(()=>({...window.revealSequence,update:undefined}))});
 };
 for(const progress of [0,.35,.54,.7,.93,.4,0])await record('desktop-'+String(progress).replace('.','-'),progress);
 const stream=await page.evaluate(async()=>{
  const travel=document.querySelector('.unveil').offsetHeight-document.querySelector('.hero-stage').offsetHeight;
  const samples=[];
  for(let step=0;step<180;step++){
   const progress=step<90?step/90:(180-step)/90;
   scrollTo({top:progress*travel,behavior:'instant'});
   await new Promise(resolve=>requestAnimationFrame(resolve));
   samples.push({error:Math.abs(window.revealSequence.drawnFrame-window.revealSequence.frameIndex),cache:window.revealSequence.decodedFrames});
  }
  return {count:samples.length,maxCache:Math.max(...samples.map(s=>s.cache)),meanError:samples.reduce((a,s)=>a+s.error,0)/samples.length,maxError:Math.max(...samples.map(s=>s.error))};
 });
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(900);
 for(const progress of [0,.35,.54,.7,.93])await record('mobile-'+String(progress).replace('.','-'),progress);
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(250);
 const reduced=await page.evaluate(()=>({...window.revealSequence,update:undefined}));
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(900);await record('motion-restored',0);
 await page.setViewportSize({width:1440,height:900});await page.waitForTimeout(900);await record('desktop-resize-restored',.54);
 await page.goto(pathToFileURL(path.join(root,'index.html')).href,{waitUntil:'load'});await page.waitForTimeout(1000);
 const file=await page.evaluate(()=>({...window.revealSequence,update:undefined}));
 await browser.close();
 const pass=!errors.length&&samples.every(s=>s.ready&&Math.abs(s.drawnFrame-s.frameIndex)<1&&s.decodedFrames<=32)&&stream.maxCache<=32&&stream.meanError<4&&reduced.decodedFrames===0&&file.ready;
 const result={pass,errors,samples,stream,reduced,file};
 fs.writeFileSync(path.join(out,'sequence-runtime-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
 if(!pass)process.exitCode=1;
}
main().catch(error=>{console.error(error);process.exitCode=1});
