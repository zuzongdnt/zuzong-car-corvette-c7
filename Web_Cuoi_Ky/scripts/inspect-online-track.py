import bpy,json
from pathlib import Path
from mathutils import Vector

ROOT=Path(__file__).resolve().parents[1]/'output/Track_5_Cars_3D_20261105'
report={}
for name in ['track','trackv3']:
    bpy.ops.wm.open_mainfile(filepath=str(ROOT/'assets'/f'{name}.blend'),load_ui=False,use_scripts=False)
    objects=[]
    for o in bpy.context.scene.objects:
        if o.type!='MESH':continue
        p=[o.matrix_world@Vector(v) for v in o.bound_box]
        lo=[min(v[i] for v in p) for i in range(3)];hi=[max(v[i] for v in p) for i in range(3)]
        objects.append(dict(name=o.name,location=list(o.location),lo=lo,hi=hi,vertices=len(o.data.vertices),materials=[m.name for m in o.data.materials if m],modifiers=[m.type for m in o.modifiers]))
    report[name]=dict(objects=objects,collections=[c.name for c in bpy.data.collections],curves=[o.name for o in bpy.context.scene.objects if o.type=='CURVE'])
(ROOT/'assets/track-inspection.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print(json.dumps(report,indent=2),flush=True)
