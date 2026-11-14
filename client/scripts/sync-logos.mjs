import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientDir = path.resolve(__dirname, "..");
const srcDir = path.join(clientDir, "public_logo");
const destDir = path.join(clientDir, "public", "public_logo");
const publicDir = path.join(clientDir, "public");

function copyIfChanged(src, dest) {
  if (fs.existsSync(dest)) {
    const srcBuf = fs.readFileSync(src);
    const destBuf = fs.readFileSync(dest);
    if (srcBuf.equals(destBuf)) {
      return false;
    }
  }
  fs.copyFileSync(src, dest);
  return true;
}

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
      copyIfChanged(srcPath, destPath);
    }
  }
}

if (fs.existsSync(srcDir)) {
  copyDirRecursive(srcDir, destDir);
  console.log(`[sync-logos] Synchronized ${srcDir} -> ${destDir}`);

  // Also copy key root icons to public/ for standard root access
  const rootCopies = [
    { from: "favicon.svg", to: "favicon.svg" },
    { from: "favicon.ico", to: "favicon.ico" },
    { from: "apple-touch-icon.png", to: "apple-touch-icon.png" },
    { from: "favicon-light.svg", to: "favicon-light.svg" },
    { from: "favicon-dark.svg", to: "favicon-dark.svg" },
    { from: "cambium-logo-light.svg", to: "cambium-logo-light.svg" },
    { from: "cambium-logo-dark.svg", to: "cambium-logo-dark.svg" },
    { from: "cambium-logo-light.svg", to: "logo.svg" }, // Update legacy logo.svg to new design
    { from: "cambium-emblem.png", to: "cambium-emblem.png" },
    { from: "cambium-emblem-circle.png", to: "cambium-emblem-circle.png" },
    { from: "cambium-emblem-hd.png", to: "cambium-emblem-hd.png" },
    { from: "cambium-emblem-transparent.png", to: "cambium-emblem-transparent.png" },
  ];

  for (const { from, to } of rootCopies) {
    const fromPath = path.join(srcDir, from);
    const toPath = path.join(publicDir, to);
    if (fs.existsSync(fromPath)) {
      if (copyIfChanged(fromPath, toPath)) {
        console.log(`[sync-logos] Copied ${from} -> public/${to}`);
      }
    }
  }

  // Also sync app/icon.svg for Next.js App Router special icon route
  const appIconSrc = path.join(srcDir, "favicon.svg");
  const appIconDest = path.join(clientDir, "app", "icon.svg");
  if (fs.existsSync(appIconSrc)) {
    if (copyIfChanged(appIconSrc, appIconDest)) {
      console.log(`[sync-logos] Copied favicon.svg -> app/icon.svg`);
    }
  }
} else {
  console.warn(`[sync-logos] Warning: ${srcDir} does not exist`);
}
