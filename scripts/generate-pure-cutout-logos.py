import os
import re
from PIL import Image, ImageDraw

def main():
    root_dir = r"d:\01_PROJECTS\ACTIVE\S92_Imthiyas_Capstone_Cambium"
    public_logo_dir = os.path.join(root_dir, "client", "public_logo")
    public_dir = os.path.join(root_dir, "client", "public")
    dest_public_logo_dir = os.path.join(public_dir, "public_logo")
    app_dir = os.path.join(root_dir, "client", "app")

    os.makedirs(public_logo_dir, exist_ok=True)
    os.makedirs(dest_public_logo_dir, exist_ok=True)

    asset_svg_path = os.path.join(public_logo_dir, "assets", "7b0c5.svg")
    with open(asset_svg_path, "r", encoding="utf-8") as f:
        svg_content = f.read()

    # Extract path d attributes
    d_matches = re.findall(r'd="([^"]+)"', svg_content)
    if len(d_matches) < 2:
        raise ValueError("Could not find both paths in 7b0c5.svg")
    echo_d = d_matches[0]
    primary_d = d_matches[1]

    # 1. cambium-logo-light.svg (for light backgrounds: Canopy Green #3E6248, Algae #66866A)
    light_svg = f'''<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Cambium Logo — Fibonacci Golden Spiral (Light)</title>
  <g id="CambiumMark">
    <path id="EchoSpiral" opacity="0.35" d="{echo_d}" stroke="#66866A" stroke-width="1.6" stroke-linecap="round"/>
    <path id="PrimarySpiral" d="{primary_d}" stroke="#3E6248" stroke-width="2.4" stroke-linecap="round"/>
  </g>
</svg>'''

    # 2. cambium-logo-dark.svg (for dark backgrounds: Emerald Glow #4ADE80, Algae #66866A)
    dark_svg = f'''<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Cambium Logo — Fibonacci Golden Spiral (Dark)</title>
  <g id="CambiumMark">
    <path id="EchoSpiral" opacity="0.5" d="{echo_d}" stroke="#66866A" stroke-width="1.6" stroke-linecap="round"/>
    <path id="PrimarySpiral" d="{primary_d}" stroke="#4ADE80" stroke-width="2.4" stroke-linecap="round"/>
  </g>
</svg>'''

    # 3. favicon.svg (Adaptive with prefers-color-scheme media query, zero background)
    favicon_svg = f'''<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Cambium Logo — Fibonacci Golden Spiral</title>
  <style>
    .spiral-echo {{ stroke: #66866A; opacity: 0.45; }}
    .spiral-primary {{ stroke: #3E6248; }}
    @media (prefers-color-scheme: dark) {{
      .spiral-echo {{ stroke: #66866A; opacity: 0.6; }}
      .spiral-primary {{ stroke: #4ADE80; }}
    }}
  </style>
  <g id="CambiumMark">
    <path class="spiral-echo" d="{echo_d}" stroke-width="1.6" stroke-linecap="round"/>
    <path class="spiral-primary" d="{primary_d}" stroke-width="2.4" stroke-linecap="round"/>
  </g>
</svg>'''

    # Write SVG files to public_logo/
    targets = [
        ("cambium-logo-light.svg", light_svg),
        ("cambium-logo-dark.svg", dark_svg),
        ("favicon-light.svg", light_svg),
        ("favicon-dark.svg", dark_svg),
        ("favicon.svg", favicon_svg),
    ]

    for fname, content in targets:
        p1 = os.path.join(public_logo_dir, fname)
        with open(p1, "w", encoding="utf-8") as f:
            f.write(content)
        p2 = os.path.join(dest_public_logo_dir, fname)
        with open(p2, "w", encoding="utf-8") as f:
            f.write(content)
        p3 = os.path.join(public_dir, fname)
        with open(p3, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Wrote {fname}")

    # Also update app/icon.svg
    app_icon_path = os.path.join(app_dir, "icon.svg")
    with open(app_icon_path, "w", encoding="utf-8") as f:
        f.write(favicon_svg)
    print("Updated client/app/icon.svg")

    # Generate transparent high-res PNG & ICO from the mathematical curve
    def parse_svg_path(path_str):
        # Tokens: M x y, L x y, V y, H x
        tokens = re.findall(r'([MLVH])|([-+]?[0-9]*\.?[0-9]+)', path_str)
        points = []
        cur_cmd = 'M'
        last_x, last_y = 0.0, 0.0
        idx = 0
        while idx < len(tokens):
            t = tokens[idx]
            if t[0]:
                cur_cmd = t[0]
                idx += 1
            else:
                if cur_cmd == 'M' or cur_cmd == 'L':
                    x = float(tokens[idx][1])
                    y = float(tokens[idx+1][1])
                    last_x, last_y = x, y
                    points.append((x, y))
                    idx += 2
                elif cur_cmd == 'V':
                    y = float(tokens[idx][1])
                    last_y = y
                    points.append((last_x, y))
                    idx += 1
                elif cur_cmd == 'H':
                    x = float(tokens[idx][1])
                    last_x = x
                    points.append((x, last_y))
                    idx += 1
                else:
                    idx += 1
        return points

    echo_pts = parse_svg_path(echo_d)
    primary_pts = parse_svg_path(primary_d)

    # Render at 1024x1024 on transparent canvas with anti-aliasing
    canvas_size = 1024
    scale = canvas_size / 36.0

    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw echo spiral in algae green
    scaled_echo = [(x * scale, y * scale) for x, y in echo_pts]
    for i in range(len(scaled_echo) - 1):
        draw.line([scaled_echo[i], scaled_echo[i+1]], fill=(102, 134, 106, 110), width=int(1.6 * scale), joint="curve")

    # Draw primary spiral in radiant emerald (#4ADE80 for clear visibility on dark or light tabs)
    scaled_primary = [(x * scale, y * scale) for x, y in primary_pts]
    for i in range(len(scaled_primary) - 1):
        draw.line([scaled_primary[i], scaled_primary[i+1]], fill=(74, 222, 128, 255), width=int(2.4 * scale), joint="curve")

    # Save high-res master transparent PNG
    hd_path = os.path.join(public_logo_dir, "cambium-emblem-hd.png")
    img.save(hd_path, "PNG")
    img.save(os.path.join(public_dir, "cambium-emblem-hd.png"), "PNG")
    img.save(os.path.join(dest_public_logo_dir, "cambium-emblem-hd.png"), "PNG")

    trans_path = os.path.join(public_logo_dir, "cambium-emblem-transparent.png")
    img.save(trans_path, "PNG")
    img.save(os.path.join(public_dir, "cambium-emblem-transparent.png"), "PNG")
    img.save(os.path.join(dest_public_logo_dir, "cambium-emblem-transparent.png"), "PNG")

    # Replace cambium-emblem-circle.png and cambium-emblem.png with transparent cut-out as well!
    circle_path = os.path.join(public_logo_dir, "cambium-emblem-circle.png")
    img.save(circle_path, "PNG")
    img.save(os.path.join(public_dir, "cambium-emblem-circle.png"), "PNG")
    img.save(os.path.join(dest_public_logo_dir, "cambium-emblem-circle.png"), "PNG")

    emblem_path = os.path.join(public_logo_dir, "cambium-emblem.png")
    img.save(emblem_path, "PNG")
    img.save(os.path.join(public_dir, "cambium-emblem.png"), "PNG")
    img.save(os.path.join(dest_public_logo_dir, "cambium-emblem.png"), "PNG")

    # Export multi-resolution sizes (16, 32, 48, 64, 128, 180, 192, 256)
    sizes = [16, 32, 48, 64, 128, 180, 192, 256]
    resized_images = []
    for s in sizes:
        resized = img.resize((s, s), Image.Resampling.LANCZOS)
        out_name = f"cambium-icon-{s}.png"
        resized.save(os.path.join(public_logo_dir, out_name), "PNG")
        resized.save(os.path.join(dest_public_logo_dir, out_name), "PNG")
        if s == 180:
            resized.save(os.path.join(public_logo_dir, "apple-touch-icon.png"), "PNG")
            resized.save(os.path.join(public_dir, "apple-touch-icon.png"), "PNG")
            resized.save(os.path.join(dest_public_logo_dir, "apple-touch-icon.png"), "PNG")
        if s in [16, 32, 48, 64]:
            resized_images.append(resized)

    # Save transparent multi-res favicon.ico
    ico_path = os.path.join(public_logo_dir, "favicon.ico")
    resized_images[0].save(
        ico_path,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
        append_images=resized_images[1:]
    )
    # Copy favicon.ico to public/ and public/public_logo/
    resized_images[0].save(
        os.path.join(public_dir, "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
        append_images=resized_images[1:]
    )
    resized_images[0].save(
        os.path.join(dest_public_logo_dir, "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
        append_images=resized_images[1:]
    )
    print("Generated all transparent cut-out PNGs and transparent favicon.ico successfully!")

if __name__ == "__main__":
    main()
