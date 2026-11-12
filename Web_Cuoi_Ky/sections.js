(() => {
  'use strict';

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  function initDetailColorBrush(link, motion) {
    const image = link.querySelector('img');
    const life = 1100;
    const stamps = [];
    let canvas, context, last, frame = 0;

    function stamp(x, y, time, radius) {
      const lobes = Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () => {
        const angle = Math.random() * Math.PI * 2;
        const offset = Math.random() * radius * .45;
        return [Math.cos(angle) * offset, Math.sin(angle) * offset, radius * (.45 + Math.random() * .55)];
      });
      stamps.push({ x, y, time, lobes });
    }

    function render(time) {
      frame = 0;
      while (stamps.length && time - stamps[0].time >= life) stamps.shift();
      if (!stamps.length) {
        canvas.hidden = true;
        return;
      }

      const width = link.clientWidth;
      const height = link.clientHeight;
      const dpr = Math.min(devicePixelRatio, 2);
      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;

      const mask = new Path2D();
      for (const { x, y, time: start, lobes } of stamps) {
        const scale = Math.min(1, (1 - (time - start) / life) / .75);
        for (const [dx, dy, radius] of lobes) {
          const cx = x * width + dx * scale;
          const cy = y * height + dy * scale;
          const r = radius * scale ** .8;
          mask.moveTo(cx + r, cy);
          mask.arc(cx, cy, r, 0, Math.PI * 2);
        }
      }

      // Match the existing cover crop so the colored pixels line up with the photo.
      const [positionX, positionY] = getComputedStyle(image).objectPosition.split(' ').map(parseFloat);
      const cover = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const photoWidth = image.naturalWidth * cover;
      const photoHeight = image.naturalHeight * cover;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.save();
      context.clip(mask);
      context.drawImage(image, (width - photoWidth) * positionX / 100,
        (height - photoHeight) * positionY / 100, photoWidth, photoHeight);
      context.restore();
      canvas.hidden = false;
      frame = requestAnimationFrame(render);
    }

    function paint(event) {
      if (motion.matches || !event.isPrimary || !image.complete || !image.naturalWidth) return;
      if (!canvas) {
        canvas = document.createElement('canvas');
        context = canvas.getContext('2d');
        canvas.className = 'detail-color-brush';
        canvas.setAttribute('aria-hidden', 'true');
        canvas.hidden = true;
        link.append(canvas);
      }
      if (!context) return;

      const rect = link.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) {
        last = null;
        return;
      }
      const time = performance.now();
      const size = Math.max(260, Math.min(rect.width, rect.height));
      const radius = size * (event.pointerType === 'touch' ? .22 : .18);
      if (last && time - last.time < 150) {
        const distance = Math.hypot((x - last.x) * rect.width, (y - last.y) * rect.height);
        const steps = Math.min(40, Math.ceil(distance / (size * .04)));
        for (let i = 1; i < steps; i++) {
          stamp(last.x + (x - last.x) * i / steps, last.y + (y - last.y) * i / steps, time, radius);
        }
      }
      stamp(x, y, time, radius);
      last = { x, y, time };
      if (!frame) frame = requestAnimationFrame(render);
    }

    link.addEventListener('pointermove', paint);
    link.addEventListener('pointerdown', paint);
    for (const event of ['pointerleave', 'pointercancel', 'pointerup']) {
      link.addEventListener(event, () => { last = null; });
    }
    motion.addEventListener('change', () => {
      last = null;
      stamps.length = 0;
      cancelAnimationFrame(frame);
      frame = 0;
      if (canvas) canvas.hidden = true;
    });
  }

  function initLowerHomeMotion(motion) {
    const collection = document.querySelector('#collection');
    if (!collection || !('IntersectionObserver' in window)) return () => {};

    const recorder = new URLSearchParams(location.search).get('rec') === '1';
    const portrait = document.querySelector('.world-feature-image');
    const entrances = [...document.querySelectorAll('[data-home-enter]')];
    const statements = [...document.querySelectorAll('[data-home-words]')].map(heading => {
      const words = [];
      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        const fragment = document.createDocumentFragment();
        for (const part of node.textContent.split(/(\s+)/)) {
          if (!part.trim()) { fragment.append(part); continue; }
          const word = document.createElement('span');
          word.className = 'home-motion-word';
          word.textContent = part;
          fragment.append(word);
          words.push(word);
        }
        node.replaceWith(fragment);
      }
      return {heading, words, progress: null};
    });

    const show = element => element.classList.remove('home-motion-pending');
    const observer = new IntersectionObserver(entries => {
      for (const {target, isIntersecting} of entries) {
        if (!isIntersecting) continue;
        show(target);
        observer.unobserve(target);
      }
    }, {rootMargin: '0px 0px -8% 0px'});

    for (const element of entrances) {
      if (motion.matches) break;
      if (recorder || element.getBoundingClientRect().top > innerHeight * .92) {
        element.classList.add('home-motion-pending');
        if (!recorder) observer.observe(element);
      }
      element.addEventListener('focusin', () => show(element), {once: true});
    }

    const start = performance.now();
    let recorderFrame = 0;
    let photoShift;
    const paint = () => {
      if (!recorder && !motion.matches && collection.getBoundingClientRect().top > innerHeight) return;
      const elapsed = performance.now() - start;
      const height = innerHeight;
      const compact = innerWidth <= 760;
      const remainingScroll = Math.max(0, document.documentElement.scrollHeight - height - scrollY);
      const offsets = statements.map(({heading}) => heading.getBoundingClientRect().top);
      const portraitBounds = portrait?.getBoundingClientRect();
      if (recorder && !motion.matches) {
        for (const element of entrances) {
          if (elapsed >= (element.dataset.homeEnter === 'card' ? 3500 : 200)) show(element);
        }
      }
      for (const [index, statement] of statements.entries()) {
        // Finish the footer text even when it cannot scroll into the upper third.
        const lastTop = offsets[index] - remainingScroll;
        const enterAt = Math.max(height * .86, lastTop + 90);
        const finishAt = Math.max(height * .27, lastTop);
        const progress = motion.matches ? 1 : recorder
          ? clamp((elapsed - 1300) / 2900)
          : clamp((enterAt - offsets[index]) / (enterAt - finishAt));
        if (statement.progress === progress) continue;
        statement.progress = progress;
        const edge = 3;
        const position = progress * (statement.words.length + edge - 1);
        statement.words.forEach((word, index) => {
          word.style.setProperty('--home-fill', `${clamp((position - index) / edge) * 100}%`);
        });
      }
      if (portraitBounds) {
        const travel = compact ? 12 : 30;
        const shift = motion.matches ? 0 : recorder
          ? (clamp(elapsed / 5500) * 2 - 1) * travel
          : clamp((height - portraitBounds.top - portraitBounds.height / 2) * .12 - height * .06, -travel, travel);
        if (shift !== photoShift) {
          photoShift = shift;
          portrait.style.setProperty('--home-photo-y', `${shift}px`);
        }
      }
      if (recorder && !motion.matches && elapsed < 5500) recorderFrame = requestAnimationFrame(paint);
    };
    motion.addEventListener('change', () => {
      if (motion.matches) {
        observer.disconnect();
        entrances.forEach(show);
      }
      if (recorder) {
        cancelAnimationFrame(recorderFrame);
        paint();
      }
    });
    if (recorder) paint();
    return recorder ? () => {} : paint;
  }

  window.initShowcase = function initShowcase() {
    if (document.body.dataset.showcaseReady) return;
    document.body.dataset.showcaseReady = 'true';
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateLowerHome = initLowerHomeMotion(motion);
    const mobile = window.matchMedia('(max-width: 760px)');
    const pad = (value) => String(value).padStart(2, '0');
    document.querySelectorAll('[data-world-video]').forEach(preview => {
      const button = preview.closest('.world-tile').querySelector('.world-video-toggle');
      let visible = false, userPaused = false, userStarted = false, failed = false;
      const updateButton = () => {
        const paused = preview.paused;
        button.setAttribute('aria-label', paused ? 'Phát video xem trước' : 'Tạm dừng video xem trước');
        button.querySelector('span').textContent = paused ? '▶' : 'Ⅱ';
        button.querySelector('[data-world-video-label]').textContent = paused ? 'Phát video' : 'Tạm dừng';
      };
      const syncPreview = () => {
        if (failed || !visible || document.hidden || userPaused || (motion.matches && !userStarted)) { preview.pause(); updateButton(); return; }
        if (!preview.getAttribute('src')) { preview.src = preview.dataset.src; preview.muted = true; preview.load(); }
        preview.play().then(updateButton).catch(updateButton);
      };
      button.addEventListener('click', () => { if (preview.paused) { userPaused = false; userStarted = true; syncPreview(); } else { userPaused = true; preview.pause(); } });
      preview.addEventListener('playing', updateButton); preview.addEventListener('pause', updateButton);
      preview.addEventListener('error', () => { failed = true; button.disabled = true; button.setAttribute('aria-label', 'Video không khả dụng'); button.querySelector('[data-world-video-label]').textContent = 'Video không khả dụng'; });
      new IntersectionObserver(entries => { visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .2; syncPreview(); }, { threshold: [0, .2] }).observe(preview);
      document.addEventListener('visibilitychange', syncPreview);
      motion.addEventListener('change', () => { userStarted = false; syncPreview(); });
    });

    const dialog = document.getElementById('gallery-dialog');
    const largeImage = dialog?.querySelector('.gallery-main-image');
    const thumbnails = dialog?.querySelector('.gallery-thumbnails');
    let currentImage = 0;
    let previousFocus = null;
    let originalOverflow = '';
    let galleryVersion = 0;
    let galleryTimer;
    const totalImages = 18;
    const thumbButtons = [];
    const showImage = (index) => {
      if (!largeImage || !dialog) return;
      currentImage = (index + totalImages) % totalImages;
      const imageNumber = pad(currentImage + 1);
      const src = `assets/view-${imageNumber}.webp`;
      clearTimeout(galleryTimer);
      const version = ++galleryVersion;
      const setImage = () => {
        if (version !== galleryVersion) return;
        largeImage.src = src;
        largeImage.alt = `Corvette C7, góc nhìn ${imageNumber}`;
        largeImage.classList.remove('is-changing');
      };
      if (motion.matches || !dialog.open) setImage();
      else {
        largeImage.classList.add('is-changing');
        const preload = new Image();
        preload.onload = () => { galleryTimer = setTimeout(setImage, 75); };
        preload.onerror = setImage;
        preload.src = src;
      }
      dialog.querySelector('[data-gallery-caption]').textContent = `GÓC NHÌN ${imageNumber}`;
      dialog.querySelector('[data-gallery-counter]').textContent = `${imageNumber} / ${totalImages}`;
      thumbButtons.forEach((button, thumbIndex) => button.setAttribute('aria-pressed', String(thumbIndex === currentImage)));
    };
    if (dialog && thumbnails) {
      for (let index = 0; index < totalImages; index++) {
        const number = pad(index + 1);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'gallery-thumb';
        button.setAttribute('aria-label', `Xem góc nhìn ${number}`);
        button.setAttribute('aria-pressed', String(index === 0));
        const image = document.createElement('img');
        image.src = `assets/view-${number}.webp`;
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.width = 220;
        image.height = 150;
        const label = document.createElement('span');
        label.textContent = number;
        button.append(image, label);
        button.addEventListener('click', () => showImage(index));
        thumbnails.append(button);
        thumbButtons.push(button);
      }
      document.querySelectorAll('[data-gallery-open]').forEach((button) => {
        button.addEventListener('click', () => {
          previousFocus = document.activeElement;
          showImage(currentImage);
          if (!dialog.open) dialog.showModal();
          originalOverflow = document.body.style.overflow;
          document.body.style.overflow = 'hidden';
          dialog.querySelector('[data-gallery-close]')?.focus();
        });
      });
      dialog.querySelector('[data-gallery-close]')?.addEventListener('click', () => dialog.close());
      dialog.querySelector('[data-gallery-prev]')?.addEventListener('click', () => showImage(currentImage - 1));
      dialog.querySelector('[data-gallery-next]')?.addEventListener('click', () => showImage(currentImage + 1));
      dialog.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
          const controls = Array.from(dialog.querySelectorAll('button:not([disabled]), a[href], [tabindex="0"]')).filter(node => node.getClientRects().length);
          const first = controls[0], last = controls.at(-1);
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          showImage(currentImage + (event.key === 'ArrowRight' ? 1 : -1));
        }
      });
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      });
      dialog.addEventListener('close', () => {
        document.body.style.overflow = originalOverflow;
        previousFocus?.focus({ preventScroll: true });
      });
    }

    const detailSection = document.querySelector('.details-scroll');
    const detailPin = document.querySelector('.details-pin');
    const detailViewport = document.querySelector('.details-viewport');
    const detailTrack = document.querySelector('.details-track');
    const detailPanels = Array.from(document.querySelectorAll('.detail-panel'));
    const detailProgress = document.querySelector('.details-scroll-line span');
    const detailCounter = document.querySelector('[data-detail-counter]');
    const detailPrevious = document.querySelector('[data-detail-prev]');
    const detailNext = document.querySelector('[data-detail-next]');
    document.querySelectorAll('#details .detail-image').forEach(link => initDetailColorBrush(link, motion));
    if (detailProgress && detailPanels.length) detailProgress.style.width = `${100 / detailPanels.length}%`;
    let detailIndex = 0;
    let pendingScrollFrame = false;
    const isDetailAnimated = () => !mobile.matches && !motion.matches;
    const updateDetails = () => {
      pendingScrollFrame = false;
      updateLowerHome();
      if (!detailSection || !detailPin || !detailTrack || !detailViewport) return;
      if (!isDetailAnimated()) {
        detailTrack.style.transform = '';
        return;
      }
      const rect = detailSection.getBoundingClientRect();
      const stickyTop = parseFloat(getComputedStyle(detailPin).top) || 0;
      const range = detailSection.offsetHeight - detailPin.offsetHeight;
      const progress = clamp((stickyTop - rect.top) / Math.max(range, 1));
      const distance = Math.max(0, detailTrack.scrollWidth - detailViewport.clientWidth);
      detailTrack.style.transform = `translate3d(${-progress * distance}px,0,0)`;
      if (detailProgress) detailProgress.style.transform = `translateX(${progress * (detailPanels.length - 1) * 100}%)`;
      detailIndex = Math.round(progress * (detailPanels.length - 1));
      if (detailCounter) detailCounter.textContent = pad(detailIndex + 1);
      if (detailPrevious) detailPrevious.disabled = detailIndex === 0;
      if (detailNext) detailNext.disabled = detailIndex === detailPanels.length - 1;
    };
    const requestUpdate = () => {
      if (pendingScrollFrame) return;
      pendingScrollFrame = true;
      requestAnimationFrame(updateDetails);
    };
    const goToDetail = (index) => {
      if (!detailSection || !detailPin || !isDetailAnimated()) return;
      const next = clamp(index, 0, detailPanels.length - 1);
      const range = detailSection.offsetHeight - detailPin.offsetHeight;
      const top = detailSection.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(detailPin).top) || 0);
      window.scrollTo({ top: top + (next / Math.max(detailPanels.length - 1, 1)) * range, behavior: motion.matches ? 'instant' : 'smooth' });
    };
    detailPrevious?.addEventListener('click', () => goToDetail(detailIndex - 1));
    detailNext?.addEventListener('click', () => goToDetail(detailIndex + 1));
    detailViewport?.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      if (!isDetailAnimated()) return;
      event.preventDefault();
      goToDetail(detailIndex + (event.key === 'ArrowRight' ? 1 : -1));
    });
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    motion.addEventListener('change', requestUpdate);
    mobile.addEventListener('change', requestUpdate);
    updateDetails();

    const statElements = document.querySelectorAll('[data-stat]');
    if ('IntersectionObserver' in window && !motion.matches) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          const target = Number(entry.target.dataset.stat);
          const decimals = Number(entry.target.dataset.decimals || 0);
          const start = performance.now();
          const tick = (now) => {
            const fraction = clamp((now - start) / 850);
            const eased = 1 - (1 - fraction) ** 3;
            entry.target.textContent = (target * eased).toFixed(decimals);
            if (fraction < 1 && !motion.matches) requestAnimationFrame(tick);
            else entry.target.textContent = target.toFixed(decimals);
          };
          requestAnimationFrame(tick);
        });
      }, { threshold: .6 });
      statElements.forEach((element) => observer.observe(element));
    }
  };
})();
