# API Quality, Contracts & Validation Audit (`02`)

**Program**: Cambium Research Principal Backend & Database Engineering Program

---

## 1. Audited Endpoints & Identified Improvements

| Endpoint Group | Route Prefix | Auth / Guards | Contract Findings & Planned Remediation |
| :--- | :--- | :--- | :--- |
| **Opportunities** | `api/research-opportunities`, `api/opportunities`, `api/v1/opportunities` | Public GETs; `JwtAuthGuard` on mutations | Added pagination (`page`, `limit` max `100`) on `findAll`, `hybrid`, `upcoming-deadlines`, `recommendations`; enforced creator/`SuperAdmin` ownership on `PUT`/`DELETE :id` and `PUT :id/tags`; bounded `POST bulk` (`<= 100`) and DTO-validated `FilterOpportunityDto` + `ParseUUIDPipe`. |
| **Bookmarks** | `api/bookmarks`, `api/v1/bookmarks` | `JwtAuthGuard` | Enforced owner check (`bookmark.userId === user.id`) on `DELETE :id`, added `ParseUUIDPipe`, and mapped unique constraint violations (`23505`) to deterministic `ConflictException` (`409`). |
| **Billing** | `billing`, `api/billing`, `api/v1/billing` | `JwtAuthGuard` | Aligned routes to include `/api/billing/*` used by `PaymentCheckoutModal.tsx`; added `SubscribeDto` (`@IsEnum`, `@IsIn`), atomic transaction for subscription + invoice creation, cryptographic invoice number (`randomBytes`), and `GET invoices` pagination cap. |
| **Community** | `community`, `api/community`, `api/v1/community` | Public feed/post GET; `JwtAuthGuard` on mutations | Replaced `Partial<CreatePostDto>` on `PUT posts/:id` with class-based `UpdatePostDto` so `forbidNonWhitelisted` operates accurately; bounded feed `limit` `[1..50]`; added `ParseUUIDPipe` on `:id`. |
| **Notifications** | `api/notifications`, `api/v1/notifications` | `JwtAuthGuard` | Already paginated (`limit`/`offset` `[1..100]`) and deduplicated via `dedupKey`; added `ParseUUIDPipe` on `:id` / `:userId`. |
| **Institution OS** | `api/v1/institution/*`, `proposals/*`, `funding/*`, `execution/*` | `JwtAuthGuard`, `RolesGuard`, tenant isolation | Added `ParseUUIDPipe`, transactional `pessimistic_write` locks for financial deductions/settlements, proposal state transition guardrails, and N+1 elimination on funding accounts. |

## 2. Error Normalization & Standards
- Centralized `AllExceptionsFilter` in `server/src/common/filters/all-exceptions.filter.ts` catches NestJS `HttpException`, malformed JSON `SyntaxError` (`400`), and PostgreSQL driver errors (`23505` -> `409 Conflict`, `23503` -> `400 Bad Request`, `22P02` -> `400 Invalid UUID/Format`) into consistent JSON payloads (`statusCode`, `errorCode`, `message`, `timestamp`, `path`, `requestId`) with stack traces omitted in responses.
