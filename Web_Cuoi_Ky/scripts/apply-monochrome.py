"""Wire the shared monochrome design system into every current page."""
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
def neutral(match):
    raw=match.group(1)
    if len(raw) not in (3,4,6,8): return match.group(0)
    if len(raw)<=4: raw=''.join(c*2 for c in raw)
    r,g,b=(int(raw[i:i+2],16) for i in (0,2,4))
    gray=round(.2126*r+.7152*g+.0722*b)
    return '#'+f'{gray:02x}'*3+raw[6:]
def rgb_neutral(match):
    name,values=match.group(1),match.group(2).split(',')
    if len(values)<3:return match.group(0)
    try: gray=round(sum(float(v.strip())*w for v,w in zip(values[:3],[.2126,.7152,.0722])))
    except ValueError:return match.group(0)
    return name+'('+','.join([str(gray)]*3+values[3:])+')'
for path in ROOT.glob('*.css'):
    if path.name=='monochrome.css': continue
    text=path.read_text(encoding='utf-8')
    text=re.sub(r'#([0-9a-fA-F]{3,8})\b',neutral,text)
    text=re.sub(r'\b(rgba?)\(([^)]+)\)',rgb_neutral,text)
    path.write_text(text,encoding='utf-8')
for path in [*ROOT.glob('*.html'),ROOT/'site.js']:
    text=path.read_text(encoding='utf-8').replace('assets/zephyron-logo-red.svg','assets/brand-monochrome/zephyron-black.svg')
    text=text.replace('assets/zephyron-icon.svg','assets/brand-monochrome/zephyron-symbol.svg')
    if '</head>' in text and 'href="monochrome.css"' not in text:
        text=text.replace('</head>','<link rel="stylesheet" href="monochrome.css">\n</head>')
    path.write_text(text,encoding='utf-8')
site=ROOT/'site.js'
text=site.read_text(encoding='utf-8').replace('Đen, đỏ và những đường nét rõ ràng tạo nên tinh thần ZEPHYRON.','Trắng, đen và những đường nét rõ ràng tạo nên tinh thần ZEPHYRON.').replace('thế giới Zuzong.','thế giới ZEPHYRON.')
site.write_text(text,encoding='utf-8')
sections=ROOT/'sections.html'
text=sections.read_text(encoding='utf-8')
text=text.replace('CORVETTE C7 STINGRAY</span>','ZEPHYRON / AUTOMOTIVE STUDIO</span>')
text=re.sub(r'<div class="footer-collection">.*?</div>','<div class="footer-collection"><span class="footer-label">BỘ SƯU TẬP</span><p>Năm mẫu xe.<br>Mười lăm góc nhìn.</p><a class="footer-gallery-button" href="gallery.html">Xem trọn bộ ảnh <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.3"/></svg></a></div>',text,flags=re.S)
sections.write_text(text,encoding='utf-8')
print('Applied neutral base colors and shared theme to source pages.')
