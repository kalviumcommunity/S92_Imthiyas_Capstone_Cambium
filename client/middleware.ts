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

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const token = request.cookies.get("cambium_token")?.value;

  // 1. If accessing a protected route without a valid token -> Redirect to sign-in
  if (isProtected && !token) {
    const fullPath = pathname + (search || "");
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", fullPath);
    redirectUrl.searchParams.set("notice", "auth_required");
    return NextResponse.redirect(redirectUrl);
  }

  // 2. If visiting sign-in or sign-up with an active token -> Redirect to dashboard
  if ((pathname === "/sign-in" || pathname === "/sign-up") && token) {
    const destination = request.nextUrl.searchParams.get("redirect") || "/dashboard";
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
