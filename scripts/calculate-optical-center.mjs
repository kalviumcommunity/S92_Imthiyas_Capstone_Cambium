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

// Calculate arc-length weighted centroid
function computeArcLengthCentroid(pts, weight = 1.0) {
  let totalLength = 0;
  let sumX = 0;
  let sumY = 0;

  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.hypot(dx, dy);
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    totalLength += len * weight;
    sumX += midX * len * weight;
    sumY += midY * len * weight;
  }

  return {
    totalLength,
    centroidX: sumX / totalLength,
    centroidY: sumY / totalLength,
  };
}

// Vector 1 has stroke-width 1.3 and opacity 0.28 -> weight = 1.3 * 0.28 = 0.364
// Vector 2 has stroke-width 2.0 and opacity 1.0 -> weight = 2.0 * 1.0 = 2.0
const c1 = computeArcLengthCentroid(pts1, 1.3 * 0.28);
const c2 = computeArcLengthCentroid(pts2, 2.0 * 1.0);

const totalWeight = c1.totalLength + c2.totalLength;
const visualMassX = (c1.centroidX * c1.totalLength + c2.centroidX * c2.totalLength) / totalWeight;
const visualMassY = (c1.centroidY * c1.totalLength + c2.centroidY * c2.totalLength) / totalWeight;

console.log("Vector 1 Weighted Centroid:", c1);
console.log("Vector 2 Weighted Centroid:", c2);
console.log("Overall Visual Mass Centroid:", { visualMassX, visualMassY });

// Mathematical bounding box center of Vector 2:
const xs2 = pts2.map(p => p.x);
const ys2 = pts2.map(p => p.y);
const bbox2Center = {
  x: (Math.min(...xs2) + Math.max(...xs2)) / 2,
  y: (Math.min(...ys2) + Math.max(...ys2)) / 2
};
console.log("Vector 2 Bounding Box Center:", bbox2Center);

// Combined Bounding Box:
const allXs = [...pts1.map(p => p.x), ...pts2.map(p => p.x)];
const allYs = [...pts1.map(p => p.y), ...pts2.map(p => p.y)];
const minX = Math.min(...allXs);
const maxX = Math.max(...allXs);
const minY = Math.min(...allYs);
const maxY = Math.max(...allYs);
const combinedBbox = {
  minX, maxX, minY, maxY,
  w: maxX - minX,
  h: maxY - minY,
  cx: (minX + maxX) / 2,
  cy: (minY + maxY) / 2
};
console.log("Combined Bounding Box:", combinedBbox);

