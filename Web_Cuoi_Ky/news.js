(() => {
  const editorialArticles = globalThis.zephyronArticles;
  const featured = document.querySelector('[data-news-feature]');

  if (location.protocol === 'file:') {
    const header = document.querySelector('[data-site-header]');
    header.innerHTML = `
      <header class="z-header">
        <a class="z-brand" href="index.html"><img src="assets/brand-monochrome/zephyron-horizontal-black.svg" alt="ZEPHYRON"></a>
        <a href="news.html">${featured ? 'Tin Tức &amp; Bài Viết' : 'Quay lại Tin Tức'}</a>
      </header>`;

    if (!featured) {
      const article = editorialArticles.find(item => item.id === new URLSearchParams(location.search).get('id')) ?? editorialArticles[0];
      document.title = article.title + ' — ZEPHYRON';
      const byline = article.author ? article.author + ' · ' + article.minutes + ' phút đọc' : 'Ban biên tập ZEPHYRON';
      const sources = article.sources?.length ? `<h2>Nguồn tham khảo</h2><ul>${article.sources.map(([name, link]) => `<li><a href="${link}">${name}</a></li>`).join('')}</ul>` : '';
      document.querySelector('[data-page="article"]').innerHTML = `
        <article class="z-article">
          <div class="z-page-heading">
            <p class="z-kicker"><a href="news.html">Tin Tức</a> / ${article.category}</p>
            <h1>${article.title}</h1>
            <p>${article.intro}</p>
          </div>
          <p class="z-form-note">${byline}</p>
          <img src="${({corvette:"assets/editorial/user-corvette.jpg",bmw:"assets/editorial/user-bmw-m4-g82.jpg",porsche:"assets/editorial/user-porsche-911-gt3.jpg",mercedes:"assets/editorial/user-mercedes-amg-sl63.jpg",lamborghini:"assets/editorial/user-revuelto.jpg"}[article.car] || "assets/studio/" + article.car + "-hero.webp")}" alt="">
          ${article.body.map(([heading, text]) => `<h2>${heading}</h2><p>${text}</p>`).join('')}
          ${sources}
          <p><a class="z-button" href="news.html#bai-viet">Xem tất cả tin tức</a></p>
        </article>`;
      return;
    }
  }

  if (!featured) return;
  const newsArticles = editorialArticles.filter(article => article.section);
  const filters = document.querySelector('[data-news-filters]');
  const cards = document.querySelector('[data-news-cards]');
  const status = document.querySelector('[data-news-status]');
  const categories = [['all', 'Tất cả'], ...newsArticles.map(article => [article.section, article.category])];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  const photo = article => ({corvette:"assets/editorial/user-corvette.jpg",bmw:"assets/editorial/user-bmw-m4-g82.jpg",porsche:"assets/editorial/user-porsche-911-gt3.jpg",mercedes:"assets/editorial/user-mercedes-amg-sl63.jpg",lamborghini:"assets/editorial/user-revuelto.jpg"}[article.car] || "assets/studio/" + article.car + "-hero.webp");
  const url = article => 'article.html?id=' + article.id;
  const cta = article => `<a class="news-cta" href="${url(article)}">Đọc bài viết <span aria-hidden="true">↗</span></a>`;
  const byline = article => `<p class="news-meta">${article.author} · ${article.minutes} phút đọc</p>`;

  const lead = newsArticles[0];
  featured.innerHTML = `
    <figure class="news-feature-image news-photo">
      <img src="${photo(lead)}" alt="Porsche 911 GT3 trong studio" width="1600" height="900" fetchpriority="high" decoding="async">
      <figcaption class="news-badge">Tiêu điểm</figcaption>
    </figure>
    <div class="news-feature-copy">
      <div class="news-feature-panel">
        <p class="news-kicker">${lead.category}</p>
        <h2 id="news-feature-title">${lead.title}</h2>
        <p>${lead.intro}</p>
        ${byline(lead)}
        ${cta(lead)}
      </div>
      <div class="news-feature-panel">
        <p class="news-kicker">Chi tiết kỹ thuật</p>
        <h3>Boxer 6 xi-lanh. Sáu bướm ga riêng.</h3>
        <p>${lead.body[0][1]}</p>
      </div>
    </div>`;

  filters.innerHTML = categories.map(([key, label]) =>
    `<button type="button" data-news-filter="${key}" aria-pressed="${key === 'all'}">${label}</button>`
  ).join('');

  cards.innerHTML = newsArticles.map(article => `
    <article class="news-card flex flex-col" data-news-category="${article.section}" aria-labelledby="title-${article.id}">
      <div class="news-photo">
        <img src="${photo(article)}" alt="" width="1600" height="900" loading="lazy" decoding="async">
        <span class="news-badge">${article.category}</span>
      </div>
      <div class="news-card-body flex flex-1 flex-col">
        ${byline(article)}
        <h3 id="title-${article.id}">${article.title}</h3>
        <p>${article.intro}</p>
        <ul class="news-tags flex flex-wrap gap-2" aria-label="Thẻ chủ đề">${article.tags.map(tag => `<li>${tag}</li>`).join('')}</ul>
        ${cta(article)}
      </div>
    </article>`
  ).join('');

  const buttons = [...filters.querySelectorAll('button')];
  const entries = [...cards.children];
  function filterArticles(category) {
    let visible = 0;
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.newsFilter === category));
    });
    entries.forEach(card => {
      card.hidden = category !== 'all' && card.dataset.newsCategory !== category;
      if (!card.hidden) visible++;
    });
    status.textContent = visible + ' bài viết';
  }
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-news-filter]');
    if (button) filterArticles(button.dataset.newsFilter);
  });
  document.querySelector('[data-news-all]').addEventListener('click', () => filterArticles('all'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(items => {
      items.filter(item => item.isIntersecting).forEach(({ target }, index) => {
        target.style.setProperty('--news-delay', (index * 65) + 'ms');
        if (!reducedMotion.matches) target.classList.add('news-revealed');
        observer.unobserve(target);
      });
    }, { threshold: .16 });
    entries.forEach(card => observer.observe(card));
  }
})();
