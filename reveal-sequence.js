(() => {
  'use strict';
  const hero = document.querySelector('.unveil');
  const canvas = document.querySelector('.reveal-canvas');
  if (!hero || !canvas) return;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compactQuery = matchMedia('(max-width: 760px)');
  let compact = compactQuery.matches;
  const count = 10;
  const directory = () => compact ? 'assets/reveal-studio/mobile/' : 'assets/reveal-studio/';
  canvas.width = compact ? 800 : 1600;
  canvas.height = compact ? 451 : 902;
  let urls = Array.from({ length: count }, (_, i) => directory() + `frame-${String(i).padStart(3, '0')}.webp`);
  const bitmaps = new Map();
  const previews = new Map();
  const decoding = new Map();
  const blobs = new Map();
  const downloading = new Map();
  const failed = new Set();
  let cacheLimit = compact ? 14 : 24;
  let wanted = 0;
  let paintFrame = 0;
  let generation = 0;
  let active = false;
  let preloadStarted = false;
  let direction = 1;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const index = () => Math.round(wanted);
  const state = window.revealSequence = { frameCount: count, frameIndex: 0, drawnFrame: -1, drawnQuality: '', ready: false, decodedFrames: 0, previewFrames: 0, cacheLimit, resolution: [canvas.width, canvas.height], update };

  function schedulePaint() {
    if (!paintFrame && active) paintFrame = requestAnimationFrame(paint);
  }
  function evict() {
    if (bitmaps.size <= cacheLimit) return;
    const farthest = [...bitmaps.keys()].sort((a, b) => Math.abs(b - wanted) - Math.abs(a - wanted));
    while (bitmaps.size > cacheLimit) {
      const i = farthest.shift();
      bitmaps.get(i)?.close?.();
      bitmaps.delete(i);
    }
    state.decodedFrames = bitmaps.size;
  }
  function download(i) {
    if (blobs.has(i)) return Promise.resolve(blobs.get(i));
    if (downloading.has(i)) return downloading.get(i);
    const version = generation;
    const promise = fetch(urls[i], { cache: 'force-cache' }).then(response => {
      if (!response.ok) throw new Error('Unavailable frame');
      return response.blob();
    }).then(blob => { if (version === generation) blobs.set(i, blob); return blob; });
    downloading.set(i, promise);
    promise.finally(() => { if (downloading.get(i) === promise) downloading.delete(i); }).catch(() => {});
    return promise;
  }
  function fromImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  }
  function decode(i) {
    if (i < 0 || i >= count || bitmaps.has(i) || failed.has(i)) return Promise.resolve();
    if (decoding.has(i)) return decoding.get(i);
    const version = generation;
    const promise = (location.protocol !== 'file:' && typeof createImageBitmap === 'function'
      ? download(i).then(blob => createImageBitmap(blob))
      : fromImage(urls[i])).then(bitmap => {
        if (!active || version !== generation) { bitmap.close?.(); return; }
        bitmaps.set(i, bitmap);
        evict();
        state.decodedFrames = bitmaps.size;
        schedulePaint();
      }).catch(() => { if (version === generation) failed.add(i); }).finally(() => {
        if (decoding.get(i) === promise) decoding.delete(i);
        if (active) warmWindow();
      });
    decoding.set(i, promise);
    return promise;
  }
  function warmWindow() {
    const center = index();
    const nearby = new Set([Math.floor(wanted), Math.ceil(wanted)]);
    for (let offset = 1; offset <= (compact ? 8 : 14); offset++) {
      nearby.add(center + direction * offset);
      if (offset <= (compact ? 4 : 6)) nearby.add(center - direction * offset);
    }
    // Four decoders prioritize the current position instead of building a stale queue.
    const needed = [...nearby].filter(i => i >= 0 && i < count && !bitmaps.has(i) && !decoding.has(i) && !failed.has(i))
      .sort((a, b) => Math.abs(a - wanted) - Math.abs(b - wanted));
    for (const i of needed.slice(0, Math.max(0, 4 - decoding.size))) decode(i);
  }
  function paint() {
    paintFrame = 0;
    if (!active || (!bitmaps.size && !previews.size)) return;
    const lo = Math.floor(wanted), hi = Math.ceil(wanted), fraction = wanted - lo;
    const useFull = bitmaps.has(lo) && bitmaps.has(hi);
    const source = useFull ? bitmaps : previews.has(lo) && previews.has(hi) ? previews : bitmaps;
    const quality = source === bitmaps ? 'full' : 'preview';
    const lower = source.get(lo), upper = source.get(hi);
    if (state.ready && Math.abs(state.drawnFrame - wanted) < .0001 && state.drawnQuality === quality) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (lower && upper) {
      // Add the two weighted alpha frames so the stationary car stays opaque.
      context.globalCompositeOperation = 'lighter';
      context.globalAlpha = 1 - fraction;
      context.drawImage(lower, 0, 0, canvas.width, canvas.height);
      if (fraction > 0) {
        context.globalAlpha = fraction;
        context.drawImage(upper, 0, 0, canvas.width, canvas.height);
      }
      state.drawnFrame = wanted;
    } else {
      const available = new Map([...previews, ...bitmaps]);
      const nearest = lower ? lo : upper ? hi : [...available.keys()].reduce((best, i) => Math.abs(i - wanted) < Math.abs(best - wanted) ? i : best);
      context.globalCompositeOperation = 'source-over';
      context.globalAlpha = 1;
      context.drawImage(available.get(nearest), 0, 0, canvas.width, canvas.height);
      state.drawnFrame = nearest;
    }
    context.globalAlpha = 1;
    context.globalCompositeOperation = 'source-over';
    state.ready = true;
    state.drawnQuality = quality;
    hero.classList.add('sequence-ready');
    canvas.dataset.frame = state.drawnFrame.toFixed(2);
  }
  function preloadPreviews() {
    const version = generation;
    const base = directory() + 'preview/';
    const pending = new Set();
    const worker = async () => {
      while (active && version === generation) {
        const next = urls.map((_, i) => i).filter(i => !previews.has(i) && !pending.has(i))
          .sort((a, b) => Math.abs(a - wanted) - Math.abs(b - wanted))[0];
        if (next === undefined) return;
        pending.add(next);
        const url = base + `frame-${String(next).padStart(3, '0')}.webp`;
        try {
          const bitmap = location.protocol !== 'file:' && typeof createImageBitmap === 'function'
            ? await fetch(url, {cache:'force-cache'}).then(r => { if (!r.ok) throw new Error('Unavailable preview'); return r.blob(); }).then(blob => createImageBitmap(blob))
            : await fromImage(url);
          if (!active || version !== generation) { bitmap.close?.(); return; }
          previews.set(next, bitmap);
          state.previewFrames = previews.size;
          schedulePaint();
        } catch { /* A missing preview leaves the full-size sequence available. */ }
      }
    };
    Promise.all(Array.from({length:4}, worker)).then(() => { if (active && version === generation) preload(); });
  }
  function preload() {
    // On phones, fetch only the moving window around the actual scroll position.
    // Small previews cover fast jumps without downloading the whole HD sequence.
    if (preloadStarted || compact || navigator.connection?.saveData || /(^|-)2g$/.test(navigator.connection?.effectiveType || '') || location.protocol === 'file:') return;
    preloadStarted = true;
    const version = generation;
    // Download ahead without decoding the entire sequence into GPU memory.
    const worker = async () => {
      while (active && version === generation && blobs.size + failed.size < count) {
        const next = urls.map((_, i) => i).filter(i => !blobs.has(i) && !downloading.has(i) && !failed.has(i))
          .sort((a, b) => Math.abs(a - wanted) - Math.abs(b - wanted))[0];
        if (next === undefined) return;
        try { await download(next); } catch { if (version === generation) failed.add(next); }
      }
    };
    for (let workerIndex = 0; workerIndex < 4; workerIndex++) worker();
  }
  function update(progress) {
    const next = clamp(progress, 0, 1) * (count - 1);
    const unchanged = Math.abs(next - wanted) < .0001 && state.ready && Math.abs(state.drawnFrame - next) < .0001;
    if (Math.abs(next - wanted) > .001) direction = next > wanted ? 1 : -1;
    wanted = next;
    state.frameIndex = wanted;
    if (!active || unchanged) return;
    warmWindow();
    evict();
    schedulePaint();
  }
  function motionChanged() {
    generation++;
    active = !reduced.matches;
    if (!active) {
      bitmaps.forEach(bitmap => bitmap.close?.());
      bitmaps.clear();
      previews.forEach(bitmap => bitmap.close?.());
      previews.clear();
      state.ready = false;
      state.decodedFrames = 0;
      state.previewFrames = 0;
      hero.classList.remove('sequence-ready');
      return;
    }
    failed.clear();
    preloadStarted = false;
    update(wanted / (count - 1));
    preloadPreviews();
  }
  compactQuery.addEventListener('change', () => {
    generation++;
    compact = compactQuery.matches;
    cacheLimit = compact ? 14 : 24;
    state.cacheLimit = cacheLimit;
    canvas.width = compact ? 800 : 1600;
    canvas.height = compact ? 451 : 902;
    urls = Array.from({ length: count }, (_, i) => directory() + `frame-${String(i).padStart(3, '0')}.webp`);
    bitmaps.forEach(bitmap => bitmap.close?.());
    previews.forEach(bitmap => bitmap.close?.());
    previews.clear();
    bitmaps.clear(); blobs.clear(); downloading.clear(); decoding.clear(); failed.clear();
    state.ready = false;
    state.decodedFrames = 0;
    state.previewFrames = 0;
    state.resolution = [canvas.width, canvas.height];
    hero.classList.remove('sequence-ready');
    preloadStarted = false;
    if (active) { update(wanted / (count - 1)); preloadPreviews(); }
  });
  reduced.addEventListener('change', motionChanged);
  motionChanged();
})();
