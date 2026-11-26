import { test, expect } from "@playwright/test";
import { authenticateAsActor, buildE2ETestToken } from "./helpers/auth-session";
import { SYNTHETIC_ACTORS } from "../fixtures/synthetic-actors";

test.describe("01: Researcher Auth & Dashboard Navigation", () => {
  test("should display Living Materials landing page with brand assets", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/CAMBIUM/i);

    // Verify main branding & navigation
    const cambiumText = page.locator("text=CAMBIUM").first();
    await expect(cambiumText).toBeVisible();

    // Verify hero call to action
    const exploreBtn = page.locator("a[href*='/sign-in'], a[href*='/dashboard']").first();
    await expect(exploreBtn).toBeVisible();
  });

  test("should authenticate scholar and navigate to /dashboard", async ({ page }) => {
    const token = buildE2ETestToken(SYNTHETIC_ACTORS.RESEARCHER_A);
    const mockUser = {
      id: SYNTHETIC_ACTORS.RESEARCHER_A.id,
      username: "researcher_a",
      email: SYNTHETIC_ACTORS.RESEARCHER_A.email,
      fullName: SYNTHETIC_ACTORS.RESEARCHER_A.fullName,
      role: SYNTHETIC_ACTORS.RESEARCHER_A.role,
    };

    await page.route("**/api/**/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, token, user: mockUser }),
      });
    });

    await page.goto("/sign-in", { waitUntil: "domcontentloaded" });

    // Check auth page title & Living Materials form elements
    await expect(page.locator("text=Sign in").first()).toBeVisible();

    const emailInput = page.locator("#sign-in-email");
    const passwordInput = page.locator("input[type='password']");
    await expect(async () => {
      await emailInput.fill(SYNTHETIC_ACTORS.RESEARCHER_A.email);
      await passwordInput.fill("StrongPass123!");
      await expect(
        page.getByText(/Identity Provider Verified|Standard Research Email Recognized/i).first(),
      ).toBeVisible({ timeout: 1000 });
      await expect(passwordInput).toHaveValue("StrongPass123!", { timeout: 1000 });
    }).toPass({ timeout: 15000 });

    const consentBtn = page
      .locator("aside[aria-label='Privacy and Cookie Preferences'] button")
      .first();
    if (await consentBtn.isVisible()) {
      await consentBtn.click();
    }

    await page.click("button[type='submit']");

    // Expect authentic navigation to /dashboard (never swallow failed login redirects)
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await expect(page).toHaveURL(/.*dashboard/);

    // Verify top sidebar navigation item is explicitly labeled "Dashboard"
    const dashboardNav = page.locator("aside nav a[href='/dashboard']").first();
    await expect(dashboardNav).toBeVisible();
    await expect(dashboardNav).toHaveAttribute("title", /Dashboard/i);

    // Verify greeting is rendered
    await expect(page.locator("text=Good").first()).toBeVisible();
  });

  test("should open global command palette via search trigger", async ({ page }) => {
    await authenticateAsActor(page, SYNTHETIC_ACTORS.RESEARCHER_A);
    await page.goto("/dashboard", { waitUntil: "networkidle" });

    // Click global command palette search trigger
    const searchTrigger = page.locator("button:has-text('Search Cambium'), aside button:has(svg.lucide-search)").first();
    await expect(searchTrigger).toBeVisible();
    await searchTrigger.click();

    // Verify Command Palette modal appears
    const paletteInput = page.locator("input[placeholder*='Search'], input[placeholder*='Type a command']").first();
    await expect(paletteInput).toBeVisible({ timeout: 5000 });

    // Press Escape to dismiss
    await page.keyboard.press("Escape");
  });
});
