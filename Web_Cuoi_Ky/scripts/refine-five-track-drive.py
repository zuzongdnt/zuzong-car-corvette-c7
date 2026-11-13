import bpy,bmesh
from pathlib import Path
OUT=Path(__file__).resolve().parents[1]/'output/Track_5_Cars_3D_20261105'
path=OUT/'ZEPHYRON_5_Cars_Track_3D.blend'
bpy.ops.wm.open_mainfile(filepath=str(path),load_ui=False,use_scripts=False)
s=bpy.context.scene
s.world.node_tree.nodes['Background'].inputs['Strength'].default_value=2.5
bpy.data.lights['Circuit | physical afternoon sun'].energy=3
s.view_settings.exposure=.5
for o in s.objects:
    if o.type!='MESH' or not o.name.startswith('E-Track 4 |'):continue
    bm=bmesh.new();bm.from_mesh(o.data);bmesh.ops.reverse_faces(bm,faces=list(bm.faces));bm.to_mesh(o.data);bm.free();o.data.update()
    if o.name.endswith(('tr-grass.rgb','tr-grass6.rgb')):
        for p in o.data.polygons:p.use_smooth=True
prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='OPTIX';prefs.get_devices()
for d in prefs.devices:d.use=d.type=='OPTIX'
s.cycles.device='GPU';s.frame_set(12)
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(path),compress=True)
s.render.filepath=str(OUT/'Five_Cars_Track_012.png');bpy.ops.render.render(write_still=True)
s.frame_set(72);s.render.filepath=str(OUT/'Five_Cars_Track_072.png');bpy.ops.render.render(write_still=True)
print('LIGHTING_REFINED',flush=True)
