"""Keep the original 16:9 Blender composition for a full-viewport reveal."""
from pathlib import Path
import json
import subprocess
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parents[1]
SOURCE=Path('E:/bmw/ZUZONG_Earth_5Cars_Intro/Garage_V6/FullHD_1080p/work/clip_intro.mp4')
OUT=ROOT/'assets/unveil-five-full'
OUT.mkdir(parents=True,exist_ok=True)
for folder,width,height,quality in [('',1920,1080,86),('mobile',960,540,82),('preview',384,216,74),('mobile/preview',288,162,72)]:
    dest=OUT/folder
    dest.mkdir(parents=True,exist_ok=True)
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y',
        '-i',str(SOURCE),'-t','6','-an','-vf',f'scale={width}:{height}:flags=lanczos',
        '-c:v','libwebp','-quality',str(quality),'-start_number','0',str(dest/'frame-%03d.webp')],check=True)
    assert len(list(dest.glob('frame-*.webp')))==144
    print(folder or 'desktop',flush=True)
(OUT/'manifest.json').write_text(json.dumps({'source':str(SOURCE),'fps':24,'frameCount':144,
    'durationSeconds':6,'desktop':[1920,1080],'mobile':[960,540],
    'composition':'Original full 16:9 frame, no crop. Portrait uses a blurred ambient fill behind the complete foreground frame.'},indent=2),encoding='utf-8')
