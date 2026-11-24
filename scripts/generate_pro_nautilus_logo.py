import os
import sys
import io
import re
import base64
import numpy as np
from PIL import Image
from scipy import ndimage
from skimage import measure

# Source image
REF_IMAGE_PATH = 'C:/Users/shaik/.gemini/antigravity/brain/a353e018-efe7-417e-8e2c-cd279f726423/.user_uploaded/media_1795544509240_12e4aa31.jpg'
CLIENT_DIR = os.path.abspath('client')
PUBLIC_LOGO_DIR = os.path.join(CLIENT_DIR, 'public_logo')
PUBLIC_DIR = os.path.join(CLIENT_DIR, 'public')

os.makedirs(PUBLIC_LOGO_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

print(f"Loading reference image from: {REF_IMAGE_PATH}")
orig_img = Image.open(REF_IMAGE_PATH)
orig_arr = np.array(orig_img, dtype=np.float32)

# Estimate background color from corners
corners = np.concatenate([
    orig_arr[0:50, 0:50].reshape(-1, 3),
    orig_arr[0:50, -50:].reshape(-1, 3),
    orig_arr[-50:, 0:50].reshape(-1, 3),
    orig_arr[-50:, -50:].reshape(-1, 3)
])
bg_mean = np.mean(corners, axis=0)
print(f"Background color mean: {bg_mean}")

# Calculate Euclidean distance from background
diff = np.linalg.norm(orig_arr - bg_mean, axis=2)
# Clean bottom right watermark
diff[900:, 900:] = 0.0

# Find contour in original coordinates at threshold 18.0
contours = measure.find_contours(diff, 18.0)
shell_contour = contours[0] # row (Y), col (X)
y_min, x_min = shell_contour.min(axis=0)
y_max, x_max = shell_contour.max(axis=0)
h_orig = y_max - y_min
w_orig = x_max - x_min
print(f"Shell bounding box: Y=[{y_min:.1f}, {y_max:.1f}] (H={h_orig:.1f}), X=[{x_min:.1f}, {x_max:.1f}] (W={w_orig:.1f})")

# Sub-pixel alpha matte
alpha_raw = np.zeros_like(diff, dtype=np.float32)
inner = diff >= 28.0
edge = (diff > 8.0) & (diff < 28.0)
alpha_raw[inner] = 1.0
alpha_raw[edge] = (diff[edge] - 8.0) / 20.0

# Analytical color decontamination
fg_decontam = np.copy(orig_arr)
for c in range(3):
    fg_decontam[edge, c] = (orig_arr[edge, c] - (1.0 - alpha_raw[edge]) * bg_mean[c]) / np.maximum(alpha_raw[edge], 0.01)
fg_decontam = np.clip(fg_decontam, 0, 255)

# Crop exactly to bounding box with 6px margin
crop_y0 = max(0, int(np.floor(y_min)) - 6)
crop_y1 = min(1024, int(np.ceil(y_max)) + 6)
crop_x0 = max(0, int(np.floor(x_min)) - 6)
crop_x1 = min(1024, int(np.ceil(x_max)) + 6)

crop_fg = fg_decontam[crop_y0:crop_y1, crop_x0:crop_x1]
crop_alpha = alpha_raw[crop_y0:crop_y1, crop_x0:crop_x1]

# Crop contour
crop_contour = np.copy(shell_contour)
crop_contour[:, 0] -= crop_y0
crop_contour[:, 1] -= crop_x0

# Build 1024x1024 master canvas
# Shell height 920px (leaving 52px top and bottom margin for balanced optical weight)
target_h = 920.0
scale_factor = target_h / h_orig
target_w = w_orig * scale_factor
scaled_h_int = int(round((crop_y1 - crop_y0) * scale_factor))
scaled_w_int = int(round((crop_x1 - crop_x0) * scale_factor))

# Resample using high-quality Lanczos via PIL
crop_rgba = np.zeros((crop_y1 - crop_y0, crop_x1 - crop_x0, 4), dtype=np.uint8)
crop_rgba[:, :, :3] = np.uint8(np.round(crop_fg))
crop_rgba[:, :, 3] = np.uint8(np.round(crop_alpha * 255))

crop_pil = Image.fromarray(crop_rgba, 'RGBA')
scaled_pil = crop_pil.resize((scaled_w_int, scaled_h_int), resample=Image.Resampling.LANCZOS)
scaled_arr = np.array(scaled_pil, dtype=np.float32)

# Paste centered into 1024x1024 canvas
master_light_arr = np.zeros((1024, 1024, 4), dtype=np.float32)

# Placement calculations
paste_y0 = int(round(52.0 - (y_min - crop_y0) * scale_factor))
paste_x0 = int(round((1024.0 - target_w) / 2.0 - (x_min - crop_x0) * scale_factor))

src_y0 = max(0, -paste_y0)
src_x0 = max(0, -paste_x0)
dst_y0 = max(0, paste_y0)
dst_x0 = max(0, paste_x0)
copy_h = min(scaled_h_int - src_y0, 1024 - dst_y0)
copy_w = min(scaled_w_int - src_x0, 1024 - dst_x0)

master_light_arr[dst_y0:dst_y0+copy_h, dst_x0:dst_x0+copy_w] = scaled_arr[src_y0:src_y0+copy_h, src_x0:src_x0+copy_w]

# Subtle 3D clarity enhancement for Light Mode:
# Enhance the golden core and chamber definition
light_alpha = master_light_arr[:, :, 3] / 255.0
light_rgb = np.copy(master_light_arr[:, :, :3])
light_lum = 0.299 * light_rgb[:, :, 0] + 0.587 * light_rgb[:, :, 1] + 0.114 * light_rgb[:, :, 2]

# Exact Fibonacci spiral core position: X=610, Y=621
y_grid, x_grid = np.ogrid[:1024, :1024]
core_dist = np.sqrt((x_grid - 610)**2 + (y_grid - 621)**2)
core_mask = np.clip((85.0 - core_dist) / 85.0, 0, 1.0) * (light_lum > 85)

# Micro-contrast on light ribs
light_blurred_lum = ndimage.gaussian_filter(light_lum, sigma=2.0)
light_ribs = np.maximum(light_lum - light_blurred_lum, 0.0)
light_ribs_norm = light_ribs / (np.max(light_ribs) + 1e-5)

# Enhance gold core in light mode
light_rgb[:, :, 0] += core_mask * 28.0 * light_alpha
light_rgb[:, :, 1] += core_mask * 18.0 * light_alpha
light_rgb[:, :, 2] -= core_mask * 8.0 * light_alpha

# Enhance crisp rib definition
light_rgb[:, :, 0] += light_ribs_norm * 15.0 * light_alpha
light_rgb[:, :, 1] += light_ribs_norm * 25.0 * light_alpha
light_rgb[:, :, 2] += light_ribs_norm * 18.0 * light_alpha

light_rgb = np.clip(light_rgb, 0, 255)
master_light_arr[:, :, :3] = light_rgb

# Transparent pixel color dilation for light mode
zero_mask_light = light_alpha < 0.01
indices_light = ndimage.distance_transform_edt(zero_mask_light, return_distances=False, return_indices=True)
master_light_rgb_dilated = master_light_arr[:, :, :3][indices_light[0], indices_light[1]]
master_light_arr[:, :, :3] = master_light_rgb_dilated

master_light_uint8 = np.uint8(np.clip(master_light_arr, 0, 255))
master_light_img = Image.fromarray(master_light_uint8, 'RGBA')
master_light_img.save(os.path.join(PUBLIC_LOGO_DIR, 'cambium-emblem-light.png'))
print("Saved master light emblem.")

# ----------------------------------------------------
# 2. Build Master Dark Bioluminescent Mark
# ----------------------------------------------------
dark_rgb = np.copy(master_light_arr[:, :, :3])
alpha_norm = master_light_arr[:, :, 3] / 255.0
shell_mask = alpha_norm > 0.02

# Luminance
lum = 0.299 * dark_rgb[:, :, 0] + 0.587 * dark_rgb[:, :, 1] + 0.114 * dark_rgb[:, :, 2]

# High-pass filter for chamber ribs / spiral ridges
blurred_lum = ndimage.gaussian_filter(lum, sigma=2.2)
ribs = np.maximum(lum - blurred_lum, 0.0)
ribs_max = np.max(ribs[shell_mask]) if np.any(shell_mask) else 1.0
ribs_norm = ribs / (ribs_max + 1e-5)

# Outer edge distance for luminous rim lighting
dist_from_edge = ndimage.distance_transform_edt(alpha_norm > 0.1)
rim_mask = (dist_from_edge > 0) & (dist_from_edge <= 8.0)
rim_factor = np.zeros_like(lum)
rim_factor[rim_mask] = (8.0 - dist_from_edge[rim_mask]) / 8.0

# Base body: Botanical luminous jade & emerald
dark_rgb[:, :, 0] = np.clip(dark_rgb[:, :, 0] * 0.72 + lum * 0.15, 0, 255)
dark_rgb[:, :, 1] = np.clip(dark_rgb[:, :, 1] * 1.38 + lum * 0.35 + 20, 0, 255)
dark_rgb[:, :, 2] = np.clip(dark_rgb[:, :, 2] * 1.15 + lum * 0.25, 0, 255)

# Radiant chamber ribs: Mint & solar gold highlights
dark_rgb[:, :, 0] += ribs_norm * 95.0 * alpha_norm
dark_rgb[:, :, 1] += ribs_norm * 185.0 * alpha_norm
dark_rgb[:, :, 2] += ribs_norm * 125.0 * alpha_norm

# Neon emerald rim light: #4ADE80 [74, 222, 128]
dark_rgb[:, :, 0] = dark_rgb[:, :, 0] * (1.0 - rim_factor * 0.5) + 74.0 * rim_factor * 0.5
dark_rgb[:, :, 1] = dark_rgb[:, :, 1] * (1.0 - rim_factor * 0.6) + 222.0 * rim_factor * 0.6
dark_rgb[:, :, 2] = dark_rgb[:, :, 2] * (1.0 - rim_factor * 0.5) + 128.0 * rim_factor * 0.5

# Golden Fibonacci spiral core: X=610, Y=621
dark_core_mask = np.clip((85.0 - core_dist) / 85.0, 0, 1.0) * (lum > 75)
dark_rgb[:, :, 0] += dark_core_mask * 75.0 * alpha_norm
dark_rgb[:, :, 1] += dark_core_mask * 55.0 * alpha_norm
dark_rgb[:, :, 2] -= dark_core_mask * 20.0 * alpha_norm

dark_rgb = np.clip(dark_rgb, 0, 255)

# Color dilation for dark mode transparent pixels
zero_mask_dark = alpha_norm < 0.01
dark_indices = ndimage.distance_transform_edt(zero_mask_dark, return_distances=False, return_indices=True)
dark_rgb_dilated = dark_rgb[dark_indices[0], dark_indices[1]]

master_dark_arr = np.zeros((1024, 1024, 4), dtype=np.uint8)
master_dark_arr[:, :, :3] = np.uint8(np.round(dark_rgb_dilated))
master_dark_arr[:, :, 3] = np.uint8(np.round(alpha_norm * 255))

master_dark_img = Image.fromarray(master_dark_arr, 'RGBA')
master_dark_img.save(os.path.join(PUBLIC_LOGO_DIR, 'cambium-emblem.png'))
print("Saved master dark emblem.")

# ----------------------------------------------------
# 3. Vector Contour & Polygon Generation (36x36 ViewBox)
# ----------------------------------------------------
contour_1024 = np.zeros_like(shell_contour)
contour_1024[:, 0] = paste_y0 + (crop_contour[:, 0] * scale_factor)
contour_1024[:, 1] = paste_x0 + (crop_contour[:, 1] * scale_factor)

vb_scale = 36.0 / 1024.0
contour_vb = contour_1024 * vb_scale

poly_vb = measure.approximate_polygon(contour_vb, tolerance=0.04)
svg_path_d = 'M ' + ' L '.join([f'{pt[1]:.2f},{pt[0]:.2f}' for pt in poly_vb]) + ' Z'
print(f"Generated SVG path with {len(poly_vb)} control points.")

# Encode light and dark PNGs to base64
def to_base64_png(img, size=512):
    resampled = img.resize((size, size), resample=Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    resampled.save(buf, format='PNG', optimize=True)
    return base64.b64encode(buf.getvalue()).decode('utf-8')

b64_light = to_base64_png(master_light_img, size=512)
b64_dark = to_base64_png(master_dark_img, size=512)

# ----------------------------------------------------
# 4. Generate SVG Logo System with Fluid Scaling (viewBox only)
# ----------------------------------------------------
# Light Theme SVG
svg_light = f'''<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Cambium Research Mark — Light Edition</title>
  <defs>
    <clipPath id="cambium-shell-cut-light">
      <path d="{svg_path_d}" />
    </clipPath>
    <filter id="cambium-contact-shadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="0.8" stdDeviation="0.6" flood-color="#113628" flood-opacity="0.16" />
    </filter>
  </defs>
  <!-- Dimensional Contact Aura -->
  <path d="{svg_path_d}" fill="#113628" filter="url(#cambium-contact-shadow)" opacity="0.08" />
  <!-- 3D Decontaminated Nautilus Mark with Vector Cut -->
  <g clip-path="url(#cambium-shell-cut-light)">
    <image href="data:image/png;base64,{b64_light}" x="0" y="0" width="36" height="36" preserveAspectRatio="none" />
  </g>
  <!-- Rigid High-Contrast Canopy Perimeter Stroke -->
  <path d="{svg_path_d}" fill="none" stroke="#113628" stroke-width="0.32" stroke-linejoin="round" opacity="0.95" />
</svg>
'''

# Dark Theme SVG with Pro Glow
svg_dark = f'''<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Cambium Research Mark — Dark Edition</title>
  <defs>
    <clipPath id="cambium-shell-cut-dark">
      <path d="{svg_path_d}" />
    </clipPath>
    <filter id="cambium-pro-glow" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.2" flood-color="#4ADE80" flood-opacity="0.45" />
      <feDropShadow dx="0" dy="0" stdDeviation="0.4" flood-color="#86EFAC" flood-opacity="0.6" />
    </filter>
  </defs>
  <!-- Bioluminescent Outer Glow Aura -->
  <path d="{svg_path_d}" fill="#4ADE80" filter="url(#cambium-pro-glow)" opacity="0.25" />
  <!-- 3D Bioluminescent Nautilus Mark with Vector Cut -->
  <g clip-path="url(#cambium-shell-cut-dark)">
    <image href="data:image/png;base64,{b64_dark}" x="0" y="0" width="36" height="36" preserveAspectRatio="none" />
  </g>
  <!-- Luminous Emerald Outer Rim Stroke -->
  <path d="{svg_path_d}" fill="none" stroke="#4ADE80" stroke-width="0.35" stroke-linejoin="round" opacity="0.85" />
</svg>
'''

# Responsive Favicon SVG (switches between light and dark)
svg_favicon = f'''<svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Cambium Research Favicon</title>
  <defs>
    <clipPath id="fav-cut-light">
      <path d="{svg_path_d}" />
    </clipPath>
    <clipPath id="fav-cut-dark">
      <path d="{svg_path_d}" />
    </clipPath>
    <filter id="fav-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="1.0" flood-color="#4ADE80" flood-opacity="0.5" />
    </filter>
    <style>
      .theme-light {{ display: block; }}
      .theme-dark {{ display: none; }}
      @media (prefers-color-scheme: dark) {{
        .theme-light {{ display: none; }}
        .theme-dark {{ display: block; }}
      }}
    </style>
  </defs>
  <!-- Light Variant -->
  <g class="theme-light">
    <path d="{svg_path_d}" fill="#113628" opacity="0.08" />
    <g clip-path="url(#fav-cut-light)">
      <image href="data:image/png;base64,{b64_light}" x="0" y="0" width="36" height="36" preserveAspectRatio="none" />
    </g>
    <path d="{svg_path_d}" fill="none" stroke="#113628" stroke-width="0.35" stroke-linejoin="round" />
  </g>
  <!-- Dark Variant -->
  <g class="theme-dark">
    <path d="{svg_path_d}" fill="#4ADE80" filter="url(#fav-glow)" opacity="0.3" />
    <g clip-path="url(#fav-cut-dark)">
      <image href="data:image/png;base64,{b64_dark}" x="0" y="0" width="36" height="36" preserveAspectRatio="none" />
    </g>
    <path d="{svg_path_d}" fill="none" stroke="#4ADE80" stroke-width="0.35" stroke-linejoin="round" opacity="0.85" />
  </g>
</svg>
'''

# Write SVGs to client/public_logo/
with open(os.path.join(PUBLIC_LOGO_DIR, 'cambium-logo-light.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_light)
with open(os.path.join(PUBLIC_LOGO_DIR, 'cambium-logo-dark.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_dark)
with open(os.path.join(PUBLIC_LOGO_DIR, 'favicon-light.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_light)
with open(os.path.join(PUBLIC_LOGO_DIR, 'favicon-dark.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_dark)
with open(os.path.join(PUBLIC_LOGO_DIR, 'favicon.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_favicon)
with open(os.path.join(PUBLIC_LOGO_DIR, 'logo.svg'), 'w', encoding='utf-8') as f:
    f.write(svg_light)

print("Saved all SVGs in client/public_logo/")

# ----------------------------------------------------
# 5. Generate Full PNG Suite & Multi-Resolution Icons
# ----------------------------------------------------
sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512]
for sz in sizes:
    icon_img = master_light_img.resize((sz, sz), resample=Image.Resampling.LANCZOS)
    icon_path = os.path.join(PUBLIC_LOGO_DIR, f'cambium-icon-{sz}.png')
    icon_img.save(icon_path, format='PNG', optimize=True)

# Apple touch icon (180x180)
master_light_img.resize((180, 180), resample=Image.Resampling.LANCZOS).save(
    os.path.join(PUBLIC_LOGO_DIR, 'apple-touch-icon.png'), format='PNG', optimize=True
)

# High-res emblem variants
master_light_img.save(os.path.join(PUBLIC_LOGO_DIR, 'cambium-emblem-hd.png'), format='PNG', optimize=True)
master_light_img.save(os.path.join(PUBLIC_LOGO_DIR, 'cambium-emblem-transparent.png'), format='PNG', optimize=True)
master_light_img.save(os.path.join(PUBLIC_LOGO_DIR, 'cambium-emblem-circle.png'), format='PNG', optimize=True)

# Generate multi-resolution favicon.ico (16, 32, 48)
ico_images = [
    master_light_img.resize((16, 16), resample=Image.Resampling.LANCZOS),
    master_light_img.resize((32, 32), resample=Image.Resampling.LANCZOS),
    master_light_img.resize((48, 48), resample=Image.Resampling.LANCZOS),
]
ico_images[0].save(
    os.path.join(PUBLIC_LOGO_DIR, 'favicon.ico'),
    format='ICO',
    sizes=[(16, 16), (32, 32), (48, 48)]
)
print("Saved favicon.ico and all PNG sizes in client/public_logo/")
