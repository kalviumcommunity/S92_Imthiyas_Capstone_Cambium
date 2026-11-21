import os
import base64
import numpy as np
from PIL import Image
from scipy.ndimage import label, binary_fill_holes, distance_transform_edt

def build_realistic_cutout_logos():
    root_dir = r"d:\01_PROJECTS\ACTIVE\S92_Imthiyas_Capstone_Cambium"
    public_logo_dir = os.path.join(root_dir, "client", "public_logo")
    public_dir = os.path.join(root_dir, "client", "public")
    dest_public_logo_dir = os.path.join(public_dir, "public_logo")
    app_dir = os.path.join(root_dir, "client", "app")

    os.makedirs(public_logo_dir, exist_ok=True)
    os.makedirs(dest_public_logo_dir, exist_ok=True)

    src_path = r"C:\Users\shaik\.gemini\antigravity\brain\a353e018-efe7-417e-8e2c-cd279f726423\.user_uploaded\media_1795060343377_124c1cb8.jpg"
    orig_img = Image.open(src_path).convert("RGB")
    orig = np.array(orig_img)
    H, W, _ = orig.shape
    print(f"Loaded master source image: {W}x{H}")

    bg = np.array([10.0, 33.5, 38.0], dtype=float)
    dist_raw = np.linalg.norm(orig.astype(float) - bg, axis=-1)

    # 1. Seamless inpaint of faint grid lines in background regions only
    v_lines = [218, 219, 220, 255, 256, 271, 308, 348, 349]
    h_lines = [33, 34, 35, 122, 123, 186, 187, 235, 236, 279, 280, 422, 423]

    cleaned = orig.copy()
    for x in v_lines:
        for y in range(H):
            if dist_raw[y, x] < 55:
                left = cleaned[y, max(0, x - 4):max(1, x - 1)].mean(axis=0)
                right = cleaned[y, min(W - 1, x + 2):min(W, x + 5)].mean(axis=0)
                cleaned[y, x] = np.round((left + right) / 2.0).astype(np.uint8)

    for y in h_lines:
        for x in range(W):
            if dist_raw[y, x] < 55:
                top = cleaned[max(0, y - 4):max(1, y - 1), x].mean(axis=0)
                bot = cleaned[min(H - 1, y + 2):min(H, y + 5), x].mean(axis=0)
                cleaned[y, x] = np.round((top + bot) / 2.0).astype(np.uint8)

    dist_cleaned = np.linalg.norm(cleaned.astype(float) - bg, axis=-1)

    # 2. Extract shell mask organically WITHOUT ANY manual box cuts
    fg_mask = dist_cleaned > 22
    lbl, num = label(fg_mask)
    sizes = [(np.sum(lbl == i), i) for i in range(1, num + 1)]
    sizes.sort(reverse=True)
    main_shell = (lbl == sizes[0][1])
    filled_shell = binary_fill_holes(main_shell)

    # 3. Sub-pixel continuous antialiasing (0.8px razor-sharp boundary)
    dist_in = distance_transform_edt(filled_shell)
    dist_out = distance_transform_edt(~filled_shell)

    alpha = np.zeros((H, W), dtype=float)
    alpha[dist_in >= 0.8] = 1.0
    alpha[dist_out >= 0.8] = 0.0
    in_trans = (dist_in > 0) & (dist_in < 0.8)
    out_trans = (dist_out > 0) & (dist_out < 0.8)
    alpha[in_trans] = 0.5 + 0.5 * (dist_in[in_trans] / 0.8)
    alpha[out_trans] = 0.5 - 0.5 * (dist_out[out_trans] / 0.8)
    alpha = np.clip(alpha, 0.0, 1.0)

    # 4. Color decontamination: Unmix background from transition pixels
    decontaminated = cleaned.astype(float).copy()
    trans_mask = (alpha < 0.99) & (alpha > 0.02)
    for c in range(3):
        unmixed = (decontaminated[:, :, c] - (1.0 - alpha) * bg[c]) / np.maximum(alpha, 0.02)
        decontaminated[:, :, c] = np.where(trans_mask, np.clip(unmixed, 0, 255), decontaminated[:, :, c])

    # 5. Nearest-neighbor color bleeding: Transparent pixels inherit shell rim RGB
    _, nearest_indices = distance_transform_edt(alpha < 0.85, return_indices=True)
    bleed_rgb = np.zeros_like(decontaminated)
    for c in range(3):
        ch = decontaminated[:, :, c]
        bleed_rgb[:, :, c] = ch[nearest_indices[0], nearest_indices[1]]

    final_dark_rgb = np.where(alpha[:, :, None] > 0.85, decontaminated, bleed_rgb)

    # 6. Light Theme Rigid Perimeter: Deep canopy emerald (#15392F) rim definition
    canopy_rim = np.array([21.0, 58.0, 48.0], dtype=float)
    weight = np.clip((2.2 - dist_in) / 2.2, 0, 1) * 0.45
    final_light_rgb = final_dark_rgb.copy()
    for c in range(3):
        final_light_rgb[:, :, c] = np.where(
            (dist_in > 0) & (dist_in <= 2.2),
            final_light_rgb[:, :, c] * (1 - weight) + canopy_rim[c] * weight,
            final_light_rgb[:, :, c]
        )

    # 7. Crop tightly to natural bounding box with 2px antialias padding
    ys, xs = np.where(filled_shell)
    ymin = max(0, ys.min() - 2)
    ymax = min(H, ys.max() + 3)
    xmin = max(0, xs.min() - 2)
    xmax = min(W, xs.max() + 3)

    dark_rgba = np.zeros((H, W, 4), dtype=np.uint8)
    dark_rgba[:, :, :3] = np.clip(final_dark_rgb, 0, 255).astype(np.uint8)
    dark_rgba[:, :, 3] = np.clip(alpha * 255, 0, 255).astype(np.uint8)

    light_rgba = np.zeros((H, W, 4), dtype=np.uint8)
    light_rgba[:, :, :3] = np.clip(final_light_rgb, 0, 255).astype(np.uint8)
    light_rgba[:, :, 3] = np.clip(alpha * 255, 0, 255).astype(np.uint8)

    cropped_dark = Image.fromarray(dark_rgba[ymin:ymax, xmin:xmax], "RGBA")
    cropped_light = Image.fromarray(light_rgba[ymin:ymax, xmin:xmax], "RGBA")

    # 8. Fit onto 1024x1024 Square Master Canvases
    target_canvas_size = 1024
    target_h = int(target_canvas_size * 0.92)
    aspect = cropped_dark.width / cropped_dark.height
    target_w = int(target_h * aspect)

    scaled_dark = cropped_dark.resize((target_w, target_h), Image.Resampling.LANCZOS)
    scaled_light = cropped_light.resize((target_w, target_h), Image.Resampling.LANCZOS)

    pos_x = (target_canvas_size - target_w) // 2
    pos_y = (target_canvas_size - target_h) // 2

    master_dark = Image.new("RGBA", (target_canvas_size, target_canvas_size), (0, 0, 0, 0))
    master_dark.paste(scaled_dark, (pos_x, pos_y), mask=scaled_dark.split()[3])

    master_light = Image.new("RGBA", (target_canvas_size, target_canvas_size), (0, 0, 0, 0))
    master_light.paste(scaled_light, (pos_x, pos_y), mask=scaled_light.split()[3])

    # Save master transparent PNGs
    trans_files = [
        "cambium-emblem-transparent.png",
        "cambium-emblem-hd.png",
        "cambium-emblem.png",
        "cambium-emblem-circle.png",
    ]
    for tf in trans_files:
        for d in [public_logo_dir, dest_public_logo_dir, public_dir]:
            master_dark.save(os.path.join(d, tf), "PNG")
    
    # Save light-specific master PNG
    for d in [public_logo_dir, dest_public_logo_dir, public_dir]:
        master_light.save(os.path.join(d, "cambium-emblem-light.png"), "PNG")
    print("Saved master transparent PNGs (1024x1024) across all directories")

    # 9. Multi-Resolution Transparent Icons (16, 32, 48, 64, 128, 180, 192, 256, 512)
    sizes = [16, 32, 48, 64, 128, 180, 192, 256, 512]
    for sz in sizes:
        icon_res = master_dark.resize((sz, sz), Image.Resampling.LANCZOS)
        out_name = f"cambium-icon-{sz}.png"
        for d in [public_logo_dir, dest_public_logo_dir]:
            icon_res.save(os.path.join(d, out_name), "PNG")
        if sz == 180:
            for d in [public_logo_dir, dest_public_logo_dir, public_dir]:
                icon_res.save(os.path.join(d, "apple-touch-icon.png"), "PNG")

    # 10. Multi-resolution favicon.ico
    for d in [public_logo_dir, dest_public_logo_dir, public_dir, app_dir]:
        master_dark.save(
            os.path.join(d, "favicon.ico"),
            format="ICO",
            sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
        )
    print("Saved transparent multi-res favicon.ico")

    # 11. Next.js App Router icons
    icon_32 = master_dark.resize((32, 32), Image.Resampling.LANCZOS)
    icon_32.save(os.path.join(app_dir, "icon.png"), "PNG")
    icon_32.save(os.path.join(public_dir, "icon.png"), "PNG")

    icon_180 = master_dark.resize((180, 180), Image.Resampling.LANCZOS)
    icon_180.save(os.path.join(app_dir, "apple-icon.png"), "PNG")
    icon_180.save(os.path.join(public_dir, "apple-icon.png"), "PNG")

    icon_192 = master_dark.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save(os.path.join(public_dir, "icon-192.png"), "PNG")

    # 12. Create High-Density (512x512) Base64 SVGs for Light and Dark
    png_light_512 = master_light.resize((512, 512), Image.Resampling.LANCZOS)
    png_dark_512 = master_dark.resize((512, 512), Image.Resampling.LANCZOS)

    temp_l = os.path.join(public_logo_dir, "temp_l.png")
    temp_d = os.path.join(public_logo_dir, "temp_d.png")
    png_light_512.save(temp_l, "PNG")
    png_dark_512.save(temp_d, "PNG")

    with open(temp_l, "rb") as f:
        b64_light = base64.b64encode(f.read()).decode("utf-8")
    with open(temp_d, "rb") as f:
        b64_dark = base64.b64encode(f.read()).decode("utf-8")

    if os.path.exists(temp_l):
        os.remove(temp_l)
    if os.path.exists(temp_d):
        os.remove(temp_d)

    svg_light = f'''<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Cambium Logo — Fibonacci Golden Spiral (Light Surface)</title>
  <image href="data:image/png;base64,{b64_light}" x="0" y="0" width="36" height="36" preserveAspectRatio="xMidYMid meet"/>
</svg>'''

    svg_dark = f'''<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Cambium Logo — Fibonacci Golden Spiral (Dark Surface)</title>
  <image href="data:image/png;base64,{b64_dark}" x="0" y="0" width="36" height="36" preserveAspectRatio="xMidYMid meet"/>
</svg>'''

    # Write SVGs
    for d in [public_logo_dir, dest_public_logo_dir, public_dir]:
        with open(os.path.join(d, "cambium-logo-light.svg"), "w", encoding="utf-8") as f:
            f.write(svg_light)
        with open(os.path.join(d, "favicon-light.svg"), "w", encoding="utf-8") as f:
            f.write(svg_light)
        with open(os.path.join(d, "cambium-logo-dark.svg"), "w", encoding="utf-8") as f:
            f.write(svg_dark)
        with open(os.path.join(d, "favicon-dark.svg"), "w", encoding="utf-8") as f:
            f.write(svg_dark)
        with open(os.path.join(d, "favicon.svg"), "w", encoding="utf-8") as f:
            f.write(svg_light)
        with open(os.path.join(d, "logo.svg"), "w", encoding="utf-8") as f:
            f.write(svg_light)

    # Next.js App Router root icon.svg
    with open(os.path.join(app_dir, "icon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_light)

    print("Successfully generated all pixel-perfect decontaminated logo assets across all directories!")

if __name__ == "__main__":
    build_realistic_cutout_logos()
