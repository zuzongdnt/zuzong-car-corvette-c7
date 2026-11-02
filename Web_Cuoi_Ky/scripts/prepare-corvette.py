"""Convert the supplied FBX with Blender 4.5's bpy; preserve full geometry.
Run with E:/CodexHome/tools/python311/python.exe scripts/prepare-corvette.py.
Source and texture files stay unchanged. Browser color controls target Car Paint.
"""
import bpy, pathlib, json
from mathutils import Vector, Matrix
root=pathlib.Path(__file__).resolve().parents[1]
source=root/'assets/model/corvette-c7'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=str(source/'source/CorvetteC7.fbx'))
textures={p.name:p for p in (source/'textures').iterdir()}
missing=[]
for material in bpy.data.materials:
 if not material.use_nodes: continue
 nodes=material.node_tree.nodes; links=material.node_tree.links
 bsdf=next(n for n in nodes if n.type=='BSDF_PRINCIPLED')
 for n in list(nodes):
  if n.type=='TEX_IMAGE' and n.image:
   name=pathlib.PureWindowsPath(n.image.filepath).name
   if name in textures:
    n.image.filepath=str(textures[name]);n.image.reload()
   else:
    missing.append(name);nodes.remove(n)
 # FBX adds empty Normal Map nodes even when no texture was supplied.
 for n in list(nodes):
  if n.type=='NORMAL_MAP' and not n.inputs['Color'].is_linked: nodes.remove(n)
 def set_input(name,value):
  for l in list(bsdf.inputs[name].links): links.remove(l)
  bsdf.inputs[name].default_value=value
 name=material.name
 if name=='Car Paint':
  set_input('Base Color',(0.0056,0.0060,0.0080,1));set_input('Metallic',.55);set_input('Roughness',.25)
  set_input('Coat Weight',1);set_input('Coat Roughness',.13)
 elif name=='Car Paint 2':
  set_input('Base Color',(.009,.01,.013,1));set_input('Metallic',.65);set_input('Roughness',.23)
  set_input('Coat Weight',.65)
 elif name=='Windows':
  set_input('Base Color',(.045,.06,.075,1));set_input('Metallic',.1);set_input('Roughness',.1);set_input('Alpha',.42)
 elif name in ('Headlight Cover','Main Headlight Lens','Tail Lights White Cover'):
  set_input('Base Color',(.8,.85,.9,1));set_input('Roughness',.06);set_input('Alpha',.12)
 elif name in ('Tail Lights Red Cover','Tail Lights Red Cover 2','Spoiler Light Cover'):
  set_input('Base Color',(.45,.004,.008,1));set_input('Roughness',.2);set_input('Coat Weight',.8)
 elif name in ('Blinker Glass Cover','Side Reflectors Cover'):
  set_input('Base Color',(.8,.12,.006,1));set_input('Roughness',.22)
 elif name=='Daylight Cover':
  set_input('Base Color',(.8,.85,.9,1));set_input('Emission Color',(.55,.62,.7,1));set_input('Emission Strength',.6)
 elif name=='Rim':
  set_input('Base Color',(.015,.017,.021,1));set_input('Metallic',.8);set_input('Roughness',.24)
 elif name=='Wipers':
  set_input('Base Color',(.006,.007,.009,1));set_input('Metallic',.15);set_input('Roughness',.5)
 elif name=='Interior':
  set_input('Base Color',(.009,.009,.009,1));set_input('Metallic',.05);set_input('Roughness',.8)
 elif name=='Reflectors':
  set_input('Metallic',.85);set_input('Roughness',.15)
 if name=='TireMaterial':
  image=bpy.data.images.load(str(textures['MICHELIN_TIRE_NORMAL.png']),check_existing=True);image.colorspace_settings.name='Non-Color'
  tex=nodes.new('ShaderNodeTexImage');tex.image=image
  normal=nodes.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.65
  links.new(tex.outputs['Color'],normal.inputs['Color']);links.new(normal.outputs['Normal'],bsdf.inputs['Normal'])
 if bsdf.inputs['Alpha'].default_value<1: material.surface_render_method='DITHERED'
 material.use_backface_culling=True
# Bake object transforms and ground/center the car. No simplification/decimation.
meshes=[o for o in bpy.data.objects if o.type=='MESH']
worlds={o.name:o.matrix_world.copy() for o in meshes}
for o in meshes: o.parent=None
for o in meshes:
 o.data=o.data.copy();o.data.transform(worlds[o.name]);o.matrix_world=Matrix.Identity(4);o.data.update()
bpy.context.view_layer.update()
corners=[Vector(v) for o in meshes for v in o.bound_box]
lo=Vector([min(v[i] for v in corners) for i in range(3)]);hi=Vector([max(v[i] for v in corners) for i in range(3)])
center=Vector(((lo.x+hi.x)/2,(lo.y+hi.y)/2,lo.z))
transform=Matrix.Scale(.5,4)@Matrix.Translation(-center)
for o in meshes: o.data.transform(transform)
out=root/'assets/model/corvette-c7.glb'
bpy.ops.export_scene.gltf(filepath=str(out),export_format='GLB',export_animations=False,export_cameras=False,export_lights=False,export_yup=True,export_texcoords=True,export_normals=True,export_materials='EXPORT',export_extras=False)
report={'source':'chevrolet-corvette-c7.zip / source/CorvetteC7.fbx','author':'Martin Trafas','url':'https://sketchfab.com/3d-models/chevrolet-corvette-c7-2b509d1bce104224b147c81757f6f43a','license':'CC BY 4.0','paintMaterials':['Car Paint'],'changes':['FBX to GLB','Relink supplied textures','Rebuild glass and light materials lost in FBX','Default black paint, dark rims','Full source geometry retained'],'missingSourceTextures':sorted(set(missing)),'bytes':out.stat().st_size}
(root/'assets/model/manifest.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
