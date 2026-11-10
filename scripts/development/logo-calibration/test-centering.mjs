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

// Check optical balance at different center points
// Let's test centering on (18, 18) by translating by (dx, dy)
function evaluateCenter(shiftX, shiftY) {
  const t1 = pts1.map(p => ({ x: p.x + shiftX, y: p.y + shiftY }));
  const t2 = pts2.map(p => ({ x: p.x + shiftX, y: p.y + shiftY }));

  // Combined bounds with stroke
  const minX = Math.min(...t1.map(p=>p.x), ...t2.map(p=>p.x)) - 1.0;
  const maxX = Math.max(...t1.map(p=>p.x), ...t2.map(p=>p.x)) + 1.0;
  const minY = Math.min(...t1.map(p=>p.y), ...t2.map(p=>p.y)) - 1.0;
  const maxY = Math.max(...t1.map(p=>p.y), ...t2.map(p=>p.y)) + 1.0;

  // Distances to viewBox edges [0, 36]
  const leftMargin = minX;
  const rightMargin = 36 - maxX;
  const topMargin = minY;
  const bottomMargin = 36 - maxY;

  // Max radius from center (18, 18)
  let maxR = 0;
  for (const p of [...t1, ...t2]) {
    const r = Math.hypot(p.x - 18, p.y - 18) + 1.0; // + half-stroke
    if (r > maxR) maxR = r;
  }

  // Visual mass center
  let len1 = 0, sx1 = 0, sy1 = 0;
  for (let i = 0; i < t1.length - 1; i++) {
    const l = Math.hypot(t1[i+1].x - t1[i].x, t1[i+1].y - t1[i].y) * 1.3 * 0.28;
    len1 += l;
    sx1 += ((t1[i].x + t1[i+1].x)/2) * l;
    sy1 += ((t1[i].y + t1[i+1].y)/2) * l;
  }
  let len2 = 0, sx2 = 0, sy2 = 0;
  for (let i = 0; i < t2.length - 1; i++) {
    const l = Math.hypot(t2[i+1].x - t2[i].x, t2[i+1].y - t2[i].y) * 2.0;
    len2 += l;
    sx2 += ((t2[i].x + t2[i+1].x)/2) * l;
    sy2 += ((t2[i].y + t2[i+1].y)/2) * l;
  }
  const vmx = (sx1 + sx2) / (len1 + len2);
  const vmy = (sy1 + sy2) / (len1 + len2);

  return {
    shiftX, shiftY,
    bounds: { minX: +minX.toFixed(2), maxX: +maxX.toFixed(2), minY: +minY.toFixed(2), maxY: +maxY.toFixed(2) },
    margins: { left: +leftMargin.toFixed(2), right: +rightMargin.toFixed(2), top: +topMargin.toFixed(2), bottom: +bottomMargin.toFixed(2) },
    maxR: +maxR.toFixed(2),
    visualMass: { x: +vmx.toFixed(2), y: +vmy.toFixed(2) },
    distVisualMassFromCenter: +Math.hypot(vmx - 18, vmy - 18).toFixed(2)
  };
}

console.log("Current (no shift):", evaluateCenter(0, 0));

// Candidate 1: Pure Bounding Box Centering (shift by 18 - 19.6875 = -1.6875, 18 - 20.25 = -2.25)
console.log("\nCandidate 1 (Pure Bbox Center):", evaluateCenter(18 - 19.6875, 18 - 20.25));

// Candidate 2: Optical Centering
// Because visual mass was at X=17.55 (left of bbox center 19.69), pure bbox centering puts visual mass at:
// 17.55 - 1.6875 = 15.86 (2.14 units to the left of 18!).
// If visual mass is 2 units to the left, human eyes perceive the spiral as sitting on the left side of the circle!
// To achieve OPTICAL centering, the center of visual mass and outer bounding circle must be balanced!
// Let's test a range of shiftX from -1.6875 to 0.45:
console.log("\nTesting shiftX and shiftY for Optical Balance:");
for (let sx = -1.6875; sx <= 0.5; sx += 0.3) {
  for (let sy = -2.4; sy <= -1.8; sy += 0.2) {
    const res = evaluateCenter(sx, sy);
    if (Math.abs(res.margins.left - res.margins.right) < 4.0 && Math.abs(res.margins.top - res.margins.bottom) < 1.0) {
      console.log(`sx=${sx.toFixed(2)}, sy=${sy.toFixed(2)} => Margins: [L:${res.margins.left}, R:${res.margins.right}, T:${res.margins.top}, B:${res.margins.bottom}], VisualMass: (${res.visualMass.x}, ${res.visualMass.y}), Dist: ${res.distVisualMassFromCenter}`);
    }
  }
}

