"""Extract the 2K studio reveal into desktop, mobile and quick-loading WebP frames."""
from pathlib import Path
import argparse
import json
import subprocess

import imageio_ffmpeg
from PIL import Image

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('video', type=Path)
source = parser.parse_args().video.resolve(strict=True)
out = Path(__file__).resolve().parents[1] / 'assets/unveil-five-v3'
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
count = 144

for folder, width, height, quality in [
    ('', 1920, 800, 85),
    ('mobile', 960, 400, 82),
    ('preview', 384, 160, 74),
    ('mobile/preview', 288, 120, 72),
]:
    target = out / folder
    target.mkdir(parents=True, exist_ok=True)
    subprocess.run([
        ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
        '-map', '0:v:0', '-an', '-vf', f'fps=24,scale={width}:{height}:flags=lanczos',
        '-c:v', 'libwebp', '-quality', str(quality), '-start_number', '0',
        str(target / 'frame-%03d.webp'),
    ], check=True)
    frames = sorted(target.glob('frame-*.webp'))
    assert [frame.name for frame in frames] == [f'frame-{i:03}.webp' for i in range(count)]
    for frame in frames:
        with Image.open(frame) as image:
            assert image.size == (width, height), frame
            image.load()
    print(folder or 'desktop', len(frames), flush=True)

(out / 'manifest.json').write_text(json.dumps({
    'source': source.name, 'fps': 24, 'frameCount': count, 'durationSeconds': 6,
    'desktop': [1920, 800], 'mobile': [960, 400], 'cuts': [39, 105],
}, indent=2) + '\n', encoding='utf-8')
