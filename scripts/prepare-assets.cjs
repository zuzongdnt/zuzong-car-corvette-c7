/* Frontend-only derivative assets. Source PNG files are never modified. */
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('C:/Users/zuzong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'output', 'xe_4k');
const dest = path.join(root, 'assets');
const fontDir = path.join(root, 'assets', 'fonts');

async function alphaBounds(input) {
  const {data, info} = await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let left=info.width, top=info.height, right=-1, bottom=-1;
  for (let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
    if(data[(y*info.width+x)*4+3]>8) {
      left=Math.min(left,x); top=Math.min(top,y); right=Math.max(right,x); bottom=Math.max(bottom,y);
    }
  }
  if(right<left) throw new Error('No visible content: '+input);
  const padding=24;
  left=Math.max(0,left-padding); top=Math.max(0,top-padding);
  right=Math.min(info.width-1,right+padding); bottom=Math.min(info.height-1,bottom+padding);
  return {left,top,width:right-left+1,height:bottom-top+1};
}

async function imageAssets() {
  await fs.mkdir(dest,{recursive:true});
  const manifest=[];
  for(let n=1;n<=18;n++) {
    const num=String(n).padStart(2,'0');
    const input=path.join(source,`xe_${num}_4K.png`);
    const crop=await alphaBounds(input);
    const name=`view-${num}.webp`;
    const info=await sharp(input).extract(crop).resize({width:1200,withoutEnlargement:true}).webp({quality:88,alphaQuality:100,effort:6}).toFile(path.join(dest,name));
    manifest.push({source:`output/xe_4k/xe_${num}_4K.png`,asset:`assets/${name}`,crop,width:info.width,height:info.height,bytes:info.size});
  }
  const selected={hero:5,front:7,rear:10,side:15,'detail-wheel':17,'detail-tail':13};
  for(const [name,n] of Object.entries(selected)) {
    const num=String(n).padStart(2,'0');
    const input=path.join(source,`xe_${num}_4K.png`);
    const crop=manifest[n-1].crop;
    const info=await sharp(input).extract(crop).resize({width:name==='hero'?1600:1200,withoutEnlargement:true}).webp({quality:name==='hero'?92:90,alphaQuality:100,effort:6}).toFile(path.join(dest,`${name}.webp`));
    manifest.push({source:`output/xe_4k/xe_${num}_4K.png`,asset:`assets/${name}.webp`,crop,width:info.width,height:info.height,bytes:info.size});
  }
  await fs.writeFile(path.join(dest,'manifest.json'),JSON.stringify(manifest,null,2));
  const tileW=320,tileH=220,cols=6,rows=3;
  const composites=[];
  for(let i=0;i<18;i++) {
    const thumb=await sharp(path.join(dest,`view-${String(i+1).padStart(2,'0')}.webp`)).resize(296,180,{fit:'inside'}).toBuffer();
    const meta=await sharp(thumb).metadata();
    const x=(i%cols)*tileW, y=Math.floor(i/cols)*tileH;
    composites.push({input:thumb,left:x+Math.round((tileW-meta.width)/2),top:y+20+Math.round((180-meta.height)/2)});
    const label=Buffer.from(`<svg width="${tileW}" height="${tileH}"><text x="16" y="21" fill="#b7b7bc" font-size="14" font-family="Arial">${String(i+1).padStart(2,'0')}</text></svg>`);
    composites.push({input:label,left:x,top:y});
  }
  await sharp({create:{width:cols*tileW,height:rows*tileH,channels:3,background:'#1a1a20'}}).composite(composites).jpeg({quality:85}).toFile(path.join(dest,'contact-sheet.jpg'));
  console.log(JSON.stringify(manifest.filter(x=>!x.asset.includes('view-')),null,2));
}

async function fontAssets() {
  await fs.mkdir(fontDir,{recursive:true});
  const url='https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Manrope:wght@400;500;600;700&display=swap';
  const response=await fetch(url,{headers:{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}});
  if(!response.ok) throw new Error('Font stylesheet HTTP '+response.status);
  const css=await response.text();
  const blocks=[...css.matchAll(/\/\*\s*([^*]+)\*\/\s*(@font-face\s*\{[\s\S]*?\})/g)].filter(m=>['latin','vietnamese'].includes(m[1].trim()));
  const output=[]; const downloaded=new Map();
  for(const match of blocks) {
    const subset=match[1].trim(); let block=match[2];
    const family=block.match(/font-family:\s*'([^']+)'/)[1];
    const weight=block.match(/font-weight:\s*([^;]+);/)[1].trim().replace(/\s+/g,'-');
    const remote=block.match(/url\(([^)]+)\)/)[1];
    const slug=family.toLowerCase().replace(/\s+/g,'-');
    let local=downloaded.get(remote);
    if(!local) {
      local=`${slug}-${weight}-${subset}.woff2`;
      const fileResponse=await fetch(remote);
      if(!fileResponse.ok) throw new Error('Font download HTTP '+fileResponse.status);
      await fs.writeFile(path.join(fontDir,local),Buffer.from(await fileResponse.arrayBuffer()));
      downloaded.set(remote,local);
    }
    block=block.replace(remote,`./${local}`);
    output.push(`/* ${family}, ${subset}; Google Fonts, SIL Open Font License */\n${block}`);
  }
  await fs.writeFile(path.join(fontDir,'fonts.css'),output.join('\n\n')+'\n');
  for(const [family,repoDir] of [['barlow-condensed','barlowcondensed'],['manrope','manrope']]) {
    const license=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${repoDir}/OFL.txt`);
    if(license.ok) await fs.writeFile(path.join(fontDir,`${family}-OFL.txt`),await license.text());
  }
  await fs.writeFile(path.join(fontDir,'source.json'),JSON.stringify({url,assets:[...downloaded].map(([remote,local])=>({remote,local}))},null,2));
  console.log('Fonts:',downloaded.size,'self-hosted WOFF2 files');
}

(async()=>{await imageAssets(); await fontAssets();})().catch(e=>{console.error(e);process.exitCode=1;});
