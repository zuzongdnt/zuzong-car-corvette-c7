import bpy, json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
reports = {}
for key in ['bmw', 'corvette', 'porsche', 'mercedes', 'lamborghini']:
    path = Path('E:/tkdhfigma/outputs/Studio360_Gray_TCHQ_20261102/Blender') / f'{key}_Gray_TCHQ_360.blend'
    bpy.ops.wm.open_mainfile(filepath=str(path), load_ui=False, use_scripts=False)
    col = bpy.data.collections['CAR | ' + key.upper()]
    objects = [o for o in col.all_objects if o.type in {'MESH', 'FONT'} and not o.hide_render]
    mats = {}
    for o in objects:
        for slot in o.material_slots:
            if slot.material:
                mats.setdefault(slot.material.name, []).append(o.name)
    reports[key] = {'objects': len(objects), 'materials': mats, 'polygons': sum(len(o.data.polygons) for o in objects if o.type == 'MESH')}
    print(key, len(objects), reports[key]['polygons'], flush=True)
(root/'output/studio-inspection.json').write_text(json.dumps(reports, ensure_ascii=False, indent=2), encoding='utf-8')
