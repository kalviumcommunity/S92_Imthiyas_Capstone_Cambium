import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

describe('Suite 11: Documentation Integrity, Links, Env Hygiene & Command Parity', () => {
  it('runs scripts/docs/verify-docs.mjs cleanly with zero broken links, Mermaid errors, or stale env placeholders', () => {
    const raw = execFileSync('node', ['scripts/docs/verify-docs.mjs'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    });
    const parsed = JSON.parse(raw);
    expect(parsed.ok).toBe(true);
    expect(parsed.errors).toEqual([]);
    expect(parsed.checkedFilesCount).toBeGreaterThanOrEqual(15);
  });

  it('verifies deprecated typo docs are gone and governance templates exist', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'docs', 'api-guilde.md'))).toBe(false);
    expect(fs.existsSync(path.join(process.cwd(), 'CONTRIBUTING.md'))).toBe(true);
    expect(fs.existsSync(path.join(process.cwd(), '.github', 'PULL_REQUEST_TEMPLATE.md'))).toBe(true);
    expect(fs.existsSync(path.join(process.cwd(), 'docs', 'institutional', 'institutional-readiness-package.md'))).toBe(true);
  });
});
