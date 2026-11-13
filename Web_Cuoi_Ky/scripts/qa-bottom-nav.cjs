const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
let browser;
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],routes=[],sizes=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:4173/',{waitUntil:'networkidle'});
 await page.locator('.bottom-nav').screenshot({path:'output/playwright/bottom-nav-reference-match.png'});
 await page.screenshot({path:'output/playwright/bottom-nav-home-390.png'});
 for(const [label,route] of [['Hành trình','experience.html'],['Thước phim','films.html'],['Bộ sưu tập','gallery.html'],['Trang chủ','index.html']]){
  await page.locator('.bottom-nav').getByRole('link',{name:label,exact:true}).click();await page.waitForLoadState('networkidle');
  routes.push({route,url:page.url(),active:await page.locator('.bottom-nav [aria-current="page"]').innerText()});
 }
 for(const [width,height] of [[320,568],[390,844],[760,700],[967,900],[1440,900]]){
  await page.setViewportSize({width,height});await page.waitForTimeout(200);
  sizes.push(await page.evaluate(()=>{const nav=document.querySelector('.bottom-nav'),r=nav.getBoundingClientRect();return {width:innerWidth,visible:getComputedStyle(nav).display!=='none',bottom:r.bottom,height:r.height,overflow:document.documentElement.scrollWidth>innerWidth,links:[...nav.querySelectorAll('a')].map(el=>({width:el.clientWidth,height:el.clientHeight})),menu:getComputedStyle(document.querySelector('.menu-toggle')).display};}));
  if(width<=760){
   await page.evaluate(()=>{const h=document.querySelector('.unveil'),s=document.querySelector('.hero-stage');scrollTo({top:h.offsetTop+(h.offsetHeight-s.offsetHeight)*.9,behavior:'instant'});});await page.waitForTimeout(900);
   const fit=await page.evaluate(()=>{const nav=document.querySelector('.bottom-nav').getBoundingClientRect(),footer=document.querySelector('.hero-footer').getBoundingClientRect(),caption=document.querySelector('.studio-caption').getBoundingClientRect(),img=document.querySelector('.hero-vehicle').getBoundingClientRect();return {footerVisible:footer.bottom<=nav.top+1,captionClear:caption.bottom<=footer.top+1,imageClear:img.bottom<=caption.top+1}});
   Object.assign(sizes.at(-1),fit);
   await page.screenshot({path:`output/playwright/bottom-nav-studio-${width}.png`});
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(300);
  }
 }
 await browser.close();
 const pass=!errors.length&&routes.every(r=>r.url.endsWith(r.route))&&sizes.every(s=>!s.overflow&&(s.width<=760?s.visible&&s.links.every(l=>l.height>=44)&&s.menu==='none'&&s.footerVisible&&s.captionClear&&s.imageClear:!s.visible));
 const result={pass,errors,routes,sizes};fs.writeFileSync('output/playwright/bottom-nav-qa.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));if(!pass)process.exitCode=1;
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
