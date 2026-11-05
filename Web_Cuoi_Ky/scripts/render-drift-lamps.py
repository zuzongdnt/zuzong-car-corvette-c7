import bpy, math, time
from pathlib import Path
from mathutils import Vector, Matrix

OUT=Path(__file__).resolve().parents[1]/'output/Drift_5_Xe_20261105'
for key in ['corvette','bmw','porsche','mercedes','lamborghini']:
    bpy.ops.wm.open_mainfile(filepath=str(OUT/f'{key}_Drift_Test.blend'),load_ui=False,use_scripts=False)
    s=bpy.context.scene;s.frame_set(27);bpy.context.view_layer.update()
    rig=bpy.data.objects[key.upper()+' | drift trajectory'];cam=s.camera
    cam.animation_data_clear();cam.data.dof.use_dof=False;cam.data.lens=65
    cam.location=rig.matrix_world@Vector((-4.15,-2.25,1.15))
    target=rig.matrix_world@Vector((-1.85,-.62,.62));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
    s.render.resolution_x=1600;s.render.resolution_y=900;s.render.use_motion_blur=False;s.cycles.samples=96;s.cycles.adaptive_threshold=.02
    prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='OPTIX';prefs.get_devices()
    for d in prefs.devices:d.use=d.type=='OPTIX'
    s.cycles.device='GPU';s.render.filepath=str(OUT/f'{key}_headlight.png');bpy.ops.render.render(write_still=True)
    print('LAMP_READY',key,flush=True)
