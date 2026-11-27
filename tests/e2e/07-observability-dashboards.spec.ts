import { test, expect } from '@playwright/test';

test.describe('Observability & Analytics Dashboards (/observability)', () => {
  test('renders all 4 observability tabs cleanly with intercepted live telemetry & k>=3 notice', async ({
    page,
    context,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await context.addCookies([
      {
        name: 'cambium_token',
        value: 'e2e-verified-jwt-placeholder',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('cambium_token', 'e2e-verified-jwt-placeholder');
      localStorage.setItem('cambium_session_expiry', String(Date.now() + 3600_000));
      localStorage.setItem(
        'cambium_user',
        JSON.stringify({
          id: '00000000-0000-4000-8000-000000000001',
          fullName: 'Dr. Governance Lead',
          role: 'RD_DIRECTOR',
        }),
      );
    });

    await page.route('**/api/v1/analytics/dashboards/product**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          metadata: {
            windowDays: 30,
            excludedEventCount: 4,
            totalIncludedEvents: 18,
          },
          activitySummary: {
            dau: 2,
            wau: 4,
            mau: 6,
            stickinessRatio: 0.333,
            activeOrganizations: 2,
            institutionalActiveUsers: 5,
          },
          activation: {
            activatedUsers: 4,
            eligibleSignups: 6,
            activationRatePct: 66.7,
          },
          funnel: [
            { stage: 'Signed Up', eventName: 'user.signup.completed', distinctUsers: 6 },
            { stage: 'Saved Opportunity', eventName: 'opportunity.saved', distinctUsers: 5 },
            { stage: 'Created Workspace', eventName: 'workspace.created', distinctUsers: 4 },
          ],
          cohorts: [
            { cohortDate: '2026-11-20', signedUp: 4, d1RetainedPct: 75, d7RetainedPct: 50, d30RetainedPct: 0 },
          ],
          failuresByEvent: {},
        }),
      });
    });

    await page.route('**/api/v1/analytics/dashboards/engineering**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          telemetry: {
            totalRequests: 142,
            totalErrors: 1,
            errorRatePercent: 0.7,
            p50LatencyMs: 28,
            p90LatencyMs: 65,
            p95LatencyMs: 92,
            p99LatencyMs: 140,
          },
          database: {
            connected: true,
            maxConnections: 50,
            activeConnections: 3,
            idleConnections: 4,
            waitingLocksCount: 0,
            slowQueriesCount: 0,
          },
          queues: {
            mode: 'postgres-durable-queue',
            summary: { queued: 0, running: 0, completed: 12, dead: 0, oldestPendingAgeSeconds: 0 },
          },
          circuitBreakers: {},
          clientErrors: { countLast24h: 0, recent: [] },
          alerts: [],
        }),
      });
    });

    await page.route('**/api/v1/analytics/dashboards/ai**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          runtime: {
            totalCalls: 9,
            outcomes: { successCount: 7, fallbackCount: 2, failureCount: 0, fallbackRatePct: 22.2, failureRatePct: 0 },
            latency: { avgLatencyMs: 310, p95LatencyMs: 640 },
            retrievalQuality: { avgChunksRetrieved: 3, avgCitationsPerChat: 2.4 },
            tokensAndCost: {
              totalEstimatedCostUsd: 0.0018,
              costPerSuccessfulWorkflowUsd: 0.000257,
              pricingNote: 'Estimated from reference Gemini rates; fallbacks $0.00.',
            },
          },
          offlineEvaluation: {
            datasetVersion: '2026-11.v1',
            recallAt3Pct: 100,
            precisionAt3Pct: 88.9,
            citationCompletenessPct: 100,
            abstentionAccuracyPct: 100,
          },
        }),
      });
    });

    await page.route('**/api/v1/analytics/dashboards/institution**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          organizationId: 'org-test',
          windowDays: 30,
          minCohortThreshold: 3,
          activeResearchersCount: 2,
          privacySuppressed: true,
          suppressionReason:
            'Detailed institutional breakdowns require at least 3 distinct active researchers to prevent individual attribution.',
          summary: null,
        }),
      });
    });

    await page.goto('/observability');
    await expect(page.getByRole('heading', { name: /Product Analytics & Observability/i })).toBeVisible();
    await expect(page.getByText('66.7%')).toBeVisible();

    await page.getByRole('tab', { name: /Engineering Health/i }).click();
    await expect(page.getByText('92 ms')).toBeVisible();
    await expect(page.getByText(/All monitored API, PostgreSQL/i)).toBeVisible();

    await page.getByRole('tab', { name: /AI & RAG Quality/i }).click();
    await expect(page.getByText(/Eval Recall@3 \(2026-11\.v1\)/i)).toBeVisible();

    await page.getByRole('tab', { name: /Institutional Usage/i }).click();
    await expect(page.getByText(/Subgroup Breakdown Suppressed/i)).toBeVisible();

    expect(pageErrors).toHaveLength(0);
  });
});
