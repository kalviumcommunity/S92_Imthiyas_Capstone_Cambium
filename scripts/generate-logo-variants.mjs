import fs from "fs";

const originalSvg = fs.readFileSync("client/public_logo/cambium-logo-light.svg", "utf8");

function parsePath(d) {
  const commands = [];
  const tokens = d.match(/([a-df-z]|[-+]?[0-9]*\.?[0-9]+(?:e[-+]?[0-9]+)?)/gi);
  let i = 0;
  let cmd = "";
  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[a-z]$/i.test(t)) {
      cmd = t;
      i++;
    } else {
      if (cmd === "M" || cmd === "L") {
        commands.push({ cmd, x: parseFloat(tokens[i]), y: parseFloat(tokens[i + 1]) });
        i += 2;
      } else if (cmd === "V") {
        commands.push({ cmd, y: parseFloat(tokens[i]) });
        i += 1;
      } else if (cmd === "H") {
        commands.push({ cmd, x: parseFloat(tokens[i]) });
        i += 1;
      } else {
        i++;
      }
    }
  }
  return commands;
}

const v1 = originalSvg.match(/id="Vector"[^>]*d="([^"]+)"/)[1];
const v2 = originalSvg.match(/id="Vector_2"[^>]*d="([^"]+)"/)[1];

const cmds1 = parsePath(v1);
const cmds2 = parsePath(v2);

// Reconstruct path with transformation (scale s around (cx, cy), then translate to (targetX, targetY))
function transformPath(cmds, origCenterX, origCenterY, targetX, targetY, scale) {
  let currX = 0, currY = 0;
  const parts = [];

  for (const c of cmds) {
    if (c.cmd === "M" || c.cmd === "L") {
      const x = (c.x - origCenterX) * scale + targetX;
      const y = (c.y - origCenterY) * scale + targetY;
      currX = c.x;
      currY = c.y;
      parts.push(`${c.cmd}${x.toFixed(3)} ${y.toFixed(3)}`);
    } else if (c.cmd === "V") {
      const y = (c.y - origCenterY) * scale + targetY;
      currY = c.y;
      parts.push(`V${y.toFixed(3)}`);
    } else if (c.cmd === "H") {
      const x = (c.x - origCenterX) * scale + targetX;
      currX = c.x;
      parts.push(`H${x.toFixed(3)}`);
    }
  }

  return parts.join("");
}

// Optical Center of original:
// Combined bounding box center is (19.688, 20.250)
// Chebychev enclosing circle center is (19.750, 19.400)
// Let's use (19.688, 20.100) as the balanced optical center
const origCenterX = 19.6875;
const origCenterY = 20.1000;
const targetX = 18.0;
const targetY = 18.0;

function createSvg(scale, theme) {
  const strokeColor = theme === "dark" ? "#4ADE80" : "#173F35";
  const strokeWidth1 = +(1.3 * scale).toFixed(2);
  const strokeWidth2 = +(2.0 * scale).toFixed(2);

  const path1 = transformPath(cmds1, origCenterX, origCenterY, targetX, targetY, scale);
  const path2 = transformPath(cmds2, origCenterX, origCenterY, targetX, targetY, scale);

  return `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="CambiumMark">
    <path id="Vector" opacity="${theme === "dark" ? "0.35" : "0.28"}" d="${path1}" stroke="${strokeColor}" stroke-width="${strokeWidth1}" stroke-linecap="round"/>
    <path id="Vector_2" d="${path2}" stroke="${strokeColor}" stroke-width="${strokeWidth2}" stroke-linecap="round"/>
  </g>
</svg>`;
}

// Generate variants
const scales = [1.0, 1.10, 1.15, 1.20, 1.25];
const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Cambium Logo Alignment & Geometry Comparison</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Manrope', sans-serif; margin: 0; padding: 40px; background: #F4EFE6; color: #1A201C; }
    h1 { font-size: 24px; margin-bottom: 8px; font-weight: 800; }
    p { font-size: 14px; color: #5D7A68; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px; }
    .card { background: #FAF7F0; border: 1px solid #E4DCCB; border-radius: 16px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .card.dark { background: #131C15; border-color: #233327; color: #EDEAE2; }
    .card h3 { margin-top: 0; font-size: 15px; font-weight: 800; display: flex; justify-content: space-between; }
    .badge { font-size: 11px; padding: 2px 8px; border-radius: 99px; background: #DCE6D7; color: #3E6248; font-weight: 600; }
    .dark .badge { background: #18231B; color: #4ADE80; border: 1px solid #233327; }
    .preview-row { display: flex; align-items: center; gap: 16px; margin: 16px 0; }
    .circle-wrap {
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #E4DCCB;
      background: #FAF7F0;
      position: relative;
    }
    .dark .circle-wrap {
      border-color: #233327;
      background: #18231B;
    }
    .circle-wrap.debug::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 1px dashed rgba(255, 0, 0, 0.3);
      pointer-events: none;
    }
    .circle-wrap.debug::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 4px;
      height: 4px;
      background: red;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
    }
    .brand-preview { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
    .brand-text { display: flex; align-items: center; line-height: 1; }
    .brand-cambium { font-weight: 800; letter-spacing: -0.025em; font-size: 15px; }
    .brand-research { font-weight: 500; letter-spacing: 0.04em; font-size: 15px; color: #5D7A68; margin-left: 6px; }
    .dark .brand-research { color: #86EFAC; }
  </style>
</head>
<body>
  <h1>Cambium Logo Mark — Geometry & Alignment Audit</h1>
  <p>Comparing original unaligned SVG vs Mathematically & Optically Centered variants across scale factors.</p>

  <div class="grid">
    <!-- Original Raw SVG (Light) -->
    <div class="card">
      <h3>Original Unaligned Mark <span class="badge" style="background:#FFE4E6;color:#BE123C">Baseline Bug</span></h3>
      <div class="preview-row">
        <div class="circle-wrap debug" style="width: 44px; height: 44px;">
          ${originalSvg.replace('width="36" height="36"', 'width="44" height="44"')}
        </div>
        <div class="circle-wrap debug" style="width: 32px; height: 32px;">
          ${originalSvg.replace('width="36" height="36"', 'width="32" height="32"')}
        </div>
        <div class="circle-wrap debug" style="width: 26px; height: 26px;">
          ${originalSvg.replace('width="36" height="36"', 'width="26" height="26"')}
        </div>
      </div>
      <div class="brand-preview">
        <div class="circle-wrap" style="width: 28px; height: 28px;">
          ${originalSvg.replace('width="36" height="36"', 'width="24" height="24"')}
        </div>
        <div class="brand-text">
          <span class="brand-cambium">CAMBIUM</span>
          <span class="brand-research">RESEARCH</span>
        </div>
      </div>
      <p style="font-size:12px;margin-top:12px;margin-bottom:0;color:#85877B">Notice the downward and rightward shift. The mark touches the right/bottom quadrant.</p>
    </div>

    <!-- Scaled Variants -->
    ${scales.map(s => `
    <div class="card">
      <h3>Optically Centered (Scale: ${s.toFixed(2)}) <span class="badge">Fixed Geometry</span></h3>
      <div class="preview-row">
        <div class="circle-wrap debug" style="width: 44px; height: 44px;">
          ${createSvg(s, 'light').replace('width="36" height="36"', 'width="44" height="44"')}
        </div>
        <div class="circle-wrap debug" style="width: 32px; height: 32px;">
          ${createSvg(s, 'light').replace('width="36" height="36"', 'width="32" height="32"')}
        </div>
        <div class="circle-wrap debug" style="width: 26px; height: 26px;">
          ${createSvg(s, 'light').replace('width="36" height="36"', 'width="26" height="26"')}
        </div>
      </div>
      <div class="brand-preview">
        <div class="circle-wrap" style="width: 28px; height: 28px;">
          ${createSvg(s, 'light').replace('width="36" height="36"', 'width="24" height="24"')}
        </div>
        <div class="brand-text">
          <span class="brand-cambium">CAMBIUM</span>
          <span class="brand-research">RESEARCH</span>
        </div>
      </div>
      <p style="font-size:12px;margin-top:12px;margin-bottom:0;color:#3E6248">Center: (18, 18). Spacing balanced on N/S/E/W axes. Red dot shows container center.</p>
    </div>
    `).join("")}

    <!-- Dark Mode Tests -->
    ${scales.filter(s => s === 1.0 || s === 1.15 || s === 1.20).map(s => `
    <div class="card dark">
      <h3>Dark Surface (Scale: ${s.toFixed(2)}) <span class="badge">Emerald Glow</span></h3>
      <div class="preview-row">
        <div class="circle-wrap debug" style="width: 44px; height: 44px;">
          ${createSvg(s, 'dark').replace('width="36" height="36"', 'width="44" height="44"')}
        </div>
        <div class="circle-wrap debug" style="width: 32px; height: 32px;">
          ${createSvg(s, 'dark').replace('width="36" height="36"', 'width="32" height="32"')}
        </div>
        <div class="circle-wrap debug" style="width: 26px; height: 26px;">
          ${createSvg(s, 'dark').replace('width="36" height="36"', 'width="26" height="26"')}
        </div>
      </div>
      <div class="brand-preview">
        <div class="circle-wrap" style="width: 28px; height: 28px;">
          ${createSvg(s, 'dark').replace('width="36" height="36"', 'width="24" height="24"')}
        </div>
        <div class="brand-text">
          <span class="brand-cambium" style="color:#EDEAE2">CAMBIUM</span>
          <span class="brand-research">RESEARCH</span>
        </div>
      </div>
    </div>
    `).join("")}
  </div>
</body>
</html>`;

fs.writeFileSync("client/public/test-logo-alignment.html", html, "utf8");
console.log("Generated client/public/test-logo-alignment.html successfully!");

