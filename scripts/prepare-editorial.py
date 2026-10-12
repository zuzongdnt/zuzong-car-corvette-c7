"""Prepare the user-supplied editorial media without modifying originals."""
from pathlib import Path
import json
import subprocess

import cv2
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "assets" / "editorial"
QA = ROOT / "output" / "playwright"
DEST.mkdir(parents=True, exist_ok=True)
QA.mkdir(parents=True, exist_ok=True)
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

PHOTOS = {
    "road": Path(r"E:\c7\ca08fdaf59c8794765ca0d7b72626678.jpg"),
    "dusk": Path(r"E:\c7\5376b537c8de41906543db4aff165c45.jpg"),
    "hangar": Path(r"E:\c7\263fc06811833bd27a3847a4f3abe3ac.jpg"),
}
FILMS = {
    "film-road": Path(r"D:\tải xuống\snaptik.vn_7648734332181400862.mp4"),
    "film-night": Path(r"D:\tải xuống\snaptik.vn_7634777261874498830.mp4"),
}
POSTER_SECONDS = {"film-road": 1.81, "film-night": 1.43}
DESCRIPTIONS = {
    "film-road": "Nighttime gas-station edit with a gray Corvette C7 and a blue Corvette C8; exterior and badge details.",
    "film-night": "Gray Corvette C7 parked at dusk/night; front, side, interior, and rear views.",
}

manifest = {"photos": [], "films": []}
for name, source in PHOTOS.items():
    with Image.open(source) as raw:
        photo = ImageOps.exif_transpose(raw).convert("RGB")
        photo.thumbnail((1440, 1800), Image.Resampling.LANCZOS)
        target = DEST / f"{name}.webp"
        photo.save(target, "WEBP", quality=88, method=6)
        manifest["photos"].append({"source": str(source), "file": target.name,
            "width": photo.width, "height": photo.height, "bytes": target.stat().st_size})

for name, source in FILMS.items():
    capture = cv2.VideoCapture(str(source))
    fps = capture.get(cv2.CAP_PROP_FPS)
    frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = frames / fps
    width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    # A contact sheet records the source content before using it in the layout.
    sheet = Image.new("RGB", (960, 642), "#131518")
    draw = ImageDraw.Draw(sheet)
    for index, fraction in enumerate((.03, .16, .29, .42, .55, .68, .81, .94, .98)):
        second = duration * fraction
        capture.set(cv2.CAP_PROP_POS_MSEC, second * 1000)
        okay, frame = capture.read()
        if not okay:
            continue
        image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        image.thumbnail((320, 180), Image.Resampling.LANCZOS)
        x, y = index % 3 * 320, index // 3 * 214
        sheet.paste(image, (x, y))
        draw.text((x + 10, y + 188), f"{name} / {second:.2f}s", fill="white")
    sheet.save(QA / f"media-{name}-contact.jpg", quality=92)

    # Explicit, stable poster timestamps; keeps source composition and colors.
    poster_second = POSTER_SECONDS[name]
    capture.set(cv2.CAP_PROP_POS_MSEC, poster_second * 1000)
    okay, frame = capture.read()
    if not okay:
        raise RuntimeError(f"Cannot read poster: {source}")
    poster = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    poster.save(DEST / f"{name}-poster.webp", "WEBP", quality=86, method=6)
    capture.release()

    target = DEST / f"{name}.mp4"
    subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
        "-map", "0:v:0", "-map", "0:a:0", "-vf", "scale='min(720,iw)':-2", "-c:v", "libx264",
        "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p", "-c:a", "aac",
        "-b:a", "96k", "-ac", "2", "-ar", "44100", "-movflags", "+faststart",
        str(target)], check=True)
    output_capture = cv2.VideoCapture(str(target))
    output_width = int(output_capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    output_height = int(output_capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    output_capture.release()
    manifest["films"].append({"source": str(source), "file": target.name,
        "sourceWidth": width, "sourceHeight": height, "width": output_width, "height": output_height,
        "fps": fps, "duration": round(duration, 3), "bytes": target.stat().st_size,
        "audio": {"codec": "aac", "profile": "LC", "sampleRate": 44100,
            "channels": 2, "channelLayout": "stereo", "targetBitrate": 96000},
        "poster": f"{name}-poster.webp", "posterSecond": poster_second,
        "description": DESCRIPTIONS[name]})

(DEST / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(manifest, ensure_ascii=True, indent=2))
