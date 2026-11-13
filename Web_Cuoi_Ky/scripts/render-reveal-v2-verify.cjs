const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const sharp=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'..');
async function main(){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/reveal-v2/manifest.json'),'utf8'));
 const results=[];
 const versions=[['desktop',manifest],['mobile',manifest.mobile]];
 if(manifest.preview)versions.push(['desktop-preview',manifest.preview]);
 if(manifest.mobile.preview)versions.push(['mobile-preview',manifest.mobile.preview]);
 for(const [label,version] of versions){
  const failures=[],hashes=[],bytes=[];
  for(let i=0;i<version.frames.length;i++){
   const file=path.join(root,version.frames[i]);
   try{
    const data=fs.readFileSync(file),meta=await sharp(data).metadata();
    if(meta.width!==version.width||meta.height!==version.height||!meta.hasAlpha||meta.format!=='webp')failures.push({i,meta});
    // Decode every frame, as metadata alone does not detect a truncated stream.
    await sharp(data).ensureAlpha().raw().toBuffer();
    hashes.push(crypto.createHash('sha256').update(data).digest('hex'));bytes.push(data.length);
   }catch(e){failures.push({i,error:e.message})}
  }
  let endHold=1;for(let i=hashes.length-2;i>=0&&hashes[i]===hashes.at(-1);i--)endHold++;
  results.push({label,frames:version.frames.length,width:version.width,height:version.height,alpha:true,decoded:version.frames.length-failures.length,uniqueFrames:new Set(hashes).size,finalHoldFrames:endHold,totalBytes:bytes.reduce((a,b)=>a+b,0),failures});
 }
 const report={pass:results.every(r=>r.frames===144&&r.decoded===144&&r.uniqueFrames>120&&!r.failures.length),results,carBounds:manifest.carBounds,camera:manifest.camera,motionEndsAt:manifest.motionEndsAt};
 fs.writeFileSync(path.join(root,'output/playwright/reveal-v2-sequence-validation.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));if(!report.pass)process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1});
