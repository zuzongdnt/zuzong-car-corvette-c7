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
        <small data-sound-note>Video tự phát kèm âm thanh. Bạn có thể tắt tiếng bằng biểu tượng loa.</small>
        <div class="z-sound-car-tabs" role="group" aria-label="Chọn một trong năm mẫu xe">
          ${cars.map(car => `<button type="button" data-sound-car-choice="${car.id}" aria-pressed="false"><span>${car.brand}</span><small>${car.name}</small></button>`).join('')}
        </div>
      </div>
      <div class="z-sound-player">
        <div class="z-sound-visual">
          <video data-sound-embed controls autoplay loop playsinline preload="metadata" aria-label="Video xe đang chọn"></video>
        </div>
        <div class="z-sound-controls">
          <div class="z-sound-meta">
            <span>Đang xem</span>
            <strong data-sound-car></strong>
          </div>
        </div>
      </div>
    </div>`;

  const player = host.querySelector('[data-sound-embed]');
  const carLabel = host.querySelector('[data-sound-car]');
  const soundNote = host.querySelector('[data-sound-note]');
  let waitingForGesture = false;
  let wantsSound = true;
  let lastMuted = player.muted;
  let playbackVersion = 0;
  let inView = !('IntersectionObserver' in window);
  const updateSoundNote = () => {
    soundNote.textContent = waitingForGesture
      ? 'Chạm vào trang hoặc chọn mẫu xe để bật âm thanh.'
      : wantsSound
        ? 'Video tự phát kèm âm thanh. Bạn có thể tắt tiếng bằng biểu tượng loa.'
        : 'Âm thanh đang tắt. Bấm biểu tượng loa để nghe tiếng xe.';
  };
  const setMuted = muted => {
    lastMuted = muted;
    player.muted = muted;
  };
  const syncPlayback = () => {
    const version = ++playbackVersion;
    if (!inView || document.hidden) {
      player.pause();
      return;
    }
    setMuted(!wantsSound || waitingForGesture);
    player.play().catch(error => {
      if (version !== playbackVersion || !inView || document.hidden) return;
      if (error.name !== 'NotAllowedError' || player.muted) return;
      // Keep the picture playing when audible autoplay needs a user gesture.
      waitingForGesture = true;
      setMuted(true);
      updateSoundNote();
      player.play().catch(() => {});
    });
  };
  const unlockSound = event => {
    if (!event.isTrusted || !waitingForGesture || !wantsSound || !inView || document.hidden) return;
    if (event.target === player) return;
    if (event.type === 'keydown' && ['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return;
    waitingForGesture = false;
    updateSoundNote();
    syncPlayback();
  };
  document.addEventListener('pointerdown', unlockSound, { passive: true });
  document.addEventListener('keydown', unlockSound);
  player.addEventListener('volumechange', () => {
    // Keep a deliberate mute from the native video controls across car changes.
    if (player.muted !== lastMuted) {
      lastMuted = player.muted;
      wantsSound = !player.muted;
      waitingForGesture = false;
      updateSoundNote();
    }
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting && entries[0].intersectionRatio >= .15;
      syncPlayback();
    }, { threshold: [0, .15] });
    observer.observe(player);
  }
  document.addEventListener('visibilitychange', syncPlayback);

  const setCar = id => {
    if (!cars.some(car => car.id === id)) return;
    const source = soundVideos[id];
    if (!source) return;
    const car = getCar(id);
    carId = id;
    carLabel.textContent = `${car.brand} ${car.name}`;
    player.setAttribute('aria-label', `Video tiếng xe ${car.brand} ${car.name}`);
    player.src = source;
    player.load();
    syncPlayback();
    host.querySelectorAll('[data-sound-car-choice]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.soundCarChoice === id));
    });
  };

  host.addEventListener('click', event => {
    const button = event.target.closest('[data-sound-car-choice]');
    if (button) {
      waitingForGesture = false;
      updateSoundNote();
      setCar(button.dataset.soundCarChoice);
    }
  });
  studio?.addEventListener('studio-change', event => setCar(event.detail?.car));
  setCar(carId);
}
