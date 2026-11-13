import os
import base64
from PIL import Image, ImageDraw

def main():
    src_path = r"C:\Users\shaik\.gemini\antigravity\brain\a353e018-efe7-417e-8e2c-cd279f726423\.user_uploaded\media_1794563667202_39692afa.jpg"
    img = Image.open(src_path).convert("RGB")

    out_dir = r"d:\01_PROJECTS\ACTIVE\S92_Imthiyas_Capstone_Cambium\client\public_logo"
    os.makedirs(out_dir, exist_ok=True)

    bg_color = (9, 32, 38)
    canvas_size = 512
    canvas = Image.new("RGB", (canvas_size, canvas_size), bg_color)

    # Offset to center (emblem center is approx x=200, y=235)
    x_off = 256 - 200
    y_off = 256 - 235
    canvas.paste(img, (x_off, y_off))

    # Save square 512
    canvas.save(os.path.join(out_dir, "cambium-emblem.png"), "PNG")
    # Save square 1024 HD
    canvas_hd = canvas.resize((1024, 1024), Image.Resampling.LANCZOS)
    canvas_hd.save(os.path.join(out_dir, "cambium-emblem-hd.png"), "PNG")

    # Circular cropped 512
    mask = Image.new("L", (canvas_size, canvas_size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((8, 8, canvas_size - 8, canvas_size - 8), fill=255)
    circle_img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    circle_canvas = canvas.convert("RGBA")
    circle_img.paste(circle_canvas, (0, 0), mask=mask)
    circle_img.save(os.path.join(out_dir, "cambium-emblem-circle.png"), "PNG")

    # Multi-resolution icons
    for sz in [16, 32, 48, 64, 128, 180, 192, 256]:
        resized = circle_img.resize((sz, sz), Image.Resampling.LANCZOS)
        resized.save(os.path.join(out_dir, f"cambium-icon-{sz}.png"), "PNG")
        if sz == 180:
            resized.save(os.path.join(out_dir, "apple-touch-icon.png"), "PNG")

    # Favicon.ico
    circle_img.save(
        os.path.join(out_dir, "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)]
    )

    # Base64 encode for self-contained SVG
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

    # Also update app icon.svg
    app_icon_path = r"d:\01_PROJECTS\ACTIVE\S92_Imthiyas_Capstone_Cambium\client\app\icon.svg"
    with open(app_icon_path, "w", encoding="utf-8") as f:
        f.write(svg_dark)

    print("SUCCESS: Generated all logo assets, favicons, and self-contained SVGs!")

if __name__ == "__main__":
    main()
