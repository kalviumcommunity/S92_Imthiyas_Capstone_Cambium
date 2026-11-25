# State Management & Account Isolation (`05`)

**Program**: Cambium Research Principal Frontend Engineering Program

---

## 1. State Ownership Taxonomy
| Category | Mechanism | Owner |
| :--- | :--- | :--- |
| **Server Cache** | `@tanstack/react-query` (`QueryProvider`) | [`client/lib/query-provider.tsx`](../../client/lib/query-provider.tsx) |
| **Authentication & Session** | Zustand (`useAuthStore`) + `HttpOnly` refresh cookie + Edge `cambium_token` | [`client/lib/store/useAuthStore.ts`](../../client/lib/store/useAuthStore.ts) |
| **Billing / Subscription UI** | Zustand (`useSubscriptionStore`) synced on checkout | [`client/lib/store/useSubscriptionStore.ts`](../../client/lib/store/useSubscriptionStore.ts) |
| **Collaboration Presence** | Zustand (`usePresenceStore`) | `client/lib/store/usePresenceStore.ts` |
| **URL / Deep-Link State** | Next.js `useSearchParams` / `useRouter` | Route pages (`opportunities`, `graph`, `workspace`) |

## 2. Cross-Account Cache Leakage Fix
- Exported `clearFrontendQueryCache()` from `query-provider.tsx` and `resetStore()` from `useSubscriptionStore.ts`.
- Wired `clearScopedUserCaches()` inside `useAuthStore.logout()` **and** whenever `useAuthStore.setAuth()` logs in a different `user.id`, clearing React Query memory caches, resetting subscription tier state, and removing `cambium_workspace_drafts_v2` & `cambium_bookmarks`.
