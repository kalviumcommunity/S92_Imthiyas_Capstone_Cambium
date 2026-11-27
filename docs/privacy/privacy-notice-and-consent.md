# Cambium Research — Purpose, Privacy Notices & Versioned Consent Management

## 1. Legal Basis Differentiation

Cambium does not force consent where service delivery or statutory/institutional obligations govern processing (`[LEGAL_REVIEW_REQUIRED]` per deployment):

- **Essential Account & Workspace Security (`ESSENTIAL_AUTH`)**: JWT issuance, password verification, session revocation, and abuse throttling.
- **Explicit Consent Activities (`AI_RESEARCH_ASSISTANT`, `OPTIONAL_ANALYTICS`)**: Default `false`; never bundled or preselected.

## 2. Append-Only Consent Ledger (`consent_records`)

Implemented in `server/src/modules/privacy/entities/consent-record.entity.ts` and `002_privacy_governance_tables.sql`:

- Records `userId`, `purpose`, `action` (`GRANTED` | `WITHDRAWN`), `noticeVersion` (`v2026-11`), `noticeLanguage`, `sourceInterface` (`cookie_banner` | `settings_privacy` | `api`), and immutable `recordedAt`.
- Database RLS policies permit `SELECT` and `INSERT` scoped to `public.cambium_actor_uuid()`, preventing silent overwriting or backdating of prior consent evidence.
- Withdrawing `AI_RESEARCH_ASSISTANT` updates `user_privacy_preferences.ai_processing_consent = false` atomically, causing `AssistantService` to block external Gemini calls immediately.

## 3. UI & Notice Surfaces

- **Banner (`client/components/CookieConsent.tsx`)**: Displays `v2026-11`, separates `Essential Only` from `Accept Optional Analytics`, avoids preselected checkboxes, and links directly to `/privacy` and `/settings`.
- **Privacy Policy (`client/components/legal/PrivacyContent.tsx`)**: Discloses collected categories, external AI caveats, non-certification notice, and configurable operator/grievance placeholders until real organizational identity is supplied.
