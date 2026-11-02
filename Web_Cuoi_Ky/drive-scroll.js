(() => {
  'use strict';
  const root = document.querySelector('.drive-scroll');
  if (!root) return;
  const stage = root.querySelector('.drive-stage');
  const media = root.querySelector('.drive-media');
  const canvas = root.querySelector('.drive-canvas');
  const context = canvas.getContext('2d', {alpha: false});
  const ambient = root.querySelector('.drive-ambient');
  const ambientContext = ambient?.getContext('2d', {alpha: false});
  if (!context) return;
  const cards = [...root.querySelectorAll('.drive-specs>div')];
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  const mobile = matchMedia('(max-width:760px)');
  const count = Number(root.dataset.driveFrames) || 60;
  const source = root.dataset.driveSrc;
  const clamp = n => Math.max(0, Math.min(1, n));
  const ease = (a, b, n) => { const t = clamp((n-a)/(b-a)); return t*t*(3-2*t); };
  const previews = new Map(), frames = new Map(), loading = new Map(), blobs = new Map(), failed = new Set();
  let active = false, raf = 0, progress = 0, lastTime = 0, generation = 0;
  let direction = 1, previousFrame = 0, compact = mobile.matches, previewStarted = false;
  let lastDrawn = '', resizeNeeded = true;
  const state = root.driveSequenceState = {count, frame: 0, quality: 'poster', decoded: 0, failed: 0};
  const url = (index, preview = false) => `${source}/${preview ? 'preview/' : compact ? 'mobile/' : ''}frame-${String(index).padStart(3, '0')}.webp`;
  function schedule() { if (active && !raf) raf = requestAnimationFrame(paint); }
  async function bitmap(response) {
    if (typeof createImageBitmap === 'function') return createImageBitmap(response);
    const image = new Image(), objectUrl = URL.createObjectURL(response);
    try { image.src = objectUrl; await image.decode(); return image; }
    finally { URL.revokeObjectURL(objectUrl); }
  }
  function trim() {
    const limit = compact ? 8 : 12;
    const wanted = progress*(count-1);
    const farthest = [...frames.keys()].sort((a,b) => Math.abs(b-wanted)-Math.abs(a-wanted));
    while (frames.size > limit) { const index = farthest.shift(); frames.get(index)?.close?.(); frames.delete(index); }
    state.decoded = frames.size;
  }
  function warm() {
    if (!active) return;
    const center = Math.round(progress*(count-1));
    const nearby = [Math.floor(progress*(count-1)), Math.ceil(progress*(count-1))];
    if (!reduced.matches) for (let i=1; i<=(compact ? 4 : 5); i++) { nearby.push(center+direction*i); if (i<=(compact ? 1 : 2)) nearby.push(center-direction*i); }
    for (const index of new Set(nearby)) {
      if (loading.size >= 3) break;
      if (index < 0 || index >= count || frames.has(index) || loading.has(index) || failed.has(url(index))) continue;
      const version = generation, location = url(index);
      const task = (blobs.has(location) ? Promise.resolve(blobs.get(location)) : fetch(location, {cache:'force-cache'}).then(r => {
        if (!r.ok) throw Error('Missing driving frame'); return r.blob();
      }).then(blob => { blobs.set(location, blob); return blob; }))
        .then(bitmap).then(image => {
          if (version !== generation || !active) { image.close?.(); return; }
          frames.set(index, image); trim(); schedule();
        }).catch(() => { failed.add(location); state.failed++; })
        .finally(() => { if (loading.get(index) === task) loading.delete(index); });
      loading.set(index, task);
    }
  }
  async function loadPreviews() {
    if (previewStarted) return;
    previewStarted = true;
    // Lightweight frames cover a fast jump before the sharp neighborhood decodes.
    let next = 0;
    await Promise.all(Array.from({length:3}, async () => {
      while (next < count) {
        const index = next++;
        try {
          const response = await fetch(url(index, true), {cache:'force-cache'});
          if (!response.ok) throw Error('Missing preview');
          previews.set(index, await bitmap(await response.blob())); schedule();
        } catch { state.failed++; }
      }
    }));
  }
  function measure() { resizeNeeded = true; lastDrawn = ''; schedule(); }
  function drawImage(image, target = canvas, drawing = context) {
    const width = target.width, height = target.height;
    const scale = Math.max(width/image.width, height/image.height);
    drawing.drawImage(image, (width-image.width*scale)/2, (height-image.height*scale)/2, image.width*scale, image.height*scale);
  }
  function drawAmbient(image) {
    // Extend the moving road underneath the text without enlarging a second car.
    ambientContext.drawImage(image, 0, image.height*.82, image.width, image.height*.18, 0, 0, ambient.width, ambient.height);
  }
  function paint(now) {
    raf = 0;
    if (!active) return;
    if (resizeNeeded) {
      const rect = canvas.getBoundingClientRect(), ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width*ratio)); canvas.height = Math.max(1, Math.round(rect.height*ratio));
      if (ambient) { ambient.width = 240; ambient.height = Math.max(1, Math.round(240*media.clientHeight/media.clientWidth)); }
      resizeNeeded = false; lastDrawn = '';
    }
    const target = reduced.matches ? 1 : clamp(-root.getBoundingClientRect().top/Math.max(1, root.offsetHeight-stage.offsetHeight));
    const elapsed = lastTime ? Math.min(64, now-lastTime) : 16.67; lastTime = now;
    progress = reduced.matches ? target : progress+(target-progress)*(1-Math.exp(-elapsed/85));
    if (Math.abs(target-progress)<.00015) progress = target;
    const wanted = progress*(count-1), lo = Math.floor(wanted), hi = Math.ceil(wanted), fraction = wanted-lo;
    direction = wanted >= previousFrame ? 1 : -1; previousFrame = wanted;
    warm();
    root.style.setProperty('--drive-progress', progress.toFixed(5));
    root.style.setProperty('--statement-out', ease(.18,.38,progress).toFixed(4));
    cards.forEach((card,i) => card.style.setProperty('--spec-reveal', reduced.matches ? '1' : ease(.32+i*.09,.50+i*.09,progress).toFixed(4)));
    const full = frames.has(lo) && frames.has(hi), available = full ? frames : previews;
    let first = available.get(lo), second = available.get(hi), drawn = wanted;
    if (!first || !second) {
      const candidates = new Map([...previews,...frames]);
      if (candidates.size) {
        const closest = [...candidates.keys()].reduce((a,b) => Math.abs(a-wanted)<Math.abs(b-wanted) ? a : b);
        first = second = candidates.get(closest); drawn = closest;
      }
    }
    const quality = full ? 'full' : 'preview', key = `${drawn.toFixed(4)}:${quality}`;
    if (first && second && key !== lastDrawn) {
      context.globalAlpha = 1; drawImage(first);
      if (second !== first && fraction > 0) { context.globalAlpha = fraction; drawImage(second); context.globalAlpha = 1; }
      if ((compact || media.clientWidth/media.clientHeight < 4/3) && ambientContext) {
        ambientContext.globalAlpha = 1; drawAmbient(first);
        if (second !== first && fraction > 0) { ambientContext.globalAlpha = fraction; drawAmbient(second); ambientContext.globalAlpha = 1; }
      }
      lastDrawn = key; root.classList.add('is-ready'); state.frame = drawn; state.quality = quality;
    }
    root.dataset.driveFrame = String(Math.round(drawn));
    root.dataset.driveProgress = progress.toFixed(4);
    root.dataset.driveSettled = String(progress === target && Math.abs(drawn-wanted)<.01);
    if (progress !== target || loading.size) schedule(); else lastTime = 0;
  }
  function setStatic() { root.classList.toggle('is-static',reduced.matches); measure(); }
  new IntersectionObserver(entries => {
    active = entries[0].isIntersecting;
    if (active) { loadPreviews(); measure(); }
    else {
      generation++; frames.forEach(image => image.close?.()); frames.clear(); loading.clear(); state.decoded = 0; lastDrawn = ''; lastTime = 0;
      if (raf) cancelAnimationFrame(raf); raf = 0;
    }
  }, {rootMargin:'650px 0px'}).observe(root);
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',measure,{passive:true});
  mobile.addEventListener('change', () => {
    compact = mobile.matches; generation++; frames.forEach(image => image.close?.()); frames.clear(); loading.clear(); measure();
  });
  reduced.addEventListener('change',setStatic);
  document.fonts?.ready.then(measure);
  setStatic();
})();
