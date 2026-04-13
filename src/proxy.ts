import { type NextRequest, NextResponse } from "next/server";

// No auth check — always accessible
const OPEN_PATHS = ["/", "/statistics"];

// Redirect to dashboard if already has a session
const AUTH_PAGES = ["/auth/signin", "/auth/signup"];

/**
 * The proxy only checks cookie *presence*, not validity.
 * Actual token validation and refresh are handled client-side by apiFetch.
 * Doing a server-side refresh here would race with the client-side refresh,
 * causing token rotation conflicts (revoked token → redirect to signin).
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (OPEN_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const hasAccessToken = request.cookies.has("access_token");
  const hasRefreshToken = request.cookies.has("refresh_token");
  const hasSession = hasAccessToken || hasRefreshToken;

  // Auth pages — redirect to dashboard only if access_token is present and not expired.
  // Checking refresh_token alone is not enough: it may be revoked in the DB,
  // which would cause a redirect loop (dashboard → 401 → signin → redirect → dashboard…).
  if (AUTH_PAGES.includes(pathname)) {
    if (hasAccessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected pages — redirect only if no session at all
  if (!hasSession) {
    const redirectUrl = new URL("/auth/signin", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/statistics",
    "/dashboard",
    "/game/:path*",
    "/statistics/me",
    "/friends",
  ],
};
