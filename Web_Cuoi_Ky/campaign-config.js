// All content for the reusable video intro. Relative paths work in the project and dist/.
const campaignConfig = {
  videoSrc: 'assets/campaign/intro-5-cars-blender-1080p.mp4',
  posterSrc: 'assets/campaign/intro-5-cars-poster.webp',
  logoSrc: 'assets/brand-monochrome/zephyron-white.svg',
  logoAlt: 'ZEPHYRON',
  brandName: 'ZEPHYRON',
  intro: 'Chevrolet. BMW. Porsche.\nMercedes-Benz. Lamborghini.',
  badge: 'ZEPHYRON / AUTOMOTIVE STUDIO',
  title: 'Chuyển động.\nTheo cách riêng.',
  subtitle: 'Năm biểu tượng. Một góc nhìn của bạn.',
  description: 'Khám phá đường nét. Chọn màu sơn. Tạo nên một cấu hình mang dấu ấn của bạn trong không gian 3D.',
  ctaText: 'Vào studio 3D',
  ctaHref: '#collection',
  stats: [], // Only supplied facts: [{ value: '...', label: '...' }, ...], maximum two.
  accentColor: '#ffffff',
  videoPosition: '50% 50%', // Or { desktop: '50% 50%', mobile: '55% 50%' }.
  message: 'Năm cá tính. Một dấu ấn riêng.'
};
if (typeof module !== 'undefined' && module.exports) module.exports = campaignConfig;
else window.CAMPAIGN_CONFIG = campaignConfig;
