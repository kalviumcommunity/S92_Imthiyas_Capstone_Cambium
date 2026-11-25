# Performance, Accessibility, Compatibility & Security Review (`11-16`)

**Program**: Cambium Research Principal Frontend Engineering Program

---

## 1. Performance & Bundling
- Next.js `16.4.6` Turbopack production build generates **57 static routes** with `next/font/google` zero-CLS font loading (`display: "swap"`) and route-level code splitting.
- Replaced full-page `window.location.href` navigation in `opportunities/page.tsx` with SPA `router.push()`, preserving React Query cache across transitions.
- **Measurement Boundary**: Live Chromium Lighthouse CI (`LCP`, `INP`, `CLS`) against production Vercel URLs was not executed in this offline turn.

## 2. Accessibility & Responsive Standards
- **WCAG 2.2 AA Token Contrast**: Verified programmatically via Jest Suite `03` (`Forest Ink` `#202920` on `#FAF7F0` >= 14:1, `Canopy` `#3E6248` >= 4.5:1 AA).
- **Dialog Semantics & Keyboard**: Radix `DialogContent` and `PaymentCheckoutModal` enforce `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `Escape` key closing.
- **Responsive Shell**: Desktop `GlobalSidebar` pairs with mobile `MobileNavigation` drawer/dock (`md:hidden`) and responsive padding (`pb-14 md:pb-0`) across `(protected)/*`.

## 3. Frontend Security Coordination
- Matches production CSP in `client/next.config.ts` (no `'unsafe-eval'`, strict `connect-src` allowlist, `object-src 'none'`, `frame-ancestors 'none'`) and zero server secrets in `NEXT_PUBLIC_*` client code.
