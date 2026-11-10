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

const v1Match = svg.match(/id="Vector"[^>]*d="([^"]+)"/);
const v2Match = svg.match(/id="Vector_2"[^>]*d="([^"]+)"/);

const pts1 = parsePath(v1Match[1]);
const pts2 = parsePath(v2Match[1]);

function getStats(pts, stroke) {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = maxX - minX;
  const h = maxY - minY;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const avgX = xs.reduce((a, b) => a + b, 0) / xs.length;
  const avgY = ys.reduce((a, b) => a + b, 0) / ys.length;
  return {
    minX: +minX.toFixed(3),
    maxX: +maxX.toFixed(3),
    minY: +minY.toFixed(3),
    maxY: +maxY.toFixed(3),
    w: +w.toFixed(3),
    h: +h.toFixed(3),
    bboxCenter: { x: +cx.toFixed(3), y: +cy.toFixed(3) },
    centroid: { x: +avgX.toFixed(3), y: +avgY.toFixed(3) },
    strokeBounds: {
      minX: +(minX - stroke / 2).toFixed(3),
      maxX: +(maxX + stroke / 2).toFixed(3),
      minY: +(minY - stroke / 2).toFixed(3),
      maxY: +(maxY + stroke / 2).toFixed(3),
      w: +(w + stroke).toFixed(3),
      h: +(h + stroke).toFixed(3),
      cx: +cx.toFixed(3),
      cy: +cy.toFixed(3),
    },
  };
}

console.log("=== LOGO GEOMETRY ANALYSIS ===");
console.log("Vector 1 (Muted Inner/Left Spiral, stroke=1.3):");
console.log(JSON.stringify(getStats(pts1, 1.3), null, 2));

console.log("\nVector 2 (Primary Thick Spiral, stroke=2.0):");
console.log(JSON.stringify(getStats(pts2, 2.0), null, 2));

const allPts = [...pts1, ...pts2];
console.log("\nCombined Vectors (stroke=2.0):");
console.log(JSON.stringify(getStats(allPts, 2.0), null, 2));

