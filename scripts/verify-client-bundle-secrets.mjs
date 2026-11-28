#!/usr/bin/env node
/**
 * Guardrail: prevents server-only secrets from leaking into Next.js public env vars
 * or client-side source bundles.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const FORBIDDEN_CLIENT_KEYS = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'AUDIT_HMAC_SECRET',
  'DATABASE_URL',
  'POSTGRES_PASSWORD',
  'GEMINI_API_KEY',
  'RESEND_API_KEY',
  'REDIS_PASSWORD',
];

const violations = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.next-dev'].includes(entry.name)) continue;
      walk(full);
    } else if (/\.(ts|tsx|js|mjs|env.*)$/i.test(entry.name)) {
      const content = fs.readFileSync(full, 'utf8');
      const rel = path.relative(rootDir, full);

      for (const key of FORBIDDEN_CLIENT_KEYS) {
        if (content.includes(`NEXT_PUBLIC_${key}`)) {
          violations.push(`${rel}: forbidden NEXT_PUBLIC_${key} exposure`);
        }
        if (rel.startsWith('client') && !rel.includes('.env') && new RegExp(`process\\.env\\.${key}\\b`).test(content)) {
          violations.push(`${rel}: client references server-only process.env.${key}`);
        }
      }
    }
  }
}

walk(path.join(rootDir, 'client'));
for (const envExample of ['.env.example', '.env.production.example']) {
  const full = path.join(rootDir, envExample);
  if (fs.existsSync(full)) {
    const content = fs.readFileSync(full, 'utf8');
    for (const key of FORBIDDEN_CLIENT_KEYS) {
      if (content.includes(`NEXT_PUBLIC_${key}`)) {
        violations.push(`${envExample}: forbidden NEXT_PUBLIC_${key} entry`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error('Client bundle secret hygiene check FAILED:');
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}

console.log('Client bundle secret hygiene check PASSED (0 leaks across client/ and env examples).');
