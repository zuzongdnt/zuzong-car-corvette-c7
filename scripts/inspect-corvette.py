import bpy, json, pathlib
root=pathlib.Path(__file__).resolve().parents[1]
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=str(root/'assets/model/corvette-c7/source/CorvetteC7.fbx'))
report={'objects':[], 'materials':[]}
for o in bpy.data.objects:
 if o.type=='MESH':
  report['objects'].append({'name':o.name,'vertices':len(o.data.vertices),'polygons':len(o.data.polygons),'location':list(o.location),'dimensions':list(o.dimensions),'materials':[m.name for m in o.data.materials if m]})
for m in bpy.data.materials:
 nodes=[]
 if m.use_nodes:
  for n in m.node_tree.nodes:
   nodes.append({'type':n.type,'name':n.name,'image':n.image.filepath if n.type=='TEX_IMAGE' and n.image else None,'inputs':{s.name:list(s.default_value) if hasattr(s.default_value,'__len__') and not isinstance(s.default_value,str) else s.default_value for s in n.inputs if hasattr(s,'default_value') and s.type in ('VALUE','RGBA')},'links':[(l.from_node.name,l.from_socket.name,l.to_socket.name) for s in n.inputs for l in s.links]})
 report['materials'].append({'name':m.name,'diffuse':list(m.diffuse_color),'nodes':nodes})
(root/'output/corvette-materials.json').write_text(json.dumps(report,indent=2))
print(json.dumps({'objects':report['objects'],'materials':[m['name'] for m in report['materials']]},indent=2))
