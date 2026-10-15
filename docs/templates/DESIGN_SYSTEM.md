# Design System Specification (DESIGN_SYSTEM.md)
## Cambium — Living Materials Design System
**W3C DTCG Token Specification · WCAG 2.2 Level AA · APCA Perceptual Readability**

---

### Metadata
- **Document ID**: `DS-CAMBIUM-2026-V2`
- **Product Name**: Cambium Living Materials Design System
- **Design Lead & Architect**: Shaik Mohamed Imthiyas T
- **Status**: `APPROVED / DESIGN SYSTEM BASELINE`
- **Current Version**: `2.0.0`
- **Token Format**: W3C Design Tokens Community Group (DTCG)
- **Token Source of Truth**: [`tokens/cambium.tokens.json`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/tokens/cambium.tokens.json)
- **Repository**: `S92_Imthiyas_Capstone_Cambium`

---

## 1. Product Design Principles & Visual Direction

Cambium’s aesthetic is rooted in **"Living Materials"**—a design philosophy inspired by historical academic publishing, botany, and dendrochronology (the science of tree rings). Unlike sterile SaaS templates, Cambium feels like an organic, living ecosystem where research ideas take root, branch out, and accumulate annual rings of scholarly achievement.

### Core Principles
1. **Material Authenticity**: Surfaces emulate natural textures—warm aged parchment, mineral sand, limestone boundaries, and deep botanical moss.
2. **Cognitive Calm & High Legibility**: Research demands hours of continuous reading. Typography prioritizes ocular comfort with APCA $L_c > 90$ perceptual contrast, avoiding harsh pure black on harsh pure white.
3. **Biological Dynamics**: Micro-animations are biological rather than mechanical—rings expand like annual tree growth, sap flows through medullary rays, and knowledge graphs drift like living organisms.
4. **Radical Accessibility**: Every color pair is audited against WCAG 2.2 Level AA (minimum 4.5:1 for body copy) and APCA contrast algorithms.

---

## 2. Color System & Living Materials Palette

### 2.1 The Master Living Materials

| Token Identifier | Hex Value | Semantic Role | Contrast on Parchment (`#FAF7F0`) | WCAG 2.2 AA / APCA |
| :--- | :--- | :--- | :--- | :--- |
| `color.primitive.forest-ink` | `#202920` | Primary reading ink & authoritative headers. | **14.03:1** (AAA Pass) | APCA $L_c\ 92.4$ |
| `color.primitive.parchment` | `#FAF7F0` | Light theme primary canvas (scholarly paper). | *Base Canvas* | N/A |
| `color.primitive.mineral-sand`| `#F2EBDD` | Secondary section background & sunken cards. | **1.08:1** (Canvas Layer) | N/A |
| `color.primitive.limestone` | `#E4DCCB` | Structural hairline dividers, borders. | **1.26:1** (Non-text border) | N/A |
| `color.primitive.sage-mist` | `#DCE6D7` | Subtle badge backgrounds, active chips. | **1.33:1** (Non-text fill) | N/A |
| `color.primitive.canopy` | `#3E6248` | Primary interactive buttons, text links. | **6.44:1** (AA Pass) | APCA $L_c\ 73.2$ |
| `color.primitive.deep-moss` | `#293E30` | Hover states, dark surface boundaries. | **10.75:1** (AAA Pass) | APCA $L_c\ 85.1$ |
| `color.primitive.living-algae`| `#66866A` | Graphical nodes, SVG accents, display titles. | **3.82:1** *(Restricted to ≥24px or non-text)* | APCA $L_c\ 53.6$ |
| `color.primitive.rootwood` | `#805B43` | Heritage metadata, grants, discipline depth. | **5.62:1** (AA Pass) | APCA $L_c\ 68.4$ |
| `color.primitive.loam` | `#B89A78` | Quantitative chart coordinates & indicators. | **2.65:1** *(Non-text indicators only)* | N/A |
| `color.primitive.bark-grey` | `#62685E` | Secondary captions, timestamps, subtext. | **5.36:1** (AA Pass) | APCA $L_c\ 63.8$ |

### 2.2 Bioluminescent Botanical Dark Mode

| Dark Token Identifier | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| `dark.bg.primary` | `#0E140F` | Deep forest root floor canvas. |
| `dark.bg.card` | `#131C15` | Elevated card surface & sidebar container. |
| `dark.bg.surface` | `#18231B` | Secondary section background (e.g., CTA & Ecosystem). |
| `dark.border.subtle` | `#233327` | Subtle border and card separation line. |
| `dark.text.primary` | `#EDEAE2` | High-contrast warm ivory text on dark surfaces (**13.2:1**). |
| `dark.text.muted` | `#A3B899` | Secondary botanical metadata on dark surfaces (**6.8:1**). |
| `dark.accent.emerald` | `#4ADE80` | Bioluminescent active indicator, pulse dots, live badges. |

### 2.3 Semantic Status Palette (WCAG 2.2 AA Audited)

```
[ Success: #326B49 ]  --> Verified grants, accepted papers, active IRB approvals (5.89:1)
[ Warning: #8A5A12 ]  --> Approaching deadlines, renewal due within 14 days (5.53:1)
[ Error:   #B33D35 ]  --> Validation failures, expired protocols, rejected reviews (5.40:1)
[ Info:    #365F8D ]  --> Scholarly references, institutional ROR links (6.18:1)
```

---

## 3. Typography Hierarchy & Font Scales

The typographic system combines three specialized font families:

1. **`editorial` (Display Serif)**: `Source Serif 4` / `Newsreader` — Used for landing titles, paper titles, quotes, and narrative headers.
2. **`interface` (Functional Sans)**: `Instrument Sans` / `Plus Jakarta Sans` — Used for navigation, interactive buttons, forms, and data tables.
3. **`data` (Technical Monospace)**: `IBM Plex Mono` — Used for DOIs, SHA-256 hashes, timestamps, grant IDs, and line citations (`L42–58`).

```
Scale Token       Size / Line Height    Font Family       Usage
─────────────────────────────────────────────────────────────────────────────
display-xl        64px / 70px (1.09x)   Editorial Serif   Landing Hero Headline
display-l         52px / 58px (1.11x)   Editorial Serif   Section Major Headers
heading-1         40px / 48px (1.20x)   Editorial Serif   Page Titles (Workspace, Graph)
heading-2         28px / 36px (1.28x)   Interface Sans    Card Group Headings
heading-3         20px / 28px (1.40x)   Interface Sans    Modal & Drawer Titles
body-base         16px / 24px (1.50x)   Interface Sans    Default Reading Copy
body-sm           14px / 20px (1.42x)   Interface Sans    List Items, Compact Metadata
caption           12px / 16px (1.33x)   Interface Sans    Badge Labels, Table Headers
data-mono         11px / 16px (1.45x)   Data Monospace    DOIs, Audit Hashes, Line Citations
```

---

## 4. Spacing, Sizing & Touch Targets

The system uses a strict **4px modular grid** with WCAG 2.2 Target Size floors:

```
Token        Value    Example Usage
─────────────────────────────────────────────────────────────────────────────
space.1      4px      Inner icon margins, compact badge padding
space.2      8px      Input padding horizontal, gap between icon & label
space.3      12px     Card inner gap, button padding vertical
space.4      16px     Standard input padding, sidebar gap
space.5      20px     Card compact padding
space.6      24px     Standard container padding, modal body inset
space.8      32px     Section internal separation, grid gaps
space.12     48px     Major container margins
space.16     64px     Section top/bottom padding
space.24     96px     Landing hero section vertical rhythm
```

### WCAG 2.2 Target Size Standards (Criterion 2.5.8)
- **Minimum Interactive Floor**: `24px × 24px` (Hard floor for micro-actions, copy icons).
- **Standard Control Height**: `36px` (Secondary buttons, table row actions, dropdowns).
- **Primary Action Height**: `44px` (Primary CTAs, form submission buttons).

---

## 5. Component Inventory & State Architecture

### 5.1 Primary Button Component
```tsx
// Tokens: bg-[color.primitive.canopy] hover:bg-[color.primitive.deep-moss] text-[color.primitive.parchment]
<button className="h-11 px-6 rounded-xl font-medium text-[15px] bg-[#3E6248] hover:bg-[#293E30] text-[#FAF7F0] shadow-sm hover:shadow-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#4ADE80] focus-visible:ring-offset-2">
  Submit Protocol Amendment
</button>
```

### 5.2 Component State Matrix

| State | Visual Treatment | Accessibility Requirement |
| :--- | :--- | :--- |
| **Default** | Surface background, subtle limestone border (`#E4DCCB`), crisp ink text. | Contrast verified against parent container. |
| **Hover** | Lift `-1px`, shadow elevation step, border darkens to `#3E6248` (light) or `#4ADE80` (dark). | Cursor pointer; transition duration `<= 200ms`. |
| **Focus Visible** | 2px solid ring in `#4ADE80` with 2px offset. | Keyboard Tab navigation outline visible. |
| **Active / Pressed**| Scale `0.98`, background shifts to `#293E30`. | Immediate tactile feedback. |
| **Disabled** | Opacity `0.45`, cursor `not-allowed`, pointer-events none. | `aria-disabled="true"` announced to screen readers. |
| **Loading** | Label hidden or shifted; spinning botanical ring (`animate-spin`). | `aria-busy="true"`, announcement via live region. |

---

## 6. Interaction, Motion & Micro-Animation Specifications

### 6.1 Biological Timing Curves
Mechanical animations (linear/elastic) are prohibited. All transitions follow natural biological easing:
- **Organic Growth Ease**: `cubic-bezier(0.16, 1, 0.3, 1)` (smooth deceleration).
- **Breathing / Mitosis Ease**: `cubic-bezier(0.4, 0, 0.2, 1)` (balanced sine loop).

### 6.2 Motion Guidelines
- **Annual Tree Ring Expansion**: Concentric circles expand outward across 6.5s with opacity fading from `0.45` to `0.0`.
- **Medullary Sap Pulses**: 2.5px glowing beads travel along radial rays over 2.2s–3.0s.
- **Node Drift**: 4 staggered keyframe loops (`animate-drift-1` to `animate-drift-4`) translate nodes by $\pm 6\text{px}$ over 6s–9s.
- **Reduced Motion**: If `@media (prefers-reduced-motion: reduce)` is active, all continuous drift and wave loops **MUST** pause or drop to static opacity.

---

## 7. Loading, Empty, Error & Success Patterns

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPOSITE SYSTEM STATES                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Loading: Skeleton shimmer with limestone bars (#E4DCCB)             │
│    matching real card layout dimensions.                               │
│                                                                        │
│ 2. Empty State: Sand circular icon (#F2EBDD) + editorial italic quote  │
│    + clear primary action ("+ Ingest Manuscript").                     │
│                                                                        │
│ 3. Error State: Soft rose banner (#B33D35/10) + actionable retry button │
│    + exact machine error code in IBM Plex Mono.                        │
│                                                                        │
│ 4. Success State: Forest green check (#326B49) + cryptographic SHA-256  │
│    receipt badge with instant copy action.                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Accessibility & Compliance Verification

### 8.1 Automated CI Verification Gate
Every pull request is automatically audited via `@axe-core/playwright` and Lighthouse CI:
- **Zero WCAG 2.2 AA violations** permitted in pull requests.
- **Keyboard Traps Prohibited**: Modals and drawers must trap focus while open and restore focus on `Escape`.
- **ARIA Landmark Hierarchy**: Pages must contain valid `<header>`, `<nav>`, `<main>`, and `<footer>` regions.
- **Color Independence**: Status information (e.g. deadline expired, protocol approved) must never rely on color alone; an accompanying icon and text label are mandatory.

---

## 9. Design-to-Code Traceability

```
W3C DTCG Token (`tokens/cambium.tokens.json`)
  └── Parsed by PostCSS / Tailwind CSS
        ↓
CSS Custom Properties (`client/app/globals.css`)
  ├── `--color-forest-ink: #202920`
  ├── `--color-parchment: #FAF7F0`
  ├── `--color-canopy: #3E6248`
  └── `--color-living-algae: #66866A`
        ↓
Component Layer (`client/components/*`)
  └── Strict usage of predefined classes and tokens (No ad-hoc inline hex colors)
```
