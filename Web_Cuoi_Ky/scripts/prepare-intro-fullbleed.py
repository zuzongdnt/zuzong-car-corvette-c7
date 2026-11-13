"""Remove the source video's baked-in 84px letterbox bars for the transparent header."""
from pathlib import Path
import subprocess, cv2, imageio_ffmpeg
root=Path(__file__).resolve().parents[1]
source=root/'assets/campaign/intro.mp4'
output=root/'assets/campaign/intro-fullbleed.mp4'
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-i',str(source),'-vf','crop=1280:552:0:84','-an','-c:v','libx264','-crf','20','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',str(output)],check=True)
video=cv2.VideoCapture(str(output));video.set(cv2.CAP_PROP_POS_MSEC,28780)
ok,frame=video.read()
if not ok: raise RuntimeError('Poster frame could not be decoded')
cv2.imwrite(str(root/'assets/campaign/intro-fullbleed-poster.webp'),frame,[cv2.IMWRITE_WEBP_QUALITY,92]);video.release()
print('Full-bleed video and poster ready; original files preserved.')
