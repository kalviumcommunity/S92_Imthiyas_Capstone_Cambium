import { test, expect } from '@playwright/test';

test.describe('Frontend Core Web Vitals & Route Responsiveness Lab Check', () => {
  test('Landing (/) & Opportunities (/opportunities) load with bounded CLS, zero horizontal overflow & clean web vitals hook', async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.addInitScript(() => {
      (window as any).__TEST_CLS__ = 0;
      try {
        const obs = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              (window as any).__TEST_CLS__ += entry.value;
            }
          }
        });
        obs.observe({ type: 'layout-shift', buffered: true });
      } catch {
        // Ignore if unsupported
      }
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.keyboard.press('Escape');
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });

    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      return {
        ttfbMs: nav ? Math.round(nav.responseStart - nav.requestStart) : 0,
        domInteractiveMs: nav ? Math.round(nav.domInteractive - nav.startTime) : 0,
        cls: Number(((window as any).__TEST_CLS__ || 0).toFixed(4)),
        overflowPx: document.documentElement.scrollWidth - window.innerWidth,
      };
    });

    expect(metrics.overflowPx).toBeLessThanOrEqual(2);
    expect(metrics.cls).toBeLessThanOrEqual(0.15);

    await page.goto('/opportunities', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main, input').first()).toBeVisible({ timeout: 15000 });
    expect(pageErrors).toHaveLength(0);
  });
});
