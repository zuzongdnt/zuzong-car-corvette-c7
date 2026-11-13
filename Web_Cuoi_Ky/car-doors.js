import {Box3,Group} from './assets/vendor/three/three.module.js';

export function createCarDoors(viewer,button,host){
  const composer=viewer.querySelector('effect-composer');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const status=host.querySelector('[data-door-status]');
  let entries=[],frame=0,progress=0,wanted=false,ready=false,scene,shadowSize;

  function ui(){
    button.disabled=!ready;
    button.setAttribute('aria-pressed',String(wanted));
    button.setAttribute('aria-label',wanted?'Đóng hai cửa xe':'Mở hai cửa xe');
    button.querySelector('[data-doors-label]').textContent=wanted?'Đóng cửa xe':'Mở cửa xe';
    host.dataset.doors=wanted?'open':'closed';
  }
  function apply(value){
    progress=value;
    for(const {pivot,sign} of entries)pivot.rotation.y=sign*value*Math.PI*62/180;
    scene?.queueShadowRender?.();composer.queueRender();
    host.dataset.doorProgress=value.toFixed(4);
  }
  function finish(){
    cancelAnimationFrame(frame);frame=0;
    apply(wanted?1:0);host.dataset.doorsAnimating='false';
    status.textContent=wanted?'Hai cửa xe đã mở. Có thể xoay xe để xem khoang nội thất.':'Hai cửa xe đã đóng.';
  }
  function toggle(){
    if(!ready)return;
    wanted=!wanted;ui();cancelAnimationFrame(frame);
    if(reduced.matches){finish();return;}
    const from=progress,to=wanted?1:0,duration=Math.max(120,780*Math.abs(to-from));
    let start;
    host.dataset.doorsAnimating='true';status.textContent='';
    function animate(now){
      start??=now;const t=Math.min(1,(now-start)/duration);
      apply(from+(to-from)*(t*t*(3-2*t)));
      if(t<1)frame=requestAnimationFrame(animate);else finish();
    }
    frame=requestAnimationFrame(animate);
  }
  function beginLoad(car){
    cancelAnimationFrame(frame);frame=0;
    if(shadowSize&&scene?.shadow){scene.shadow.size.copy(shadowSize);scene.shadow.setSoftness(scene.shadowSoftness);}
    for(const {pivot,parts} of entries){
      for(const {mesh,parent,position,quaternion,scale} of parts){
        parent.add(mesh);mesh.position.copy(position);mesh.quaternion.copy(quaternion);mesh.scale.copy(scale);
        mesh.updateMatrix();
      }
      pivot.removeFromParent();
    }
    entries=[];ready=false;wanted=false;progress=0;scene=null;shadowSize=null;
    button.hidden=car!=='mercedes';status.textContent='';
    host.dataset.doorProgress='0.0000';host.dataset.doorsAnimating='false';ui();
  }
  function modelLoaded(car){
    if(car!=='mercedes')return;
    const selection=Array.from(composer.selection||[]);
    const groups=['L','R'].map(side=>selection.filter(mesh=>mesh.isMesh&&new RegExp(`^SL63_(door|doorpanel|mirror)_${side}_`).test(mesh.name)));
    // This SL63 has complete, separate door panels and mirrors; never rotate a fused body mesh.
    if(groups.some(parts=>!parts.some(mesh=>mesh.name.includes('_paint_')))){
      button.hidden=true;return;
    }
    for(let i=0;i<groups.length;i++){
      const meshes=groups[i],parent=meshes[0].parent;
      if(meshes.some(mesh=>mesh.parent!==parent))return;
      parent.updateWorldMatrix(true,true);
      const panel=meshes.find(mesh=>mesh.name.includes('_paint_'));
      const box=new Box3().setFromObject(panel).applyMatrix4(parent.matrixWorld.clone().invert());
      const pivot=new Group();pivot.name=`Studio door hinge ${i===0?'L':'R'}`;
      pivot.position.set(box.min.x+.045,(box.min.y+box.max.y)/2,(box.min.z+box.max.z)/2);
      parent.add(pivot);pivot.updateWorldMatrix(true,false);
      const parts=meshes.map(mesh=>({mesh,parent,position:mesh.position.clone(),quaternion:mesh.quaternion.clone(),scale:mesh.scale.clone()}));
      meshes.forEach(mesh=>pivot.attach(mesh));
      entries.push({pivot,parts,sign:i===0?-1:1});
      scene=parent;while(scene.parent)scene=scene.parent;
    }
    // The bundled model-viewer 4.4 shadow map needs extra width for the open doors.
    if(scene?.shadow){
      shadowSize=scene.shadow.size.clone();scene.shadow.size.z=Math.max(shadowSize.z,shadowSize.x);
      scene.shadow.setSoftness(scene.shadowSoftness);
    }
    ready=entries.length===2;button.hidden=!ready;ui();apply(0);
  }
  button.addEventListener('click',toggle);
  reduced.addEventListener('change',()=>{if(reduced.matches&&ready)finish();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&ready&&frame)finish();});
  new IntersectionObserver(([entry])=>{if(!entry.isIntersecting&&ready&&frame)finish();}).observe(host);
  return {beginLoad,modelLoaded};
}
