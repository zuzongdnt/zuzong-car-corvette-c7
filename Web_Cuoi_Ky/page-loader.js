(() => {
  if (location.hash || typeof window.HTMLDialogElement?.prototype.showModal !== 'function') return;

  const overlay = document.createElement('dialog');
  overlay.className = 'z-page-loader';
  overlay.setAttribute('aria-labelledby', 'z-page-loader-status');
  overlay.innerHTML = `
    <div class="z-page-loader-content">
      <img src="assets/brand-monochrome/zephyron-horizontal-black.svg" width="1634" height="804" alt="ZEPHYRON">
      <span class="z-page-loader-track" aria-hidden="true"></span>
      <p id="z-page-loader-status" role="status" tabindex="-1" autofocus>Đang tải hình ảnh…</p>
      <button type="button">Bỏ qua</button>
    </div>`;
  document.body.append(overlay);
  overlay.showModal();

  const openedAt = performance.now();
  const limit = setTimeout(finish, 4200);
  let closing = false;

  function finish() {
    if (closing || !overlay.open) return;
    closing = true;
    clearTimeout(limit);
    overlay.classList.add('is-leaving');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) overlay.close();
    else setTimeout(() => overlay.close(), 260);
  }

  overlay.querySelector('button').addEventListener('click', finish);
  overlay.addEventListener('close', () => {
    clearTimeout(limit);
    overlay.remove();
  }, {once:true});

  window.finishPageLoad = mediaReady => {
    Promise.resolve(mediaReady).finally(() => {
      const delay = Math.max(0, 360 - (performance.now() - openedAt));
      setTimeout(finish, delay);
    }).catch(() => {});
  };
})();
