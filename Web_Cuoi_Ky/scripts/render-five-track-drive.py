import bpy,time,json,sys
from pathlib import Path

OUT=Path(__file__).resolve().parents[1]/'output/Track_5_Cars_3D_20261105'
bpy.ops.wm.open_mainfile(filepath=str(OUT/'ZEPHYRON_5_Cars_Track_3D.blend'),load_ui=False,use_scripts=False)
s=bpy.context.scene
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='OPTIX';prefs.get_devices()
for device in prefs.devices:device.use=device.type=='OPTIX'
s.cycles.device='GPU';s.cycles.samples=24;s.cycles.adaptive_threshold=.065
s.render.resolution_x=1280;s.render.resolution_y=720
folder=OUT/'frames';folder.mkdir(exist_ok=True)
start=time.time()
for f in range(1,s.frame_end+1):
    target=folder/f'frame_{f:04d}.png'
    if not target.exists():
        s.frame_set(f);s.render.filepath=str(target);bpy.ops.render.render(write_still=True)
    (OUT/'render-progress.json').write_text(json.dumps(dict(frame=f,total=s.frame_end,frames_written=len(list(folder.glob('frame_*.png'))),elapsed_seconds=round(time.time()-start,2))),encoding='utf8')
    print('FRAME',f,'SECONDS',round(time.time()-start,2),flush=True)
print('FORMATION_RENDER_COMPLETE',flush=True)
