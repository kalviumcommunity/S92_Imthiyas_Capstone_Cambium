# 🏛️ Cambium Legacy Design Inventory & Architectural Lineage

---

### Metadata
- **Document ID**: `DOCS-LEGACY-DESIGN-INVENTORY-V2`
- **Product**: Cambium Research Platform — The Enterprise Research Operating System
- **Author**: Shaik Mohamed Imthiyas T
- **Status**: `ENFORCED / ARCHIVAL REFERENCE`
- **Scope**: Historical provenance of initial Vite/Figma UI prototypes in `_vite_raw_code/` and their formal elevation to production Next.js 15 App Router architecture.

---

## 1. Executive Purpose & Governance

During the initial Research & Prototyping phase (Sprint 0), 28 standalone UI modules were drafted in exploratory sandboxes under `_vite_raw_code/`. 

To maintain clean repository hygiene while ensuring complete academic defense traceability, these prototypes are:
1. **Preserved locally** as immutable historical design artifacts.
2. **Excluded from git version control** via root [`.gitignore`](../.gitignore) to prevent production bundle bloating.
3. **100% Elevated** into the production monorepo under `client/app/` using Next.js 15 App Router, React 19, and the Living Materials Design System.

---

## 2. Master Traceability & Elevation Matrix

The table below maps each initial design spike to its hardened enterprise production counterpart:

| # | Prototype Sandbox (`_vite_raw_code/`) | Production Next.js 15 Route / Component | Enterprise Status | Key Enhancements Added in Production |
| :-: | :--- | :--- | :---: | :--- |
| **01** | `01_Design Systems` | [`tokens/cambium.tokens.json`](../tokens/cambium.tokens.json) & [`globals.css`](../client/app/globals.css) | `[x] Shipped` | W3C DTCG Token format, APCA $L_c > 90$ contrast, WCAG 2.2 AA certification |
| **03** | `03_Hero Landing Page` | [`client/app/page.tsx`](../client/app/page.tsx) | `[x] Shipped` | Bioluminescent dark mode, live citation radar, responsive header navigation |
| **04** | `04_ Authentication Screen` | [`client/app/(auth)/sign-in/page.tsx`](../client/app/(auth)/sign-in/page.tsx) | `[x] Shipped` | InCommon / SAML 2.0 Single Sign-On, rotating JWT refresh cookies |
| **05** | `05_Academic identity profile page`| [`client/app/(protected)/profile/page.tsx`](../client/app/(protected)/profile/page.tsx) | `[x] Shipped` | ORCID API credential sync, verified academic bio & affiliation badges |
| **06** | `06_Home Page` | [`client/app/(protected)/dashboard/page.tsx`](../client/app/(protected)/dashboard/page.tsx) | `[x] Shipped` | Real-time grant deadline counters, AI briefing, active research radar |
| **07** | `07_Research Discover` | [`client/app/(protected)/discover/page.tsx`](../client/app/(protected)/discover/page.tsx) | `[x] Shipped` | pgvector 768d HNSW hybrid search, Reciprocal Rank Fusion (RRF) |
| **08** | `08_Research Workspace` | [`client/app/(protected)/workspace/page.tsx`](../client/app/(protected)/workspace/page.tsx) | `[x] Shipped` | Multi-pane hypothesis incubator, lab note markdown editor |
| **09** | `09_Paper & Publication Explorer` | [`client/app/(protected)/publications/page.tsx`](../client/app/(protected)/publications/page.tsx) | `[x] Shipped` | Version-controlled preprint archives, Zenodo DOI persistent minting |
| **10** | `10_Opportunity Hub` | [`client/app/(protected)/opportunities/page.tsx`](../client/app/(protected)/opportunities/page.tsx) | `[x] Shipped` | Live federal grant ingest (Grants.gov), multi-filter facets, one-click bookmarks |
| **11** | `11_Collaboration Hub` | [`client/app/(protected)/community/page.tsx`](../client/app/(protected)/community/page.tsx) | `[x] Shipped` | WebSockets live scholar discussion streams, Redis-backed room adapters |
| **12** | `12_Research portfolio` | [`client/app/(protected)/portfolio/page.tsx`](../client/app/(protected)/portfolio/page.tsx) | `[x] Shipped` | Cryptographically signed digital CV, citation metrics & grant track record |
| **13** | `13_Research Intelligence` | [`client/app/(protected)/intelligence/page.tsx`](../client/app/(protected)/intelligence/page.tsx) | `[x] Shipped` | 8-mode scholarly synthesis desk, Gemini 2.0 grounded citations |
| **14** | `14_Personal Research OS` | [`client/app/(protected)/os/page.tsx`](../client/app/(protected)/os/page.tsx) | `[x] Shipped` | Scholar time-blocking agenda, milestone gantt charts & lab deadlines |
| **15** | `15_Onboarding Flow` | [`client/app/welcome/page.tsx`](../client/app/welcome/page.tsx) | `[x] Shipped` | 3-step researcher personalization flow (domains, funders, methods) |
| **16** | `16_Single Artifact Reader Experience`| [`client/app/(protected)/agent-reader/page.tsx`](../client/app/(protected)/agent-reader/page.tsx) | `[x] Shipped` | Split-view grounded PDF reader, 4 multi-agent auditor personas |
| **17** | `17_Settings & Integrations UI` | [`client/app/(protected)/settings/page.tsx`](../client/app/(protected)/settings/page.tsx) | `[x] Shipped` | API key provisioning, InCommon SAML SP configuration, email notification toggles |
| **18** | `18_Error Boundary Screens Design`| `client/app/error-500/`, `403/`, `404/`, `429/` | `[x] Shipped` | Humanist error recovery cards, exponential retry countdowns |
| **19** | `19_Auth Edge Case Screens` | `client/app/(auth)/forgot-password/`, `reset-password/` | `[x] Shipped` | Rate-limited password reset tokens, zero-knowledge security confirmation |
| **20** | `20_Dashboard Skeleton Screens` | [`client/components/ui/skeletons/skeleton.tsx`](../client/components/ui/skeletons/skeleton.tsx) | `[x] Shipped` | Zero-layout-shift shimmer placeholders matching Living Materials cards |
| **21** | `21_Null Empty States` | [`client/components/EmptyState.tsx`](../client/components/EmptyState.tsx) | `[x] Shipped` | High-empathy instructional illustrations with direct action CTA buttons |
| **22** | `22_Privacy Policy Page` | [`client/app/privacy/page.tsx`](../client/app/privacy/page.tsx) & `/compliance` | `[x] Shipped` | Institutional GDPR / FERPA compliance statements, IRB review protocols |
| **23** | `23_Global Command Palette Overlay` | [`client/components/ui/command-palette.tsx`](../client/components/ui/command-palette.tsx) | `[x] Shipped` | Accessible ARIA modal with `Cmd+K` keyboard shortcut navigation |
| **24** | `24_Destructive Action Modal` | [`client/components/ui/shortcuts-modal.tsx`](../client/components/ui/shortcuts-modal.tsx) | `[x] Shipped` | Two-factor confirmation modal for grant deletion & IRB revocation |
| **25** | `25_Pricing and Billing Page` | [`client/app/(protected)/billing/page.tsx`](../client/app/(protected)/billing/page.tsx) | `[x] Shipped` | University lab seat quotas, GPU Slurm compute budget accounting |
| **26** | `26_Dedicated Notification Inbox`| [`client/app/(protected)/notifications/page.tsx`](../client/app/(protected)/notifications/page.tsx) | `[x] Shipped` | Real-time Server-Sent Events (SSE) notification stream & badge counters |
| **27** | `27_Help Center & Support` | [`client/app/(protected)/help/page.tsx`](../client/app/(protected)/help/page.tsx) | `[x] Shipped` | Interactive documentation, grant writing guides & support ticket dispatch |
| **28** | `28_Changelog Release Notes` | [`client/app/(protected)/changelog/page.tsx`](../client/app/(protected)/changelog/page.tsx) | `[x] Shipped` | Versioned milestone chronicle, platform upgrades & release notes |

---

## 3. Academic Defense Verification Note

This inventory confirms that:
1. **Zero Intellectual Property Loss**: Every design insight, layout hierarchy, and user experience pattern developed during Sprint 0 was successfully migrated into production code.
2. **Strict Production Separation**: The messy prototype build artifacts remain sequestered in `_vite_raw_code/`, keeping the GitHub repository clean, professional, and deployable with zero build friction.
3. **Enterprise Quality Gate Compliance**: All elevated production components satisfy strict TypeScript 5.7 compilation, Next.js 15 App Router static pre-rendering, and WCAG 2.2 AA accessibility standards.
