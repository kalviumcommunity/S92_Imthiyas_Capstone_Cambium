# Cambium Research — End-to-End Playwright Test Inventory

## 1. Suite Catalog (`tests/e2e/`)

| Spec File | Primary Focus | Auth Model |
| :--- | :--- | :--- |
| `01-auth-and-dashboard.spec.ts` | Public landing verification, ORCID/form login flow, command palette search | Interactive auth |
| `02-opportunities-search-and-bookmark.spec.ts` | Opportunities catalog rendering, keyword filtering, category tabs, bookmark toggles | Authenticated fixture |
| `03-gemini-agent-reader.spec.ts` | Agentic Reader personas, prompt pills, message submission | Authenticated fixture |
| `04-constellation-graph-and-citations.spec.ts` | 2D Constellation Graph rendering & Academic Citation modal | Authenticated fixture |
| `05-accessibility-audit.spec.ts` | `@axe-core/playwright` WCAG 2.2 AA scan across public and protected views | Dual (public + authenticated) |
| `06-post-deployment-smoke-probes.spec.ts` | Page error / console error zero-crash probes & guest middleware verification | Dual (guest + authenticated) |
| `07-journeys-isolation-and-responsive.spec.ts` | Guest redirect enforcement, form login -> `/dashboard` navigation, 375px & 1440px overflow check | Dual |

## 2. Deterministic Auth Helper (`tests/e2e/helpers/auth-session.ts`)

- Uses synthetic non-routable actors (`*.invalid`) from `tests/fixtures/synthetic-actors.ts`.
- Injects valid 3-segment JWT cookies (`cambium_token`) and `localStorage` tokens prior to React hydration so `client/middleware.ts` and `AuthGuard` render real protected screens instead of silently redirecting to `/sign-in`.
