const fs=require('node:fs'),path=require('node:path');
const sharp=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'..');
const manifestPath=path.join(root,'assets/reveal/manifest.json');
async function makePreview(source,width,height,relativeDirectory){
 const directory=path.join(root,relativeDirectory);fs.mkdirSync(directory,{recursive:true});
 const frames=source.frames.map(file=>`${relativeDirectory}/${path.basename(file)}`);
 const sizes=[];
 // Limit parallel Sharp work to keep the live UI responsive during authoring.
 for(let offset=0;offset<frames.length;offset+=8){
  const batch=await Promise.all(source.frames.slice(offset,offset+8).map(async(file,j)=>{
   const index=offset+j,target=path.join(root,frames[index]);
   const data=await sharp(path.join(root,file)).resize(width,height).webp({quality:65,alphaQuality:90,effort:4}).toBuffer();
   fs.writeFileSync(target,data);return data.length;
  }));sizes.push(...batch);
 }
 return {width,height,frames,bytes:sizes.reduce((a,b)=>a+b,0),poster:frames[0],final:frames.at(-1)};
}
async function main(){
 const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
 const [desktop,mobile]=await Promise.all([
  makePreview(manifest,400,180,'assets/reveal/preview'),
  makePreview(manifest.mobile,200,240,'assets/reveal/mobile/preview')
 ]);
 manifest.preview=desktop;manifest.mobile.preview=mobile;
 fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2));
 console.log(JSON.stringify({desktop:{width:desktop.width,height:desktop.height,frames:desktop.frames.length,bytes:desktop.bytes},mobile:{width:mobile.width,height:mobile.height,frames:mobile.frames.length,bytes:mobile.bytes}},null,2));
}
main().catch(e=>{console.error(e);process.exitCode=1});
