import os
import base64
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import label, binary_opening, binary_dilation, gaussian_filter, distance_transform_edt

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

    cleaned = orig.copy()

    # 1. Inpaint vertical straight guide lines crossing through the chambers
    v_lines = [218, 219, 220, 255, 256, 271, 308, 348, 349]
    for x in v_lines:
        if 3 <= x < W - 3:
            for y in range(H):
                left = cleaned[y, max(0, x - 3):max(1, x - 1)].mean(axis=0)
                right = cleaned[y, min(W - 1, x + 2):min(W, x + 4)].mean(axis=0)
                avg = (left + right) / 2.0
                curr = cleaned[y, x].astype(float)
                if (curr - left).mean() > 7 and (curr - right).mean() > 7:
                    cleaned[y, x] = np.round(avg).astype(np.uint8)

    # 2. Inpaint horizontal straight guide lines crossing through the chambers
    h_lines = [33, 34, 35, 122, 123, 186, 187, 235, 236, 279, 280, 422, 423]
    for y in h_lines:
        if 3 <= y < H - 3:
            for x in range(W):
                top = cleaned[max(0, y - 3):max(1, y - 1), x].mean(axis=0)
                bot = cleaned[min(H - 1, y + 2):min(H, y + 4), x].mean(axis=0)
                avg = (top + bot) / 2.0
                curr = cleaned[y, x].astype(float)
                if (curr - top).mean() > 7 and (curr - bot).mean() > 7:
                    cleaned[y, x] = np.round(avg).astype(np.uint8)

    # 3. Construct clean mask of the nautilus shell body
    diff = np.linalg.norm(cleaned.astype(float) - [9.0, 32.5, 37.5], axis=-1)
    mask = diff > 20
    opened = binary_opening(mask, structure=np.ones((3, 3)))
    lbl, num = label(opened)
    sizes = [(np.sum(lbl == i), i) for i in range(1, num + 1)]
    sizes.sort(reverse=True)
    main_mask = (lbl == sizes[0][1])

    # Clean guide line overshoots outside shell
    main_mask[115:185, 260:345] = False
    main_mask[0:50, 350:W] = False
    main_mask[424:H, :] = False
    main_mask[0:150, 0:70] = False

    dilated = binary_dilation(main_mask, structure=np.ones((3, 3)))
    final_mask = main_mask | (dilated & (diff > 12))
    final_mask[115:185, 260:345] = False
    final_mask[0:50, 350:W] = False
    final_mask[424:H, :] = False
    final_mask[0:150, 0:70] = False

    # 4. Fill all internal holes to ensure the shell body is 100% solid (no jagged hollow chambers)
    from scipy.ndimage import binary_fill_holes
    solid_mask = binary_fill_holes(final_mask)

    # 5. Generate smooth antialiased alpha channel: 100% solid interior, smooth outer contour
    dist_in = distance_transform_edt(solid_mask)
    alpha = np.zeros((H, W), dtype=float)
    alpha[solid_mask] = 255.0
    alpha_smooth = gaussian_filter(alpha, sigma=0.6)
    alpha_smooth[dist_in >= 1.5] = 255.0
    alpha_smooth[dist_in == 0] = 0.0

    clean_rgba = np.zeros((H, W, 4), dtype=np.uint8)
    clean_rgba[:, :, :3] = cleaned
    clean_rgba[:, :, 3] = np.clip(alpha_smooth, 0, 255).astype(np.uint8)

    # 6. Crop tightly to the true shape with 2px antialias padding
    ys, xs = np.where(solid_mask)
    crop_ymin = max(0, ys.min() - 2)
    crop_ymax = min(H, ys.max() + 3)
    crop_xmin = max(0, xs.min() - 2)
    crop_xmax = min(W, xs.max() + 3)

    cropped_rgba = clean_rgba[crop_ymin:crop_ymax, crop_xmin:crop_xmax]
    cropped_img = Image.fromarray(cropped_rgba, "RGBA")

    # 6. Fit cleanly into a square transparent canvas (1024x1024)
    target_canvas_size = 1024
    # Shell should fill ~92% of canvas height
    target_h = int(target_canvas_size * 0.92)
    aspect = cropped_img.width / cropped_img.height
    target_w = int(target_h * aspect)

    scaled_rgba = cropped_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

    pos_x = (target_canvas_size - target_w) // 2
    pos_y = (target_canvas_size - target_h) // 2

    # Master Transparent Cut-out Canvas
    master_trans = Image.new("RGBA", (target_canvas_size, target_canvas_size), (0, 0, 0, 0))
    master_trans.paste(scaled_rgba, (pos_x, pos_y), mask=scaled_rgba.split()[3])

    # Save master transparent PNGs
    trans_files = [
        "cambium-emblem-transparent.png",
        "cambium-emblem-hd.png",
        "cambium-emblem.png",
        "cambium-emblem-circle.png" # Also make this transparent so legacy references get the pure cut-out!
    ]
    for tf in trans_files:
        master_trans.save(os.path.join(public_logo_dir, tf), "PNG")
        master_trans.save(os.path.join(public_dir, tf), "PNG")
        master_trans.save(os.path.join(dest_public_logo_dir, tf), "PNG")
    print("Saved master transparent PNGs (1024x1024)")

    # 7. Generate Multi-Resolution Transparent Icons (16, 32, 48, 64, 128, 180, 192, 256)
    sizes = [16, 32, 48, 64, 128, 180, 192, 256]
    resized_images = []
    for sz in sizes:
        icon_res = master_trans.resize((sz, sz), Image.Resampling.LANCZOS)
        out_name = f"cambium-icon-{sz}.png"
        icon_res.save(os.path.join(public_logo_dir, out_name), "PNG")
        icon_res.save(os.path.join(dest_public_logo_dir, out_name), "PNG")
        if sz == 180:
            icon_res.save(os.path.join(public_logo_dir, "apple-touch-icon.png"), "PNG")
            icon_res.save(os.path.join(public_dir, "apple-touch-icon.png"), "PNG")
            icon_res.save(os.path.join(dest_public_logo_dir, "apple-touch-icon.png"), "PNG")
        if sz in [16, 32, 48, 64]:
            resized_images.append(icon_res)

    # 8. Save transparent favicon.ico with multi-resolution layers
    ico_destinations = [
        os.path.join(public_logo_dir, "favicon.ico"),
        os.path.join(public_dir, "favicon.ico"),
        os.path.join(dest_public_logo_dir, "favicon.ico"),
        os.path.join(app_dir, "favicon.ico"),
    ]
    for ico_dest in ico_destinations:
        master_trans.save(
            ico_dest,
            format="ICO",
            sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
        )
    print("Saved transparent multi-res favicon.ico to public and app dirs")

    # Save Next.js App Router icon.png and apple-icon.png
    icon_32 = master_trans.resize((32, 32), Image.Resampling.LANCZOS)
    icon_32.save(os.path.join(app_dir, "icon.png"), "PNG")
    icon_32.save(os.path.join(public_dir, "icon.png"), "PNG")

    icon_180 = master_trans.resize((180, 180), Image.Resampling.LANCZOS)
    icon_180.save(os.path.join(app_dir, "apple-icon.png"), "PNG")
    icon_180.save(os.path.join(public_dir, "apple-icon.png"), "PNG")

    icon_192 = master_trans.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save(os.path.join(public_dir, "icon-192.png"), "PNG")
    print("Saved Next.js App Router icon.png and apple-icon.png")

    # 9. Create Self-Contained Realistic SVG with Cut-Out 3D Nautilus Shell
    # Use 256px resolution PNG for crisp fidelity in SVG
    png_256 = master_trans.resize((256, 256), Image.Resampling.LANCZOS)
    png_256_path = os.path.join(public_logo_dir, "temp_256.png")
    png_256.save(png_256_path, "PNG")
    with open(png_256_path, "rb") as f:
        b64_str = base64.b64encode(f.read()).decode("utf-8")
    if os.path.exists(png_256_path):
        os.remove(png_256_path)

    # Realistic SVG: Pure cut-out, NO circle, NO pebble, transparent viewBox
    realistic_svg = f'''<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Cambium Logo — Fibonacci Golden Spiral</title>
  <image href="data:image/png;base64,{b64_str}" x="0" y="0" width="36" height="36" preserveAspectRatio="xMidYMid meet"/>
</svg>'''

    svg_targets = [
        ("cambium-logo-dark.svg", realistic_svg),
        ("cambium-logo-light.svg", realistic_svg),
        ("favicon.svg", realistic_svg),
        ("favicon-dark.svg", realistic_svg),
        ("favicon-light.svg", realistic_svg),
    ]

    for fname, content in svg_targets:
        for d in [public_logo_dir, dest_public_logo_dir, public_dir]:
            with open(os.path.join(d, fname), "w", encoding="utf-8") as f:
                f.write(content)
        print(f"Wrote realistic {fname}")

    # Also update app/icon.svg for Next.js App Router root favicon route
    with open(os.path.join(app_dir, "icon.svg"), "w", encoding="utf-8") as f:
        f.write(realistic_svg)
    print("Updated client/app/icon.svg with realistic cut-out SVG")

if __name__ == "__main__":
    build_realistic_cutout_logos()
