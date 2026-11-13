"""Tune glTF PBR materials for the Three.js renderer; preserve geometry and embedded images."""
from pathlib import Path
import copy, json, shutil, struct

ROOT = Path(__file__).resolve().parents[1]
MODELS = ROOT / 'assets/model/studio'
BACKUP = ROOT / 'output/backup-before-model-finish-20261102'
BACKUP.mkdir(parents=True, exist_ok=True)

def srgb(hex_color):
    values = [int(hex_color[i:i+2], 16) / 255 for i in (1, 3, 5)]
    return [v/12.92 if v <= .04045 else ((v+.055)/1.055)**2.4 for v in values] + [1]

def read_glb(path):
    blob = path.read_bytes()
    length = struct.unpack_from('<I', blob, 12)[0]
    return json.loads(blob[20:20+length]), blob[20+length:]

def write_glb(path, doc, chunks):
    text = json.dumps(doc, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    text += b' ' * (-len(text) % 4)
    path.write_bytes(struct.pack('<4sII', b'glTF', 2, 20+len(text)+len(chunks)) + struct.pack('<II',len(text),0x4e4f534a) + text + chunks)

def finish_model(key):
    path = MODELS / f'{key}.glb'
    original = BACKUP / path.name
    if not original.exists(): shutil.copy2(path, original)
    doc, chunks = read_glb(path)
    original_doc = copy.deepcopy(doc)
    before = copy.deepcopy(doc['materials'])
    def values(m,color=None,metal=None,rough=None):
        p=m.setdefault('pbrMetallicRoughness',{})
        if color is not None: p['baseColorFactor']=srgb(color)
        if metal is not None: p['metallicFactor']=metal
        if rough is not None: p['roughnessFactor']=rough
        return p
    def coat(m,strength=.8,rough=.1):
        m.setdefault('extensions',{})['KHR_materials_clearcoat']={'clearcoatFactor':strength,'clearcoatRoughnessFactor':rough}
    glass_names = {
        'lamborghini': ['Windows.001'],
        'bmw': ['BMW | Kinh o to'],
        'corvette': ['Windows'],
        'porsche': ['Porsche_911GT3_2022Window_Material'],
        'mercedes': ['SL63_tinted-glass']
    }
    for m in doc['materials']:
        name=m.get('name','');lower=name.lower();p=m.setdefault('pbrMetallicRoughness',{});ext=m.setdefault('extensions',{})
        if name.startswith('ZUZONG_body |'):
            values(m,metal=.38,rough=.23)
            coat(m,1,.085)
            ext['KHR_materials_specular']={'specularFactor':1}
            m['doubleSided']=False
        elif name.startswith('ZUZONG_rims |'):
            values(m,metal=.95,rough=.24)
            coat(m,.3,.16)
            ext['KHR_materials_specular']={'specularFactor':1}
        elif name.startswith('ZUZONG_calipers |'):
            values(m,metal=.25,rough=.32);coat(m,.65,.15)
        elif any(name.startswith(token) for token in glass_names[key]):
            # Thin car windows need one stable transparent layer, without a second refractive render pass.
            values(m,'#465460',.08,.095)
            p['baseColorFactor'][3]=.62 if key not in ['porsche','corvette'] else .68
            p.pop('baseColorTexture',None)
            ext.pop('KHR_materials_transmission',None)
            ext.pop('KHR_materials_volume',None)
            ext['KHR_materials_ior']={'ior':1.5}
            coat(m,1,.045)
            m['alphaMode']='BLEND';m['doubleSided']=False
            m.pop('normalTexture',None)
        elif 'leather' in lower or 'velour' in lower or 'noi that' in lower or name=='Interior':
            values(m,metal=0,rough=.72 if 'velour' in lower else .58)
            p.pop('metallicRoughnessTexture',None)
            ext.pop('KHR_materials_anisotropy',None)
            ext.pop('KHR_materials_sheen',None)
            ext.pop('KHR_materials_clearcoat',None)
            ext['KHR_materials_specular']={'specularFactor':.32}
            if 'normalTexture' in m:m['normalTexture']['scale']=.18
            if key=='lamborghini':
                # The source's fabric normal maps alias under the web tangent basis at headrest scale.
                m.pop('normalTexture',None)
            if key=='lamborghini' and name=='Leather':
                values(m,'#554136',0,.62)
        elif name=='Gloss-black':
            values(m,'#17191c',.12,.22);coat(m,.8,.11)
        elif 'carbon' in lower or 'mai carbon' in lower:
            # The BMW procedural carbon shader exported without a base color (glTF defaults to white).
            if key=='bmw' and name=='BMW | Mai carbon':
                values(m,'#17191c')
            values(m,metal=.12,rough=.32);coat(m,.45,.16)
            if 'normalTexture' in m:m['normalTexture']['scale']=.22
        elif key=='lamborghini' and name=='Anisotropic Metal':
            # Shader-node groups did not export usable brake-disc PBR values.
            values(m,'#696d72',.85,.42)
        elif key=='lamborghini' and name=='Smooth Metal':
            values(m,'#40454b',.75,.4)
        elif 'tire' in lower or 'rubber' in lower or 'lop ' in lower or 'fixed rubber' in lower:
            values(m,metal=0,rough=.84)
            if 'normalTexture' in m:m['normalTexture']['scale']=.45
            ext.pop('KHR_materials_clearcoat',None)
        if key=='lamborghini' and name=='Logo 3':
            m['alphaMode']='MASK';m['alphaCutoff']=.55;m['doubleSided']=False
            m.pop('normalTexture',None)
            values(m,metal=0,rough=.65)
            ext.clear()
            p.get('baseColorTexture',{}).pop('extensions',None)
        if 'normalTexture' in m and 'scale' not in m['normalTexture']:
            m['normalTexture']['scale']=.5
        if not ext:m.pop('extensions',None)
    used=set(doc.get('extensionsUsed',[]))
    for m in doc['materials']:used.update(m.get('extensions',{}))
    doc['extensionsUsed']=sorted(used)
    doc.setdefault('asset',{}).setdefault('extras',{})['zuzongFinish']='Automotive studio PBR v2 / 2026-11-02'
    # These material edits must not mutate meshes, textures or packed image data.
    for field in ['meshes','nodes','accessors','bufferViews','textures','images']:
        assert doc.get(field)==original_doc.get(field), (key,field)
    write_glb(path,doc,chunks)
    changed=[m['name'] for a,m in zip(before,doc['materials']) if a!=m]
    return {'car':key,'changedMaterials':changed,'geometryPreserved':True,'embeddedImagesPreserved':True,'bytes':path.stat().st_size}

if __name__=='__main__':
    reports=[finish_model(key) for key in ['corvette','bmw','porsche','mercedes','lamborghini']]
    (ROOT/'output/model-finish-materials.json').write_text(json.dumps(reports,ensure_ascii=False,indent=2),encoding='utf-8')
    print('Polished PBR materials for',len(reports),'cars; geometry and textures preserved.')
