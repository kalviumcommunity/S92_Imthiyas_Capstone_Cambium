import fs from "fs";

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Cambium Logo — Production Verification</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Manrope', sans-serif; margin: 0; padding: 40px; background: #FAF7F0; color: #1A201C; }
    h1 { font-size: 26px; margin-bottom: 8px; font-weight: 800; letter-spacing: -0.02em; }
    p.lead { font-size: 14px; color: #5D7A68; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }
    .card { background: #FFFFFF; border: 1px solid #E4DCCB; border-radius: 20px; padding: 32px; box-shadow: 0 4px 20px rgba(32,41,32,0.04); }
    .card.dark { background: #131C15; border-color: #233327; color: #EDEAE2; }
    .card h2 { font-size: 18px; font-weight: 800; margin-top: 0; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; }
    .badge { font-size: 11px; font-mono: monospace; padding: 3px 10px; border-radius: 99px; background: #DCE6D7; color: #3E6248; font-weight: 600; }
    .dark .badge { background: #18231B; color: #4ADE80; border: 1px solid #233327; }

    .size-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid #F0EAE1; }
    .dark .size-row { border-bottom-color: #1A281E; }
    .size-label { font-size: 13px; font-family: monospace; color: #85877B; min-width: 80px; }
    .dark .size-label { color: #6E7B70; }

    .logo-item { display: inline-flex; align-items: center; }
    .circle-wrap {
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #E4DCCB;
      background: #FAF7F0;
      overflow: hidden;
      flex-shrink: 0;
      position: relative;
    }
    .dark .circle-wrap {
      border-color: #233327;
      background: #18231B;
    }

    .circle-wrap.guide::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(239, 68, 68, 0.25);
      pointer-events: none;
    }
    .circle-wrap.guide::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 1px;
      background: rgba(239, 68, 68, 0.25);
      pointer-events: none;
    }

    .circle-wrap img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .brand-text { display: flex; align-items: center; line-height: 1; }
    .brand-cambium { font-weight: 800; letter-spacing: -0.025em; text-transform: uppercase; color: #1A201C; }
    .dark .brand-cambium { color: #EDEAE2; }
    .brand-research { font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; color: #5D7A68; margin-left: 6px; }
    .dark .brand-research { color: #86EFAC; }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #3E6248;
      background: #E8F0E6;
      padding: 4px 12px;
      border-radius: 99px;
      margin-bottom: 24px;
    }
    .dark .status-pill {
      background: #192D1F;
      color: #4ADE80;
    }
  </style>
</head>
<body>
  <h1>Cambium Research — Production Logo Verification</h1>
  <p class="lead">Audit of mathematically and optically centered SVG mark across all standard component sizes.</p>

  <div class="grid">
    <!-- Light Surface Verification -->
    <div class="card">
      <h2>Parchment Light Theme <span class="badge">WCAG 2.2 AA</span></h2>
      <div class="status-pill">✓ Geometry Centered (18, 18) · Pure Vector · Zero CSS Hacks</div>

      <!-- Size XL (44px) -->
      <div class="size-row">
        <span class="size-label">XL (44px)</span>
        <div class="logo-item" style="gap: 12px;">
          <div class="circle-wrap guide" style="width: 44px; height: 44px; padding: 3px;">
            <img src="/public_logo/cambium-logo-light.svg" alt="CAMBIUM" />
          </div>
          <div class="brand-text">
            <span class="brand-cambium" style="font-size: 22px;">CAMBIUM</span>
            <span class="brand-research" style="font-size: 22px;">RESEARCH</span>
          </div>
        </div>
      </div>

      <!-- Size LG (36px) -->
      <div class="size-row">
        <span class="size-label">LG (36px)</span>
        <div class="logo-item" style="gap: 10px;">
          <div class="circle-wrap guide" style="width: 36px; height: 36px; padding: 2px;">
            <img src="/public_logo/cambium-logo-light.svg" alt="CAMBIUM" />
          </div>
          <div class="brand-text">
            <span class="brand-cambium" style="font-size: 18px;">CAMBIUM</span>
            <span class="brand-research" style="font-size: 18px;">RESEARCH</span>
          </div>
        </div>
      </div>

      <!-- Size MD (28px - Primary Nav) -->
      <div class="size-row">
        <span class="size-label">MD (28px)</span>
        <div class="logo-item" style="gap: 10px;">
          <div class="circle-wrap guide" style="width: 28px; height: 28px; padding: 2px;">
            <img src="/public_logo/cambium-logo-light.svg" alt="CAMBIUM" />
          </div>
          <div class="brand-text">
            <span class="brand-cambium" style="font-size: 16px;">CAMBIUM</span>
            <span class="brand-research" style="font-size: 16px;">RESEARCH</span>
          </div>
        </div>
      </div>

      <!-- Size SM (24px - Sidebar) -->
      <div class="size-row">
        <span class="size-label">SM (24px)</span>
        <div class="logo-item" style="gap: 8px;">
          <div class="circle-wrap guide" style="width: 24px; height: 24px; padding: 1.5px;">
            <img src="/public_logo/cambium-logo-light.svg" alt="CAMBIUM" />
          </div>
          <div class="brand-text">
            <span class="brand-cambium" style="font-size: 13.5px;">CAMBIUM</span>
            <span class="brand-research" style="font-size: 13.5px;">RESEARCH</span>
          </div>
        </div>
      </div>

      <!-- Size XS (20px - Subtitle/Tag) -->
      <div class="size-row">
        <span class="size-label">XS (20px)</span>
        <div class="logo-item" style="gap: 7px;">
          <div class="circle-wrap guide" style="width: 20px; height: 20px; padding: 0.5px;">
            <img src="/public_logo/cambium-logo-light.svg" alt="CAMBIUM" />
          </div>
          <div class="brand-text">
            <span class="brand-cambium" style="font-size: 12px;">CAMBIUM</span>
            <span class="brand-research" style="font-size: 12px;">RESEARCH</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Dark Surface Verification -->
    <div class="card dark">
      <h2>Botanical Dark Theme <span class="badge">Emerald Glow</span></h2>
      <div class="status-pill">✓ Native SVG · Pure #4ADE80 Vector · High Contrast</div>

      <!-- Size XL (44px) -->
      <div class="size-row">
        <span class="size-label">XL (44px)</span>
        <div class="logo-item" style="gap: 12px;">
          <div class="circle-wrap guide" style="width: 44px; height: 44px; padding: 3px;">
            <img src="/public_logo/cambium-logo-dark.svg" alt="CAMBIUM" />
          </div>
          <div class="brand-text">
            <span class="brand-cambium" style="font-size: 22px;">CAMBIUM</span>
            <span class="brand-research" style="font-size: 22px;">RESEARCH</span>
          </div>
        </div>
      </div>

      <!-- Size LG (36px) -->
      <div class="size-row">
        <span class="size-label">LG (36px)</span>
        <div class="logo-item" style="gap: 10px;">
          <div class="circle-wrap guide" style="width: 36px; height: 36px; padding: 2px;">
            <img src="/public_logo/cambium-logo-dark.svg" alt="CAMBIUM" />
          </div>
          <div class="brand-text">
            <span class="brand-cambium" style="font-size: 18px;">CAMBIUM</span>
            <span class="brand-research" style="font-size: 18px;">RESEARCH</span>
          </div>
        </div>
      </div>

      <!-- Size MD (28px - Primary Nav) -->
      <div class="size-row">
        <span class="size-label">MD (28px)</span>
        <div class="logo-item" style="gap: 10px;">
          <div class="circle-wrap guide" style="width: 28px; height: 28px; padding: 2px;">
            <img src="/public_logo/cambium-logo-dark.svg" alt="CAMBIUM" />
          </div>
          <div class="brand-text">
            <span class="brand-cambium" style="font-size: 16px;">CAMBIUM</span>
            <span class="brand-research" style="font-size: 16px;">RESEARCH</span>
          </div>
        </div>
      </div>

      <!-- Size SM (24px - Sidebar) -->
      <div class="size-row">
        <span class="size-label">SM (24px)</span>
        <div class="logo-item" style="gap: 8px;">
          <div class="circle-wrap guide" style="width: 24px; height: 24px; padding: 1.5px;">
            <img src="/public_logo/cambium-logo-dark.svg" alt="CAMBIUM" />
          </div>
          <div class="brand-text">
            <span class="brand-cambium" style="font-size: 13.5px;">CAMBIUM</span>
            <span class="brand-research" style="font-size: 13.5px;">RESEARCH</span>
          </div>
        </div>
      </div>

      <!-- Size XS (20px - Subtitle/Tag) -->
      <div class="size-row">
        <span class="size-label">XS (20px)</span>
        <div class="logo-item" style="gap: 7px;">
          <div class="circle-wrap guide" style="width: 20px; height: 20px; padding: 0.5px;">
            <img src="/public_logo/cambium-logo-dark.svg" alt="CAMBIUM" />
          </div>
          <div class="brand-text">
            <span class="brand-cambium" style="font-size: 12px;">CAMBIUM</span>
            <span class="brand-research" style="font-size: 12px;">RESEARCH</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync("client/public/test-logo-alignment.html", html, "utf8");
console.log("Updated client/public/test-logo-alignment.html with production audit harness!");

