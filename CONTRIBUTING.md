# Contributing to Cambium Research

Thank you for contributing to Cambium. Follow the standards in [`AGENTS.md`](AGENTS.md) and [`docs/engineering/standards.md`](docs/engineering/standards.md) so changes remain verifiable, secure, and well-documented.

## Workflow Summary

1. **Branch Naming:** Create semantic branches off `main` (`feat/<topic>`, `fix/<topic>`, `perf/<topic>`, `docs/<topic>`).
2. **Commits:** Follow Conventional Commits (`feat(scope): ...`, `fix(scope): ...`, `docs(scope): ...`, `perf(scope): ...`, `test(scope): ...`).
3. **Code Quality Rules:**
   - Use TypeORM query parameters (`:param`) — never SQL string interpolation.
   - Validate controller DTOs with `class-validator` and guard protected endpoints with `JwtAuthGuard` + `RolesGuard`.
   - Adhere strictly to Living Materials design tokens (`tokens/cambium.tokens.json`).
4. **Local Quality Gates Before Opening a PR:**
   ```bash
   npm run verify:docs
   npm run test:jest
   npm --prefix server run build && npm test
   npm --prefix client run lint && npm --prefix client run build
   ```
5. **Documentation Synchronization:** Update the corresponding document under `docs/` whenever you modify endpoints, entities, env variables, or deployment behavior. See [`docs/audit/DOCUMENTATION_AUDIT_AND_REMEDIATION.md`](docs/audit/DOCUMENTATION_AUDIT_AND_REMEDIATION.md) for change triggers.
