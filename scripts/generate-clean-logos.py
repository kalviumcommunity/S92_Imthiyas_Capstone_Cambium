import os
import base64
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import label, binary_opening, binary_dilation, gaussian_filter

def clean_and_build_logos():
    src_path = r"C:\Users\shaik\.gemini\antigravity\brain\a353e018-efe7-417e-8e2c-cd279f726423\.user_uploaded\media_1794563667202_39692afa.jpg"
    orig_img = Image.open(src_path).convert("RGB")
    orig = np.array(orig_img)
    H, W, _ = orig.shape

    out_dir = r"d:\01_PROJECTS\ACTIVE\S92_Imthiyas_Capstone_Cambium\client\public_logo"
    os.makedirs(out_dir, exist_ok=True)

    bg_color = np.array([9, 32, 38], dtype=np.uint8) # Cambium Deep Canopy Dark
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
                # If current pixel spikes brighter than both neighbors
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

    # 3. Construct the clean silhouette mask of the nautilus shell body
    diff = np.linalg.norm(cleaned.astype(float) - [9.0, 32.5, 37.5], axis=-1)
    mask = diff > 20
    opened = binary_opening(mask, structure=np.ones((3, 3)))
    lbl, num = label(opened)
    sizes = [(np.sum(lbl == i), i) for i in range(1, num + 1)]
    sizes.sort(reverse=True)
    main_mask = (lbl == sizes[0][1])

    # Remove the void guide rectangle intrusion (y: 115..185, x: 260..345)
    main_mask[115:185, 260:345] = False

    # Remove tip overshoot (x > 349, y < 50)
    main_mask[0:50, 350:W] = False

    # Remove bottom axis overshoot (y > 424)
    main_mask[424:H, :] = False

    # Remove top-left numbers and outer circular arc (y < 150, x < 70)
    main_mask[0:150, 0:70] = False

    # Dilate slightly (1px) to recover soft antialiased shell rim where diff > 12
    dilated = binary_dilation(main_mask, structure=np.ones((3, 3)))
    final_mask = main_mask | (dilated & (diff > 12))

    # Keep boundaries strictly clean
    final_mask[115:185, 260:345] = False
    final_mask[0:50, 350:W] = False
    final_mask[424:H, :] = False
    final_mask[0:150, 0:70] = False

    # Clean dark base
    clean_dark = np.full_like(cleaned, bg_color)
    clean_dark[final_mask] = cleaned[final_mask]

    # Clean alpha base
    alpha = np.zeros((H, W), dtype=float)
    alpha[final_mask] = np.clip((diff[final_mask] - 8) / 25.0, 0.3, 1.0) * 255.0
    # Inside mask > 1px: full opacity
    from scipy.ndimage import distance_transform_edt
    dist_in = distance_transform_edt(final_mask)
    alpha[dist_in >= 1.5] = 255.0
    alpha_smooth = gaussian_filter(alpha, sigma=0.5)
    alpha_smooth[~final_mask] = 0.0

    clean_rgba = np.zeros((H, W, 4), dtype=np.uint8)
    clean_rgba[:, :, :3] = clean_dark
    clean_rgba[:, :, 3] = np.clip(alpha_smooth, 0, 255).astype(np.uint8)

    # 4. Find tight bounding box of the active nautilus shell
    ys, xs = np.where(final_mask)
    y_min, y_max = ys.min(), ys.max()
    x_min, x_max = xs.min(), xs.max()
    shape_h = y_max - y_min + 1
    shape_w = x_max - x_min + 1
    print(f"Shell Shape Bounds: Y=[{y_min}, {y_max}] (H={shape_h}), X=[{x_min}, {x_max}] (W={shape_w})")

    # Crop tightly to the true shape with 2px antialias padding
    crop_ymin = max(0, y_min - 2)
    crop_ymax = min(H, y_max + 3)
    crop_xmin = max(0, x_min - 2)
    crop_xmax = min(W, x_max + 3)

    cropped_dark = clean_dark[crop_ymin:crop_ymax, crop_xmin:crop_xmax]
    cropped_rgba = clean_rgba[crop_ymin:crop_ymax, crop_xmin:crop_xmax]

    cropped_dark_img = Image.fromarray(cropped_dark)
    cropped_rgba_img = Image.fromarray(cropped_rgba, "RGBA")

    # 5. Place into a heroically scaled 1024x1024 canvas ("big as a cutted shape")
    # In 1024x1024, let the shell height be 920px (90% of canvas height)
    target_canvas_size = 1024
    target_h = int(target_canvas_size * 0.90)
    aspect = cropped_rgba_img.width / cropped_rgba_img.height
    target_w = int(target_h * aspect)

    scaled_dark = cropped_dark_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    scaled_rgba = cropped_rgba_img.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Offset to center perfectly in target canvas
    pos_x = (target_canvas_size - target_w) // 2
    pos_y = (target_canvas_size - target_h) // 2

    # A. 1024x1024 Clean Dark HD Emblem
    hd_canvas_dark = Image.new("RGB", (target_canvas_size, target_canvas_size), tuple(bg_color))
    # Paste transparent RGBA on dark canvas for smooth edge blending
    hd_canvas_dark.paste(scaled_rgba, (pos_x, pos_y), mask=scaled_rgba.split()[3])
    hd_canvas_dark.save(os.path.join(out_dir, "cambium-emblem-hd.png"), "PNG")
    print("Saved cambium-emblem-hd.png (1024x1024)")

    # B. 1024x1024 Pure Transparent Cut-out Shape Mark
    hd_canvas_trans = Image.new("RGBA", (target_canvas_size, target_canvas_size), (0, 0, 0, 0))
    hd_canvas_trans.paste(scaled_rgba, (pos_x, pos_y), mask=scaled_rgba.split()[3])
    hd_canvas_trans.save(os.path.join(out_dir, "cambium-emblem-transparent.png"), "PNG")
    print("Saved cambium-emblem-transparent.png (1024x1024)")

    # C. 512x512 Master Emblem
    emblem_512 = hd_canvas_dark.resize((512, 512), Image.Resampling.LANCZOS)
    emblem_512.save(os.path.join(out_dir, "cambium-emblem.png"), "PNG")
    print("Saved cambium-emblem.png (512x512)")

    # D. 512x512 Circular Badge
    circle_512 = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    circle_mask = Image.new("L", (512, 512), 0)
    draw_c = ImageDraw.Draw(circle_mask)
    draw_c.ellipse((6, 6, 506, 506), fill=255)
    circle_512.paste(emblem_512.convert("RGBA"), (0, 0), mask=circle_mask)
    circle_512.save(os.path.join(out_dir, "cambium-emblem-circle.png"), "PNG")
    print("Saved cambium-emblem-circle.png (512x512)")

    # E. Multi-resolution Icons
    for sz in [16, 32, 48, 64, 128, 180, 192, 256]:
        icon_res = circle_512.resize((sz, sz), Image.Resampling.LANCZOS)
        icon_res.save(os.path.join(out_dir, f"cambium-icon-{sz}.png"), "PNG")
        if sz == 180:
            icon_res.save(os.path.join(out_dir, "apple-touch-icon.png"), "PNG")
    print("Saved multi-res icons (16..256)")

    # F. Favicon.ico with multiple icon sizes
    circle_512.save(
        os.path.join(out_dir, "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
    )
    print("Saved favicon.ico")

    # G. Base64 encode for self-contained SVGs
    icon_128_path = os.path.join(out_dir, "cambium-icon-128.png")
    with open(icon_128_path, "rb") as f:
        b64_png = base64.b64encode(f.read()).decode("utf-8")

    svg_dark = f"""<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Cambium Logo — Fibonacci Golden Spiral (Dark)</title>
  <defs>
    <clipPath id="cambiumCircleClip">
      <circle cx="18" cy="18" r="17" />
    </clipPath>
  </defs>
  <circle cx="18" cy="18" r="17.5" fill="#092026" stroke="#4ADE80" stroke-opacity="0.4" stroke-width="1"/>
  <g clip-path="url(#cambiumCircleClip)">
    <image href="data:image/png;base64,{b64_png}" x="0.5" y="0.5" width="35" height="35" preserveAspectRatio="xMidYMid meet" />
  </g>
</svg>"""

    svg_light = f"""<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Cambium Logo — Fibonacci Golden Spiral (Light)</title>
  <defs>
    <clipPath id="cambiumLightCircleClip">
      <circle cx="18" cy="18" r="17" />
    </clipPath>
  </defs>
  <circle cx="18" cy="18" r="17.5" fill="#092026" stroke="#3E6248" stroke-opacity="0.4" stroke-width="1"/>
  <g clip-path="url(#cambiumLightCircleClip)">
    <image href="data:image/png;base64,{b64_png}" x="0.5" y="0.5" width="35" height="35" preserveAspectRatio="xMidYMid meet" />
  </g>
</svg>"""

    with open(os.path.join(out_dir, "cambium-logo-dark.svg"), "w", encoding="utf-8") as f:
        f.write(svg_dark)
    with open(os.path.join(out_dir, "cambium-logo-light.svg"), "w", encoding="utf-8") as f:
        f.write(svg_light)
    with open(os.path.join(out_dir, "favicon.svg"), "w", encoding="utf-8") as f:
        f.write(svg_dark)
    with open(os.path.join(out_dir, "favicon-dark.svg"), "w", encoding="utf-8") as f:
        f.write(svg_dark)
    with open(os.path.join(out_dir, "favicon-light.svg"), "w", encoding="utf-8") as f:
        f.write(svg_light)

    app_icon_path = r"d:\01_PROJECTS\ACTIVE\S92_Imthiyas_Capstone_Cambium\client\app\icon.svg"
    with open(app_icon_path, "w", encoding="utf-8") as f:
        f.write(svg_dark)

    print("ALL LOGO ASSETS AND SVGS GENERATED SUCCESSFULLY!")

if __name__ == "__main__":
    clean_and_build_logos()
