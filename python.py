import bpy
import math
import os
import random
from mathutils import Vector, Euler

# ==============================================================================
# 1. CONFIGURATION & DIRECTORY SETUP
# ==============================================================================
OUTPUT_DIR = os.path.join(os.path.expanduser("~"), "DressCatalogRenders")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Image reference directory (Place real scraped images here if available)
REFERENCE_IMAGE_DIR = os.path.join(os.path.expanduser("~"), "DressReferences")

# Internet-sourced Fabric Data Array (Shader Properties + Physical Visuals)
FABRICS = [
    {"name": "Silk_Satin", "color": (0.8, 0.05, 0.2, 1.0), "roughness": 0.15, "metallic": 0.1, "sheen": 0.85, "transmission": 0.0, "alpha": 1.0},
    {"name": "Floral_Lace", "color": (0.95, 0.95, 0.95, 1.0), "roughness": 0.6, "metallic": 0.0, "sheen": 0.2, "transmission": 0.1, "alpha": 0.75},
    {"name": "Royal_Velvet", "color": (0.1, 0.02, 0.3, 1.0), "roughness": 0.8, "metallic": 0.0, "sheen": 1.0, "transmission": 0.0, "alpha": 1.0},
    {"name": "Raw_Denim", "color": (0.05, 0.1, 0.35, 1.0), "roughness": 0.7, "metallic": 0.0, "sheen": 0.0, "transmission": 0.0, "alpha": 1.0},
    {"name": "Sheer_Chiffon", "color": (0.9, 0.7, 0.8, 0.5), "roughness": 0.3, "metallic": 0.0, "sheen": 0.5, "transmission": 0.4, "alpha": 0.5},
    {"name": "Metallic_Brocade", "color": (0.8, 0.6, 0.2, 1.0), "roughness": 0.35, "metallic": 0.6, "sheen": 0.4, "transmission": 0.0, "alpha": 1.0},
    {"name": "Crystal_Tulle", "color": (0.85, 0.9, 1.0, 0.3), "roughness": 0.1, "metallic": 0.2, "sheen": 0.9, "transmission": 0.8, "alpha": 0.3},
    {"name": "Italian_Leather", "color": (0.05, 0.03, 0.03, 1.0), "roughness": 0.25, "metallic": 0.05, "sheen": 0.1, "transmission": 0.0, "alpha": 1.0},
    {"name": "Organic_Linen", "color": (0.75, 0.7, 0.6, 1.0), "roughness": 0.85, "metallic": 0.0, "sheen": 0.0, "transmission": 0.0, "alpha": 1.0},
    {"name": "Technical_Knit", "color": (0.02, 0.8, 0.6, 1.0), "roughness": 0.45, "metallic": 0.1, "sheen": 0.3, "transmission": 0.0, "alpha": 1.0}
]

# Structural Silhouette Definitions (Geometry parameters)
SILHOUETTES = [
    {"name": "A_Line", "waist_scale": 0.8, "hip_flare": 2.2, "length": 3.0, "asymmetry": 0.0, "layers": 1},
    {"name": "Bodycon", "waist_scale": 0.6, "hip_flare": 0.95, "length": 2.4, "asymmetry": 0.0, "layers": 1},
    {"name": "Mermaid", "waist_scale": 0.65, "hip_flare": 0.85, "length": 3.2, "asymmetry": 0.0, "layers": 1, "bottom_flare": 2.8},
    {"name": "Ballgown", "waist_scale": 0.55, "hip_flare": 3.5, "length": 3.2, "asymmetry": 0.0, "layers": 3},
    {"name": "Slip_Dress", "waist_scale": 0.85, "hip_flare": 1.1, "length": 2.2, "asymmetry": 0.0, "layers": 1},
    {"name": "Asymmetrical_Gown", "waist_scale": 0.7, "hip_flare": 1.8, "length": 2.8, "asymmetry": 0.6, "layers": 1}
]

# Camera Rendering Setup Parameters
CAMERA_ANGLES = [
    {"name": "01_Front_Studio", "location": (0, -6.5, 1.2), "rotation": (math.radians(85), 0, 0), "focal": 85},
    {"name": "02_High_Angle_Structure", "location": (0, -5.0, 4.5), "rotation": (math.radians(50), 0, 0), "focal": 50},
    {"name": "03_Macro_Texture_Detail", "location": (0.3, -1.8, 1.4), "rotation": (math.radians(88), 0, math.radians(10)), "focal": 105}
]


# ==============================================================================
# 2. UTILITY & BLENDER SCENE CLEANUP
# ==============================================================================
def reset_scene():
    """Clears all mesh, light, camera, and material assets from the active scene."""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    
    for block in [bpy.data.meshes, bpy.data.materials, bpy.data.textures, bpy.data.images, bpy.data.cameras, bpy.data.lights]:
        for item in block:
            block.remove(item)

def setup_render_engine():
    """Sets up the rendering engine (Cycles/EEVEE) and frame resolution."""
    scene = bpy.context.scene
    
    # Enable Cycles for realistic cloth, transmission, and sheen rendering
    scene.render.engine = 'CYCLES'
    if hasattr(scene.cycles, 'device'):
        scene.cycles.device = 'GPU'
    scene.cycles.samples = 64  # Optimised for automated batch renders
    
    # Catalog display output resolution (Square 1:1 format)
    scene.render.resolution_x = 1080
    scene.render.resolution_y = 1080
    scene.render.film_transparent = True


# ==============================================================================
# 3. PROCEDURAL GARMENT & SILHOUETTE GENERATOR
# ==============================================================================
def build_dress_mesh(silhouette):
    """Generates procedural 3D garment geometry based on silhouette parameters."""
    mesh_name = f"Dress_{silhouette['name']}"
    mesh = bpy.data.meshes.new(mesh_name)
    obj = bpy.data.objects.new(mesh_name, mesh)
    bpy.context.collection.objects.link(obj)
    
    # Build core vertices for structured dress profile
    verts = []
    faces = []
    
    subdivisions_z = 24
    subdivisions_ring = 32
    length = silhouette['length']
    
    for i in range(subdivisions_z + 1):
        z_factor = i / subdivisions_z
        z_pos = (1.0 - z_factor) * length
        
        # Calculate dynamic radius based on dress profile curves
        if z_factor < 0.25: # Bodice
            radius = 0.45 * (1.0 - (0.25 - z_factor) * (1.0 - silhouette['waist_scale']))
        elif z_factor < 0.5: # Waist to Hips
            t = (z_factor - 0.25) / 0.25
            radius = 0.45 * silhouette['waist_scale'] + t * (0.45 * silhouette['hip_flare'] - 0.45 * silhouette['waist_scale'])
        else: # Skirt / Hem
            t = (z_factor - 0.5) / 0.5
            radius = 0.45 * silhouette['hip_flare'] * (1.0 + t * (silhouette['hip_flare'] - 0.5))
            if silhouette.get("bottom_flare"):
                radius += (t ** 2) * silhouette["bottom_flare"] * 0.3
        
        # Ring generation with optional asymmetry
        for j in range(subdivisions_ring):
            angle = (j / subdivisions_ring) * 2 * math.pi
            x = radius * math.cos(angle)
            y = radius * math.sin(angle)
            
            # Apply asymmetrical drape if defined
            if silhouette['asymmetry'] > 0 and z_factor > 0.6:
                z_offset = math.sin(angle) * silhouette['asymmetry'] * (z_factor - 0.6)
            else:
                z_offset = 0.0
                
            verts.append((x, y, z_pos + z_offset))

    # Construct Quad Topology
    for i in range(subdivisions_z):
        for j in range(subdivisions_ring):
            next_j = (j + 1) % subdivisions_ring
            v1 = i * subdivisions_ring + j
            v2 = i * subdivisions_ring + next_j
            v3 = (i + 1) * subdivisions_ring + next_j
            v4 = (i + 1) * subdivisions_ring + j
            faces.append((v1, v2, v3, v4))

    mesh.from_pydata(verts, [], faces)
    mesh.update()
    
    # Smooth Shading & Subdivision Surface Modifier for Realistic Draping
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_smooth()
    
    subsurf = obj.modifiers.new(name="Subdivision", type='SUBSURF')
    subsurf.render_levels = 2
    subsurf.levels = 1
    
    # Auto UV Unwrapping
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.uv.smart_project(angle_limit=66.0, island_margin=0.02)
    bpy.ops.object.mode_set(mode='OBJECT')
    
    return obj


# ==============================================================================
# 4. REAL-IMAGE REFERENCE & MATERIAL SHADER PIPELINE
# ==============================================================================
def create_fabric_material(fabric_data, reference_image_path=None):
    """
    Creates a node-based Principled BSDF material. Dynamically maps real-world
    reference textures if provided, or procedurally builds fabric maps.
    """
    mat_name = f"Mat_{fabric_data['name']}"
    mat = bpy.data.materials.new(name=mat_name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    # Shader Node Assembly
    node_output = nodes.new(type='ShaderNodeOutputMaterial')
    node_bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
    
    # Configure PBR Fabric Base Properties
    node_bsdf.inputs['Base Color'].default_value = fabric_data['color']
    node_bsdf.inputs['Roughness'].default_value = fabric_data['roughness']
    node_bsdf.inputs['Metallic'].default_value = fabric_data['metallic']
    
    # Handle transmission/alpha for sheer materials (Chiffon/Tulle/Lace)
    if 'alpha' in fabric_data and fabric_data['alpha'] < 1.0:
        node_bsdf.inputs['Alpha'].default_value = fabric_data['alpha']
        mat.blend_method = 'BLEND'
    
    # Attach Real Image Reference Map if existent
    if reference_image_path and os.path.exists(reference_image_path):
        tex_image = nodes.new(type='ShaderNodeTexImage')
        tex_image.image = bpy.data.images.load(reference_image_path)
        links.new(tex_image.outputs['Color'], node_bsdf.inputs['Base Color'])
    else:
        # Procedural Micro-Normal Wave Pattern to simulate woven fabric texture
        node_bump = nodes.new(type='ShaderNodeBump')
        node_bump.inputs['Strength'].default_value = 0.15
        
        node_wave = nodes.new(type='ShaderNodeTexWave')
        node_wave.inputs['Scale'].default_value = 150.0
        
        links.new(node_wave.outputs['Color'], node_bump.inputs['Height'])
        links.new(node_bump.outputs['Bump'], node_bsdf.inputs['Normal'])

    links.new(node_bsdf.outputs['BSDF'], node_output.inputs['Surface'])
    return mat


# ==============================================================================
# 5. CINEMATIC STUDIO LIGHTING & CAMERA RIG
# ==============================================================================
def setup_studio_environment():
    """Sets up key, fill, and rim lights alongside a backdrop curve."""
    # Key Light
    key_light = bpy.data.lights.new(name="Key_Light", type='AREA')
    key_light.energy = 300
    key_light.size = 3.0
    key_obj = bpy.data.objects.new(name="Key_Light", object_data=key_light)
    bpy.context.collection.objects.link(key_obj)
    key_obj.location = (2.5, -3.5, 3.0)
    key_obj.rotation_euler = Euler((math.radians(50), 0, math.radians(35)), 'XYZ')

    # Fill Light (Cooler, Softer)
    fill_light = bpy.data.lights.new(name="Fill_Light", type='AREA')
    fill_light.energy = 120
    fill_light.size = 5.0
    fill_obj = bpy.data.objects.new(name="Fill_Light", object_data=fill_light)
    bpy.context.collection.objects.link(fill_obj)
    fill_obj.location = (-3.0, -3.0, 2.0)
    fill_obj.rotation_euler = Euler((math.radians(60), 0, math.radians(-40)), 'XYZ')

    # Rim / Hair Light (Highlights garment edges)
    rim_light = bpy.data.lights.new(name="Rim_Light", type='SPOT')
    rim_light.energy = 500
    rim_obj = bpy.data.objects.new(name="Rim_Light", object_data=rim_light)
    bpy.context.collection.objects.link(rim_obj)
    rim_obj.location = (0.0, 3.0, 4.0)
    rim_obj.rotation_euler = Euler((math.radians(130), 0, 0), 'XYZ')


def setup_camera():
    """Spawns and returns a master rendering camera."""
    cam_data = bpy.data.cameras.new(name="Catalog_Camera")
    cam_obj = bpy.data.objects.new(name="Catalog_Camera", object_data=cam_data)
    bpy.context.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj
    return cam_obj


# ==============================================================================
# 6. AUTOMATED BATCH RENDERING EXECUTION PIPELINE
# ==============================================================================
def execute_fashion_catalog_pipeline():
    """Main execution loop: Iterates through silhouettes, fabrics, and angles."""
    reset_scene()
    setup_render_engine()
    setup_studio_environment()
    cam_obj = setup_camera()
    
    total_combinations = len(SILHOUETTES) * len(FABRICS)
    current_count = 0
    
    print(f"--- STARTING BATCH CATALOG GENERATION ({total_combinations} VARIANTS) ---")

    for sil in SILHOUETTES:
        # Build base garment mesh
        dress_obj = build_dress_mesh(sil)
        
        for fab in FABRICS:
            current_count += 1
            variant_id = f"{sil['name']}_{fab['name']}"
            print(f"Processing Variant [{current_count}/{total_combinations}]: {variant_id}")
            
            # Setup destination folder structure
            variant_dir = os.path.join(OUTPUT_DIR, sil['name'], fab['name'])
            os.makedirs(variant_dir, exist_ok=True)
            
            # Locate real image reference if available in local directory
            ref_path = os.path.join(REFERENCE_IMAGE_DIR, f"{fab['name']}.jpg")
            
            # Generate and assign material
            material = create_fabric_material(fab, reference_image_path=ref_path)
            if dress_obj.data.materials:
                dress_obj.data.materials[0] = material
            else:
                dress_obj.data.materials.append(material)

            # Render Cinematic Camera Sequence
            for cam_angle in CAMERA_ANGLES:
                cam_obj.location = Vector(cam_angle['location'])
                cam_obj.rotation_euler = Euler(cam_angle['rotation'], 'XYZ')
                cam_obj.data.lens = cam_angle['focal']
                
                # Set Output File Target
                output_filename = f"{variant_id}_{cam_angle['name']}.png"
                bpy.context.scene.render.filepath = os.path.join(variant_dir, output_filename)
                
                # Execute Frame Render
                bpy.ops.render.render(write_still=True)

            # Optional: Render 360 Turntable Animation Sequence for Variant
            turntable_dir = os.path.join(variant_dir, "Turntable_360")
            os.makedirs(turntable_dir, exist_ok=True)
            
            cam_obj.location = Vector((0, -6.0, 1.5))
            cam_obj.rotation_euler = Euler((math.radians(80), 0, 0), 'XYZ')
            
            frames = 8  # Set frame step count for 360-turn sweep
            for frame in range(frames):
                angle = (frame / frames) * (2 * math.pi)
                radius = 6.0
                cam_obj.location.x = radius * math.sin(angle)
                cam_obj.location.y = -radius * math.cos(angle)
                cam_obj.rotation_euler.z = angle
                
                bpy.context.scene.render.filepath = os.path.join(turntable_dir, f"frame_{frame:02d}.png")
                bpy.ops.render.render(write_still=True)

        # Cleanup dress object before instantiating next silhouette
        bpy.data.objects.remove(dress_obj, do_unlink=True)

    print(f"\n✨ --- PIPELINE COMPLETE. ALL ASSETS SAVED TO: {OUTPUT_DIR} ---")

# Execute Pipeline
if __name__ == "__main__":
    execute_fashion_catalog_pipeline()