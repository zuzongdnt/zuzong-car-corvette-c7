"""Project body landmarks through each approved animated Blender camera."""
import bpy,json
from mathutils import Vector
from pathlib import Path
from bpy_extras.object_utils import world_to_camera_view
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT.parent/'output/Blender_5_Xe_Theo_Mau_V2_20261105/Final_1080p/Blender'
OUT=ROOT/'assets/studio-scroll-v2';OUT.mkdir(exist_ok=True)
KEYS=['corvette','bmw','porsche','mercedes','lamborghini']
records=[]
for key in KEYS:
    bpy.ops.wm.open_mainfile(filepath=str(SOURCE/f'{key}_Studio_1080p.blend'),load_ui=False,use_scripts=False)
    scene=bpy.context.scene
    # Engine bay, powertrain and driven rear wheel, in each car's existing world scale.
    landmarks=[(-1.25,-.25,.85),(0,-.6,.8),(1.35,-.82,.38)]
    if key=='porsche':landmarks=[(1.6,-.15,1.0),(.7,-.65,.78),(1.35,-.82,.38)]
    if key=='lamborghini':landmarks=[(.9,-.15,.96),(.1,-.64,.8),(1.4,-.86,.38)]
    for f in range(1,65):
        scene.frame_set(f);bpy.context.view_layer.update()
        points=[world_to_camera_view(scene,scene.camera,Vector(p)) for p in landmarks]
        assert all(0<p.x<1 and 0<p.y<1 and p.z>0 for p in points),(key,f)
        records.append([[round(p.x,6),round(1-p.y,6)] for p in points])
assert len(records)==320
(OUT/'anchors.json').write_text(json.dumps(records,separators=(',',':')))
print('PROJECTED_ANCHORS',len(records),flush=True)
