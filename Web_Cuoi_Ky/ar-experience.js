import {cars,getCar} from './studio-data.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export async function mountARExperience(host,studio){
  if(!host||host.dataset.mounted)return;
  host.dataset.mounted='true';
  const initial=()=>{
    try{return JSON.parse(studio?.dataset.config||'{}').car||studio?.dataset.car||'lamborghini';}catch{return studio?.dataset.car||'lamborghini';}
  };
  host.innerHTML=`<div class="z-ar-shell"><div class="z-ar-copy"><p class="z-experience-kicker">AR EXPERIENCE</p><h2>Mang chiếc xe<br><em>vào không gian thật.</em></h2><p>Chọn một trong năm mẫu xe. Trên điện thoại tương thích, đặt mô hình 3D lên mặt sàn; trên thiết bị khác, mở bản xem xe 3D tương tác.</p><div class="z-ar-car-tabs" role="group" aria-label="Chọn xe để xem AR hoặc 3D">${cars.map(car=>`<button type="button" data-ar-car-choice="${car.id}" aria-pressed="false">${esc(car.brand)}</button>`).join('')}</div><div class="z-ar-current"><span>Đang chọn</span><strong data-ar-car></strong></div><button class="z-ar-launch" type="button" data-ar-launch>Xem xe trong AR / 3D <span aria-hidden="true">↗</span></button><p class="z-ar-status" data-ar-status role="status" aria-live="polite">Chọn xe rồi mở AR. Màu sơn có thể khác khi chuyển sang ứng dụng AR.</p><a class="z-ar-help" href="docs/STUDIO_MODEL_SOURCES.md" target="_blank" rel="noopener">Thông tin model 3D và nguồn ↗</a></div><div class="z-ar-visual"><img data-ar-image alt=""><span class="z-ar-corner z-ar-corner--tl" aria-hidden="true"></span><span class="z-ar-corner z-ar-corner--br" aria-hidden="true"></span><div class="z-ar-ground" aria-hidden="true"></div><span class="z-ar-chip">MÔ HÌNH 3D · AR</span></div></div><dialog class="z-ar-dialog" data-ar-dialog aria-labelledby="z-ar-dialog-title"><div class="z-ar-dialog-inner"><header><div><span>XEM MÔ HÌNH 3D</span><strong id="z-ar-dialog-title" data-ar-dialog-car></strong></div><button type="button" data-ar-close aria-label="Đóng trình xem 3D">×</button></header><model-viewer data-ar-model camera-controls touch-action="pan-y" ar ar-modes="webxr scene-viewer quick-look" ar-scale="auto" ar-placement="floor" shadow-intensity="1.4" exposure="1.05" interaction-prompt="auto" loading="eager" alt="Mô hình xe 3D tương tác"></model-viewer><p>Kéo để xoay và chụm để thu phóng. Đặt xe vào không gian thật cần thiết bị hỗ trợ AR.</p></div></dialog>`;
  const image=host.querySelector('[data-ar-image]');
  const status=host.querySelector('[data-ar-status]');
  const dialog=host.querySelector('[data-ar-dialog]');
  const arModel=host.querySelector('[data-ar-model]');
  let carId=initial();
  function render(){
    const car=getCar(carId);
    host.querySelector('[data-ar-car]').textContent=`${car.brand} ${car.name}`;
    host.querySelector('[data-ar-dialog-car]').textContent=`${car.brand} ${car.name}`;
    image.src=`assets/gallery-real-v1/${car.id}-rear-real-v1.webp`;
    image.alt=`${car.brand} ${car.name}, ảnh tham khảo trước khi mở mô hình AR`;
    host.querySelectorAll('[data-ar-car-choice]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.arCarChoice===car.id)));
    if(dialog.open)arModel.src=`assets/model/studio-clean/${car.id}.glb`;
  }
  const selectCar=id=>{
    if(!cars.some(car=>car.id===id))return;
    carId=id;render();
    const studioButton=studio?.querySelector(`[data-brand="${id}"]`);
    if(studioButton?.getAttribute('aria-pressed')!=='true')studioButton?.click();
  };
  host.addEventListener('click',event=>{const choice=event.target.closest('[data-ar-car-choice]');if(choice)selectCar(choice.dataset.arCarChoice);});
  function open3D(){arModel.src=`assets/model/studio-clean/${carId}.glb`;arModel.alt=`${getCar(carId).brand} ${getCar(carId).name}, mô hình 3D tương tác`;if(!dialog.open)dialog.showModal();status.textContent='Đang mở model 3D để xoay và thu phóng. Đặt xe vào phòng cần điện thoại có hỗ trợ AR.';}
  host.querySelector('[data-ar-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  host.addEventListener('click',event=>{
    if(!event.target.closest('[data-ar-launch]'))return;
    const viewer=studio?.querySelector('model-viewer');
    if(!viewer?.loaded){status.textContent='Model của xe đang tải trong Studio. Chờ xe hiện đầy đủ rồi bấm lại.';studio?.scrollIntoView({behavior:'smooth',block:'center'});return;}
    if(!viewer.canActivateAR){open3D();return;}
    viewer.activateAR().then(()=>{status.textContent='Đang mở trình xem AR của thiết bị. Hãy tìm mặt sàn phẳng để đặt xe.';}).catch(open3D);
  });
  studio?.addEventListener('studio-change',event=>{if(event.detail?.car&&cars.some(car=>car.id===event.detail.car)){carId=event.detail.car;render();}});
  render();
}
