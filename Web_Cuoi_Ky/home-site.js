import './editorial-data.js';
import {mountNavigation} from './navigation.js';
import {cars,readStore} from './home-studio-data.js';

const articles=globalThis.zephyronArticles;
const list=key=>{const value=readStore(key,[]);return Array.isArray(value)?value:[];};
const brandRightsHTML=()=>`<section class="brand-rights" aria-labelledby="brand-rights-title">
  <h2 id="brand-rights-title">Bản quyền thương hiệu</h2>
  <p>Tên thương hiệu, biểu trưng và tên các dòng xe xuất hiện trên website thuộc quyền của các chủ sở hữu tương ứng.</p>
  <dl class="brand-rights-list">
    <div><dt><a href="https://www.gm.com/copyright-trademark.html"><img class="brand-rights-logo brand-rights-logo--chevrolet" src="assets/brands/chevrolet.svg" width="88" height="58" alt="" loading="lazy" decoding="async"><span>Chevrolet / Corvette</span></a></dt><dd>General Motors</dd></div>
    <div><dt><a href="https://www.bmw.ie/en/footer/footer-section/legal-notice.html"><img class="brand-rights-logo" src="assets/brands/bmw.svg" width="58" height="58" alt="" loading="lazy" decoding="async"><span>BMW</span></a></dt><dd>BMW AG và các đơn vị liên quan</dd></div>
    <div><dt><a href="https://newsroom.porsche.com/en_US/legal-notice.html"><img class="brand-rights-logo" src="assets/brands/porsche.svg" width="58" height="58" alt="" loading="lazy" decoding="async"><span>Porsche</span></a></dt><dd>Dr. Ing. h.c. F. Porsche AG</dd></div>
    <div><dt><a href="https://group.mercedes-benz.com/provider/"><img class="brand-rights-logo" src="assets/brands/mercedes.svg" width="58" height="58" alt="" loading="lazy" decoding="async"><span>Mercedes-Benz / AMG</span></a></dt><dd>Mercedes-Benz Group AG</dd></div>
    <div><dt><a href="https://www.lamborghini.com/en-en/privacy-legal"><img class="brand-rights-logo" src="assets/brands/lamborghini-shield.png" width="58" height="58" alt="" loading="lazy" decoding="async"><span>Lamborghini</span></a></dt><dd>Automobili Lamborghini S.p.A.</dd></div>
  </dl>
  <p>ZEPHYRON là đồ án thiết kế độc lập, không phải website chính thức và không thể hiện quan hệ đại diện, tài trợ hoặc hợp tác với các hãng xe. <a href="sources.html">Xem nguồn hình ảnh, model 3D và giấy phép sử dụng.</a></p>
</section>`;
function navigation(){
  mountNavigation([
    ...cars.map(car=>[`product.html?car=${car.id}`,`${car.brand} ${car.name}`,'Mẫu xe',car.series]),
    ...articles.map(article=>[`article.html?id=${article.id}`,article.title,'Bài viết',`${article.category} ${article.intro}`])
  ]);
  const oldFooter=document.querySelector('.site-footer .footer-navigation');
  if(oldFooter&&!oldFooter.querySelector('[href="contact.html"]'))oldFooter.insertAdjacentHTML('beforeend','<a href="contact.html">Liên hệ / Showroom ↗</a><a href="policies.html">Bảo mật & điều kiện ↗</a><a href="sources.html">Nguồn hình & model ↗</a>');
  document.querySelectorAll('.site-footer,.ed-footer,.z-footer').forEach(element=>{
    const bottom=element.querySelector('.footer-bottom,.ed-footer-bottom,.z-footer-bottom');
    if(bottom&&!element.querySelector('.brand-rights'))bottom.insertAdjacentHTML('beforebegin',brandRightsHTML());
  });
  updateCount();
}
function updateCount(){document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=list('cart').length);}
addEventListener('zuzong-cart',updateCount);addEventListener('storage',updateCount);
// Displace the backdrop only; navigation text stays sharp above the glass.
if(!document.getElementById('zephyron-liquid-filter')){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.id='zephyron-liquid-filter';svg.setAttribute('aria-hidden','true');svg.setAttribute('width','0');svg.setAttribute('height','0');svg.style.position='absolute';svg.style.pointerEvents='none';
 svg.innerHTML='<defs><filter id="zephyron-liquid-refraction" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.045" numOctaves="1" seed="8" result="waves"/><feGaussianBlur in="waves" stdDeviation="2" result="smoothWaves"/><feDisplacementMap in="SourceGraphic" in2="smoothWaves" scale="18" xChannelSelector="R" yChannelSelector="G"/></filter></defs>';
 document.body.append(svg);
}
navigation();
