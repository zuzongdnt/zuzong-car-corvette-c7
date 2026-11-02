import './assets/vendor/model-viewer/model-viewer.min.js';

const stage = document.querySelector('[data-car-studio]');
if (stage) {
  const viewer = stage.querySelector('model-viewer');
  const section = stage.closest('[data-car-scroll]');
  const phaseLabel = stage.querySelector('[data-car-phase]');
  const progressLine = stage.querySelector('.car-scroll-progress span');
  const angleLabel = stage.querySelector('[data-car-angle]');
  const status = stage.querySelector('[data-model-status]');
  const retry = stage.querySelector('[data-model-retry]');
  const paints = [...stage.querySelectorAll('[data-car-color]')];
  const views = [...stage.querySelectorAll('[data-car-view]')];
  const spin = stage.querySelector('[data-car-spin]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px)');
  const compact = matchMedia('(max-width: 1200px)');
  const shortScreen = matchMedia('(max-height: 600px) and (min-width: 761px)');
  const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
  const rad = degrees => degrees * Math.PI / 180;
  const stops = { front: .04, hero: .29, side: .5, rear: .96 };
  const angles = { front: 0, hero: 42, side: 90, rear: 180 };
  const defaultRadius = () => shortScreen.matches ? '60%' : mobile.matches ? '112%' : compact.matches ? '96%' : '74%';
  let ready = false, visible = false, mode = 'scroll', frame = 0, lastTime = 0;
  let paintMaterials = [], homeRadius = 1, radiusGoal = defaultRadius();
  let progress = 0, targetProgress = 0, thetaOffset = 0, phiOffset = 0;
  let spinTheta = 0, spinPhi = rad(79), lastScrollY = scrollY;
  let geometry = { top: 0, travel: 1, pin: 100 }, lastPhase = '', lastAngle = -1;

  // A brief instrument-panel decode on entry, independent of camera movement.
  const title = stage.querySelector('.car-stage-word');
  const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const decodeWords = [...title.querySelectorAll('[data-car-scramble]')].map((word, line) => {
    const text = word.textContent;
    const letters = [...text].map((letter, index) => {
      const cell = document.createElement('span');
      const measure = document.createElement('span');
      const glyph = document.createElement('span');
      cell.className = 'car-scramble-char';
      measure.className = 'car-scramble-measure';
      glyph.className = 'car-scramble-glyph';
      measure.textContent = glyph.textContent = letter;
      cell.append(measure, glyph);
      return { cell, glyph, letter, lockAt: 260 + line * 140 + index * (line === 0 ? 105 : 75) };
    });
    word.replaceChildren(...letters.map(item => item.cell));
    return letters;
  }).flat();
  let decodeFrame = 0, decodeStart = 0, decodeStep = -1, titleVisible = false, titleArmed = true;
  function finishDecode() {
    if (decodeFrame) cancelAnimationFrame(decodeFrame);
    decodeFrame = 0;
    decodeWords.forEach(({ cell, glyph, letter }) => { glyph.textContent = letter; delete cell.dataset.pending; });
    title.dataset.decode = 'complete';
  }
  function decodeTick(now) {
    decodeFrame = 0;
    if (!titleVisible || reduced.matches || document.hidden) { finishDecode(); return; }
    const elapsed = now - decodeStart, step = Math.floor(elapsed / 55);
    if (step !== decodeStep) {
      decodeStep = step;
      decodeWords.forEach(({ cell, glyph, letter, lockAt }, index) => {
        const pending = elapsed < lockAt;
        glyph.textContent = pending ? alphabet[(step * 7 + index * 11 + step * index) % alphabet.length] : letter;
        cell.dataset.pending = String(pending);
      });
    }
    if (elapsed < 1120) decodeFrame = requestAnimationFrame(decodeTick);
    else finishDecode();
  }
  function revealTitle() {
    if (!ready || !titleVisible || !titleArmed || reduced.matches || document.hidden) return;
    titleArmed = false; decodeStart = performance.now(); decodeStep = -1;
    title.dataset.decode = 'running';
    decodeFrame = requestAnimationFrame(decodeTick);
  }
  new IntersectionObserver(entries => {
    const entry = entries[0];
    titleVisible = entry.isIntersecting && entry.intersectionRatio >= .35;
    if (!entry.isIntersecting) { titleArmed = true; finishDecode(); }
    else if (titleVisible) revealTitle();
  }, { rootMargin: '-86px 0px -8% 0px', threshold: [0, .35] }).observe(title);
  reduced.addEventListener('change', () => { if (reduced.matches) finishDecode(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) finishDecode(); });

  // Ease into/out of the turn, with a steady pass along the flank.
  function pose(p) {
    const t = clamp((p - .08) / .84), edge = .14;
    let turn;
    if (t < edge) turn = t * t / (2 * edge);
    else if (t > 1 - edge) turn = 1 - edge - (1 - t) ** 2 / (2 * edge);
    else turn = t - edge / 2;
    turn /= 1 - edge;
    return { theta: rad(180 * turn), phi: rad(80 - 2 * Math.sin(turn * Math.PI)) };
  }
  for (const name of ['hero', 'side']) {
    let lo = .08, hi = .92;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (pose(mid).theta < rad(angles[name])) lo = mid; else hi = mid;
    }
    stops[name] = (lo + hi) / 2;
  }
  viewer.cameraOrbit = `0deg 80deg ${radiusGoal}`;
  function readProgress() { return clamp((scrollY + geometry.pin - geometry.top) / geometry.travel); }
  function measure() {
    // Cache layout at resize/load; the animation loop never forces a layout read.
    geometry = { top: section.getBoundingClientRect().top + scrollY,
      travel: Math.max(1, section.offsetHeight - stage.offsetHeight),
      pin: parseFloat(getComputedStyle(stage).top) || 0 };
    targetProgress = readProgress();
    requestFrame();
  }
  function syncSpin() {
    spin.setAttribute('aria-pressed', String(mode === 'spin'));
    viewer.dataset.spinning = String(mode === 'spin' && visible && !document.hidden);
  }
  function displayAngle(theta) {
    const degrees = ((theta * 180 / Math.PI) % 360 + 360) % 360;
    const angle = Math.round(degrees) % 360;
    if (angle !== lastAngle) { angleLabel.textContent = `${String(angle).padStart(3, '0')}°`; lastAngle = angle; }
    const d = Math.min(degrees, 360 - degrees);
    const phase = d < 24 ? '01 / CHÍNH DIỆN' : d < 67 ? '02 / GÓC NGHIÊNG' : d < 117 ? '03 / DỌC THÂN XE' : '04 / PHÍA SAU';
    if (phase !== lastPhase) { phaseLabel.textContent = phase; lastPhase = phase; }
    views.forEach(button => {
      const distance = Math.abs(degrees - angles[button.dataset.carView]);
      const selected = mode !== 'spin' && Math.min(distance, 360 - distance) < 4;
      if (button.getAttribute('aria-pressed') !== String(selected)) button.setAttribute('aria-pressed', String(selected));
    });
  }
  function anchorOrbit() {
    const orbit = viewer.getCameraOrbit(), base = pose(progress);
    thetaOffset = Math.atan2(Math.sin(orbit.theta - base.theta), Math.cos(orbit.theta - base.theta));
    phiOffset = orbit.phi - base.phi;
  }
  function requestFrame() {
    if (!frame && ready && visible && !document.hidden && mode !== 'manual') frame = requestAnimationFrame(tick);
  }
  function tick(now) {
    frame = 0;
    if (!ready || !visible || document.hidden || mode === 'manual') { lastTime = 0; return; }
    const dt = Math.min(50, lastTime ? now - lastTime : 16.67);
    lastTime = now;
    if (mode === 'spin') {
      spinTheta += rad(10) * dt / 1000;
      viewer.cameraOrbit = `${spinTheta}rad ${spinPhi}rad ${radiusGoal}`;
      requestFrame(); return;
    }
    if (reduced.matches) { lastTime = 0; return; }
    progress += (targetProgress - progress) * (1 - Math.exp(-dt / 100));
    thetaOffset *= Math.exp(-dt / 230); phiOffset *= Math.exp(-dt / 230);
    const settled = Math.abs(targetProgress - progress) < .00003 && Math.abs(thetaOffset) < .0001 && Math.abs(phiOffset) < .0001;
    if (settled) { progress = targetProgress; thetaOffset = 0; phiOffset = 0; }
    const next = pose(progress);
    viewer.cameraOrbit = `${next.theta + thetaOffset}rad ${clamp(next.phi + phiOffset, rad(35), rad(88))}rad ${radiusGoal}`;
    viewer.dataset.scrollProgress = progress.toFixed(5);
    progressLine.style.transform = `scaleX(${progress})`;
    if (!settled) requestFrame(); else lastTime = 0;
  }
  addEventListener('scroll', () => {
    if (scrollY === lastScrollY) return;
    lastScrollY = scrollY; targetProgress = readProgress();
    if (reduced.matches) return;
    if (mode !== 'scroll') { anchorOrbit(); mode = 'scroll'; syncSpin(); }
    requestFrame();
  }, { passive: true });
  function selectColor(button) {
    const satin = button.dataset.colorName === 'Bạc Satin';
    paintMaterials.forEach(material => {
      material.pbrMetallicRoughness.setBaseColorFactor(button.dataset.carColor);
      material.pbrMetallicRoughness.setMetallicFactor(satin ? .72 : .45);
      material.pbrMetallicRoughness.setRoughnessFactor(satin ? .36 : .29);
      material.setClearcoatFactor(.65);
      material.setClearcoatRoughnessFactor(.25);
    });
    paints.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    stage.querySelector('[data-paint-name]').textContent = button.dataset.colorName;
    stage.querySelector('[data-paint-caption]').textContent = button.dataset.colorName.toLocaleUpperCase('vi');
    viewer.alt = `Corvette C7 màu ${button.dataset.colorName}. Cuộn để khám phá, kéo ngang để xoay, dùng nút cộng và trừ để thu phóng.`;
    viewer.dataset.paint = button.dataset.carColor;
  }
  function load(reload = false) {
    retry.hidden = true; status.textContent = 'Đang tải Corvette C7…';
    viewer.src = viewer.dataset.src + (reload ? `?retry=${Date.now()}` : '');
  }
  viewer.addEventListener('progress', event => {
    const percent = Math.round(event.detail.totalProgress * 100);
    status.textContent = percent >= 100 ? 'Đang hoàn thiện ánh sáng…' : `Đang tải Corvette C7 · ${percent}%`;
  });
  viewer.addEventListener('load', () => {
    paintMaterials = viewer.model.materials.filter(material => material.name === 'Car Paint');
    ready = true; viewer.dataset.ready = 'true';
    homeRadius = viewer.getCameraOrbit().radius;
    stage.querySelectorAll('fieldset').forEach(fieldset => fieldset.disabled = false);
    selectColor(paints.find(button => button.getAttribute('aria-pressed') === 'true') || paints[0]);
    status.textContent = 'Model 3D đã sẵn sàng.';
    measure(); progress = targetProgress; requestFrame();
    revealTitle();
  });
  viewer.addEventListener('error', () => {
    ready = false; viewer.dataset.ready = 'false'; mode = 'scroll'; syncSpin();
    stage.querySelectorAll('fieldset').forEach(fieldset => fieldset.disabled = true);
    status.textContent = 'Chưa tải được xe 3D. Bạn có thể thử lại hoặc xem bộ ảnh bên trên.';
    viewer.showPoster(); retry.hidden = false;
  });
  retry.addEventListener('click', () => load(true));
  paints.forEach(button => button.addEventListener('click', () => selectColor(button)));
  views.forEach(button => button.addEventListener('click', () => {
    const name = button.dataset.carView;
    if (reduced.matches) {
      mode = 'manual'; syncSpin(); viewer.cameraOrbit = `${angles[name]}deg 80deg ${radiusGoal}`;
      viewer.jumpCameraToGoal(); displayAngle(rad(angles[name])); return;
    }
    anchorOrbit(); mode = 'scroll'; syncSpin(); targetProgress = stops[name];
    // Sticky content stays in place; the car alone eases to the requested angle.
    scrollTo({ top: geometry.top - geometry.pin + geometry.travel * targetProgress, behavior: 'instant' });
    requestFrame();
  }));
  spin.addEventListener('click', () => {
    if (mode === 'spin') mode = 'manual';
    else { const orbit = viewer.getCameraOrbit(); spinTheta = orbit.theta; spinPhi = orbit.phi; mode = 'spin'; }
    lastTime = 0; syncSpin(); requestFrame();
  });
  viewer.addEventListener('camera-change', event => {
    if (!ready) return;
    if (event.detail.source === 'user-interaction') { mode = 'manual'; lastTime = 0; syncSpin(); }
    const orbit = viewer.getCameraOrbit();
    if (radiusGoal.endsWith('%')) homeRadius = orbit.radius;
    displayAngle(orbit.theta);
  });
  stage.querySelectorAll('[data-car-zoom]').forEach(button => button.addEventListener('click', () => {
    const orbit = viewer.getCameraOrbit();
    const radius = clamp(orbit.radius * (button.dataset.carZoom === 'in' ? .88 : 1 / .88), homeRadius * .6, homeRadius * 1.45);
    radiusGoal = `${radius}m`; viewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${radiusGoal}`;
    if (reduced.matches) viewer.jumpCameraToGoal();
  }));
  reduced.addEventListener('change', () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; lastTime = 0; mode = reduced.matches ? 'manual' : 'scroll'; syncSpin(); measure();
  });
  function resizeCamera() {
    radiusGoal = defaultRadius();
    const orbit = viewer.getCameraOrbit();
    viewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${radiusGoal}`;
    measure();
  }
  mobile.addEventListener('change', resizeCamera); compact.addEventListener('change', resizeCamera);
  shortScreen.addEventListener('change', resizeCamera);
  addEventListener('resize', measure, { passive: true }); addEventListener('load', measure, { once: true });
  document.fonts.ready.then(measure);
  new ResizeObserver(measure).observe(section); new ResizeObserver(measure).observe(stage);
  document.addEventListener('visibilitychange', () => { lastTime = 0; syncSpin(); requestFrame(); });
  const loader = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { load(); loader.disconnect(); }
  }, { rootMargin: '700px' });
  loader.observe(stage);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; lastTime = 0; syncSpin(); requestFrame();
  }, { threshold: 0 }).observe(viewer);
  measure();
}
