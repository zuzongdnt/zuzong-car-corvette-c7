"""Keep every approved 1080p render frame, with bounded browser decoding tiers."""
from pathlib import Path
from PIL import Image
from concurrent.futures import ThreadPoolExecutor
import json

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT.parent/'output/Blender_5_Xe_Theo_Mau_V2_20261105/Final_1080p'
OUT=ROOT/'assets/studio-scroll-v2'
KEYS=['corvette','bmw','porsche','mercedes','lamborghini']
for folder in [OUT,OUT/'mobile',OUT/'preview']:folder.mkdir(parents=True,exist_ok=True)
entries=[(i*64+j,SOURCE/'frames'/key/f'{j+1:04d}.png') for i,key in enumerate(KEYS) for j in range(64)]
assert len(entries)==320 and all(p.exists() for _,p in entries)
def convert(entry):
    index,path=entry
    with Image.open(path) as im:
        assert im.size==(1920,1080)
        for folder,size,quality in [('',(1440,810),86),('mobile',(854,480),82),('preview',(256,144),65)]:
            target=OUT/folder/f'frame-{index:03d}.webp'
            if not target.exists():im.resize(size,Image.Resampling.LANCZOS).save(target,'WEBP',quality=quality,method=4)
    return index
with ThreadPoolExecutor(max_workers=4) as pool:
    converted=list(pool.map(convert,entries))
assert len(set(converted))==320
manifest=dict(frameCount=320,fps=30,framesPerCar=64,cars=KEYS,desktop=[1440,810],mobile=[854,480],preview=[256,144],source=str(SOURCE),sourceVideo='ZEPHYRON_5_Xe_Studio_V2_1080p_KhongChu_KhongNhac.mp4',allSourceFramesPreserved=True)
(OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
print(json.dumps(dict(frames=320,files=960,megabytes=round(sum(p.stat().st_size for p in OUT.rglob('*.webp'))/1024**2,2))))
