// All content for the reusable video intro. Relative paths work in the project and dist/.
const campaignConfig = {
  videoSrc: 'assets/campaign/intro-fullbleed.mp4',
  posterSrc: 'assets/campaign/intro-fullbleed-poster.webp',
  logoSrc: 'assets/c7-logo.webp',
  logoAlt: 'Logo Corvette',
  brandName: 'CORVETTE',
  intro: 'Dáng xe thấp. Đường nét sắc sảo. Một cá tính không hòa lẫn.',
  badge: 'THE ZUZONG COLLECTION',
  title: 'C7.',
  subtitle: 'Một biểu tượng Mỹ.',
  description: 'Từ những thước phim đầy cảm xúc đến khoảnh khắc mở bạt. Khám phá cá tính Corvette qua từng chi tiết.',
  ctaText: 'Khám phá C7',
  ctaHref: '#unveil', // Leave empty to show an explicit missing-link note.
  stats: [], // Only supplied facts: [{ value: '...', label: '...' }, ...], maximum two.
  accentColor: '#f03a3e',
  videoPosition: '50% 50%', // Or { desktop: '50% 50%', mobile: '55% 50%' }.
  message: 'Một cá tính. Mọi góc nhìn.'
};
if (typeof module !== 'undefined' && module.exports) module.exports = campaignConfig;
else window.CAMPAIGN_CONFIG = campaignConfig;
