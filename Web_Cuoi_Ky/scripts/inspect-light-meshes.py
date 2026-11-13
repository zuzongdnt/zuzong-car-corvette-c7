from pathlib import Path
import json,struct,numpy as np

root=Path(__file__).resolve().parents[1]
for key in ['corvette','bmw','porsche','mercedes','lamborghini']:
    data=(root/f'assets/model/studio/{key}.glb').read_bytes();length=struct.unpack_from('<I',data,12)[0];doc=json.loads(data[20:20+length]);binary=data[28+length:]
    print('\n'+key)
    for mesh in doc['meshes']:
        for primitive in mesh['primitives']:
            m=doc['materials'][primitive.get('material',0)];name=m.get('name','')
            if not any(t in name.lower() for t in ['light','led','den hau','white','red emission','red_glass']):continue
            accessor=doc['accessors'][primitive['attributes']['POSITION']]
            lo=accessor.get('min');hi=accessor.get('max')
            print(mesh.get('name'),name,'bounds',lo,hi,'triangles',doc['accessors'][primitive['indices']]['count']//3)
