# Cambium Product Analytics — Metric Definitions Specification

**Version:** `1.0.0`  
**Owner:** Cambium Platform Engineering  
**Source Implementation:** [`ProductAnalyticsService`](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/server/src/modules/analytics/product-analytics.service.ts)

Every metric displayed on `/observability` is defined with an explicit numerator, denominator, time window, and exclusion rule so product and engineering leads cannot confuse raw pageviews or synthetic tests with genuine scholar value.

| Metric | Numerator | Denominator | Time Window | Exclusions |
| :--- | :--- | :--- | :--- | :--- |
| **DAU (Daily Active Users)** | Distinct `actorId` with `>= 1` backend/accepted event in window | Absolute count (or divided by MAU for stickiness) | Trailing `24 hours` | `actorKind IN ('TEST', 'SYSTEM')`, `actorId IS NULL` |
| **WAU (Weekly Active Users)** | Distinct `actorId` with `>= 1` domain event in window | Absolute count | Trailing `7 days` | `actorKind IN ('TEST', 'SYSTEM')`, `actorId IS NULL` |
| **MAU (Monthly Active Users)** | Distinct `actorId` with `>= 1` domain event in window | Absolute count | Trailing `30 days` | `actorKind IN ('TEST', 'SYSTEM')`, `actorId IS NULL` |
| **Stickiness Ratio** | `DAU` | `MAU` (`0` when `MAU === 0`) | Trailing `24h / 30d` | `TEST` & `SYSTEM` actors |
| **Researcher Activation Rate (%)** | Signups achieving `opportunity.saved` (`SUCCESS`) **AND** (`workspace.created` \| `document.upload.completed` \| `collaboration.invitation.accepted`) within `14 days` of `user.signup.completed` | Distinct human accounts with `user.signup.completed` (`SUCCESS`) inside lookback window | `windowDays` lookback + `14d` milestone horizon | `TEST`, `SYSTEM`, duplicate retries (`idempotencyKey`) |
| **Discovery Funnel Step Counts** | Distinct `actorId` per stage with `outcome = 'SUCCESS'` | Preceding funnel step distinct count (or top-of-funnel signups) | Trailing `windowDays` (default `30d`) | `actorKind !== 'HUMAN'` |
| **D1 Cohort Retention (%)** | Cohort signups returning for any non-signup event `24h–48h` (`1–2` days) after signup | Cohort `user.signup.completed` distinct users on `cohortDate` | `[+1d, +2d]` post-signup | Signup event itself excluded; `TEST` excluded |
| **D7 Cohort Retention (%)** | Cohort signups returning `6–8` days after signup | Cohort `signedUp` | `[+6d, +8d]` post-signup | Signup event itself excluded; `TEST` excluded |
| **D30 Cohort Retention (%)** | Cohort signups returning `28–32` days after signup | Cohort `signedUp` | `[+28d, +32d]` post-signup | Signup event itself excluded; `TEST` excluded |
| **Institutional Active Users** | Distinct `actorId` where `organizationId IS NOT NULL` | Absolute count (subgroup details suppressed when `< 3`) | Trailing `windowDays` (default `30d`) | `actorKind !== 'HUMAN'` |
| **Operational Failure Count** | Count of events where `outcome = 'FAILURE'` grouped by `eventName` | N/A (absolute error count) | Trailing `windowDays` | `actorKind !== 'HUMAN'` |
