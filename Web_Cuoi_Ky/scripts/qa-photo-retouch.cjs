const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = path.resolve(__dirname, '..');
async function main() {
  const browser = await chromium.launch({executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true});
  const results = [];
  try {
    for (const [device, width, height] of [['desktop',1440,900], ['mobile',390,844]]) {
      for (const file of ['index','gallery','experience','films']) {
        const page = await browser.newPage({viewport: {width,height}, reducedMotion: 'reduce'});
        const errors = [], failed = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('response', r => {if(r.status() >= 400) failed.push(r.url());});
        await page.goto(`http://127.0.0.1:4173/${file}.html`, {waitUntil:'networkidle'});
        await page.evaluate(async () => {
          document.documentElement.style.scrollBehavior='auto';
          await Promise.all([...document.images].map(i => {i.loading='eager'; return i.decode().catch(()=>{});}));
        });
        const state = await page.evaluate(() => ({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)}));
        await page.screenshot({path:path.join(root,`output/playwright/retouch-${file}-${device}.png`),fullPage:file==='gallery'});
        const extra = {};
        if (file === 'gallery') {
          await page.locator('.ed-gallery-open').nth(3).click();
          await page.locator('.ed-lightbox img').evaluate(i=>i.decode());
          extra.dialog = await page.locator('.ed-lightbox').evaluate(d=>d.open);
          await page.screenshot({path:path.join(root,`output/playwright/retouch-gallery-modal-${device}.png`)});
          await page.keyboard.press('ArrowRight');
          await page.keyboard.press('Escape');
          extra.closed = await page.locator('.ed-lightbox').evaluate(d=>!d.open);
        }
        if (file === 'index') {
          extra.angles = [];
          for (const name of ['front','hero','rear']) {
            await page.locator(`[data-angle="${name}"]`).click();
            await page.locator('.collection-car').evaluate(i=>i.decode());
            extra.angles.push(await page.locator('.collection-car').evaluate(i=>({src:i.getAttribute('src'),width:i.naturalWidth,complete:i.complete})));
          }
        }
        results.push({file,device,...state,...extra,errors,failed});
        await page.close();
      }
    }
    const pass = results.every(r=>!r.overflow&&!r.broken.length&&!r.errors.length&&!r.failed.length&&(r.file!=='gallery'||r.dialog&&r.closed));
    fs.writeFileSync(path.join(root,'output/playwright/retouch-results.json'),JSON.stringify({pass,results},null,2));
    console.log(JSON.stringify({pass,checks:results.length,results},null,2));
    if(!pass)process.exitCode=1;
  } finally {await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
