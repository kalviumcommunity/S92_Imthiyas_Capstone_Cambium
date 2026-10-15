<div align="center">

<img src="public/logo.svg" width="56" height="56" alt="Cambium Client Logo" />

# @cambium/client
### Frontend Product Application · Next.js 15 App Router & React 19
**Living Materials Design Tokens · 23 Protected Scholarly Routes · Real-Time Canvas**

[![Next.js](https://img.shields.io/badge/Next.js-15.2%20App%20Router-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-202920?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7%20Strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WCAG](https://img.shields.io/badge/WCAG-2.2%20AA%20Compliant-4ADE80?style=flat-square)](https://www.w3.org/WAI/WCAG22/quickref/)

</div>

---

## 📌 Package Overview

`@cambium/client` is the presentation tier of the **Cambium Enterprise Research Operating System**. Built on **Next.js 15 App Router** and **React 19**, it provides high-throughput discovery interfaces, interactive 2D citation graphs, multi-agent reader desks, and laboratory administration dashboards with sub-100ms client route transitions.

All interfaces strictly adhere to the **Living Materials Design System** ([`tokens/cambium.tokens.json`](../tokens/cambium.tokens.json)), guaranteeing zero ocular fatigue during extended academic reading and 100% compliance with WCAG 2.2 Level AA and APCA perceptual readability standards.

---

## 📂 Architecture & Directory Structure

```
client/
├── app/                                # Next.js 15 App Router Root
│   ├── (auth)/                         # Public authentication views
│   │   ├── sign-in/page.tsx            # Institutional login & SAML SSO
│   │   └── sign-up/page.tsx            # Researcher onboarding
│   ├── (protected)/                    # 23 Guarded enterprise routes
│   │   ├── layout.tsx                  # Global persistent navigation & sidebar shell
│   │   ├── dashboard/                  # Autonomous scholar console & daily briefing
│   │   ├── discover/                   # Vector-powered semantic search
│   │   ├── graph/                      # Force-directed 2D citation topology
│   │   ├── agent-reader/               # Grounded multi-agent PDF audit engine
│   │   ├── intelligence/               # 8-mode scholarly synthesis workspace
│   │   ├── workspace/                  # Lab bench & hypothesis incubator
│   │   ├── os/                         # Scholar time-blocking & milestone agenda
│   │   ├── lab/                        # GPU compute quotas & Slurm tracking
│   │   ├── data-management/            # FAIR data compliance & Zenodo/Dryad bridge
│   │   ├── opportunities/              # Real-time grant, CFP & journal engine
│   │   ├── grants/                     # Post-award accounting & funder burn rates
│   │   ├── compliance/                 # Multi-site IRB protocol lifecycle
│   │   ├── audit/                      # Append-only SHA-256 cryptographic audit
│   │   ├── billing/                    # Institutional licenses & compute billing
│   │   ├── peer-review/                # Double-blind review & 14-role CRediT matrix
│   │   ├── publications/               # Version-controlled preprint repository
│   │   ├── portfolio/                  # Public cryptographically verified CV
│   │   ├── community/                  # High-signal hypothesis discussions
│   │   ├── profile/                    # ORCID credentials & scholar bio
│   │   ├── notifications/              # Real-time alerts & deadline pings
│   │   ├── settings/                   # System configurations & API keys
│   │   ├── changelog/                  # Release notes & platform milestones
│   │   └── help/                       # Interactive platform documentation
│   ├── globals.css                     # Master CSS tokens, drift animations, typography
│   ├── layout.tsx                      # Root HTML shell, font providers & theme context
│   └── page.tsx                        # Botanical Living Materials landing page
├── components/                         # Reusable UI inventory (GlobalSidebar, CambiumLogo, etc.)
├── lib/                                # Stores, API hooks, and utility functions
│   ├── api/                            # TanStack Query hooks & REST clients
│   ├── store/                          # Zustand UI and user session state slices
│   └── utils.ts                        # Styling and text formatting helpers
├── public/                             # Static public assets (SVGs, brand marks, icons)
├── tailwind.config.ts                  # Living Materials token mappings
└── tsconfig.json                       # Strict TypeScript configuration
```

---

## ⚡ Available NPM Scripts

Run all commands from the `client/` directory or use root npm scripts with `--prefix client`:

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Starts Next.js development server on `http://localhost:3000` |
| `build` | `npm run build` | Compiles optimized production bundle across all 49 pages |
| `start` | `npm run start` | Boots production server on port 3000 |
| `lint` | `npm run lint` | Runs static ESLint checks |

---

## 🎨 Living Materials Design Tokens

The client interface utilizes the **W3C DTCG Living Materials Design Tokens** loaded from [`tokens/cambium.tokens.json`](../tokens/cambium.tokens.json). 

**Rule**: Never write arbitrary, unapproved hex values in component classes. Strictly use the defined semantic tokens:

```typescript
// Master Living Materials Palette Reference
const PALETTE = {
  forestInk:   "#202920", // Dominant high-contrast typography (APCA Lc 92.4, AAA)
  parchment:   "#FAF7F0", // Primary reading foundation canvas
  mineralSand: "#F2EBDD", // Sunken cards and secondary sections
  limestone:   "#E4DCCB", // Structural hairline dividers and borders
  sageMist:    "#DCE6D7", // Active badge pills and chip backgrounds
  canopy:      "#3E6248", // Primary buttons and high-contrast links
  deepMoss:    "#293E30", // Dark botanical card surfaces and hover states
  emeraldGlow: "#4ADE80", // Bioluminescent live pulses and active nodes
  rootwood:    "#805B43", // Earth accent, funding depth, and grant provenance
};
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file inside `client/`:

```ini
# Backend API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Public Client Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🛡️ State Management & Data Fetching Standards

1. **Server State**: Managed strictly through `@tanstack/react-query` with declarative query keys (e.g., `['opportunities', filterParams]`). Never replicate server state in React `useState`.
2. **Client UI State**: Managed via **Zustand** stores in `client/lib/store/` (e.g., `useSidebarStore`, `useThemeStore`).
3. **Route & Filter State**: Deep-linked through Next.js URL query params (`useSearchParams`, `usePathname`) for link shareability.

---

<div align="center">
  <sub>Part of the Cambium Enterprise Research Monorepo · Lead Architect: Shaik Mohamed Imthiyas T</sub>
</div>
