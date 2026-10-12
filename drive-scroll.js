(() => {
  'use strict';
  const root=document.querySelector('.drive-scroll');
  if(!root)return;
  const stage=root.querySelector('.drive-stage'),media=root.querySelector('.drive-media');
  const canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d',{alpha:false});
  const cards=[...root.querySelectorAll('.drive-specs>div')],specifications=root.querySelector('.drive-specs');
  const poster=root.querySelector('.drive-poster img');
  const car=root.querySelector('.drive-car');
  const ground=root.querySelector('.drive-ground');
  const title=root.querySelector('.drive-title'),topline=root.querySelector('.drive-topline');
  const frameCount=Math.max(1,Number(root.dataset.driveFrames)||5),source=root.dataset.driveSrc||'assets/drive';
  const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:760px)');
  const clamp=v=>Math.max(0,Math.min(1,v));
  const ease=(start,end,value)=>{const t=clamp((value-start)/(end-start));return t*t*(3-2*t);};
  const foreground=document.createElement('canvas'),foregroundContext=foreground.getContext('2d');
  const renderCache=new Map();
  let frames=[],version=0,active=false,pending=0,width=0,height=0,dpr=1;
  let loaded=false,progress=0,lastPaint=0,displayedFrame=0,transition=null;
  let alignment=null,alignmentPromise=null,carWidth=0,baseline=0;

  function fixedCarPlacement(){
    const anchor=alignment?.car;
    if(!car||!anchor)return null;
    const scale=carWidth/anchor.width,x=width/2-anchor.centerX*scale,y=baseline-anchor.baseline*scale;
    return {scale,x,y,w:anchor.referenceSize[0]*scale,h:anchor.referenceSize[1]*scale,
      carLeft:width/2-carWidth/2,carRight:width/2+carWidth/2,
      carTop:y+anchor.bbox[1]*scale,baseline};
  }

  function placement(index,imageWidth,imageHeight){
    const anchor=alignment?.frames[index];
    if(anchor){
      if(alignment.car){
        // Stabilize the road camera with one scale, independently of the foreground car.
        const ratio=imageWidth/alignment.referenceSize[0];
        const scale=Math.max(width/imageWidth,height/imageHeight)*1.12,w=imageWidth*scale,h=imageHeight*scale;
        const x=Math.max(width-w,Math.min(0,width/2-anchor.centerX*ratio*scale));
        const y=Math.max(height-h,Math.min(0,height*.60-anchor.baseline*ratio*scale));
        return {scale,x,y,w,h};
      }
      const ratio=imageWidth/alignment.referenceSize[0],scale=carWidth/(anchor.width*ratio);
      const x=width/2-anchor.centerX*ratio*scale,y=baseline-anchor.baseline*ratio*scale;
      return {scale,x,y,w:imageWidth*scale,h:imageHeight*scale,
        carLeft:width/2-carWidth/2,carRight:width/2+carWidth/2,
        carTop:y+anchor.bbox[1]*ratio*scale,baseline};
    }
    const scale=Math.max(width/imageWidth,height/imageHeight),w=imageWidth*scale,h=imageHeight*scale;
    return {scale,x:(width-w)/2,y:(height-h)/2,w,h};
  }

  function frameBuffer(index){
    if(renderCache.has(index)){
      const saved=renderCache.get(index);renderCache.delete(index);renderCache.set(index,saved);return saved;
    }
    const image=frames[index],p=placement(index,image.naturalWidth,image.naturalHeight);
    const buffer=document.createElement('canvas');buffer.width=canvas.width;buffer.height=canvas.height;
    const b=buffer.getContext('2d',{alpha:false});b.setTransform(dpr,0,0,dpr,0,0);b.imageSmoothingQuality='high';
    b.fillStyle='#0b141b';b.fillRect(0,0,width,height);
    // Continue the same photograph behind exposed edges, without changing the car scale.
    const backgroundScale=Math.max((width+72)/image.naturalWidth,(height+72)/image.naturalHeight);
    const bw=image.naturalWidth*backgroundScale,bh=image.naturalHeight*backgroundScale;
    b.filter='blur(20px)';b.drawImage(image,(width-bw)/2,(height-bh)/2,bw,bh);b.filter='none';
    const f=foregroundContext;
    f.setTransform(1,0,0,1,0,0);f.clearRect(0,0,foreground.width,foreground.height);f.setTransform(dpr,0,0,dpr,0,0);
    f.globalCompositeOperation='source-over';f.imageSmoothingQuality='high';f.drawImage(image,p.x,p.y,p.w,p.h);
    // Feather only the photo boundaries; the car remains a sharp, undistorted image.
    f.globalCompositeOperation='destination-in';
    for(const [x1,y1,x2,y2,length] of [[p.x,0,p.x+p.w,0,p.w],[0,p.y,0,p.y+p.h,p.h]]){
      const gradient=f.createLinearGradient(x1,y1,x2,y2),edge=Math.min(.1,24/length);
      gradient.addColorStop(0,'transparent');gradient.addColorStop(edge,'#fff');
      gradient.addColorStop(1-edge,'#fff');gradient.addColorStop(1,'transparent');
      f.fillStyle=gradient;f.fillRect(0,0,width,height);
    }
    f.globalCompositeOperation='source-over';b.drawImage(foreground,0,0,width,height);
    renderCache.set(index,buffer);
    // Retain this short six-photo sequence so reverse scrolling reuses identical road pixels.
    while(renderCache.size>Math.min(frameCount,6))renderCache.delete(renderCache.keys().next().value);
    return buffer;
  }

  function paint(now){
    pending=0;
    const rect=root.getBoundingClientRect();
    let target=reduced.matches?1:clamp(-rect.top/Math.max(1,root.offsetHeight-stage.offsetHeight));
    if(target>.9995)target=1;
    const elapsed=lastPaint?Math.min(64,now-lastPaint):16.67;lastPaint=now;
    if(reduced.matches||!active)progress=target;
    else progress+=(target-progress)*(1-Math.exp(-elapsed/75));
    if(Math.abs(target-progress)<.0002)progress=target;
    root.style.setProperty('--drive-progress',progress.toFixed(4));
    root.style.setProperty('--statement-out',ease(.22,.42,progress).toFixed(4));
    cards.forEach((card,index)=>card.style.setProperty('--spec-reveal',reduced.matches?'1':ease(.4+index*.06,.58+index*.06,progress).toFixed(4)));
    if(loaded&&ctx){
      const desired=Math.round(progress*(frameCount-1));
      if(reduced.matches||!active){displayedFrame=desired;transition=null;}
      else if(desired!==(transition?.to??displayedFrame)){
        if(transition)displayedFrame=now-transition.start>55?transition.to:transition.from;
        transition=desired===displayedFrame?null:{from:displayedFrame,to:desired,start:now};
      }
      let blend=transition?ease(0,1,(now-transition.start)/110):0;
      if(transition&&blend>=1){displayedFrame=transition.to;transition=null;blend=0;}
      const first=transition?.from??displayedFrame,next=transition?.to??displayedFrame;
      // Copy complete bitmap pixels so fractional CSS heights cannot retain old edge pixels.
      ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.drawImage(frameBuffer(first),0,0);
      if(transition){ctx.globalAlpha=blend;ctx.drawImage(frameBuffer(next),0,0);ctx.globalAlpha=1;}
      root.dataset.driveFrame=String(transition?.to??displayedFrame);
      root.dataset.driveSourceFrame=String(alignment?.frames[transition?.to??displayedFrame]?.frame??displayedFrame);
      root.dataset.driveSourceNumber=String(alignment?.frames[transition?.to??displayedFrame]?.sourceNumber??displayedFrame);
      root.dataset.driveProgress=progress.toFixed(3);
      root.dataset.driveSettled=String(progress===target&&!transition);
      root.style.setProperty('--drive-ambient-image','url("'+frames[next].src+'")');
      const lockedPlacement=fixedCarPlacement();
      root.driveAlignment={first,next,blend,transitioning:!!transition,carWidth,baseline,lockedCar:!!lockedPlacement,
        firstPlacement:lockedPlacement??placement(first,frames[first].naturalWidth,frames[first].naturalHeight),
        nextPlacement:lockedPlacement??placement(next,frames[next].naturalWidth,frames[next].naturalHeight)};
    }
    if(progress!==target||transition)pending=requestAnimationFrame(paint);else lastPaint=0;
  }

  function requestPaint(){if(!pending)pending=requestAnimationFrame(paint);}
  function measure(){
    const rect=media.getBoundingClientRect();width=rect.width;height=rect.height;dpr=Math.min(devicePixelRatio||1,1.5);
    const fraction=mobile.matches ? Number(root.dataset.driveCarWidthMobile)||.89
      : width<=1100 ? Number(root.dataset.driveCarWidthTablet)||.8 : Number(root.dataset.driveCarWidth)||.66;
    carWidth=Math.min(width*fraction,Number(root.dataset.driveCarMax)||Infinity);
    baseline=Math.min(height*.74,specifications.getBoundingClientRect().top-rect.top-14);
    const stageRect=stage.getBoundingClientRect(),minimumTop=topline.getBoundingClientRect().bottom-stageRect.top+12;
    // Reserve space for the title on short screens; the fixed car uses one uniform scale.
    if(alignment?.car&&root.dataset.driveClearTitle==='true'){
      const anchor=alignment.car,aspect=(anchor.baseline-anchor.bbox[1])/anchor.width;
      const availableHeight=rect.top-stageRect.top+baseline-minimumTop-32-14;
      carWidth=Math.min(carWidth,Math.max(48,availableHeight/aspect));
    }
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    foreground.width=canvas.width;foreground.height=canvas.height;renderCache.clear();
    ctx?.setTransform(dpr,0,0,dpr,0,0);
    if(alignment){
      const p=placement(0,...alignment.referenceSize);
      Object.assign(poster.style,{position:'absolute',maxWidth:'none',objectFit:'fill',left:p.x+'px',top:p.y+'px',width:p.w+'px',height:p.h+'px'});
      const fixed=fixedCarPlacement();
      if(fixed)Object.assign(car.style,{left:fixed.x+'px',top:fixed.y+'px',width:fixed.w+'px',height:fixed.h+'px'});
      if(fixed&&ground)Object.assign(ground.style,{left:(width/2-carWidth*.56)+'px',top:(baseline-carWidth*.035)+'px',width:(carWidth*1.12)+'px',height:(carWidth*.09)+'px'});
      if(root.dataset.driveTitleLayer==='behind-car'&&fixed){
        title.style.fontSize='';title.style.top='';
        const fontSize=parseFloat(getComputedStyle(title).fontSize);
        title.style.top=Math.max(0,fixed.carTop+(fixed.baseline-fixed.carTop)*.30-fontSize*.5)+'px';
      }else if(root.dataset.driveClearTitle==='true'){
        title.style.fontSize='';title.style.top='';
        const carTop=rect.top-stageRect.top+(fixed?.carTop??(p.y+alignment.frames[0].bbox[1]*p.scale));
        const fontSize=Math.min(parseFloat(getComputedStyle(title).fontSize),Math.max(32,carTop-minimumTop-14));
        title.style.fontSize=fontSize+'px';
        title.style.top=Math.max(minimumTop,Math.min(stageRect.height*.22,carTop-fontSize-14))+'px';
      }
    }
    requestPaint();
  }

  async function loadAlignment(){
    if(!root.dataset.driveAlign)return;
    if(!alignmentPromise)alignmentPromise=fetch(root.dataset.driveAlign)
      .then(r=>{if(!r.ok)throw Error('Alignment unavailable');return r.json();})
      .then(data=>{if(data.frames?.length!==frameCount)throw Error('Alignment frame mismatch');alignment=data;})
      .catch(()=>{});
    await alignmentPromise;
  }
  async function loadFrames(){
    const current=++version;loaded=false;root.classList.remove('is-ready');
    const folder=source+(mobile.matches?'/mobile/':'/');
    try{
      await loadAlignment();
      if(car)await car.decode();
      const images=await Promise.all(Array.from({length:frameCount},(_,index)=>new Promise((resolve,reject)=>{
        const image=new Image(),number=alignment?.frames[index]?.frame??index;
        image.decoding='async';image.onload=()=>image.decode().then(()=>resolve(image)).catch(()=>resolve(image));image.onerror=reject;
        image.src=folder+'frame-'+String(number).padStart(3,'0')+'.webp';
      })));
      if(current!==version)return;
      frames=images;loaded=true;measure();root.classList.add('is-ready');
    }catch{/* The source photo and specifications remain usable. */}
  }
  new IntersectionObserver(entries=>{
    active=entries[0].isIntersecting;
    if(active){if(!loaded)loadFrames();measure();}
  },{rootMargin:'450px 0px'}).observe(root);
  addEventListener('scroll',()=>{if(active)requestPaint();},{passive:true});
  addEventListener('resize',measure,{passive:true});
  mobile.addEventListener('change',()=>{if(active)loadFrames();measure();});
  reduced.addEventListener('change',()=>{transition=null;root.classList.toggle('is-static',reduced.matches);measure();});
  root.classList.toggle('is-static',reduced.matches);measure();
  document.fonts?.ready.then(measure);
})();
