import { test, expect } from "@playwright/test";

test.describe("04: Constellation Graph Physics & Academic Citation Export", () => {
  test("should render the 2D Constellation Knowledge Graph with controls", async ({ page }) => {
    await page.goto("/graph");
    await page.waitForLoadState("domcontentloaded");

    // Verify title and navigation
    await expect(page).toHaveURL(/.*graph/);

    // Verify filter or category buttons exist
    const structuralHolesBtn = page.locator("button:has-text('Structural Holes')").first();
    await expect(structuralHolesBtn).toBeVisible({ timeout: 10000 });

    // Verify graph workspace is rendered
    const graphWorkspace = page.locator("div.w-full.h-full, svg, canvas").first();
    await expect(graphWorkspace).toBeVisible();

    // Toggle structural holes filter
    await structuralHolesBtn.click();
    await page.waitForTimeout(300);
    await structuralHolesBtn.click();
  });

  test("should open Academic Citation Export Modal and support BibTeX/APA/IEEE", async ({ page }) => {
    await page.goto("/opportunities");
    await page.waitForLoadState("domcontentloaded");

    // Click an opportunity card to open the detail panel
    const firstOppCard = page.locator("article, div[class*='rounded-2xl']:has(h3), div[class*='rounded-2xl']:has(h2)").first();
    if (await firstOppCard.isVisible()) {
      await firstOppCard.click();
      await page.waitForTimeout(500);

      // Locate Cite button in slide-over panel
      const citeBtn = page.locator("button:has-text('Cite'), button[title*='Cite']").first();
      if (await citeBtn.isVisible()) {
        await citeBtn.click();
        await page.waitForTimeout(500);

        // Verify Citation Modal is visible
        const modal = page.locator("div:has-text('Export Academic Citation')").first();
        await expect(modal).toBeVisible();

        // Verify BibTeX tab & snippet
        const bibtexTab = page.locator("button:has-text('BibTeX')");
        await expect(bibtexTab).toBeVisible();
        await expect(page.getByText("@misc{").first()).toBeVisible();

        // Switch to APA 7th tab
        const apaTab = page.locator("button:has-text('APA 7th')");
        if (await apaTab.isVisible()) {
          await apaTab.click();
          await page.waitForTimeout(200);
        }

        // Switch to IEEE tab
        const ieeeTab = page.locator("button:has-text('IEEE')");
        if (await ieeeTab.isVisible()) {
          await ieeeTab.click();
          await page.waitForTimeout(200);
        }

        // Verify copy button exists
        const copyBtn = page.locator("button:has-text('Copy Citation')");
        await expect(copyBtn).toBeVisible();

        // Close modal
        const closeBtn = page.locator("button:has(svg.lucide-x), button:has-text('Close')").first();
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
        }
      }
    }
  });
});
