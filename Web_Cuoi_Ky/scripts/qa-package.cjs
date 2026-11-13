const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('url');const path=require('path');
async function main(){
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve(__dirname,'../dist/index.html')).href,{waitUntil:'load'});await page.waitForTimeout(1800);
 await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo({top:(document.querySelector('.unveil').offsetHeight-document.querySelector('.hero-stage').offsetHeight)*.93,behavior:'instant'});});await page.waitForTimeout(1000);
 const state=await page.evaluate(()=>({ready:window.revealSequence.ready,frame:window.revealSequence.drawnFrame,quality:window.revealSequence.drawnQuality,overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}));
 await page.locator('.footer-gallery-button').scrollIntoViewIfNeeded();await page.locator('.footer-gallery-button').click();state.gallery=await page.locator('#gallery-dialog').evaluate(el=>el.open);state.photos=await page.locator('.gallery-thumb').count();await page.keyboard.press('Escape');
 await browser.close();console.log(JSON.stringify({errors,...state}));if(errors.length||!state.ready||state.frame<142||state.overflow||state.broken.length||!state.gallery||state.photos!==18)process.exitCode=1;
}main().catch(e=>{console.error(e);process.exitCode=1});
