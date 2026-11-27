# Activation, Engagement & Cohort Retention Specification

## 1. Account Taxonomy & Exclusion Guarantees

Cambium separates identity classes at write time via `ProductAnalyticsService.classifyActor`:
- **`HUMAN`**: Authenticated scholars using institutional or personal accounts not matching automated QA signatures.
- **`TEST`**: Synthetic accounts ending in `@cambium.test` or `@example.com`, prefixed with `e2e-` or `qa-`, or flagged by `CAMBIUM_TEST_ACTOR=true`.
- **`SYSTEM`**: Scheduled jobs or unauthenticated catalog probes where `actorId` is `null`.

All user, funnel, activation, and cohort calculations filter strictly on `actorKind === 'HUMAN'`.

## 2. Researcher Activation Milestone

A researcher is considered **Activated** only after transitioning beyond passive browsing into persistent scholarly work within **14 days** of registration (`user.signup.completed`):
1. Saved at least one funding/publishing opportunity (`opportunity.saved`), **AND**
2. Completed one structural research action (`workspace.created`, `document.upload.completed`, or `collaboration.invitation.accepted`).

## 3. Cohort Retention Buckets

Retention cohorts group users by ISO date of earliest `user.signup.completed` event (`YYYY-MM-DD`) and measure distinct-user return windows:
- **D1**: Non-signup domain event in `[signup + 1d, signup + 2d]`
- **D7**: Non-signup domain event in `[signup + 6d, signup + 8d]`
- **D30**: Non-signup domain event in `[signup + 28d, signup + 32d]`

Retrying the exact same signup or invite response request does not inflate counts because `analytics_events.idempotency_key` carries a partial unique PostgreSQL index.
