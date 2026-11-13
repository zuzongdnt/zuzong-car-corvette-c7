"""Extract every original MP4 frame into responsive scroll-sequence assets."""
from pathlib import Path
import hashlib
import json
import subprocess
import sys
import imageio_ffmpeg
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / 'output/Blender_Cloth_Reveal_2K/Zuzong_Corvette_Cloth_Reveal_2K.mp4'
OUTPUT = ROOT / 'assets/reveal-cloth-2k'
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
variants = [('', 1920, 1080, 86), ('mobile', 960, 540, 84),
            ('preview', 384, 216, 76), ('mobile/preview', 256, 144, 74)]

for folder, width, height, quality in variants:
    target = OUTPUT / folder
    target.mkdir(parents=True, exist_ok=True)
    subprocess.run([
        FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(SOURCE),
        '-map', '0:v:0', '-an', '-vf', f'scale={width}:{height}:flags=lanczos',
        '-fps_mode', 'passthrough', '-c:v', 'libwebp', '-quality', str(quality),
        '-compression_level', '4', '-start_number', '0', str(target / 'frame-%03d.webp'),
    ], check=True)
    frames = sorted(target.glob('frame-*.webp'))
    assert len(frames) == 160, (folder, len(frames))
    for index, frame in enumerate(frames):
        assert frame.name == f'frame-{index:03d}.webp'
        with Image.open(frame) as image:
            assert image.size == (width, height)
            image.verify()
    print(f'{folder or "desktop"}: {len(frames)} verified frames, {sum(f.stat().st_size for f in frames):,} bytes', flush=True)

manifest = {
    'source': SOURCE.name, 'sourceSha256': hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
    'sourceResolution': [2560, 1440], 'sourceFps': 24, 'frameCount': 160,
    'durationSeconds': 160 / 24, 'desktop': [1920, 1080], 'mobile': [960, 540],
    'preview': [384, 216], 'mobilePreview': [256, 144],
    'playback': 'All original frames, scroll-driven with adjacent-frame blending; no skipped or generated frames',
    'variants': {folder or 'desktop': {
        'frameCount': len(list((OUTPUT / folder).glob('frame-*.webp'))),
        'bytes': sum(f.stat().st_size for f in (OUTPUT / folder).glob('frame-*.webp'))
    } for folder, *_ in variants}
}
(OUTPUT / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print('All 640 responsive WebP assets verified.', flush=True)
