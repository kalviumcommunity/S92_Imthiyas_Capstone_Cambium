## Summary
<!-- Concise explanation of what changed and why -->

## Category
- [ ] Feature (`feat`)
- [ ] Bug Fix (`fix`)
- [ ] Performance (`perf`)
- [ ] Security / Privacy
- [ ] Documentation / DevEx (`docs`)

## Verification Evidence
- [ ] `npm run test:jest` passed
- [ ] `npm --prefix server run build && npm test` passed
- [ ] `npm --prefix client run lint && npm --prefix client run build` passed
- [ ] `npm run verify:docs` passed (if docs or `.env*.example` changed)

## Documentation & Governance Triggers
- [ ] Updated `docs/api-guide.md` (if endpoints/DTOs changed)
- [ ] Updated `docs/database.md` & migrations (if schema/indexes changed)
- [ ] Updated `.env*.example` (if new env variables were introduced)
- [ ] No hardcoded secrets, synthetic user counts, or RBAC bypasses introduced
