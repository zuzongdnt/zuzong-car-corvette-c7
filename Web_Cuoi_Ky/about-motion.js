const main = document.querySelector('main[data-page="about"]');
const root = document.documentElement;
const motion = matchMedia('(prefers-reduced-motion: no-preference)');
const finePointer = matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)');
const heroImage = main.querySelector('.z-about-hero-visual img');
const loader = document.querySelector('.z-page-loader[open]');

function showPage() {
  if (!location.hash) main.classList.add('is-about-ready');
}
if (loader) {
  loader.addEventListener('close', () => {
    document.body.focus({ preventScroll: true });
    showPage();
  }, { once: true });
  const waitForHero = new Promise(resolve => {
    const deadline = setTimeout(resolve, 1200);
    Promise.resolve(heroImage.decode?.()).catch(() => {}).finally(() => {
      clearTimeout(deadline);
      resolve();
    });
  });
  window.finishPageLoad?.(waitForHero);
} else {
  showPage();
}

const navigation = main.querySelector('.z-about-nav');
const navLinks = [...navigation.querySelectorAll('a')];
const sections = navLinks.map(link => document.getElementById(link.hash.slice(1)));
const siteHeader = document.querySelector('[data-site-header]');
const progress = document.querySelector('.z-about-progress');
const progressFill = progress.firstElementChild;
const readingPosition = navigation.querySelector('[data-about-position]');
const toTop = document.querySelector('.z-about-to-top');
const heroMedia = main.querySelector('.z-about-hero-media');
let headerHeight = 0;
let navHeight = 0;
let currentSection = -1;
let scrollFrame = 0;

function paintScroll() {
  scrollFrame = 0;
  const y = window.scrollY;
  const distance = root.scrollHeight - root.clientHeight;
  const marker = headerHeight + navHeight + 26;
  let current = -1;
  sections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= marker) current = index;
  });
  const parallax = motion.matches && finePointer.matches && y < heroMedia.offsetHeight + window.innerHeight
    ? Math.min(heroMedia.clientHeight * 0.025, Math.max(0, y) * 0.05) : 0;

  const fraction = distance > 0 ? Math.min(1, Math.max(0, y / distance)) : 0;
  progressFill.style.transform = 'scaleX(' + fraction + ')';
  const percentage = String(Math.round(fraction * 100));
  if (progress.getAttribute('aria-valuenow') !== percentage) {
    progress.setAttribute('aria-valuenow', percentage);
  }
  toTop.hidden = y < 550;
  heroMedia.style.setProperty('--about-parallax', parallax + 'px');
  if (current !== currentSection) {
    navLinks[currentSection]?.removeAttribute('aria-current');
    navLinks[current]?.setAttribute('aria-current', 'location');
    readingPosition.hidden = current < 0;
    readingPosition.textContent = current < 0 ? '' : 'Đang xem · ' + navLinks[current].textContent;
    currentSection = current;
  }
}

function scheduleScroll() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll);
}
function measureNavigation() {
  headerHeight = siteHeader.offsetHeight;
  navHeight = navigation.offsetHeight;
  root.style.setProperty('--about-header-height', headerHeight + 'px');
  root.style.setProperty('--about-nav-height', navHeight + 'px');
  scheduleScroll();
}
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', measureNavigation, { passive: true });
motion.addEventListener('change', scheduleScroll);
finePointer.addEventListener('change', scheduleScroll);
if ('ResizeObserver' in window) {
  const layoutObserver = new ResizeObserver(measureNavigation);
  layoutObserver.observe(siteHeader);
  layoutObserver.observe(navigation);
}
measureNavigation();

toTop.addEventListener('click', event => {
  event.preventDefault();
  if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
  main.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: motion.matches ? 'smooth' : 'instant' });
});

function animateCount(element) {
  const total = Number(element.dataset.aboutCount);
  const start = performance.now();
  function step(now) {
    const fraction = Math.min((now - start) / 720, 1);
    element.textContent = Math.round(total * (1 - (1 - fraction) ** 2));
    if (fraction < 1 && motion.matches) requestAnimationFrame(step);
    else element.textContent = total;
  }
  element.textContent = '0';
  requestAnimationFrame(step);
}

if ('IntersectionObserver' in window) {
  const reveals = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      reveals.unobserve(entry.target);
      if (!motion.matches) continue;
      if (entry.target.hasAttribute('data-about-count')) animateCount(entry.target);
      else entry.target.classList.add('is-about-revealed');
    }
  }, { threshold: 0.08 });
  main.querySelectorAll('[data-about-reveal], [data-about-count]').forEach(element => reveals.observe(element));
  main.querySelectorAll('[data-about-stagger]').forEach(group => {
    [...group.children].forEach((child, index) => {
      child.style.setProperty('--about-delay', (index * 85) + 'ms');
    });
  });
}

const carousel = main.querySelector('[data-about-carousel]');
const track = carousel.querySelector('[data-about-track]');
const slides = [...track.children];
const controls = carousel.querySelector('[data-about-carousel-controls]');
const counter = carousel.querySelector('[data-about-slide-count]');
let activeSlide = 0;
let carouselFrame = 0;

const slideButtons = slides.map(slide => slide.querySelector('[data-about-open-photo]'));
const photoNames = slides.map(slide => slide.querySelector('figcaption').textContent);
const slideAnnouncement = carousel.querySelector('[data-about-slide-announcement]');

function syncSlideAccessibility() {
  slides.forEach((slide, index) => {
    const isActive = index === activeSlide;
    if (!isActive && slide.contains(document.activeElement)) track.focus({ preventScroll: true });
    slide.inert = !isActive;
    slideButtons[index].tabIndex = isActive ? 0 : -1;
  });
}

function watchPhoto(button) {
  const photo = button.querySelector('img');
  const placeholder = button.querySelector('.z-about-photo-state');

  function loaded() {
    button.removeAttribute('data-photo-state');
    button.removeAttribute('aria-busy');
  }
  function failed() {
    if (photo.hasAttribute('srcset') && photo.currentSrc !== photo.src) {
      photo.removeAttribute('srcset');
      return;
    }
    button.dataset.photoState = 'error';
    placeholder.textContent = 'Ảnh chưa tải được';
    button.removeAttribute('aria-busy');
  }
  if (photo.complete && photo.naturalWidth) return;
  button.dataset.photoState = 'loading';
  button.setAttribute('aria-busy', 'true');
  photo.addEventListener('load', loaded);
  photo.addEventListener('error', failed);
  if (photo.complete) failed();
}

slideButtons.forEach(watchPhoto);
syncSlideAccessibility();

function setActiveSlide() {
  carouselFrame = 0;
  if (!track.clientWidth) return;
  const index = Math.min(slides.length - 1, Math.max(0, Math.round(track.scrollLeft / track.clientWidth)));
  if (activeSlide === index) return;
  activeSlide = index;
  counter.textContent = (index + 1) + ' / ' + slides.length;
  slideAnnouncement.textContent = photoNames[index] + ', ảnh ' + (index + 1) + ' trên ' + slides.length;
  syncSlideAccessibility();
}
function goToSlide(index, animate = true) {
  track.scrollTo({ left: index * track.clientWidth, behavior: animate && motion.matches ? 'smooth' : 'instant' });
}
function moveSlide(direction) {
  goToSlide((activeSlide + direction + slides.length) % slides.length);
}
controls.hidden = false;
controls.querySelector('[data-about-prev]').addEventListener('click', () => moveSlide(-1));
controls.querySelector('[data-about-next]').addEventListener('click', () => moveSlide(1));
carousel.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  moveSlide(event.key === 'ArrowLeft' ? -1 : 1);
});
track.addEventListener('scroll', () => {
  if (!carouselFrame) carouselFrame = requestAnimationFrame(setActiveSlide);
}, { passive: true });

const mediaTabs = main.querySelector('.z-about-media-tabs');
const tabs = [...mediaTabs.querySelectorAll('[role="tab"]')];
const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
const film = panels[1].querySelector('video');

function selectMedia(tab) {
  tabs.forEach((item, index) => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    panels[index].hidden = !selected;
  });
  if (tab === tabs[0]) {
    film.pause();
    goToSlide(activeSlide, false);
  } else if (!film.poster) {
    film.poster = film.dataset.poster;
  }
  scheduleScroll();
}
mediaTabs.hidden = false;
selectMedia(tabs[0]);
tabs.forEach(tab => tab.addEventListener('click', () => selectMedia(tab)));
mediaTabs.addEventListener('keydown', event => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const index = tabs.indexOf(event.target);
  const next = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : tabs[1 - index];
  selectMedia(next);
  next.focus();
});

const lightbox = main.querySelector('[data-about-lightbox]');
const zoomButton = lightbox.querySelector('[data-about-zoom]');
const lightboxStage = lightbox.querySelector('.z-lightbox-stage');
const lightboxImage = lightboxStage.querySelector('img');
const lightboxCaption = lightbox.querySelector('[data-about-lightbox-caption]');
let lightboxIndex = 0;

function setZoom(zoomed) {
  lightboxStage.classList.toggle('is-zoomed', zoomed);
  zoomButton.setAttribute('aria-pressed', String(zoomed));
  zoomButton.textContent = zoomed ? 'Thu nhỏ ảnh' : 'Phóng to ảnh';
  lightboxStage.scrollTo({
    top: zoomed ? (lightboxStage.scrollHeight - lightboxStage.clientHeight) / 2 : 0,
    left: zoomed ? (lightboxStage.scrollWidth - lightboxStage.clientWidth) / 2 : 0,
    behavior: 'instant'
  });
}

function showLightboxPhoto(index) {
  lightboxIndex = (index + slides.length) % slides.length;
  const slide = slides[lightboxIndex];
  const image = slide.querySelector('img');
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = slide.querySelector('figcaption').textContent +
    ' · ' + (lightboxIndex + 1) + ' / ' + slides.length;
  setZoom(false);
}

function openLightbox(index) {
  showLightboxPhoto(index);
  lightbox.showModal();
}

if (typeof lightbox.showModal === 'function') {
  carousel.querySelector('[data-about-open-current]').addEventListener('click', () => openLightbox(activeSlide));
  slideButtons.forEach((button, index) => {
    button.addEventListener('click', () => openLightbox(index));
  });
} else {
  carousel.querySelector('[data-about-open-current]').hidden = true;
}

lightbox.querySelector('[data-about-close]').addEventListener('click', () => lightbox.close());
lightbox.querySelector('[data-about-lightbox-prev]').addEventListener('click', () => showLightboxPhoto(lightboxIndex - 1));
lightbox.querySelector('[data-about-lightbox-next]').addEventListener('click', () => showLightboxPhoto(lightboxIndex + 1));
zoomButton.addEventListener('click', () => setZoom(!lightboxStage.classList.contains('is-zoomed')));
lightbox.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  if (event.target === lightboxStage && lightboxStage.classList.contains('is-zoomed')) return;
  event.preventDefault();
  showLightboxPhoto(lightboxIndex + (event.key === 'ArrowLeft' ? -1 : 1));
});
lightbox.addEventListener('close', () => {
  goToSlide(lightboxIndex, false);
  setActiveSlide();
  slideButtons[lightboxIndex].focus({ preventScroll: true });
});

const magnetic = main.querySelector('[data-about-magnetic]');
const cta = magnetic.querySelector('a');
magnetic.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || !motion.matches || !finePointer.matches) return;
  const rect = magnetic.getBoundingClientRect();
  cta.style.setProperty('--about-magnetic-x', (event.clientX - rect.left - rect.width / 2) * 0.075 + 'px');
  cta.style.setProperty('--about-magnetic-y', (event.clientY - rect.top - rect.height / 2) * 0.14 + 'px');
});
magnetic.addEventListener('pointerleave', () => {
  cta.style.removeProperty('--about-magnetic-x');
  cta.style.removeProperty('--about-magnetic-y');
});

heroMedia.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || !motion.matches || !finePointer.matches) return;
  const rect = heroMedia.getBoundingClientRect();
  heroMedia.style.setProperty('--about-pointer-x', event.clientX - rect.left + 'px');
  heroMedia.style.setProperty('--about-pointer-y', event.clientY - rect.top + 'px');
});

let leaving = false;
document.addEventListener('click', event => {
  const link = event.target.closest('a[href]');
  if (!link || event.defaultPrevented || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      link.hasAttribute('download') || (link.target && link.target !== '_self') ||
      !motion.matches) return;
  const destination = new URL(link.href);
  if (destination.origin !== location.origin ||
      (destination.pathname === location.pathname && destination.search === location.search)) return;
  event.preventDefault();
  if (leaving) return;
  leaving = true;
  document.body.classList.add('is-about-leaving');
  setTimeout(() => location.assign(destination.href), 180);
});
window.addEventListener('pageshow', () => {
  leaving = false;
  document.body.classList.remove('is-about-leaving');
  scheduleScroll();
});
