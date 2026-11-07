const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const out=path.resolve('output/playwright/navigation');fs.mkdirSync(out,{recursive:true});let browser;
const pages=['index.html','about.html','products.html','product.html?car=bmw','explore.html','gallery.html','news.html','article.html','contact.html','cart.html','account.html','sources.html','policies.html'];
const widths=[1440,1101,1024,768,761,760,390,320];
(async()=>{browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});const rows=[];
for(const width of widths){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const p=await context.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 let reference;
 for(const url of pages){
  await p.goto('http://127.0.0.1:4173/'+url,{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>document.querySelector('.site-header')?.dataset.navigationReady==='true');await p.evaluate(()=>document.fonts.ready);
  const state=await p.evaluate(()=>{
   const h=document.querySelector('.site-header'),b=h.querySelector('.brand-logo'),desktop=h.querySelector('.desktop-nav'),bottom=document.querySelector('.bottom-nav'),toggle=h.querySelector('.menu-toggle');
   const style=e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return {display:c.display,font:c.fontFamily,size:c.fontSize,line:c.lineHeight,height:r.height,width:r.width,padding:c.padding,gap:c.gap}};
   return {header:style(h),logo:style(b),desktop:style(desktop),link:style(desktop.querySelector('a')),cart:style(h.querySelector('.header-cta')),bottom:style(bottom),toggle:style(toggle),bottomCount:document.querySelectorAll('.bottom-nav').length,legacy:!!document.querySelector('.z-header'),links:[...desktop.querySelectorAll('a')].map(a=>[a.getAttribute('href'),a.textContent]),bottomLinks:[...bottom.querySelectorAll('a')].map(a=>[a.getAttribute('href'),a.textContent]),activeBottom:bottom.querySelector('[aria-current]')?.getAttribute('href'),overflow:document.documentElement.scrollWidth>innerWidth,glass:getComputedStyle(h,'::before').backdropFilter,headerRight:h.getBoundingClientRect().right,children:[...h.children].filter(e=>getComputedStyle(e).display!=='none'&&getComputedStyle(e).position!=='absolute').map(e=>({right:e.getBoundingClientRect().right,left:e.getBoundingClientRect().left}))};
  });
  assert.equal(state.legacy,false,url);assert.equal(state.bottomCount,1,url);assert.equal(state.overflow,false,url+' overflow '+width);assert.ok(state.children.every(c=>c.right<=width&&c.left>=0),url+' header clipping '+width+JSON.stringify(state.children));
  const shared={header:state.header,logo:state.logo,desktop:state.desktop,link:state.link,cart:state.cart,bottom:state.bottom,toggle:state.toggle,links:state.links,bottomLinks:state.bottomLinks};
  if(reference)assert.deepEqual(shared,reference,url+' differs from home at '+width);else reference=shared;
  if(url!=='index.html')assert.match(state.glass,/blur\(/,url+' glass');
  if(width<=760){
   assert.equal(state.bottom.display,'grid');assert.equal(state.toggle.display,'flex');assert.equal(state.desktop.display,'none');
   await p.locator('.menu-toggle').click();assert.equal(await p.locator('.menu-toggle').getAttribute('aria-expanded'),'true');assert.equal(await p.locator('.mobile-nav').isVisible(),true);
   assert.equal(await p.locator('.mobile-nav a[href="account.html"]').isVisible(),true);assert.equal(await p.locator('.mobile-nav a[href="cart.html"]').isVisible(),true);
   await p.keyboard.press('Escape');assert.equal(await p.locator('.mobile-nav').isVisible(),false);assert.equal(await p.locator('.menu-toggle').evaluate(e=>e===document.activeElement),true);
   if(url.startsWith('product.html'))assert.equal(state.activeBottom,'products.html');if(['explore.html','news.html','article.html'].includes(url))assert.equal(state.activeBottom,'explore.html');
  }else{
   assert.equal(state.bottom.display,'none');assert.equal(state.toggle.display,'none');assert.equal(state.desktop.display,'flex');
   const desktop=p.getByRole('navigation',{name:'Điều hướng chính',exact:true});
   assert.equal(await desktop.getByRole('link',{name:'Tin tức',exact:true}).isVisible(),true);
   assert.equal(await desktop.getByRole('link',{name:'Liên hệ',exact:true}).isVisible(),true);
   if(['news.html','article.html','contact.html'].includes(url)){
    assert.equal(await desktop.locator('[aria-current]').getAttribute('href'),url==='article.html'?'news.html':url);
   }
  }
  if(url==='index.html'){
   const trigger=p.getByRole('button',{name:'Tìm kiếm',exact:true});
   await trigger.focus();
   await p.keyboard.press('Enter');
   const dialog=p.getByRole('dialog',{name:'Tìm kiếm',exact:true});
   const search=dialog.getByRole('searchbox',{name:'Tìm kiếm',exact:true});
   assert.equal(await search.evaluate(input=>input===document.activeElement),true);
   for(const [query,href] of [['lien he','contact.html'],['porsche 992','product.html?car=porsche'],['mot mau son','article.html?id=dau-an-mau-sac']]){
    await search.fill(query);
    assert.equal(await dialog.locator(`a[href="${href}"]`).isVisible(),true);
   }
   await search.fill('zzzz');
   assert.match(await dialog.getByRole('status').textContent(),/Không tìm thấy kết quả/);
   await p.keyboard.press('Escape');
   assert.equal(await dialog.isVisible(),false);
   assert.equal(await trigger.evaluate(button=>button===document.activeElement),true);
  }
  if([1440,390].includes(width)&&['index.html','products.html','about.html','explore.html'].includes(url))await p.screenshot({path:path.join(out,url.replace('.html','')+'-'+width+'.png')});
  rows.push({url,width,...state});
 }
 assert.deepEqual(errors,[],'browser errors '+width);await context.close();console.log(`PASS identical navigation across ${pages.length} pages at`,width);
}
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({pass:true,pages:pages.length,widths,rows},null,2));
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>browser?.close());
