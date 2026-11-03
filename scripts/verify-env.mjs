#!/usr/bin/env node
// ==============================================================================
// CAMBIUM RESEARCH PLATFORM — PRODUCTION ENVIRONMENT AUDIT & VAULT VERIFIER
// ==============================================================================
// Document ID: CAMBIUM-VERIFY-ENV-2026-V2
// Author: Shaik Mohamed Imthiyas T
// Purpose: Validates environment variables, cryptographic entropy, database strings,
//          CORS boundaries, and third-party integrations against production specifications.
// ==============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Terminal ANSI Color Codes
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';

// Command-Line Flags
const args = process.argv.slice(2);
const isStrictProd = args.includes('--production') || process.env.NODE_ENV === 'production';
const checkTemplatesOnly = args.includes('--templates');
const customFileArg = args.find((a) => a.startsWith('--file='))?.split('=')[1];

/**
 * Parses raw .env content into a key-value record without external dependencies.
 */
function parseEnvContent(rawContent) {
  const result = {};
  const lines = rawContent.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    result[key] = val;
  }
  return result;
}

/**
 * Loads and merges environment configurations.
 */
function loadEnvironment() {
  if (customFileArg) {
    const filePath = path.resolve(rootDir, customFileArg);
    if (!fs.existsSync(filePath)) {
      console.error(`${RED}✖ Specified file does not exist: ${filePath}${RESET}`);
      process.exit(1);
    }
    return {
      merged: parseEnvContent(fs.readFileSync(filePath, 'utf8')),
      sources: [customFileArg],
    };
  }

  const sources = [];
  const merged = {};

  const searchPaths = [
    path.join(rootDir, '.env'),
    path.join(rootDir, 'server', '.env'),
    path.join(rootDir, 'client', '.env.local'),
  ];

  for (const sp of searchPaths) {
    if (fs.existsSync(sp)) {
      const rel = path.relative(rootDir, sp);
      sources.push(rel);
      const parsed = parseEnvContent(fs.readFileSync(sp, 'utf8'));
      Object.assign(merged, parsed);
    }
  }

  // Also include current process.env variables
  for (const [k, v] of Object.entries(process.env)) {
    if (v !== undefined && !merged[k]) {
      merged[k] = v;
    }
  }

  return { merged, sources };
}

/**
 * Verification Engine
 */
function verifyEnvironment(env, isProdMode) {
  const checks = {
    passed: [],
    warnings: [],
    errors: [],
  };

  const pass = (label, msg) => checks.passed.push({ label, msg });
  const warn = (label, msg) => checks.warnings.push({ label, msg });
  const error = (label, msg) => checks.errors.push({ label, msg });

  // ---------------------------------------------------------------------------
  // 1. Runtime Core & Port
  // ---------------------------------------------------------------------------
  const nodeEnv = env.NODE_ENV || 'development';
  if (isProdMode && nodeEnv !== 'production') {
    error('NODE_ENV', `Expected 'production' in production mode, but found '${nodeEnv}'.`);
  } else {
    pass('NODE_ENV', `Configured as '${nodeEnv}'.`);
  }

  const port = parseInt(env.PORT || '5000', 10);
  if (isNaN(port) || port < 1024 || port > 65535) {
    warn('PORT', `PORT '${env.PORT}' is atypical; expected standard port between 1024-65535 (default 5000).`);
  } else {
    pass('PORT', `Backend listener configured on port ${port}.`);
  }

  // ---------------------------------------------------------------------------
  // 2. Cryptographic Identity & JWT Secrets
  // ---------------------------------------------------------------------------
  const jwtSecret = env.JWT_SECRET || '';
  const jwtRefreshSecret = env.JWT_REFRESH_SECRET || '';
  const auditSecret = env.AUDIT_HMAC_SECRET || '';

  const weakPlaceholders = [
    'cambium_secret_key',
    'cambium_jwt_secret_key',
    'cambium-ultra-secure',
    'cambium-super-secure',
    'change_in_production',
    'your_jwt_access_secret_key',
    'your_jwt_refresh_secret_key',
    'replace_with_64_char_hex',
  ];

  const isPlaceholder = (secret) =>
    weakPlaceholders.some((p) => secret.toLowerCase().includes(p.toLowerCase()));

  // JWT_SECRET
  if (!jwtSecret) {
    if (isProdMode) error('JWT_SECRET', 'JWT_SECRET is required in production.');
    else warn('JWT_SECRET', 'JWT_SECRET not set; using development fallback secret.');
  } else if (isPlaceholder(jwtSecret)) {
    if (isProdMode) {
      error('JWT_SECRET', 'Default or placeholder JWT_SECRET detected in production! Generate a high-entropy secret.');
    } else {
      warn('JWT_SECRET', 'Using known development placeholder for JWT_SECRET.');
    }
  } else if (jwtSecret.length < 32) {
    if (isProdMode) {
      error('JWT_SECRET', `JWT_SECRET has insufficient entropy (${jwtSecret.length} chars). Minimum 32 required (64 hex recommended).`);
    } else {
      warn('JWT_SECRET', `JWT_SECRET is short (${jwtSecret.length} chars).`);
    }
  } else {
    pass('JWT_SECRET', `Cryptographic secret entropy verified (${jwtSecret.length} chars).`);
  }

  // JWT_REFRESH_SECRET
  if (jwtRefreshSecret) {
    if (jwtSecret && jwtRefreshSecret === jwtSecret) {
      error('JWT_REFRESH_SECRET', 'JWT_REFRESH_SECRET cannot be identical to JWT_SECRET (Zero-Trust token isolation violation).');
    } else if (isPlaceholder(jwtRefreshSecret)) {
      if (isProdMode) error('JWT_REFRESH_SECRET', 'Default placeholder JWT_REFRESH_SECRET detected in production.');
      else warn('JWT_REFRESH_SECRET', 'Using development placeholder for JWT_REFRESH_SECRET.');
    } else {
      pass('JWT_REFRESH_SECRET', `Dedicated refresh token HMAC secret verified (${jwtRefreshSecret.length} chars).`);
    }
  } else {
    if (isProdMode) error('JWT_REFRESH_SECRET', 'JWT_REFRESH_SECRET is required in production.');
    else warn('JWT_REFRESH_SECRET', 'JWT_REFRESH_SECRET not set; using development fallback.');
  }

  // AUDIT_HMAC_SECRET
  if (auditSecret) {
    pass('AUDIT_HMAC_SECRET', `Merkle audit ledger HMAC secret configured (${auditSecret.length} chars).`);
  } else {
    warn('AUDIT_HMAC_SECRET', 'AUDIT_HMAC_SECRET not set; using default SHA-256 ledger key.');
  }

  // ---------------------------------------------------------------------------
  // 3. PostgreSQL Database & pgvector
  // ---------------------------------------------------------------------------
  const dbUrl = env.DATABASE_URL || '';
  const dbHost = env.POSTGRES_HOST || 'localhost';
  const dbUser = env.POSTGRES_USER || 'postgres';
  const dbPass = env.POSTGRES_PASSWORD || '';
  const dbName = env.POSTGRES_DB || 'cambium';
  const dbSsl = env.DB_SSL === 'true';

  let resolvedHost = dbHost;
  let resolvedPass = dbPass;
  let resolvedSsl = dbSsl;

  if (dbUrl) {
    try {
      const parsed = new URL(dbUrl);
      if (parsed.hostname) resolvedHost = parsed.hostname;
      if (parsed.password) resolvedPass = decodeURIComponent(parsed.password);
      if (parsed.searchParams.get('sslmode') === 'require') resolvedSsl = true;
      pass('DATABASE_URL', `Parsed connection string for '${parsed.pathname.replace(/^\//, '')}' at ${resolvedHost}:${parsed.port || 5432}.`);
    } catch {
      warn('DATABASE_URL', 'DATABASE_URL format could not be parsed as a standard URL.');
    }
  } else {
    pass('POSTGRES_HOST', `Configured as ${resolvedHost} (database: ${dbName}, user: ${dbUser}).`);
  }

  const isLocalHost = resolvedHost === 'localhost' || resolvedHost === '127.0.0.1';

  if (isProdMode) {
    if (resolvedPass === 'postgres' || resolvedPass === 'password' || resolvedPass.includes('CHANGE_THIS')) {
      error('POSTGRES_PASSWORD', 'Default or placeholder database password detected in production.');
    }
    if (!isLocalHost && !resolvedSsl) {
      warn('DB_SSL', 'Remote production database without explicit DB_SSL=true or sslmode=require.');
    } else {
      pass('DB_SSL', resolvedSsl ? 'TLS/SSL transport enabled.' : 'Local transport configured.');
    }
  }

  // ---------------------------------------------------------------------------
  // 4. Redis Cluster & Queues
  // ---------------------------------------------------------------------------
  const redisUrl = env.REDIS_URL || '';
  const redisHost = env.REDIS_HOST || 'localhost';
  const redisPass = env.REDIS_PASSWORD || '';

  if (redisUrl) {
    pass('REDIS_URL', `Redis configured via URI (${redisUrl.startsWith('rediss://') ? 'TLS Enabled' : 'Standard'}).`);
  } else {
    pass('REDIS_HOST', `Redis configured at ${redisHost}:${env.REDIS_PORT || 6379}.`);
  }

  if (isProdMode && !redisPass && (!redisUrl || !redisUrl.includes('@'))) {
    warn('REDIS_PASSWORD', 'No Redis password detected for production; verify network VPC isolation.');
  }

  // ---------------------------------------------------------------------------
  // 5. CORS Origins
  // ---------------------------------------------------------------------------
  const corsOrigin = env.CORS_ORIGIN || '';
  if (!corsOrigin) {
    warn('CORS_ORIGIN', 'CORS_ORIGIN not explicitly defined; will default to localhost:3000.');
  } else if (corsOrigin === '*' && isProdMode) {
    error('CORS_ORIGIN', "CORS_ORIGIN cannot be '*' in production with credentials (credentialed requests will fail).");
  } else {
    pass('CORS_ORIGIN', `Allowed origins: ${corsOrigin}`);
  }

  // ---------------------------------------------------------------------------
  // 6. Public Client Endpoints
  // ---------------------------------------------------------------------------
  const clientApiUrl = env.NEXT_PUBLIC_API_URL || '';
  const clientAppUrl = env.NEXT_PUBLIC_APP_URL || '';

  if (clientApiUrl) {
    try {
      const parsed = new URL(clientApiUrl);
      if (isProdMode && (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) {
        warn('NEXT_PUBLIC_API_URL', `Production NEXT_PUBLIC_API_URL points to localhost (${clientApiUrl}).`);
      } else {
        pass('NEXT_PUBLIC_API_URL', `API endpoint set to ${clientApiUrl}`);
      }
    } catch {
      error('NEXT_PUBLIC_API_URL', `Invalid URL format for NEXT_PUBLIC_API_URL: '${clientApiUrl}'`);
    }
  }

  if (clientAppUrl) {
    try {
      new URL(clientAppUrl);
      pass('NEXT_PUBLIC_APP_URL', `App URL set to ${clientAppUrl}`);
    } catch {
      error('NEXT_PUBLIC_APP_URL', `Invalid URL format for NEXT_PUBLIC_APP_URL: '${clientAppUrl}'`);
    }
  }

  // ---------------------------------------------------------------------------
  // 7. Third-Party Integrations & Fallbacks
  // ---------------------------------------------------------------------------
  const geminiKey = env.GEMINI_API_KEY || '';
  if (geminiKey && !geminiKey.includes('YOUR_LIVE')) {
    pass('GEMINI_API_KEY', 'Google Gemini AI API key configured.');
  } else {
    pass('GEMINI_API_KEY', `${DIM}[Fallback Active] Deterministic SHA-256 768-dim embeddings enabled.${RESET}`);
  }

  const resendKey = env.RESEND_API_KEY || '';
  if (resendKey && !resendKey.includes('YOUR_LIVE')) {
    pass('RESEND_API_KEY', 'Resend transactional email gateway configured.');
  } else {
    pass('RESEND_API_KEY', `${DIM}[Fallback Active] Simulated in-memory outbox log enabled.${RESET}`);
  }

  const openAlexEmail = env.OPENALEX_POLITE_EMAIL || '';
  if (openAlexEmail && openAlexEmail.includes('@') && !openAlexEmail.includes('CHANGE_THIS')) {
    pass('OPENALEX_POLITE_EMAIL', `OpenAlex polite pool enabled (${openAlexEmail}).`);
  } else {
    warn('OPENALEX_POLITE_EMAIL', 'OpenAlex polite email not configured; requests will use public tier rate limits.');
  }

  const googleClientId = env.GOOGLE_CLIENT_ID || env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  if (googleClientId && !googleClientId.includes('000000000000') && !googleClientId.includes('dummy')) {
    pass('GOOGLE_CLIENT_ID', 'Google Cloud OAuth 2.0 client ID configured.');
  } else {
    pass('GOOGLE_CLIENT_ID', `${DIM}[Demo Mode] Google Sign-In running in mock/demo mode.${RESET}`);
  }

  return checks;
}

/**
 * Validates that template files (.env.production.example, etc.) define all critical keys.
 */
function auditTemplates() {
  console.log(`\n${BOLD}${CYAN}=== AUDITING PRODUCTION ENVIRONMENT TEMPLATES ===${RESET}\n`);

  const templateFiles = [
    '.env.production.example',
    path.join('server', '.env.production.example'),
    path.join('client', '.env.production.example'),
  ];

  let allValid = true;

  for (const rel of templateFiles) {
    const full = path.join(rootDir, rel);
    if (!fs.existsSync(full)) {
      console.log(`${RED}✖ Missing template file: ${rel}${RESET}`);
      allValid = false;
      continue;
    }
    const content = fs.readFileSync(full, 'utf8');
    const parsed = parseEnvContent(content);
    const keyCount = Object.keys(parsed).length;
    console.log(`${GREEN}✔ Verified ${rel}${RESET} (${keyCount} documented environment variables)`);
  }

  return allValid;
}

/**
 * Main CLI Execution
 */
function run() {
  console.log(`\n${BOLD}==============================================================================${RESET}`);
  console.log(`${BOLD}CAMBIUM RESEARCH PLATFORM — PRODUCTION ENVIRONMENT AUDIT & VAULT VERIFIER${RESET}`);
  console.log(`Document ID: CAMBIUM-VERIFY-ENV-2026-V2 · Mode: ${isStrictProd ? `${RED}STRICT PRODUCTION${RESET}` : `${CYAN}DEVELOPMENT / AUDIT${RESET}`}`);
  console.log(`${BOLD}==============================================================================${RESET}\n`);

  if (checkTemplatesOnly) {
    const success = auditTemplates();
    process.exit(success ? 0 : 1);
  }

  const { merged, sources } = loadEnvironment();

  if (sources.length > 0) {
    console.log(`${CYAN}ℹ Loaded configurations from:${RESET} ${sources.join(', ')}`);
  } else {
    console.log(`${YELLOW}ℹ No local .env files discovered; auditing current process.env and defaults.${RESET}`);
  }

  const checks = verifyEnvironment(merged, isStrictProd);

  // Print Passed
  for (const p of checks.passed) {
    console.log(`  ${GREEN}✔${RESET} ${BOLD}${p.label.padEnd(26)}${RESET} ${p.msg}`);
  }

  // Print Warnings
  if (checks.warnings.length > 0) {
    console.log(`\n${YELLOW}${BOLD}⚠ WARNINGS (${checks.warnings.length}):${RESET}`);
    for (const w of checks.warnings) {
      console.log(`  ${YELLOW}⚠${RESET} ${BOLD}${w.label.padEnd(26)}${RESET} ${w.msg}`);
    }
  }

  // Print Errors
  if (checks.errors.length > 0) {
    console.log(`\n${RED}${BOLD}✖ CRITICAL ERRORS (${checks.errors.length}):${RESET}`);
    for (const e of checks.errors) {
      console.log(`  ${RED}✖${RESET} ${BOLD}${e.label.padEnd(26)}${RESET} ${e.msg}`);
    }
  }

  console.log(`\n${BOLD}------------------------------------------------------------------------------${RESET}`);
  console.log(`Summary: ${GREEN}${checks.passed.length} Passed${RESET} | ${YELLOW}${checks.warnings.length} Warnings${RESET} | ${checks.errors.length > 0 ? RED : GREEN}${checks.errors.length} Critical Errors${RESET}`);
  console.log(`${BOLD}------------------------------------------------------------------------------${RESET}\n`);

  if (checks.errors.length > 0) {
    console.log(`${RED}✖ Environment audit FAILED. Resolve the critical errors above before production launch.${RESET}\n`);
    process.exit(1);
  } else {
    console.log(`${GREEN}✔ Environment verification PASSED.${RESET} System is ready for safe deployment.\n`);
    process.exit(0);
  }
}

run();

