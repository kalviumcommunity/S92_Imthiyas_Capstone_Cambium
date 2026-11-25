# Supply Chain, Dependency & CI/CD Security (`08`)

**Program**: Cambium Research Security Hardening Program  
**Baseline**: OWASP Top 10:2025 A03 (Supply Chain), GitHub Actions Hardening

---

## 1. CI/CD Pipeline Hardening (`.github/workflows/ci.yml`)
- **Least Privilege Token**: Top-level `permissions: contents: read` restricts the default `GITHUB_TOKEN` across all workflow jobs.
- **Secret Scanning**: Integrated `gitleaks/gitleaks-action@v2` (`fetch-depth: 0`) inside `security-audit` to scan commit history for accidentally committed tokens, private keys, or database URLs.
- **Mandatory Adversarial Security Gate**: Added dedicated `Execute Adversarial Security Regression Suite` step (`npx vitest run src/security/adversarial-security.spec.ts`) in `server-verification`.
- **Branch Coverage**: Expanded CI triggers to include `feat/**` security and feature branches alongside `main`.

## 2. Production Dependency Auditing
- Pipeline executes `npm audit --omit=dev` independently across `client`, `server`, and monorepo root on every push/PR.
- Zero suppression flags (`--force`) or skipped test suites permitted under `AGENTS.md`.
