import bpy, sys, json, time
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/Drift_5_Xe_20261105'
args=sys.argv[sys.argv.index('--')+1:]
key=args[0]
bpy.ops.wm.open_mainfile(filepath=str(OUT/f'{key}_Drift_Test.blend'),load_ui=False,use_scripts=False)
s=bpy.context.scene
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='OPTIX';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='OPTIX'
s.cycles.device='GPU'
frames=OUT/'frames_refined'/key;frames.mkdir(parents=True,exist_ok=True)
start=time.time()
sequence=[1,20,40,60] if '--keyframes' in args else range(s.frame_start,s.frame_end+1)
for f in sequence:
    target=frames/f'frame_{f:04d}.png'
    if not target.exists():
        s.frame_set(f);s.render.filepath=str(target);bpy.ops.render.render(write_still=True)
    (OUT/f'{key}-render-progress.json').write_text(json.dumps(dict(car=key,frame=f,total=s.frame_end,elapsed=round(time.time()-start,2),frames_written=len(list(frames.glob('frame_*.png'))))),encoding='utf8')
    print('FRAME',key,f,'SECONDS',round(time.time()-start,2),flush=True)
print('RENDER_COMPLETE',key,flush=True)
