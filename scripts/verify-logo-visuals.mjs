import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const artifactDir = "C:/Users/shaik/.gemini/antigravity/brain/a353e018-efe7-417e-8e2c-cd279f726423";
const publicLogoDir = path.resolve("client/public_logo");

const svgLight = fs.readFileSync(path.join(publicLogoDir, "cambium-logo-light.svg"), "utf-8");
const svgDark = fs.readFileSync(path.join(publicLogoDir, "cambium-logo-dark.svg"), "utf-8");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cambium Logo Verification</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Manrope', sans-serif;
      display: flex;
      flex-direction: row;
      min-height: 100vh;
    }
    .panel {
      flex: 1;
      padding: 48px 36px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .light-panel {
      background: #FAF7F0;
      color: #1A201C;
    }
    .dark-panel {
      background: #0E140F;
      color: #EDEAE2;
    }
    h2 {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.02em;
      border-bottom: 1px solid rgba(128, 128, 128, 0.2);
      padding-bottom: 12px;
    }
    .brand-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .wordmark {
      display: flex;
      align-items: center;
      line-height: 1;
    }
    .wordmark-cambium {
      font-weight: 800;
      letter-spacing: -0.025em;
      text-transform: uppercase;
    }
    .wordmark-research {
      font-weight: 500;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-left: 6px;
    }
    .light-panel .wordmark-cambium { color: #1A201C; }
    .light-panel .wordmark-research { color: #5D7A68; }
    .dark-panel .wordmark-cambium { color: #EDEAE2; }
    .dark-panel .wordmark-research { color: #86EFAC; }

    .size-grid {
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: rgba(128, 128, 128, 0.05);
      padding: 24px;
      border-radius: 12px;
      border: 1px solid rgba(128, 128, 128, 0.15);
    }
    .size-item {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .size-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      width: 70px;
      opacity: 0.65;
    }
    .badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 9999px;
      margin-left: 8px;
    }
    .light-panel .badge {
      background: #DCE6D7;
      color: #3E6248;
      border: 1px solid #E4DCCB;
    }
    .dark-panel .badge {
      background: #1A281E;
      color: #4ADE80;
      border: 1px solid #233327;
    }
    .zoom-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 256px;
      height: 256px;
      border-radius: 16px;
      border: 1px dashed rgba(128, 128, 128, 0.3);
      padding: 16px;
    }
  </style>
</head>
<body>
  <div class="panel light-panel">
    <h2>Parchment Light Theme (#FAF7F0)</h2>
    
    <div class="brand-row">
      <div style="width: 32px; height: 32px;">${svgLight}</div>
      <div class="wordmark">
        <span class="wordmark-cambium" style="font-size: 18px;">CAMBIUM</span>
        <span class="wordmark-research" style="font-size: 18px;">RESEARCH</span>
        <span class="badge">OS</span>
      </div>
    </div>

    <div class="size-grid">
      <div class="size-item">
        <span class="size-label">16px xs</span>
        <div style="width: 16px; height: 16px;">${svgLight}</div>
        <div class="wordmark">
          <span class="wordmark-cambium" style="font-size: 12px;">CAMBIUM</span>
          <span class="wordmark-research" style="font-size: 12px;">RESEARCH</span>
        </div>
      </div>
      <div class="size-item">
        <span class="size-label">20px sm</span>
        <div style="width: 20px; height: 20px;">${svgLight}</div>
        <div class="wordmark">
          <span class="wordmark-cambium" style="font-size: 13.5px;">CAMBIUM</span>
          <span class="wordmark-research" style="font-size: 13.5px;">RESEARCH</span>
        </div>
      </div>
      <div class="size-item">
        <span class="size-label">26px md</span>
        <div style="width: 26px; height: 26px;">${svgLight}</div>
        <div class="wordmark">
          <span class="wordmark-cambium" style="font-size: 16px;">CAMBIUM</span>
          <span class="wordmark-research" style="font-size: 16px;">RESEARCH</span>
        </div>
      </div>
      <div class="size-item">
        <span class="size-label">32px lg</span>
        <div style="width: 32px; height: 32px;">${svgLight}</div>
        <div class="wordmark">
          <span class="wordmark-cambium" style="font-size: 18px;">CAMBIUM</span>
          <span class="wordmark-research" style="font-size: 18px;">RESEARCH</span>
        </div>
      </div>
      <div class="size-item">
        <span class="size-label">48px xl</span>
        <div style="width: 48px; height: 48px;">${svgLight}</div>
        <div class="wordmark">
          <span class="wordmark-cambium" style="font-size: 22px;">CAMBIUM</span>
          <span class="wordmark-research" style="font-size: 22px;">RESEARCH</span>
        </div>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px;">
      <span class="size-label" style="width: auto;">Macro 256px Pure Vector Contour Inspection:</span>
      <div class="zoom-box">
        <div style="width: 220px; height: 220px;">${svgLight}</div>
      </div>
    </div>
  </div>

  <div class="panel dark-panel">
    <h2>Bioluminescent Botanical Dark Theme (#0E140F)</h2>
    
    <div class="brand-row">
      <div style="width: 32px; height: 32px;">${svgDark}</div>
      <div class="wordmark">
        <span class="wordmark-cambium" style="font-size: 18px;">CAMBIUM</span>
        <span class="wordmark-research" style="font-size: 18px;">RESEARCH</span>
        <span class="badge">OS</span>
      </div>
    </div>

    <div class="size-grid">
      <div class="size-item">
        <span class="size-label">16px xs</span>
        <div style="width: 16px; height: 16px;">${svgDark}</div>
        <div class="wordmark">
          <span class="wordmark-cambium" style="font-size: 12px;">CAMBIUM</span>
          <span class="wordmark-research" style="font-size: 12px;">RESEARCH</span>
        </div>
      </div>
      <div class="size-item">
        <span class="size-label">20px sm</span>
        <div style="width: 20px; height: 20px;">${svgDark}</div>
        <div class="wordmark">
          <span class="wordmark-cambium" style="font-size: 13.5px;">CAMBIUM</span>
          <span class="wordmark-research" style="font-size: 13.5px;">RESEARCH</span>
        </div>
      </div>
      <div class="size-item">
        <span class="size-label">26px md</span>
        <div style="width: 26px; height: 26px;">${svgDark}</div>
        <div class="wordmark">
          <span class="wordmark-cambium" style="font-size: 16px;">CAMBIUM</span>
          <span class="wordmark-research" style="font-size: 16px;">RESEARCH</span>
        </div>
      </div>
      <div class="size-item">
        <span class="size-label">32px lg</span>
        <div style="width: 32px; height: 32px;">${svgDark}</div>
        <div class="wordmark">
          <span class="wordmark-cambium" style="font-size: 18px;">CAMBIUM</span>
          <span class="wordmark-research" style="font-size: 18px;">RESEARCH</span>
        </div>
      </div>
      <div class="size-item">
        <span class="size-label">48px xl</span>
        <div style="width: 48px; height: 48px;">${svgDark}</div>
        <div class="wordmark">
          <span class="wordmark-cambium" style="font-size: 22px;">CAMBIUM</span>
          <span class="wordmark-research" style="font-size: 22px;">RESEARCH</span>
        </div>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 8px;">
      <span class="size-label" style="width: auto;">Macro 256px Bioluminescent Glow Inspection:</span>
      <div class="zoom-box">
        <div style="width: 220px; height: 220px;">${svgDark}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

const previewHtmlPath = path.join(artifactDir, "logo_visual_verification.html");
fs.writeFileSync(previewHtmlPath, html, "utf-8");

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 950 }, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "networkidle" });
  
  const screenshotPath = path.join(artifactDir, "cambium_logo_pro_comparison.png");
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Saved screenshot to: ${screenshotPath}`);
  
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
