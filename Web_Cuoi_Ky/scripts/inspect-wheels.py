import bpy, json
from mathutils import Vector
from pathlib import Path
out={}
for key in ['mercedes','lamborghini','porsche']:
    bpy.ops.wm.open_mainfile(filepath=f'E:/tkdhfigma/outputs/Studio360_Gray_TCHQ_20261102/Blender/{key}_Gray_TCHQ_360.blend',load_ui=False,use_scripts=False)
    bpy.context.scene.frame_set(1)
    records=[]
    for o in bpy.data.collections['CAR | '+key.upper()].all_objects:
        if o.type!='MESH' or o.hide_render: continue
        pts=[o.matrix_world @ Vector(p) for p in o.bound_box]
        lo=[min(p[i] for p in pts) for i in range(3)];hi=[max(p[i] for p in pts) for i in range(3)]
        center=[round((lo[i]+hi[i])/2,3) for i in range(3)];size=[round(hi[i]-lo[i],3) for i in range(3)]
        if (center[2]<.65 and abs(center[1])>.55) or key=='lamborghini':
            records.append({'object':o.name,'center':center,'size':size,'materials':[s.material.name if s.material else '' for s in o.material_slots]})
    out[key]=records
Path('output/wheel-inspection.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
