import { cars, getCar, poster } from './studio-data.js';
import { VERSION_DATA } from './version-comparison.js';

const LAYERS = {
  body: {
    name: 'Thân vỏ',
    label: '01 / Ngoại thất',
    description: 'Thân vỏ tạo hình dáng xe, bảo vệ khoang hành khách và là nơi bố trí các chi tiết ngoại thất. Ảnh bên trái là ảnh chụp thật, không phải bản vẽ kỹ thuật của hãng.',
    parts: ['Nắp ca-pô và cản xe', 'Cửa kính và mui xe', 'Vè bánh và cản sau']
  },
  chassis: {
    name: 'Khung gầm',
    label: '02 / Khung gầm',
    description: 'Khung gầm liên kết thân xe, hệ thống treo, bánh xe và phanh để xe vận hành ổn định. Cấu tạo cụ thể thay đổi theo từng mẫu và phiên bản.',
    parts: ['Kết cấu sàn và khung', 'Hệ thống treo', 'Bánh xe và phanh']
  },
  power: {
    name: 'Động cơ & truyền động',
    label: '03 / Hệ truyền động',
    description: 'Thông số dưới đây lấy theo phiên bản tham khảo có nguồn. Bố trí động cơ và truyền động không được suy ra từ ảnh ngoại thất.',
    parts: []
  },
  safety: {
    name: 'Bảo vệ hành khách',
    label: '04 / An toàn',
    description: 'Các hệ thống an toàn hỗ trợ bảo vệ người ngồi và hỗ trợ người lái. Trang bị thực tế tùy đời xe, phiên bản và thị trường.',
    parts: ['Khoang hành khách', 'Dây đai và vùng bảo vệ', 'Trang bị an toàn theo phiên bản']
  }
};

const PHOTO_SOURCES = {
  corvette: 'https://www.pinterest.com/pin/strasse-wheels-corvette-c7-z06--817825613570077535/',
  bmw: 'https://in.pinterest.com/vorlov2025/bmw-m4-competition-matte-black-wallpapers/',
  porsche: 'https://in.pinterest.com/pin/porsche-992-gt3-in-black-on-satin-neodyme-wheels--376261743877052120/',
  mercedes: 'https://commons.wikimedia.org/wiki/File%3A2023_Mercedes_SL_AMG_63_4MATIC%2B_Performance_Auto.jpg',
  lamborghini: 'https://www.pinterest.com/pin/lamborghini-revuelto--533746993355851064/'
};

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

export function mountCarAnatomy(host, studio) {
  if (!host || host.dataset.mounted) return;
  host.dataset.mounted = 'true';

  let current = { car: 'lamborghini' };
  try { current = { ...current, ...JSON.parse(studio?.dataset.config || '{}') }; } catch {}
  current.car = getCar(current.car).id;
  let layer = 'body';

  host.innerHTML = `<div class="z-ca-shell">
    <header class="z-ca-heading">
      <div><p class="z-experience-kicker">CAR ANATOMY / KHÁM PHÁ CẤU TẠO</p><h2>Nhìn chiếc xe<br><em>qua từng lớp cấu tạo.</em></h2></div>
      <p>Chọn mẫu xe và từng nhóm bộ phận. Ảnh xe thật giúp bạn nhận diện mẫu xe; bảng bên cạnh giải thích vai trò của các cụm chính.</p>
    </header>
    <div class="z-ca-car-tabs" role="group" aria-label="Chọn xe để tìm hiểu">${cars.map(car => `<button type="button" data-ca-car="${car.id}" aria-pressed="false">${esc(car.brand)}</button>`).join('')}</div>
    <div class="z-ca-layout">
      <div class="z-ca-visual">
        <div class="z-ca-car-label"><span>ẢNH XE THẬT / GÓC NGOẠI THẤT</span><strong data-ca-car-name></strong></div>
        <figure class="z-ca-photo">
          <div class="z-ca-image-frame">
            <img data-ca-photo alt="" loading="lazy" decoding="async">
          </div>
          <figcaption><span>Ảnh tham khảo · xe thật</span><a data-ca-photo-source target="_blank" rel="noopener noreferrer">Nguồn ảnh ↗</a></figcaption>
        </figure>
        <p class="z-ca-disclaimer">Ảnh là xe thật của mẫu đang chọn. Mô tả cấu tạo mang tính tổng quan; không thể hiện vị trí chi tiết hoặc cấu hình tháo rời chính xác của nhà sản xuất.</p>
      </div>
      <aside class="z-ca-info">
        <div class="z-ca-layer-tabs" role="group" aria-label="Chọn nhóm bộ phận">${Object.entries(LAYERS).map(([id, item]) => `<button type="button" data-ca-layer="${id}" aria-pressed="false"><span>${item.label}</span><strong>${item.name}</strong></button>`).join('')}</div>
        <article class="z-ca-detail" aria-live="polite">
          <p data-ca-eyebrow></p><h3 data-ca-title></h3><p data-ca-description></p>
          <ul data-ca-parts></ul><a data-ca-source target="_blank" rel="noopener noreferrer">Thông tin phiên bản từ hãng ↗</a>
        </article>
      </aside>
    </div>
  </div>`;

  function render() {
    const car = getCar(current.car);
    const group = VERSION_DATA[car.id];
    const variant = group.variants.find(item => item.tag === 'Mẫu đang xem') || group.variants[0];
    const selected = LAYERS[layer];

    host.querySelector('[data-ca-car-name]').textContent = `${car.brand} ${car.name}`;
    host.querySelectorAll('[data-ca-car]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.caCar === car.id)));
    host.querySelectorAll('[data-ca-layer]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.caLayer === layer)));

    const photo = host.querySelector('[data-ca-photo]');
    photo.dataset.photoCar = car.id;
    photo.alt = `Ảnh thật ngoại thất ${car.brand} ${car.name}`;
    photo.onerror = () => {
      photo.onerror = null;
      delete photo.dataset.photoCar;
      photo.src = poster(car.id, 'rear');
    };
    photo.src = poster(car.id, 'side');
    host.querySelector('[data-ca-photo-source]').href = PHOTO_SOURCES[car.id] || '#';

    host.querySelector('[data-ca-eyebrow]').textContent = selected.label;
    host.querySelector('[data-ca-title]').textContent = selected.name;
    host.querySelector('[data-ca-description]').textContent = layer === 'power'
      ? `${variant.engine}. ${variant.gearbox} · ${variant.drive}. ${selected.description}`
      : selected.description;
    const parts = layer === 'power' ? [variant.engine, variant.gearbox, variant.drive] : selected.parts;
    host.querySelector('[data-ca-parts]').innerHTML = parts.map(part => `<li>${esc(part)}</li>`).join('');

    const source = host.querySelector('[data-ca-source]');
    source.href = variant.source;
    source.textContent = `${variant.sourceLabel} ↗`;
  }

  host.addEventListener('click', event => {
    const selectedLayer = event.target.closest('[data-ca-layer]');
    const selectedCar = event.target.closest('[data-ca-car]');
    if (selectedLayer) { layer = selectedLayer.dataset.caLayer; render(); }
    if (selectedCar && selectedCar.dataset.caCar !== current.car) { current.car = selectedCar.dataset.caCar; render(); }
  });

  studio?.addEventListener('studio-change', event => {
    if (event.detail?.car && cars.some(car => car.id === event.detail.car)) {
      current = { ...current, ...event.detail };
      render();
    }
  });

  render();
}
