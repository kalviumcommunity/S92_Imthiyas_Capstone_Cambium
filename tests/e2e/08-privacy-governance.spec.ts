import { test, expect } from "@playwright/test";

const MOCK_ACTOR = {
  id: "11111111-1111-4111-8111-111111111101",
  username: "privacy_scholar",
  email: "privacy.scholar@cambium.invalid",
  fullName: "Dr. Priya Scholar",
  role: "Researcher",
  institution: "National Research University",
};

function makeValidShapeJwt(): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      id: MOCK_ACTOR.id,
      sub: MOCK_ACTOR.id,
      email: MOCK_ACTOR.email,
      role: MOCK_ACTOR.role,
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  ).toString("base64url");
  return `${header}.${payload}.synthetic-privacy-e2e-sig`;
}

test.describe("08: Privacy Governance, Notice Integrity & Settings Persistence", () => {
  test("public /privacy notice displays configured placeholders and India DPDP phased readiness disclosure", async ({
    page,
  }) => {
    await page.goto("/privacy", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/\[OPERATOR_LEGAL_ENTITY_NAME/i).first()).toBeVisible();
    await expect(page.getByText(/Digital Personal Data Protection Act, 2023/i).first()).toBeVisible();
    await expect(page.getByText(/does not itself constitute legal certification/i).first()).toBeVisible();
    await expect(page.locator("text=77 Massachusetts Avenue")).toHaveCount(0);
    await expect(page.locator("text=dpo@cambium.mit.edu")).toHaveCount(0);
  });

  test("settings Privacy desk loads defaults (AI opt-in OFF), persists consent toggle, and triggers backend export", async ({
    page,
  }) => {
    const token = makeValidShapeJwt();
    let putCalledWith: any = null;
    let exportCalled = false;

    await page.context().addCookies([
      {
        name: "cambium_token",
        value: token,
        domain: "localhost",
        path: "/",
        httpOnly: false,
        sameSite: "Lax",
      },
    ]);

    await page.addInitScript(
      ({ authToken, profile }) => {
        const expiry = String(Date.now() + 86400000);
        window.localStorage.setItem("cambium_token", authToken);
        window.localStorage.setItem("cambium_access_token", authToken);
        window.localStorage.setItem("cambium_user", JSON.stringify(profile));
        window.localStorage.setItem("cambium_session_expiry", expiry);
        document.cookie = `cambium_token=${authToken}; path=/; max-age=86400; SameSite=Lax`;
      },
      { authToken: token, profile: MOCK_ACTOR },
    );

    await page.route("http://localhost:5000/**", async (route) => {
      const url = route.request().url();
      const method = route.request().method();

      if (url.includes("/privacy/preferences") && method === "GET") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              profilePublic: true,
              showInstitution: true,
              showPublications: false,
              allowSearch: true,
              aiProcessingConsent: false,
              optionalAnalyticsConsent: false,
            },
          }),
        });
      }

      if (url.includes("/privacy/preferences") && method === "PUT") {
        putCalledWith = JSON.parse(route.request().postData() || "{}");
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ success: true, data: putCalledWith }),
        });
      }

      if (url.includes("/privacy/export") && method === "GET") {
        exportCalled = true;
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            data: {
              schemaVersion: "cambium-privacy-export-v1",
              account: MOCK_ACTOR,
              privacyPreferences: { aiProcessingConsent: true },
            },
          }),
        });
      }

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: [] }),
      });
    });

    await page.goto("/settings", { waitUntil: "networkidle" });
    const privacyNav = page.locator("button:has-text('Privacy')").first();
    await expect(privacyNav).toBeVisible({ timeout: 10000 });
    await privacyNav.click();

    await expect(
      page.getByText(/External AI research assistant processing \(Opt-In\)/i).first(),
    ).toBeVisible();

    const switches = page.locator("button[role='switch']");
    const aiSwitch = switches.nth(4);
    await expect(aiSwitch).toHaveAttribute("aria-checked", "false");
    await aiSwitch.click();
    await expect(aiSwitch).toHaveAttribute("aria-checked", "true");

    const consentDismiss = page
      .locator("aside[aria-label='Privacy and Cookie Preferences'] button")
      .first();
    if (await consentDismiss.isVisible()) {
      await consentDismiss.click();
    }

    await page.locator("button:has-text('Save changes')").first().click();
    await expect.poll(() => putCalledWith?.aiProcessingConsent).toBe(true);

    await page.locator("button:has-text('Download Personal Archive')").first().click();
    await expect.poll(() => exportCalled).toBe(true);
  });
});
