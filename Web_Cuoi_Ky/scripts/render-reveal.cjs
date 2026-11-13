const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const bundle='C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const {chromium}=require(path.join(bundle,'playwright'));
const sharp=require(path.join(bundle,'sharp'));
const root=path.resolve(__dirname,'..');
const output=path.join(root,'assets/reveal');
const proofDir=path.join(root,'output/playwright');
const mode=process.argv.includes('--prototype')?'prototype':'full';
const mobileOnly=process.argv.includes('--mobile-only');
const proofOnly=process.argv.includes('--proof-only');
const count=144;
const ids=mode==='prototype'?[0,18,36,54,72,90,108,125,143]:Array.from({length:count},(_,i)=>i);
async function main(){
 fs.mkdirSync(output,{recursive:true});fs.mkdirSync(proofDir,{recursive:true});
 const mobileDir=path.join(output,'mobile');fs.mkdirSync(mobileDir,{recursive:true});
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--allow-file-access-from-files','--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 try{
 const page=await browser.newPage({viewport:{width:1600,height:720},deviceScaleFactor:1});
 page.on('pageerror',e=>console.error(e));
 await page.goto(pathToFileURL(path.join(__dirname,'render-reveal.html')).href);await page.evaluate(()=>window.ready);
 const info=await page.evaluate(()=>window.sequenceInfo);
 const mobilePage=await browser.newPage({viewport:{width:1600,height:1920},deviceScaleFactor:1});
 mobilePage.on('pageerror',e=>console.error(e));
 await mobilePage.goto(pathToFileURL(path.join(__dirname,'render-reveal.html')).href+'?mobile=1');await mobilePage.evaluate(()=>window.ready);
 const mobileInfo=await mobilePage.evaluate(()=>window.sequenceInfo);
 const existing=mobileOnly?JSON.parse(fs.readFileSync(path.join(output,'manifest.json'),'utf8')):null;
 // Find the physical point where the whole mesh exits the camera, then give
 // the movement 88% of the timeline and reserve the last 12% for the vehicle.
 const rawFrame=async p=>Buffer.from((await page.evaluate(p=>window.renderFrame(p,true),p)).split(',')[1],'base64');
 let lo=0.5,hi=1;
 if(mobileOnly)hi=existing.meshExitParameter-.002;
 else{
  const finalRaw=await sharp(await rawFrame(1)).ensureAlpha().raw().toBuffer();
  for(let i=0;i<12;i++){
   const mid=(lo+hi)/2,current=await sharp(await rawFrame(mid)).ensureAlpha().raw().toBuffer();
   let diff=0;for(let k=0;k<current.length;k++)if(Math.abs(current[k]-finalRaw[k])>1){diff++;if(diff>16)break}
   if(diff>16)lo=mid;else hi=mid;
  }
 }
 await page.evaluate(p=>window.motionEnd=p,hi+.002);
 await mobilePage.evaluate(p=>window.motionEnd=p,hi+.002);
 const samples=[],mobileSamples=[];let totalBytes=mobileOnly?existing.bytes:0,mobileBytes=0;
 for(const id of ids){
  const file=`frame-${String(id).padStart(3,'0')}.webp`;
  const progress=id/(count-1);
  const png=mobileOnly?null:await page.evaluate(p=>window.renderFrame(p),progress);
  const buffer=mobileOnly?null:Buffer.from(png.split(',')[1],'base64');
  if(!mobileOnly){const encoded=await sharp(buffer).webp({quality:82,alphaQuality:96,effort:4}).toBuffer();fs.writeFileSync(path.join(output,file),encoded);totalBytes+=encoded.length}
  // This is a second render with top padding, not a resize of the cropped
  // desktop image: the cloth above desktop's viewport must remain available.
  let mobile;
  if(proofOnly)mobile=fs.readFileSync(path.join(mobileDir,file));
  else{
   const mobilePNG=await mobilePage.evaluate(p=>window.renderFrame(p),progress);
   const mobileBuffer=Buffer.from(mobilePNG.split(',')[1],'base64');
   mobile=await sharp(mobileBuffer).resize(800,960).webp({quality:80,alphaQuality:95,effort:4}).toBuffer();
   fs.writeFileSync(path.join(mobileDir,file),mobile);
  }
  mobileBytes+=mobile.length;
  if([0,18,36,54,72,90,108,125,143].includes(id)){samples.push({id,buffer:buffer||fs.readFileSync(path.join(output,file))});mobileSamples.push({id,buffer:mobile})}
  if(id%24===0||id===143)console.log(`Rendered ${id+1}/${count}; ${(totalBytes/1024/1024).toFixed(2)} MB`);
 }
 const tileW=512,thumbH=230,tileH=260,background={r:9,g:10,b:13,alpha:1};
 const tiles=await Promise.all(samples.map(async({id,buffer},i)=>{
  const thumb=await sharp(buffer).resize(tileW,thumbH).flatten({background}).toBuffer();
  const label=Buffer.from(`<svg width="512" height="30"><rect width="512" height="30" fill="#121419"/><text x="15" y="20" fill="#e7e8ea" font-family="Arial" font-size="12">FRAME ${String(id+1).padStart(3,'0')} / 144  ·  ${Math.round(id/143*100)}%</text></svg>`);
  return [{input:thumb,left:(i%3)*tileW,top:Math.floor(i/3)*tileH},{input:label,left:(i%3)*tileW,top:Math.floor(i/3)*tileH+thumbH}];
 }));
 await sharp({create:{width:tileW*3,height:tileH*3,channels:3,background}}).composite(tiles.flat()).jpeg({quality:92}).toFile(path.join(proofDir,'reveal-sequence-proof.jpg'));
 // Crop the padded mobile source through the actual 390x844 CSS viewport.
 const phoneTiles=await Promise.all(mobileSamples.map(async({id,buffer},i)=>{
  const scene=await sharp(buffer).resize(562,674).toBuffer();
  const clipped=await sharp(scene).extract({left:142,top:0,width:390,height:674}).toBuffer();
  const phoneFull=await sharp({create:{width:390,height:844,channels:4,background}}).composite([{input:clipped,left:0,top:1}]).png().toBuffer();
  const phone=await sharp(phoneFull).resize(234,506).toBuffer();
  const label=Buffer.from(`<svg width="234" height="30"><rect width="234" height="30" fill="#121419"/><text x="12" y="20" fill="#e7e8ea" font-family="Arial" font-size="12">${String(id+1).padStart(3,'0')} / 144 - ${Math.round(id/143*100)}%</text></svg>`);
  return[{input:phone,left:(i%3)*234,top:Math.floor(i/3)*536},{input:label,left:(i%3)*234,top:Math.floor(i/3)*536+506}];
 }));
 await sharp({create:{width:702,height:1608,channels:3,background}}).composite(phoneTiles.flat()).jpeg({quality:92}).toFile(path.join(proofDir,'reveal-sequence-mobile-proof.jpg'));
 if(mode==='full'){
  const frames=ids.map(id=>`assets/reveal/frame-${String(id).padStart(3,'0')}.webp`);
  const mobileFrames=ids.map(id=>`assets/reveal/mobile/frame-${String(id).padStart(3,'0')}.webp`);
  const mobileCarBounds=Object.fromEntries(Object.entries(mobileInfo.carBounds).map(([key,value])=>[key,value/2]));
  fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify({...info,format:'webp',alpha:true,frameCount:count,bytes:totalBytes,frames,poster:frames[0],final:frames[count-1],fps:24,duration:6,motionEndsAt:.88,motionEndsAtScope:'visible CSS viewport; cloth may remain outside it in padded mobile margins',meshExitParameter:hi+.002,mobile:{width:800,height:960,sourceWidth:1600,sourceHeight:1920,leftPadding:160,topPadding:600,carBounds:mobileCarBounds,frames:mobileFrames,bytes:mobileBytes,poster:mobileFrames[0],final:mobileFrames[count-1]}},null,2));
 }
 console.log(JSON.stringify({mode,...info,totalBytes,mobileBytes,meshExitParameter:hi+.002,proof:'output/playwright/reveal-sequence-proof.jpg'}));
 }finally{await browser.close()}
}
main().catch(e=>{console.error(e);process.exitCode=1});
