(() => {
  const page = document.querySelector('.xp-page');
  if (!page) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 900px) and (min-height: 680px) and (hover: hover) and (pointer: fine)');
  const hero = page.querySelector('.xp-hero-stage');
  const lineup = page.querySelector('.xp-lineup');
  const sticky = page.querySelector('.xp-sticky');
  const viewport = page.querySelector('.xp-window');
  const track = page.querySelector('.xp-track');
  const rows = [...page.querySelectorAll('[data-xp-reveal]')];
  let pinned = false;
  let distance = 0;
  let run = 0;
  let header = 0;
  let frame = 0;

  const clamp = value => Math.min(1, Math.max(0, value));

  function paint() {
    frame = 0;
    if (motion.matches) return;

    // Read both section positions before updating styles.
    const heroBox = hero.getBoundingClientRect();
    const heroProgress = clamp((header - heroBox.top) / (heroBox.height * .48));
    const progress = pinned ? clamp((header - lineup.getBoundingClientRect().top) / run) : 0;

    hero.style.setProperty('--xp-hero-scale', String(1.14 - .14 * heroProgress));
    hero.style.setProperty('--xp-hero-y', (14 * heroProgress * (1 - heroProgress)) + 'px');
    hero.style.setProperty('--xp-hero-opacity', String(.78 + .22 * heroProgress));
    if (pinned) {
      track.style.setProperty('--xp-track-x', (-distance * progress) + 'px');
      lineup.style.setProperty('--xp-progress', String(.2 + .8 * progress));
    }
  }

  function queuePaint() {
    if (!frame && !motion.matches) frame = requestAnimationFrame(paint);
  }

  function measure() {
    header = parseFloat(getComputedStyle(page).getPropertyValue('--xp-header'));
    distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
    pinned = !motion.matches && desktop.matches && distance > 0 && sticky.offsetHeight + header <= window.innerHeight;
    if (pinned) {
      viewport.scrollLeft = 0;
      run = Math.min(distance, window.innerHeight * 3.25);
      lineup.style.setProperty('--xp-lineup-height', (sticky.offsetHeight + run) + 'px');
    } else {
      track.style.removeProperty('--xp-track-x');
    }
    page.classList.toggle('xp-pinned', pinned);
    if (motion.matches) {
      ['--xp-hero-scale', '--xp-hero-y', '--xp-hero-opacity'].forEach(property => hero.style.removeProperty(property));
    }
    queuePaint();
  }

  viewport.addEventListener('keydown', event => {
    if (!pinned || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const current = clamp((header - lineup.getBoundingClientRect().top) / run);
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const next = clamp((Math.round(current * 4) + direction) / 4);
    window.scrollTo({ top: window.scrollY + lineup.getBoundingClientRect().top - header + run * next });
  });
  window.addEventListener('scroll', queuePaint, { passive: true });
  window.addEventListener('resize', measure);
  motion.addEventListener('change', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(sticky);
  measure();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach(({ target }, index) => {
        target.style.setProperty('--xp-delay', (index * 65) + 'ms');
        if (!motion.matches) target.classList.add('xp-revealed');
        observer.unobserve(target);
      });
    }, { threshold: .25 });
    rows.forEach(row => observer.observe(row));
  }
})();
