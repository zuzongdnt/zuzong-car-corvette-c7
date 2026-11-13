"""Prepare actual lamp materials and a texture mask; keep source meshes and image maps."""
from pathlib import Path
from io import BytesIO
import json,struct,copy,shutil,re
import numpy as np
from PIL import Image

root=Path(__file__).resolve().parents[1]
backup=root/'output/backup-before-car-lights-20261102';backup.mkdir(parents=True,exist_ok=True)
for filename in ['studio.js','studio.css','scripts/build.cjs','assets/vendor/model-viewer/model-viewer.min.js']:
    source=root/filename;dest=backup/filename;dest.parent.mkdir(parents=True,exist_ok=True)
    if not dest.exists():shutil.copy2(source,dest)
vendor=root/'assets/vendor'
for dirname in ['three','model-viewer-effects']:(vendor/dirname).mkdir(exist_ok=True)
sources=root/'output/light-dependencies'
for source,target in [('three-three.module.js','three/three.module.js'),('three-three.core.js','three/three.core.js'),('three-LICENSE','three/LICENSE'),('model-viewer-effects-LICENSE','model-viewer-effects/LICENSE')]:shutil.copy2(sources/source,vendor/target)
for source,target in [('model-viewer-model-viewer-module.min.js','model-viewer/model-viewer.min.js'),('model-viewer-effects-model-viewer-effects.min.js','model-viewer-effects/model-viewer-effects.min.js')]:
    text=(sources/source).read_text(encoding='utf-8')
    text=re.sub(r'from(["\'])three\1',r'from\1../three/three.module.js\1',text)
    text=text.replace('LuminanceFormat as Y','RedFormat as Y')
    (vendor/target).write_text(text,encoding='utf-8')

for key in ['corvette','bmw','porsche','mercedes','lamborghini']:
    path=root/f'assets/model/studio/{key}.glb';old=backup/f'{key}.glb'
    if not old.exists():shutil.copy2(path,old)
    blob=path.read_bytes();size=struct.unpack_from('<I',blob,12)[0];doc=json.loads(blob[20:20+size]);binary=bytearray(blob[28+size:])
    if doc.get('asset',{}).get('extras',{}).get('carLights')=='mesh-emission-selective-bloom-v1':
        print('Already prepared',key)
        continue
    def append_view(data):
        binary.extend(b'\0'*(-len(binary)%4));offset=len(binary);binary.extend(data)
        doc['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':len(data)})
        return len(doc['bufferViews'])-1
    def accessor_data(index):
        a=doc['accessors'][index];v=doc['bufferViews'][a['bufferView']];types={5121:'<u1',5123:'<u2',5125:'<u4',5126:'<f4'};components={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a['type']]
        return np.frombuffer(binary,dtype=types[a['componentType']],count=a['count']*components,offset=v.get('byteOffset',0)+a.get('byteOffset',0)).copy().reshape(-1,components)
    if key=='porsche':
        index=next(i for i,m in enumerate(doc['materials']) if 'LightA_Material' in m.get('name',''))
        material=copy.deepcopy(doc['materials'][index]);texture_info=material['pbrMetallicRoughness']['baseColorTexture'];tex=doc['textures'][texture_info['index']];image=doc['images'][tex['source']];view=doc['bufferViews'][image['bufferView']]
        pixels=np.array(Image.open(BytesIO(bytes(binary[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']]))).convert('RGB')).astype(np.float32)/255
        h,w=pixels.shape[:2];yy,xx=np.mgrid[0:h,0:w];x=xx/w;y=yy/h
        # Derive light from the existing projector circle and bright LED details in the source atlas.
        projector=np.maximum(0,1-((x-.195)/.176)**2-((y-.805)/.176)**2)**.35
        bright=np.clip((pixels.min(axis=2)-.66)/.24,0,1)
        mask=np.maximum(projector*.85,bright)
        encoded=BytesIO();Image.fromarray(np.repeat((mask*255).astype(np.uint8)[...,None],3,axis=2)).save(encoded,format='PNG')
        doc['images'].append({'name':'Porsche original lamp emission mask','mimeType':'image/png','bufferView':append_view(encoded.getvalue())})
        doc['textures'].append({'sampler':tex.get('sampler',0),'source':len(doc['images'])-1})
        material['name']='STUDIO_LIGHT | front | Porsche projector';material['emissiveTexture']={**texture_info,'index':len(doc['textures'])-1};material['emissiveFactor']=[0,0,0]
        doc['materials'].append(material);front_material=len(doc['materials'])-1
        for mesh in doc['meshes']:
            split=[]
            for primitive in mesh['primitives']:
                if primitive.get('material')!=index:split.append(primitive);continue
                positions=accessor_data(primitive['attributes']['POSITION']);indices=accessor_data(primitive['indices']).flatten().reshape(-1,3);centers=positions[indices].mean(axis=1)
                # Porsche source is oriented along local X; its nose is the negative end.
                front=centers[:,0]<-1.0
                for select,mat in [(front,front_material),(~front,index)]:
                    triangles=indices[select].astype('<u4').flatten()
                    if not len(triangles):continue
                    prim=copy.deepcopy(primitive);a={'bufferView':append_view(triangles.tobytes()),'componentType':5125,'count':len(triangles),'type':'SCALAR'};doc['accessors'].append(a);prim['indices']=len(doc['accessors'])-1;prim['material']=mat;split.append(prim)
            mesh['primitives']=split
    doc.setdefault('asset',{}).setdefault('extras',{})['carLights']='mesh-emission-selective-bloom-v1'
    doc['buffers'][0]['byteLength']=len(binary);binary.extend(b'\0'*(-len(binary)%4))
    text=json.dumps(doc,ensure_ascii=False,separators=(',',':')).encode();text+=b' '*(-len(text)%4)
    path.write_bytes(struct.pack('<4sII',b'glTF',2,28+len(text)+len(binary))+struct.pack('<II',len(text),0x4e4f534a)+text+struct.pack('<II',len(binary),0x004e4942)+binary)
    print('Prepared',key)
