"""Reuse the existing native Blender renders for the collection reveal."""
from pathlib import Path
import json
import subprocess
import cv2
import imageio_ffmpeg
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('E:/bmw/ZUZONG_Earth_5Cars_Intro/Garage_V6/FullHD_1080p/work')
OUT = ROOT / 'assets/unveil-five'
OUT.mkdir(parents=True, exist_ok=True)
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

def run(*args):
    subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', *args], check=True)

for folder, width, height, quality in [('',1920,800,86),('mobile',960,400,82),('preview',384,160,74),('mobile/preview',288,120,72)]:
    dest = OUT / folder
    dest.mkdir(parents=True, exist_ok=True)
    run('-i', str(SOURCE/'clip_intro.mp4'), '-t', '6', '-an', '-vf',
        f'crop=1920:800:0:180,scale={width}:{height}:flags=lanczos',
        '-c:v', 'libwebp', '-quality', str(quality), '-start_number', '0', str(dest/'frame-%03d.webp'))
    frames = sorted(dest.glob('frame-*.webp'))
    assert len(frames) == 144, (folder,len(frames))
    with Image.open(frames[-1]) as image:
        assert image.size == (width,height)
    print(folder or 'desktop', len(frames), flush=True)

run('-i', str(SOURCE/'clip_intro.mp4'), '-t', '6', '-an', '-vf', 'crop=1920:800:0:180',
    '-c:v','libx264','-crf','22','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'collection.mp4'))
for car in ['corvette','bmw','porsche','mercedes','lamborghini']:
    run('-i',str(SOURCE/f'clip_{car}.mp4'),'-an','-c:v','libx264','-crf','22','-preset','medium',
        '-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/f'{car}.mp4'))
    capture = cv2.VideoCapture(str(SOURCE/f'clip_{car}.mp4'))
    for filename,second in [(car+'-poster.webp',0),(car+'-still.webp',1.5)]:
        capture.set(cv2.CAP_PROP_POS_MSEC,second*1000)
        ok,frame=capture.read()
        assert ok
        Image.fromarray(cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)).save(OUT/filename,quality=88)
    capture.release()
    print(car, (OUT/f'{car}.mp4').stat().st_size, flush=True)

(OUT/'manifest.json').write_text(json.dumps({
    'source':str(SOURCE),'renderer':'Blender Cycles','fps':24,'frameCount':144,'durationSeconds':6,
    'desktop':[1920,800],'mobile':[960,400],'crop':[0,180,1920,800],
    'collection':'Original five-car cloth reveal, first six seconds before the camera zoom.',
    'individual':'Five eight-second detail films from the existing native renders; no cloth in these shots.',
    'audio':False
},ensure_ascii=False,indent=2),encoding='utf-8')
