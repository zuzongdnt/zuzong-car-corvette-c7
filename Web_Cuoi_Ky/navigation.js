import './bottom-nav.js';

const THEME_STORAGE_KEY='zephyron-site-theme';
const readSiteTheme=()=>{
  try{return localStorage.getItem(THEME_STORAGE_KEY)==='dark'?'dark':'light';}
  catch{return 'light';}
};
function applySiteTheme(theme=readSiteTheme()){
  const next=theme==='dark'?'dark':'light';
  document.documentElement.dataset.siteTheme=next;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',next==='dark'?'#111214':'#ffffff');
  return next;
}
applySiteTheme();
if(!document.querySelector('link[data-site-theme-styles]')){
  const themeStyles=document.createElement('link');
  themeStyles.rel='stylesheet';
  themeStyles.href=new URL('./theme.css',import.meta.url).href;
  themeStyles.dataset.siteThemeStyles='';
  document.head.append(themeStyles);
}

const primary=[['index.html','Trang chủ'],['about.html','Giới thiệu'],['products.html','Sản phẩm','Studio 3D'],['explore.html','Khám phá'],['gallery.html','Bộ sưu tập']];
const news=['news.html','Tin tức','Bài viết'];
const contact=['contact.html','Liên hệ'];
const secondary=[['explore.html#journey','Hành trình','Corvette'],['explore.html#films','Thước phim','Video Corvette'],news,['contact.html','Liên hệ / Showroom'],['account.html','Tài khoản'],['cart.html','Giỏ đặt trước']];

export function mountNavigation(searchEntries){
  const filename=location.pathname.split('/').pop()||'index.html';
  const current=({'product.html':'products.html','article.html':'news.html'})[filename]||filename;
  const links=(items,active=filename)=>items.map(([href,label])=>`<a href="${href}"${active===href?' aria-current="page"':''}>${label}</a>`).join('');
  const target=document.querySelector('[data-site-header]');
  if(target)target.innerHTML=`<header class="site-header is-scrolled">
    <a class="brand" href="index.html" aria-label="ZEPHYRON, về trang chủ"><img class="brand-logo" src="assets/brand-monochrome/zephyron-horizontal-black.svg" width="1634" height="804" alt=""></a>
    <nav class="desktop-nav" aria-label="Điều hướng chính"></nav>
    <a class="header-cta" href="cart.html"></a>
    <button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span></button>
    <nav id="mobile-nav" class="mobile-nav" aria-label="Điều hướng trên điện thoại" hidden></nav>
    <div class="reading-progress" aria-hidden="true"></div>
  </header>`;
  const header=document.querySelector('.site-header');
  if(!header||header.dataset.navigationReady)return;
  header.querySelector('.desktop-nav').innerHTML=links([...primary,news,contact],current);
  const mobile=header.querySelector('.mobile-nav'),toggle=header.querySelector('.menu-toggle');
  mobile.setAttribute('aria-label','Điều hướng trên điện thoại');
  mobile.innerHTML=`<div class="nav-primary-links">${links(primary,current===news[0]?'explore.html':current)}</div><div class="nav-secondary-links">${links(secondary)}</div>`;
  const cta=header.querySelector('.header-cta');
  cta.href='cart.html';cta.innerHTML='GIỎ ĐẶT TRƯỚC <span data-cart-count>0</span>';
  let account=header.querySelector('.z-legacy-account');
  if(!account){account=document.createElement('a');account.className='z-legacy-account';account.href='account.html';account.textContent='Tài khoản';header.insertBefore(account,toggle);}
  if(filename==='account.html')account.setAttribute('aria-current','page');
  if(filename==='cart.html')cta.setAttribute('aria-current','page');
  toggle.type='button';
  mountThemeToggle(header,toggle);
  const close=(restore=false)=>{
    toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Mở menu');
    mobile.hidden=true;header.classList.remove('menu-is-open');
    if(restore)toggle.focus();
  };
  mountSearch(toggle,close,searchEntries);
  toggle.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')!=='true';
    toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Đóng menu':'Mở menu');
    mobile.hidden=!open;header.classList.toggle('menu-is-open',open);
  });
  mobile.addEventListener('click',event=>{if(event.target.closest('a'))close();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!mobile.hidden){event.preventDefault();close(true);}});
  document.addEventListener('pointerdown',event=>{if(!header.contains(event.target))close();});
  document.addEventListener('focusin',event=>{if(!header.contains(event.target))close();});
  matchMedia('(max-width:760px)').addEventListener('change',()=>close());
  if(filename!=='index.html')header.classList.add('is-scrolled');
  header.dataset.navigationReady='true';
}

function mountThemeToggle(header,menuToggle){
  let button=header.querySelector('.nav-theme-toggle');
  if(!button){
    button=document.createElement('button');
    button.className='nav-theme-toggle';
    button.type='button';
    button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"></svg><span data-theme-label></span>';
    menuToggle.insertAdjacentElement('beforebegin',button);
  }
  const update=theme=>{
    const dark=theme==='dark';
    button.setAttribute('aria-pressed',String(dark));
    button.setAttribute('aria-label',dark?'Chuyển sang giao diện sáng':'Chuyển sang giao diện tối');
    button.title=dark?'Chuyển sang giao diện sáng':'Chuyển sang giao diện tối';
    button.querySelector('[data-theme-label]').textContent=dark?'Tối':'Sáng';
    button.querySelector('svg').innerHTML=dark
      ?'<path d="M20.1 15.1A8.3 8.3 0 0 1 8.9 3.9 8.5 8.5 0 1 0 20.1 15.1Z"/>'
      :'<circle cx="12" cy="12" r="3.7"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>';
  };
  update(document.documentElement.dataset.siteTheme||readSiteTheme());
  if(button.dataset.themeReady)return;
  button.addEventListener('click',()=>{
    const next=applySiteTheme(document.documentElement.dataset.siteTheme==='dark'?'light':'dark');
    try{localStorage.setItem(THEME_STORAGE_KEY,next);}catch{}
    update(next);
  });
  button.dataset.themeReady='true';
}

function mountSearch(toggle, closeMenu, entries){
  toggle.insertAdjacentHTML('beforebegin',`<button class="nav-search-toggle" type="button" aria-label="Tìm kiếm" aria-haspopup="dialog" aria-controls="nav-search-dialog" title="Tìm kiếm">
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3"/><path d="m15.3 15.3 4.4 4.4"/></svg>
  </button>`);
  document.body.insertAdjacentHTML('beforeend',`<dialog class="nav-search" id="nav-search-dialog" aria-labelledby="nav-search-label">
    <div role="search" aria-labelledby="nav-search-label">
      <form method="dialog"><button type="submit">Đóng</button></form>
      <label for="nav-search-input" id="nav-search-label">Tìm kiếm</label>
      <input id="nav-search-input" type="search" placeholder="Ví dụ: Porsche, màu sơn, liên hệ" autocomplete="off" autofocus>
      <p role="status"></p>
      <ul class="nav-search-results"></ul>
    </div>
  </dialog>`);
  const trigger=toggle.previousElementSibling;
  const dialog=document.querySelector('#nav-search-dialog');
  const input=dialog.querySelector('input');
  const status=dialog.querySelector('[role="status"]');
  const results=dialog.querySelector('.nav-search-results');
  const normalize=value=>value.toLowerCase().normalize('NFD').replace(/\p{M}/gu,'').replace(/đ/g,'d');
  const pages=[...primary,...secondary,['policies.html','Bảo mật & điều kiện'],['sources.html','Nguồn hình & model']];
  const index=[...pages.map(([href,title,keywords])=>[href,title,href.includes('#')?'Mục':'Trang',keywords]),...entries].map(([href,title,type,keywords=''])=>{
    const item=document.createElement('li');
    const link=document.createElement('a');
    const label=document.createElement('small');
    link.href=href;
    link.textContent=title;
    label.textContent=type;
    link.append(label);
    item.append(link);
    results.append(item);
    return {item,text:normalize(`${title} ${keywords}`)};
  });
  const filter=()=>{
    const terms=normalize(input.value).trim().split(/\s+/).filter(Boolean);
    let count=0;
    for(const {item,text} of index){
      item.hidden=!terms.length||!terms.every(term=>text.includes(term));
      if(!item.hidden)count++;
    }
    status.textContent=terms.length
      ? (count?`${count} kết quả`:'Không tìm thấy kết quả. Hãy thử từ khóa khác.')
      : 'Tìm theo tên trang, mẫu xe hoặc bài viết.';
  };
  input.addEventListener('input',filter);
  input.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!event.isComposing){
      event.preventDefault();
      dialog.close();
    }
  });
  trigger.addEventListener('click',()=>{
    closeMenu();
    input.value='';
    filter();
    trigger.focus({preventScroll:true});
    dialog.showModal();
  });
  results.addEventListener('click',event=>{
    const link=event.target.closest('a');
    if(link?.hash&&link.pathname===location.pathname)dialog.close();
  });
}
