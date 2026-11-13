const fs = require('node:fs');
const path = require('node:path');
const sharp = require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(__dirname, '..');
const source = process.argv[2];
if (!source) throw new Error('Pass the folder containing the ten Corvette JPG frames.');
async function main() {
  const directory = path.join(root, 'assets/reveal-studio');
  const frames = fs.readdirSync(source).filter(name => /^Corvette_C7_mo_bat_studio_10s_\d{4}\.jpg$/i.test(name)).sort();
  if (frames.length !== 10) throw new Error('Expected exactly ten source frames.');
  for (const folder of ['', 'mobile', 'preview', 'mobile/preview']) fs.mkdirSync(path.join(directory, folder), {recursive: true});
  for (const [index, file] of frames.entries()) {
    for (const [folder, width] of [['', 1600], ['mobile', 800], ['preview', 400], ['mobile/preview', 200]]) {
      await sharp(path.join(source, file)).resize({width}).webp({quality: 90}).toFile(path.join(directory, folder, `frame-${String(index).padStart(3, '0')}.webp`));
    }
  }
  fs.writeFileSync(path.join(directory, 'manifest.json'), JSON.stringify({source: path.basename(source), frameCount: frames.length, sourceFrames: frames, desktop: [1600, 902], mobile: [800, 451], playback: 'Scroll-driven crossfade between supplied still frames'}, null, 2));
  console.log(`Imported ${frames.length} studio frames.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
