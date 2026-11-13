import subprocess,json,hashlib
from pathlib import Path
import imageio_ffmpeg

OUT=Path(__file__).resolve().parents[1]/'output/Track_5_Cars_3D_20261105'
folder=OUT/'frames';expected=96
assert len(list(folder.glob('frame_*.png')))==expected
assert all((folder/f'frame_{f:04d}.png').exists() for f in range(1,expected+1))
ff=imageio_ffmpeg.get_ffmpeg_exe();target=OUT/'ZEPHYRON_5_Cars_Track_3D_720p.mp4'
subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-framerate','24','-i',str(folder/'frame_%04d.png'),'-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-r','24','-movflags','+faststart',str(target)],check=True)
reader=imageio_ffmpeg.read_frames(str(target));meta=next(reader);count=sum(1 for _ in reader)
assert count==96 and meta['fps']==24 and meta['size']==(1280,720),(meta,count)
subprocess.run([ff,'-hide_banner','-v','error','-i',str(target),'-f','null','-'],check=True)
report=dict(file=target.name,frames=count,fps=meta['fps'],resolution=meta['size'],seconds=count/24,codec=meta['codec'],bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest(),decoded_cleanly=True)
(OUT/'video-qa.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps(report),flush=True)
