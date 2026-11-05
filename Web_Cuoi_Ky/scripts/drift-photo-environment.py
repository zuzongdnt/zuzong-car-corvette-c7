"""Photographic HDRI with a projected ground shell and a real Cycles shadow receiver."""
import bpy, math, sys
from pathlib import Path
from mathutils import Vector, Matrix

OUT=Path(__file__).resolve().parents[1]/'output/Drift_5_Xe_20261105'
ENV=OUT/'environment'

def apply_environment(scene, rotation=0, asset='zwartkops_straight_afternoon'):
    keep=set()
    for o in list(scene.objects):
        if ' | drift trajectory' in o.name:keep.update({o,*o.children_recursive})
    for o in list(scene.objects):
        if o in keep or o.type=='CAMERA' or o.name.startswith(('Rear tyre smoke','Rear tyre | progressive')):continue
        bpy.data.objects.remove(o,do_unlink=True)
    source=ENV/(asset+'_8k.hdr')
    if not source.exists():source=ENV/(asset+'_4k.hdr')
    image=bpy.data.images.load(str(source),check_existing=True)
    world=bpy.data.worlds.new('Photographed racetrack | Poly Haven');world.use_nodes=True;scene.world=world
    n=world.node_tree.nodes;l=world.node_tree.links;tex=n.new('ShaderNodeTexEnvironment');tex.image=image
    tex.texture_mapping.rotation[2]=-rotation
    l.new(tex.outputs['Color'],n.get('Background').inputs['Color']);n.get('Background').inputs['Strength'].default_value=1
    scene.frame_set(27);bpy.context.view_layer.update()
    rig=next(o for o in scene.objects if ' | drift trajectory' in o.name)
    center=rig.location.copy();center.z=1.6
    vertices=[];rays=[];faces=[];azimuths=256;elevations=128;radius=180;rot=Matrix.Rotation(rotation,4,'Z')
    for j in range(elevations+1):
        elevation=-math.pi/2+math.pi*j/elevations
        for i in range(azimuths):
            azimuth=math.tau*i/azimuths
            d=Vector((math.cos(elevation)*math.cos(azimuth),math.cos(elevation)*math.sin(azimuth),math.sin(elevation)))
            dist=min(radius,-center.z/d.z) if d.z<-.00001 else radius
            vertices.append(center+rot@d*dist);rays.append(d)
            if j:
                a=(j-1)*azimuths+i;b=(j-1)*azimuths+(i+1)%azimuths;c=j*azimuths+(i+1)%azimuths;dindex=j*azimuths+i
                faces.append((a,b,c,dindex))
    mesh=bpy.data.meshes.new('Projected photo dome and flattened photographic ground');mesh.from_pydata(vertices,[],faces);mesh.update()
    attribute=mesh.attributes.new('capture_direction','FLOAT_VECTOR','POINT')
    attribute.data.foreach_set('vector',[v for d in rays for v in d])
    dome=bpy.data.objects.new('Environment | projected racetrack photograph',mesh);scene.collection.objects.link(dome)
    for prop in ['visible_shadow','visible_diffuse','visible_glossy','visible_transmission','visible_volume_scatter']:setattr(dome,prop,False)
    mat=bpy.data.materials.new('Photographic environment | camera only');mat.use_nodes=True;n=mat.node_tree.nodes;l=mat.node_tree.links;n.clear()
    output=n.new('ShaderNodeOutputMaterial');emission=n.new('ShaderNodeEmission');tex=n.new('ShaderNodeTexEnvironment');tex.image=image;attr=n.new('ShaderNodeAttribute');attr.attribute_name='capture_direction'
    l.new(attr.outputs['Vector'],tex.inputs['Vector']);l.new(tex.outputs['Color'],emission.inputs['Color']);l.new(emission.outputs[0],output.inputs['Surface']);mesh.materials.append(mat)
    bpy.ops.mesh.primitive_plane_add(size=300,location=(0,0,.001));floor=bpy.context.object;floor.name='Environment | physical shadow receiver';floor.is_shadow_catcher=True
    mat=bpy.data.materials.new('Shadow receiver | asphalt');mat.use_nodes=True;p=mat.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(.13,.13,.13,1);p.inputs['Roughness'].default_value=.8;floor.data.materials.append(mat)
    # Two native render layers let the catcher darken the projected photo rather than replace it with the world.
    carcol=bpy.data.collections.new('RENDER | Cars and smoke');scene.collection.children.link(carcol)
    envcol=bpy.data.collections.new('RENDER | Photo environment');scene.collection.children.link(envcol)
    catchcol=bpy.data.collections.new('RENDER | Shadow receiver');scene.collection.children.link(catchcol)
    for o in list(scene.objects):
        if o.type=='CAMERA':continue
        destination=envcol if o==dome else catchcol if o==floor else carcol
        destination.objects.link(o)
        for col in list(o.users_collection):
            if col!=destination:col.objects.unlink(o)
    carlayer=scene.view_layers[0];carlayer.name='Car and contact shadow'
    carlayer.layer_collection.children[envcol.name].exclude=True
    envlayer=scene.view_layers.new('Photographic background')
    envlayer.layer_collection.children[envcol.name].exclude=False
    envlayer.layer_collection.children[carcol.name].exclude=True
    envlayer.layer_collection.children[catchcol.name].exclude=True
    tree=bpy.data.node_groups.new('Native photo and shadow composite','CompositorNodeTree')
    tree.interface.new_socket(name='Image',in_out='OUTPUT',socket_type='NodeSocketColor')
    scene.compositing_node_group=tree
    background=tree.nodes.new('CompositorNodeRLayers');background.scene=scene;background.layer=envlayer.name
    foreground=tree.nodes.new('CompositorNodeRLayers');foreground.scene=scene;foreground.layer=carlayer.name
    over=tree.nodes.new('CompositorNodeAlphaOver');over.inputs['Factor'].default_value=1
    output=tree.nodes.new('NodeGroupOutput')
    tree.links.new(background.outputs['Image'],over.inputs['Background']);tree.links.new(foreground.outputs['Image'],over.inputs['Foreground']);tree.links.new(over.outputs['Image'],output.inputs['Image'])
    background.location=(-400,160);foreground.location=(-400,-120);over.location=(-100,80);output.location=(150,80)
    scene.render.use_single_layer=False
    scene.render.use_compositing=True
    carlayer.use=True;envlayer.use=True
    print('LAYERS',[(v.name,v.use,[(c.name,c.exclude) for c in v.layer_collection.children]) for v in scene.view_layers],flush=True)
    scene.render.film_transparent=True;scene.view_settings.exposure=0;scene.camera.data.dof.use_dof=False
    return dome

if __name__=='__main__':
    args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
    key=next((a for a in args if a in ['corvette','bmw','porsche','mercedes','lamborghini','group']),'corvette')
    angle=float(args[args.index('--angle')+1]) if '--angle' in args else 0
    bpy.ops.wm.open_mainfile(filepath=str(OUT/f'{key}_Drift_Test.blend'),load_ui=False,use_scripts=False)
    s=bpy.context.scene;apply_environment(s,math.radians(angle))
    prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='OPTIX';prefs.get_devices()
    for d in prefs.devices:d.use=d.type=='OPTIX'
    s.cycles.device='GPU';s.cycles.samples=64;s.cycles.adaptive_threshold=.025
    s.frame_set(27);s.render.use_motion_blur=False;s.render.filepath=str(OUT/f'{key}_racetrack_{int(angle):03d}.png');bpy.ops.render.render(write_still=True)
    if '--save' in args:
        bpy.ops.file.pack_all();bpy.context.preferences.filepaths.save_version=0
        s.render.use_motion_blur=True;s.cycles.samples=32;s.cycles.adaptive_threshold=.045
        bpy.ops.wm.save_as_mainfile(filepath=str(OUT/f'{key}_Racetrack_Drift.blend'),compress=True)
    print('PHOTO_ENVIRONMENT_READY',key,angle,flush=True)
