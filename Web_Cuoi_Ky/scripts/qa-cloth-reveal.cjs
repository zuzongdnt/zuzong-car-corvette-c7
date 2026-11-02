const { chromium } = require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'output/playwright/cloth-reveal');
fs.mkdirSync(out, { recursive: true });
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4173';

async function sample(page, progress, screenshot) {
  await page.evaluate(p => {
    const hero = document.querySelector('.unveil');
    const stage = document.querySelector('.hero-stage');
    scrollTo({ top: hero.getBoundingClientRect().top + scrollY + p * (hero.offsetHeight - stage.offsetHeight), behavior: 'instant' });
  }, progress);
  await page.waitForFunction(() => window.revealSequence.ready && window.revealSequence.drawnQuality === 'full' && Math.abs(window.revealSequence.drawnFrame - window.revealSequence.frameIndex) < .05);
  await page.waitForTimeout(800);
  if (screenshot) await page.screenshot({ path: path.join(out, screenshot + '.png') });
  return page.evaluate(() => {
    const { update, ...state } = window.revealSequence;
    return { ...state, overflow: document.documentElement.scrollWidth > innerWidth,
      caption: document.querySelector('.studio-caption-text').textContent,
      ctaInert: document.querySelector('.hero-revealed').inert };
  });
}

async function main() {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const results = [];
  for (const [name, width, height] of [['desktop',1440,900],['mobile',390,844],['small-mobile',320,640],['tablet',768,1024],['landscape',844,390]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [], missing = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) missing.push({ url: r.url(), status: r.status() }); });
    await page.goto(base, { waitUntil: 'load' });
    await page.evaluate(() => document.documentElement.style.scrollBehavior = 'auto');
    await page.waitForFunction(() => window.revealSequence?.previewFrames === 160);
    const frames = [];
    for (const [label,p] of [['covered',0],['peel',.45],['open',.9],['rewind',.18]]) {
      frames.push({ label, ...await sample(page,p,`${name}-${label}`) });
    }
    let stream;
    if (name === 'desktop' || name === 'mobile') {
      stream = await page.evaluate(async () => {
        const hero = document.querySelector('.unveil'), stage = document.querySelector('.hero-stage');
        const top = hero.getBoundingClientRect().top + scrollY, travel = hero.offsetHeight - stage.offsetHeight;
        const rows = []; let last = performance.now();
        for (let step = 0; step < 300; step++) {
          const p = step < 150 ? step / 149 : (299-step) / 149;
          scrollTo({top:top + travel*p,behavior:'instant'});
          await new Promise(requestAnimationFrame);
          const now = performance.now(), s = window.revealSequence;
          rows.push({ dt:now-last,error:Math.abs(s.frameIndex-s.drawnFrame),cache:s.decodedFrames });
          last = now;
        }
        const times=rows.slice(5).map(r=>r.dt).sort((a,b)=>a-b);
        return { samples:rows.length,p95FrameMs:times[Math.floor(times.length*.95)],
          meanFrameMs:times.reduce((a,b)=>a+b,0)/times.length,
          maxCache:Math.max(...rows.map(r=>r.cache)),
          meanFrameError:rows.reduce((a,r)=>a+r.error,0)/rows.length,
          maxFrameError:Math.max(...rows.map(r=>r.error)) };
      });
    }
    await page.emulateMedia({ reducedMotion:'reduce' });
    await page.waitForTimeout(150);
    await page.locator('.unveil').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(out,`${name}-reduced.png`)});
    const reduced=await page.evaluate(()=>({canvas:getComputedStyle(document.querySelector('.reveal-canvas')).display,
      car:getComputedStyle(document.querySelector('.hero-car')).display,decoded:window.revealSequence.decodedFrames,
      poster:document.querySelector('.hero-car img').currentSrc,ctaInert:document.querySelector('.hero-revealed').inert}));
    await page.emulateMedia({ reducedMotion:'no-preference' });
    const restored=await sample(page,.5);
    if (name === 'desktop') {
      await page.setViewportSize({width:390,height:844});
      frames.push({ label:'resize-mobile',...await sample(page,.5) });
      await page.setViewportSize({width:1440,height:900});
      frames.push({ label:'resize-desktop',...await sample(page,.5) });
    }
    const pass=!errors.length&&!missing.length&&frames.every(s=>s.ready&&!s.overflow&&!s.failedFrames&&Math.abs(s.drawnFrame-s.frameIndex)<.05&&s.decodedFrames<=s.cacheLimit)
      &&reduced.canvas==='none'&&reduced.car!=='none'&&reduced.decoded===0&&!reduced.ctaInert&&restored.ready
      &&(!stream||(stream.meanFrameError<2&&stream.maxCache<=frames[0].cacheLimit));
    results.push({name,pass,errors,missing,frames,stream,reduced,restored});
    console.log(JSON.stringify({name,pass,stream,errors,missing}));
    await page.close();
  }
  // A failed sequence still leaves a usable poster. No blank canvas on network failure.
  const fallback=await browser.newPage({viewport:{width:1440,height:900}});
  await fallback.route('**/assets/reveal-cloth-2k/**',route=>{
    if (route.request().resourceType()==='fetch') return route.abort();
    return route.continue();
  });
  await fallback.goto(base+'/#unveil',{waitUntil:'load'});
  await fallback.waitForTimeout(700);
  const poster=await fallback.evaluate(()=>({ready:window.revealSequence.ready,
    visible:getComputedStyle(document.querySelector('.hero-poster')).display!=='none',
    loaded:document.querySelector('.hero-poster img').naturalWidth>0}));
  await fallback.close();
  await browser.close();
  const pass=results.every(r=>r.pass)&&!poster.ready&&poster.visible&&poster.loaded;
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({pass,results,poster},null,2));
  console.log(JSON.stringify({pass,poster,report:path.join(out,'results.json')}));
  if(!pass) process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;});
