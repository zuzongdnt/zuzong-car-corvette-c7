import {cars,getCar} from './studio-data.js';

const soundProfiles={
  corvette:{root:54,pan:-.08,signature:'V8 · trầm, dày',layers:[[1,.58,'sawtooth'],[1.5,.12,'triangle'],[2,.08,'sine'],[3,.035,'triangle']]},
  bmw:{root:70,pan:-.16,signature:'I6 tăng áp · mượt, cân bằng',layers:[[1,.56,'triangle'],[2,.18,'sine'],[3,.07,'triangle'],[4,.025,'sine']]},
  porsche:{root:86,pan:.08,signature:'Boxer 6 · cao, gọn',layers:[[1,.48,'triangle'],[1.5,.09,'sine'],[2.2,.14,'sine'],[3.1,.04,'triangle']]},
  mercedes:{root:49,pan:.12,signature:'V8 tăng áp · sâu, ấm',layers:[[1,.62,'sawtooth'],[1.25,.12,'triangle'],[2,.095,'sine'],[2.6,.025,'sine']]},
  lamborghini:{root:64,pan:.2,signature:'V12 hybrid · nhiều lớp, sáng',layers:[[1,.5,'sawtooth'],[1.5,.12,'triangle'],[2,.105,'sine'],[3,.065,'triangle'],[4.2,.025,'sine']]}
};

export function mountSoundExperience(host,studio){
  if(!host||host.dataset.mounted)return;
  host.dataset.mounted='true';
  let carId='lamborghini';
  try{const config=JSON.parse(studio?.dataset.config||'{}');if(config.car)carId=config.car;}catch{}
  host.innerHTML=`<div class="z-sound-shell"><div class="z-sound-copy"><p class="z-experience-kicker">SOUND EXPERIENCE</p><h2>Nghe không gian<br><em>thay đổi theo bạn.</em></h2><p>Chọn mẫu xe để xem video minh họa và nghe phối âm thay đổi theo cấu hình động cơ.</p><small>Video xe chạy không tiếng; nút phát bên dưới bật âm thanh mô phỏng do trình duyệt tạo ra. Đây chưa phải bản thu tiếng máy thật.</small></div><div class="z-sound-player"><div class="z-sound-visual"><video data-sound-video muted autoplay loop playsinline preload="none"></video><span class="z-sound-video-caption" data-sound-video-caption></span></div><div class="z-sound-controls"><div class="z-sound-meta"><span>MẪU XE ĐANG CHỌN</span><strong data-sound-car></strong></div><p class="z-sound-signature" data-sound-signature></p><div class="z-sound-car-tabs" role="group" aria-label="Chọn một trong năm mẫu xe">${cars.map(car=>`<button type="button" data-sound-car-choice="${car.id}" aria-pressed="false">${car.brand}</button>`).join('')}</div><div class="z-sound-modes" role="group" aria-label="Chọn sắc thái phối âm"><button type="button" data-tone="calm" aria-pressed="true">Trầm</button><button type="button" data-tone="balanced" aria-pressed="false">Cân bằng</button><button type="button" data-tone="spatial" aria-pressed="false">Không gian</button></div><div class="z-sound-actions"><button type="button" class="z-sound-play" data-sound-play><span aria-hidden="true">▶</span> Phát âm thanh 8 giây</button><label>Âm lượng <input type="range" data-sound-volume min="0" max="0.45" step="0.01" value="0.18"></label></div><p class="z-sound-status" data-sound-status role="status" aria-live="polite">Bấm phát để nghe âm thanh minh họa cùng video.</p></div></div></div>`;
  const playButton=host.querySelector('[data-sound-play]');
  const volume=host.querySelector('[data-sound-volume]');
  const status=host.querySelector('[data-sound-status]');
  const video=host.querySelector('[data-sound-video]');
  const videoCaption=host.querySelector('[data-sound-video-caption]');
  const carLabel=host.querySelector('[data-sound-car]');
  const signature=host.querySelector('[data-sound-signature]');
  let mode='calm',context=null,nodes=[],masterGain=null,timer=0,isPlaying=false;
  const tones={calm:{rate:.86,pan:-.2,brightness:.82},balanced:{rate:1,pan:0,brightness:1},spatial:{rate:1.12,pan:.24,brightness:1.25}};
  function stop(message=''){
    clearTimeout(timer);
    nodes.forEach(node=>{try{node.stop?.();node.disconnect?.();}catch{}});
    nodes=[];masterGain=null;isPlaying=false;
    playButton.innerHTML='<span aria-hidden="true">▶</span> Phát âm thanh 8 giây';
    if(message)status.textContent=message;
  }
  function play(){
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio){status.textContent='Trình duyệt này chưa hỗ trợ Web Audio.';return;}
    stop();
    try{
      context=context||new Audio();
      context.resume();
      const now=context.currentTime,profile=soundProfiles[carId]||soundProfiles.corvette,tone=tones[mode];
      const master=context.createGain(),filter=context.createBiquadFilter(),pan=context.createStereoPanner();
      masterGain=master;master.gain.setValueAtTime(Number(volume.value),now);
      filter.type='lowpass';filter.frequency.setValueAtTime(620*tone.brightness,now);filter.Q.setValueAtTime(.55,now);
      pan.pan.setValueAtTime(Math.max(-.65,Math.min(.65,profile.pan+tone.pan)),now);
      master.connect(filter).connect(pan).connect(context.destination);
      for(const [multiple,level,wave] of profile.layers){
        const oscillator=context.createOscillator(),gain=context.createGain();
        oscillator.type=wave;
        oscillator.frequency.setValueAtTime(profile.root*multiple*tone.rate,now);
        gain.gain.setValueAtTime(level,now);
        oscillator.connect(gain).connect(master);oscillator.start(now);oscillator.stop(now+8.2);
        nodes.push(oscillator,gain);
      }
      nodes.push(master,filter,pan);isPlaying=true;
      playButton.innerHTML='<span aria-hidden="true">■</span> Dừng âm thanh';
      status.textContent=`Đang phát phối âm minh họa cho ${getCar(carId).brand} ${getCar(carId).name}. Mẫu tự dừng sau 8 giây.`;
      timer=setTimeout(()=>stop('Mẫu âm thanh đã kết thúc. Bấm phát để nghe lại.'),8200);
    }catch{status.textContent='Không thể phát mẫu âm thanh trên trình duyệt này.';stop();}
  }
  const setCar=id=>{
    if(!cars.some(car=>car.id===id))return;
    const wasPlaying=isPlaying;
    carId=id;const car=getCar(id),profile=soundProfiles[id];
    carLabel.textContent=`${car.brand} ${car.name}`;
    signature.textContent=`Âm thanh tổng hợp · không phải tiếng xe gốc · ${car.engine} · ${profile.signature}`;
    video.src=`assets/feature-videos/${id}-full-car.mp4`;
    video.setAttribute('aria-label',`Video minh họa ${car.brand} ${car.name}`);
    videoCaption.textContent=`${car.brand} ${car.name} · video minh họa`;
    video.load();video.play().catch(()=>{});
    host.querySelectorAll('[data-sound-car-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.soundCarChoice===id)));
    if(wasPlaying)play();
  };
  playButton.addEventListener('click',()=>isPlaying?stop('Đã dừng âm thanh minh họa.'):play());
  volume.addEventListener('input',()=>{if(context?.state==='running'&&masterGain)masterGain.gain.setTargetAtTime(Number(volume.value),context.currentTime,.04);});
  host.addEventListener('click',event=>{
    const button=event.target.closest('[data-tone]');if(!button)return;
    mode=button.dataset.tone;
    host.querySelectorAll('[data-tone]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    if(isPlaying)play();
  });
  host.addEventListener('click',event=>{const button=event.target.closest('[data-sound-car-choice]');if(button)setCar(button.dataset.soundCarChoice);});
  studio?.addEventListener('studio-change',event=>setCar(event.detail?.car));
  setCar(carId);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stop('Âm thanh đã tạm dừng khi bạn rời trang.');video.pause();}else video.play().catch(()=>{});});
}
