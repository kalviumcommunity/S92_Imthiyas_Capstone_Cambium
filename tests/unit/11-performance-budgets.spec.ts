import fs from 'node:fs';
import path from 'node:path';

jest.mock(
  'next/web-vitals',
  () => ({
    useReportWebVitals: jest.fn(),
  }),
  { virtual: true },
);

import { classifyWebVital } from '@/components/WebVitalsReporter';

describe('Suite 11: Frontend Core Web Vitals & Performance Budget Invariants', () => {
  it('classifies LCP, INP, CLS, and TTFB accurately against Google Core Web Vitals thresholds', () => {
    expect(classifyWebVital('LCP', 2100)).toBe('good');
    expect(classifyWebVital('LCP', 3200)).toBe('needs-improvement');
    expect(classifyWebVital('LCP', 4500)).toBe('poor');

    expect(classifyWebVital('INP', 120)).toBe('good');
    expect(classifyWebVital('INP', 350)).toBe('needs-improvement');
    expect(classifyWebVital('INP', 650)).toBe('poor');

    expect(classifyWebVital('CLS', 0.04)).toBe('good');
    expect(classifyWebVital('CLS', 0.18)).toBe('needs-improvement');
    expect(classifyWebVital('CLS', 0.31)).toBe('poor');
  });

  it('enforces immutable cache headers for background assets and dynamic code-splitting on landing showcases', () => {
    const nextConfigSrc = fs.readFileSync(
      path.join(process.cwd(), 'client', 'next.config.ts'),
      'utf8',
    );
    expect(nextConfigSrc).toContain('/backgrounds/:path*');
    expect(nextConfigSrc).toContain('max-age=31536000, immutable');
    expect(nextConfigSrc).toContain('process.env.VERCEL !== "1"');

    const landingSrc = fs.readFileSync(
      path.join(process.cwd(), 'client', 'app', 'page.tsx'),
      'utf8',
    );
    expect(landingSrc).toContain("import dynamic from 'next/dynamic'");
    expect(landingSrc).toContain('PlatformCollageSection');
    expect(landingSrc).toContain('HexContributionGraph');
  });
});
