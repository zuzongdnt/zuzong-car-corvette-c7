/* Apply reviewed photographic retouches; original files live in output/image-retouch/originals. */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(__dirname, '..');
const sources = path.join(root, 'output/image-retouch/generated');
const originals = path.join(root, 'output/image-retouch/originals/assets');
const groups = {
  'view-01': [1, 2, 3], hero: [4, 5, 6], front: [7, 8],
  'view-09': [9], rear: [10, 11, 12], 'detail-tail': [13, 14],
  side: [15, 16], 'detail-wheel': [17, 18]
};
async function main() {
  const manifest = [];
  // Validate the complete input set before changing any live assets.
  for (const name of [...Object.keys(groups), 'hangar']) {
    const meta = await sharp(path.join(sources, name + '.png')).metadata();
    if (meta.width < 900 || (name !== 'hangar' && !meta.hasAlpha)) throw Error('Invalid retouch: ' + name);
  }
  async function exportAsset(name, relative) {
    const input = path.join(sources, name + '.png');
    const target = path.join(root, 'assets', relative);
    if (!fs.existsSync(path.join(originals, relative))) throw Error('Missing original backup: ' + relative);
    const info = await sharp(input).webp({quality: 95, alphaQuality: 100, effort: 5}).toFile(target);
    manifest.push({asset: 'assets/' + relative, reviewedMaster: 'output/image-retouch/generated/' + name + '.png', original: 'output/image-retouch/originals/assets/' + relative, width: info.width, height: info.height, bytes: info.size});
  }
  for (const [name, views] of Object.entries(groups)) {
    if (!name.startsWith('view-')) await exportAsset(name, name + '.webp');
    for (const n of views) await exportAsset(name, `view-${String(n).padStart(2, '0')}.webp`);
  }
  await exportAsset('hangar', 'editorial/hangar.webp');
  fs.writeFileSync(path.join(root, 'assets/retouch-manifest.json'), JSON.stringify({date: '2026-10-08', method: 'Built-in imagegen photographic retouch, followed by WebP encoding only.', note: 'Near-duplicate studio frames share the reviewed retouch for their matching camera-angle group. The original 18 files remain in the backup.', assets: manifest}, null, 2));
  // Rebuild the visual contact sheet for the assets actually served by the site.
  const tiles = [];
  for (let n = 1; n <= 18; n++) {
    const tile = await sharp(path.join(root, `assets/view-${String(n).padStart(2, '0')}.webp`)).resize(296, 180, {fit: 'inside'}).toBuffer();
    const m = await sharp(tile).metadata();
    const left = ((n - 1) % 6) * 320, top = Math.floor((n - 1) / 6) * 220;
    tiles.push({input: tile, left: left + Math.round((320 - m.width) / 2), top: top + 27 + Math.round((180 - m.height) / 2)});
    tiles.push({input: Buffer.from(`<svg width="320" height="25"><text x="16" y="20" fill="#bbb" font-size="14" font-family="Arial">${String(n).padStart(2, '0')}</text></svg>`), left, top});
  }
  await sharp({create: {width: 1920, height: 660, channels: 3, background: '#1a1a20'}}).composite(tiles).jpeg({quality: 93}).toFile(path.join(root, 'assets/contact-sheet.jpg'));
  console.log(JSON.stringify({count: manifest.length, bytes: manifest.reduce((sum, a) => sum + a.bytes, 0)}, null, 2));
}
main().catch(error => {console.error(error); process.exitCode = 1;});
