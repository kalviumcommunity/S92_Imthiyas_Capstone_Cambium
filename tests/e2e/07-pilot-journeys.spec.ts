import { test, expect } from "@playwright/test";

test.describe("07: Mentor Pilot Journey & Failure-Honesty Acceptance", () => {
  test("forgot-password displays honest coordinator reset notice instead of fake email dispatch", async ({
    page,
  }) => {
    await page.goto("/forgot-password");
    await expect(page.locator("h2", { hasText: /Reset your password/i })).toBeVisible();

    await page.fill("input[type='email']", "mentor1@university.edu");
    await page.click("button[type='submit']");

    await expect(
      page.locator("h2", { hasText: /Coordinator-assisted password reset/i }),
    ).toBeVisible();
    await expect(page.locator("text=not enabled during the controlled mentor pilot")).toBeVisible();
  });

  test("sign-in surfaces an honest error rather than forging demo tokens when API fails", async ({
    page,
  }) => {
    await page.route("**/api/**/auth/login", (route) => route.abort("failed"));
    await page.route("**/api/auth/login", (route) => route.abort("failed"));

    await page.goto("/sign-in");
    await page.fill("input[type='email']", "mentor.test@university.edu");
    await page.fill("input[type='password']", "PilotTestPass!123");
    await page.click("button[type='submit']");

    await expect(
      page.locator("text=/Unable to reach the Cambium authentication server|Sign-in failed/i"),
    ).toBeVisible({ timeout: 6000 });
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test("sign-up surfaces an honest error when registration backend is unreachable", async ({
    page,
  }) => {
    await page.route("**/api/**/auth/register", (route) => route.abort("failed"));
    await page.route("**/api/auth/register", (route) => route.abort("failed"));

    await page.goto("/sign-up");
    await page.fill("input[type='email']", "new.mentor@university.edu");
    await page.fill("input[type='password']", "PilotTestPass!123");
    await page.click("button[type='submit']");

    await expect(
      page.locator("text=/Unable to reach the Cambium registration service|Registration failed/i"),
    ).toBeVisible({ timeout: 6000 });
    await expect(page).toHaveURL(/\/sign-up/);
  });
});
