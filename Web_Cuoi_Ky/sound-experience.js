import { cars, getCar } from './studio-data.js';

const soundVideos = {
  corvette: 'assets/feature-videos/cars/corvette-c7.mp4',
  bmw: 'assets/feature-videos/cars/bmw-m4-g82.mp4',
  porsche: 'assets/feature-videos/cars/porsche-911-gt3.mp4',
  mercedes: 'assets/feature-videos/cars/mercedes-amg-sl63.mp4',
  lamborghini: 'assets/feature-videos/cars/lamborghini-revuelto.mp4'
};

export function mountSoundExperience(host, studio) {
  if (!host || host.dataset.mounted) return;
  host.dataset.mounted = 'true';

  let carId = 'lamborghini';
  try {
    const config = JSON.parse(studio?.dataset.config || '{}');
    if (config.car) carId = config.car;
  } catch {}

  host.innerHTML = `
    <div class="z-sound-shell">
      <div class="z-sound-copy">
        <p class="z-experience-kicker">SOUND EXPERIENCE</p>
        <h2>Nghe không gian<br><em>thay đổi theo bạn.</em></h2>
        <p>Chọn một mẫu xe để xem video và nghe âm thanh động cơ trong bản thu gốc.</p>
        <small>Bấm nút phát trên video để nghe tiếng xe. Trình duyệt cần thao tác này để cho phép phát âm thanh.</small>
      </div>
      <div class="z-sound-player">
        <div class="z-sound-visual">
          <video data-sound-embed controls playsinline preload="metadata" aria-label="Video xe đang chọn"></video>
        </div>
        <div class="z-sound-controls">
          <div class="z-sound-meta">
            <span>ĐANG XEM</span>
            <strong data-sound-car></strong>
          </div>
          <div class="z-sound-car-tabs" role="group" aria-label="Chọn một trong năm mẫu xe">
            ${cars.map(car => `<button type="button" data-sound-car-choice="${car.id}" aria-pressed="false">${car.brand}</button>`).join('')}
          </div>
        </div>
      </div>
    </div>`;

  const player = host.querySelector('[data-sound-embed]');
  const carLabel = host.querySelector('[data-sound-car]');

  const setCar = id => {
    if (!cars.some(car => car.id === id)) return;
    const source = soundVideos[id];
    if (!source) return;
    const car = getCar(id);
    carId = id;
    carLabel.textContent = `${car.brand} ${car.name}`;
    player.title = `Video tiếng xe ${car.brand} ${car.name}`;
    player.src = source;
    player.load();
    host.querySelectorAll('[data-sound-car-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.soundCarChoice === id));
    });
  };

  host.addEventListener('click', event => {
    const button = event.target.closest('[data-sound-car-choice]');
    if (button) setCar(button.dataset.soundCarChoice);
  });
  studio?.addEventListener('studio-change', event => setCar(event.detail?.car));
  setCar(carId);
}
