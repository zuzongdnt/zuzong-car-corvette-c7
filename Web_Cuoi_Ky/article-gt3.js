(() => {
  const article = document.querySelector('.gt3-article');
  const hero = document.querySelector('.gt3-hero');
  const progress = document.querySelector('.gt3-progress');
  const chapters = [...article.querySelectorAll('[data-chapter]')];
  const links = [...article.querySelectorAll('.gt3-toc a')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let active = -1;
  let heroHeight = 0;
  let articleStart = 0;
  let readingDistance = 1;
  let chapterStarts = [];

  const clamp = value => Math.max(0, Math.min(1, value));
  function update() {
    frame = 0;
    const position = window.scrollY;
    const percentage = Math.round(clamp((position - articleStart) / readingDistance) * 100);
    if (progress.value !== percentage) progress.value = percentage;
    if (!reduced.matches) {
      const ratio = clamp((position - articleStart) / heroHeight);
      hero.style.setProperty('--gt3-hero-scale', 1.12 - .12 * ratio);
      hero.style.setProperty('--gt3-hero-opacity', 1 - .72 * ratio);
      hero.style.setProperty('--gt3-hero-y', ratio * 34 + 'px');
    }
    const readingLine = position + window.innerHeight * .32;
    const current = chapterStarts.reduce((index, top, chapter) => top <= readingLine ? chapter : index, -1);
    if (current === active) return;
    links[active]?.removeAttribute('aria-current');
    links[current]?.setAttribute('aria-current', 'location');
    active = current;
  }
  function queueUpdate() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  function measure() {
    articleStart = article.getBoundingClientRect().top + window.scrollY;
    heroHeight = hero.offsetHeight || 1;
    readingDistance = Math.max(1, article.offsetHeight - window.innerHeight);
    chapterStarts = chapters.map(section => section.getBoundingClientRect().top + window.scrollY);
    queueUpdate();
  }
  window.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', measure);
  reduced.addEventListener('change', queueUpdate);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(article);
  measure();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.filter(entry => entry.isIntersecting).forEach(({ target }) => {
        if (!reduced.matches) target.classList.add('gt3-revealed');
        observer.unobserve(target);
      });
    }, { threshold: .16 });
    document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
  }

  const shareStatus = document.querySelector('[data-share-status]');
  document.querySelector('[data-share]').addEventListener('click', async () => {
    const link = new URL(location.href);
    link.hash = '';
    if (link.protocol === 'file:') {
      shareStatus.textContent = 'Mở bài trên website đã xuất bản để chia sẻ liên kết công khai.';
      return;
    }
    try {
      const payload = { title: document.querySelector('h1').textContent, url: link.href };
      if (navigator.share && (!navigator.canShare || navigator.canShare(payload))) {
        await navigator.share(payload);
        shareStatus.textContent = 'Đã mở chia sẻ.';
        return;
      }
      await navigator.clipboard.writeText(link.href);
      shareStatus.textContent = 'Đã sao chép liên kết bài viết.';
    } catch (error) {
      if (error.name !== 'AbortError') shareStatus.textContent = 'Liên kết bài viết: ' + link.href;
    }
  });

  const viewer = document.querySelector('.gt3-dialog');
  const viewerContent = viewer.querySelector('[data-viewer-content]');
  const photo = document.querySelector('[data-gallery-image]');
  const modelPath = 'assets/model/studio/porsche.glb';
  const angles = [['hero', 'Góc trước'], ['side', 'Góc ngang'], ['rear', 'Góc sau']];

  function showAngles() {
    let index = 0;
    const image = document.createElement('img');
    const caption = document.createElement('p');
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'gt3-button';
    next.textContent = 'Góc tiếp theo';
    caption.setAttribute('role', 'status');
    function selectAngle() {
      const [file, label] = angles[index];
      image.src = 'assets/studio/porsche-' + file + '.webp';
      image.alt = label + ' của Porsche 911 GT3';
      caption.textContent = label + ' · Xem mô hình 3D tương tác qua npm start.';
    }
    next.addEventListener('click', () => {
      index = (index + 1) % angles.length;
      selectAngle();
    });
    selectAngle();
    viewerContent.replaceChildren(image, caption, next);
  }
  document.querySelector('[data-open-photo]').addEventListener('click', () => {
    const image = document.createElement('img');
    image.src = photo.currentSrc || photo.src;
    image.alt = photo.alt;
    viewerContent.replaceChildren(image);
    viewer.showModal();
  });
  document.querySelector('[data-open-model]').addEventListener('click', async () => {
    viewer.showModal();
    if (location.protocol === 'file:') {
      showAngles();
      return;
    }
    viewerContent.textContent = 'Đang tải mô hình 3D…';
    try {
      await import('./assets/vendor/model-viewer/model-viewer.min.js');
      if (!viewer.open || viewerContent.firstElementChild) return;
      const model = document.createElement('model-viewer');
      model.setAttribute('camera-controls', '');
      model.setAttribute('touch-action', 'pan-y');
      model.setAttribute('alt', 'Mô hình Porsche 911 GT3 có thể xoay 360 độ');
      model.addEventListener('error', () => { if (viewer.open && model.isConnected) showAngles(); }, { once: true });
      model.setAttribute('src', modelPath);
      viewerContent.replaceChildren(model);
    } catch {
      if (viewer.open && !viewerContent.firstElementChild) showAngles();
    }
  });
  viewer.querySelector('[data-close-viewer]').addEventListener('click', () => viewer.close());
  viewer.addEventListener('close', () => viewerContent.replaceChildren());

  const form = document.querySelector('[data-consult]');
  const intent = form.elements.intent;
  const date = form.elements.date;
  const formStatus = document.querySelector('[data-form-status]');
  date.min = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
  function syncDate() {
    const testDrive = intent.value === 'testdrive';
    date.closest('label').hidden = !testDrive;
    date.disabled = !testDrive;
    date.required = testDrive;
  }
  intent.addEventListener('change', syncDate);
  document.querySelector('[data-test-drive]').addEventListener('click', () => {
    intent.value = 'testdrive';
    syncDate();
  });
  syncDate();
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    if (name.length < 2) {
      formStatus.textContent = 'Nhập họ và tên có ít nhất hai ký tự.';
      form.elements.name.focus();
      return;
    }
    try {
      const key = 'zuzong.requests';
      const requests = JSON.parse(localStorage.getItem(key) ?? '[]');
      const request = {
        id: 'ZZ-' + crypto.randomUUID(),
        created: new Date().toISOString(),
        name,
        email: form.elements.email.value.trim(),
        intent: intent.value,
        date: date.disabled ? '' : date.value,
        note: 'Porsche 911 GT3 · Bài viết đánh giá',
        configs: [],
        status: 'Chờ tư vấn'
      };
      localStorage.setItem(key, JSON.stringify([request, ...requests]));
      form.reset();
      syncDate();
      formStatus.textContent = 'Đã lưu yêu cầu mẫu cho Porsche 911 GT3 trên trình duyệt.';
    } catch {
      formStatus.textContent = 'Chưa lưu được yêu cầu. Thông tin vẫn còn trong biểu mẫu.';
    }
  });
})();
