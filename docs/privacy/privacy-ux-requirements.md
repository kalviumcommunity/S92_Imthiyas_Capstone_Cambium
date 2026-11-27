# Cambium Research — Privacy UX & Anti-Dark-Pattern Requirements

## 1. Enforced UX Standards

1. **No Decorative Toggles**: Every switch in `Settings -> Privacy` (`client/app/(protected)/settings/page.tsx`) reads from and writes to `/api/v1/privacy/preferences`.
2. **No Preselected Optional Consent**: `aiProcessingConsent` and `optionalAnalyticsConsent` default to **`false`**.
3. **Clear Cookie / Consent Banner (`client/components/CookieConsent.tsx`)**: Separates `Essential Only` from `Accept Optional Analytics` cleanly with balanced typography, notice version (`v2026-11`), and direct links to `/privacy` and `/settings`.
4. **Honest Export & Deletion Disclosures**:
   - Export calls `GET /api/v1/privacy/export` cleanly and discloses if local fallback runs when offline.
   - Erasure calls `POST /api/v1/privacy/erasure` requiring explicit `DELETE` typing and transparently explains immutable security audit logs and time-bound backup retention exceptions rather than claiming total instant physical wipe across all offline snapshots.
5. **No Fabricated Legal Contacts**: Public `/privacy` page uses explicit bracketed placeholders until deployment configuration supplies genuine organizational details.
