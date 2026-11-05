import {cars} from './studio-data.js';
import {vehicleSpecs} from './studio-specs.js';

const root=document.querySelector('.studio-sequence');
if(root) mountSequence(root);

function mountSequence(root){
 const count=320,perCar=64,source=root.dataset.sequenceSrc;
 const keys=['corvette','bmw','porsche','mercedes','lamborghini'];
 const stage=root.querySelector('.studio-sequence-stage'),canvas=root.querySelector('canvas');
 const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
 const labels=[...root.querySelectorAll('.studio-sequence-callout')];
 const paths=[...root.querySelectorAll('.studio-sequence-lines path')],dots=[...root.querySelectorAll('.studio-sequence-lines circle')];
 const lines=root.querySelector('.studio-sequence-lines'),buttons=[...root.querySelectorAll('[data-sequence-car]')];
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:760px)');
 const previews=new Map(),frames=new Map(),pending=new Map(),blobs=new Map(),failed=new Set();
 const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
 const state=root.studioSequenceState={count,frame:-1,car:'corvette',quality:'poster',previewDecoded:0,decoded:0,failed:0};
 let anchors=[],active=false,raf=0,progress=0,lastTime=0,drawn=-1,currentCar=-1;
 let compact=mobile.matches,version=0,previewStarted=false,resize=true,geometry,manualProgress=0;
 const url=(index,tier='full')=>`${source}/${tier==='preview'?'preview/':compact?'mobile/':''}frame-${String(index).padStart(3,'0')}.webp`;
 const schedule=()=>{if(active&&!document.hidden&&!raf)raf=requestAnimationFrame(paint);};
 async function decode(blob){
  if(typeof createImageBitmap==='function')return createImageBitmap(blob);
  const image=new Image(),objectURL=URL.createObjectURL(blob);
  try{image.src=objectURL;await image.decode();return image;}finally{URL.revokeObjectURL(objectURL);}
 }
 async function request(index,tier='full'){
  const location=url(index,tier),stamp=version;
  if(failed.has(location))return;
  try{
   let blob=blobs.get(location);
   if(!blob){const response=await fetch(location,{cache:'force-cache'});if(!response.ok)throw Error('Frame unavailable');blob=await response.blob();blobs.set(location,blob);}
   const image=await decode(blob);
   if(tier==='preview'){previews.set(index,image);state.previewDecoded=previews.size;}
   else if(stamp===version){frames.get(index)?.close?.();frames.set(index,image);trim();}
   else image.close?.();
  }catch{failed.add(location);state.failed++;}
 }
 function trim(){
  const limit=compact?10:14,target=progress*(count-1);
  const farthest=[...frames.keys()].sort((a,b)=>Math.abs(b-target)-Math.abs(a-target));
  while(frames.size>limit){const i=farthest.shift();frames.get(i)?.close?.();frames.delete(i);}
  state.decoded=frames.size;
 }
 async function loadPreviews(){
  if(previewStarted)return;previewStarted=true;
  const priority=keys.map((_,i)=>i*perCar),order=[...priority,...Array.from({length:count},(_,i)=>i).filter(i=>!priority.includes(i))];
  let next=0;
  await Promise.all(Array.from({length:3},async()=>{while(next<order.length){await request(order[next++],'preview');schedule();}}));
 }
 function warm(wanted){
  const center=Math.round(wanted),direction=wanted>=drawn?1:-1;
  const nearby=[Math.floor(wanted),Math.ceil(wanted)];
  for(let i=1;i<=5;i++){nearby.push(center+i*direction);if(i<=2)nearby.push(center-i*direction);}
  // Decode the other side before the film's car-to-car cut is reached.
  const boundary=Math.round(wanted/perCar)*perCar;
  if(Math.abs(boundary-wanted)<6)nearby.push(boundary-1,boundary);
  for(const index of new Set(nearby)){
   if(pending.size>=3)break;
   if(index<0||index>=count||frames.has(index)||pending.has(index)||failed.has(url(index)))continue;
   const task=request(index).finally(()=>{if(pending.get(index)===task)pending.delete(index);schedule();});pending.set(index,task);
  }
 }
 function measure(){
  const box=canvas.getBoundingClientRect(),w=box.width,h=box.height;
  const ratio=Math.min(devicePixelRatio||1,compact?1.5:2);
  canvas.width=Math.max(1,Math.round(w*ratio));canvas.height=Math.max(1,Math.round(h*ratio));
  ctx.setTransform(ratio,0,0,ratio,0,0);
  const imageWidth=Math.min(w,h*.70*16/9),imageHeight=imageWidth*9/16;
  const header=stage.querySelector('.studio-sequence-header').getBoundingClientRect(),footer=stage.querySelector('.studio-sequence-footer').getBoundingClientRect();
  geometry={w,h,x:(w-imageWidth)/2,y:h*.54-imageHeight/2,width:imageWidth,height:imageHeight,headerBottom:header.bottom-box.top,footerTop:footer.top-box.top};
  lines.setAttribute('viewBox',`0 0 ${w} ${h}`);resize=false;
 }
 function updateCar(index){
  const carIndex=Math.floor(index/perCar);if(currentCar===carIndex)return;
  currentCar=carIndex;const key=keys[carIndex],car=cars.find(c=>c.id===key),spec=vehicleSpecs[key];
  root.querySelector('[data-sequence-title]').textContent=car.brand+' '+car.name;
  root.querySelector('[data-sequence-engine]').textContent=spec.engine;
  root.querySelector('[data-sequence-detail]').href=`product.html?car=${key}`;
  root.querySelector('[data-sequence-source]').href=spec.source;
  root.querySelector('[data-sequence-variant]').textContent=spec.variant;
  labels[0].querySelector('dt').textContent='Dung tích động cơ';
  labels[0].querySelector('[data-value]').textContent=spec.litres.toFixed(1).replace('.',',');
  labels[0].querySelector('small').textContent='L';
  labels[0].querySelector('p').textContent=key==='lamborghini'?'V12 + 3 mô-tơ điện':spec.engine;
  labels[1].querySelector('dt').textContent=key==='lamborghini'?'Công suất toàn hệ hybrid':'Công suất';
  labels[1].querySelector('[data-value]').textContent=spec.hp.toLocaleString('vi-VN');
  labels[1].querySelector('small').textContent=spec.hpUnit;
  labels[1].querySelector('p').textContent=`${spec.kw} kW`;
  labels[2].querySelector('dt').textContent=spec.torqueLabel;
  labels[2].querySelector('[data-value]').textContent=spec.torque.toLocaleString('vi-VN');
  labels[2].querySelector('small').textContent='Nm';
  labels[2].querySelector('p').textContent=key==='lamborghini'?'Riêng động cơ V12':'Mô-men xoắn cực đại';
  buttons.forEach((button,i)=>button.setAttribute('aria-current',String(i===carIndex)));
  canvas.setAttribute('aria-label',`${car.brand} ${car.name} trên sàn studio phản chiếu. Cuộn xuống hoặc lên để xem góc quay.`);
  root.querySelector('[data-sequence-status]').textContent=`${car.brand} ${car.name}, ${spec.litres} L, ${spec.hp} ${spec.hpUnit}, ${spec.torque} Nm${key==='lamborghini'?' riêng V12':''}.`;
  state.car=key;root.dataset.sequenceCar=key;resize=true;
 }
 function annotate(index){
  if(!geometry)return;
  const {w,h,x,y,width,height,headerBottom,footerTop}=geometry,small=h<650;
  const topLabel=Math.max(headerBottom+(small?8:24),y-(compact?50:52));
  const positions=[
   [w*.07,topLabel],
   [w*(compact?.66:.76),topLabel],
   [w*(compact?.66:.76),Math.min(y+height+(compact?6:12),footerTop-labels[2].offsetHeight-(small?8:20))]
  ];
  const lo=Math.floor(index),hi=Math.min(count-1,Math.ceil(index)),fraction=index-lo;
  const points=anchors[lo];
  labels.forEach((label,i)=>{
   const [lx,ly]=positions[i];label.style.setProperty('--label-x',`${lx}px`);label.style.setProperty('--label-y',`${ly}px`);
   if(!points)return;
   const second=Math.floor(lo/perCar)===Math.floor(hi/perCar)?anchors[hi]?.[i]:null;
   const point=points[i].map((v,j)=>second?v+(second[j]-v)*fraction:v);
   const px=x+point[0]*width,py=y+point[1]*height;
   const sx=lx+Math.min(label.offsetWidth,i===1?0:80),sy=ly+(i===2?0:label.offsetHeight+5),bend=sy+(py-sy)*.45;
   paths[i].setAttribute('d',`M${sx.toFixed(1)},${sy.toFixed(1)} L${sx.toFixed(1)},${bend.toFixed(1)} L${px.toFixed(1)},${py.toFixed(1)}`);
   dots[i].setAttribute('cx',px.toFixed(1));dots[i].setAttribute('cy',py.toFixed(1));
  });
 }
 function imageAt(index){return frames.get(index)||previews.get(index);}
 function paint(now){
  raf=0;if(!active||document.hidden)return;if(resize)measure();
  const target=reduced.matches?manualProgress:clamp(-root.getBoundingClientRect().top/Math.max(1,root.offsetHeight-stage.offsetHeight));
  const elapsed=lastTime?Math.min(64,now-lastTime):16.67;lastTime=now;
  progress=reduced.matches?target:progress+(target-progress)*(1-Math.exp(-elapsed/100));
  if(Math.abs(progress-target)<.00004)progress=target;
  const wanted=progress*(count-1);warm(wanted);
  let lo=Math.floor(wanted),hi=Math.ceil(wanted),mix=wanted-lo;
  // Dissolve across cuts without throwing away any of the source frames.
  const boundary=Math.round(wanted/perCar)*perCar;
  if(!reduced.matches&&boundary>0&&boundary<count&&Math.abs(wanted-boundary)<3){
   lo=Math.min(Math.floor(wanted),boundary-1);hi=Math.max(Math.ceil(wanted),boundary);
   mix=clamp((wanted-boundary+3)/6);
  }
  let first=imageAt(lo),second=imageAt(hi),actual=wanted;
  if(!first||!second){
   const sameCar=[...new Set([...previews.keys(),...frames.keys()])].filter(i=>Math.floor(i/perCar)===Math.floor(wanted/perCar));
   if(sameCar.length){const nearest=sameCar.reduce((a,b)=>Math.abs(a-wanted)<Math.abs(b-wanted)?a:b);first=second=imageAt(nearest);actual=nearest;lo=hi=nearest;mix=0;}
   else first=second=null;
  }
  if(first&&second){
   const g=geometry;ctx.globalAlpha=1;ctx.fillStyle='#171717';ctx.fillRect(0,0,g.w,g.h);
   ctx.drawImage(first,g.x,g.y,g.width,g.height);
   if(first!==second&&mix>0){ctx.globalAlpha=mix;ctx.drawImage(second,g.x,g.y,g.width,g.height);ctx.globalAlpha=1;}
   const feather=Math.min(36,g.height*.09);
   for(const edge of ['top','bottom']){
    const sy=edge==='top'?g.y:g.y+g.height-feather;
    const fade=ctx.createLinearGradient(0,sy,0,sy+feather);
    fade.addColorStop(0,edge==='top'?'#171717':'#17171700');fade.addColorStop(1,edge==='top'?'#17171700':'#171717');
    ctx.fillStyle=fade;ctx.fillRect(g.x,sy,g.width,feather);
   }
   if(g.x>0)for(const edge of ['left','right']){
    const sx=edge==='left'?g.x:g.x+g.width-feather;
    const fade=ctx.createLinearGradient(sx,0,sx+feather,0);
    fade.addColorStop(0,edge==='left'?'#171717':'#17171700');fade.addColorStop(1,edge==='left'?'#17171700':'#171717');
    ctx.fillStyle=fade;ctx.fillRect(sx,g.y,feather,g.height);
   }
   drawn=actual;
   const dominant=Math.floor(lo/perCar)!==Math.floor(hi/perCar)?(mix<.5?lo:hi):Math.round(actual);
   updateCar(dominant);annotate(Math.floor(lo/perCar)!==Math.floor(hi/perCar)?dominant:actual);
   root.style.setProperty('--annotation-opacity',String(Math.floor(lo/perCar)!==Math.floor(hi/perCar)?Math.abs(mix-.5)*1.2+.4:1));
   root.classList.add('is-ready');state.frame=actual;state.quality=frames.has(Math.round(actual))?'full':'preview';
  }
  root.style.setProperty('--sequence-progress',String(progress));root.dataset.sequenceFrame=String(Math.round(drawn));
  root.dataset.sequenceProgress=progress.toFixed(5);root.dataset.sequenceSettled=String(progress===target&&Math.abs(drawn-wanted)<1.01);
  if(progress!==target)schedule();else lastTime=0;
 }
 buttons.forEach((button,i)=>button.addEventListener('click',()=>{
  const p=(i*perCar+20)/(count-1);
  if(reduced.matches){manualProgress=p;progress=p;schedule();}
  else{const top=scrollY+root.getBoundingClientRect().top;scrollTo({top:top+p*(root.offsetHeight-stage.offsetHeight),behavior:'smooth'});}
 }));
 fetch(`${source}/anchors.json`,{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error('Missing anchors');return r.json();}).then(data=>{anchors=data;schedule();}).catch(()=>root.classList.add('without-lines'));
 new IntersectionObserver(entries=>{
  active=entries[0].isIntersecting;
  if(active){loadPreviews();resize=true;schedule();}
  else{if(raf)cancelAnimationFrame(raf);raf=0;lastTime=0;}
 },{rootMargin:'1000px 0px'}).observe(root);
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',()=>{resize=true;schedule();},{passive:true});
 mobile.addEventListener('change',()=>{compact=mobile.matches;version++;frames.forEach(im=>im.close?.());frames.clear();resize=true;schedule();});
 reduced.addEventListener('change',()=>{manualProgress=progress;resize=true;schedule();});
 document.addEventListener('visibilitychange',schedule);
 document.fonts?.ready.then(()=>{resize=true;schedule();});
 updateCar(0);
}
