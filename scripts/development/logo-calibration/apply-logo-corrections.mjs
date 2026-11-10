import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const clientDir = path.join(rootDir, "client");
const publicLogoDir = path.join(clientDir, "public_logo");

// Original raw paths from light SVG
const originalSvg = fs.readFileSync(path.join(publicLogoDir, "cambium-logo-light.svg"), "utf8");

function parsePath(d) {
  const commands = [];
  const tokens = d.match(/([a-df-z]|[-+]?[0-9]*\.?[0-9]+(?:e[-+]?[0-9]+)?)/gi);
  let i = 0, cmd = "";
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

// Mathematical and optical constants
const origCX = 19.6875;
const origCY = 20.2500;
const targetX = 18.000;
const targetY = 18.000;
const scale = 1.15;

function transformPath(cmds) {
  const parts = [];
  for (const c of cmds) {
    if (c.cmd === "M" || c.cmd === "L") {
      const x = (c.x - origCX) * scale + targetX;
      const y = (c.y - origCY) * scale + targetY;
      parts.push(`${c.cmd}${+x.toFixed(3)} ${+y.toFixed(3)}`);
    } else if (c.cmd === "V") {
      const y = (c.y - origCY) * scale + targetY;
      parts.push(`V${+y.toFixed(3)}`);
    } else if (c.cmd === "H") {
      const x = (c.x - origCX) * scale + targetX;
      parts.push(`H${+x.toFixed(3)}`);
    }
  }
  return parts.join("");
}

const path1 = transformPath(cmds1);
const path2 = transformPath(cmds2);

// Light SVG: #173F35 (Forest Canopy)
const lightSvg = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Cambium Logo — Light Surface</title>
  <g id="CambiumMark">
    <path id="Vector" opacity="0.28" d="${path1}" stroke="#173F35" stroke-width="1.5" stroke-linecap="round"/>
    <path id="Vector_2" d="${path2}" stroke="#173F35" stroke-width="2.3" stroke-linecap="round"/>
  </g>
</svg>
`;

// Dark SVG: #4ADE80 (Emerald Glow)
const darkSvg = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <title>Cambium Logo — Dark Surface</title>
  <g id="CambiumMark">
    <path id="Vector" opacity="0.32" d="${path1}" stroke="#4ADE80" stroke-width="1.5" stroke-linecap="round"/>
    <path id="Vector_2" d="${path2}" stroke="#4ADE80" stroke-width="2.3" stroke-linecap="round"/>
  </g>
</svg>
`;

// Favicon SVG with clean media query
const faviconSvg = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .tile { fill: #F1F0E7; stroke: #173F35; stroke-opacity: .12; }
    .mark-muted { stroke: #173F35; opacity: 0.28; }
    .mark-primary { stroke: #173F35; }
    @media (prefers-color-scheme: dark) {
      .tile { fill: #173F35; stroke: #F1F0E7; stroke-opacity: .18; }
      .mark-muted { stroke: #4ADE80; opacity: 0.32; }
      .mark-primary { stroke: #4ADE80; }
    }
  </style>
  <circle class="tile" cx="18" cy="18" r="17" stroke-width="2"/>
  <g id="CambiumMark">
    <path class="mark-muted" d="${path1}" stroke-width="1.5" stroke-linecap="round"/>
    <path class="mark-primary" d="${path2}" stroke-width="2.3" stroke-linecap="round"/>
  </g>
</svg>
`;

const faviconLightSvg = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="18" cy="18" r="17" fill="#F1F0E7" stroke="#173F35" stroke-opacity="0.12" stroke-width="2"/>
  <g id="CambiumMark">
    <path opacity="0.28" d="${path1}" stroke="#173F35" stroke-width="1.5" stroke-linecap="round"/>
    <path d="${path2}" stroke="#173F35" stroke-width="2.3" stroke-linecap="round"/>
  </g>
</svg>
`;

const faviconDarkSvg = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="18" cy="18" r="17" fill="#173F35" stroke="#F1F0E7" stroke-opacity="0.18" stroke-width="2"/>
  <g id="CambiumMark">
    <path opacity="0.32" d="${path1}" stroke="#4ADE80" stroke-width="1.5" stroke-linecap="round"/>
    <path d="${path2}" stroke="#4ADE80" stroke-width="2.3" stroke-linecap="round"/>
  </g>
</svg>
`;

// Write public_logo files
fs.writeFileSync(path.join(publicLogoDir, "cambium-logo-light.svg"), lightSvg, "utf8");
fs.writeFileSync(path.join(publicLogoDir, "cambium-logo-dark.svg"), darkSvg, "utf8");
fs.writeFileSync(path.join(publicLogoDir, "favicon.svg"), faviconSvg, "utf8");
fs.writeFileSync(path.join(publicLogoDir, "favicon-light.svg"), faviconLightSvg, "utf8");
fs.writeFileSync(path.join(publicLogoDir, "favicon-dark.svg"), faviconDarkSvg, "utf8");

// Also update assets/7b0c5.svg if it exists
const assetPath = path.join(publicLogoDir, "assets", "7b0c5.svg");
if (fs.existsSync(assetPath)) {
  fs.writeFileSync(assetPath, lightSvg, "utf8");
}

console.log("Successfully updated all source SVG logos in client/public_logo!");

