# Cambium Engineering Standards & Monorepo Conventions
## Code Discipline, Conventional Commits, Type Safety & Architecture Boundaries
**Document ID**: `STD-CAMBIUM-ENG-2026-V1`
**Repository**: `kalviumcommunity/S92_Imthiyas_Capstone_Cambium`
**Status**: `ENFORCED REPOSITORY STANDARD`

---

## 1. Commit Message Conventions (Conventional Commits)

All commit messages in the repository **MUST** follow the Conventional Commits specification:

$$\mathbf{type}(\mathbf{scope}): \mathbf{concise\ lowercase\ description}$$

### Approved Types
- `feat`: New user-facing capability, crawler, or endpoint.
- `fix`: Bug fix, error resolution, or regression patch.
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `docs`: Documentation addition, specification update, or README enhancement.
- `test`: Adding or correcting tests; no production code changes.
- `style`: Formatting, whitespace, semicolon normalization; no logic changes.
- `chore`: Tooling, build pipeline, dependency updates, or git hygiene.

### Standard Scopes
- `(client)`: Frontend UI, components, store, hooks.
- `(server)`: Backend NestJS modules, controllers, services.
- `(db)`: TypeORM entities, PostgreSQL migrations, pgvector HNSW indexing.
- `(api)`: REST endpoints, DTO contracts, Bruno collections.
- `(ops)`: Docker, CI/CD workflows, reverse proxy, process supervision.
- `(brand)`: Logo geometry, design tokens, typography.

---

## 2. Strict TypeScript & Code Quality Rules

1. **No `any` Types**: Explicitly model interfaces or use `unknown` with type narrowing guards.
2. **DTO Validation**: Every incoming backend payload must be modeled as a class decorated with `class-validator` and `class-transformer`.
3. **No Raw SQL Concatenation**: Always use TypeORM parameterized queries (`:id`) to prevent SQL injection.
4. **Living Materials Tokens Only**: Never use raw, unapproved hex values in UI code. Utilize semantic tokens defined in `tokens/cambium.tokens.json`.
5. **No Event Handlers in Server Components**: Next.js Server Components cannot accept `onClick` or interactive callbacks. Interactive elements must be isolated in `"use client"` modules.

---

## 3. Branch Naming Discipline

- `feature/<kebab-case-description>`: Active feature development.
- `fix/<kebab-case-description>`: Bug and regression patches.
- `chore/<kebab-case-description>`: Repository maintenance and tooling.
- `docs/<kebab-case-description>`: Documentation additions.

---

## 4. Cross-Reference Documentation
- [Code Style Specification](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/code-style.md)
- [Repository Audit Report](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/engineering/repository-audit.md)
- [Pull Request Review](file:///d:/01_PROJECTS/ACTIVE/S92_Imthiyas_Capstone_Cambium/docs/engineering/pull-request-review.md)

