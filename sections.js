(() => {
  'use strict';

  window.initShowcase = function initShowcase() {
    if (document.body.dataset.showcaseReady) return;
    document.body.dataset.showcaseReady = 'true';
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 760px)');
    const pad = (value) => String(value).padStart(2, '0');
    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
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
    let detailIndex = 0;
    let pendingScrollFrame = false;
    const isDetailAnimated = () => !mobile.matches && !motion.matches;
    const updateDetails = () => {
      pendingScrollFrame = false;
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
      if (detailProgress) detailProgress.style.transform = `translateX(${progress * 200}%)`;
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
