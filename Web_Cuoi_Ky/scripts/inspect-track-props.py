import bpy,json
from pathlib import Path
from mathutils import Vector
root=Path(__file__).resolve().parents[1]/'output/Track_5_Cars_3D_20261105/assets'
bpy.ops.wm.open_mainfile(filepath=str(root/'Bleacher.blend'),load_ui=False,use_scripts=False)
records=[]
for o in bpy.context.scene.objects:
    if o.type!='MESH':continue
    pts=[o.matrix_world@Vector(v) for v in o.bound_box]
    records.append(dict(name=o.name,lo=[min(v[i] for v in pts) for i in range(3)],hi=[max(v[i] for v in pts) for i in range(3)],vertices=len(o.data.vertices),materials=[m.name for m in o.data.materials if m]))
(root/'bleacher-inspection.json').write_text(json.dumps(records,indent=2))
print(json.dumps(records,indent=2),flush=True)
