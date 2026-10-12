import './assets/vendor/model-viewer/model-viewer.min.js';

const stage = document.querySelector('[data-car-studio]');
if (stage) {
  const viewer = stage.querySelector('model-viewer');
  const scrollSection = stage.closest('[data-car-scroll]');
  const phaseLabel = stage.querySelector('[data-car-phase]');
  const progressLine = stage.querySelector('.car-scroll-progress span');
  const status = stage.querySelector('[data-model-status]');
  const retry = stage.querySelector('[data-model-retry]');
  const paints = [...stage.querySelectorAll('[data-car-color]')];
  const views = [...stage.querySelectorAll('[data-car-view]')];
  const spin = stage.querySelector('[data-car-spin]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px)');
  const compact = matchMedia('(max-width: 1200px)');
  const defaultRadius = () => mobile.matches ? '110%' : compact.matches ? '92%' : '68%';
  const presets = () => {
    const radius = defaultRadius();
    return { front: `0deg 78deg ${radius}`, hero: `40deg 77deg ${radius}`, rear: `180deg 78deg ${radius}` };
  };
  viewer.cameraOrbit = presets().front;
  let paintMaterials = [], ready = false, visible = false, spinning = false, homeRadius = 1;
  let radiusGoal = defaultRadius();
  let thetaOffset = 0, phiOffset = 0, scrollFrame = 0, lastScrollY = scrollY;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const radians = degrees => degrees * Math.PI / 180;
  // Pin the studio for 4.4 viewport heights of travel; hold the front and rear briefly.
  // Keep radius separate: scrolling changes the angle, only the +/- buttons change zoom.
  function scrollPose() {
    const rect = scrollSection.getBoundingClientRect();
    const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
    const travel = Math.max(1, scrollSection.offsetHeight - stage.offsetHeight);
    const progress = clamp((stickyTop - rect.top) / travel, 0, 1);
    const turn = clamp((progress - .08) / .84, 0, 1);
    return { rect, stickyTop, travel, progress, theta: radians(180 * turn), phi: radians(78 - 3 * Math.sin(turn * Math.PI)) };
  }
  function anchorManualPose(theta, phi) {
    const pose = scrollPose();
    thetaOffset = theta - pose.theta; phiOffset = phi - pose.phi;
  }
  function updateScrollCamera() {
    scrollFrame = 0;
    if (!ready || reduced.matches || spinning) return;
    const pose = scrollPose();
    if (pose.rect.bottom <= 0 || pose.rect.top >= innerHeight) return;
    viewer.cameraOrbit = `${pose.theta + thetaOffset}rad ${clamp(pose.phi + phiOffset, radians(35), radians(88))}rad ${radiusGoal}`;
    viewer.dataset.scrollProgress = pose.progress.toFixed(4);
    progressLine.style.transform = `scaleX(${pose.progress})`;
    phaseLabel.textContent = pose.progress < .3 ? '01 / CHÍNH DIỆN' : pose.progress < .7 ? '02 / DỌC THÂN XE' : '03 / PHÍA SAU';
    views.forEach(button => button.setAttribute('aria-pressed', 'false'));
  }
  function requestScrollCamera() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollCamera);
  }
  addEventListener('scroll', () => {
    if (scrollY === lastScrollY) return;
    // A new page scroll resumes the authored front-to-rear journey after manual exploration.
    thetaOffset = 0; phiOffset = 0;
    if (spinning) { spinning = false; viewer.resetTurntableRotation(); syncRotation(); }
    lastScrollY = scrollY; requestScrollCamera();
  }, { passive: true });
  addEventListener('resize', requestScrollCamera, { passive: true });

  function syncRotation() {
    viewer.autoRotate = ready && spinning && visible && !document.hidden;
    spin.setAttribute('aria-pressed', String(spinning));
  }
  function selectColor(button) {
    paintMaterials.forEach(material => material.pbrMetallicRoughness.setBaseColorFactor(button.dataset.carColor));
    paints.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    stage.querySelector('[data-paint-name]').textContent = button.dataset.colorName;
    stage.querySelector('[data-paint-caption]').textContent = button.dataset.colorName.toLocaleUpperCase('vi');
    viewer.alt = `Mô hình Corvette C7 màu ${button.dataset.colorName}. Cuộn trang để đổi góc, kéo để xoay, dùng nút cộng và trừ để thu phóng.`;
    viewer.dataset.paint = button.dataset.carColor;
  }
  function load(reload = false) {
    retry.hidden = true;
    status.textContent = 'Đang tải Corvette C7…';
    viewer.src = viewer.dataset.src + (reload ? `?retry=${Date.now()}` : '');
  }
  viewer.addEventListener('progress', event => {
    const percent = Math.round(event.detail.totalProgress * 100);
    status.textContent = percent >= 100 ? 'Đang hoàn thiện ánh sáng…' : `Đang tải Corvette C7 · ${percent}%`;
  });
  viewer.addEventListener('load', () => {
    paintMaterials = viewer.model.materials.filter(material => material.name === 'Car Paint');
    if (!paintMaterials.length) { status.textContent = 'Không tìm thấy vật liệu sơn xe.'; return; }
    ready = true;
    viewer.dataset.ready = 'true';
    homeRadius = viewer.getCameraOrbit().radius;
    stage.querySelectorAll('fieldset').forEach(fieldset => fieldset.disabled = false);
    selectColor(paints.find(button => button.getAttribute('aria-pressed') === 'true') || paints[0]);
    status.textContent = 'Model 3D đã sẵn sàng.';
    syncRotation();
    requestScrollCamera();
  });
  viewer.addEventListener('error', () => {
    ready = false; viewer.dataset.ready = 'false'; spinning = false; syncRotation();
    stage.querySelectorAll('fieldset').forEach(fieldset => fieldset.disabled = true);
    status.textContent = 'Chưa tải được xe 3D. Bạn có thể thử lại hoặc xem bộ ảnh bên trên.';
    viewer.showPoster(); retry.hidden = false;
  });
  retry.addEventListener('click', () => load(true));
  paints.forEach(button => button.addEventListener('click', () => selectColor(button)));
  views.forEach(button => button.addEventListener('click', () => {
    spinning = false; syncRotation(); viewer.resetTurntableRotation();
    const preset = presets()[button.dataset.carView];
    const [theta, phi] = preset.split(' ');
    if (!reduced.matches) {
      const pose = scrollPose();
      const stop = { front: .04, hero: .08 + .84 * 40 / 180, rear: .96 }[button.dataset.carView];
      thetaOffset = 0; phiOffset = 0;
      scrollTo({ top: scrollY + pose.rect.top - pose.stickyTop + pose.travel * stop, behavior: 'smooth' });
      return;
    }
    anchorManualPose(radians(parseFloat(theta)), radians(parseFloat(phi)));
    viewer.cameraOrbit = `${theta} ${phi} ${radiusGoal}`;
    if (reduced.matches) viewer.jumpCameraToGoal();
    views.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  spin.addEventListener('click', () => {
    spinning = !spinning;
    if (!spinning) { const orbit = viewer.getCameraOrbit(); anchorManualPose(orbit.theta, orbit.phi); }
    syncRotation();
  });
  viewer.rotationPerSecond = '12deg'; viewer.autoRotateDelay = 0;
  viewer.addEventListener('camera-change', event => {
    if (event.detail.source === 'user-interaction') {
      spinning = false; syncRotation(); views.forEach(item => item.setAttribute('aria-pressed', 'false'));
      const orbit = viewer.getCameraOrbit(); anchorManualPose(orbit.theta, orbit.phi);
    }
  });
  stage.querySelectorAll('[data-car-zoom]').forEach(button => button.addEventListener('click', () => {
    const orbit = viewer.getCameraOrbit();
    const radius = Math.max(homeRadius * .45, Math.min(homeRadius * 1.5, orbit.radius * (button.dataset.carZoom === 'in' ? .82 : 1.22)));
    radiusGoal = `${radius}m`;
    viewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${radius}m`;
    if (reduced.matches) viewer.jumpCameraToGoal();
  }));
  reduced.addEventListener('change', () => { if (reduced.matches) spinning = false; syncRotation(); });
  function resizeCamera() {
    radiusGoal = defaultRadius();
    const selected = views.find(button => button.getAttribute('aria-pressed') === 'true');
    if (selected) viewer.cameraOrbit = presets()[selected.dataset.carView];
    else requestScrollCamera();
  }
  mobile.addEventListener('change', resizeCamera);
  compact.addEventListener('change', resizeCamera);
  document.addEventListener('visibilitychange', syncRotation);
  const loader = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { load(); loader.disconnect(); }
  }, { rootMargin: '700px' });
  loader.observe(stage);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncRotation(); }, { threshold: 0 }).observe(viewer);
}
