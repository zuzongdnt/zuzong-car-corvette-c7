const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const crypto=require('node:crypto');
const sharp=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
let browser;

async function main(){
 const source=fs.readFileSync('sections.html','utf8').match(/data-drive-src="([^"]+)"/)[1];
 const manifest=JSON.parse(fs.readFileSync(source+'/manifest.json','utf8'));
 const alignment=JSON.parse(fs.readFileSync(source+'/alignment.json','utf8'));
 const playback=manifest.playbackFrames;
 const assets=[];
 for(let i=0;i<manifest.frameCount;i++)for(const folder of ['', 'mobile/']){
  const file=`${source}/${folder}frame-${String(i).padStart(3,'0')}.webp`,m=await sharp(file).metadata();
  assets.push({file,width:m.width,height:m.height,correct:m.width*9===m.height*16&&m.width===(folder?manifest.mobile[0]:manifest.desktop[0])});
 }
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 fs.mkdirSync('output/playwright',{recursive:true});
 const results=[];
 for(const [width,height] of [[1920,1080],[1440,900],[820,871],[390,844],[360,780],[320,568]]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[],failed=[],requested=new Set();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400&&r.url().startsWith('http://localhost:4173'))failed.push(r.url());});
  page.on('request',r=>{if(!r.url().includes('/'+source+'/'))return;const match=r.url().match(/frame-(\d+)\.webp/);if(match)requested.add(Number(match[1]));});
  await page.goto('http://localhost:4173/?v=title-behind-car-20261009',{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('.campaign-video').readyState>=2);
  await page.locator('.campaign-video-toggle').click();
  await page.evaluate(()=>document.querySelector('.campaign-video').currentTime=28.78);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(200);
  const intro=await page.evaluate(()=>{
   const v=document.querySelector('.campaign-video'),b=document.querySelector('.campaign-cta'),s=getComputedStyle(b),rect=v.getBoundingClientRect();
   return {videoWidth:v.videoWidth,videoHeight:v.videoHeight,fullBleed:rect.top===0&&rect.width===innerWidth&&rect.height>=innerHeight-80,ctaBackground:s.backgroundColor,ctaBlur:s.backdropFilter,overflow:document.documentElement.scrollWidth>innerWidth};
  });
  const phases=[];
  // Includes every chosen photo and each halfway stop, then reverses to the first photo.
  const stops=Array.from({length:playback.length*2-1},(_,i)=>i/(2*(playback.length-1)));
  for(const progress of [...stops,0]){
   await page.evaluate(p=>{
    const root=document.querySelector('.drive-scroll'),stage=root.querySelector('.drive-stage');
    const start=scrollY+root.getBoundingClientRect().top,range=root.offsetHeight-stage.offsetHeight;
    scrollTo({top:p===1?Math.floor(start+range):Math.ceil(start+p*range),behavior:'instant'});
   },progress);
   await page.waitForFunction(p=>{
    const root=document.querySelector('.drive-scroll');
    return root.classList.contains('is-ready')&&root.dataset.driveSettled==='true'&&Math.abs(Number(root.dataset.driveProgress)-p)<.003;
   },progress,{timeout:10000}).catch(async error=>{
    console.error(JSON.stringify({width,height,progress,state:await page.evaluate(()=>{const r=document.querySelector('.drive-scroll'),s=r.querySelector('.drive-stage');return {ready:r.classList.contains('is-ready'),data:{...r.dataset},rootTop:r.getBoundingClientRect().top,rootHeight:r.offsetHeight,stageHeight:s.offsetHeight,scrollY};})}));
    throw error;
   });
   const state=await page.evaluate(()=>{
    const root=document.querySelector('.drive-scroll'),stage=root.querySelector('.drive-stage');
    const cards=[...root.querySelectorAll('.drive-specs>div')],footer=root.querySelector('.drive-footer').getBoundingClientRect(),nav=document.querySelector('.bottom-nav');
    const titleElement=root.querySelector('.drive-title'),mediaElement=root.querySelector('.drive-media');
    const title=titleElement.getBoundingClientRect(),media=mediaElement.getBoundingClientRect();
    const titleLayerCorrect=root.dataset.driveTitleLayer==='behind-car'
      ? titleElement.parentElement===mediaElement&&Number(getComputedStyle(titleElement).zIndex)<Number(getComputedStyle(root.querySelector('.drive-car')).zIndex)
        &&title.bottom>media.top+root.driveAlignment.nextPlacement.carTop&&title.top<media.top+root.driveAlignment.baseline
      : title.bottom<=media.top+root.driveAlignment.nextPlacement.carTop+2;
    return {frame:Number(root.dataset.driveFrame),sourceFrame:Number(root.dataset.driveSourceFrame),sourceNumber:Number(root.dataset.driveSourceNumber),progress:Number(root.dataset.driveProgress),settled:root.dataset.driveSettled==='true',geometry:root.driveAlignment,stageTop:stage.getBoundingClientRect().top,overflow:document.documentElement.scrollWidth>innerWidth,titleLayerCorrect,carFits:media.top+root.driveAlignment.baseline<=root.querySelector('.drive-specs').getBoundingClientRect().top-8,cards:cards.map(c=>({opacity:Number(getComputedStyle(c).opacity),blur:getComputedStyle(c).backdropFilter,clipped:c.scrollWidth>c.clientWidth+2})),footerFits:footer.bottom<=(innerWidth<=760?nav.getBoundingClientRect().top:innerHeight)+2};
   });
   state.canvasHash=crypto.createHash('sha256').update(await page.locator('.drive-canvas').evaluate(c=>c.toDataURL())).digest('hex');
   phases.push(state);
   if([0,.4,.6,1].includes(progress))await page.screenshot({path:`output/playwright/drive-sharp-${width}-${progress}.png`});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.evaluate(()=>scrollTo({top:document.querySelector('.drive-scroll').offsetTop,behavior:'instant'}));
  await page.waitForTimeout(200);
  const reduced=await page.evaluate(()=>{
   const root=document.querySelector('.drive-scroll');
   return {height:root.offsetHeight,stageHeight:root.querySelector('.drive-stage').offsetHeight,cards:[...root.querySelectorAll('.drive-specs>div')].every(c=>getComputedStyle(c).opacity==='1'),overflow:document.documentElement.scrollWidth>innerWidth};
  });
  results.push({width,height,errors,failed,requested:[...requested].sort((a,b)=>a-b),intro,phases,reduced});
  await page.close();
 }
 await browser.close();
 const pass=assets.every(a=>a.correct)
  &&alignment.frames.map(f=>f.frame).join(',')===playback.join(',')
  &&results.every(r=>!r.errors.length&&!r.failed.length
   &&r.requested.join(',')===playback.join(',')
   &&!r.intro.overflow&&r.intro.fullBleed&&r.intro.videoHeight===552
   &&r.intro.ctaBlur==='none'&&r.intro.ctaBackground==='rgb(207, 37, 45)'
   &&r.phases.every(p=>!p.overflow&&p.footerFits&&p.titleLayerCorrect&&p.carFits&&Math.abs(p.stageTop)<2
    &&p.cards.every(c=>!c.clipped&&c.blur.includes('blur(18px)'))
    &&p.settled&&!p.geometry.transitioning&&p.geometry.blend===0
    &&p.sourceFrame===playback[p.frame]
    &&p.sourceNumber===manifest.selectedSourceNumbers[p.frame]
    &&Math.abs(p.geometry.baseline-r.phases[0].geometry.baseline)<.1
    &&Math.abs(p.geometry.carWidth-r.phases[0].geometry.carWidth)<.1)
   &&r.phases[0].frame===0&&r.phases.at(-2).frame===playback.length-1&&r.phases.at(-1).frame===0
   &&r.phases[0].canvasHash===r.phases.at(-1).canvasHash
   &&r.reduced.cards&&!r.reduced.overflow&&r.reduced.height===r.reduced.stageHeight);
 fs.writeFileSync('output/playwright/drive-scroll-qa.json',JSON.stringify({pass,source,assets,playback,selectedSourceNumbers:manifest.selectedSourceNumbers,results},null,2));
 console.log(JSON.stringify({pass,source,assets16x9:assets.every(a=>a.correct),selectedSourceNumbers:manifest.selectedSourceNumbers,
  results:results.map(r=>({width:r.width,height:r.height,errors:r.errors,failed:r.failed,requested:r.requested,
   frames:r.phases.map(p=>p.sourceNumber),settled:r.phases.every(p=>p.settled&&!p.geometry.transitioning),
   sameCanvasOnReturn:r.phases[0].canvasHash===r.phases.at(-1).canvasHash,
   fits:r.phases.every(p=>p.footerFits&&p.carFits&&p.titleLayerCorrect&&!p.overflow),reduced:r.reduced.cards}))},null,2));
 if(!pass)process.exitCode=1;
}
main().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
