const { chromium } = require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('fs');
const path = require('path');
const out = path.resolve(__dirname, '../output/playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const results = [];
  for (const [name, width, height] of [['desktop', 1440, 900], ['tablet', 739, 871], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
    const footer = page.locator('.site-footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const layout = await footer.evaluate(element => {
      const box = element.getBoundingClientRect();
      const mark = element.querySelector('.footer-mark img');
      const word = element.querySelector('.footer-wordmark').getBoundingClientRect();
      const overflowNodes = [...element.querySelectorAll('*')].filter(node => {
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && (rect.left < -.5 || rect.right > innerWidth + .5);
      }).map(node => node.className);
      return {
        pageOverflow: document.documentElement.scrollWidth > innerWidth,
        footerHeight: box.height,
        overflowNodes,
        logoLoaded: mark.complete && mark.naturalWidth > 0,
        wordmarkWidth: word.width,
        links: [...element.querySelectorAll('a')].map(anchor => ({ href: anchor.getAttribute('href'), targetExists: !!document.querySelector(anchor.getAttribute('href')) }))
      };
    });
    const openButton = footer.locator('[data-gallery-open]');
    await openButton.focus();
    await footer.screenshot({ path: path.join(out, `footer-${name}.png`) });
    await openButton.click();
    await page.waitForTimeout(300);
    const gallery = await page.locator('#gallery-dialog').evaluate(dialog => ({
      opened: dialog.open,
      count: dialog.querySelectorAll('.gallery-thumb').length,
      focusedInside: dialog.contains(document.activeElement),
      focusClass: document.activeElement.className,
      pageOverflow: document.documentElement.scrollWidth > innerWidth
    }));
    await page.screenshot({ path: path.join(out, `footer-gallery-${name}.png`) });
    await page.keyboard.press('ArrowRight');
    const nextImage = await page.locator('[data-gallery-counter]').innerText();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    const close = await page.evaluate(() => ({
      closed: !document.querySelector('#gallery-dialog').open,
      focusRestored: document.activeElement.matches('.site-footer [data-gallery-open]'),
      overflowReset: getComputedStyle(document.body).overflow !== 'hidden'
    }));
    results.push({ name, viewport: { width, height }, layout, gallery, nextImage, close, errors });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'footer-qa.json'), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
