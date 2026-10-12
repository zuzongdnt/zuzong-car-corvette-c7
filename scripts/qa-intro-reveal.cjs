const { chromium }=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path');
const out=path.resolve(__dirname,'../output/playwright');
const sizes=[['desktop',1440,900],['laptop',1366,768],['short-desktop',1024,640],['narrow',820,600],['tablet',768,1024],['breakpoint',760,700],['mobile',390,844],['phone',375,667],['small',320,568],['landscape',844,390],['small-landscape',740,360]];
async function main(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const results=[];
 for(const [name,width,height] of sizes){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
  const samples=[];
  for(const [label,progress] of [['intro',0],['covered',.36],['peel',.65],['open',.95],['rewind',0]]){
   await page.evaluate(p=>{const h=document.querySelector('.unveil'),s=document.querySelector('.hero-stage');scrollTo({top:(h.offsetHeight-s.offsetHeight)*p,behavior:'instant'})},progress);
   await page.waitForTimeout(800);
   const sample=await page.evaluate(label=>{
    const rect=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom}};
    const intro=label==='intro'||label==='rewind',parent=document.querySelector(intro?'.hero-copy':'.studio-caption');
    const parts=[...parent.children].filter(el=>getComputedStyle(el).display!=='none'&&getComputedStyle(el).opacity!=='0');
    const overlaps=[];for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++){
     const a=rect(parts[i]),b=rect(parts[j]);if(Math.min(a.right,b.right)-Math.max(a.x,b.x)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y)>1)overlaps.push([parts[i].className,parts[j].className]);
    }
    const stage=rect(document.querySelector('.hero-stage')),header=rect(document.querySelector('.site-header')),footer=rect(document.querySelector('.hero-footer'));
    const clipped=parts.filter(el=>{const r=rect(el);return r.x< -1||r.right>innerWidth+1||r.y<header.bottom-1||r.bottom>footer.y+1||el.scrollWidth>el.clientWidth+1}).map(el=>el.className);
    return {label,frame:window.revealSequence.drawnFrame,ready:window.revealSequence.ready,introOpacity:+getComputedStyle(document.querySelector('.hero-copy')).opacity,sceneOpacity:+getComputedStyle(document.querySelector('.studio-scene')).opacity,overlaps,clipped,overflow:document.documentElement.scrollWidth>innerWidth,chapter:document.querySelector('.studio-chapters [aria-current]').textContent,stage};
   },label);
   samples.push(sample);
   if(label!=='rewind')await page.screenshot({path:path.join(out,`intro-reveal-${name}-${label}.png`)});
  }
  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(200);
  const reduced=await page.evaluate(()=>({intro:getComputedStyle(document.querySelector('.hero-copy')).opacity,scene:getComputedStyle(document.querySelector('.studio-scene')).opacity,canvas:getComputedStyle(document.querySelector('.reveal-canvas')).display,car:getComputedStyle(document.querySelector('.hero-car')).display,overflow:document.documentElement.scrollWidth>innerWidth}));
  results.push({name,errors,samples,reduced});console.log(name,JSON.stringify(samples.filter(s=>s.clipped.length||s.overlaps.length||s.overflow)));
  await page.close();
 }
 await browser.close();
 const pass=results.every(r=>!r.errors.length&&r.samples.every(s=>!s.clipped.length&&!s.overlaps.length&&!s.overflow&&s.ready)&&(r.samples[0].introOpacity===1&&r.samples[0].sceneOpacity===0&&r.samples[1].frame===0&&r.samples[3].frame===9&&r.samples[4].introOpacity===1)&&r.reduced.canvas==='none'&&r.reduced.car!=='none'&&!r.reduced.overflow);
 fs.writeFileSync(path.join(out,'intro-reveal-results.json'),JSON.stringify({pass,results},null,2));console.log({pass});if(!pass)process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1});
