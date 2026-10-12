(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const progress = document.querySelector('.reading-progress');
  const chapters = [...document.querySelectorAll('[data-chapter]')];
  const journeyImages = [...document.querySelectorAll('[data-journey-image]')];
  const chapterMarks = [...document.querySelectorAll('.ed-chapter-progress i')];
  const journeyLabel = document.querySelector('[data-journey-label]');
  const journeyCounter = document.querySelector('[data-journey-counter]');
  const mobileQuery = window.matchMedia('(max-width: 900px)');
  const storyQuery = window.matchMedia('(min-width: 901px)');
  let activeChapter = -1;
  let scrollQueued = false;

  function closeMenu(returnFocus = false) {
    if (!mobileNav || !menuButton) return;
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Mở menu');
    if (returnFocus) menuButton.focus();
  }
  menuButton?.addEventListener('click', () => {
    const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
    mobileNav.hidden = !willOpen;
    menuButton.setAttribute('aria-expanded', String(willOpen));
    menuButton.setAttribute('aria-label', willOpen ? 'Đóng menu' : 'Mở menu');
  });
  mobileNav?.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileNav && !mobileNav.hidden) {
      closeMenu(true);
      event.preventDefault();
    }
  });
  document.addEventListener('pointerdown', event => {
    if (mobileNav && !mobileNav.hidden && !header.contains(event.target)) closeMenu();
  });
  document.addEventListener('focusin', event => {
    if (mobileNav && !mobileNav.hidden && !header.contains(event.target)) closeMenu();
  });
  mobileQuery.addEventListener('change', () => closeMenu());

  function updateScroll() {
    scrollQueued = false;
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
    if (progress) {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (total > 0 ? Math.min(1, window.scrollY / total) : 0) + ')';
    }
    if (chapters.length && storyQuery.matches) {
      const focusLine = window.innerHeight * .56;
      let index = 0;
      chapters.forEach((chapter, current) => {
        if (chapter.getBoundingClientRect().top <= focusLine) index = current;
      });
      if (index !== activeChapter) {
        activeChapter = index;
        journeyImages.forEach((image, current) => image.classList.toggle('is-active', current === index));
        chapterMarks.forEach((mark, current) => { mark.style.background = current === index ? 'var(--accent)' : '#ffffff50'; });
        if (journeyLabel) journeyLabel.textContent = chapters[index].dataset.label;
        if (journeyCounter) journeyCounter.textContent = String(index + 1).padStart(2, '0') + ' / 03';
      }
    }
  }
  function queueScroll() {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateScroll);
  }
  window.addEventListener('scroll', queueScroll, { passive: true });
  window.addEventListener('resize', queueScroll, { passive: true });
  updateScroll();

  const videos = [...document.querySelectorAll('video[data-video-src]')];
  function prepareVideo(video) {
    if (video.dataset.ready) return;
    const source = video.querySelector('source[data-src]');
    if (source) source.src = source.dataset.src;
    else video.src = video.dataset.videoSrc;
    video.preload = 'metadata';
    video.dataset.ready = 'true';
    video.load();
  }
  videos.forEach(video => {
    const key = video.id.replace('video-', '');
    const button = document.querySelector('[data-film-toggle="' + key + '"]');
    if (button) button.setAttribute('aria-controls', video.id);
    const updateButton = () => {
      const label = button?.querySelector('[data-film-button-label]');
      const icon = button?.querySelector('.ed-play-icon');
      if (label) label.textContent = video.paused ? 'Phát thước phim' : 'Tạm dừng thước phim';
      if (icon) icon.textContent = video.paused ? '▶' : 'Ⅱ';
    };
    button?.addEventListener('click', async () => {
      if (!video.paused) { video.pause(); return; }
      prepareVideo(video);
      videos.forEach(other => { if (other !== video) other.pause(); });
      try { await video.play(); } catch {
        const message = video.closest('figure')?.querySelector('.ed-video-error');
        if (message) message.hidden = false;
      }
    });
    video.addEventListener('play', () => {
      videos.forEach(other => { if (other !== video) other.pause(); });
      updateButton();
    });
    video.addEventListener('pause', updateButton);
    video.addEventListener('ended', updateButton);
    video.addEventListener('pointerdown', () => prepareVideo(video), { once: true });
    video.addEventListener('error', () => {
      const message = video.closest('figure')?.querySelector('.ed-video-error');
      if (message) message.hidden = false;
    });
  });
  if ('IntersectionObserver' in window && videos.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) prepareVideo(entry.target);
        else if (!entry.target.paused) entry.target.pause();
      });
    }, { threshold: .08 });
    videos.forEach(video => observer.observe(video));
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach(video => video.pause());
  });

  const cards = [...document.querySelectorAll('.ed-gallery-item')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const count = document.querySelector('.ed-gallery-count');
  const dialog = document.querySelector('.ed-lightbox');
  const galleryImage = dialog?.querySelector('[data-lightbox-image]');
  const galleryTitle = dialog?.querySelector('#ed-lightbox-title');
  const galleryCaption = dialog?.querySelector('[data-lightbox-caption]');
  const galleryCount = dialog?.querySelector('[data-lightbox-count]');
  let currentImage = 0;
  let previousOverflow = '';
  let previousFocus = null;
  function visibleCards() { return cards.filter(card => !card.hidden); }
  function filterGallery(filter) {
    cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
    if (count) count.textContent = visibleCards().length + ' khung hình';
  }
  filters.forEach(button => button.addEventListener('click', () => filterGallery(button.dataset.filter)));
  function showImage(index) {
    const items = visibleCards();
    if (!items.length || !galleryImage) return;
    currentImage = (index + items.length) % items.length;
    const button = items[currentImage].querySelector('[data-image]');
    const preview = button.querySelector('img');
    galleryImage.src = button.dataset.image;
    galleryImage.alt = preview.alt;
    galleryImage.width = preview.width;
    galleryImage.height = preview.height;
    galleryTitle.textContent = button.dataset.title;
    galleryCaption.textContent = button.dataset.title;
    galleryCount.textContent = String(currentImage + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
  }
  cards.forEach(card => {
    card.querySelector('[data-image]').addEventListener('click', event => {
      if (!dialog) return;
      previousFocus = event.currentTarget;
      showImage(visibleCards().indexOf(card));
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
    });
  });
  dialog?.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog.close());
  dialog?.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => showImage(currentImage - 1));
  dialog?.querySelector('[data-lightbox-next]')?.addEventListener('click', () => showImage(currentImage + 1));
  dialog?.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const buttons = [...dialog.querySelectorAll('button:not([disabled])')];
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    if (event.key === 'ArrowRight') { event.preventDefault(); showImage(currentImage + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(currentImage - 1); }
    if (event.key === 'Home') { event.preventDefault(); showImage(0); }
    if (event.key === 'End') { event.preventDefault(); showImage(visibleCards().length - 1); }
  });
  dialog?.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog?.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    previousFocus?.focus({ preventScroll: true });
  });
  // Direct links to the outdoor collection preserve a useful filtered view.
  if (cards.length && window.location.hash === '#outdoors') filterGallery('outdoors');
})();
