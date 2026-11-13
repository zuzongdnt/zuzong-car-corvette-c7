import { cleanConfig, configText, getCar, readStore, writeStore } from './studio-data.js';

const photoOf = car => ({corvette: 'assets/editorial/user-corvette.jpg', bmw: 'assets/editorial/user-bmw-m4-g82.jpg', porsche: 'assets/editorial/user-porsche-911-gt3.jpg', mercedes: 'assets/editorial/user-mercedes-amg-sl63.jpg', lamborghini: 'assets/editorial/user-revuelto.jpg'})[car] || 'assets/studio/' + car + '-hero.webp';

const stores = ['requests', 'consultations'];
const pending = 'Chờ tư vấn';
const cancelled = 'Đã hủy';
const list = document.querySelector('[data-list]');
const search = document.querySelector('[data-search]');
const filter = document.querySelector('[data-filter]');
const dialog = document.querySelector('.request-dialog');
const content = dialog.querySelector('[data-detail]');
const feedback = document.querySelector('[data-status]');
let records = [];
let openKey = '';

const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));
const timeZone = 'Asia/Ho_Chi_Minh';
const dateFormat = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short', timeZone });
const dayFormat = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeZone });
function formatDate(value, format = dateFormat) {
  const date = new Date(value || NaN);
  return Number.isFinite(date.getTime()) ? format.format(date) : 'Chưa có thông tin';
}
function items(store) {
  const value = readStore(store, []);
  return Array.isArray(value) ? value : [];
}
const keyOf = (store, id) => store + ':' + id;
const statusOf = request => request.status || pending;
const normalize = value => String(value).toLocaleLowerCase('vi').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/đ/g, 'd');
const nameOf = car => car.id === 'mercedes' ? 'Mercedes-AMG SL 63' : car.brand + ' ' + car.name;

function carsOf(request) {
  const configs = Array.isArray(request.configs) ? request.configs : [];
  return configs.filter(config => config?.car).map(config => { const car = getCar(config.car); return { id: car.id, image: photoOf(car.id), name: nameOf(car), spec: configText(cleanConfig(config)) }; });
}

function recordOf(store, request) {
  const cars = carsOf(request);
  const hasConfiguration = cars.length > 0;
  const car = request.car || (request.note === 'Porsche 911 GT3 · Bài viết đánh giá' ? 'porsche' : '');
  if (!hasConfiguration && car) cars.push({ id: getCar(car).id, image: photoOf(getCar(car).id), name: nameOf(getCar(car)), spec: '' });
  const status = statusOf(request);
  const type = request.intent === 'testdrive' ? 'Hẹn lái thử'
    : request.note === 'Yêu cầu báo giá VIP từ Garage' ? 'Báo giá VIP'
      : store === 'requests' && hasConfiguration ? 'Đặt trước' : 'Tư vấn';
  return { store, key: keyOf(store, request.id), request, cars, status, type };
}

function render() {
  records = stores.flatMap(store => items(store)
    .filter(request => request && typeof request === 'object' && request.id != null)
    .map(request => recordOf(store, request)))
    .sort((a, b) => (Date.parse(b.request.created) || 0) - (Date.parse(a.request.created) || 0));
  document.querySelector('[data-total]').textContent = records.length;
  document.querySelector('[data-pending]').textContent = records.filter(record => record.status === pending).length;
  document.querySelector('[data-cancelled]').textContent = records.filter(record => record.status === cancelled).length;
  document.querySelector('[data-empty]').hidden = records.length > 0;
  document.querySelector('[data-history]').hidden = records.length === 0;
  renderList();
}

function renderList() {
  const query = normalize(search.value.trim());
  const visible = records.filter(record => {
    const matchesStatus = filter.value === 'all' || record.status === (filter.value === 'pending' ? pending : cancelled);
    const searchable = [record.request.id, record.type, ...record.cars.map(car => car.name)].join(' ');
    return matchesStatus && normalize(searchable).includes(query);
  });
  document.querySelector('[data-no-results]').hidden = visible.length > 0;
  list.innerHTML = visible.map(({ key, request, type, cars, status }) => `
    <article class="request-card">
<<<<<<< HEAD
      <div class="request-card-content">
        <div class="request-card-header">
          <span class="request-type-badge">${escape(type)}</span>
          <span class="request-status-pill ${status === pending ? 'is-pending' : 'is-cancelled'}">● ${escape(status)}</span>
        </div>
        <h2 class="request-card-title">${escape(cars.map(car => car.name).join(' · ') || 'Yêu cầu tư vấn')}</h2>
        <div class="request-card-meta">
          <span class="request-id-badge">${escape(request.id)}</span>
          <span class="request-date">Ngày tạo: ${formatDate(request.created)}</span>
          ${request.name ? `<span class="request-client">Khách: <strong>${escape(request.name)}</strong></span>` : ''}
        </div>
=======
      <div>
        <p class="garage-kicker">${escape(type)}</p>
        <h2>${escape(cars.map(car => car.name).join(' · ') || 'Yêu cầu tư vấn')}</h2>
        ${cars.length ? `<div class="request-car-previews">${cars.map(car => `<figure><img src="${escape(car.image)}" alt="${escape(car.name)}" loading="lazy"><figcaption>${escape(car.name)}</figcaption></figure>`).join('')}</div>` : ''}
        <p class="garage-note">${escape(request.id)} · ${formatDate(request.created)}</p>
        <div class="request-meta"><span class="request-status">${escape(status)}</span></div>
>>>>>>> 2e77d95ccd7e88204618b69e7d364c5bb77b68e2
      </div>
      <button class="garage-button garage-primary request-open-btn" type="button" data-open="${escape(key)}" aria-label="Xem chi tiết ${escape(request.id)}">
        <span>Xem chi tiết</span>
        <span aria-hidden="true">↗</span>
      </button>
    </article>`).join('');
}

function showDetail(record) {
  const { request, status, cars, type } = record;
  const fields = [
    ['Mã yêu cầu', request.id], ['Trạng thái', status], ['Loại yêu cầu', type],
    ['Ngày tạo', formatDate(request.created)], ['Họ và tên', request.name],
    ['Email', request.email], ['Số điện thoại', request.phone],
    ['Ngày mong muốn', request.date ? formatDate(request.date, dayFormat) : ''],
    ['Ngày hủy', request.cancelledAt ? formatDate(request.cancelledAt) : '']
  ].filter(([, value]) => value);
  dialog.querySelector('h2').textContent = 'Chi tiết yêu cầu — ' + escape(request.id);
  content.innerHTML = `
<<<<<<< HEAD
    <div class="request-detail-sheet">
      <div class="request-detail-badge-row">
        <span class="request-type-badge">${escape(type)}</span>
        <span class="request-status-pill ${status === pending ? 'is-pending' : 'is-cancelled'}">● ${escape(status)}</span>
      </div>
      <dl class="request-fields">${fields.map(([label, value]) => `<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>
      ${cars.length ? `
      <div class="request-detail-cars-section">
        <h3>Thông tin cấu hình siêu xe</h3>
        <ul class="request-specs" aria-label="Xe và cấu hình">${cars.map(car => `
          <li>
            <strong>${escape(car.name)}</strong>
            ${car.spec ? `<p class="garage-note">${escape(car.spec)}</p>` : ''}
          </li>`).join('')}
        </ul>
      </div>` : ''}
      ${request.note ? `
      <div class="request-detail-note-section">
        <small>Ghi chú của khách hàng</small>
        <p>${escape(request.note)}</p>
      </div>` : ''}
      ${status === pending ? '<div class="request-detail-actions"><button class="garage-button request-cancel-btn" type="button" data-cancel>Hủy yêu cầu này ×</button></div>' : ''}
    </div>`;
=======
    <dl class="request-fields">${fields.map(([label, value]) => `<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>
    ${cars.length ? `<ul class="request-specs" aria-label="Xe và cấu hình">${cars.map(car => `<li class="request-spec-car"><img src="${escape(car.image)}" alt="${escape(car.name)}" loading="lazy"><div><strong>${escape(car.name)}</strong>${car.spec ? `<p class="garage-note">${escape(car.spec)}</p>` : ''}</div></li>`).join('')}</ul>` : ''}
    ${request.note ? `<p><strong>Ghi chú</strong><br>${escape(request.note)}</p>` : ''}
    ${status === pending ? '<div class="request-detail-actions"><button class="garage-button" type="button" data-cancel>Hủy yêu cầu</button></div>' : ''}`;
>>>>>>> 2e77d95ccd7e88204618b69e7d364c5bb77b68e2
  if (!dialog.open) dialog.showModal();
}

function cancelRequest(record) {
  const latest = items(record.store);
  const index = latest.findIndex(request => request && keyOf(record.store, request.id) === record.key);
  if (index < 0 || statusOf(latest[index]) !== pending) {
    dialog.close();
    render();
    feedback.textContent = 'Yêu cầu vừa thay đổi. Danh sách đã được cập nhật.';
    return;
  }
  latest[index] = { ...latest[index], status: cancelled, cancelledAt: new Date().toISOString() };
  if (!writeStore(record.store, latest)) {
    content.querySelector('[data-cancel-error]').textContent = 'Chưa lưu được trạng thái hủy. Vui lòng thử lại.';
    return;
  }
  dialog.close();
  render();
  feedback.textContent = 'Đã hủy yêu cầu ' + record.request.id + '.';
  const trigger = [...list.querySelectorAll('[data-open]')].find(button => button.dataset.open === record.key);
  (trigger ?? filter).focus({ preventScroll: true });
}

list.addEventListener('click', event => {
  const key = event.target.closest('[data-open]')?.dataset.open;
  const record = records.find(item => item.key === key);
  if (!record) return;
  openKey = key;
  showDetail(record);
});
content.addEventListener('click', event => {
  const record = records.find(item => item.key === openKey);
  if (!record) return;
  if (event.target.closest('[data-cancel]')) {
    dialog.querySelector('h2').textContent = 'Hủy yêu cầu này?';
    content.innerHTML = `<p>Yêu cầu <strong>${escape(record.request.id)}</strong> sẽ chuyển sang trạng thái Đã hủy và vẫn xuất hiện trong lịch sử.</p>
      <p class="garage-status" role="status" data-cancel-error></p>
      <button class="garage-button" type="button" data-back>Quay lại</button>
      <button class="garage-button garage-primary" type="button" data-confirm-cancel>Xác nhận hủy</button>`;
    content.querySelector('[data-back]').focus();
  }
  if (event.target.closest('[data-back]')) {
    showDetail(record);
    content.querySelector('[data-cancel]')?.focus();
  }
  if (event.target.closest('[data-confirm-cancel]')) cancelRequest(record);
});
dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
search.addEventListener('input', renderList);
filter.addEventListener('change', renderList);
window.addEventListener('storage', event => {
  if (event.key !== null && !stores.some(store => event.key === 'zuzong.' + store)) return;
  render();
  if (dialog.open) {
    const record = records.find(item => item.key === openKey);
    if (record) showDetail(record);
    else dialog.close();
  }
});
window.addEventListener('pageshow', event => { if (event.persisted) render(); });
render();
