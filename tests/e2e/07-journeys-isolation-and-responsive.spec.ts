import { test, expect } from "@playwright/test";
import { authenticateAsActor, buildE2ETestToken } from "./helpers/auth-session";
import { SYNTHETIC_ACTORS } from "../fixtures/synthetic-actors";

test.describe("07: Real Auth Guarding, Workspace Persistence & Responsive Viewport Checks", () => {
  test("guest visitors on protected routes are redirected cleanly to /sign-in with auth_required notice", async ({
    page,
  }) => {
    await page.context().clearCookies();
    await page.goto("/workspace/upload", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveURL(/\/sign-in\?redirect=%2Fworkspace%2Fupload&notice=auth_required/);
    await expect(
      page.getByText(/Institutional authentication is required/i).first(),
    ).toBeVisible();
  });

  test("authenticated researcher renders protected /dashboard and /workspace/upload without login redirect", async ({
    page,
  }) => {
    await authenticateAsActor(page, SYNTHETIC_ACTORS.RESEARCHER_A);

    await page.goto("/dashboard", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/dashboard/);

    await page.goto("/workspace/upload", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/workspace\/upload/);
    await expect(page.getByText(/Evo_Genome_Scale_Foundation_2024\.pdf/i).first()).toBeVisible();
  });

  test("authenticated scholar form login redirects to /dashboard cleanly without swallowing failures", async ({
    page,
  }) => {
    const token = buildE2ETestToken(SYNTHETIC_ACTORS.PI_STANFORD);
    const mockUser = {
      id: SYNTHETIC_ACTORS.PI_STANFORD.id,
      username: "pi_stanford",
      email: SYNTHETIC_ACTORS.PI_STANFORD.email,
      fullName: SYNTHETIC_ACTORS.PI_STANFORD.fullName,
      role: SYNTHETIC_ACTORS.PI_STANFORD.role,
    };

    await page.route("**/api/**/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, token, user: mockUser }),
      });
    });

    await page.goto("/sign-in", { waitUntil: "domcontentloaded" });
    const emailInput = page.locator("#sign-in-email");
    const passwordInput = page.locator("input[type='password']");

    await expect(async () => {
      await emailInput.fill(SYNTHETIC_ACTORS.PI_STANFORD.email);
      await passwordInput.fill("StrongPass123!");
      await expect(
        page.getByText(/Identity Provider Verified|Standard Research Email Recognized/i).first(),
      ).toBeVisible({ timeout: 1000 });
      await expect(passwordInput).toHaveValue("StrongPass123!", { timeout: 1000 });
    }).toPass({ timeout: 15000 });

    await page.click("button[type='submit']");

    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("responsive layout prevents horizontal overflow on mobile (375px) and desktop (1440px)", async ({
    page,
  }) => {
    await authenticateAsActor(page, SYNTHETIC_ACTORS.RESEARCHER_A);

    for (const vp of [
      { width: 375, height: 812 },
      { width: 1440, height: 900 },
    ]) {
      await page.setViewportSize(vp);
      await page.goto("/opportunities", { waitUntil: "domcontentloaded" });
      await expect(page).toHaveURL(/\/opportunities/);

      const overflowDelta = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflowDelta).toBeLessThanOrEqual(4);
    }
  });
});
