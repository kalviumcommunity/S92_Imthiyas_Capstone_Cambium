#!/usr/bin/env node
/**
 * Cambium Documentation, Link, Mermaid, Env-Template & Command Parity Validator.
 * Zero external dependencies. Designed for local DevEx and CI quality gates.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const DOC_TARGETS = [
  'README.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'AGENTS.md',
  'SECURITY.md',
  'docs/README.md',
  'docs/api-guide.md',
  'docs/database.md',
  'docs/audit/DOCUMENTATION_AUDIT_AND_REMEDIATION.md',
  'docs/audit/KNOWN_LIMITATIONS.md',
  'docs/release/mentor-quick-start.md',
];

const DOC_DIRS = [
  'docs/overview',
  'docs/development',
  'docs/operations',
  'docs/product',
  'docs/institutional',
  'docs/architecture/adr',
  'docs/decisions',
];

function collectMarkdownFiles() {
  const files = new Set();
  for (const rel of DOC_TARGETS) {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs)) files.add(abs);
  }
  for (const dirRel of DOC_DIRS) {
    const dirAbs = path.join(ROOT, dirRel);
    if (!fs.existsSync(dirAbs)) continue;
    for (const entry of fs.readdirSync(dirAbs)) {
      if (entry.endsWith('.md')) {
        files.add(path.join(dirAbs, entry));
      }
    }
  }
  return Array.from(files).sort();
}

function checkMarkdownLinksAndMermaid(files) {
  const errors = [];
  const linkRegex = /\[[^\]]*\]\(((?:[^()\n]+|\([^()\n]*\))+)\)/g;

  for (const fileAbs of files) {
    const relFile = path.relative(ROOT, fileAbs).replace(/\\/g, '/');
    const content = fs.readFileSync(fileAbs, 'utf8');
    const dirAbs = path.dirname(fileAbs);

    // 1. Validate balanced code fences around mermaid diagrams
    const lines = content.split(/\r?\n/);
    let inFence = false;
    let fenceType = '';
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (!inFence && /^```/.test(trimmed)) {
        inFence = true;
        fenceType = trimmed.slice(3).trim();
      } else if (inFence && trimmed === '```') {
        inFence = false;
        fenceType = '';
      }
    }
    if (inFence) {
      errors.push(`${relFile}: Unclosed code/mermaid fence (type=${fenceType || 'plain'})`);
    }

    // 2. Check internal links outside fenced code blocks
    const proseOnly = content.replace(/```[\s\S]*?```/g, '');
    let match;
    while ((match = linkRegex.exec(proseOnly)) !== null) {
      const rawHref = match[1].trim();
      if (
        !rawHref ||
        rawHref.startsWith('#') ||
        rawHref.startsWith('http://') ||
        rawHref.startsWith('https://') ||
        rawHref.startsWith('mailto:')
      ) {
        continue;
      }

      const withoutAnchor = rawHref.split('#')[0];
      if (!withoutAnchor) continue;

      let resolved;
      if (withoutAnchor.startsWith('file:///')) {
        const localWinPath = decodeURIComponent(withoutAnchor.replace('file:///', ''));
        resolved = path.normalize(localWinPath);
        // If running on non-Windows OS against recorded Windows absolute links, remap repo suffix cleanly
        if (!fs.existsSync(resolved) && localWinPath.includes('S92_Imthiyas_Capstone_Cambium/')) {
          const suffix = localWinPath.split('S92_Imthiyas_Capstone_Cambium/')[1];
          resolved = path.join(ROOT, suffix);
        }
      } else {
        resolved = path.resolve(dirAbs, withoutAnchor);
      }

      if (!fs.existsSync(resolved)) {
        errors.push(`${relFile}: Broken link target "${rawHref}"`);
      }
    }
  }

  return errors;
}

function checkEnvTemplates() {
  const errors = [];
  const envFiles = ['.env.example', 'server/.env.example', 'client/.env.example'];
  for (const rel of envFiles) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      errors.push(`Missing env template: ${rel}`);
      continue;
    }
    const text = fs.readFileSync(abs, 'utf8');
    if (/AIza[0-9A-Za-z-_]{20,}/.test(text)) {
      errors.push(`${rel}: Potential real Google API key leaked in template`);
    }
    if (/SENTRY_DSN/i.test(text)) {
      errors.push(`${rel}: Contains unused SENTRY_DSN placeholder`);
    }
    if (/text-embedding-004/.test(text)) {
      errors.push(`${rel}: References outdated text-embedding-004 instead of gemini-embedding-001`);
    }
  }
  return errors;
}

function checkDeprecatedAndScriptParity() {
  const errors = [];
  if (fs.existsSync(path.join(ROOT, 'docs/api-guilde.md'))) {
    errors.push('Deprecated typo duplicate docs/api-guilde.md still exists on disk');
  }

  const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const expectedRootScripts = ['dev', 'build', 'test', 'test:jest', 'test:e2e', 'verify:env', 'verify:db', 'schema:apply', 'seed', 'health', 'backup:db', 'restore:db', 'smoke', 'verify:docs'];
  for (const name of expectedRootScripts) {
    if (!rootPkg.scripts?.[name]) {
      errors.push(`Root package.json missing documented script: ${name}`);
    }
  }
  return errors;
}

export function runDocsVerification() {
  const files = collectMarkdownFiles();
  const linkErrors = checkMarkdownLinksAndMermaid(files);
  const envErrors = checkEnvTemplates();
  const parityErrors = checkDeprecatedAndScriptParity();
  const allErrors = [...linkErrors, ...envErrors, ...parityErrors];

  return {
    checkedFilesCount: files.length,
    checkedFiles: files.map((f) => path.relative(ROOT, f).replace(/\\/g, '/')),
    errors: allErrors,
    ok: allErrors.length === 0,
  };
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('verify-docs.mjs')) {
  const summary = runDocsVerification();
  console.log(JSON.stringify({ checkedFilesCount: summary.checkedFilesCount, ok: summary.ok, errors: summary.errors }, null, 2));
  if (!summary.ok) {
    process.exit(1);
  }
}
