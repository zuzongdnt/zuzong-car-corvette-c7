"""Prepare the supplied campaign video; leave the original untouched."""
from pathlib import Path
import json
import subprocess
import sys
import cv2
import imageio_ffmpeg
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1])
dest = root / 'assets' / 'campaign'
dest.mkdir(parents=True, exist_ok=True)
capture = cv2.VideoCapture(str(source))
fps = capture.get(cv2.CAP_PROP_FPS)
duration = capture.get(cv2.CAP_PROP_FRAME_COUNT) / fps
width, height = (int(capture.get(p)) for p in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT))
sheet = Image.new('RGB', (1200, 720), '#101115')
draw = ImageDraw.Draw(sheet)
for i, fraction in enumerate((.04, .16, .28, .4, .52, .64, .76, .88)):
    second = duration * fraction
    capture.set(cv2.CAP_PROP_POS_MSEC, second * 1000)
    ok, frame = capture.read()
    if not ok:
        raise RuntimeError('Unable to decode source frame')
    image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    if i == 5:
        image.save(dest / 'intro-poster.webp', 'WEBP', quality=90)
    image.thumbnail((300, 330))
    x, y = i % 4 * 300, i // 4 * 360
    sheet.paste(image, (x + (300-image.width)//2, y))
    draw.text((x+12,y+338), f'{second:.2f}s', fill='white')
capture.release()
sheet.save(root / 'output/playwright/intro-video-source.jpg', quality=90)
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source), '-map', '0:v:0', '-an', '-c:v', 'libx264', '-crf', '21', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(dest / 'intro.mp4')], check=True)
info = {'source': str(source), 'width': width, 'height': height, 'duration': round(duration,3), 'fps': fps, 'output': 'intro.mp4', 'poster': 'intro-poster.webp', 'audio': 'Muted background export; source audio preserved in original file'}
(dest / 'manifest.json').write_text(json.dumps(info, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(info,ensure_ascii=True))
