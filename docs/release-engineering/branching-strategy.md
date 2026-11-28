# Branching & Release Governance Strategy

**Document ID**: `REL-BRANCH-2026-V1`

## 1. Branch Model

Cambium uses a streamlined **GitHub Flow** model suited for a lean engineering team:

- **`main`**: Always deployable production branch. Protected against unreviewed direct pushes in GitHub repository settings.
- **Feature / Fix Branches**: Short-lived branches cut from `main`:
  - `feat/<scope>` — New capabilities (e.g., `feat/analytics-sprint-1-taxonomy`)
  - `fix/<scope>` — Bug fixes or regressions
  - `docs/<scope>` — Documentation-only updates
  - `hotfix/vX.Y.Z` — Urgent production patches cut from the active release tag
  - `chore/<scope>` — Dependency, CI, or release maintenance

## 2. Commit & Pull Request Conventions

- **Conventional Commits**: `<type>(<scope>): <imperative summary>` (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`).
- **Pull Request Requirements**:
  - Clear description of scope, database migration impact, and rollback notes.
  - Zero skipped CI checks (`ci.yml`).
  - At least 1 maintainer review before merge into `main`.

## 3. Recommended GitHub Branch Protection Settings (`main`)

Configure in **GitHub Settings → Branches → Branch protection rules (`main`)**:
- Require a pull request before merging (1 approval).
- Require status checks to pass before merging:
  - `Backend API Verification (NestJS)`
  - `Database Schema & Migration Gate (PG16 + pgvector)`
  - `Frontend UI Verification (Next.js 16)`
  - `Root Unit Tests (Jest)`
  - `Production Dependency, Secret & Env Audit`
- Require branches to be up to date before merging.
- Do not allow bypassing settings for routine development.

## 4. Semantic Versioning & Release Tags

- Format: `vMAJOR.MINOR.PATCH` (annotated tags: `git tag -a v2.1.0 -m "Release v2.1.0"`).
- Pushing a `v*` tag automatically triggers `.github/workflows/release-verify.yml`.
- Update `CHANGELOG.md` and `package.json` / `client/package.json` / `server/package.json` before tagging.
