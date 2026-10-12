const fs=require('node:fs'),path=require('node:path');
const sharp=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'..');
async function main(){
 const input=path.join(root,'output/image-retouch/drive-rollers-sharp');
 const source=path.join(root,'assets/drive-rollers-sharp');
 const provenance=JSON.parse(fs.readFileSync(path.join(input,'provenance.json'),'utf8'));
 const previous=JSON.parse(fs.readFileSync(path.join(root,'assets/drive-rollers/manifest.json'),'utf8'));
 const alignment=JSON.parse(fs.readFileSync(path.join(root,'assets/drive-rollers/alignment.json'),'utf8'));
 const car=JSON.parse(fs.readFileSync(path.join(input,'car-anchor.json'),'utf8'));
 fs.mkdirSync(path.join(source,'mobile'),{recursive:true});
 for(let i=0;i<6;i++){
  const name='frame-'+String(i).padStart(3,'0');
  const file=path.join(input,name+'.png');
  await sharp(file).resize(1920,1080,{fit:'fill'}).webp({quality:94,effort:5}).toFile(path.join(source,name+'.webp'));
  await sharp(file).resize(1280,720,{fit:'fill'}).webp({quality:94,effort:5}).toFile(path.join(source,'mobile',name+'.webp'));
 }
 await sharp(path.join(input,'car.png')).webp({lossless:true,effort:5}).toFile(path.join(source,'car.webp'));
 alignment.car={...car,file:'car.webp'};
 alignment.method='One restored transparent car layer: horizontal center, scale and tire baseline stay fixed across all six road plates. Road-camera scale remains constant; original shot anchors stabilize its vanishing point.';
 fs.writeFileSync(path.join(source,'alignment.json'),JSON.stringify(alignment,null,2));
 const manifest={...previous,processing:'Built-in imagegen restoration. Six road plates restored and source vehicle removed; one restored transparent C7 foreground held constant. AI infers missing fine detail. Original ZIP and extracted photos retained.',
  foreground:'car.webp',restoration:provenance,framing:{desktopCarWidth:.36,tabletCarWidth:.40,mobileCarWidth:.58,maximumCarWidth:500,fitBelowTitle:true}};
 fs.writeFileSync(path.join(source,'manifest.json'),JSON.stringify(manifest,null,2));
 console.log(JSON.stringify({source,frames:6,car,bytes:fs.readdirSync(source).filter(f=>f.endsWith('.webp')).reduce((n,f)=>n+fs.statSync(path.join(source,f)).size,0)},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1;});
