import bpy
from pathlib import Path

OUT=Path(__file__).resolve().parents[1]/'output/Drift_5_Xe_20261105'
for key in ['corvette','bmw','porsche','mercedes','lamborghini']:
    path=OUT/f'{key}_Drift_Test.blend'
    bpy.ops.wm.open_mainfile(filepath=str(path),load_ui=False,use_scripts=False)
    m=bpy.data.materials['Tyre smoke | expanding turbulent volume']
    volume=next(n for n in m.node_tree.nodes if n.type=='PRINCIPLED_VOLUME')
    gain=volume.inputs['Density'].links[0].from_node
    gain.inputs[1].default_value=.18
    bpy.context.preferences.filepaths.save_version=0
    bpy.ops.wm.save_as_mainfile(filepath=str(path),compress=True)
    print('REFINED_SMOKE',key,flush=True)
