# Cambium Research — Accessibility & Responsive Usability Verification

## 1. Automated WCAG 2.2 AA Checks

- `tests/e2e/05-accessibility-audit.spec.ts` executes `@axe-core/playwright` with tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, and `wcag22aa` across both public (`/`, `/sign-in`) and authenticated protected views (`/dashboard`, `/opportunities`, `/graph`, `/agent-reader`).
- `tests/unit/03-design-tokens-and-wcag.spec.ts` enforces WCAG 2.2 AA contrast ratios (`>= 4.5:1` normal text, `>= 3.0:1` large text) and APCA lightness contrast (`Lc`) directly against `tokens/cambium.tokens.json`.

## 2. Responsive Layout Guarantees

- `tests/e2e/07-journeys-isolation-and-responsive.spec.ts` checks viewport widths `375x812` (mobile) and `1440x900` (desktop) to ensure `document.documentElement.scrollWidth <= document.documentElement.clientWidth` (no unintentional horizontal overflow).
