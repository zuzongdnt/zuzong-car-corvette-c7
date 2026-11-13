const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 try{
  const results=[];
  for(const [width,height] of [[1440,900],[925,884],[390,844]].filter(([w])=>!process.argv[2]||w===Number(process.argv[2]))){
   const page=await browser.newPage({viewport:{width,height},hasTouch:width===390,isMobile:width===390}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://localhost:4173/index.html#collection');
   await page.waitForFunction(()=>document.querySelector('#corvette-viewer').dataset.ready==='true',null,{timeout:60000});
   const position=async progress=>{
    await page.evaluate(p=>{const w=document.querySelector('.car-scroll'),s=document.querySelector('.car-studio');scrollTo({top:scrollY+w.getBoundingClientRect().top-parseFloat(getComputedStyle(s).top)+(w.offsetHeight-s.offsetHeight)*p,behavior:'instant'})},progress);
    await page.waitForTimeout(1000);
   };
   const read=()=>page.evaluate(()=>{const v=document.querySelector('#corvette-viewer'),s=document.querySelector('.car-studio'),r=s.getBoundingClientRect(),o=v.getCameraOrbit(),n=document.querySelector('.bottom-nav');return {theta:o.theta,phi:o.phi,radius:o.radius,progress:Number(v.dataset.scrollProgress),top:r.top,bottom:r.bottom,pinTop:parseFloat(getComputedStyle(s).top),navTop:innerWidth<=760?n.getBoundingClientRect().top:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,y:scrollY}});
   const phases=[];
   for(const [name,p] of [['front',.04],['side',.5],['rear',.96]]){
    await position(p);const state=await read();phases.push(state);
    await page.screenshot({path:`output/playwright/model-pinned-${name}-${width}.png`});
   }
   await position(.45);const before=await read(),box=await page.locator('#corvette-viewer').boundingBox();
   await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.wheel(0,180);await page.waitForTimeout(1000);const wheel=await read();
   await page.getByRole('button',{name:'Phóng to xe',exact:true}).click();await page.waitForTimeout(1500);const zoom=await read();
   await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.wheel(0,120);await page.waitForTimeout(1000);const afterZoomScroll=await read();
   await page.getByRole('button',{name:'Phía sau',exact:true}).click();
   await page.waitForFunction(()=>Number(document.querySelector('#corvette-viewer').dataset.scrollProgress)>.94);await page.waitForTimeout(1200);const presetRear=await read();
   await page.getByRole('button',{name:'Chính diện',exact:true}).click();
   await page.waitForFunction(()=>Number(document.querySelector('#corvette-viewer').dataset.scrollProgress)<.06);await page.waitForTimeout(1200);const presetFront=await read();
   await position(1.08);const exit=await read();
   await position(.5);await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(400);
   const reduced=await page.evaluate(()=>({position:getComputedStyle(document.querySelector('.car-studio')).position,height:document.querySelector('.car-scroll').offsetHeight}));
   const pass=!errors.length&&phases.every(s=>Math.abs(s.top-s.pinTop)<2&&s.bottom<=s.navTop&&!s.overflow)&&Math.abs(phases[0].theta)<.03&&Math.abs(phases[1].theta-Math.PI/2)<.03&&Math.abs(phases[2].theta-Math.PI)<.03&&wheel.y>before.y+100&&wheel.theta>before.theta&&(wheel.theta-before.theta)<Math.PI/15&&Math.abs(wheel.radius-before.radius)<.01&&zoom.radius<wheel.radius&&Math.abs(afterZoomScroll.radius-zoom.radius)<.02&&Math.abs(presetRear.theta-Math.PI)<.03&&Math.abs(presetFront.theta)<.03&&exit.top<exit.pinTop-100&&reduced.position==='relative'&&reduced.height<height*2;
   const result={width,height,pass,errors,phases,before,wheel,zoom,afterZoomScroll,presetRear,presetFront,exit,reduced};results.push(result);console.log(JSON.stringify(result));await page.close();
  }
  const pass=results.every(r=>r.pass);fs.writeFileSync(`output/playwright/model-pinned${process.argv[2]?'-'+process.argv[2]:''}-qa.json`,JSON.stringify({pass,results},null,2));if(!pass)process.exitCode=1;
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
