import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDir = path.resolve(__dirname, "..");
const srcDir = path.join(clientDir, "public_logo");
const destDir = path.join(clientDir, "public", "public_logo");
const publicDir = path.join(clientDir, "public");

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (fs.existsSync(srcDir)) {
  copyDirRecursive(srcDir, destDir);
  console.log(`[sync-logos] Synchronized ${srcDir} -> ${destDir}`);

  // Also copy key root icons to public/ for standard root access
  const rootCopies = [
    { from: "favicon.svg", to: "favicon.svg" },
    { from: "favicon-light.svg", to: "favicon-light.svg" },
    { from: "favicon-dark.svg", to: "favicon-dark.svg" },
    { from: "cambium-logo-light.svg", to: "cambium-logo-light.svg" },
    { from: "cambium-logo-dark.svg", to: "cambium-logo-dark.svg" },
    { from: "cambium-logo-light.svg", to: "logo.svg" }, // Update legacy logo.svg to new design
  ];

  for (const { from, to } of rootCopies) {
    const fromPath = path.join(srcDir, from);
    const toPath = path.join(publicDir, to);
    if (fs.existsSync(fromPath)) {
      fs.copyFileSync(fromPath, toPath);
      console.log(`[sync-logos] Copied ${from} -> public/${to}`);
    }
  }

  // Also sync app/icon.svg for Next.js App Router special icon route
  const appIconSrc = path.join(srcDir, "favicon.svg");
  const appIconDest = path.join(clientDir, "app", "icon.svg");
  if (fs.existsSync(appIconSrc)) {
    fs.copyFileSync(appIconSrc, appIconDest);
    console.log(`[sync-logos] Copied favicon.svg -> app/icon.svg`);
  }
} else {
  console.warn(`[sync-logos] Warning: ${srcDir} does not exist`);
}
