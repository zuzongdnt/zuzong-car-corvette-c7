import {changeProductImage} from './products-motion.js';
import {cars} from './studio-data.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const testDrivePhotos={
  corvette:'assets/test-drive-real/corvette-rear.jpg',
  bmw:'assets/test-drive-real/bmw-rear.jpg',
  porsche:'assets/test-drive-real/porsche-rear.jpg',
  mercedes:'assets/test-drive-real/mercedes-rear.jpg',
  lamborghini:'assets/test-drive-real/lamborghini-rear-alt.jpg'
};
const testDriveImage=carId=>testDrivePhotos[carId]||testDrivePhotos.corvette;

export function mountSmartTestDrive(host,studio){
  if(!host||host.dataset.mounted)return;
  host.dataset.mounted='true';
  let carId='lamborghini';
  try{carId=JSON.parse(studio?.dataset.config||'{}').car||studio?.dataset.car||carId;}catch{}
  const today=new Date(),dateMin=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
  host.innerHTML=`<div class="z-test-shell"><header class="z-test-heading"><div><p class="z-experience-kicker">SMART TEST DRIVE</p><h2>Thử cảm giác lái<br><em>theo lịch của bạn.</em></h2></div><p>Chọn mẫu xe, ngày và khung giờ để xem trước giao diện hẹn lái thử.</p></header><div class="z-test-layout"><form class="z-test-form" data-test-form><label>Mẫu xe<select name="car" data-test-car>${cars.map(car=>`<option value="${car.id}">${esc(car.brand)} ${esc(car.name)}</option>`).join('')}</select></label><label>Địa điểm dự kiến<select name="place"><option>TP. Hồ Chí Minh · mô phỏng</option><option>Hà Nội · mô phỏng</option><option>Đà Nẵng · mô phỏng</option></select></label><label>Ngày muốn lái thử<input name="date" type="date" min="${dateMin}" value="${dateMin}" required></label><label>Khung giờ<select name="time"><option>09:00</option><option>10:30</option><option>13:30</option><option>15:00</option><option>16:30</option></select></label><button type="submit">Xem trước lịch hẹn <span aria-hidden="true">↗</span></button><small>Địa điểm và lịch là dữ liệu giao diện mẫu. Nút này không gửi yêu cầu đến showroom.</small></form><aside class="z-test-preview" data-test-preview aria-live="polite"><span>TRẢI NGHIỆM CỦA BẠN</span><img data-test-image alt=""><strong data-test-model></strong><dl><div><dt>Ngày</dt><dd data-test-date></dd></div><div><dt>Giờ</dt><dd data-test-time></dd></div><div><dt>Địa điểm</dt><dd data-test-place></dd></div></dl><p data-test-status role="status">Chọn lịch để xem trước.</p></aside></div></div>`;
  const form=host.querySelector('[data-test-form]'),select=form.elements.car;
  select.value=carId;
  function syncModel(){const car=cars.find(item=>item.id===select.value)||cars[0];host.querySelector('[data-test-model]').textContent=`${car.brand} ${car.name}`;const image=host.querySelector('[data-test-image]');changeProductImage(image, testDriveImage(car.id), `${car.brand} ${car.name}, ảnh xe tham khảo`);}
  studio?.addEventListener('studio-change',event=>{if(cars.some(car=>car.id===event.detail?.car)){select.value=event.detail.car;syncModel();}});
  select.addEventListener('change',syncModel);
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form),date=new Date(`${data.get('date')}T00:00:00`);
    host.querySelector('[data-test-date]').textContent=new Intl.DateTimeFormat('vi-VN',{dateStyle:'long'}).format(date);
    host.querySelector('[data-test-time]').textContent=data.get('time');
    host.querySelector('[data-test-place]').textContent=data.get('place');
    host.querySelector('[data-test-status]').textContent='Đây là bản xem trước, chưa có lịch hẹn nào được gửi đi.';
    host.querySelector('[data-test-preview]').classList.add('is-confirmed');
  });
  form.elements.date.min=dateMin;
  syncModel();
}
