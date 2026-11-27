# Performance Baseline & Measurement Methodology

**Document ID:** `PERF10-METHOD-2026`  
**Rule:** Never compare measurements across different environments (e.g., local Windows dev vs Render cloud) without stating hardware, dataset, warmup, and concurrency conditions.

---

## 1. Environment Separation

| Tier | Host / Execution | Purpose | Destructive Stress Permitted? |
| :--- | :--- | :--- | :--- |
| **Local Benchmark (`local`)** | Developer workstation (`http://localhost:3000`, `http://localhost:5000`) | Reproducible before/after latency & memory comparisons (`run-baseline.mjs`, `load-stress-soak.mjs`) | Yes (isolated local DB/server) |
| **CI Lab (`ci`)** | GitHub Actions / Playwright headless Chromium | Regression budgets (`jest`, `vitest`, Next.js build size, Playwright `LCP`/`CLS` navigation timing) | Synthetic unit & mocked/local E2E only |
| **Staging / Production (`prod`)** | `cambium-research.vercel.app`, `cambium-api-ufj3.onrender.com` | Passive header/response observation & health probes only | **NEVER** run stress/load floods against production |

---

## 2. Core Statistical Metrics Recorded

- **Latency Percentiles:** `p50`, `p95`, `p99`, `min`, `max` (milliseconds via `performance.now()`).
- **Throughput & Reliability:** Requests per second (`req/s`) and HTTP non-2xx/3xx error percentage.
- **Runtime Resources:** Process `rssMb`, `heapUsedMb`, and Node.js event-loop delay (`p95` ms).
- **Warmup Rule:** Every local HTTP benchmark executes warmup requests before timed measurement so JIT compilation and connection pools are initialized before sampling.

---

## 3. Initial Engineering Targets (Investigate Before Tuning)

| Domain | Metric | Target Reference |
| :--- | :--- | :--- |
| Frontend CWV | LCP / INP / CLS | `LCP <= 2500ms`, `INP <= 200ms`, `CLS <= 0.1` |
| Standard API Read | p95 Latency | `<= 500ms` (local/warm tier) |
| Search / Hybrid | p95 Latency | Measured separately from cold external embedding calls |
| Stability Under Test | HTTP Error Rate | `< 1%` below saturation ceiling |
