import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected research operating system routes requiring active credentials
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/workspace",
  "/graph",
  "/intelligence",
  "/profile",
  "/settings",
  "/community",
  "/publications",
  "/lab",
  "/data-management",
  "/compliance",
  "/audit",
  "/peer-review",
  "/opportunities",
  "/grants",
  "/portfolio",
  "/bookmarks",
  "/messages",
  "/notifications",
  "/reader",
  "/agent-reader",
  "/os",
];

/**
 * Validates that a post-login redirect path stays strictly internal (blocks //evil.com, /\evil.com, https://).
 */
export function sanitizeInternalRedirect(raw: string | null): string {
  if (!raw || typeof raw !== "string") return "/dashboard";
  const trimmed = raw.trim();
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\") ||
    /[\r\n\0]/.test(trimmed)
  ) {
    return "/dashboard";
  }
  return trimmed;
}

/**
 * Verifies token has 3 JWT segments and non-expired exp claim on Edge (full HMAC verified by backend).
 */
function hasUnexpiredJwtShape(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { exp?: number; type?: string };
    if (payload.type && payload.type !== "access") return false;
    if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const rawToken = request.cookies.get("cambium_token")?.value;
  const hasValidToken = hasUnexpiredJwtShape(rawToken);

  // 1. If accessing a protected route without a structurally valid, unexpired token -> Redirect to sign-in
  if (isProtected && !hasValidToken) {
    const fullPath = sanitizeInternalRedirect(pathname + (search || ""));
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", fullPath);
    redirectUrl.searchParams.set("notice", "auth_required");
    const res = NextResponse.redirect(redirectUrl);
    if (rawToken) {
      res.cookies.delete("cambium_token");
    }
    return res;
  }

  // 2. If visiting sign-in or sign-up with a valid token -> Redirect safely inside origin
  if ((pathname === "/sign-in" || pathname === "/sign-up") && hasValidToken) {
    const destination = sanitizeInternalRedirect(request.nextUrl.searchParams.get("redirect"));
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/workspace/:path*",
    "/graph/:path*",
    "/intelligence/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/community/:path*",
    "/publications/:path*",
    "/lab/:path*",
    "/data-management/:path*",
    "/compliance/:path*",
    "/audit/:path*",
    "/peer-review/:path*",
    "/opportunities/:path*",
    "/grants/:path*",
    "/portfolio/:path*",
    "/bookmarks/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/reader/:path*",
    "/agent-reader/:path*",
    "/os/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
