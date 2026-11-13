const { chromium } = require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const out = path.resolve(__dirname, '../../output/playwright/car-studio-20261024');
fs.mkdirSync(out, { recursive: true });
const near = (a, b, tolerance = .035) => Math.abs(a - b) < tolerance;

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const results = [];
  try {
    for (const [width, height] of [[1600, 1000], [925, 884], [390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height }, isMobile: width === 390, hasTouch: width === 390 });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto('http://localhost:4173/index.html#collection');
      await page.waitForFunction(() => document.querySelector('#corvette-viewer').dataset.ready === 'true', null, { timeout: 60000 });
      const read = () => page.evaluate(() => {
        const v = document.querySelector('#corvette-viewer'), s = document.querySelector('.car-studio'), r = s.getBoundingClientRect();
        const nav = document.querySelector('.bottom-nav'), o = v.getCameraOrbit();
        return { theta: o.theta, phi: o.phi, radius: o.radius, y: scrollY, top: r.top, bottom: r.bottom,
          pin: parseFloat(getComputedStyle(s).top) || 0, progress: Number(v.dataset.scrollProgress),
          overflow: document.documentElement.scrollWidth > innerWidth, spinning: v.dataset.spinning === 'true',
          navTop: innerWidth <= 760 ? nav.getBoundingClientRect().top : innerHeight,
          selected: [...document.querySelectorAll('[data-car-view][aria-pressed=true]')].map(b => b.dataset.carView) };
      });
      const position = async p => {
        await page.evaluate(p => {
          const w = document.querySelector('.car-scroll'), s = document.querySelector('.car-studio');
          scrollTo({ top: scrollY + w.getBoundingClientRect().top - parseFloat(getComputedStyle(s).top) + (w.offsetHeight - s.offsetHeight) * p, behavior: 'instant' });
        }, p);
        await page.waitForTimeout(1400);
      };
      const checks = {}, phases = [];
      for (const [name, expected] of [['Chính diện', 0], ['Góc nghiêng', 42], ['Ngang thân', 90], ['Phía sau', 180]]) {
        await page.getByRole('button', { name, exact: true }).click();
        await page.waitForTimeout(1800);
        const state = await read(); phases.push(state);
        checks[name] = near(state.theta, expected * Math.PI / 180) && state.selected.length === 1;
        if (expected !== 42 || width === 1600) await page.screenshot({ path: path.join(out, `studio-${width}-${expected}.png`) });
      }
      checks.pinnedAndFits = phases.every(s => near(s.top, s.pin, 2) && s.bottom <= s.navTop && !s.overflow);
      await position(.43);
      const before = await read(), box = await page.locator('#corvette-viewer').boundingBox();
      await page.mouse.move(box.x + box.width * .5, box.y + box.height * .5);
      await page.mouse.wheel(0, 180); await page.waitForTimeout(1000);
      const down = await read();
      await page.mouse.wheel(0, -180); await page.waitForTimeout(1000);
      const up = await read();
      checks.nativeWheel = down.y > before.y + 100 && down.theta > before.theta && near(down.radius, before.radius, .01) && near(up.theta, before.theta);
      await page.getByRole('button', { name: 'Phóng to xe', exact: true }).click(); await page.waitForTimeout(600);
      const zoom = await read();
      await page.mouse.move(box.x + box.width * .5, box.y + box.height * .5);
      await page.mouse.wheel(0, 100); await page.waitForTimeout(800);
      const zoomScroll = await read();
      checks.zoomPersists = zoom.radius < up.radius && near(zoom.radius, zoomScroll.radius, .02);
      await page.getByRole('button', { name: 'Thu nhỏ xe', exact: true }).click(); await page.waitForTimeout(600);

      const windowsBefore = await page.evaluate(() => document.querySelector('model-viewer').model.materials.find(m => m.name === 'Windows').pbrMetallicRoughness.baseColorFactor);
      const colors = [];
      for (const name of ['đen Obsidian', 'trắng Pearl', 'đỏ Racing', 'xanh Velocity', 'bạc Satin']) {
        await page.getByRole('button', { name: `Sơn màu ${name}`, exact: true }).click();
        colors.push(await page.evaluate(() => ({ selected: document.querySelectorAll('[data-car-color][aria-pressed=true]').length,
          factor: document.querySelector('model-viewer').model.materials.find(m => m.name === 'Car Paint').pbrMetallicRoughness.baseColorFactor })));
      }
      const windowsAfter = await page.evaluate(() => document.querySelector('model-viewer').model.materials.find(m => m.name === 'Windows').pbrMetallicRoughness.baseColorFactor);
      checks.paint = colors.every(c => c.selected === 1) && new Set(colors.map(c => JSON.stringify(c.factor))).size === 5 && JSON.stringify(windowsBefore) === JSON.stringify(windowsAfter);
      await page.getByRole('button', { name: 'Sơn màu đen Obsidian', exact: true }).click();

      await position(.4);
      const dragBefore = await read();
      await page.mouse.move(box.x + box.width * .5, box.y + box.height * .5);
      await page.mouse.down(); await page.mouse.move(box.x + box.width * .62, box.y + box.height * .52, { steps: 15 }); await page.mouse.up();
      await page.waitForTimeout(600); const dragAfter = await read();
      await page.waitForTimeout(350); const dragHeld = await read();
      checks.dragHolds = Math.abs(dragAfter.theta - dragBefore.theta) > .1 && near(dragHeld.theta, dragAfter.theta, .02);
      // Record the immediate response when manual interaction hands control back to scroll.
      const handoff = await page.evaluate(async () => {
        const v = document.querySelector('model-viewer'), samples = [];
        scrollBy({ top: 100, behavior: 'instant' });
        await new Promise(resolve => {
          const start = performance.now();
          function sample(now) { samples.push({ t: now, angle: v.getCameraOrbit().theta }); if (now - start < 700) requestAnimationFrame(sample); else resolve(); }
          requestAnimationFrame(sample);
        });
        return { maxStep: Math.max(...samples.slice(1).map((s, i) => Math.abs(s.angle - samples[i].angle))), frames: samples.length };
      });
      checks.softHandoff = handoff.maxStep < .13;
      await page.getByRole('button', { name: 'Tự xoay', exact: false }).click(); await page.waitForTimeout(200);
      const spinStart = await read(); await page.waitForTimeout(600); const spinEnd = await read();
      await page.getByRole('button', { name: 'Tự xoay', exact: false }).click(); await page.waitForTimeout(500);
      const stopped = await read(); await page.waitForTimeout(300); const held = await read();
      checks.spin = spinStart.spinning && spinEnd.theta > spinStart.theta + .05 && !stopped.spinning && near(stopped.theta, held.theta, .01);

      const cadence = await page.evaluate(async () => {
        const w = document.querySelector('.car-scroll'), s = document.querySelector('.car-studio');
        const startY = scrollY + w.getBoundingClientRect().top - parseFloat(getComputedStyle(s).top), travel = w.offsetHeight - s.offsetHeight;
        let last = performance.now(); const begin = last, frames = [];
        await new Promise(resolve => {
          function step(now) { frames.push(now - last); last = now; scrollTo({ top: startY + travel * (.2 + .6 * Math.min(1, (now - begin) / 1600)), behavior: 'instant' }); if (now - begin < 1600) requestAnimationFrame(step); else resolve(); }
          requestAnimationFrame(step);
        });
        frames.sort((a, b) => a - b);
        return { samples: frames.length, medianMs: frames[Math.floor(frames.length * .5)], p95Ms: frames[Math.floor(frames.length * .95)] };
      });
      if (width === 390) {
        await position(.4); const touchBefore = await read(), cdp = await page.context().newCDPSession(page);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 470 }] });
        for (let y = 450; y >= 310; y -= 20) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y }] }); await page.waitForTimeout(25); }
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(800);
        const touchAfter = await read(); checks.touchScroll = touchAfter.y > touchBefore.y + 50 && near(touchAfter.radius, touchBefore.radius, .02);
      }
      await position(1.1); const exit = await read(); checks.exit = exit.top < exit.pin - 50;
      await position(.4); await page.emulateMedia({ reducedMotion: 'reduce' }); await page.waitForTimeout(400);
      await page.getByRole('button', { name: 'Phía sau', exact: true }).click(); await page.waitForTimeout(250);
      const reducedBefore = await read(); await page.mouse.wheel(0, 100); await page.waitForTimeout(500); const reducedAfter = await read();
      checks.reducedMotion = near(reducedBefore.theta, Math.PI) && near(reducedBefore.theta, reducedAfter.theta, .01) && await page.locator('.car-studio').evaluate(s => getComputedStyle(s).position === 'relative');
      checks.noErrors = errors.length === 0;
      const result = { width, height, pass: Object.values(checks).every(Boolean), checks, errors, handoff, cadence, phases };
      results.push(result); console.log(JSON.stringify(result));
      fs.writeFileSync(path.join(out, 'qa.json'), JSON.stringify({ pass: results.every(r => r.pass), results }, null, 2));
      await page.close();
    }
  } finally { await browser.close(); }
  if (!results.every(r => r.pass)) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
