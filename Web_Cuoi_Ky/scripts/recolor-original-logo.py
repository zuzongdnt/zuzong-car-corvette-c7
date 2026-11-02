"""Recolor Zuzong's original logo without changing any vector geometry."""
from pathlib import Path
import re
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/brand-monochrome'
OUT.mkdir(parents=True,exist_ok=True)
original=(ROOT/'assets/zephyron-logo-red.svg').read_text(encoding='utf-8')
def geometry(svg):
    root=ET.fromstring(svg)
    return root.attrib.get('viewBox'),[(e.tag,e.attrib.get('d'),e.attrib.get('transform')) for e in root.iter()]
for name,color in [('black','#111111'),('white','#ffffff')]:
    result=re.sub(r'#[0-9a-fA-F]{3,8}\b',color,original)
    assert geometry(result)==geometry(original)
    (OUT/f'zephyron-{name}.svg').write_text(result,encoding='utf-8')
icon=(ROOT/'assets/zephyron-icon.svg').read_text(encoding='utf-8')
recolored=re.sub(r'#[0-9a-fA-F]{3,8}\b','#111111',icon)
assert geometry(icon)==geometry(recolored)
(OUT/'zephyron-symbol.svg').write_text(recolored,encoding='utf-8')
print('PASS: original logo paths, transforms and viewBox unchanged; only colors replaced.')
