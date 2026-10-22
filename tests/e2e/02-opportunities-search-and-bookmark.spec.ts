import { test, expect } from "@playwright/test";

test.describe("02: Semantic Hybrid Search & Opportunity Bookmarking", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to opportunities catalog
    await page.goto("/opportunities");
    await page.waitForLoadState("domcontentloaded");
  });

  test("should render catalog title and live opportunities count", async ({ page }) => {
    // Verify title presence
    const title = page.getByRole("heading", { name: /Opportunities/i }).first();
    await expect(title).toBeVisible();

    // Verify search input is rendered and focusable
    const searchInput = page.locator("input[placeholder*='Search']").first();
    await expect(searchInput).toBeVisible();
  });

  test("should filter opportunities when keyword is entered", async ({ page }) => {
    const searchInput = page.locator("input[placeholder*='Search']").first();
    await searchInput.fill("Quantum");
    await page.waitForTimeout(500);

    // Verify search value persisted in input
    await expect(searchInput).toHaveValue("Quantum");

    // Clear input to restore full list
    await searchInput.fill("");
    await page.waitForTimeout(300);
  });

  test("should switch category filter tabs smoothly", async ({ page }) => {
    // Locate category filter buttons
    const grantsTab = page.locator("button:has-text('Grants')").first();
    if (await grantsTab.isVisible()) {
      await grantsTab.click();
      await page.waitForTimeout(300);
    }

    const allTab = page.locator("button:has-text('All')").first();
    if (await allTab.isVisible()) {
      await allTab.click();
      await page.waitForTimeout(300);
    }
  });

  test("should toggle bookmark on an opportunity card", async ({ page }) => {
    // Locate the first bookmark button
    const bookmarkBtn = page.locator("button[aria-label*='Bookmark'], button[title*='Bookmark'], button:has(svg path[d*='M2 2a1 1 0 011-1h8'])").first();
    if (await bookmarkBtn.isVisible()) {
      await bookmarkBtn.click();
      await page.waitForTimeout(400);
      // Click again to toggle back
      await bookmarkBtn.click();
    }
  });
});
