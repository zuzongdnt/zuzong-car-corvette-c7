const fs=require('fs'),path=require('path');
const sharp=require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const out=path.resolve(__dirname,'../output/figma/site');
async function run(){
 for(const mode of ['desktop','mobile']){
  const pages=['studio','experience','films','gallery'],width=mode==='desktop'?420:260,gap=14,images=[];let height=0;
  for(let i=0;i<pages.length;i++){const image=await sharp(path.join(out,pages[i]+'-'+mode+'.png')).resize({width}).png().toBuffer(),m=await sharp(image).metadata();height=Math.max(height,m.height);images.push({input:image,left:i*(width+gap),top:0});}
  await sharp({create:{width:4*width+3*gap,height,channels:3,background:'#202124'}}).composite(images).png().toFile(path.join(out,'overview-'+mode+'.png'));
 }
 const regions=[['studio-desktop',0,900],['studio-desktop',900,900],['studio-desktop',1800,900],['studio-desktop',2700,992],['studio-desktop',3691,1227],['studio-mobile',0,844],['studio-mobile',1688,776],['studio-mobile',7411,647]];
 for(let i=0;i<regions.length;i++){const [key,top,height]=regions[i],f=path.join(out,key+'.png'),m=await sharp(f).metadata();await sharp(f).extract({left:0,top,width:m.width,height:Math.min(height,m.height-top)}).png().toFile(path.join(out,'inspect-'+i+'.png'));}
 console.log('Created desktop/mobile visual QA sheets and Studio detail crops.');
}
run().catch(e=>{console.error(e);process.exitCode=1});
