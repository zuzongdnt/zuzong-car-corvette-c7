(() => {
  const items = [
    { href: 'index.html', label: 'Trang chủ', icon: '<path d="m3 10 9-7 9 7M5.5 9v12h13V9M9 21v-8h6v8"/>' },
    { href: 'experience.html', label: 'Hành trình', icon: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2.5 5.5L8 16l2.5-5.5Z"/>' },
    { href: 'films.html', label: 'Thước phim', icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4m-11-6 4 3-4 3Z"/>' },
    { href: 'gallery.html', label: 'Bộ sưu tập', icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 4 4 3-3 5 5"/>' }
  ];
  const current = location.pathname.split('/').pop() || 'index.html';
  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.setAttribute('aria-label', 'Điều hướng dưới màn hình');
  for (const item of items) {
    const link = document.createElement('a');
    link.href = item.href;
    if (current === item.href) link.setAttribute('aria-current', 'page');
    link.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${item.icon}</svg><span>${item.label}</span>`;
    nav.append(link);
  }
  document.body.append(nav);
  document.body.classList.add('has-bottom-nav');
})();
