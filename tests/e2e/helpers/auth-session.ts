import { Page } from "@playwright/test";
import {
  SYNTHETIC_ACTORS,
  SyntheticActor,
  buildSyntheticTestJwt,
} from "../../fixtures/synthetic-actors";

export function buildE2ETestToken(
  actor: SyntheticActor = SYNTHETIC_ACTORS.RESEARCHER_A,
  expiresInSec = 3600,
): string {
  return buildSyntheticTestJwt(actor, { expiresInSec });
}

/**
 * Installs an authenticated synthetic session before React hydration by setting
 * the Next.js Edge cookie (`cambium_token`) and `localStorage` keys expected by `AuthGuard`.
 */
export async function authenticateAsActor(
  page: Page,
  actor: SyntheticActor = SYNTHETIC_ACTORS.RESEARCHER_A,
  baseURL = "http://localhost:3000",
): Promise<string> {
  const token = buildE2ETestToken(actor);
  const parsedBase = new URL(baseURL);

  await page.context().addCookies([
    {
      name: "cambium_token",
      value: token,
      domain: parsedBase.hostname,
      path: "/",
      httpOnly: false,
      sameSite: "Lax",
    },
  ]);

  const userProfile = {
    id: actor.id,
    username: actor.email.split("@")[0],
    email: actor.email,
    fullName: actor.fullName,
    name: actor.fullName,
    role: actor.role,
    institution: actor.institution,
    organizationId: actor.organizationId,
  };

  await page.addInitScript(
    ({ authToken, profile }) => {
      const expiry = String(Date.now() + 30 * 24 * 60 * 60 * 1000);
      window.localStorage.setItem("cambium_token", authToken);
      window.localStorage.setItem("cambium_access_token", authToken);
      window.localStorage.setItem("cambium_user", JSON.stringify(profile));
      window.localStorage.setItem("cambium_session_expiry", expiry);
      document.cookie = `cambium_token=${authToken}; path=/; max-age=2592000; SameSite=Lax`;
    },
    { authToken: token, profile: userProfile },
  );

  // Stub backend port-5000 API calls deterministically when API server is not started alongside Next dev server
  await page.route("http://localhost:5000/**", async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes("/auth/me")) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ user: userProfile }) });
    }
    if (url.includes("/auth/login")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, token, user: userProfile }),
      });
    }
    if (url.includes("/projects") && method === "GET") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          count: 1,
          data: [
            {
              id: "aaaaaaaa-0000-4000-8000-000000000001",
              title: "Cambium Quantum Diagnostics Initiative",
              description: "Synthetic project workspace fixture",
              visibility: "PRIVATE",
              status: "ACTIVE",
              myRole: "LEAD_PI",
              myMembershipStatus: "ACCEPTED",
            },
          ],
        }),
      });
    }
    if (url.includes("/projects") && method === "POST") {
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            id: "aaaaaaaa-0000-4000-8000-000000000099",
            title: "Created QA Workspace",
            visibility: "PRIVATE",
          },
        }),
      });
    }
    if (url.includes("/opportunities")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          count: 1,
          data: [
            {
              id: "opp-qa-1",
              title: "NSF Climate Computing Fellowship",
              type: "Grant",
              organization: "National Science Foundation",
              deadline: "2027-06-15T23:59:59.000Z",
              description: "Deterministic E2E opportunity fixture",
              tags: [{ name: "Climate AI" }],
            },
          ],
        }),
      });
    }
    if (url.includes("/contributions/summary")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          metrics: { totalContributions: 6, activeDays: 5, distinctOutputs: 4 },
          impact: { totalCitations: 420, hIndex: 11 },
          monthlyTotals: [],
          githubIntegration: { connected: false, message: "GitHub integration not connected." },
          byType: {},
          dailyHeatmap: [],
        }),
      });
    }
    if (url.includes("/contributions")) {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true, data: [] }),
    });
  });

  return token;
}
