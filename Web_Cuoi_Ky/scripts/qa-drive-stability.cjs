const fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
let browser;
async function main(){
 const source=fs.readFileSync('sections.html','utf8').match(/data-drive-src="([^"]+)"/)[1];
 const carRaw=await sharp(path.join(source,'car.webp')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const {width:sw,height:sh}=carRaw.info;
 const alphaAt=(x,y)=>x<0||y<0||x>=sw||y>=sh?0:carRaw.data[(Math.floor(y)*sw+Math.floor(x))*4+3];
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const results=[];
 for(const [width,height] of [[1440,900],[390,844],[320,568]]){
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto('http://localhost:4173/?v=drive-sharp-stability',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.fonts.ready);
  const states=[];let reference=null,firstCanvas=null,lastCanvas=null;
  const stops=[0,.2,.4,.6,.8,1,.65,.25,0];
  for(const [i,p] of stops.entries()){
   await page.evaluate(p=>{const r=document.querySelector('.drive-scroll'),start=scrollY+r.getBoundingClientRect().top,range=r.offsetHeight-r.querySelector('.drive-stage').offsetHeight;scrollTo({top:p===1?Math.floor(start+range):Math.ceil(start+p*range),behavior:'instant'});},p);
   await page.waitForFunction(p=>{const r=document.querySelector('.drive-scroll');return r.classList.contains('is-ready')&&r.dataset.driveSettled==='true'&&Math.abs(Number(r.dataset.driveProgress)-p)<.003;},p);
   const rect=await page.locator('.drive-car').boundingBox();
   const png=await page.screenshot({path:`output/playwright/drive-sharp-pixel-${width}-${i}.png`});
   const screen=await sharp(png).removeAlpha().raw().toBuffer();
   const left=Math.floor(rect.x),top=Math.floor(rect.y),right=Math.ceil(rect.x+rect.width),bottom=Math.ceil(rect.y+rect.height);
   const pixels=[];
   for(let y=top;y<bottom;y++)for(let x=left;x<right;x++){
    const sx=(x+.5-rect.x)/rect.width*sw,sy=(y+.5-rect.y)/rect.height*sh;
    const rx=3/rect.width*sw,ry=3/rect.height*sh;
    // Compare only the opaque interior: transparent edges naturally reveal the changing road.
    if([alphaAt(sx,sy),alphaAt(sx-rx,sy),alphaAt(sx+rx,sy),alphaAt(sx,sy-ry),alphaAt(sx,sy+ry)].some(a=>a<252))continue;
    if(x>=0&&x<width&&y>=0&&y<height){const at=(y*width+x)*3;pixels.push(screen[at],screen[at+1],screen[at+2]);}
   }
   if(!reference)reference=pixels;
   let maximumDifference=0,changedChannels=0;
   if(pixels.length===reference.length)for(let j=0;j<pixels.length;j++){const diff=Math.abs(pixels[j]-reference[j]);maximumDifference=Math.max(maximumDifference,diff);if(diff)changedChannels++;}
   else maximumDifference=255;
   states.push({progress:p,rect,comparedPixels:pixels.length/3,maximumDifference,changedChannels});
   if(i===0||i===stops.length-1){const url=await page.locator('.drive-canvas').evaluate(c=>c.toDataURL());const data=Buffer.from(url.split(',')[1],'base64');fs.writeFileSync(`output/playwright/drive-sharp-canvas-${width}-${i===0?'first':'return'}.png`,data);if(i===0)firstCanvas=data;else lastCanvas=data;}
  }
  const start=states[0].rect;
  const positionFixed=states.every(s=>['x','y','width','height'].every(k=>Math.abs(s.rect[k]-start[k])<.01));
  const duringScroll=await page.evaluate(async()=>{
   const root=document.querySelector('.drive-scroll'),car=root.querySelector('.drive-car'),stage=root.querySelector('.drive-stage');
   const start=scrollY+root.getBoundingClientRect().top,range=root.offsetHeight-stage.offsetHeight,first=car.getBoundingClientRect();
   scrollTo({top:Math.ceil(start+range*.75),behavior:'smooth'});
   let samples=0,maximumPositionChange=0,transitions=0;const began=performance.now();
   while(performance.now()-began<900){await new Promise(requestAnimationFrame);const r=car.getBoundingClientRect();samples++;for(const k of ['x','y','width','height'])maximumPositionChange=Math.max(maximumPositionChange,Math.abs(r[k]-first[k]));if(root.driveAlignment?.transitioning)transitions++;}
   return {samples,maximumPositionChange,transitions};
  });
  const a=await sharp(firstCanvas).raw().toBuffer(),b=await sharp(lastCanvas).raw().toBuffer();
  let canvasDiff=0,canvasChanged=0;for(let i=0;i<a.length;i++){const diff=Math.abs(a[i]-b[i]);canvasDiff=Math.max(canvasDiff,diff);if(diff)canvasChanged++;}
  // The tool's interior alpha is 252–253; up to three RGB levels can reflect the road behind it.
  results.push({width,height,positionFixed,duringScroll,pixelsFixed:states.every(s=>s.maximumDifference<=3&&s.comparedPixels>1000),canvasMaximumDifference:canvasDiff,canvasChangedChannels:canvasChanged,states});
  await page.close();
 }
 await browser.close();
 const pass=results.every(r=>r.positionFixed&&r.pixelsFixed&&r.duringScroll.maximumPositionChange<.01&&r.duringScroll.samples>=10);
 fs.writeFileSync('output/playwright/drive-sharp-stability.json',JSON.stringify({pass,method:'Real viewport screenshot RGB comparison inside the opaque car silhouette across all six road plates and reverse scrolling; DOM geometry measured independently of the canvas debug state.',results},null,2));
 console.log(JSON.stringify({pass,results:results.map(({states,...r})=>r)},null,2));
 if(!pass)process.exitCode=1;
}
main().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
