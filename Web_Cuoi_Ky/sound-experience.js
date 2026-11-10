import { cars, getCar } from './studio-data.js';

const soundVideos = {
  corvette: {
    id: 'jQwmjZ98fbE',
    title: 'Corvette C7 Stingray Start Up & Revs - Lovely Exhaust Sound!',
    creator: 'NM2255 | Raw Car Sounds'
  },
  bmw: {
    id: 'fG1fdW06HWI',
    title: 'BMW M4 COMPETITION | Start, Revs, Exhaust Sound + BONUS',
    creator: 'BMWBLOG'
  },
  porsche: {
    id: 'mGyAcKlLyJY',
    title: 'New Porsche 911 GT3 (992) - Exhaust, Sound & Start up',
    creator: 'MCarsPL'
  },
  mercedes: {
    id: 'NFKxjPM5TyQ',
    title: '2023 AMG SL 63 SOUND, DRIVING & START UP',
    creator: 'TB CARS'
  },
  lamborghini: {
    id: 'kBbDSugoXv8',
    title: 'Straight piped Lamborghini Revuelto sounds INSANE at 9,500rpm',
    creator: 'NM2255 | Raw Car Sounds',
    note: 'Video này giới thiệu Revuelto đã độ ống xả thẳng.'
  }
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
          <iframe
            data-sound-embed
            title="Video âm thanh xe đang chọn"
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        </div>
        <div class="z-sound-controls">
          <div class="z-sound-meta">
            <span>VIDEO GỐC CÓ ÂM THANH</span>
            <strong data-sound-car></strong>
          </div>
          <p class="z-sound-signature" data-sound-signature></p>
          <div class="z-sound-car-tabs" role="group" aria-label="Chọn một trong năm mẫu xe">
            ${cars.map(car => `<button type="button" data-sound-car-choice="${car.id}" aria-pressed="false">${car.brand}</button>`).join('')}
          </div>
          <div class="z-sound-actions">
            <a class="z-sound-source" data-sound-source target="_blank" rel="noopener noreferrer">Mở video gốc trên YouTube ↗</a>
            <span data-sound-note></span>
          </div>
        </div>
      </div>
    </div>`;

  const player = host.querySelector('[data-sound-embed]');
  const carLabel = host.querySelector('[data-sound-car]');
  const signature = host.querySelector('[data-sound-signature]');
  const sourceLink = host.querySelector('[data-sound-source]');
  const note = host.querySelector('[data-sound-note]');

  const setCar = id => {
    if (!cars.some(car => car.id === id)) return;
    const source = soundVideos[id];
    if (!source) return;
    const car = getCar(id);
    carId = id;
    carLabel.textContent = `${car.brand} ${car.name}`;
    signature.textContent = `${source.title} · ${source.creator}`;
    note.textContent = source.note || 'Âm thanh được phát trực tiếp từ video gốc.';
    sourceLink.href = `https://www.youtube.com/watch?v=${source.id}`;
    player.title = `Video tiếng xe ${car.brand} ${car.name} trên YouTube`;
    player.src = `https://www.youtube-nocookie.com/embed/${source.id}?playsinline=1&rel=0`;
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
