import './assets/vendor/model-viewer-effects/model-viewer-effects.min.js';

function profile(car,name){
  if(name.startsWith('STUDIO_LIGHT | front |'))return {kind:'front',strength:17,color:[.84,.94,1]};
  const names={
    corvette:{front:['Daylight Cover','Main Headlight Lens'],rear:['Tail Lights Red Cover','Tail Lights Red Cover 2']},
    bmw:{front:['BMW | LED daylight'],rear:['BMW | Den hau Material.023','BMW | Den hau Material.022','BMW | Den hau Material.020']},
    porsche:{front:[],rear:['RED_GLASS']},
    mercedes:{front:['SL63_runninglight-Fr.001','SL63_runninglight-Fl.001','SL63_lowbeams-F.002'],rear:['SL63_runninglight-R.001','SL63_brakelight.001','SL63_beams-R.001']},
    lamborghini:{front:['White'],rear:['red','back-light-tex','Red Emission']}
  }[car];
  if(names?.front.includes(name))return {kind:'front',strength:car==='corvette'?15:13.5,color:[.84,.94,1]};
  if(names?.rear.includes(name))return {kind:'rear',strength:9,color:[1,.008,.016]};
  return null;
}

export function createCarLights(viewer,button,host){
  const mobile=matchMedia('(max-width:760px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const composer=document.createElement('effect-composer');composer.setAttribute('render-mode','quality');composer.setAttribute('msaa',mobile.matches?'0':'2');
  const bloom=document.createElement('selective-bloom-effect');bloom.setAttribute('strength','0');bloom.setAttribute('radius','.5');bloom.setAttribute('threshold','.28');bloom.setAttribute('smoothing','.3');bloom.selection=[];composer.append(bloom);
  let wanted=false,ready=false,level=0,frame=0,last=0,car='',entries=[],meshes=[];
  const status=host.querySelector('[data-light-status]');
  const exposure=viewer.exposure,shadowIntensity=viewer.shadowIntensity;
  function ui(){
    button.disabled=!ready;
    button.setAttribute('aria-pressed',String(wanted));
    button.querySelector('[data-lights-label]').textContent=wanted?'Đèn xe đang bật sáng':'Bật đèn xe';
    button.setAttribute('aria-label',wanted?'Tắt đèn xe':'Bật đèn xe');
    host.dataset.lights=wanted?'on':'off';
  }
  function beginLoad(){
    cancelAnimationFrame(frame);frame=0;last=0;ready=false;entries=[];meshes=[];level=0;
    bloom.selection=[];bloom.strength=0;ui();
  }
  function apply(value){
    level=value;
    for(const entry of entries){entry.material.setEmissiveFactor(entry.color);entry.material.setEmissiveStrength(entry.strength*level);}
    bloom.strength=1.4*level;
    viewer.exposure=exposure*(1-.15*level);
    viewer.shadowIntensity=shadowIntensity+.3*level;
    host.dataset.lightLevel=level.toFixed(3);composer.queueRender();
  }
  function animate(now){
    frame=0;
    if(!ready)return;
    const target=wanted?1:0;
    const dt=Math.min(50,last?now-last:16);last=now;
    const next=reduced.matches?target:level+(target-level)*(1-Math.exp(-dt/95));
    const settled=Math.abs(next-target)<.003;
    apply(settled?target:next);
    if(!settled)frame=requestAnimationFrame(animate);else{last=0;status.textContent=wanted?'Đèn trước và đèn hậu đang sáng rõ.':'Đèn xe đã tắt.';}
  }
  function toggle(){if(!ready)return;wanted=!wanted;ui();cancelAnimationFrame(frame);last=0;frame=requestAnimationFrame(animate);}
  function bind(){
    if(!viewer.loaded||!viewer.model||!car)return;
    cancelAnimationFrame(frame);
    entries=viewer.model.materials.map(material=>{const p=profile(car,material.name);return p?{material,...p}:null;}).filter(Boolean);
    const selection=Array.from(composer.selection||[]);
    meshes=selection.filter(mesh=>mesh.isMesh&&profile(car,mesh.material?.name));
    // Select only actual lamp meshes; paint, wheels, glass and the floor never enter the glow pass.
    bloom.selection=meshes;
    ready=entries.some(e=>e.kind==='front')&&entries.some(e=>e.kind==='rear')&&meshes.length>0;
    if(!ready){ui();return;}
    host.dataset.lightMaterials=JSON.stringify(entries.map(e=>({name:e.material.name,kind:e.kind})));
    apply(wanted?1:0);ui();
  }
  composer.addEventListener('updated-selection',bind);
  button.addEventListener('click',toggle);
  viewer.append(composer);
  return {beginLoad,modelLoaded(id){car=id;bind();},get on(){return wanted;}};
}
