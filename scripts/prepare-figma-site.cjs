const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'output','figma','site');
fs.mkdirSync(out,{recursive:true});
const config=require('../campaign-config.js');
const pages=['index','experience','films','gallery'];
const exportCss=`
html{scroll-behavior:auto!important}body{overflow-x:hidden}*,*:before,*:after{animation:none!important;transition:none!important}
.site-header{position:absolute!important}.reveal{opacity:1!important;transform:none!important}
.unveil{height:100svh!important;--scene-opacity:1;--intro-opacity:0;--reveal-opacity:1}.hero-stage{position:relative!important}.hero-car{opacity:1!important}.hero-poster,.reveal-canvas{display:none!important}.hero-revealed{opacity:1!important;visibility:visible!important;pointer-events:auto!important}
.performance.drive-scroll{height:100svh!important}.drive-stage{position:relative!important}.drive-canvas{display:none!important}.drive-statement{display:none!important}.drive-specs>div{opacity:1!important;transform:none!important}
.details-scroll{height:auto!important}.details-pin{height:auto!important;position:relative!important;padding-bottom:65px!important}.details-track{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));width:100%!important;padding:0!important;transform:none!important}.details-viewport{padding:0 var(--gutter)!important;overflow:visible!important}.detail-panel{width:100%!important;min-width:0!important}.detail-image{height:290px!important}.details-controls,.details-scroll-line{display:none!important}
.car-scroll{height:auto!important}.car-studio{position:relative!important}.car-loading [data-model-status]{display:none!important}.car-loading img{object-fit:contain!important}.car-stage{height:650px!important}.ed-journey-visual{display:none!important}.ed-journey{display:block!important}.ed-chapter{display:grid!important;grid-template-columns:1fr 1fr;gap:10%;min-height:650px!important;padding:45px 0!important}.ed-mobile-chapter-image{display:block!important;width:100%;height:600px;object-fit:cover}.ed-chapter-copy{align-self:center}
img.campaign-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.campaign-video{opacity:1!important}.campaign-poster{opacity:0!important}
.bottom-nav{position:relative!important;inset:auto!important;margin-top:20px!important}.car-toolbar fieldset[disabled]{opacity:1!important}dialog:not([open]){display:none!important}
@media(max-width:760px){.details-track{grid-template-columns:1fr}.details-pin{padding-bottom:0!important}.detail-image{height:285px!important}.ed-chapter{display:block!important;padding:35px 0!important;min-height:0!important}.ed-mobile-chapter-image{height:auto!important}.ed-chapter-copy{padding:30px 0}.car-stage{height:430px!important}.drive-stage{height:776px!important}.performance.drive-scroll{height:776px!important}}
`;
const prepareScript=`
async function prepare(){
 const c=${JSON.stringify(config)};
 document.querySelectorAll('[data-campaign]').forEach(el=>{el.textContent=c[el.dataset.campaign]||''});
 document.querySelectorAll('[data-campaign-logo]').forEach(el=>{el.src=c.logoSrc;el.alt=c.logoAlt});
 const intro=document.querySelector('.campaign-media');if(intro){intro.querySelector('img').src=c.posterSrc;const img=intro.querySelector('.campaign-video');if(img)img.src=c.posterSrc;document.querySelector('.campaign-subtitle').textContent=c.subtitle;document.querySelector('.campaign-description').textContent=c.description;document.querySelector('.campaign-cta').href=c.ctaHref;document.querySelector('.campaign-cta span').textContent=c.ctaText;document.querySelector('.campaign-message').textContent=c.message;}
 document.querySelectorAll('img').forEach(i=>{i.loading='eager'});
 await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
 const r=document.querySelector('.drive-scroll');if(r){
 const data=await fetch('assets/drive-rollers-sharp/alignment.json').then(x=>x.json());const media=r.querySelector('.drive-media'),rect=media.getBoundingClientRect(),width=rect.width,height=rect.height,a=data.car;
 const mobile=width<=760,cardTop=r.querySelector('.drive-specs').getBoundingClientRect().top-rect.top,baseline=Math.min(height*.74,cardTop-14),minTop=r.querySelector('.drive-topline').getBoundingClientRect().bottom-rect.top+12;
 const cw=Math.min(width*(mobile?.58:width<=1100?.4:.36),500,Math.max(48,(baseline-minTop-46)/((a.baseline-a.bbox[1])/a.width))),scale=cw/a.width,x=width/2-a.centerX*scale,y=baseline-a.baseline*scale;
 Object.assign(r.querySelector('.drive-car').style,{left:x+'px',top:y+'px',width:a.referenceSize[0]*scale+'px',height:a.referenceSize[1]*scale+'px'});
 const title=r.querySelector('.drive-title'),size=parseFloat(getComputedStyle(title).fontSize),ct=y+a.bbox[1]*scale;title.style.top=Math.max(0,ct+(baseline-ct)*.30-size*.5)+'px';
 const f=data.frames[0],rs=Math.max(width/1920,height/1080)*1.12,rw=1920*rs,rh=1080*rs;Object.assign(r.querySelector('.drive-poster img').style,{position:'absolute',maxWidth:'none',objectFit:'fill',left:Math.max(width-rw,Math.min(0,width/2-f.centerX*rs))+'px',top:Math.max(height-rh,Math.min(0,height*.60-f.baseline*rs))+'px',width:rw+'px',height:rh+'px'});
 }
 document.documentElement.dataset.figmaReady='true';
}
prepare().catch(e=>{document.documentElement.dataset.figmaError=e.message});
`;
for(const page of pages){
 let html=fs.readFileSync(path.join(root,page+'.html'),'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
 html=html.replace('<head>','<head><base href="/">');
 html=html.replace(/<video\b([^>]*)>[\s\S]*?<\/video>/gi,(_,attrs)=>{const poster=attrs.match(/poster="([^"]+)"/);return '<img '+attrs.replace(/\s(?:autoplay|controls|muted|loop|playsinline)(?=\s|$)/g,'').replace(/\sposter="[^"]*"/g,'')+' src="'+(poster?poster[1]:config.posterSrc)+'" alt="Thước phim Corvette / ảnh xem trước">'});
 html=html.replace('</head>','<style>'+exportCss+'</style></head>');
 html=html.replace('</body>','<script>'+prepareScript+'</script><script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script></body>');
 fs.writeFileSync(path.join(out,page+'.html'),html);
}
const jobs=JSON.parse(fs.readFileSync(path.join(out,'jobs.json'),'utf8'));
for(const j of jobs){
 const endpoint='https://mcp.figma.com/mcp/capture/'+j.captureId+'/submit?bindVariables=true';
 const inner='/output/figma/site/'+j.src+'#figmacapture='+j.captureId+'&figmaendpoint='+encodeURIComponent(endpoint)+'&figmadelay=10000';
 const wrapper='<!doctype html><html><head><meta charset="utf-8"><title>Figma / '+j.label+' / '+j.mode+'</title><style>html,body{margin:0;background:#08090b}iframe{border:0;width:'+j.width+'px;height:'+j.height+'px;display:block}</style></head><body><iframe src="'+inner.replace(/&/g,'&amp;')+'" title="'+j.label+'"></iframe></body></html>';
 fs.writeFileSync(path.join(out,j.key+'-'+j.mode+'-launch.html'),wrapper);
}
console.log('Prepared '+jobs.length+' isolated capture views; live website source unchanged.');
