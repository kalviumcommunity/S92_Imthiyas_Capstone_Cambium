# Cambium Branching Strategy & Git Flow Governance
## Standard Operating Procedures for Modern Scholarship Engineering

- **Document ID**: `ENG-BRANCH-2026-V1`
- **Specification**: GitHub Flow with Strict Linear Integration
- **Default Branch**: `main`
- **Target Audience**: Core Engineers, AI Agents, Subagents, and Community Contributors

---

## 1. Why Cambium Uses GitHub Flow

Cambium operates as an enterprise research platform where continuous integration, reproducibility, and release velocity are paramount. We strictly enforce **GitHub Flow** over heavyweight paradigms like Git Flow or permanent `develop` branches for the following reasons:

1. **Single Source of Truth (`main`)**: The `main` branch is always deployable and verified by automated CI/CD release gates (TypeScript compilation, unit test suites, and multi-stage container builds).
2. **Zero Drift**: Eliminating parallel long-lived staging branches eliminates merge anomalies, hidden regressions, and synchronization overhead.
3. **Auditability & Traceability**: Every production capability traces back to an approved Pull Request with clear commit lineage, review feedback, and automated test verdicts.
4. **Predictability for AI Pair Programming**: AI coding agents require deterministic base references. An unambiguous single trunk guarantees that agents never branch from stale integration trees.

---

## 2. Permanent vs. Temporary Branches

```
main (Permanent, Protected)
 │
 ├── feat/scholarly-discovery (Temporary, Short-Lived) ────────> PR ──> Merged & Deleted
 │
 ├── fix/search-pill-border (Temporary, Short-Lived) ──────────> PR ──> Merged & Deleted
 │
 └── docs/threat-model (Temporary, Short-Lived) ───────────────> PR ──> Merged & Deleted
```

### 2.1 Permanent Branch
- **`main`**: The sole permanent branch in the repository. Protected by mandatory CI checks (`Frontend UI Verification`, `Backend API Verification`, `Docker Multi-Stage Build`).

### 2.2 Short-Lived Working Branches
- All other branches are **temporary working containers** created to fulfill a discrete task, feature, or bugfix.
- Normal working convention: **1 to 3 active feature branches** concurrently across the engineering team.
- Once merged via Pull Request into `main`, temporary feature branches must be deleted promptly to prevent repository clutter.

---

## 3. Branch Naming Taxonomy

Every working branch must follow this semantic prefix structure:

| Prefix | Intent & Purpose | Examples |
| :--- | :--- | :--- |
| `feat/` | New user-facing capabilities, APIs, or algorithms | `feat/semantic-search`, `feat/research-discovery` |
| `fix/` | Bug fixes, regression resolutions, layout corrections | `fix/auth-refresh`, `fix/discover-pill-border` |
| `refactor/` | Code reorganization with zero functional changes | `refactor/ssot-architecture`, `refactor/search-service` |
| `docs/` | Architecture records, threat models, guides | `docs/threat-model`, `docs/branching-strategy` |
| `test/` | Unit, integration, or E2E smoke test suites | `test/research-api`, `test/wcag-contrast` |
| `chore/` | Tooling, dependencies, CI/CD pipeline automation | `chore/ci-improvements`, `chore/docker-optimization` |

**Prohibited Conventions**:
- ❌ Personal namespace prefixes (`john/my-work`)
- ❌ Vague dates (`october-sprint-work`)
- ❌ Naked ticket numbers (`1234`)
- ❌ Artificial folder tiers (`infrastructure/configs/feat/api`)

---

## 4. Pull Request Lifecycle & Quality Gates

Every code change enters `main` exclusively through a GitHub Pull Request adhering to this protocol:

```
1. Branch from origin/main
2. Implement surgical changes + tests
3. Commit using Conventional Commits
4. Push working branch to origin
5. Open PR against main with PRD traceability
6. Pass all 3 automated CI gates (Next.js, NestJS, Docker)
7. Code Review & Verification
8. Squash & Merge or Rebase & Merge
9. Automated/Manual Branch Deletion
```

### 4.1 Mandatory CI Release Gates
Before any PR can be merged, the following pipeline jobs MUST achieve 100% green status:
1. **Frontend UI Verification (Next.js 15)**: Prerenders all 54 static routes, verifies TypeScript, compiles optimized production chunks.
2. **Backend API Verification (NestJS 10)**: 117 Vitest tests passing with zero timeouts.
3. **Docker Multi-Stage Build Quality Gate**: Validates standalone Alpine Linux builder and runner container targets.

---

## 5. Merge Policy

- **Merge Method**: Prefer **Squash and Merge** or **Rebase and Merge** to maintain a clean, linear, bisectable commit history on `main`.
- **Commit Title Standard**: Conventional Commit format matching the PR title (e.g., `feat(discovery): integrate OpenAlex citation graph crawler`).
- **Zero Broken Windows**: Never merge a PR with failing CI checks or outstanding review comments.

---

## 6. Branch Cleanup & Stale Branch Policy

### 6.1 Immediate Post-Merge Cleanup
- Once a PR is merged, the associated remote branch should be deleted immediately using GitHub's automatic branch deletion or via:
  ```bash
  git push origin --delete <branch-name>
  git branch -d <branch-name>
  ```

### 6.2 Stale Branch Audit Cadence
- Monthly audit of remote branches using `git fetch origin --prune`.
- Any branch with zero commits ahead of `main` (fully merged) is classified as `DELETE — VERIFIED SAFE`.
- Abandoned branches older than 60 days with unmerged experiments must be reviewed, tagged if archival is required, or removed after human sign-off.

---

## 7. Release & Hotfix Policies

### 7.1 Production Releases
- Releases are tagged directly from `main` using Semantic Versioning (e.g., `v2.0.0`).
- Dedicated release branches (`release/vX.Y.Z`) are short-lived and used only if multi-day hardening or legal compliance stabilization is required. Once tagged, release branches are merged back into `main` and deleted.

### 7.2 Emergency Hotfixes
- Created directly from `main` using `fix/hotfix-<incident-id>`.
- Deployed through standard expedited PR review and merged into `main` immediately upon automated CI verification.

---

## 8. Safe Branch Deletion Procedures

### 8.1 Safe Local Deletion
Always use lowercase `-d` which enforces that the branch has been integrated into upstream:
```bash
git checkout main
git pull origin main
git branch -d <branch-name>
```
*Never use uppercase `-D` unless explicit human confirmation has been given for discarded prototypes.*

### 8.2 Safe Remote Deletion
Before deleting any remote tracking branch, verify all 7 Safety Conditions:
1. The branch is a direct ancestor of `origin/main` (`git branch -r --merged origin/main`).
2. Triple-dot diff against `main` is completely empty (`git diff origin/main...origin/<branch>` produces 0 lines).
3. No active, open Pull Request is associated with the branch.
4. The branch is not an active release or hotfix branch.
5. The branch is not required by any CI/CD workflow or deployment hook.
6. Deletion will not disrupt an active contributor.
7. The engineering purpose has been verified as fulfilled.

```bash
git push origin --delete <branch-name>
```

