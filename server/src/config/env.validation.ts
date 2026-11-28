export interface EnvValidationResult {
  valid: boolean;
  environment: string;
  errors: string[];
  warnings: string[];
}

const PLACEHOLDER_PATTERN =
  /replace_with|change_this|your_live_|example|changeme|dev_secret|ci_test/i;

/**
 * Validates required runtime configuration without logging secret values.
 * Fails fast in production when critical security or database settings are missing.
 */
export function validateStartupEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): EnvValidationResult {
  const environment = env.NODE_ENV || 'development';
  const isProd = environment === 'production';
  const errors: string[] = [];
  const warnings: string[] = [];

  const checkSecret = (name: string, minLength: number) => {
    const val = env[name];
    if (!val || val.trim().length === 0) {
      if (isProd) {
        errors.push(`Missing required production environment variable: ${name}`);
      } else {
        warnings.push(`${name} is unset in ${environment} mode`);
      }
      return;
    }

    if (isProd && PLACEHOLDER_PATTERN.test(val)) {
      errors.push(`${name} appears to contain an example/placeholder value in production`);
    } else if (isProd && val.trim().length < minLength) {
      errors.push(`${name} must be at least ${minLength} characters in production`);
    }
  };

  checkSecret('JWT_SECRET', 32);
  checkSecret('JWT_REFRESH_SECRET', 32);

  const hasDatabaseUrl = Boolean(env.DATABASE_URL && env.DATABASE_URL.trim().length > 0);
  const hasDiscretePg = Boolean(env.POSTGRES_HOST && env.POSTGRES_DB && env.POSTGRES_USER);
  if (!hasDatabaseUrl && !hasDiscretePg) {
    if (isProd) {
      errors.push('Missing database configuration: set DATABASE_URL or POSTGRES_HOST/POSTGRES_DB/POSTGRES_USER');
    } else {
      warnings.push('No DATABASE_URL or discrete POSTGRES_* config detected; falling back to local defaults');
    }
  }

  if (isProd && env.DB_SYNCHRONIZE === 'true') {
    errors.push('DB_SYNCHRONIZE=true is forbidden in production; use versioned SQL migrations');
  }

  if (isProd && (!env.CORS_ORIGIN || env.CORS_ORIGIN.trim() === '*')) {
    errors.push('CORS_ORIGIN must be an explicit origin allowlist in production (wildcard * is forbidden)');
  }

  if (errors.length > 0) {
    throw new Error(
      `[Cambium Startup Validation] Invalid ${environment} configuration:\n- ${errors.join('\n- ')}`,
    );
  }

  return {
    valid: true,
    environment,
    errors,
    warnings,
  };
}
