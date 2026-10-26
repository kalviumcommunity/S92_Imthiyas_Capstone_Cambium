# ADR 0001: Frontend Framework & Rendering Architecture
**Document ID**: `ADR-CAMBIUM-0001`  
**Status**: `ACCEPTED`  
**Date**: `2026-10-26`  
**Author**: Shaik Mohamed Imthiyas T  
**Component**: Client Presentation Layer (`client/`)  

---

## 1. Context & Problem Statement
Cambium Research requires a modern web frontend capable of satisfying two opposing architectural needs:
1. **Public Scholarly Discoverability (SEO & Instant TTFB)**: Research opportunities, call-for-papers (CFPs), grant notices, and verified scholar profile landing pages must be indexed by Google and academic crawlers with high Core Web Vitals (LCP < 1.8s).
2. **Dense, Interactive Desktop Research Workspace**: Once authenticated, scholars require interactive 2D force-directed knowledge graphs, live PDF manuscript annotation desk (`/agent-reader`), multi-facet Boolean query builders, and complex calendar schedulers (`/os`).

We must choose a frontend foundation that minimizes operational complexity, avoids dual-framework maintenance, maintains strict accessibility (WCAG 2.2 AA), and provides zero-friction developer experience in TypeScript.

---

## 2. Decision Drivers
- **Hybrid SSR / CSR Capability**: Server Components for static public routes; rich Client Components for canvas and WebSockets.
- **TypeScript 5 & React 19 Compatibility**: Future-proof concurrency primitives (`useActionState`, Server Actions, Transitions).
- **Core Web Vitals & Bundle Optimization**: Automatic code splitting, tree shaking, and server-side image/font optimization.
- **Accessibility & Design Token Integration**: Native integration with W3C DTCG Living Materials tokens and Tailwind CSS.
- **Monorepo Cohesion**: Unified TypeScript interfaces shared across client and backend contracts.

---

## 3. Options Considered
1. **Next.js 15 (App Router) + React 19** *(Selected)*
2. **Vite + React 19 SPA (Single Page Application)**
3. **Remix / React Router v7**
4. **Nuxt / SvelteKit**

---

## 4. Evaluation & Comparison Matrix

| Evaluation Criterion (Weight) | Next.js 15 App Router | Vite + React 19 SPA | Remix / RRv7 |
| :--- | :---: | :---: | :---: |
| **Hybrid SSR/CSR Fit (25%)** | 5/5 | 2/5 (CSR only) | 4.5/5 |
| **Developer Experience (20%)** | 4.5/5 | 5/5 | 4/5 |
| **Performance & LCP (15%)** | 5/5 | 3/5 (Large initial bundle) | 4.5/5 |
| **Ecosystem & UI Libraries (15%)** | 5/5 | 4.5/5 | 4/5 |
| **Operational Simplicity (15%)** | 4.5/5 (Node / Docker standalone) | 5/5 (Static Nginx) | 4/5 |
| **Accessibility & SEO (10%)** | 5/5 | 2.5/5 | 4.5/5 |
| **Weighted Score** | **4.78 / 5.0** | **3.48 / 5.0** | **4.28 / 5.0** |

---

## 5. Decision & Rationale
We selected **Next.js 15 (App Router)** paired with **React 19**, **TypeScript 5**, and **Tailwind CSS**.

### Rationale:
- **Server Component Streaming**: The App Router allows 49 static and dynamic routes to be pre-rendered at build time while streaming personalized recommendations via React Suspense boundaries.
- **Client Boundary Isolation**: Interactive tools (`/graph`, `/agent-reader`, `/os`) declare `"use client"` at component leaf boundaries, keeping large data-visualization dependencies out of initial load bundles.
- **Production Standalone Dockerization**: Next.js 15 `output: 'standalone'` builds output minimal Node.js bundles (~140MB Docker image) that deploy reliably in Docker Compose and Kubernetes without vendor lock-in.

---

## 6. Consequences & Operational Impact
### Positive Consequences:
- Perfect SEO indexability for public grant and CFP catalog.
- Zero client-side JavaScript sent for legal, changelog, and documentation pages.
- Native TypeScript integration across all App Router route handlers.

### Negative / Trade-Off Consequences:
- Learning curve surrounding Server vs. Client component boundaries.
- Next.js development server cold-boot compilation times are slightly higher than Vite.

---

## 7. Risks & Mitigations
- **Risk**: Overuse of `"use client"` defeating SSR benefits.
  - *Mitigation*: Lint rules and architectural review mandate that page entrypoints (`page.tsx`) remain Server Components unless client state is strictly mandatory.
- **Risk**: Vercel proprietary platform lock-in.
  - *Mitigation*: All builds run via standardized Docker multi-stage containers using `node:20-alpine` and `next start`, proven in `.github/workflows/ci.yml`.

---

## 8. Authoritative References
- Next.js 15 App Router Architecture: [https://nextjs.org/docs/app](https://nextjs.org/docs/app)
- React 19 Server Components: [https://react.dev/reference/rsc/server-components](https://react.dev/reference/rsc/server-components)
- W3C DTCG Living Materials Tokens: `tokens/cambium.tokens.json`
