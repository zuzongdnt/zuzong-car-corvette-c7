import {
  cars, cleanConfig, getCar, colorOf, colorsFor, equipmentChoice, equipmentFor,
  configurationPrice, money, poster, readStore, writeStore
} from './studio-data.js';

const samples = [
  { id: 'GT3-SHARK-01', car: 'porsche', body: 'shark-blue', rims: 'satin-neodyme', calipers: 'yellow', interior: 'black-leather-alcantara-blue', carbon: 'carbon-pccb' },
  { id: 'REV-VERDE-02', car: 'lamborghini', body: 'verde-scandal', rims: 'altanero-black', calipers: 'black', carbon: 'full-carbon' }
];
const gallery = document.querySelector('[data-gallery]');
const empty = document.querySelector('[data-empty]');
const actionPanel = document.querySelector('[data-actions]');
const status = document.querySelector('[data-status]');
const selectionLabel = document.querySelector('[data-selection-label]');
const dialog = document.querySelector('.garage-dialog');
const dialogContent = dialog.querySelector('[data-dialog-content]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const localFile = location.protocol === 'file:';
const selected = new Set();
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const list = key => {
  const value = readStore(key, []);
  return Array.isArray(value) ? value : [];
};
const savedItems = () => list('saved').filter(item => item && typeof item === 'object' && item.id != null);
const carName = config => {
  const car = getCar(config.car);
  return car.id === 'mercedes' ? 'Mercedes-AMG SL 63' : car.brand + ' ' + car.name;
};
const specs = config => [
  ['Màu sơn', colorOf(config, 'body').name],
  ['Mâm xe', colorOf(config, 'rims').name],
  ['Heo phanh', colorOf(config, 'calipers').name],
  ['Nội thất', equipmentChoice(config, 'interior')?.name ?? 'Tiêu chuẩn'],
  ['Gói carbon / phanh', equipmentChoice(config, 'carbon')?.name ?? 'Tiêu chuẩn']
];

const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.filter(entry => entry.isIntersecting).forEach(({ target }) => {
    if (!reduced.matches) target.classList.add('garage-revealed');
    observer.unobserve(target);
  });
}, { threshold: .16 }) : null;

function updateActions() {
  const count = selected.size;
  selectionLabel.textContent = count ? 'Đã chọn ' + count + ' bản phối.' : 'Chọn một bản phối để thao tác. Chọn từ hai bản phối để so sánh.';
  actionPanel.querySelectorAll('[data-action]').forEach(button => {
    const action = button.dataset.action;
    button.disabled = action === 'compare' ? count < 2 : action === 'quote' ? count === 0 : count !== 1;
  });
}

function render(items = savedItems()) {
  const ids = new Set(items.map(item => String(item.id)));
  selected.forEach(id => { if (!ids.has(id)) selected.delete(id); });
  const user = readStore('user', null);
  document.querySelector('[data-greeting]').textContent = user?.name ? 'Xin chào, ' + user.name : 'Garage của bạn';
  document.querySelector('[data-count]').textContent = items.length;
  document.querySelector('[data-budget]').textContent = money(items.reduce((sum, item) => sum + configurationPrice(item), 0));
  actionPanel.hidden = !items.length;
  document.querySelector('[data-create-more]').hidden = !items.length;
  empty.hidden = Boolean(items.length);
  observer?.disconnect();
  gallery.innerHTML = items.map(item => {
    const config = cleanConfig(item);
    const id = escape(item.id);
    const name = carName(config);
    return `
      <article class="garage-card" data-card="${id}">
        <div class="garage-photo">
          <img src="${poster(config.car)}" alt="${name}, ảnh Studio tham khảo" loading="lazy" decoding="async">
          <img src="${poster(config.car, 'side')}" alt="" loading="lazy" decoding="async">
        </div>
        <div class="garage-card-body">
          <p class="garage-kicker">Config ID · ${id}</p>
          <h2>${name}</h2>
          <dl class="grid gap-3 sm:grid-cols-2">
            ${specs(config).map(([label, value], index) => `<div><dt>${label}</dt><dd>${index === 0 ? `<span class="garage-chip" style="--paint:${colorOf(config, 'body').hex}" aria-hidden="true"></span>` : ''}${value}</dd></div>`).join('')}
          </dl>
          <p class="garage-price">${money(configurationPrice(config))}</p>
          <p class="garage-note">Ảnh Studio tham khảo${localFile ? '' : ' · Mở bản phối 3D để xem màu đã chọn'}.</p>
          <div class="garage-card-actions flex flex-wrap gap-2">
            <label><input type="checkbox" value="${id}" ${selected.has(String(item.id)) ? 'checked' : ''} aria-label="Chọn ${name}, mã ${id}"> Chọn</label>
            <button class="garage-button" type="button" data-preview="${id}">${localFile ? 'Xem ảnh xe' : 'Xem bản phối 3D'}</button>
            <button class="garage-button" type="button" data-edit="${id}">Chỉnh sửa</button>
            <button class="garage-button" type="button" data-remove="${id}">Xóa</button>
          </div>
        </div>
      </article>`;
  }).join('');
  [...gallery.children].forEach(card => observer?.observe(card));
  updateActions();
}

function openDialog(title, content) {
  dialog.querySelector('h2').textContent = title;
  dialogContent.innerHTML = content;
  dialog.showModal();
}
dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());

function configurationForm(item) {
  const config = cleanConfig(item);
  const carField = item ? `<input type="hidden" name="car" value="${config.car}">` :
    `<label>Dòng xe<select name="car">${cars.map(car => `<option value="${car.id}">${carName({ car: car.id })}</option>`).join('')}</select></label>`;
  openDialog(item ? 'Chỉnh sửa ' + carName(config) : 'Tạo bản phối', `
    <form class="garage-form">
      ${carField}<div class="garage-form" data-options></div>
      <p>Chi phí dự tính · <strong data-estimate></strong></p>
      <p class="garage-note" role="status" data-form-status></p>
      <button class="garage-button garage-primary" type="submit">Lưu cấu hình</button>
    </form>`);
  const form = dialogContent.querySelector('form');
  const options = form.querySelector('[data-options]');
  const estimate = form.querySelector('[data-estimate]');
  const readConfig = () => cleanConfig(Object.fromEntries(new FormData(form)));
  const field = (part, label, choices, value) => `<label>${label}<select name="${part}">
    ${choices.map(choice => `<option value="${choice.id}"${choice.id === value ? ' selected' : ''}>${choice.name}</option>`).join('')}
  </select></label>`;
  function updateOptions(current) {
    const colors = [['body', 'Màu sơn'], ['rims', 'Mâm xe'], ['calipers', 'Heo phanh']];
    const equipment = [['interior', 'Nội thất'], ['carbon', 'Gói carbon / phanh']];
    const colorFields = colors.map(([part, label]) => field(part, label, colorsFor(current.car, part), current[part]));
    const equipmentFields = equipment.flatMap(([part, label]) => {
      const choices = equipmentFor(current.car, part);
      return choices.length ? [field(part, label, [{ id: '', name: 'Tiêu chuẩn' }, ...choices], current[part])] : [];
    });
    options.innerHTML = [...colorFields, ...equipmentFields].join('');
  }
  form.elements.car.value = config.car;
  updateOptions(config);
  estimate.textContent = money(configurationPrice(config));
  form.addEventListener('change', event => {
    if (event.target === form.elements.car) updateOptions(readConfig());
    estimate.textContent = money(configurationPrice(readConfig()));
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const items = savedItems();
    const id = item?.id ?? crypto.randomUUID();
    const index = item ? items.findIndex(entry => String(entry.id) === String(id)) : -1;
    const feedback = form.querySelector('[data-form-status]');
    if (item && index < 0) {
      feedback.textContent = 'Bản phối này đã bị xóa khỏi Garage.';
      return;
    }
    const updated = { ...readConfig(), id };
    if (item) items[index] = updated;
    else items.unshift(updated);
    if (!writeStore('saved', items)) {
      feedback.textContent = 'Chưa lưu được bản phối. Vui lòng thử lại.';
      return;
    }
    dialog.close();
    render(items);
    status.textContent = item ? 'Đã cập nhật bản phối.' : 'Đã lưu bản phối mới.';
    [...gallery.children].find(card => card.dataset.card === String(id))?.querySelector('[data-edit]').focus();
  });
}

if (localFile) {
  document.querySelectorAll('[data-create]').forEach(link => {
    if (link.textContent === 'Studio 3D') link.textContent = 'Tạo cấu hình';
    link.addEventListener('click', event => {
      event.preventDefault();
      configurationForm();
    });
  });
}

async function edit(id, card) {
  const config = savedItems().find(item => String(item.id) === id);
  if (!config) { render(); return; }
  if (localFile) { configurationForm(config); return; }
  if (card && !reduced.matches) {
    card.classList.add('garage-exit');
    await Promise.allSettled(card.getAnimations().map(animation => animation.finished));
  }
  location.href = 'products.html?' + new URLSearchParams({ ...cleanConfig(config), saved: id }) + '#products-studio';
}

async function preview(id) {
  const item = savedItems().find(entry => String(entry.id) === id);
  if (!item) { render(); return; }
  const config = cleanConfig(item);
  const fallback = `<img class="garage-model-photo" src="${poster(config.car)}" alt="Ảnh Studio tham khảo"><p>Mở Garage qua npm start để xoay bản phối 3D.</p>`;
  openDialog(carName(config), fallback);
  if (localFile) return;
  const loading = document.createElement('p');
  loading.textContent = 'Đang tải bản phối 3D…';
  dialogContent.replaceChildren(loading);
  try {
    await import('./assets/vendor/model-viewer/model-viewer.min.js');
    if (!dialog.open || !loading.isConnected) return;
    const model = document.createElement('model-viewer');
    model.alt = carName(config) + ', màu ' + colorOf(config, 'body').name;
    model.setAttribute('camera-controls', '');
    model.setAttribute('touch-action', 'pan-y');
    model.addEventListener('load', () => {
      for (const part of ['body', 'calipers', 'rims']) {
        const color = colorOf(config, part);
        model.model.materials.filter(material => material.name.startsWith('ZUZONG_' + part + ' |')).forEach(material => {
          material.pbrMetallicRoughness.setBaseColorFactor(color.hex);
        });
      }
    }, { once: true });
    model.addEventListener('error', () => {
      if (model.isConnected) dialogContent.innerHTML = fallback;
    }, { once: true });
    model.src = 'assets/model/studio/' + config.car + '.glb';
    dialogContent.replaceChildren(model);
  } catch {
    if (loading.isConnected) dialogContent.innerHTML = fallback;
  }
}
dialog.addEventListener('close', () => { if (!dialog.open) dialogContent.replaceChildren(); });

function confirmRemoval(button) {
  const id = button.dataset.remove;
  const card = button.closest('[data-card]');
  openDialog('Xóa bản phối này?', '<p>Bản phối sẽ được gỡ khỏi Garage của bạn.</p><p><button class="garage-button garage-primary" type="button" data-confirm>Xóa bản phối</button></p>');
  dialogContent.querySelector('[data-confirm]').addEventListener('click', async () => {
    const items = savedItems();
    if (!writeStore('saved', items.filter(item => String(item.id) !== id))) {
      dialog.close();
      status.textContent = 'Chưa xóa được bản phối. Vui lòng thử lại.';
      return;
    }
    dialog.close();
    if (!reduced.matches && card.isConnected) {
      card.classList.add('garage-exit');
      await Promise.allSettled(card.getAnimations().map(animation => animation.finished));
    }
    render();
    (gallery.querySelector('[data-remove]') ?? empty.querySelector('[data-samples]')).focus({ preventScroll: true });
    status.textContent = 'Đã xóa bản phối.';
  }, { once: true });
}

gallery.addEventListener('change', event => {
  const input = event.target.closest('input[type="checkbox"]');
  if (!input) return;
  if (input.checked) selected.add(input.value);
  else selected.delete(input.value);
  updateActions();
});
gallery.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (button?.dataset.edit) edit(button.dataset.edit, button.closest('[data-card]'));
  if (button?.dataset.preview) preview(button.dataset.preview);
  if (button?.dataset.remove) confirmRemoval(button);
});

function compare(items) {
  const configs = items.map(cleanConfig);
  const values = configs.map(config => [...specs(config), ['Chi phí dự tính', money(configurationPrice(config))]]);
  openDialog('So sánh bản phối', `<div class="garage-table" role="region" aria-label="Bảng so sánh" tabindex="0"><table>
    <thead><tr><th scope="col">Hạng mục</th>${configs.map((config, index) => `<th scope="col">${carName(config)}<br>${escape(items[index].id)}</th>`).join('')}</tr></thead>
    <tbody>${values[0].map(([label], index) => `<tr><th scope="row">${label}</th>${values.map(rows => `<td>${rows[index][1]}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`);
}

function quoteForm(items) {
  openDialog('Yêu cầu báo giá VIP', `
    <form class="garage-form">
      <p>${items.map(item => carName(cleanConfig(item))).join(' · ')}</p>
      <label>Họ và tên<input name="name" autocomplete="name" required minlength="2" maxlength="80"></label>
      <label>Email<input type="email" name="email" autocomplete="email" required maxlength="120"></label>
      <p class="garage-note">Yêu cầu mẫu được lưu trên trình duyệt.</p>
      <p class="garage-note" role="status" data-form-status></p>
      <button class="garage-button garage-primary" type="submit">Lưu yêu cầu</button>
    </form>`);
  const form = dialogContent.querySelector('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const name = data.name.trim();
    const feedback = form.querySelector('[data-form-status]');
    if (name.length < 2) {
      feedback.textContent = 'Nhập họ và tên có ít nhất hai ký tự.';
      form.elements.name.focus();
      return;
    }
    const id = 'ZZ-' + crypto.randomUUID();
    const request = {
      id, name, email: data.email.trim(), intent: 'consult', date: '',
      created: new Date().toISOString(), status: 'Chờ tư vấn',
      note: 'Yêu cầu báo giá VIP từ Garage',
      configs: items.map(item => ({ ...cleanConfig(item), id: item.id }))
    };
    if (!writeStore('requests', [request, ...list('requests')])) {
      feedback.textContent = 'Chưa lưu được yêu cầu. Vui lòng thử lại.';
      return;
    }
    dialog.close();
    status.textContent = 'Đã lưu yêu cầu báo giá · ' + id;
    status.scrollIntoView({ block: 'nearest' });
  });
}

function quote(items) {
  if (localFile) { quoteForm(items); return; }
  const cart = list('cart');
  items.forEach(item => {
    const config = cleanConfig(item);
    if (!cart.some(entry => JSON.stringify(cleanConfig(entry)) === JSON.stringify(config))) {
      cart.push({ ...config, id: crypto.randomUUID() });
    }
  });
  if (writeStore('cart', cart)) location.href = 'cart.html';
  else status.textContent = 'Chưa chuyển được bản phối sang yêu cầu đặt trước.';
}

let pdfLibrary;
function loadPDF() {
  pdfLibrary ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'assets/vendor/jspdf/jspdf.umd.min.js';
    script.onload = () => resolve(globalThis.jspdf.jsPDF);
    script.onerror = () => { script.remove(); pdfLibrary = undefined; reject(new Error('PDF library unavailable')); };
    document.head.append(script);
  });
  return pdfLibrary;
}

async function downloadPDF(item, button) {
  button.disabled = true;
  try {
    const PDF = await loadPDF();
    await document.fonts.ready;
    const config = cleanConfig(item);
    const canvas = document.createElement('canvas');
    canvas.width = 1240;
    canvas.height = 1754;
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    const draw = (text, y, size, bold = false) => {
      context.fillStyle = '#1b1716';
      context.font = (bold ? '700 ' : '400 ') + size + 'px Manrope, Arial, sans-serif';
      context.fillText(text, 86, y, 1068);
    };
    draw('ZEPHYRON / BUILD SHEET', 122, 25, true);
    draw(carName(config), 226, 55, true);
    draw('Config ID · ' + item.id, 288, 29);
    specs(config).forEach(([label, value], index) => {
      const y = 405 + index * 144;
      context.fillStyle = '#e4d8ce';
      context.fillRect(86, y - 48, 1068, 2);
      draw(label, y, 27);
      draw(value, y + 49, 38, true);
    });
    draw('Tổng chi phí dự tính', 1210, 30);
    draw(money(configurationPrice(config)), 1280, 54, true);
    draw('Giá minh họa từ Studio ZEPHYRON.', 1438, 25);
    const pdf = new PDF({ format: 'a4', compress: true });
    pdf.addImage(canvas, 'PNG', 0, 0, 210, 297);
    pdf.save('ZEPHYRON-' + String(item.id).replace(/[^a-zA-Z0-9_-]/g, '-') + '.pdf');
    status.textContent = 'Đã tạo PDF thông số.';
  } catch {
    status.textContent = 'Chưa tạo được PDF. Vui lòng thử lại.';
  } finally {
    updateActions();
  }
}

actionPanel.addEventListener('click', event => {
  const button = event.target.closest('[data-action]');
  if (!button || button.disabled) return;
  const items = savedItems().filter(item => selected.has(String(item.id)));
  if (!items.length) { render(); return; }
  if (button.dataset.action === 'edit') edit(String(items[0].id));
  if (button.dataset.action === 'pdf') downloadPDF(items[0], button);
  if (button.dataset.action === 'compare' && items.length > 1) compare(items);
  if (button.dataset.action === 'quote') quote(items);
});

document.querySelector('[data-samples]').addEventListener('click', () => {
  const saved = savedItems();
  const added = samples.filter(sample => !saved.some(item => String(item.id) === sample.id));
  if (!writeStore('saved', [...saved, ...added])) {
    status.textContent = 'Chưa lưu được hai bản phối mẫu.';
    return;
  }
  render();
  gallery.querySelector('input')?.focus();
  status.textContent = 'Đã thêm hai bản phối mẫu.';
});
window.addEventListener('storage', event => {
  if (event.key === 'zuzong.saved' || event.key === 'zuzong.user' || event.key === null) render();
});
window.addEventListener('pageshow', event => { if (event.persisted) render(); });
render();
