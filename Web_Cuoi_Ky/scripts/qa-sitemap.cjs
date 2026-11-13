const {chromium}=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');let browser;
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().includes('favicon'))failed.push({status:r.status(),url:r.url()});});
 const goto=async url=>{await page.goto('http://localhost:4173/'+url,{waitUntil:'domcontentloaded'});await page.waitForTimeout(150);};
 await goto('products.html?car=bmw');
 await page.waitForFunction(()=>document.querySelector('[data-studio-mount]')?.dataset.ready==='true',null,{timeout:120000});
 assert.equal(await page.locator('video').count(),0);
 await page.locator('[data-color=racing]').click();await page.locator('[data-part=calipers]').click();await page.locator('[data-color=yellow]').click();await page.locator('[data-part=rims]').click();await page.locator('[data-color=bronze]').click();
 await page.locator('[data-save]').click();assert.match(await page.locator('[data-save-status]').innerText(),/Đã lưu/);
 await page.locator('model-viewer').scrollIntoViewIfNeeded();
 await page.waitForTimeout(400);
 const orbitBefore=await page.locator('model-viewer').evaluate(v=>v.getCameraOrbit().theta);const rect=await page.locator('model-viewer').boundingBox();
 await page.mouse.move(rect.x+rect.width*.4,rect.y+rect.height*.5);await page.mouse.down();await page.mouse.move(rect.x+rect.width*.75,rect.y+rect.height*.5,{steps:20});await page.mouse.up();await page.waitForTimeout(500);
 const orbitAfter=await page.locator('model-viewer').evaluate(v=>v.getCameraOrbit().theta);assert.ok(Math.abs(orbitAfter-orbitBefore)>.1,'Drag should rotate the model');
 const zoomBefore=await page.locator('model-viewer').evaluate(v=>v.getCameraOrbit().radius);await page.mouse.wheel(0,-220);await page.waitForTimeout(350);const zoomAfter=await page.locator('model-viewer').evaluate(v=>v.getCameraOrbit().radius);assert.ok(zoomAfter<zoomBefore,'Wheel should zoom');
 await page.locator('[data-camera=hero]').click();await page.locator('[data-order]').click();await page.waitForURL('**/cart.html');
 assert.equal(await page.locator('.z-cart-item').count(),1);assert.match(await page.locator('.z-cart-item').innerText(),/Đồng Bronze/);
 await page.locator('.z-cart-actions a[href*="edit="]').click();await page.waitForURL('**/products.html?**');await page.waitForFunction(()=>document.querySelector('[data-studio-mount]')?.dataset.ready==='true',null,{timeout:120000});
 await page.locator('[data-part=body]').click();await page.locator('[data-color=velocity]').click();await page.locator('[data-order]').click();await page.waitForURL('**/cart.html');assert.equal(await page.locator('.z-cart-item').count(),1);assert.match(await page.locator('.z-cart-item').innerText(),/Xanh Velocity/);
 await page.locator('[data-next-step]').click();await page.locator('[name=name]').fill('Zuzong Test');await page.locator('[name=phone]').fill('0901234567');await page.locator('[name=email]').fill('zuzong@example.com');await page.locator('[name=note]').fill('Thông tin thử nghiệm đồ án');await page.locator('[name=consent]').check();await page.locator('[data-checkout] button[type=submit]').click();assert.match(await page.locator('[data-cart-body]').innerText(),/Đã tạo yêu cầu mẫu/);await page.screenshot({path:path.join(root,'output/playwright/checkout-success.png')});
 await goto('account.html');assert.equal(await page.locator('.z-cart-item').count(),1);assert.match(await page.locator('#requests+details').innerText(),/ZZ-/);
 await page.locator('[data-auth=register]').click();await page.locator('[name=name]').fill('Zuzong');await page.locator('[name=email]').fill('zuzong@example.com');await page.locator('[name=password]').fill('sample123');await page.locator('[data-show-password]').click();assert.equal(await page.locator('[name=password]').getAttribute('type'),'text');await page.locator('[data-auth-form] input[type=checkbox]').check();await page.locator('[data-auth-form] button[type=submit]').click();assert.match(await page.locator('.z-profile-head').innerText(),/Chào Zuzong/);assert.ok(!(await page.evaluate(()=>JSON.stringify(localStorage))).includes('sample123'));
 await page.locator('[data-logout]').click();await page.locator('[data-auth=reset]').click();await page.locator('[name=email]').fill('zuzong@example.com');await page.locator('[data-auth-form] button[type=submit]').click();assert.match(await page.locator('[data-auth-form] .z-status').innerText(),/Chưa gửi email/);
 await goto('gallery.html');assert.equal(await page.locator('[data-image]').count(),15);await page.locator('[data-filter=bmw]').click();assert.equal(await page.locator('[data-image]').count(),3);await page.locator('[data-image="0"]').click();assert.equal(await page.locator('dialog').evaluate(d=>d.open),true);await page.keyboard.press('ArrowRight');assert.match(await page.locator('[data-caption]').innerText(),/2\/3/);await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').evaluate(d=>d.open),false);
 const pages=['about.html','contact.html','explore.html','gallery.html','news.html','article.html','cart.html','account.html','sources.html','policies.html'];
 for(const url of pages){await goto(url);assert.equal(await page.locator('h1').count(),1,url);assert.ok(await page.locator('main').innerText(),url);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,url+' overflow');}
 await page.setViewportSize({width:390,height:844});await goto('products.html?car=bmw');await page.waitForFunction(()=>document.querySelector('[data-studio-mount]')?.dataset.ready==='true',null,{timeout:120000});
 await page.screenshot({path:path.join(root,'output/playwright/studio-mobile-top.png')});await page.locator('[data-studio-mount]').screenshot({path:path.join(root,'output/playwright/studio-mobile.png')});
 await page.locator('.z-menu').click();assert.equal(await page.locator('.z-menu').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('.z-menu').getAttribute('aria-expanded'),'false');
 for(const width of [360,390,768]){
  await page.setViewportSize({width,height:900});
  for(const url of ['products.html','contact.html','gallery.html','cart.html','account.html']){await goto(url);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${url} overflow at ${width}`);}
 }
 await page.setViewportSize({width:1440,height:1000});await goto('index.html#collection');await page.locator('[data-studio-mount]').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('[data-studio-mount]')?.dataset.ready==='true',null,{timeout:120000});await page.locator('#collection').screenshot({path:path.join(root,'output/playwright/studio-home.png')});
 assert.equal(await page.locator('.desktop-nav a[href="products.html"]').count(),1);assert.equal(await page.locator('.z-studio video').count(),0);
 assert.deepEqual(errors,[],'Page errors');assert.deepEqual(failed,[],'HTTP errors');
 fs.writeFileSync(path.join(root,'output/sitemap-qa.json'),JSON.stringify({pass:true,desktop:true,mobileWidths:[360,390,768],tested:['drag','zoom','independent colors','save','edit cart','guest checkout','register','show password','logout','reset state','gallery filter','gallery keyboard','sitemap navigation'],errors,failed},null,2));
 console.log('PASS sitemap, studio controls, save, edit cart, guest checkout, account and gallery. Responsive: 360,390,768,1440.');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();});
