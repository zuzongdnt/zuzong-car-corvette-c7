"""Preserve the original logo outlines and prepare a web-sourced journey photo."""
from pathlib import Path
from copy import deepcopy
import json
import re
import xml.etree.ElementTree as ET
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/brand-monochrome'
NS='http://www.w3.org/2000/svg'
ET.register_namespace('',NS)
original=ET.fromstring((ROOT/'assets/zephyron-logo-red.svg').read_text(encoding='utf-8'))
paths=[e for e in original if e.tag.endswith('path')]
for variant,color in [('black','#111111'),('white','#ffffff')]:
    svg=ET.Element('{'+NS+'}svg',{'width':'690','height':'100','viewBox':'0 0 690 100','role':'img','aria-label':'ZEPHYRON'})
    ET.SubElement(svg,'{'+NS+'}title').text='ZEPHYRON - original symbol and wordmark, horizontal layout'
    emblem=ET.SubElement(svg,'{'+NS+'}g',{'transform':'translate(10 16) scale(.12) translate(-288 -25.011)'})
    wordmark=ET.SubElement(svg,'{'+NS+'}g',{'transform':'translate(225 30.9) scale(.32) translate(-379 -628.3)'})
    for source in paths:
        path=deepcopy(source);path.set('fill',color)
        (emblem if source.get('id')=='Emblem' else wordmark).append(path)
    assert [(p.get('id'),p.get('d')) for p in svg.iter() if p.tag.endswith('path')]==[(p.get('id'),p.get('d')) for p in paths]
    ET.ElementTree(svg).write(OUT/f'zephyron-horizontal-{variant}.svg',encoding='utf-8',xml_declaration=True)

source=ROOT/'output/image-references/browser-comments/porsche-road-mobile.jpg'
image=Image.open(source).convert('RGB')
image.save(ROOT/'assets/editorial/journey-porsche-road.webp','WEBP',quality=89,method=6)
small=image.copy();small.thumbnail((720,1280));small.save(ROOT/'assets/editorial/journey-porsche-road-small.webp','WEBP',quality=84,method=6)
manifest={
 'asset':'assets/editorial/journey-porsche-road.webp',
 'sourcePage':'https://www.porsche.com/stories/design/download-porsche-911-wallpapers/',
 'sourceImage':'https://images.ctfassets.net/s699s7kh1jys/23LZ2H1VwBIvRooZ9rU4Wt/ec213225df7ba9bae0de7042311b78b8/porsche_911_wallpapers_carrera_2_mobile.jpg',
 'credit':'Porsche / official 911 Carrera wallpaper',
 'sourceDimensions':list(image.size),'changes':'WebP encoding and responsive size only; original colors and composition retained.',
 'use':'Local student design project; wallpaper source provides personal-use downloads.',
 'retrieved':'2026-11-02'
}
(ROOT/'assets/editorial/journey-porsche-source.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
for page in ROOT.glob('*.html'):
    if page.name=='index.html':continue
    html=page.read_text(encoding='utf-8')
    html=re.sub(r'(<header\b[^>]*>)(.*?)(</header>)',lambda m:m[1]+m[2].replace('assets/brand-monochrome/zephyron-black.svg','assets/brand-monochrome/zephyron-horizontal-black.svg')+m[3],html,flags=re.S)
    page.write_text(html,encoding='utf-8')
site=ROOT/'site.js'
text=re.sub(r'(<a class="z-brand"[^>]*><img src=")assets/brand-monochrome/zephyron-black.svg',r'\1assets/brand-monochrome/zephyron-horizontal-black.svg',site.read_text(encoding='utf-8'),count=1)
site.write_text(text,encoding='utf-8')
section=ROOT/'sections.html'
text=section.read_text(encoding='utf-8')
text=re.sub(r'(<div class="world-feature-image">).*?(</div>)',r'\1<img src="assets/editorial/journey-porsche-road.webp" srcset="assets/editorial/journey-porsche-road-small.webp 720w, assets/editorial/journey-porsche-road.webp 1080w" sizes="(max-width: 760px) calc(100vw - 44px), 50vw" width="1080" height="1920" alt="Porsche 911 Carrera màu vàng nhạt trên con đường nắng, với hàng cây và núi phía xa" loading="lazy" decoding="async">\2',text,count=1,flags=re.S)
section.write_text(text,encoding='utf-8')
print('PASS original vector paths preserved in horizontal logos; Porsche photo converted to responsive WebP.')
