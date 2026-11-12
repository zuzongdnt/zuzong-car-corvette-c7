const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const pendingImages = new WeakMap();
const fades = new WeakMap();

export function observeProductReveals(main) {
  if (!('IntersectionObserver' in window) || reducedMotion.matches) return;

  const cards = '.z-product-tile, .z-products-journal .z-card, .z-digital-grid > *';
  const targets = main.querySelectorAll([
    ':scope > section:not(.z-products-campaign) h2:not(.z-card h2)',
    ':scope > #products-studio .z-studio-head h2',
    cards
  ].join(', '));

  const observer = new IntersectionObserver(entries => {
    const groupCounts = new Map();
    for (const {target, isIntersecting} of entries) {
      if (!isIntersecting) continue;
      if (target.matches(cards)) {
        const group = target.parentElement;
        const index = groupCounts.get(group) ?? 0;
        target.style.setProperty('--product-reveal-delay', Math.min(index, 4) * 70 + 'ms');
        groupCounts.set(group, index + 1);
      }
      target.classList.add('z-product-reveal');
      observer.unobserve(target);
    }
  }, {threshold: 0.1});

  for (const target of targets) {
    if (target.getBoundingClientRect().top >= innerHeight) observer.observe(target);
  }
}

export async function changeProductImage(image, src, alt) {
  const request = {src};
  if (pendingImages.get(image)?.src === src) return;
  pendingImages.set(image, request);

  const current = image.getAttribute('src');
  if (!current || current === src || reducedMotion.matches || !image.decode || !image.animate) {
    image.src = src;
    image.alt = alt;
    return;
  }

  const next = new Image();
  next.src = src;
  try {
    await next.decode();
  } catch {
    // Keep the previous image available if the next file fails to load.
    if (pendingImages.get(image) === request) pendingImages.delete(image);
    return;
  }
  if (pendingImages.get(image) !== request || !image.isConnected) return;

  fades.get(image)?.cancel();
  const rect = image.getBoundingClientRect();
  const canFade = !reducedMotion.matches && image.complete && image.naturalWidth &&
    rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight;

  if (canFade) {
    const previous = new Image();
    previous.src = image.currentSrc || image.src;
    previous.alt = '';
    previous.className = 'z-product-image-previous';
    previous.setAttribute('aria-hidden', 'true');
    const style = getComputedStyle(image);
    Object.assign(previous.style, {
      top: image.offsetTop + 'px',
      left: image.offsetLeft + 'px',
      right: 'auto',
      bottom: 'auto',
      width: image.offsetWidth + 'px',
      height: image.offsetHeight + 'px',
      objectFit: style.objectFit,
      objectPosition: style.objectPosition,
      padding: style.padding,
      borderRadius: style.borderRadius,
      zIndex: style.zIndex
    });
    image.after(previous);

    const fade = previous.animate([{opacity: 1}, {opacity: 0}], {
      duration: 360, easing: 'ease-out', fill: 'forwards'
    });
    fades.set(image, fade);
    const cleanup = () => {
      previous.remove();
      if (fades.get(image) === fade) fades.delete(image);
    };
    fade.finished.then(cleanup, cleanup);
  }

  image.src = src;
  image.alt = alt;
}
