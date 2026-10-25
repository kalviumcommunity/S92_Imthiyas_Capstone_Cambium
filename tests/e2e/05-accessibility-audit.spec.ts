import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("05: WCAG 2.2 Level AA Automated Accessibility Audits (Axe-Core)", () => {
  test("Landing Page ('/') should satisfy WCAG 2.2 AA standards with zero critical violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const criticalViolations = results.violations.filter((v) => v.impact === "critical");
    expect(criticalViolations, `Found critical accessibility violations on '/': ${JSON.stringify(criticalViolations, null, 2)}`).toEqual([]);
  });

  test("Authentication Portal ('/sign-in') should satisfy WCAG 2.2 AA standards", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("domcontentloaded");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const criticalViolations = results.violations.filter((v) => v.impact === "critical");
    expect(criticalViolations, `Found critical accessibility violations on '/sign-in': ${JSON.stringify(criticalViolations, null, 2)}`).toEqual([]);
  });

  test("Scholar Dashboard ('/dashboard') should satisfy WCAG 2.2 AA standards", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("domcontentloaded");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const criticalViolations = results.violations.filter((v) => v.impact === "critical");
    expect(criticalViolations, `Found critical accessibility violations on '/dashboard': ${JSON.stringify(criticalViolations, null, 2)}`).toEqual([]);
  });

  test("Opportunities Catalog ('/opportunities') should satisfy WCAG 2.2 AA standards", async ({ page }) => {
    await page.goto("/opportunities");
    await page.waitForLoadState("domcontentloaded");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const criticalViolations = results.violations.filter((v) => v.impact === "critical");
    expect(criticalViolations, `Found critical accessibility violations on '/opportunities': ${JSON.stringify(criticalViolations, null, 2)}`).toEqual([]);
  });

  test("Constellation Graph Workspace ('/graph') should satisfy WCAG 2.2 AA standards", async ({ page }) => {
    await page.goto("/graph");
    await page.waitForLoadState("domcontentloaded");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const criticalViolations = results.violations.filter((v) => v.impact === "critical");
    expect(criticalViolations, `Found critical accessibility violations on '/graph': ${JSON.stringify(criticalViolations, null, 2)}`).toEqual([]);
  });

  test("Agentic Reader Desk ('/agent-reader') should satisfy WCAG 2.2 AA standards", async ({ page }) => {
    await page.goto("/agent-reader");
    await page.waitForLoadState("domcontentloaded");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const criticalViolations = results.violations.filter((v) => v.impact === "critical");
    expect(criticalViolations, `Found critical accessibility violations on '/agent-reader': ${JSON.stringify(criticalViolations, null, 2)}`).toEqual([]);
  });
});
