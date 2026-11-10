import fs from "fs";

const svg = fs.readFileSync("client/public_logo/cambium-logo-light.svg", "utf8");

function parsePath(d) {
  const coords = [];
  const tokens = d.match(/([a-df-z]|[-+]?[0-9]*\.?[0-9]+(?:e[-+]?[0-9]+)?)/gi);
  let i = 0;
  let currX = 0, currY = 0;
  let cmd = "";
  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[a-z]$/i.test(t)) {
      cmd = t;
      i++;
    } else {
      if (cmd === "M" || cmd === "L") {
        currX = parseFloat(tokens[i]);
        currY = parseFloat(tokens[i + 1]);
        coords.push({ x: currX, y: currY });
        i += 2;
      } else if (cmd === "V") {
        currY = parseFloat(tokens[i]);
        coords.push({ x: currX, y: currY });
        i += 1;
      } else if (cmd === "H") {
        currX = parseFloat(tokens[i]);
        coords.push({ x: currX, y: currY });
        i += 1;
      } else {
        i++;
      }
    }
  }
  return coords;
}

const v1 = svg.match(/id="Vector"[^>]*d="([^"]+)"/)[1];
const v2 = svg.match(/id="Vector_2"[^>]*d="([^"]+)"/)[1];
const pts1 = parsePath(v1);
const pts2 = parsePath(v2);

// Let's find the enclosing circle radius for any candidate center (cx, cy)
// A candidate center (cx, cy) in original coordinates:
function findMinEnclosingRadius(cx, cy) {
  let maxR = 0;
  for (const p of pts1) {
    const r = Math.hypot(p.x - cx, p.y - cy) + 0.65; // stroke-width 1.3 / 2
    if (r > maxR) maxR = r;
  }
  for (const p of pts2) {
    const r = Math.hypot(p.x - cx, p.y - cy) + 1.0; // stroke-width 2.0 / 2
    if (r > maxR) maxR = r;
  }
  return maxR;
}

// Search for the center point (cx, cy) that minimizes the enclosing circle radius!
// That is the EXACT Chebychev center / minimum enclosing circle center!
let bestCx = 0, bestCy = 0, minR = Infinity;
for (let x = 18; x <= 21; x += 0.05) {
  for (let y = 19; y <= 21.5; y += 0.05) {
    const r = findMinEnclosingRadius(x, y);
    if (r < minR) {
      minR = r;
      bestCx = x;
      bestCy = y;
    }
  }
}

console.log("=== MINIMUM ENCLOSING CIRCLE (Chebychev Center) ===");
console.log(`Optimal Center for Circular Container: (${bestCx.toFixed(3)}, ${bestCy.toFixed(3)})`);
console.log(`Minimum Enclosing Radius: ${minR.toFixed(3)}`);

// Compare radial clearances from this center
function getRadialClearances(cx, cy, circleR) {
  // Check clearances in 8 directions (0, 45, 90, 135, 180, 225, 270, 315 deg)
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  // Directions: 0 = +X (Right), 90 = +Y (Bottom), 180 = -X (Left), 270 = -Y (Top)
  const dirNames = ["East (+X)", "SE", "South (+Y)", "SW", "West (-X)", "NW", "North (-Y)", "NE"];

  const res = {};
  dirNames.forEach((d, i) => {
    const rad = angles[i] * Math.PI / 180;
    const dirX = Math.cos(rad);
    const dirY = Math.sin(rad);

    // Find the max projection of any point + stroke along this direction
    let maxProj = -Infinity;
    for (const p of pts1) {
      const proj = (p.x - cx) * dirX + (p.y - cy) * dirY + 0.65;
      if (proj > maxProj) maxProj = proj;
    }
    for (const p of pts2) {
      const proj = (p.x - cx) * dirX + (p.y - cy) * dirY + 1.0;
      if (proj > maxProj) maxProj = proj;
    }
    res[d] = {
      maxExtrusion: +maxProj.toFixed(2),
      clearanceToCircle: +(circleR - maxProj).toFixed(2)
    };
  });
  return res;
}

console.log("\nClearances for Original viewBox Center (18, 18) with R=15.5:");
console.log(JSON.stringify(getRadialClearances(18, 18, 15.5), null, 2));

console.log("\nClearances for Optimal Circular Center (" + bestCx.toFixed(2) + ", " + bestCy.toFixed(2) + ") with R=15.5:");
console.log(JSON.stringify(getRadialClearances(bestCx, bestCy, 15.5), null, 2));

