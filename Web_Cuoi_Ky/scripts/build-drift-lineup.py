import bpy, importlib.util, math, json
from pathlib import Path
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/Drift_5_Xe_20261105'
spec=importlib.util.spec_from_file_location('drift_builder',Path(__file__).with_name('build-five-drift.py'))
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene
positions=[(-2.8,-3.0),(-2.8,2.4),(2.8,-5.4),(2.8,0),(2.8,5.4)]
rigs=[]
for key,(x,y) in zip(b.KEYS,positions):
    with bpy.data.libraries.load(str(OUT/f'{key}_Drift_Test.blend'),link=False) as (src,dst):dst.objects=list(src.objects)
    objects=[o for o in dst.objects if o]
    rig=next(o for o in objects if o.name.startswith(key.upper()+' | drift trajectory'))
    keep={rig,*rig.children_recursive}
    for o in objects:
        if o in keep:
            s.collection.objects.link(o);o.animation_data_clear()
        else:bpy.data.objects.remove(o,do_unlink=True)
    rig.location=(x,y,0);rig.rotation_euler=(0,0,math.radians(-7))
    for o in rig.children_recursive:
        if o.type=='EMPTY':
            o.rotation_euler=(0,0,0)
            if o.name.startswith('Suspension'):o.location=(0,0,0)
    rigs.append(rig)
b.stage(s);b.render_settings(s);s.frame_end=48
data=bpy.data.cameras.new('Five cars | closing formation');cam=bpy.data.objects.new(data.name,data);s.collection.objects.link(cam);s.camera=cam;data.lens=50;data.clip_end=500
for f,loc in [(1,(-20,-24,10)),(48,(-19,-23,9.5))]:
    cam.location=loc;cam.rotation_euler=(Vector((0,0,.5))-cam.location).to_track_quat('-Z','Y').to_euler();cam.keyframe_insert('location',frame=f);cam.keyframe_insert('rotation_euler',frame=f)
b.linear(cam)
s.frame_set(24);bpy.context.view_layer.update()
points=[world_to_camera_view(s,cam,o.matrix_world@Vector(v)) for rig in rigs for o in rig.children_recursive if o.type=='MESH' for v in o.bound_box]
report=dict(cars=b.KEYS,frame_bounds=dict(x=[min(p.x for p in points),max(p.x for p in points)],y=[min(p.y for p in points),max(p.y for p in points)]))
assert all(.025<p.x<.975 and .025<p.y<.975 for p in points),report
(OUT/'group-rig-qa.json').write_text(json.dumps(report,indent=2))
bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'group_Drift_Test.blend'),compress=True)
s.render.filepath=str(OUT/'group_proof.png');bpy.ops.render.render(write_still=True)
print('LINEUP_READY',flush=True)
