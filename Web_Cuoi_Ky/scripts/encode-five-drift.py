import subprocess, json, hashlib
from pathlib import Path
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/Drift_5_Xe_20261105'
KEYS=['corvette','bmw','porsche','mercedes','lamborghini','group']
NAMES=['CORVETTE C7','BMW M4 G82','PORSCHE 911 GT3','MERCEDES SL63 AMG','LAMBORGHINI REVUELTO','FIVE ICONS. ONE COLLECTION.']
ff=imageio_ffmpeg.get_ffmpeg_exe()
font=ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',34)
small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16)
reports=[]
for index,(key,name) in enumerate(zip(KEYS,NAMES)):
    folder=OUT/'frames_refined'/key;expected=48 if key=='group' else 60
    files=sorted(folder.glob('frame_*.png'))
    assert len(files)==expected,(key,len(files),expected)
    assert all((folder/f'frame_{f:04d}.png').exists() for f in range(1,expected+1))
    overlay=Image.new('RGBA',(1280,720),(0,0,0,0));draw=ImageDraw.Draw(overlay)
    for y in range(520,720):draw.line((0,y,1280,y),fill=(0,0,0,int((y-520)/200*110)))
    draw.text((42,37),'ZEPHYRON',font=small,fill='#ffffff',stroke_width=1,stroke_fill='#444444')
    draw.text((1238,37),f'DRIFT STUDY / {index+1:02d}',font=small,fill='#ffffff',anchor='ra',stroke_width=1,stroke_fill='#444444')
    draw.text((42,640),name,font=font,fill='#ffffff')
    overlay_path=OUT/f'{key}-video-label.png';overlay.save(overlay_path)
    target=OUT/f'{key}_drift_720p.mp4'
    subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-framerate','24','-i',str(folder/'frame_%04d.png'),'-i',str(overlay_path),'-filter_complex','[0:v][1:v]overlay=0:0','-frames:v',str(expected),'-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-r','24','-movflags','+faststart',str(target)],check=True)
    reader=imageio_ffmpeg.read_frames(str(target));meta=next(reader);count=sum(1 for _ in reader)
    assert meta['size']==(1280,720) and count==expected and meta['fps']==24,(key,meta,count)
    reports.append(dict(car=key,file=target.name,resolution=meta['size'],fps=meta['fps'],frames=count,seconds=count/24,bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
    print('ENCODED_AND_DECODED',key,count,flush=True)
concat=OUT/'video-concat.txt';concat.write_text('\n'.join("file '"+r['file']+"'" for r in reports),encoding='utf8')
target=OUT/'ZEPHYRON_5_Cars_Drift_Preview_720p.mp4'
subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(concat),'-c','copy','-movflags','+faststart',str(target)],check=True)
reader=imageio_ffmpeg.read_frames(str(target));meta=next(reader);count=sum(1 for _ in reader)
assert count==348 and meta['fps']==24 and meta['size']==(1280,720),(meta,count)
reports.append(dict(file=target.name,resolution=meta['size'],fps=meta['fps'],frames=count,seconds=count/24,bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest()))
(OUT/'video-qa.json').write_text(json.dumps(reports,indent=2),encoding='utf8')
print('ALL_VIDEO_QA_PASSED',flush=True)
