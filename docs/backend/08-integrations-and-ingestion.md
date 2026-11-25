# External Integrations & Data Ingestion (`08`)

**Program**: Cambium Research Principal Backend & Database Engineering Program

---

## 1. External Academic Providers
| Provider / Adapter | Purpose | Resilience Controls |
| :--- | :--- | :--- |
| `GrantsGovCrawler` | Federal grants (NSF, NIH, DOE, DARPA, NASA) | `AbortController` `4000ms` timeout, structured error catch, curated fallback catalog (`server/src/modules/ingestion/crawlers/grants-gov.crawler.ts`). |
| `OpenAlexCrawler`, `ArxivCrawler`, `CrossrefCrawler`, `DoajCrawler` | Preprints, DOIs, CFPs, OA journals | Isolated per-crawler execution inside `IngestionService.crawlAndIngest` using `Promise.allSettled` so single-provider outages (`503`/timeout) do not abort remaining sources. |
| **Google OAuth / Gemini APIs** | Identity (`userinfo`/`verifyIdToken`) & `768`-dim embeddings / assistant RAG | Explicit token verification (`auth.service.ts`), `validateSafeExternalUrl` SSRF guard (`ssrf-validator.ts`), `<untrusted_source_data>` delimiters. |

## 2. Ingestion Idempotency & Bounds
- Clamped crawl `limit` `[1..50]` per provider (`IngestionService`).
- Duplicate screening checks existing `title` or `link` before generating embeddings and inserting normalized records + taxonomy tags.
- `IngestionController` protected behind `JwtAuthGuard`, `RolesGuard`, and `@Roles(UserRole.SUPER_ADMIN)`.
