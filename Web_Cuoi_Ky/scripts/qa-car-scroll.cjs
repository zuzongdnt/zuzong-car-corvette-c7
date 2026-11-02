const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 try{
  const results=[];
  for(const width of (process.argv[2]?process.argv[2].split(',').map(Number):[1440,925,390])){
   const page=await browser.newPage({viewport:{width,height:1000},hasTouch:width===390,isMobile:width===390}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://localhost:4173/index.html#collection');
   await page.waitForFunction(()=>document.querySelector('#corvette-viewer').dataset.ready==='true',null,{timeout:60000});
   await page.evaluate(()=>scrollTo({top:scrollY+document.querySelector('#corvette-viewer').getBoundingClientRect().top-250,behavior:'instant'}));await page.waitForTimeout(900);
   const read=()=>page.evaluate(()=>{const v=document.querySelector('#corvette-viewer'),o=v.getCameraOrbit();return {y:scrollY,theta:o.theta,phi:o.phi,radius:o.radius,disableZoom:v.disableZoom,overflow:document.documentElement.scrollWidth>innerWidth}});
   const before=await read();
   const bounds=await page.locator('#corvette-viewer').boundingBox();await page.mouse.move(bounds.x+bounds.width*.5,bounds.y+200);
   await page.mouse.wheel(0,180);await page.waitForTimeout(1000);const down=await read();
   await page.screenshot({path:`output/playwright/model-scroll-${width}.png`});
   await page.mouse.wheel(0,-180);await page.waitForTimeout(1000);const up=await read();
   await page.getByRole('button',{name:'Phóng to xe',exact:true}).click();await page.waitForTimeout(1400);const zoom=await read();
   const box=await page.locator('#corvette-viewer').boundingBox();await page.mouse.move(box.x+box.width*.5,Math.max(110,box.y+150));
   await page.mouse.wheel(0,100);await page.waitForTimeout(900);const zoomScrolled=await read();
   await page.getByRole('button',{name:'Chính diện',exact:true}).click();await page.waitForTimeout(1000);const preset=await read();
   await page.getByRole('button',{name:'Thu nhỏ xe',exact:true}).click();await page.waitForTimeout(1400);const zoomOut=await read();
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(250);const reducedBefore=await read();
   await page.mouse.wheel(0,-100);await page.waitForTimeout(700);const reducedAfter=await read();
   let touchScroll=null;
   if(width===390){
    await page.evaluate(()=>scrollTo({top:scrollY+document.querySelector('#corvette-viewer').getBoundingClientRect().top-250,behavior:'instant'}));await page.waitForTimeout(500);
    const touchBefore=await read(),cdp=await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:530}]});
    for(let y=510;y>=350;y-=20){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y}]});await page.waitForTimeout(30)}
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(800);
    const touchAfter=await read();touchScroll=touchAfter.y>touchBefore.y+50&&Math.abs(touchAfter.radius-touchBefore.radius)<.02;
   }
   const pass=!errors.length&&before.disableZoom&&!before.overflow&&down.y>before.y+100&&Math.abs(down.theta-before.theta)>.08&&Math.abs(down.radius-before.radius)<.02&&Math.abs(up.theta-before.theta)<.025&&zoom.radius<up.radius&&zoomScrolled.y>zoom.y+50&&Math.abs(zoomScrolled.radius-zoom.radius)<.02&&Math.abs(preset.radius-zoomScrolled.radius)<.02&&zoomOut.radius>zoomScrolled.radius&&Math.abs(reducedAfter.theta-reducedBefore.theta)<.01&&(touchScroll===null||touchScroll);
   const result={width,pass,errors,before,down,up,zoom,zoomScrolled,preset,zoomOut,reducedBefore,reducedAfter,touchScroll};results.push(result);console.log(JSON.stringify(result));await page.close();
  }
  const pass=results.every(r=>r.pass);fs.writeFileSync(`output/playwright/model-scroll${process.argv[2]?'-'+process.argv[2]:''}-qa.json`,JSON.stringify({pass,results},null,2));if(!pass)process.exitCode=1;
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
