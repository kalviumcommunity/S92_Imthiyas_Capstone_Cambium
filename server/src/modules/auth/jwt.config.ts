import type { IncomingMessage } from 'http';

export function getJwtSecret(): string {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim().length > 0) {
    return process.env.JWT_SECRET;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  return 'cambium_dev_jwt_secret_DO_NOT_USE_IN_PRODUCTION';
}

export function getJwtRefreshSecret(): string {
  if (process.env.JWT_REFRESH_SECRET && process.env.JWT_REFRESH_SECRET.trim().length > 0) {
    return process.env.JWT_REFRESH_SECRET;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_REFRESH_SECRET environment variable is required in production');
  }
  return 'cambium_dev_refresh_secret_DO_NOT_USE_IN_PRODUCTION';
}

export function parseCookieHeader(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  for (const part of cookieHeader.split(';')) {
    const eqIdx = part.indexOf('=');
    if (eqIdx <= 0) continue;
    const key = part.slice(0, eqIdx).trim();
    const rawValue = part.slice(eqIdx + 1).trim();
    if (key) {
      try {
        cookies[key] = decodeURIComponent(rawValue);
      } catch {
        cookies[key] = rawValue;
      }
    }
  }
  return cookies;
}

export function extractAccessTokenFromHeaders(
  headers: IncomingMessage['headers'] & Record<string, any>,
  cookiesObj?: Record<string, string>,
): string | null {
  const authHeader = headers?.authorization || headers?.Authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token) return token;
  }

  const cookies =
    cookiesObj && typeof cookiesObj === 'object'
      ? cookiesObj
      : parseCookieHeader(typeof headers?.cookie === 'string' ? headers.cookie : undefined);

  return cookies['cambium_access_token'] || cookies['cambium_token'] || null;
}
