import bpy, json
from pathlib import Path
from mathutils import Vector

out = Path(__file__).resolve().parents[1] / 'output/Drift_5_Xe_20261105'
out.mkdir(parents=True, exist_ok=True)
report = {}
for key in ['corvette', 'bmw', 'porsche', 'mercedes', 'lamborghini']:
    bpy.ops.wm.open_mainfile(filepath=f'E:/tkdhfigma/outputs/Studio360_Gray_TCHQ_20261102/Blender/{key}_Gray_TCHQ_360.blend', load_ui=False, use_scripts=False)
    bpy.context.scene.frame_set(1)
    objects = list(bpy.data.collections['CAR | ' + key.upper()].all_objects)
    records = []
    for o in objects:
        if o.type != 'MESH' or o.hide_render: continue
        pts = [o.matrix_world @ Vector(p) for p in o.bound_box]
        lo = [min(p[i] for p in pts) for i in range(3)]
        hi = [max(p[i] for p in pts) for i in range(3)]
        records.append(dict(name=o.name, center=[round((lo[i]+hi[i])/2, 4) for i in range(3)], size=[round(hi[i]-lo[i], 4) for i in range(3)], vertices=len(o.data.vertices), materials=[m.name for m in o.data.materials if m]))
    mats = {}
    for o in objects:
        if o.type != 'MESH': continue
        for m in o.data.materials:
            if not m or m.name in mats: continue
            nodes = []
            if m.node_tree:
                for n in m.node_tree.nodes:
                    if n.type == 'BSDF_PRINCIPLED':
                        nodes.append({k: list(n.inputs[k].default_value) if k in ['Base Color', 'Emission Color'] else n.inputs[k].default_value for k in ['Base Color','Metallic','Roughness','Transmission Weight','IOR','Emission Color','Emission Strength']})
            mats[m.name] = nodes
    report[key] = dict(objects=records, materials=mats)
    print('INSPECTED', key, len(records), flush=True)
(out/'source-inspection.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
