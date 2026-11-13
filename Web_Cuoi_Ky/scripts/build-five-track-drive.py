"""Five existing vehicles driving together through an imported 3D TORCS circuit."""
import bpy, math, re, json, importlib.util, random
from pathlib import Path
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/Track_5_Cars_3D_20261105'
OLD=ROOT/'output/Drift_5_Xe_20261105'
ASSETS=OUT/'assets';TRACK=ASSETS/'torcs-e-track-4'
KEYS=['porsche','bmw','corvette','mercedes','lamborghini']
N,FPS,SPEED=96,24,22.0
random.seed(243880)
spec=importlib.util.spec_from_file_location('drift_helpers',Path(__file__).with_name('build-five-drift.py'))
b=importlib.util.module_from_spec(spec);spec.loader.exec_module(b)
bpy.ops.wm.read_factory_settings(use_empty=True)
s=bpy.context.scene

def import_ac3d():
    text=(TRACK/'e-track-4.ac').read_text(errors='replace');groups={};source_objects=0
    for block in re.split(r'(?m)^OBJECT ',text):
        if not block.startswith('poly'):continue
        lines=block.splitlines();name=re.search(r'(?m)^name "([^"]+)"',block)
        tex=re.search(r'(?m)^texture "([^"]+)"',block);texture=tex[1] if tex else 'untextured'
        vi=next((i for i,v in enumerate(lines) if v.startswith('numvert ')),None)
        if vi is None:continue
        count=int(lines[vi].split()[1]);vertices=[tuple(map(float,v.split())) for v in lines[vi+1:vi+1+count]]
        # AC3D is Y-up. Rotate the imported straight so vehicles can use their native -X forward direction.
        vertices=[(900-v[0],-v[2]-1007.4025,v[1]-31.2843) for v in vertices]
        store=groups.setdefault(texture,dict(vertices=[],faces=[],uv=[]));offset=len(store['vertices']);store['vertices'].extend(vertices)
        i=vi+count+1
        while i<len(lines):
            if lines[i].startswith('refs '):
                refs=int(lines[i].split()[1]);values=[v.split() for v in lines[i+1:i+1+refs]]
                if refs>=3:
                    values=list(reversed(values))
                    store['faces'].append([offset+int(v[0]) for v in values]);store['uv'].extend([(float(v[1]),float(v[2])) for v in values])
                i+=refs
            i+=1
        source_objects+=1
    col=bpy.data.collections.new('SOURCE | TORCS E-Track 4 - imported AC3D');s.collection.children.link(col)
    objects=[]
    for texture,data in groups.items():
        mesh=bpy.data.meshes.new('E-Track 4 | '+texture);mesh.from_pydata(data['vertices'],[],data['faces']);mesh.update()
        uv=mesh.uv_layers.new(name='Original track texture coordinates')
        assert len(uv.data)==len(data['uv']),(texture,len(uv.data),len(data['uv']))
        uv.data.foreach_set('uv',[v for pair in data['uv'] for v in pair])
        o=bpy.data.objects.new(mesh.name,mesh);col.objects.link(o)
        mat=b.material('Circuit | '+texture,(.18,.18,.18),.8);p=mat.node_tree.nodes.get('Principled BSDF');nodes=mat.node_tree.nodes;links=mat.node_tree.links
        path=TRACK/texture
        if path.exists():
            t=nodes.new('ShaderNodeTexImage');t.image=bpy.data.images.load(str(path),check_existing=True);links.new(t.outputs['Color'],p.inputs['Base Color'])
        if texture in ['tr-road1.rgb','tr-road1-pit.rgb']:
            maps=ROOT.parent/'tmp/blender-rain-preview/city-assets'
            coord=nodes.new('ShaderNodeNewGeometry');scale=nodes.new('ShaderNodeVectorMath');scale.operation='SCALE';scale.inputs[3].default_value=.27;links.new(coord.outputs['Position'],scale.inputs[0])
            for filename,socket in [('asphalt_02_Diffuse_2k.jpg','Base Color'),('asphalt_02_Rough_2k.jpg','Roughness')]:
                tex=nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(maps/filename),check_existing=True)
                if socket=='Roughness':tex.image.colorspace_settings.name='Non-Color'
                links.new(scale.outputs[0],tex.inputs['Vector'])
                if socket=='Base Color':
                    dark=nodes.new('ShaderNodeMixRGB');dark.blend_type='MULTIPLY';dark.inputs[0].default_value=1;dark.inputs[2].default_value=(.55,.57,.6,1);links.new(tex.outputs['Color'],dark.inputs[1]);links.new(dark.outputs[0],p.inputs[socket])
                else:links.new(tex.outputs['Color'],p.inputs[socket])
            tex=nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(maps/'asphalt_02_nor_gl_2k.jpg'),check_existing=True);tex.image.colorspace_settings.name='Non-Color';links.new(scale.outputs[0],tex.inputs['Vector'])
            nm=nodes.new('ShaderNodeNormalMap');nm.inputs['Strength'].default_value=.32;links.new(tex.outputs[0],nm.inputs['Color']);links.new(nm.outputs[0],p.inputs['Normal'])
        elif texture in ['tr-grass.rgb','tr-grass6.rgb']:
            geo=nodes.new('ShaderNodeNewGeometry');noise=nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=.27;noise.inputs['Detail'].default_value=4;links.new(geo.outputs['Position'],noise.inputs['Vector'])
            ramp=nodes.new('ShaderNodeValToRGB');ramp.color_ramp.elements[0].color=(.025,.046,.015,1);ramp.color_ramp.elements[1].color=(.095,.13,.043,1);links.new(noise.outputs['Fac'],ramp.inputs[0]);links.new(ramp.outputs[0],p.inputs['Base Color']);p.inputs['Roughness'].default_value=.95
            fine=nodes.new('ShaderNodeTexNoise');fine.inputs['Scale'].default_value=40;links.new(geo.outputs['Position'],fine.inputs['Vector'])
            bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.3;bump.inputs['Distance'].default_value=.008;links.new(fine.outputs['Fac'],bump.inputs['Height']);links.new(bump.outputs[0],p.inputs['Normal'])
        elif 'barrier' in texture:p.inputs['Metallic'].default_value=.55;p.inputs['Roughness'].default_value=.4
        mesh.materials.append(mat);objects.append(o)
        if texture in ['tr-grass.rgb','tr-grass6.rgb']:
            for face in mesh.polygons:face.use_smooth=True
    assert source_objects>1000 and len(objects)>=15
    return objects,source_objects

def append_car(key,index):
    with bpy.data.libraries.load(str(OLD/f'{key}_Drift_Test.blend'),link=False) as (src,dst):dst.objects=list(src.objects)
    objects=[o for o in dst.objects if o];rig=next(o for o in objects if o.name.startswith(key.upper()+' | drift trajectory'));keep={rig,*rig.children_recursive}
    col=bpy.data.collections.new('CAR | '+key.upper());s.collection.children.link(col)
    for o in objects:
        if o in keep:col.objects.link(o);o.animation_data_clear()
        else:bpy.data.objects.remove(o,do_unlink=True)
    rig.name=key.upper()+' | driving formation'
    for o in rig.children_recursive:
        if o.type=='EMPTY':
            o.rotation_euler=(0,0,0)
            if o.name.startswith('Suspension'):o.location=(0,0,0)
    y=(index-2)*2.9;xoff=[1.15,.35,-.65,.35,1.15][index]
    wheel_data=json.loads((OLD/f'{key}-rig-qa.json').read_text())['wheels']
    for f in range(-1,N+3):
        distance=SPEED*(f-1)/FPS;rig.location=(20-distance+xoff,y,0);rig.rotation_euler=(0,0,0);rig.keyframe_insert('location',frame=f)
        for o in rig.children_recursive:
            if o.name.startswith('Wheel spin |'):
                front=o.parent.name.startswith('F');left=o.parent.name[:2].endswith('L')
                radius=next(w['radius'] for w in wheel_data if w['front']==front and w['left']==left)
                o.rotation_euler.y=-distance/radius;o.keyframe_insert('rotation_euler',frame=f)
            elif o.name.startswith('Suspension'):
                o.location.z=.001*math.sin((f+index*7)*.26);o.rotation_euler.y=math.radians(.025)*math.sin(f*.19+index);o.keyframe_insert('location',frame=f);o.keyframe_insert('rotation_euler',frame=f)
    for o in [rig,*rig.children_recursive]:b.linear(o)
    return rig

def props():
    with bpy.data.libraries.load(str(ASSETS/'Bleacher.blend'),link=False) as (src,dst):dst.objects=['Bleacher']
    bench=dst.objects[0];bench.parent=None;bench.matrix_world=Matrix.Identity(4);bench.hide_render=False;bench.hide_viewport=False
    for i,x in enumerate(range(-130,131,5)):
        o=bench if i==0 else bench.copy();s.collection.objects.link(o);o.name='SOURCE | wooden bleacher '+str(i);o.location=(x,19.8,.02);o.rotation_euler.z=math.pi
    # An imported starting module supplies a genuine mesh gantry in the background.
    with bpy.data.libraries.load(str(ASSETS/'track.blend'),link=False) as (src,dst):dst.objects=['start']
    arch=dst.objects[0];s.collection.objects.link(arch);arch.name='SOURCE | OGA starting gantry';arch.parent=None
    arch.matrix_world=Matrix.Translation((80,0,.005))@Matrix.Rotation(math.pi/2,4,'Z')@Matrix.Diagonal((3.9,1,2,1))@Matrix.Translation((0,-8,0))@arch.matrix_world
    treepath=ROOT.parent/'output/Corvette_Drift_BanNgay/assets/jacaranda_tree/jacaranda_tree_1k.blend'
    with bpy.data.libraries.load(str(treepath),link=False) as (src,dst):dst.objects=['jacaranda_tree_LOD1']
    tree=dst.objects[0];tree.parent=None;tree.matrix_world=Matrix.Identity(4)
    for i,x in enumerate(range(-180,181,18)):
        for side in [-1,1]:
            o=tree.copy();s.collection.objects.link(o);o.name='SOURCE | scanned jacaranda '+str(i)+str(side);o.location=(x,side*(30+random.uniform(0,8)),.05);o.scale=(.32,.32,.32);o.rotation_euler.z=random.random()*math.tau;o.hide_render=False;o.hide_viewport=False
    for i,x in enumerate(range(-210,211,13)):
        o=tree.copy();s.collection.objects.link(o);o.name='SOURCE | distant scanned trees '+str(i);o.location=(x,53+random.uniform(0,15),-.5);size=random.uniform(.37,.48);o.scale=(size,size,size);o.rotation_euler.z=random.random()*math.tau;o.hide_render=False;o.hide_viewport=False
    bpy.data.objects.remove(tree,do_unlink=True)
    steel=b.material('Circuit | galvanized metal',(.26,.28,.3),.32,.8)
    # Fine wire geometry is three dimensional, so it produces real parallax and shadows.
    for y in [-13.5,13.5]:
        for x in range(-180,181,6):
            b.box('Catch fence | steel post',(x,y,1.5),(.055,.055,3),steel,.012)
        curve=bpy.data.curves.new('Catch fence | physical wires','CURVE');curve.dimensions='3D';curve.bevel_depth=.004;curve.bevel_resolution=0
        for z in [.45,.9,1.35,1.8,2.25,2.7]:
            sp=curve.splines.new('POLY');sp.points.add(1);sp.points[0].co=(-180,y,z,1);sp.points[1].co=(180,y,z,1)
        for x in range(-180,181):
            sp=curve.splines.new('POLY');sp.points.add(1);sp.points[0].co=(x,y,.1,1);sp.points[1].co=(x,y,2.8,1)
        o=bpy.data.objects.new('Catch fence | wire mesh',curve);s.collection.objects.link(o);curve.materials.append(steel)
    dark=b.material('Circuit | canopy steel',(.055,.065,.075),.45,.7)
    for x in range(-120,121,20):
        b.box('Spectator canopy | roof',(x,20,5.2),(19.8,6,.14),dark,.04)
        for dx in [-8.8,8.8]:b.box('Spectator canopy | support',(x+dx,23,2.6),(.16,.16,5.2),steel,.025)
    # Road-edge paint and pit markings provide scale without covering the imported asphalt.
    white=b.material('Circuit | weathered white paint',(.63,.63,.59),.85)
    for y in [-7.25,7.25]:b.box('Circuit | white boundary',(0,y,.003),(530,.11,.004),white)

track,source_count=import_ac3d()
rigs=[append_car(key,i) for i,key in enumerate(KEYS)]
props();b.render_settings(s)
for image in bpy.data.images:
    if image.type!='IMAGE' or not image.has_data:continue
    limit=512 if image.name.startswith(('Frame','Seat')) else 2048
    if max(image.size)>limit:
        factor=limit/max(image.size);image.scale(max(1,int(image.size[0]*factor)),max(1,int(image.size[1]*factor)))
s.frame_start=1;s.frame_end=N;s.render.resolution_x=1600;s.render.resolution_y=900;s.cycles.samples=48;s.render.motion_blur_shutter=.35
world=bpy.data.worlds.new('Procedural daylight | no photographic background');world.use_nodes=True;s.world=world
sky=world.node_tree.nodes.new('ShaderNodeTexSky');sky.sky_type='HOSEK_WILKIE';sky.sun_direction=Vector((-.35,-.48,.8)).normalized();sky.turbidity=2.2;sky.ground_albedo=.22
world.node_tree.links.new(sky.outputs[0],world.node_tree.nodes['Background'].inputs['Color']);world.node_tree.nodes['Background'].inputs['Strength'].default_value=2.5
sun=bpy.data.lights.new('Circuit | physical afternoon sun','SUN');sun.energy=3;sun.angle=math.radians(.8);sunobj=bpy.data.objects.new(sun.name,sun);s.collection.objects.link(sunobj);sunobj.rotation_euler=Vector((.35,.48,-.8)).to_track_quat('-Z','Y').to_euler()
s.view_settings.exposure=.5
data=bpy.data.cameras.new('Five-car front tracking | 44mm');cam=bpy.data.objects.new(data.name,data);s.collection.objects.link(cam);s.camera=cam;data.lens=44;data.clip_end=4000;data.dof.use_dof=False
for f in range(-1,N+3):
    t=(f-1)/(N-1);center=Vector((20-SPEED*(f-1)/FPS,0,0));offset=Vector((-25+3*t,-2.8-.7*t,3.2-.4*t))
    cam.location=center+offset;target=center+Vector((0,0,.65));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler();cam.keyframe_insert('location',frame=f);cam.keyframe_insert('rotation_euler',frame=f)
b.linear(cam)
checks=[]
for f in [1,24,48,72,96]:
    s.frame_set(f);bpy.context.view_layer.update();records=[]
    for rig in rigs:
        points=[world_to_camera_view(s,cam,o.matrix_world@Vector(v)) for o in rig.children_recursive if o.type=='MESH' for v in o.bound_box]
        records.append(dict(car=rig.name,x=[min(p.x for p in points),max(p.x for p in points)],y=[min(p.y for p in points),max(p.y for p in points)]))
    checks.append(dict(frame=f,cars=records))
assert all(.025<r['x'][0]<r['x'][1]<.975 and .025<r['y'][0]<r['y'][1]<.975 for c in checks for r in c['cars']),checks
report=dict(cars=KEYS,formation_width_m=13.8,lateral_center_spacing_m=2.9,speed_kmh=SPEED*3.6,frames=N,fps=FPS,background='Imported AC3D circuit, imported bleachers, imported gantry and scanned 3D trees; procedural sky. No photographic background or projection dome.',source_polymesh_count=source_count,imported_track_polygons=sum(len(o.data.polygons) for o in track),camera_bounds=checks)
(OUT/'scene-qa.json').write_text(json.dumps(report,indent=2),encoding='utf8')
s.frame_set(36);bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'ZEPHYRON_5_Cars_Track_3D.blend'),compress=True)
for f in [12,72]:
    s.frame_set(f);s.render.filepath=str(OUT/f'Five_Cars_Track_{f:03d}.png');bpy.ops.render.render(write_still=True);print('TRACK_PROOF',f,flush=True)
print('TRACK_SCENE_READY',flush=True)
