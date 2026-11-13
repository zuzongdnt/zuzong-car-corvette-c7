from pathlib import Path
import shutil, json

root=Path(__file__).resolve().parents[1]
backup=root/'output/backup-before-studio-20261102'
backup.mkdir(parents=True,exist_ok=True)
for name in ['index.html','sections.html','gallery.html','scripts/assemble.cjs','scripts/build.cjs','bottom-nav.js','package.json']:
    src=root/name
    dst=backup/name
    dst.parent.mkdir(parents=True,exist_ok=True)
    if not dst.exists(): shutil.copy2(src,dst)

sections=(root/'sections.html').read_text(encoding='utf-8')
start=sections.index('<section id="collection"')
end=sections.index('<section class="worlds"',start)
studio='''<section id="collection" class="collection" aria-labelledby="collection-title">
  <div class="collection-heading reveal"><div><p class="eyebrow">Every angle. Your attitude.</p><h2 id="collection-title" class="section-title">KHÔNG CÓ <em>GÓC NHÌN THƯỜNG.</em></h2></div><a class="button" href="gallery.html">Xem bộ ảnh <span aria-hidden="true">↗</span></a></div>
  <div data-studio-mount></div>
  <p class="car-attribution">Model 3D tương tác của 5 hãng xe. Giá giả lập cho đồ án. <a href="sources.html">Nguồn hình &amp; model</a> · <a href="products.html">Mở studio riêng</a></p>
  <nav class="z-home-intro" aria-label="Khám phá Zuzong"><a href="about.html">Thương hiệu Zuzong ↗</a><a href="news.html">Tin tức / Bài viết ↗</a><a href="contact.html">Liên hệ / Showroom ↗</a><a href="account.html">Cấu hình đã lưu ↗</a></nav>
</section>

'''
(root/'sections.html').write_text(sections[:start]+studio+sections[end:],encoding='utf-8')
assemble=(root/'scripts/assemble.cjs').read_text(encoding='utf-8')
assemble=assemble.replace('Zuzong Car — Khám phá Corvette C7, biểu tượng Mỹ trong một trải nghiệm chuyển động đầy cá tính.','Zuzong Car — Studio 3D tương tác 5 hãng xe. Đổi màu sơn, heo phanh và mâm, lưu cấu hình và đặt trước.').replace('<title>ZUZONG CAR — Corvette C7</title>','<title>ZUZONG CAR — Studio 5 hãng xe</title>')
if 'href="studio.css"' not in assemble:
    assemble=assemble.replace('<link rel="stylesheet" href="car-viewer.css"><script type="module" src="car-viewer.js"></script>','<link rel="stylesheet" href="car-viewer.css"><link rel="stylesheet" href="studio.css"><link rel="stylesheet" href="site.css"><script type="module" src="studio.js"></script><script type="module" src="site.js"></script>')
(root/'scripts/assemble.cjs').write_text(assemble,encoding='utf-8')

pages={'products':'Studio 3D','product':'Chi tiết xe','about':'Giới thiệu','contact':'Liên hệ / Showroom','explore':'Khám phá','gallery':'Bộ sưu tập','news':'Tin tức / Bài viết','article':'Bài viết','cart':'Giỏ đặt trước','account':'Tài khoản','sources':'Nguồn hình & model','policies':'Bảo mật & điều kiện'}
for page,title in pages.items():
    html=f'''<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#090a0c"><meta name="description" content="ZUZONG CAR — {title}. Studio tương tác 5 hãng xe."><title>{title} — ZUZONG CAR</title><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/fonts/fonts.css"><link rel="stylesheet" href="studio.css"><link rel="stylesheet" href="site.css"><script type="module" src="site.js"></script></head><body class="z-page"><a class="skip-link sr-only" href="#main-content">Đến nội dung chính</a><div data-site-header></div><main class="z-container" id="main-content" data-page="{page}"></main><div data-site-footer></div><noscript><p>Vui lòng bật JavaScript để sử dụng studio và các chức năng của đồ án.</p></noscript></body></html>
'''
    (root/f'{page}.html').write_text(html,encoding='utf-8')

for page in ['experience.html','films.html']:
    text=(root/page).read_text(encoding='utf-8')
    if 'src="site.js"' not in text:
        text=text.replace('</head>','<link rel="stylesheet" href="site.css"><script type="module" src="site.js"></script></head>')
        (root/page).write_text(text,encoding='utf-8')

bottom=(root/'bottom-nav.js').read_text(encoding='utf-8')
bottom=bottom.replace("href: 'experience.html', label: 'Hành trình'","href: 'products.html', label: 'Studio 3D'")
bottom=bottom.replace("href: 'films.html', label: 'Thước phim'","href: 'explore.html', label: 'Khám phá'")
(root/'bottom-nav.js').write_text(bottom,encoding='utf-8')
sources=Path('E:/tkdhfigma/outputs/Studio360_Gray_TCHQ_20261102/NGUON_TAI_NGUYEN.md')
shutil.copy2(sources,root/'docs/STUDIO_MODEL_SOURCES.md')
shutil.copy2(Path('C:/Users/zuzong/AppData/Local/Temp/ZUZONG_Sitemap_Hoan_Chinh.png'),root/'docs/ZUZONG_Sitemap_Hoan_Chinh.png')

build=(root/'scripts/build.cjs').read_text(encoding='utf-8')
if 'Studio sitemap assets OK' not in build:
    build+='''
for(const file of ['studio.css','studio.js','studio-data.js','site.css','site.js','products.html','product.html','about.html','contact.html','explore.html','gallery.html','news.html','article.html','cart.html','account.html','sources.html','policies.html'])fs.copyFileSync(path.join(root,file),path.join(out,file));
fs.cpSync(path.join(root,'assets','model','studio'),path.join(out,'assets','model','studio'),{recursive:true});
fs.cpSync(path.join(root,'assets','studio'),path.join(out,'assets','studio'),{recursive:true});
fs.copyFileSync(path.join(root,'docs','STUDIO_MODEL_SOURCES.md'),path.join(out,'docs','STUDIO_MODEL_SOURCES.md'));
console.log('Studio sitemap assets OK');
'''
    (root/'scripts/build.cjs').write_text(build,encoding='utf-8')
print('Integrated studio +',len(pages),'sitemap pages. Original files backed up:',backup)
