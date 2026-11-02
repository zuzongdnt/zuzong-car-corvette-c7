const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const header = source.match(/<header class="site-header[\s\S]*?<\/header>/)[0].replace(' is-intro', '');
const section = fs.readFileSync(path.join(root, 'sections.html'), 'utf8').split('\n\n<section id="details"')[0];
const output = path.join(root, 'output', 'figma');
fs.mkdirSync(output, {recursive:true});
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="/"><title>Zuzong Car — Figma capture</title><link rel="stylesheet" href="assets/fonts/fonts.css"><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="sections.css"><link rel="stylesheet" href="drive-scroll.css"><style>html,body{width:1440px;height:900px;overflow:hidden}#figma-preview{width:1440px;height:900px;position:relative;overflow:hidden}.site-header{width:1440px;position:absolute;top:0}.performance.drive-scroll{height:900px!important}.drive-stage{height:900px;position:relative}.drive-statement{display:none!important}.drive-title{font-size:247.68px!important}.drive-topline{top:130px!important}.drive-specs>div{opacity:1!important;transform:none!important}.drive-poster img{object-fit:fill}.drive-progress span{transform:scaleX(.65)}.drive-canvas{display:none}</style></head><body><div id="figma-preview">${header}${section}</div><script>
async function prepare(){
 const data=await fetch('assets/drive-rollers-sharp/alignment.json').then(r=>r.json());
 await document.fonts.ready; await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{})}));
 const width=1440,height=900,a=data.car,baseline=Math.min(height*.74,document.querySelector('.drive-specs').getBoundingClientRect().top-14),carWidth=500;
 const scale=carWidth/a.width,x=width/2-a.centerX*scale,y=baseline-a.baseline*scale;
 Object.assign(document.querySelector('.drive-car').style,{left:x+'px',top:y+'px',width:a.referenceSize[0]*scale+'px',height:a.referenceSize[1]*scale+'px'});
 const carTop=y+a.bbox[1]*scale;
 document.querySelector('.drive-title').style.top=Math.max(0,carTop+(baseline-carTop)*.30-247.68*.5)+'px';
 Object.assign(document.querySelector('.drive-ground').style,{left:(width/2-carWidth*.56)+'px',top:(baseline-carWidth*.035)+'px',width:(carWidth*1.12)+'px',height:(carWidth*.09)+'px'});
 const f=data.frames[0],rs=Math.max(width/1920,height/1080)*1.12,rw=1920*rs,rh=1080*rs;
 Object.assign(document.querySelector('.drive-poster img').style,{position:'absolute',maxWidth:'none',left:Math.max(width-rw,Math.min(0,width/2-f.centerX*rs))+'px',top:Math.max(height-rh,Math.min(0,height*.60-f.baseline*rs))+'px',width:rw+'px',height:rh+'px'});
 document.documentElement.dataset.figmaReady='true';
}
prepare();
</script><script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script></body></html>`;
fs.writeFileSync(path.join(output, 'capture-performance.html'), html);
console.log('Created isolated Figma preview: http://localhost:4173/output/figma/capture-performance.html');
