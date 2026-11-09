import fs from "fs";

const svg = fs.readFileSync("client/public_logo/cambium-logo-light.svg", "utf8");

function parsePath(d) {
  const points = [];
  const tokens = d.match(/([a-df-z]|[-+]?[0-9]*\.?[0-9]+(?:e[-+]?[0-9]+)?)/gi);
  let i = 0, cmd = "";
  let currX = 0, currY = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[a-z]$/i.test(t)) {
      cmd = t;
      i++;
    } else {
      if (cmd === "M" || cmd === "L") {
        currX = parseFloat(tokens[i]);
        currY = parseFloat(tokens[i + 1]);
        points.push({ x: currX, y: currY });
        i += 2;
      } else if (cmd === "V") {
        currY = parseFloat(tokens[i]);
        points.push({ x: currX, y: currY });
        i += 1;
      } else if (cmd === "H") {
        currX = parseFloat(tokens[i]);
        points.push({ x: currX, y: currY });
        i += 1;
      } else {
        i++;
      }
    }
  }
  return points;
}

const pts1 = parsePath(svg.match(/id="Vector"[^>]*d="([^"]+)"/)[1]);
const pts2 = parsePath(svg.match(/id="Vector_2"[^>]*d="([^"]+)"/)[1]);

const origCX = 19.6875;
const origCY = 20.250;
const scale = 1.15;

const t1 = pts1.map(c => ({ x: (c.x - origCX) * scale + 18, y: (c.y - origCY) * scale + 18 }));
const t2 = pts2.map(c => ({ x: (c.x - origCX) * scale + 18, y: (c.y - origCY) * scale + 18 }));

const all = [...t1, ...t2];
const minX = Math.min(...all.map(p => p.x)) - 1.15;
const maxX = Math.max(...all.map(p => p.x)) + 1.15;
const minY = Math.min(...all.map(p => p.y)) - 1.15;
const maxY = Math.max(...all.map(p => p.y)) + 1.15;

console.log("With scale=1.15, origCX=19.6875, origCY=20.250:");
console.log({
  minX: +minX.toFixed(3),
  maxX: +maxX.toFixed(3),
  minY: +minY.toFixed(3),
  maxY: +maxY.toFixed(3),
  leftMargin: +minX.toFixed(3),
  rightMargin: +(36 - maxX).toFixed(3),
  topMargin: +minY.toFixed(3),
  bottomMargin: +(36 - maxY).toFixed(3),
});
