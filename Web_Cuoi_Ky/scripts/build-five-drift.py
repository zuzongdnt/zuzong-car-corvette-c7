"""Build editable Cycles drift previews from the five existing high-detail cars."""
import bpy, bmesh, math, json, random, sys, time
from pathlib import Path
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/Drift_5_Xe_20261105'
SOURCES = Path('E:/tkdhfigma/outputs/Studio360_Gray_TCHQ_20261102/Blender')
KEYS = ['corvette', 'bmw', 'porsche', 'mercedes', 'lamborghini']
COLORS = {'corvette':'#181b20', 'bmw':'#164780', 'porsche':'#d5d6d1', 'mercedes':'#851221', 'lamborghini':'#90979b'}
N, FPS = 60, 24
ARGS = sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
KEY = next((a for a in ARGS if a in KEYS), 'corvette')
OUT.mkdir(parents=True, exist_ok=True)
random.seed(243880)

def srgb(h):
    values = [int(h[i:i+2],16)/255 for i in (1,3,5)]
    return tuple(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in values)+(1,)

def setv(m, p, name, value):
    if name not in p.inputs: return
    for link in list(p.inputs[name].links): m.node_tree.links.remove(link)
    p.inputs[name].default_value = value

def material(name, color, rough=.5, metallic=0):
    m=bpy.data.materials.new(name);m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metallic
    return m

def empty(name, parent=None, loc=(0,0,0)):
    o=bpy.data.objects.new(name,None);bpy.context.scene.collection.objects.link(o)
    o.parent=parent;o.location=loc;return o

def curves(o):
    if not o.animation_data or not o.animation_data.action:return []
    a=o.animation_data.action
    return [fc for layer in a.layers for strip in layer.strips for bag in strip.channelbags for fc in bag.fcurves]

def linear(o):
    for fc in curves(o):
        for kp in fc.keyframe_points:kp.interpolation='LINEAR'

def bounds(o):
    pts=[o.matrix_world@Vector(p) for p in o.bound_box]
    lo=Vector(tuple(min(p[i] for p in pts) for i in range(3)))
    hi=Vector(tuple(max(p[i] for p in pts) for i in range(3)))
    return lo,hi

def split_quadrants(o):
    # Source BMW/Lamborghini combine both sides in a single mesh; split without losing UVs.
    coords=[v.co for v in o.data.vertices]
    quadrants={(v.x<0,v.y<0) for v in coords}
    result=[]
    for front,left in sorted(quadrants):
        copy=o.copy();copy.data=o.data.copy();bpy.context.scene.collection.objects.link(copy)
        bm=bmesh.new();bm.from_mesh(copy.data)
        remove=[v for v in bm.verts if (v.co.x<0)!=front or (v.co.y<0)!=left]
        bmesh.ops.delete(bm,geom=remove,context='VERTS');bm.to_mesh(copy.data);bm.free();copy.data.update()
        if len(copy.data.polygons):
            copy.name=o.name+' | '+('F' if front else 'R')+('L' if left else 'R');result.append(copy)
        else:bpy.data.objects.remove(copy,do_unlink=True)
    bpy.data.objects.remove(o,do_unlink=True)
    return result

def load_car(key):
    bpy.ops.wm.open_mainfile(filepath=str(SOURCES/f'{key}_Gray_TCHQ_360.blend'),load_ui=False,use_scripts=False)
    s=bpy.context.scene;s.frame_set(1);bpy.context.view_layer.update()
    source=list(bpy.data.collections['CAR | '+key.upper()].all_objects)
    old_objects=list(bpy.data.objects)
    dg=bpy.context.evaluated_depsgraph_get();copies=[]
    for o in source:
        if o.hide_render or o.type not in {'MESH','FONT'}:continue
        evaluated=o.evaluated_get(dg)
        mesh=bpy.data.meshes.new_from_object(evaluated,preserve_all_data_layers=True,depsgraph=dg)
        mesh.transform(o.matrix_world)
        copy=bpy.data.objects.new(o.name+' | drift',mesh);copies.append(copy)
    for o in old_objects:bpy.data.objects.remove(o,do_unlink=True)
    for o in copies:s.collection.objects.link(o)
    bpy.context.view_layer.update()
    lows,highs=zip(*(bounds(o) for o in copies))
    center=Vector(((min(v.x for v in lows)+max(v.x for v in highs))/2,(min(v.y for v in lows)+max(v.y for v in highs))/2,min(v.z for v in lows)))
    for o in copies:o.data.transform(Matrix.Translation(-center));o.data.update()
    bpy.context.view_layer.update()
    wheel_objects=[];stationary=[]
    for o in list(copies):
        name=o.name.lower();mats=' '.join(m.name.lower() for m in o.data.materials if m)
        wheel=(key=='corvette' and any(t in name for t in ['tire ','rim ','brake disc ','brake caliper ']))
        wheel|=(key=='bmw' and any(t in name for t in ['model_22.','model_21.','model_24.','model_3.00']))
        wheel|=(key=='porsche' and ('_wheel.' in name or '_brake.' in name))
        wheel|=(key=='mercedes' and (name.startswith('sl63_wheel') or name.startswith('object_4.') or 'amdb11_brake' in name))
        wheel|=(key=='lamborghini' and any(f'.{n} ' in name for n in [239,240,249,250,251,253,254,255]))
        if wheel:
            parts=split_quadrants(o) if key in {'bmw','lamborghini'} else [o]
            wheel_objects.extend(parts)
        else:stationary.append(o)
    rig=empty(key.upper()+' | drift trajectory');body=empty('Suspension | sprung body',rig)
    for o in stationary:o.parent=body
    bpy.context.view_layer.update()
    pivots={};wheel_info=[]
    for front in [True,False]:
        for left in [True,False]:
            parts=[]
            for o in wheel_objects:
                lo,hi=bounds(o);c=(lo+hi)/2
                if (c.x<0)==front and (c.y<0)==left:parts.append(o)
            assert parts,(key,front,left)
            tyre=next((o for o in parts if any(t in ' '.join(m.name.lower() for m in o.data.materials if m) for t in ['tire','lop p','scene_-_root','wheel1a'])),None)
            if tyre is None:tyre=max(parts,key=lambda o:bounds(o)[1].z-bounds(o)[0].z)
            lo,hi=bounds(tyre);pivot=(lo+hi)/2
            radius=(hi.z-lo.z)/2
            if key=='porsche':
                rubber=material('GT3 | dry rubber sidewall and tread',(.009,.011,.013),.85)
                rubber.node_tree.nodes.get('Principled BSDF').inputs['Specular IOR Level'].default_value=.3
                tyre.data.materials.append(rubber)
                for face in tyre.data.polygons:
                    if math.hypot(face.center.x-pivot.x,face.center.z-pivot.z)>radius*.79:face.material_index=len(tyre.data.materials)-1
            steer=empty(('F' if front else 'R')+('L' if left else 'R')+' | steering knuckle',rig,pivot)
            spin=empty('Wheel spin | '+steer.name,steer)
            for o in parts:
                caliper=any(t in (o.name+' '+' '.join(m.name for m in o.data.materials if m)).lower() for t in ['caliper','cum phanh','_brake.']) and 'brake disc' not in o.name.lower()
                o.parent=steer if caliper else spin;o.location=-pivot
            pivots[(front,left)]=(steer,spin,pivot,radius)
            wheel_info.append(dict(front=front,left=left,pivot=list(pivot),radius=radius,parts=[o.name for o in parts]))
    tune_materials(key,stationary+wheel_objects)
    add_driver(body,key)
    return s,rig,body,pivots,wheel_info

def tune_materials(key,objects):
    mats={m for o in objects if o.name in bpy.data.objects for m in o.data.materials if m}
    paint_tokens={'corvette':['Car Paint'],'bmw':['BMW | Son Black Sapphire'],'porsche':['Obsidian Black |'],'mercedes':['SL63_paint'],'lamborghini':['The-Best-CarPiant']}
    records=[]
    for m in mats:
        if not m.use_nodes:continue
        p=next((n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED'),None)
        if not p:continue
        n=m.name.lower()
        if any(t in m.name for t in paint_tokens[key]):
            for k,v in [('Base Color',srgb(COLORS[key])),('Metallic',.52 if key!='porsche' else .24),('Roughness',.23),('Coat Weight',1),('Coat Roughness',.07),('Coat IOR',1.46)]:setv(m,p,k,v)
        window=any(t in n for t in ['windows','window_material','kinh o to','tinted-glass'])
        cover=(key=='corvette' and m.name in ['Headlight Cover','Main Headlight Lens']) or (key=='bmw' and 'kinh material.016' in n) or (key=='mercedes' and 'tinted-glass.003' in n) or (key=='lamborghini' and m.name=='Headlight')
        if cover or window:
            color=(.96,.98,1,1) if cover else (.22,.28,.32,1)
            for k,v in [('Base Color',color),('Alpha',1),('Metallic',0),('Transmission Weight',1),('Roughness',.018 if cover else .035),('IOR',1.49),('Coat Weight',0),('Emission Strength',0)]:setv(m,p,k,v)
            records.append(dict(material=m.name,role='clear lamp lens' if cover else 'glazing',ior=1.49,roughness=.018 if cover else .035))
        led=(key=='corvette' and m.name=='Daylight Cover') or (key=='bmw' and 'led daylight' in n) or (key=='mercedes' and 'runninglight-f' in n) or (key=='lamborghini' and m.name=='White')
        if led:
            for k,v in [('Base Color',(.72,.79,.86,1)),('Roughness',.16),('Metallic',0),('Transmission Weight',0),('Emission Color',(.86,.93,1,1)),('Emission Strength',3.5)]:setv(m,p,k,v)
            records.append(dict(material=m.name,role='separate LED',emission=3.5))
        if key=='corvette' and m.name=='Chrome':setv(m,p,'Roughness',.16)
        if any(t in n for t in ['tire','lop p zero','rough-rubber']):
            setv(m,p,'Metallic',0);setv(m,p,'Roughness',.78);setv(m,p,'Coat Weight',0)
        if 'leather' in n or 'velour' in n:
            setv(m,p,'Metallic',0);setv(m,p,'Roughness',.65);setv(m,p,'Coat Weight',0)
    if key=='porsche':
        # The original GT3 lamp is an opaque atlas; retain its optical details beneath a thin clear skin.
        for o in list(objects):
            if 'Kit0_Light_Geo' not in o.name:continue
            original=o.data.materials[0];m=original.copy();m.name='GT3 | optical reflector under clear lens';o.data.materials[0]=m
            p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
            setv(m,p,'Roughness',.16);setv(m,p,'Metallic',.45)
            tex=next((n for n in m.node_tree.nodes if n.type=='TEX_IMAGE' and n.image and n.image.colorspace_settings.name=='sRGB'),None)
            if tex:
                rgb=m.node_tree.nodes.new('ShaderNodeRGBToBW');ramp=m.node_tree.nodes.new('ShaderNodeValToRGB')
                ramp.color_ramp.elements[0].position=.7;ramp.color_ramp.elements[1].position=.9
                m.node_tree.links.new(tex.outputs['Color'],rgb.inputs[0]);m.node_tree.links.new(rgb.outputs[0],ramp.inputs[0]);m.node_tree.links.new(ramp.outputs['Color'],p.inputs['Emission Color']);setv(m,p,'Emission Strength',1.2)
            lens=o.copy();lens.data=o.data.copy();bpy.context.scene.collection.objects.link(lens);lens.name='GT3 | clear headlamp skin'
            bm=bmesh.new();bm.from_mesh(lens.data);bmesh.ops.delete(bm,geom=[v for v in bm.verts if v.co.x>-1.55],context='VERTS');bm.to_mesh(lens.data);bm.free()
            glass=material('GT3 | clear optical cover',(.97,.98,1),.025);gp=glass.node_tree.nodes.get('Principled BSDF');gp.inputs['Transmission Weight'].default_value=1;gp.inputs['IOR'].default_value=1.49
            lens.data.materials.clear();lens.data.materials.append(glass)
            for v in lens.data.vertices:v.co+=v.normal*.002
            solid=lens.modifiers.new('1.2 mm clear lens shell','SOLIDIFY');solid.thickness=.0012
            records.append(dict(material=glass.name,role='clear lamp skin',ior=1.49))
    (OUT/f'{key}-lamp-materials.json').write_text(json.dumps(records,indent=2),encoding='utf8')

def uv_sphere(name,loc,scale,mat,parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=20,ring_count=12,location=loc)
    o=bpy.context.object;o.name=name;o.scale=scale;o.data.materials.append(mat)
    for p in o.data.polygons:p.use_smooth=True
    if parent:o.parent=parent
    return o

def add_driver(body,key):
    suit=material('Driver | charcoal race suit',(.012,.014,.017),.85)
    helmet=material('Driver | graphite helmet',(.025,.029,.034),.23)
    uv_sphere('Driver | seated torso',(.1,-.36,.72),(.2,.18,.29),suit,body)
    uv_sphere('Driver | helmet',(-.05,-.36,1.02),(.145,.13,.17),helmet,body)
    visor=material('Driver | dark reflective visor',(.003,.006,.008),.12,.3)
    uv_sphere('Driver | helmet visor',(-.174,-.36,1.045),(.035,.118,.067),visor,body)
    for y in [-.52,-.22]:uv_sphere('Driver | forearm',(-.27,y,.82),(.23,.055,.065),suit,body)

def box(name,loc,scale,mat,bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat)
    if bevel:mod=o.modifiers.new('Construction bevel','BEVEL');mod.width=bevel;mod.segments=3
    return o

def stage(s):
    concrete=material('Track | mineral concrete',(.14,.15,.155),.79)
    n=concrete.node_tree.nodes;l=concrete.node_tree.links;p=n.get('Principled BSDF')
    coord=n.new('ShaderNodeTexCoord');noise=n.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=95;noise.inputs['Detail'].default_value=2.8
    l.new(coord.outputs['Object'],noise.inputs['Vector']);bump=n.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.28;bump.inputs['Distance'].default_value=.0018;l.new(noise.outputs['Fac'],bump.inputs['Height']);l.new(bump.outputs['Normal'],p.inputs['Normal'])
    mottling=n.new('ShaderNodeTexNoise');mottling.inputs['Scale'].default_value=.35;mottling.inputs['Detail'].default_value=4;l.new(coord.outputs['Object'],mottling.inputs['Vector'])
    tones=n.new('ShaderNodeValToRGB');tones.color_ramp.elements[0].color=(.10,.108,.11,1);tones.color_ramp.elements[1].color=(.18,.185,.19,1);l.new(mottling.outputs['Fac'],tones.inputs[0]);l.new(tones.outputs['Color'],p.inputs['Base Color'])
    maps=ROOT.parent/'tmp/blender-rain-preview/city-assets'
    vector=n.new('ShaderNodeVectorMath');vector.operation='SCALE';vector.inputs[3].default_value=.32;l.new(coord.outputs['Object'],vector.inputs[0])
    for filename,socket,noncolor in [('asphalt_02_Diffuse_2k.jpg','Base Color',False),('asphalt_02_Rough_2k.jpg','Roughness',True)]:
        image=bpy.data.images.load(str(maps/filename));image.colorspace_settings.name='Non-Color' if noncolor else 'sRGB'
        tex=n.new('ShaderNodeTexImage');tex.image=image;l.new(vector.outputs['Vector'],tex.inputs['Vector']);l.new(tex.outputs['Color'],p.inputs[socket])
    image=bpy.data.images.load(str(maps/'asphalt_02_nor_gl_2k.jpg'));image.colorspace_settings.name='Non-Color'
    tex=n.new('ShaderNodeTexImage');tex.image=image;l.new(vector.outputs['Vector'],tex.inputs['Vector']);normal=n.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.4;l.new(tex.outputs['Color'],normal.inputs['Color']);l.new(normal.outputs['Normal'],p.inputs['Normal'])
    concrete.name='Track | dry asphalt / Poly Haven 2K photogrammetry'
    box('Test track | concrete slab',(0,0,-.18),(180,180,.35),concrete,.025)
    wall=material('Track | cast concrete wall',(.25,.26,.26),.87)
    joint=material('Track | expansion joints',(.08,.084,.087),.95)
    for x in range(-80,81,12):box('Track | expansion joint',(x,0,-.003),(.018,160,.009),joint)
    for y in range(-72,73,12):box('Track | expansion joint',(0,y,-.003),(160,.018,.009),joint)
    for x in range(-70,71,5):box('Background | concrete safety barrier',(x,24,.6),(4.98,.5,1.2),wall,.025)
    steel=material('Track | brushed steel',(.28,.3,.32),.31,.8)
    for x in [-40,-15,10,35,60]:
        box('Track | light pole',(x,25,5),(.13,.13,10),steel,.025)
        box('Track | lamp fitting',(x,24.8,10),(1,.5,.12),steel,.025)
    # Low distant berms avoid a featureless studio horizon.
    hills=material('Distance | muted hills',(.08,.1,.09),.95)
    for i in range(15):
        uv_sphere('Distant landscape',(-100+i*17,90,random.uniform(-8,-3)),(random.uniform(15,25),18,random.uniform(10,17)),hills)
    world=bpy.data.worlds.new('Late afternoon | soft physical sky');world.use_nodes=True;s.world=world
    sky=world.node_tree.nodes.new('ShaderNodeTexSky');sky.sky_type='SINGLE_SCATTERING';sky.sun_elevation=math.radians(16);sky.sun_rotation=math.radians(130);sky.sun_size=math.radians(2.5);sky.air_density=1.1
    world.node_tree.links.new(sky.outputs['Color'],world.node_tree.nodes['Background'].inputs['Color']);world.node_tree.nodes['Background'].inputs['Strength'].default_value=.26
    d=bpy.data.lights.new('Sky | broad reflected light','AREA');d.energy=1600;d.shape='RECTANGLE';d.size=18;d.size_y=10
    o=bpy.data.objects.new(d.name,d);s.collection.objects.link(o);o.location=(-8,-6,10);o.rotation_euler=(Vector((0,0,1))-o.location).to_track_quat('-Z','Y').to_euler()

def state_at(t):
    # Constant-radius forward arc with progressive slip and a damped exit correction.
    theta=1.85-.84*t;radius=17.5
    pos=Vector((radius*math.cos(theta),radius*math.sin(theta)-16,0))
    tangent=theta-math.pi/2
    slip=math.radians(8+20*math.sin(math.pi*max(0,min(1,t)))**.8)
    yaw=tangent+math.pi+slip
    return pos,yaw,slip

def animate(rig,body,pivots,s):
    report=[]
    for f in range(-1,N+3):
        t=(f-1)/(N-1);pos,yaw,slip=state_at(t)
        rig.location=pos;rig.rotation_euler.z=yaw;rig.keyframe_insert('location',frame=f);rig.keyframe_insert('rotation_euler',frame=f)
        body.rotation_euler.x=math.radians(-.75)*math.sin(math.pi*max(0,min(1,t)))
        body.rotation_euler.y=math.radians(.22)*math.sin(math.tau*t)
        body.location.z=.003*math.sin(t*math.tau*2);body.keyframe_insert('rotation_euler',frame=f);body.keyframe_insert('location',frame=f)
        distance=17.5*.84*t
        for (front,left),(steer,spin,pivot,radius) in pivots.items():
            steer.rotation_euler.z= -slip*.78 if front else 0;steer.keyframe_insert('rotation_euler',frame=f)
            spin.rotation_euler.y=-distance/radius*(math.cos(slip) if front else 1.27);spin.keyframe_insert('rotation_euler',frame=f)
        if 1<=f<=N:report.append(dict(frame=f,position=list(pos),yaw=yaw,slip_deg=math.degrees(slip),front_countersteer_deg=-math.degrees(slip)*.78,speed_m_s=17.5*.84/((N-1)/FPS)))
    for o in [rig,body,*[item for p in pivots.values() for item in p[:2]]]:linear(o)
    return report

def trails(s,pivots):
    smoke=bpy.data.materials.new('Tyre smoke | expanding turbulent volume');smoke.use_nodes=True
    n=smoke.node_tree.nodes;l=smoke.node_tree.links;n.clear();out=n.new('ShaderNodeOutputMaterial');volume=n.new('ShaderNodeVolumePrincipled')
    volume.inputs['Color'].default_value=(.72,.75,.78,1);volume.inputs['Anisotropy'].default_value=.2
    coord=n.new('ShaderNodeTexCoord');sub=n.new('ShaderNodeVectorMath');sub.operation='SUBTRACT';sub.inputs[1].default_value=(.5,.5,.5);l.new(coord.outputs['Generated'],sub.inputs[0]);length=n.new('ShaderNodeVectorMath');length.operation='LENGTH';l.new(sub.outputs[0],length.inputs[0]);edge=n.new('ShaderNodeMapRange');edge.inputs['From Min'].default_value=.2;edge.inputs['From Max'].default_value=.52;edge.inputs['To Min'].default_value=1;edge.inputs['To Max'].default_value=0;edge.clamp=True;l.new(length.outputs['Value'],edge.inputs['Value'])
    noise=n.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=4.2;noise.inputs['Detail'].default_value=3;l.new(coord.outputs['Generated'],noise.inputs['Vector']);mul=n.new('ShaderNodeMath');mul.operation='MULTIPLY';l.new(edge.outputs['Result'],mul.inputs[0]);l.new(noise.outputs['Fac'],mul.inputs[1]);gain=n.new('ShaderNodeMath');gain.operation='MULTIPLY';gain.inputs[1].default_value=.18;l.new(mul.outputs[0],gain.inputs[0]);l.new(gain.outputs[0],volume.inputs['Density']);l.new(volume.outputs['Volume'],out.inputs['Volume'])
    mark=material('Tyre marks | deposited rubber',(.065,.065,.063),.94)
    for left in [True,False]:
        pivot=pivots[(False,left)][2]
        centers=[]
        for birth in range(-9,N,3):
            pos,yaw,slip=state_at((birth-1)/(N-1));rot=Matrix.Rotation(yaw,4,'Z');origin=pos+rot@Vector((pivot.x,pivot.y,.08))
            o=uv_sphere('Rear tyre smoke | '+str(birth)+str(left),origin,(.03,.03,.03),smoke)
            for f,age in [(birth-.5,0),(birth,0),(birth+12,.5),(birth+30,1)]:
                o.location=origin+Vector((age*.8,age*.7,age*.55));size=.06+age*1.1
                o.scale=(size*1.5,size*.8,size*.7);o.keyframe_insert('location',frame=f);o.keyframe_insert('scale',frame=f)
            o.hide_render=True;o.keyframe_insert('hide_render',frame=birth-1);o.hide_render=False;o.keyframe_insert('hide_render',frame=birth);o.hide_render=True;o.keyframe_insert('hide_render',frame=birth+31)
            linear(o)
        for f in range(1,N+1):
            pos,yaw,_=state_at((f-1)/(N-1));centers.append(pos+Matrix.Rotation(yaw,4,'Z')@Vector((pivot.x,pivot.y,.006)))
        verts=[];faces=[]
        for i,c in enumerate(centers):
            direction=centers[min(i+1,N-1)]-centers[max(i-1,0)];normal=Vector((-direction.y,direction.x,0)).normalized()*.105
            verts.extend([c-normal,c+normal])
            if i:faces.append((2*i-2,2*i-1,2*i+1,2*i))
        mesh=bpy.data.meshes.new('Rubber trace ribbon');mesh.from_pydata(verts,[],faces);mesh.materials.append(mark);o=bpy.data.objects.new('Rear tyre | progressive skid mark',mesh);s.collection.objects.link(o)
        build=o.modifiers.new('Rubber appears only after the tyre passes','BUILD');build.frame_start=1;build.frame_duration=N-1

def camera(s,rig,wide=False):
    data=bpy.data.cameras.new('Tracking lens | 48mm');cam=bpy.data.objects.new(data.name,data);s.collection.objects.link(cam);s.camera=cam
    data.lens=48;data.clip_end=500;data.dof.use_dof=True;focus=empty('Focus | front cabin',rig,(-.45,0,.68));data.dof.focus_object=focus;data.dof.aperture_fstop=7.1
    for f in range(-1,N+3):
        t=(f-1)/(N-1);pos,yaw,_=state_at(t)
        # Track path direction, keeping the world fixed so the drift is visible.
        direction=Matrix.Rotation(yaw-math.radians(39+7*math.sin(t*math.pi)),4,'Z')@Vector((-1,0,0))
        cam.location=pos+direction*9.2+Vector((0,0,1.2))
        target=pos+Vector((0,0,.62));cam.rotation_euler=(target-cam.location).to_track_quat('-Z','Y').to_euler()
        cam.keyframe_insert('location',frame=f);cam.keyframe_insert('rotation_euler',frame=f)
    linear(cam);return cam

def render_settings(s):
    s.render.engine='CYCLES';prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='OPTIX';prefs.get_devices()
    for d in prefs.devices:d.use=d.type=='OPTIX'
    s.cycles.device='GPU';s.cycles.samples=32;s.cycles.use_denoising=True;s.cycles.denoiser='OPTIX';s.cycles.denoising_use_gpu=True;s.cycles.use_adaptive_sampling=True;s.cycles.adaptive_threshold=.045
    s.cycles.max_bounces=9;s.cycles.diffuse_bounces=2;s.cycles.glossy_bounces=4;s.cycles.transmission_bounces=7;s.cycles.transparent_max_bounces=12;s.cycles.volume_bounces=1;s.cycles.volume_step_rate=3;s.cycles.sample_clamp_indirect=5
    s.render.resolution_x=1280;s.render.resolution_y=720;s.render.resolution_percentage=100;s.render.fps=FPS;s.frame_start=1;s.frame_end=N
    s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGB';s.render.image_settings.compression=15;s.render.film_transparent=False;s.render.use_motion_blur=True;s.render.motion_blur_shutter=.3;s.render.use_persistent_data=True
    s.view_settings.view_transform='AgX';s.view_settings.look='AgX - Medium High Contrast';s.view_settings.exposure=0
    if hasattr(s,'compositing_node_group'):s.compositing_node_group=None
    bpy.context.preferences.filepaths.save_version=0

def main():
    s,rig,body,pivots,info=load_car(KEY)
    stage(s);motion=animate(rig,body,pivots,s);trails(s,pivots);cam=camera(s,rig);render_settings(s)
    s.frame_set(27);bpy.context.view_layer.update()
    source_meshes=[o for o in rig.children_recursive if o.type=='MESH']
    clipping=[]
    for frame in [1,15,30,45,60]:
        s.frame_set(frame);bpy.context.view_layer.update()
        points=[world_to_camera_view(s,cam,o.matrix_world@Vector(v)) for o in source_meshes for v in o.bound_box]
        clipping.append(dict(frame=frame,x=[min(v.x for v in points),max(v.x for v in points)],y=[min(v.y for v in points),max(v.y for v in points)]))
    assert all(v['x'][0]>.025 and v['x'][1]<.975 and v['y'][0]>.025 and v['y'][1]<.975 for v in clipping),clipping
    report=dict(car=KEY,source=str(SOURCES/f'{KEY}_Gray_TCHQ_360.blend'),wheels=info,motion=motion,frame_bounds=clipping,animation='Kinematic drift rig with continuous forward velocity, slip, countersteer, rear overspeed and suspended body; no vehicle dynamics solver.',smoke='Procedural expanding rear-tyre volumes; not a fluid bake.')
    (OUT/f'{KEY}-rig-qa.json').write_text(json.dumps(report,indent=2),encoding='utf8')
    s.frame_set(27);bpy.ops.file.pack_all();bpy.ops.wm.save_as_mainfile(filepath=str(OUT/f'{KEY}_Drift_Test.blend'),compress=True)
    print('BUILT',KEY,flush=True)
    if '--proof' in ARGS:
        s.render.filepath=str(OUT/f'{KEY}_proof.png');bpy.ops.render.render(write_still=True)
        print('PROOF',KEY,flush=True)

if __name__=='__main__':main()
