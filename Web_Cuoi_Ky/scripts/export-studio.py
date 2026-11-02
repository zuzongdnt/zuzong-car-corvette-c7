import bpy, json, math, sys
from pathlib import Path
from mathutils import Vector, Matrix

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/model/studio'
OUT.mkdir(parents=True, exist_ok=True)
KEYS = sys.argv[1:] or ['bmw', 'corvette', 'porsche', 'mercedes', 'lamborghini']
PAINT = {'bmw': ['BMW | Son Black Sapphire'], 'corvette': ['Car Paint'], 'porsche': ['Obsidian Black |'], 'mercedes': ['SL63_paint'], 'lamborghini': ['The-Best-CarPiant']}
RIMS = {'bmw': ['WEB_RIM'], 'corvette': ['Rim'], 'porsche': ['_Wheel1A_'], 'mercedes': ['WEB_RIM'], 'lamborghini': ['WEB_RIM']}
BRAKES = {'bmw': ['BMW | Cum phanh'], 'corvette': ['Brake Caliper'], 'porsche': ['_Callipers'], 'mercedes': ['amdb11_caliper'], 'lamborghini': ['WEB_CALIPER']}

def linear(v):
    return v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4

def configure(material, color, metal, rough):
    bs = next((n for n in material.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if not bs:
        return
    for name in ['Base Color', 'Metallic', 'Roughness']:
        for link in list(bs.inputs[name].links):
            material.node_tree.links.remove(link)
    rgba = tuple(linear(int(color[i:i+2], 16) / 255) for i in (1, 3, 5)) + (1,)
    bs.inputs['Base Color'].default_value = rgba
    bs.inputs['Metallic'].default_value = metal
    bs.inputs['Roughness'].default_value = rough
    bs.inputs['Coat Weight'].default_value = .5
    material.diffuse_color = rgba

for key in KEYS:
    bpy.ops.wm.open_mainfile(filepath=f'E:/tkdhfigma/outputs/Studio360_Gray_TCHQ_20261102/Blender/{key}_Gray_TCHQ_360.blend', load_ui=False, use_scripts=False)
    bpy.context.scene.frame_set(1)
    col = bpy.data.collections['CAR | ' + key.upper()]
    objects = [o for o in col.all_objects if o.type in {'MESH', 'FONT'} and not o.hide_render]
    copies = {}
    for o in objects:
        target = None
        if key == 'bmw' and o.name in ['model_3.002', 'model_3.003']:
            target = 'WEB_RIM'
        if key == 'mercedes' and o.name.startswith('SL63_wheel'):
            target = 'WEB_RIM'
        if key == 'lamborghini':
            suffix = o.name.rsplit('.', 1)[-1]
            if suffix in ['249', '253']: target = 'WEB_RIM'
        if target:
            for slot in o.material_slots:
                if not slot.material: continue
                token = (target, slot.material.name)
                if token not in copies:
                    copies[token] = slot.material.copy()
                    copies[token].name = target + ' | ' + slot.material.name
                slot.material = copies[token]
    if key == 'lamborghini':
        # The source has brake discs without caliper meshes. Add four rounded caliper bodies.
        caliper = bpy.data.materials.new('WEB_CALIPER | four physical brake calipers')
        caliper.use_nodes = True
        for x, z in [(-1.325, .368), (1.577, .397)]:
            for side in [-1, 1]:
                bpy.ops.mesh.primitive_cube_add(size=1, location=(x+.15, side*.97, z))
                obj = bpy.context.object
                obj.name = f'WEB | brake caliper {x} {side}'
                obj.dimensions = (.105, .12, .245)
                bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
                bevel = obj.modifiers.new('Rounded forged caliper', 'BEVEL')
                bevel.width, bevel.segments = .024, 4
                obj.data.materials.append(caliper)
                objects.append(obj)
        for m in bpy.data.materials:
            if m.name == 'Smooth Metal': configure(m, '#454a50', .7, .35)
    if key == 'porsche':
        tire = bpy.data.materials.new('WEB | fixed rubber tire')
        tire.use_nodes = True
        configure(tire, '#17191b', .0, .88)
        for o in objects:
            if o.type != 'MESH' or 'wheel.00' not in o.name.lower(): continue
            points = [o.matrix_world @ Vector(p) for p in o.bound_box]
            cx = (min(p.x for p in points) + max(p.x for p in points)) / 2
            cz = (min(p.z for p in points) + max(p.z for p in points)) / 2
            radius = (max(p.z for p in points) - min(p.z for p in points)) / 2
            o.data = o.data.copy()
            o.data.materials.append(tire)
            for poly in o.data.polygons:
                center = o.matrix_world @ poly.center
                if math.hypot(center.x-cx, center.z-cz) > radius * .79:
                    poly.material_index = len(o.data.materials) - 1
        for m in bpy.data.materials:
            if 'Window_Material' not in m.name: continue
            m.use_nodes = True
            m.node_tree.nodes.clear()
            bs = m.node_tree.nodes.new('ShaderNodeBsdfPrincipled')
            output = m.node_tree.nodes.new('ShaderNodeOutputMaterial')
            m.node_tree.links.new(bs.outputs['BSDF'],output.inputs['Surface'])
            configure(m, '#283440', .15, .16)
            bs = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
            if bs:
                for link in list(bs.inputs['Alpha'].links): m.node_tree.links.remove(link)
                bs.inputs['Alpha'].default_value = .72
                m.surface_render_method = 'DITHERED'
    for o in objects:
        world = o.matrix_world.copy()
        if key == 'lamborghini' and o.name.endswith(('.170', '.208')):
            # Source headrest inserts intersect the seat shell; separate the layers by six millimetres.
            world.translation.x -= .006
        if key == 'lamborghini' and o.name.endswith(('.165', '.166')):
            world.translation.x -= .0085
        o.animation_data_clear()
        o.parent = None
        o.matrix_world = world
        o.hide_set(False)
        o.hide_viewport = False
    bpy.context.view_layer.update()
    points = [o.matrix_world @ Vector(p) for o in objects for p in o.bound_box]
    lo = Vector(tuple(min(p[i] for p in points) for i in range(3)))
    hi = Vector(tuple(max(p[i] for p in points) for i in range(3)))
    center = Vector(((lo.x + hi.x) / 2, (lo.y + hi.y) / 2, lo.z))
    # All studio assets share a ground origin, metre scale, and no scene animation.
    for o in objects:
        o.location -= center
    mats = {s.material for o in objects for s in o.material_slots if s.material}
    groups = {'body': [], 'rims': [], 'calipers': []}
    for material in mats:
        name = material.name
        group = 'body' if any(name.startswith(t) for t in PAINT[key]) else 'rims' if any(t in name for t in RIMS[key]) else 'calipers' if any((name == t if t == 'red' else t in name) for t in BRAKES[key]) else None
        if group:
            material.name = f'ZUZONG_{group} | {name}'
            groups[group].append(material.name)
            configure(material, '#111216' if group == 'body' else '#aeb3bb' if group == 'rims' else '#cc1826', .55 if group == 'body' else .8 if group == 'rims' else .35, .27 if group == 'body' else .3)
    assert all(groups.values()), (key, groups)
    for image in bpy.data.images:
        if image.type == 'IMAGE' and image.size[0] and max(image.size) > 1024:
            ratio = 1024 / max(image.size)
            image.scale(max(1, int(image.size[0] * ratio)), max(1, int(image.size[1] * ratio)))
    bpy.ops.object.select_all(action='DESELECT')
    for o in objects:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.convert(target='MESH')
    objects = list(bpy.context.selected_objects)
    # Reduce only very dense surfaces; small badges, glass and calipers retain their geometry.
    for o in objects:
        painted = any(slot.material and slot.material.name.startswith('ZUZONG_body |') for slot in o.material_slots)
        if not painted and len(o.data.polygons) > (10000 if key == 'bmw' else 50000):
            mod = o.modifiers.new('Web geometry budget', 'DECIMATE')
            mod.ratio = min(1, (20000 if key == 'bmw' else 65000) / len(o.data.polygons))
            bpy.context.view_layer.objects.active = o
            bpy.ops.object.modifier_apply(modifier=mod.name)
    path = OUT / f'{key}.glb'
    bpy.ops.export_scene.gltf(filepath=str(path), export_format='GLB', use_selection=True, export_animations=False, export_cameras=False, export_lights=False, export_apply=True, export_image_format='AUTO', export_texcoords=True)
    report = {'key': key, 'groups': groups, 'sourceBounds': [list(lo), list(hi)], 'bytes': path.stat().st_size, 'polygons': sum(len(o.data.polygons) for o in objects)}
    (OUT / f'{key}.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    sys.path.insert(0, str(ROOT / 'scripts'))
    from polish_studio_models import finish_model
    finish_model(key)
    print('STUDIO_EXPORTED', key, path.stat().st_size, flush=True)
