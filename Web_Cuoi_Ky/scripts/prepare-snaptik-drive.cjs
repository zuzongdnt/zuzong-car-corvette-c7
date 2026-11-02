const fs=require('node:fs'),path=require('node:path');
const sharp=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'..');
async function main(){
 const edits=JSON.parse(fs.readFileSync(path.join(root,'output/snaptik-drive-edit-map.json'),'utf8'));
 const out=path.join(root,'assets/drive-snaptik');
 const exports=path.join(root,'output/image-retouch/snaptik-drive');
 fs.mkdirSync(path.join(out,'mobile'),{recursive:true});
 fs.mkdirSync(path.join(exports,'raw-generated'),{recursive:true});
 for(const entry of edits.entries){
  if(!entry.edited||!fs.existsSync(entry.edited))throw Error('Missing edited frame '+entry.index);
  const number=String(entry.index).padStart(3,'0');
  const png=path.join(exports,`Corvette_C7_16x9_${String(entry.index+1).padStart(4,'0')}.png`);
  fs.copyFileSync(entry.edited,path.join(exports,'raw-generated',`frame-${number}.png`));
  // Standardize the AI-edited output to the exact requested aspect ratio.
  await sharp(entry.edited).resize(1920,1080,{fit:'cover',position:'centre'}).png().toFile(png);
  await sharp(png).webp({quality:94}).toFile(path.join(out,`frame-${number}.webp`));
  await sharp(png).resize(960,540).webp({quality:90}).toFile(path.join(out,'mobile',`frame-${number}.webp`));
 }
 const manifest={source:'D:/tải xuống/snaptik.vn_7529176592883469599_0001',frameCount:edits.entries.length,
  desktop:[1920,1080],mobile:[960,540],aspectRatio:'16:9',processing:'Built-in imagegen reframing and AI-assisted detail restoration; final dimensions standardized with sharp. Original photos preserved.',
  playback:'Eleven supplied photos enhanced individually; scroll-controlled still sequence with brief crossfades.',
  sourceFiles:edits.entries.map(e=>path.basename(e.source)),exports:'output/image-retouch/snaptik-drive',prompt:edits.prompt};
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
 fs.writeFileSync(path.join(exports,'manifest.json'),JSON.stringify(manifest,null,2));
 console.log('Prepared '+edits.entries.length+' frames at exact 1920x1080 / 960x540.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
