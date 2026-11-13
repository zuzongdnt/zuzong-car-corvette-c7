const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const sharp=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'..');
const sourceArchive='D:/tải xuống/Corvette C7 Z06 #3 _ 4k Roller Cinematic_1080p60_0001.zip';
const inventory=JSON.parse(fs.readFileSync(path.join(root,'output/drive-roller-source/inventory.json'),'utf8'));
// Full car bounds, including mirrors and the wheel contact line, measured from the source photos.
const bounds=[[908,542,1052,625],[938,542,1085,624],[956,541,1093,621],[954,539,1088,618],[961,542,1088,617],[968,544,1088,613]];
const selected=inventory.filter(r=>r.number>=44&&r.number<=49);
if(selected.length!==6)throw Error('The continuous driving segment must contain source photos 44–49.');

async function main(){
 const backup=path.join(root,'output/backups/before-drive-rollers-20261009');fs.mkdirSync(backup,{recursive:true});
 for(const file of ['sections.html','drive-scroll.js','drive-scroll.css','README.md','scripts/build.cjs','scripts/qa-drive-scroll.cjs']){
  const destination=path.join(backup,file);fs.mkdirSync(path.dirname(destination),{recursive:true});
  if(!fs.existsSync(destination))fs.copyFileSync(path.join(root,file),destination);
 }
 const directory=path.join(root,'assets/drive-rollers');fs.mkdirSync(path.join(directory,'mobile'),{recursive:true});
 for(const [index,record] of selected.entries()){
  const filename='frame-'+String(index).padStart(3,'0')+'.webp';
  await sharp(record.path).webp({quality:92,effort:5}).toFile(path.join(directory,filename));
  await sharp(record.path).resize(1280,720,{fit:'inside'}).webp({quality:92,effort:5}).toFile(path.join(directory,'mobile',filename));
 }
 const alignment={referenceSize:[1920,1080],frames:bounds.map((bbox,index)=>({frame:index,sourceNumber:selected[index].number,bbox,centerX:(bbox[0]+bbox[2])/2,width:bbox[2]-bbox[0],baseline:bbox[3]})),method:'One continuous moving shot, photos 44–49. Uniform car width, horizontal center and wheel baseline; modest viewport framing preserves the original car proportions.'};
 const manifest={sourceArchive,sourceSHA256:crypto.createHash('sha256').update(fs.readFileSync(sourceArchive)).digest('hex'),sourceVideo:'https://www.youtube.com/watch?v=7t9o9bHjoYw',sourceImageCount:inventory.length,frameCount:selected.length,desktop:[1920,1080],mobile:[1280,720],aspectRatio:'16:9',playbackFrames:selected.map((_,i)=>i),selectedSourceNumbers:selected.map(r=>r.number),sourceFiles:selected.map(r=>path.basename(r.path)),alignment:'alignment.json',selection:'Last continuous front-facing driving shot, 44–49. Parked scenes, departing rear view and changes of camera angle omitted.',processing:'Original user-provided photos. WebP conversion and proportional mobile resize only; no AI-generated detail or new frames.',framing:{desktopCarWidth:.16,tabletCarWidth:.24,mobileCarWidth:.30,maximumCarWidth:260}};
 fs.writeFileSync(path.join(directory,'alignment.json'),JSON.stringify(alignment,null,2));
 fs.writeFileSync(path.join(directory,'manifest.json'),JSON.stringify(manifest,null,2));
 console.log(JSON.stringify({selectedSourceNumbers:manifest.selectedSourceNumbers,frames:manifest.frameCount,aspectRatio:manifest.aspectRatio,bytes:fs.readdirSync(directory).filter(f=>f.endsWith('.webp')).reduce((sum,file)=>sum+fs.statSync(path.join(directory,file)).size,0)},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
