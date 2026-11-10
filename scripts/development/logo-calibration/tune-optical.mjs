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

function testOffset(dx, dy) {
  // Translate all points by dx, dy
  const t1 = pts1.map(p => ({ x: p.x + dx, y: p.y + dy }));
  const t2 = pts2.map(p => ({ x: p.x + dx, y: p.y + dy }));

  // Combined bounds with stroke
  const minX = Math.min(...t1.map(p=>p.x), ...t2.map(p=>p.x)) - 1.0;
  const maxX = Math.max(...t1.map(p=>p.x), ...t2.map(p=>p.x)) + 1.0;
  const minY = Math.min(...t1.map(p=>p.y), ...t2.map(p=>p.y)) - 1.0;
  const maxY = Math.max(...t1.map(p=>p.y), ...t2.map(p=>p.y)) + 1.0;

  // Clearances to circle centered at (18, 18) with radius R=15
  // Check in 8 directions
  const angles = [0, 45, 90, 135, 180, 225, 270, 315];
  const clearances = angles.map(a => {
    const rad = a * Math.PI / 180;
    const nx = Math.cos(rad);
    const ny = Math.sin(rad);
    let maxProj = -Infinity;
    for (const p of t1) maxProj = Math.max(maxProj, (p.x - 18)*nx + (p.y - 18)*ny + 0.65);
    for (const p of t2) maxProj = Math.max(maxProj, (p.x - 18)*nx + (p.y - 18)*ny + 1.0);
    return +(15.0 - maxProj).toFixed(2);
  });

  // Visual mass
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

  // Clearance variance (smaller is more uniform)
  const avgClearance = clearances.reduce((a,b)=>a+b, 0) / clearances.length;
  const variance = clearances.reduce((a,b)=>a + Math.pow(b - avgClearance, 2), 0) / clearances.length;

  return {
    dx: +dx.toFixed(3),
    dy: +dy.toFixed(3),
    marginsViewBox: { left: +minX.toFixed(2), right: +(36-maxX).toFixed(2), top: +minY.toFixed(2), bottom: +(36-maxY).toFixed(2) },
    clearances8Way: clearances, // [E, SE, S, SW, W, NW, N, NE]
    minClearance: Math.min(...clearances),
    maxClearance: Math.max(...clearances),
    clearanceSpread: +(Math.max(...clearances) - Math.min(...clearances)).toFixed(2),
    visualMass: { x: +vmx.toFixed(2), y: +vmy.toFixed(2) },
    variance: +variance.toFixed(3)
  };
}

// Test fine grid
let best = null;
let minSpread = Infinity;
for (let dx = -2.0; dx <= -1.2; dx += 0.05) {
  for (let dy = -2.5; dy <= -1.5; dy += 0.05) {
    const r = testOffset(dx, dy);
    // Score based on balance of clearances and proximity of visual mass to center
    const score = r.clearanceSpread * 2.0 + Math.hypot(r.visualMass.x - 18, r.visualMass.y - 18);
    if (score < minSpread) {
      minSpread = score;
      best = r;
    }
  }
}

console.log("BEST OPTICAL & GEOMETRIC BALANCE:");
console.log(JSON.stringify(best, null, 2));

// Also print for comparison dx = -1.6875 (bbox) vs dx = -1.5 vs best.dx
console.log("\nCompare Pure Bbox Center (dx = -1.688, dy = -2.25):");
console.log(JSON.stringify(testOffset(-1.6875, -2.25), null, 2));

