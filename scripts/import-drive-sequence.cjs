const fs = require('node:fs');
const path = require('node:path');
const sharp = require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(__dirname, '..');
const source = process.argv[2];
async function main() {
  if (!source) throw new Error('Pass the supplied Seedance JPG folder.');
  const files = fs.readdirSync(source).filter(file => /\d{4}\.jpg$/i.test(file)).sort();
  if (files.length !== 5) throw new Error('Expected five supplied frames.');
  const dest = path.join(root, 'assets', 'drive');
  fs.mkdirSync(path.join(dest, 'mobile'), {recursive:true});
  for (const [index, file] of files.entries()) {
    for (const [folder, width] of [['',1280], ['mobile',960]]) {
      await sharp(path.join(source,file)).resize({width}).webp({quality:88})
        .toFile(path.join(dest,folder,`frame-${String(index).padStart(3,'0')}.webp`));
    }
  }
  fs.writeFileSync(path.join(dest,'manifest.json'),JSON.stringify({source,files,frameCount:5,
    playback:'Five supplied stills, short crossfades controlled by scroll; original images preserved.'},null,2));
  console.log('Imported five drive frames.');
}
main().catch(error => {console.error(error);process.exitCode=1;});
